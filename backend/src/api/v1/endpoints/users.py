from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from schemas import UserCreate, UserResponse
from models.users import Role, User
from core import db_helper
import crud.users as crud 


router = APIRouter()

# Проверки перед созданием пользователя
async def check_email_exists(email: str, session: AsyncSession) -> bool:
    result = await session.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none() is not None

async def check_phone_exists(phone: str, session: AsyncSession) -> bool:
    result = await session.execute(select(User).where(User.phone == phone))
    return result.scalar_one_or_none() is not None

async def check_passport_exists(series: str, number: str, session: AsyncSession) -> bool:
    result = await session.execute(
        select(User).where(
            User.passport_series == series,
            User.passport_number == number
        )
    )
    return result.scalar_one_or_none() is not None

async def check_register_user(user_data: UserCreate, session: AsyncSession):
    if await check_email_exists(user_data.email, session):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с таким email уже существует"
        )
    if await check_phone_exists(user_data.phone, session):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с таким телефоном уже существует"
        )
    if await check_passport_exists(
        user_data.passport_series, 
        user_data.passport_number, 
        session
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с такими паспортными данными уже существует"
        )
    return True


@router.post('/registration/guest/', response_model=UserResponse)
async def create_guest(
    user: UserCreate,
    session: AsyncSession=Depends(db_helper.create_scoped_session)
) -> UserResponse:
    await check_register_user(user, session)
    return await crud.registration_user(user=user, role_type=Role.GUEST, session=session)


@router.post('/registration/employee/')
async def create_guest(
    user: UserCreate,
    session: AsyncSession=Depends(db_helper.create_scoped_session)
) -> UserResponse:
    await check_register_user(user, session)
    return await crud.registration_user(user=user, role_type=Role.EMPLOYEE, session=session)


@router.post('/registration/admin/')
async def create_guest(
    user: UserCreate,
    session: AsyncSession=Depends(db_helper.create_scoped_session)
) -> UserResponse:
    await check_register_user(user, session)
    return await crud.registration_user(user=user, role_type=Role.ADMIN, session=session)