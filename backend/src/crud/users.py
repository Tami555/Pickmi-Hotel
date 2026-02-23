from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from models.users import User, Role
from models import Employee


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
