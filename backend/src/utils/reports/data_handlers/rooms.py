import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud import reservations as reservations_crud, room_types as room_types_crud, users as users_crud


async def get_monthly_bookings(
    session: AsyncSession,
    year: int | None = None
) -> dict:
    """ Обрабатывает данные по броням по месяцам """
    raw_data = await reservations_crud.get_reservations_by_month(session, year)
    
    if year is None:
        year = datetime.datetime.now().year
    
    months_data = {month: 0 for month in range(1, 13)}
    for month_num, count in raw_data:
        months_data[int(month_num)] = count
    
    # Преобразуем в список для графика
    chart_data = []
    month_names = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
                   'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
    
    for month in range(1, 13):
        chart_data.append({
            'label': month_names[month - 1],
            'value': months_data[month],
            'month_num': month
        })
    
    # пиковые месяцы
    max_value = max(months_data.values())
    peak_months = [
        month_names[month - 1] 
        for month, count in months_data.items() 
        if count == max_value and count > 0
    ]
    
    return {
        'chart_data': chart_data,
        'year': year,
        'total_bookings': sum(months_data.values()),
        'peak_months': peak_months,
        'peak_value': max_value,
        'avg_monthly': round(sum(months_data.values()) / 12, 1)
    }


async def get_room_types_popularity(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> dict:
    """ Обрабатывает данные по популярности типов номеров """
    raw_data = await room_types_crud.get_popular_room_types(session, start_date, end_date)
    
    if not raw_data:
        return {
            'chart_data': [],
            'most_popular': None,
            'least_popular': None,
            'total_bookings': 0,
            'room_types_count': 0
        }
    
    chart_data = []
    total_bookings = 0
    
    for title, slug, count in raw_data:
        chart_data.append({
            'label': title,
            'value': count,
            'slug': slug
        })
        total_bookings += count
    
    most_popular = chart_data[0] if chart_data else None
    least_popular = chart_data[-1] if chart_data else None

    room_types_count = await room_types_crud.get_room_types_count(session)
    return {
        'chart_data': chart_data,
        'most_popular': most_popular,
        'least_popular': least_popular,
        'total_bookings': total_bookings,
        'room_types_count': room_types_count
    }


async def get_top_clients_data(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> dict:
    """ Обрабатывает данные по топ клиентам """
    raw_data = await users_crud.get_top_users(session, 3, start_date, end_date)
    
    clients = []
    total_bookings_all = 0
    
    for i, row in enumerate(raw_data, 1):
        full_name = f"{row.first_name} {row.last_name}"
        clients.append({
            'rank': i,
            'full_name': full_name,
            'email': row.email,
            'phone': row.phone,
            'bookings_count': row.bookings_count,
            'total_spent': row.total_spent or 0
        })
        total_bookings_all += row.bookings_count
    
    return {
        'clients': clients,
        'total_bookings': total_bookings_all,
        'has_data': len(clients) > 0
    }


async def get_rooms_summary_stats(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> dict:
    """ Собирает всю статистику по номерам в одном месте """
    total_stats = await reservations_crud.get_total_stats(session, start_date, end_date)
    monthly_data = await get_monthly_bookings(session)
    popularity_data = await get_room_types_popularity(session, start_date, end_date)
    top_clients_data = await get_top_clients_data(session, start_date, end_date)
    
    return {
        'total_stats': total_stats,
        'monthly_data': monthly_data,
        'popularity_data': popularity_data,
        'top_clients': top_clients_data
    }