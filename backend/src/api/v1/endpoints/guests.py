from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from schemas import UserResponse, UserUpdateProfile, UserUpdate
from core import db_helper
import crud.users as crud
from ..dependencies.auth import guest_by_token, admin_by_token
from models import User
from services import user_service
from exceptions import AppException


router = APIRouter()


@router.get('/', response_model=list[UserResponse])
async def get_guests(session: AsyncSession = Depends(db_helper.create_scoped_session)) -> list[UserResponse]:
    return await crud.get_users_by_role_guest(session)


@router.patch('/profile/edit', response_model=UserResponse)
async def update_user_profile(
    user_data: UserUpdateProfile,
    user: User = Depends(guest_by_token),
    session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> UserResponse:
    try:
        return await user_service.update_user_partial(user_data, user, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)
    

@router.patch('/edit/{guest_id}', response_model=UserResponse)
async def update_user(
    guest_id: int,
    user_data: UserUpdate,
    _: User = Depends(admin_by_token),
    session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> UserResponse:
    try:
        return await user_service.update_user_partial_by_id(guest_id, user_data, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)