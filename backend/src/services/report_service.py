import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from src.utils.pdf_generator import generate_pdf_from_html
from src.utils.reports import (
    create_pie_chart, create_bar_chart, create_horizontal_bar_chart,
    get_period_string, add_css_paths_to_context
)
from src.utils.reports.data_handlers import (
    get_popular_services, get_room_type_stats, get_positions_services,
    get_employee_activity_data, get_detailed_employee_stats,
    get_employees_salary_data, get_employee_of_month_data, get_rooms_summary_stats
)


COLORS = {
    'purple_deep': '#6A4163',
    'pink_rose': '#D46A92',
    'pink_soft': '#F39DB6',
    'pink_peach': '#F6D2D6',
    'white_creamy': '#FEFAF9'
}


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

    pdf_bytes = await generate_pdf_from_html('services_report.html', context)
    return pdf_bytes


async def generate_employees_report(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> bytes:
    """ Генерирует отчет по сотрудникам """

    activity_data = await get_employee_activity_data(session, start_date, end_date)
    detailed_stats = await get_detailed_employee_stats(session, start_date, end_date)
    salary_data = await get_employees_salary_data(session)
    employee_of_month = await get_employee_of_month_data(
        session, activity_data, salary_data, start_date, end_date
    )
    
    # Создаем диаграммы
    activity_chart = None
    if activity_data['chart_data']:
        top_10_data = activity_data['chart_data'][:10]
        activity_chart = create_bar_chart(
            data=top_10_data,
            title='Активность сотрудников (топ-10)',
            x_label='Сотрудник',
            y_label='Количество выполненных задач',
            figsize=(12, 7)
        )
    
    efficiency_data = []
    if detailed_stats:
        for stat in detailed_stats[:8]:
            name_parts = stat['full_name'].split()
            short_name = name_parts[0]
            if len(name_parts) > 1:
                short_name += ' ' + name_parts[1][0] + '.'
            
            efficiency_data.append({
                'label': short_name,
                'value': stat['efficiency']
            })
    
    efficiency_chart = None
    if efficiency_data:
        efficiency_chart = create_horizontal_bar_chart(
            data=efficiency_data,
            title='Эффективность сотрудников (%)',
            x_label='Процент выполненных задач',
            y_label='Сотрудник',
            figsize=(10, 6)
        )
    
    # контекст для шаблона
    context = {
        'title': 'Отчет по сотрудникам Pickmi Отеля ',
        'date': datetime.datetime.now().strftime('%d.%m.%Y %H:%M'),
        'period': get_period_string(start_date, end_date),
        'activity_chart': activity_chart,
        'efficiency_chart': efficiency_chart,
        'total_employees': salary_data['total_count'],
        'total_completed_tasks': activity_data['total_completed'],
        'avg_tasks_per_employee': activity_data['avg_per_employee'],
        'total_salary_fund': salary_data['total_salary'],
        'avg_salary': salary_data['avg_salary'],
        'employee_of_month': employee_of_month,
        'detailed_stats': detailed_stats[:15],
        'salary_data': salary_data['employees'],
        'colors': COLORS
    }
    context = add_css_paths_to_context("employees_style.css", context)
    
    pdf_bytes = await generate_pdf_from_html('employees_report.html', context)
    return pdf_bytes


async def generate_rooms_report(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> bytes:
    """Генерирует отчет по номерам и бронированиям"""
    
    stats = await get_rooms_summary_stats(session, start_date, end_date)
    
    # Создаем график бронирований по месяцам
    bookings_chart = None
    if stats['monthly_data']['chart_data']:
        bookings_chart = create_bar_chart(
            data=stats['monthly_data']['chart_data'],
            title=f'Динамика бронирований за {stats["monthly_data"]["year"]} год',
            x_label='Месяц',
            y_label='Количество броней',
            figsize=(12, 6)
        )
    
    # популярность типов номеров
    room_types_chart = None
    if stats['popularity_data']['chart_data']:
        room_types_chart = create_pie_chart(
            data=stats['popularity_data']['chart_data'],
            title='Популярность типов номеров',
            figsize=(10, 8)
        )
    
    #  контекст для шаблона
    context = {
        'title': 'Отчет по номерам Pickmi Отеля',
        'date': datetime.datetime.now().strftime('%d.%m.%Y %H:%M'),
        'period': get_period_string(start_date, end_date),
        'bookings_chart': bookings_chart,
        'room_types_chart': room_types_chart,
        'total_bookings': stats['total_stats']['total_bookings'],
        'total_revenue': stats['total_stats']['total_revenue'],
        'avg_booking_value': stats['total_stats']['avg_booking_value'],
        'monthly_data': stats['monthly_data']['chart_data'],
        'peak_months': stats['monthly_data']['peak_months'],
        'peak_value': stats['monthly_data']['peak_value'],
        'avg_monthly': stats['monthly_data']['avg_monthly'],
        'year': stats['monthly_data']['year'],
        'popularity_data': stats['popularity_data']['chart_data'],
        'most_popular': stats['popularity_data']['most_popular'],
        'least_popular': stats['popularity_data']['least_popular'],
        'room_types_count': stats['popularity_data']['room_types_count'],
        'top_clients': stats['top_clients']['clients'],
        'top_clients_total': stats['top_clients']['total_bookings'],
        'colors': COLORS
    }
    
    context = add_css_paths_to_context("rooms_style.css", context)
    
    pdf_bytes = await generate_pdf_from_html('rooms_report.html', context)
    return pdf_bytes