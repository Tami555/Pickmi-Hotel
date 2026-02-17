from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.users import User


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


async def create_user(user_data: dict, session: AsyncSession) -> User:
    """ Создание пользователя """
    new_user = User(**user_data)
    session.add(new_user)
    await session.commit()
    return new_user
