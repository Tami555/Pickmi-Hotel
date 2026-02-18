from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from models import Employee


async def get_employee_by_id(employee_id: int, session: AsyncSession) -> Employee | None:
    """ Получение сотрудника по id"""
    stmt = select(Employee).options(joinedload(Employee.user), joinedload(Employee.position)).\
        where(Employee.id == employee_id)
    employee = await session.scalar(stmt)
    return employee


async def create_employee(employee_data: dict, session: AsyncSession) -> Employee:
    """ Создание сотрудника """
    new_employee = Employee(**employee_data)
    session.add(new_employee)
    await session.commit()
    return new_employee
