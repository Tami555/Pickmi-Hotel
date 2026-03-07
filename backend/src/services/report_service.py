import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud import tasks as task_crud, positions as position_crud
from src.utils.pdf_generator import generate_pdf_from_html
from src.utils.reports import create_pie_chart, create_bar_chart, get_period_string, add_css_paths_to_context


COLORS = {
    'purple_deep': '#6A4163',
    'pink_rose': '#D46A92',
    'pink_soft': '#F39DB6',
    'pink_peach': '#F6D2D6',
    'white_creamy': '#FEFAF9'
}


async def get_popular_services(
        session: AsyncSession,
        start_date: datetime.datetime | None,
        end_date: datetime.datetime | None
) -> list[dict]:
    """Получаем данные по популярности услуг"""
    raw_data = await task_crud.get_services_popularity(session, start_date, end_date)
    return [
        {"title": title, "slug": slug, "count": count}
        for title, slug, count in raw_data
    ]


async def get_room_type_stats(
        session: AsyncSession,
        start_date: datetime.datetime | None,
        end_date: datetime.datetime | None
) -> list[dict]:
    """ Получаем топ-услуги по типам номеров """

    raw_data = await task_crud.get_services_by_room_type(session, start_date, end_date)

    # Группируем по типам номеров
    room_type_stats = {}
    for row in raw_data:
        room_type = row.room_type
        service_name = row.service_name
        count = row.order_count
        
        if room_type not in room_type_stats:
            room_type_stats[room_type] = []
        room_type_stats[room_type].append({
            'service': service_name,
            'count': count
        })
    # Для каждого типа номера находим самую популярную услугу
    result_data = []
    for room_type, services in room_type_stats.items():
        services.sort(key=lambda x: x['count'], reverse=True)
        total_orders = sum(s['count'] for s in services)
        
        result_data.append({
            'room_type': room_type,
            'total_orders': total_orders,
            'services': services[:5],  # Топ-5 услуг
            'most_popular': services[0]['service'] if services else None,
            'most_popular_count': services[0]['count'] if services else 0
        })
    # Сортируем по общему количеству заказов
    result_data.sort(key=lambda x: x['total_orders'], reverse=True)
    return result_data


async def get_positions_services(session: AsyncSession) -> list[dict]:
    """Получаем данные по должностям и их услугам"""
    positions = await position_crud.get_positions_with_services_raw(session)

    return [
        {
            'id': pos.id,
            'title': pos.title,
            'description': pos.description,
            'services': [
                {
                    'id': service.id,
                    'title': service.title,
                    'slug': service.slug,
                    'price': service.price
                }
                for service in pos.services
            ]
        }
        for pos in positions
    ]


async def generate_services_report(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> bytes:
    """Генерирует отчет по услугам"""

    popular_services = await get_popular_services(session, start_date, end_date)
    room_type_stats = await get_room_type_stats(session, start_date, end_date)
    positions_services = await get_positions_services(session)
    
    # Создаем графики
    pie_chart = None
    bar_chart = None
    
    if popular_services:
        pie_data = [{'label': s['title'], 'value': s['count']} for s in popular_services]
        pie_chart = create_pie_chart(
            data=pie_data,
            title='Популярные услуги'
        )
    
    if room_type_stats:
        bar_data = [{'label': stat['room_type'], 'value': stat['total_orders']} 
                   for stat in room_type_stats[:6]]
        bar_chart = create_bar_chart(
            data=bar_data,
            title='Заказы услуг по типам номеров',
            x_label='Тип номера',
            y_label='Количество заказов'
        )
    
    # контекст для шаблона
    context = {
        'title': 'Отчет по услугам Pickmi Отеля',
        'date': datetime.datetime.now().strftime('%d.%m.%Y %H:%M'),
        'period': get_period_string(start_date, end_date),
        'popular_services': popular_services,
        'popularity_chart': pie_chart,
        'room_type_stats': room_type_stats,
        'room_type_chart': bar_chart,
        'positions_services': positions_services,
        'colors': COLORS,
        'total_services': sum(s['count'] for s in popular_services) if popular_services else 0,
        'unique_services': len(popular_services) if popular_services else 0
    }
    
    context = add_css_paths_to_context("services_style.css", context)
    
    #  Генерируем PDF
    pdf_bytes = await generate_pdf_from_html('services_report.html', context)
    return pdf_bytes