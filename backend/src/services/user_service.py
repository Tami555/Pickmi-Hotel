import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud import users as user_crud, reservations as reservations_crud
from src.exceptions import (EmailAlreadyExistsError, PhoneAlreadyExistsError, PassportAlreadyExistsError,
                            InvalidUserCredentialsError, ForbiddenRoleError, UserNotFoundError)
from src.schemas import UserCreate, LoginUser, TokenResponse, UserUpdateProfile, UserUpdate, GuestWithStatusResponse
from src.models.users import User, Role
from src.core.auth import hashed_password, checked_password, create_refresh_token, create_access_token


async def get_user_by_role_by_id(user_id: int, user_role: Role, session: AsyncSession):
    user = await user_crud.get_user_by_id(user_id, session)
    if user is None or user.role != user_role:
        raise UserNotFoundError()
    return user


async def registration_user(
        user: UserCreate,
        role_type: Role,
        session: AsyncSession
) -> User:
    """ Регистрация пользователя """

    # Проверяем уникальность пользователя
    if await user_crud.get_user_by_email(user.email, session):
        raise EmailAlreadyExistsError()
        
    if await user_crud.get_user_by_phone(user.phone, session):
        raise PhoneAlreadyExistsError()
        
    if await user_crud.get_user_by_passport(user.passport_series, user.passport_number, session):
        raise PassportAlreadyExistsError()
             
    user_data = user.model_dump()
    user_data["password"] = hashed_password(user.password)
    user_data["role"] = role_type

    new_user = await user_crud.create_user(user_data, session)
    return new_user


async def login_user(
        user: LoginUser,
        session: AsyncSession
) -> TokenResponse:
    """ Авторизация пользователя """
    auth_user = await user_crud.get_user_by_email(user.email, session)
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
    if user_data.phone and user_data.phone != user.phone and await user_crud.get_user_by_phone(user_data.phone, session):
        raise PhoneAlreadyExistsError()
    
    if type(user_data) is UserUpdate:
        if user_data.email and user_data.email != user.email and await user_crud.get_user_by_email(user_data.email, session):
            raise EmailAlreadyExistsError()
        if (user_data.passport_series or user_data.passport_number) and\
           (user_data.passport_series != user.passport_series or user_data.passport_number != user.passport_number) and\
           await user_crud.get_user_by_passport(user_data.passport_series, user_data.passport_number, session):
            raise PassportAlreadyExistsError()
    
    data = user_data.model_dump(exclude_unset=True)
    data["updated_at"] = datetime.datetime.now()
    return await user_crud.update_user(user_data=data, user=user, session=session)


async def get_guest_with_reservations(user_id: int, session: AsyncSession):
    """ Получение гостей со списком их броней """
    await reservations_crud.update_reservation_statuses_by_dates(session) # обновление статусов бронирования
    user = await user_crud.get_user_with_reservations_by_id(user_id, session)
    if user is None:
        raise UserNotFoundError()
    return user


async def get_guests_with_staying_status(
    session: AsyncSession
) -> list[GuestWithStatusResponse]:
    """Получение всех гостей с информацией о текущем проживании"""
    
    guests = await user_crud.get_users_by_role_guest(session)
    
    result = []
    for guest in guests:
        # Ищем активную бронь
        active_reservation = await reservations_crud.get_active_reservation_by_user(guest.id, session)
        is_staying = active_reservation is not None
        
        guest_data = GuestWithStatusResponse(
            id=guest.id,
            email=guest.email,
            first_name=guest.first_name,
            last_name=guest.last_name,
            is_currently_staying=is_staying
        )
        result.append(guest_data)
    return result
