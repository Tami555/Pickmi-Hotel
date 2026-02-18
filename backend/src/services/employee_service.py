from sqlalchemy.ext.asyncio import AsyncSession
from crud import employees as employee_crud, positions as position_crud, users as user_crud
from schemas import UserCreate, EmployeeCreate
from models.users import Role, User
from exceptions import EmailAlreadyExistsError, PhoneAlreadyExistsError, PassportAlreadyExistsError, PositionNotFoundError
from core.auth import hashed_password


async def registration_employee(
    user_data: UserCreate,
    employee_data: EmployeeCreate,
    session: AsyncSession
) -> User:
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
    new_employee = await employee_crud.create_employee(employee_dict, session)
    
    return await employee_crud.get_employee_by_id(new_employee.id, session)
