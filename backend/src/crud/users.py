from schemas import UserCreate
from models.users import User, Role
from sqlalchemy.ext.asyncio import AsyncSession
from services.auth.passwords import hashed_password


async def registration_user(
        user: UserCreate,
        role_type: Role,
        session: AsyncSession
) -> User | None:
        new_user = User(
            email=user.email,
            password=hashed_password(user.password),
            first_name=user.first_name,
            last_name=user.last_name,
            patronymic=user.patronymic,
            phone=user.phone,
            passport_series=user.passport_series,
            passport_number=user.passport_number,
            role=role_type
        )
        session.add(new_user)
        await session.commit()
        return new_user