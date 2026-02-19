from sqlalchemy.ext.asyncio import AsyncSession
from crud.users import get_user_by_email, get_user_by_phone, get_user_by_passport, create_user
from exceptions import EmailAlreadyExistsError, PhoneAlreadyExistsError, PassportAlreadyExistsError, InvalidUserCredentialsError
from core.auth import hashed_password
from schemas import UserCreate, LoginUser
from models.users import User, Role
from core.auth import checked_password


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


async def login_user(
        user: LoginUser,
        session: AsyncSession
) -> User:
    """ Авторизация пользователя """
    auth_user = await get_user_by_email(user.email, session)
    if auth_user is None or not checked_password(user.password, auth_user.password):
        raise InvalidUserCredentialsError()
    return auth_user


