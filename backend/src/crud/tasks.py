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
) -> list[tuple]:
    """ Возвращает данные по популярности услуг """
    query = (
        select(
            Services.title,
            Services.slug,
            func.count(Task.id).label('order_count')
        )
        .join(Task, Task.service_id == Services.id)
        .where(Task.status == TaskStatus.COMPLETED)
    )
    
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
    return result.all() 


async def get_services_by_room_type(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> list[tuple]:
    """ Возвращает данные по услугам в разрезе типов номеров """
    query = (
        select(
            RoomTypes.title.label('room_type'),
            Services.title.label('service_name'),
            func.count(Task.id).label('order_count')
        )
        .select_from(Task)
        .join(Reservation, Task.reservation_id == Reservation.id)
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
    return result.all()