from datetime import datetime, timedelta
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Employee, Task
from src.models.enums import EmployeeStatus, TaskStatus


async def cleanup_fired_employees(session: AsyncSession, fired_time: timedelta = timedelta(days=2)):
    """ Удаление сотрудников, которые были уволены некий промежуток назад """
    time_ago = datetime.now() - fired_time
    stmt = select(Employee).options(joinedload(Employee.user)).where(
        Employee.status == EmployeeStatus.FIRED,
        Employee.fired_date <= time_ago
    )
    employees_to_delete = await session.execute(stmt)
    
    for employee in employees_to_delete.scalars():
        await session.delete(employee)
        await session.delete(employee.user)
    
    await session.commit()


async def get_all_employees(session: AsyncSession) -> list[Employee]:
    """Возвращает всех сотрудников"""
    await cleanup_fired_employees(session) # чистка уволенных
    stmt = select(Employee).order_by(Employee.id)
    result = await session.execute(stmt)
    return result.scalars().all()


async def get_employees(session: AsyncSession) -> list[Employee]:
    """ Получение всех сотрудников"""
    await cleanup_fired_employees(session) # чистка уволенных
    stmt = select(Employee).options(joinedload(Employee.user), joinedload(Employee.position))
    employees = await session.scalars(stmt)
    return list(employees)


async def get_employee_by_id(employee_id: int, session: AsyncSession) -> Employee | None:
    """ Получение сотрудника по id"""
    await cleanup_fired_employees(session) # чистка уволенных
    stmt = select(Employee).options(
            joinedload(Employee.user),
            joinedload(Employee.position)
        ).where(Employee.id == employee_id)
    employee = await session.scalar(stmt)
    return employee


async def create_employee(employee_data: dict, session: AsyncSession) -> Employee:
    """ Создание сотрудника """
    new_employee = Employee(**employee_data)
    session.add(new_employee)
    await session.commit()
    return new_employee


async def update_employee(employee_data: dict, employee: Employee, session: AsyncSession) -> Employee:
    """Обновление сотрудника """
    for attr, value in employee_data.items():
        setattr(employee, attr, value)
    await session.commit()
    return employee


async def get_employee_with_details(employee_id: int, session: AsyncSession) -> Employee | None:
    """Возвращает сотрудника с загруженными связями"""
    stmt = (
        select(Employee)
        .options(
            joinedload(Employee.user),
            joinedload(Employee.position),
            selectinload(Employee.tasks)
        )
        .where(Employee.id == employee_id)
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def get_employees_with_positions(session: AsyncSession) -> list[Employee]:
    """Возвращает сотрудников с должностями"""
    stmt = (
        select(Employee)
        .options(
            selectinload(Employee.user),
            selectinload(Employee.position)
        )
        .where(Employee.status != EmployeeStatus.FIRED)
        .order_by(Employee.id)
    )
    result = await session.execute(stmt)
    return result.scalars().all()


async def get_employee_of_the_month(
    session: AsyncSession,
    month: int,
    year: int
) -> Employee | None:
    """ Определяет сотрудника месяца по количеству выполненных задач """
    
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)
    
    task_subquery = (
        select(
            Task.employee_id,
            func.count(Task.id).label('task_count')
        )
        .where(Task.status == TaskStatus.COMPLETED)
        .where(Task.completed_at >= start_date)
        .where(Task.completed_at < end_date)
        .group_by(Task.employee_id)
        .subquery()
    )
    
    stmt = (
        select(Employee)
        .join(task_subquery, Employee.id == task_subquery.c.employee_id)
        .options(
            joinedload(Employee.user),
            joinedload(Employee.position)
        )
        .order_by(task_subquery.c.task_count.desc())
        .limit(1)
    )
    
    result = await session.execute(stmt)
    return result.scalar_one_or_none()