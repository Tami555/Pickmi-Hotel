import datetime
from sqlalchemy import select, update, func, case
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Task, Employee, Reservation, User, Services, Rooms, RoomTypes, Position
from src.models.enums import TaskStatus, EmployeeStatus


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


async def get_completed_tasks_count_by_employee(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> list[tuple]:
    """ Возвращает количество выполненных задач по каждому сотруднику """
    query = (
        select(
            Employee.id,
            User.first_name,
            User.last_name,
            Position.title.label('position'),
            func.count(Task.id).label('completed_tasks')
        )
        .select_from(Task)
        .join(Employee, Task.employee_id == Employee.id)
        .join(User, Employee.user_id == User.id)
        .join(Position, Employee.position_id == Position.id)
        .where(Task.status == TaskStatus.COMPLETED)
    )
    
    if start_date:
        query = query.where(Task.completed_at >= start_date)
    if end_date:
        query = query.where(Task.completed_at <= end_date)
    
    query = (
        query.group_by(Employee.id, User.id, Position.id)
        .order_by(func.count(Task.id).desc())
    )
    
    result = await session.execute(query)
    return result.all()


async def get_employee_performance_stats(
    session: AsyncSession,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> list[tuple]:
    """
    Возвращает расширенную статистику по сотрудникам:
    - общее количество задач
    - среднее время выполнения
    - количество отмененных задач
    """    
    # Вычисляем время выполнения задачи (в часах)
    time_diff = func.extract('epoch', Task.completed_at - Task.started_at) / 3600
    
    query = (
        select(
            Employee.id,
            User.first_name,
            User.last_name,
            Position.title.label('position'),
            func.count(Task.id).label('total_tasks'),
            func.count(case((Task.status == TaskStatus.COMPLETED, Task.id))).label('completed_tasks'),
            func.count(case((Task.status == TaskStatus.CANCELED, Task.id))).label('canceled_tasks'),
            func.avg(
                case(
                    (Task.status == TaskStatus.COMPLETED, time_diff),
                    else_=None
                )
            ).label('avg_completion_time_hours')
        )
        .select_from(Employee)
        .outerjoin(Task, Task.employee_id == Employee.id)
        .join(User, Employee.user_id == User.id)
        .join(Position, Employee.position_id == Position.id)
        .where(Employee.status != EmployeeStatus.FIRED)
    )
    
    if start_date:
        query = query.where(Task.created_at >= start_date)
    if end_date:
        query = query.where(Task.created_at <= end_date)
    
    query = query.group_by(Employee.id, User.id, Position.id)
    
    result = await session.execute(query)
    return result.all()