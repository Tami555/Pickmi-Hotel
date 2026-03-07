import datetime
from sqlalchemy import select, update, func
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Task, Employee, Reservation, User, Services, Rooms, RoomTypes
from src.models.enums import TaskStatus


async def get_task_by_id(id_task: int, session: AsyncSession) -> Task | None:
    """Получение задачи (заказанной услиги) по id"""
    stmt = select(Task).options(
        joinedload(Task.service),
        joinedload(Task.reservation),
        joinedload(Task.employee),
    ).where(Task.id == id_task)

    task = await session.scalar(stmt)
    return task


async def get_tasks_by_employee(id_employee: int, session: AsyncSession) -> list[Task] | None:
    """Получение задачь сотрудника по его id"""
    stmt = select(Task).options(
        joinedload(Task.service),
        joinedload(Task.reservation),
    ).join(Task.employee).where(Employee.id == id_employee)

    task = await session.scalars(stmt)
    return task


async def get_tasks_by_guest(id_guest: int, session: AsyncSession) -> list[Task] | None:
    """Получение заказанных услуг (задач) гостя по его id"""
    stmt = select(Task).\
        options(joinedload(Task.service)).\
            join(Task.reservation).\
                join(Reservation.user).\
        where(User.id == id_guest)

    task = await session.scalars(stmt)
    return task


async def create_task(
    task_data: dict,
    session: AsyncSession
) -> Task:
    """Создание задачи по заказанной услуге """
    task = Task(**task_data)
    session.add(task)
    await session.commit()
    return task


async def update_task_status_by_id(task_id: int, status: TaskStatus,  session: AsyncSession):
    """Обновление статуса задачи по id """
    now_date = datetime.datetime.now()
    stmt = update(Task).where(Task.id == task_id)\
        .values(
            status = status,
            started_at=now_date if status is TaskStatus.IN_PROGRESS else Task.started_at,
            completed_at=now_date if status is TaskStatus.COMPLETED else Task.completed_at,
            updated_at=now_date
        )
    await session.execute(stmt)
    await session.commit()


async def get_services_popularity(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None,
    limit: int = 10
) -> list[dict]:
    """
    Получает статистику популярности услуг
    Возвращает список словарей с названием услуги и количеством выполненных заказов
    """
    query = (
        select(
            Services.title,
            Services.slug,
            func.count(Task.id).label('order_count')
        )
        .join(Task, Task.service_id == Services.id)
        .where(Task.status == TaskStatus.COMPLETED)
    )
    # Фильтр по дате
    if start_date:
        query = query.where(Task.created_at >= start_date)
    if end_date:
        query = query.where(Task.created_at <= end_date)
    
    query = (
        query.group_by(Services.id, Services.title, Services.slug)
        .order_by(func.count(Task.id).desc())
        .limit(limit)
    )
    
    result = await session.execute(query)
    return [{"title": title, "slug": slug, "count": count} for title, slug, count in result.all()]


async def get_services_by_room_type(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> list[dict]:
    """
    Получает статистику услуг по типам номеров
    Возвращает список с информацией о том, какие услуги чаще всего заказывают в каждом типе номеров
    """
    
    query = (
        select(
            RoomTypes.title.label('room_type'),
            Services.title.label('service_name'),
            func.count(Task.id).label('order_count')
        )
        .select_from(Task)  # Явно указываем начальную таблицу
        .join(Reservation, Task.reservation_id == Reservation.id)  # Явно указываем условие JOIN
        .join(Rooms, Reservation.room_id == Rooms.id)
        .join(RoomTypes, Rooms.room_type_id == RoomTypes.id)
        .join(Services, Task.service_id == Services.id)
        .where(Task.status == TaskStatus.COMPLETED)
    )
    
    if start_date:
        query = query.where(Task.created_at >= start_date)
    if end_date:
        query = query.where(Task.created_at <= end_date)
    
    query = query.group_by(RoomTypes.id, RoomTypes.title, Services.id, Services.title)
    
    result = await session.execute(query)
    rows = result.all()
    
    # Группируем по типам номеров
    room_type_stats = {}
    for row in rows:  # Изменено: используем row вместо распаковки
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