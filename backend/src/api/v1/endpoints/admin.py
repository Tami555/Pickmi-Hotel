from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.schemas import UserResponse, UserUpdate, UserDetailResponse
from src.core import db_helper
from ..dependencies.auth import admin_by_token
from src.models import User
from src.services import user_service
from src.exceptions import AppException


router = APIRouter()


@router.get("/profile", response_model=UserDetailResponse)
def get_admin_profile(user: User = Depends(admin_by_token)):
    return user


@router.patch('/profile/edit', response_model=UserResponse)
async def update_admin_profile(
    user_data: UserUpdate,
    user: User = Depends(admin_by_token),
    session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> UserResponse:
    try:
        return await user_service.update_user_partial(user_data, user, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)