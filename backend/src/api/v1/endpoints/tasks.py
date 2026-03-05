from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import User
from src.core import db_helper
from src.exceptions import AppException
from src.services import task_service
from src.schemas import TaskCreate, TaskResponse
from ..dependencies.auth import guest_by_token, get_current_user


router = APIRouter()


@router.post('/', response_model=TaskResponse)
async def create_reservation(
        tasks_data: TaskCreate,
        user: User = Depends(get_current_user),
        session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        return await task_service.create_task(user, tasks_data, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)