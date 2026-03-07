import datetime
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import User, Reservation, Rooms, Employee
from src.models.enums import Role, ReservationStatus


async def get_users_by_role_guest(session: AsyncSession) -> list[User]:
    """ Получение пользователей с ролью ГОСТЬ """
    stmt = select(User).where(User.role == Role.GUEST)
    guests = await session.scalars(stmt)
    return list(guests)


async def get_user_by_id(user_id: int, session: AsyncSession) -> User | None:
    """ Получение пользователя по id """
    return await session.get(User, user_id)


async def get_user_by_email(email: str, session: AsyncSession) -> User | None:
    """ Получение пользователя по email """
    result = await session.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_phone(phone: str, session: AsyncSession) -> User | None:
    """ Получение пользователя по телефону """
    result = await session.execute(select(User).where(User.phone == phone))
    return result.scalar_one_or_none()


async def get_user_by_passport(series: str, number: str, session: AsyncSession) -> User | None:
    """ Получение пользователя по паспортным данным """
    result = await session.execute(
        select(User).where(
            User.passport_series == series,
            User.passport_number == number
        )
    )
    return result.scalar_one_or_none()


async def get_user_with_employee_by_id(user_id: int, session: AsyncSession) -> User | None:
    """ Получение пользователя по id + связь с сотрудником """
    stmt = select(User).options(joinedload(User.employee).joinedload(Employee.position)).where(User.id == user_id)
    return await session.scalar(stmt)


async def get_user_with_reservations_by_id(user_id: int, session: AsyncSession) -> User | None:
    """ Получение гостя по id + связь с бронями"""
    stmt = select(User).options(selectinload(User.reservations)
                                .joinedload(Reservation.room)
                                .joinedload(Rooms.room_type)
                            ).where(User.id == user_id, User.role == Role.GUEST)
    user = await session.scalar(stmt)
    return user


async def create_user(user_data: dict, session: AsyncSession) -> User:
    """ Создание пользователя """
    new_user = User(**user_data)
    session.add(new_user)
    await session.commit()
    return new_user


async def update_user(user_data: dict, user: User, session: AsyncSession) -> User:
    """Обновление пользователя """
    for attr, value in user_data.items():
        setattr(user, attr, value)
    await session.commit()
    return user


async def get_top_users(
    session: AsyncSession,
    limit: int = 3,
    start_date: datetime.datetime | None = None,
    end_date: datetime.datetime | None = None
) -> list[tuple]:
    """ Возвращает топ клиентов по количеству броней """
    query = (
        select(
            User.id,
            User.first_name,
            User.last_name,
            User.email,
            User.phone,
            func.count(Reservation.id).label('bookings_count'),
            func.sum(Reservation.total_price).label('total_spent')
        )
        .select_from(Reservation)
        .join(User, Reservation.user_id == User.id)
        .where(Reservation.status.in_([ReservationStatus.ACTIVE, ReservationStatus.COMPLETED]))
    )
    
    if start_date:
        query = query.where(Reservation.created_at >= start_date)
    if end_date:
        query = query.where(Reservation.created_at <= end_date)
    
    query = (
        query.group_by(User.id, User.first_name, User.last_name, User.email, User.phone)
        .order_by(func.count(Reservation.id).desc())
        .limit(limit)
    )
    
    result = await session.execute(query)
    return result.all()