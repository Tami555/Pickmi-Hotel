from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.ext.asyncio import AsyncSession
from src.schemas import UserResponse, UserUpdateProfile, UserUpdate, GuestResponse, GuestWithStatusResponse, TaskResponse
from typing import Annotated
from src.core import db_helper
from ..dependencies.auth import guest_by_token, admin_by_token
from src.models import User
from src.services import user_service
from src.exceptions import AppException
from src.models.enums import Role


router = APIRouter()


@router.get('/', response_model=list[GuestWithStatusResponse])
async def get_guests(session: AsyncSession = Depends(db_helper.create_scoped_session)) -> list[GuestWithStatusResponse]:
    return await user_service.get_guests_with_staying_status(session)


@router.patch('/edit/{guest_id}', response_model=UserResponse)
async def update_guest(
    guest_id: int,
    user_data: UserUpdate,
    _: User = Depends(admin_by_token),
    session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> UserResponse:
    try:
        guest = await user_service.get_user_by_role_by_id(guest_id, Role.GUEST, session)
        return await user_service.update_user_partial(user_data, guest, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)
    

@router.get("/profile", response_model=GuestResponse)
async def get_guest_profile(
    user: User = Depends(guest_by_token),
    session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        return await user_service.get_guest_with_reservations(user.id, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)


@router.get('/{guest_id}', response_model=GuestResponse)
async def get_guest_by_id(
    guest_id: Annotated[int, Path(example=1)],
    session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> GuestResponse:
    try:
        return await user_service.get_guest_with_reservations(guest_id, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)


@router.patch('/profile/edit', response_model=UserResponse)
async def update_guest_profile(
    user_data: UserUpdateProfile,
    user: User = Depends(guest_by_token),
    session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> UserResponse:
    try:
        return await user_service.update_user_partial(user_data, user, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)


@router.get("/profile/tasks", response_model=list[TaskResponse])
async def get_guest_ordered_services(
    user: User = Depends(guest_by_token),
    session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        return await user_service.get_guest_ordered_services_by_id(user.id, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)


@router.get("/{guest_id}/tasks", response_model=list[TaskResponse])
async def get_guest_ordered_services_by_id(
    guest_id: int,
    session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        return await user_service.get_guest_ordered_services_by_id(guest_id, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)