from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from schemas import UserResponse
from core import db_helper
import crud.users as crud
from .employees import router as employees_router


router = APIRouter()
router.include_router(employees_router, prefix='/employees')


@router.get('/guests/', response_model=list[UserResponse])
async def create_guest(session: AsyncSession = Depends(db_helper.create_scoped_session)) -> list[UserResponse]:
    return await crud.get_users_by_role_guest(session)
