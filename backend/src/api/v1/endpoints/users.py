from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from schemas import UserResponse
from core import db_helper
import crud.users as crud
from .employees import router as employees_router
from ..dependencies.auth import guest_by_token, get_current_user
from models import User


router = APIRouter()
router.include_router(employees_router, prefix='/employees')


@router.get('/guests/', response_model=list[UserResponse])
async def create_guest(session: AsyncSession = Depends(db_helper.create_scoped_session)) -> list[UserResponse]:
    return await crud.get_users_by_role_guest(session)


@router.get("/guests/private-resource", response_model=UserResponse)
def get_profile(user: User = Depends(guest_by_token)):
    return user


@router.get("/profile", response_model=UserResponse)
def get_profile(user: User = Depends(get_current_user)):
    return user
