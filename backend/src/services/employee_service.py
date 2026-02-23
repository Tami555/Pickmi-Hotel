import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from crud import employees as employee_crud, positions as position_crud, users as user_crud
from schemas import UserCreate, EmployeeCreate, UserUpdate, EmployeeUpdate
from models.users import Role, User
from models.employees import EmployeeStatus
from exceptions import EmailAlreadyExistsError, PhoneAlreadyExistsError, PassportAlreadyExistsError, PositionNotFoundError, EmployeeNotFoundError
from core.auth import hashed_password


async def get_employee_by_id(employee_id: int, session: AsyncSession):
    employee = await employee_crud.get_employee_by_id(employee_id, session)
    if not employee:
        raise EmployeeNotFoundError()
    return employee


async def registration_employee(
    user_data: UserCreate,
    employee_data: EmployeeCreate,
    session: AsyncSession
) -> User:
    """ Регистрация сотрудника """
    # Проверяем уникальность пользователя
    if await user_crud.get_user_by_email(user_data.email, session):
        raise EmailAlreadyExistsError()
    
    if await user_crud.get_user_by_phone(user_data.phone, session):
        raise PhoneAlreadyExistsError()
    
    if await user_crud.get_user_by_passport(user_data.passport_series, user_data.passport_number, session):
        raise PassportAlreadyExistsError()
    
    # Проверяем должность
    position = await position_crud.get_position_by_id(employee_data.position_id, session)
    if not position:
        raise PositionNotFoundError(employee_data.position_id)
    
    # Создаём пользователя
    user_dict = user_data.model_dump()
    user_dict["password"] = hashed_password(user_dict["password"])
    user_dict["role"] = Role.EMPLOYEE
    
    new_user = await user_crud.create_user(user_dict, session)
    
    # Создаём сотрудника
    employee_dict = employee_data.model_dump()
    employee_dict["user_id"] = new_user.id
    employee_dict["hire_date"] = datetime.datetime.now().date()
    new_employee = await employee_crud.create_employee(employee_dict, session)
    
    return await get_employee_by_id(new_employee.id, session)


async def update_employee_partial_by_id(
    employee_id: int,
    user_data: UserUpdate,
    employee_data: EmployeeUpdate,
    session: AsyncSession
) -> User:
    """ Обновление сотрудника """

    employee = await get_employee_by_id(employee_id, session)
    
    dump_data_user = user_data.model_dump(exclude_unset=True)
    dump_data_employee = employee_data.model_dump(exclude_unset=True)
    
    # проверяем пользовательские данные
    if user_data.phone and user_data.phone != employee.user.phone and\
            await user_crud.get_user_by_phone(user_data.phone, session):
        raise PhoneAlreadyExistsError()
    
    if user_data.email and user_data.email != employee.user.email and\
            await user_crud.get_user_by_email(user_data.email, session):
        raise EmailAlreadyExistsError()
    
    if (user_data.passport_series or user_data.passport_number) and\
            (user_data.passport_series != employee.user.passport_series or
             user_data.passport_number != employee.user.passport_number) and\
            await user_crud.get_user_by_passport(user_data.passport_series, user_data.passport_number, session):
        raise PassportAlreadyExistsError()
    
    # Проверяем данные для сотрудника
    if employee_data.position_id is not None:
        position = await position_crud.get_position_by_id(employee_data.position_id, session)
        if not position:
            raise PositionNotFoundError(employee_data.position_id)
        else:
            dump_data_employee["position"] = position
    
    # Проверка на увольнение
    if employee_data.status and employee_data.status != employee.status:
        dump_data_employee["fired_date"] = datetime.datetime.now() if employee_data.status == EmployeeStatus.FIRED else None
    # Дата обновления
    dump_data_user["updated_at"] = datetime.datetime.now()
    
    await user_crud.update_user(user_data=dump_data_user, user=employee.user, session=session)
    await employee_crud.update_employee(employee_data=dump_data_employee, employee=employee, session=session)
    return await get_employee_by_id(employee.id, session)
    
