import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud import tasks as task_crud


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