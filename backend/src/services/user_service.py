import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from crud.users import get_user_by_email, get_user_by_phone, get_user_by_passport, create_user, update_user, get_user_by_id
from exceptions import (EmailAlreadyExistsError, PhoneAlreadyExistsError, PassportAlreadyExistsError,
InvalidUserCredentialsError, ForbiddenRoleError, UserNotFoundError) 
from schemas import UserCreate, LoginUser, TokenResponse, UserUpdateProfile, UserUpdate
from models.users import User, Role
from core.auth import hashed_password, checked_password, create_refresh_token, create_access_token


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
) -> TokenResponse:
    """ Авторизация пользователя """
    auth_user = await get_user_by_email(user.email, session)
    if auth_user is None or not checked_password(user.password, auth_user.password):
        raise InvalidUserCredentialsError()
    
    access = create_access_token(auth_user)
    refresh = create_refresh_token(auth_user)
    return TokenResponse(access_token=access, refresh_token=refresh)


def check_user_role(user: User, need_role: Role) -> User:
    """ Проверка роли пользователя """
    if user.role != need_role:
        raise ForbiddenRoleError(need_role)
    return user


async def update_user_partial(user_data: UserUpdateProfile | UserUpdate, user: User, session: AsyncSession):
    """ Обновление пользователя """
    # Проверяем уникальность изменяемых данных
    if user_data.phone and user_data.phone != user.phone and await get_user_by_phone(user_data.phone, session):
        raise PhoneAlreadyExistsError()
    
    if type(user_data) is UserUpdate:
        if user_data.email and user_data.email != user.email and await get_user_by_email(user_data.email, session):
            raise EmailAlreadyExistsError()
        if (user_data.passport_series or user_data.passport_number) and\
           (user_data.passport_series != user.passport_series or user_data.passport_number != user.passport_number) and\
           await get_user_by_passport(user_data.passport_series, user_data.passport_number, session):
            raise PassportAlreadyExistsError()
    
    data = user_data.model_dump(exclude_unset=True)
    data["updated_at"] = datetime.datetime.now()
    return await update_user(user_data=data, user=user, session=session)


async def update_user_partial_by_id(user_id: int, user_data: UserUpdate, session: AsyncSession):
    """ Обновление пользователя по id"""
    user = await get_user_by_id(user_id, session)
    if user:
        return await update_user_partial(user_data, user, session)
    raise UserNotFoundError()

