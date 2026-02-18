from sqlalchemy.ext.asyncio import AsyncSession
from crud.users import get_user_by_email, get_user_by_phone, get_user_by_passport, create_user
from exceptions import EmailAlreadyExistsError, PhoneAlreadyExistsError, PassportAlreadyExistsError
from core.auth import hashed_password
from schemas import UserCreate
from models.users import User, Role


async def registration_user(
        user: UserCreate,
        role_type: Role,
        session: AsyncSession
) -> User:
    """ Регистрация пользователя """

    # Проверяем уникальность пользователя
    if await get_user_by_email(user.email, session):
        raise EmailAlreadyExistsError()
        
    if await get_user_by_phone(user.phone, session):
        raise PhoneAlreadyExistsError()
        
    if await get_user_by_passport(user.passport_series, user.passport_number, session):
        raise PassportAlreadyExistsError()
             
    user_data = user.model_dump()
    user_data["password"] = hashed_password(user.password)
    user_data["role"] = role_type

    new_user = await create_user(user_data, session)
    return new_user
