from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import User
from src.core import db_helper
from src.exceptions import AppException
from src.services import task_service
from src.schemas import TaskCreate, TaskResponse
from ..dependencies.auth import get_current_user, employee_by_token


router = APIRouter()


@router.post('/', response_model=TaskResponse)
async def create_task(
        tasks_data: TaskCreate,
        user: User = Depends(get_current_user),
        session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        return await task_service.create_task(user, tasks_data, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)
    

@router.patch('/{task_id}/started', response_model=TaskResponse)
async def started_task(
        task_id: int,
        user: User = Depends(employee_by_token),
        session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        return await task_service.started_task_by_id(user, task_id, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)
    

@router.patch('/{task_id}/completed', response_model=TaskResponse)
async def completed_task(
        task_id: int,
        user: User = Depends(employee_by_token),
        session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        return await task_service.completed_task_by_id(user, task_id, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)
    

@router.patch('/{task_id}/canceled', response_model=TaskResponse)
async def canceled_task(
        task_id: int,
        user: User = Depends(get_current_user),
        session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        return await task_service.canceled_task_by_id(user, task_id, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)