from fastapi import APIRouter, Depends, Path, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from src.core import db_helper
from src.crud import employees as employees_crud
from src.schemas import EmployeeDetailResponse, EmployeeResponse, UserUpdate, EmployeeUpdate, TaskResponse
from typing import Annotated
from ..dependencies.auth import admin_by_token, employee_by_token
from src.models import User
from src.services import employee_service
from src.exceptions import AppException


router = APIRouter()


@router.get('/', response_model=list[EmployeeResponse])
async def get_employees(session: AsyncSession = Depends(db_helper.create_scoped_session)):
    return await employees_crud.get_employees(session)


@router.get("/profile", response_model=EmployeeDetailResponse)
def get_employee_profile(user: User = Depends(employee_by_token)):
    return user.employee


@router.get('/{employee_id}', response_model=EmployeeDetailResponse)
async def get_employees_by_id(
    employee_id: Annotated[int, Path(example=1)],
    session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> EmployeeDetailResponse:
    try:
        return await employee_service.get_employee_by_id(employee_id, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)


@router.patch('/edit/{employee_id}', response_model=EmployeeResponse)
async def update_employee(
    employee_id: int,
    user_data: UserUpdate,
    employee_data: EmployeeUpdate,
    _: User = Depends(admin_by_token),
    session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        return await employee_service.update_employee_partial_by_id(
            employee_id=employee_id,
            user_data=user_data,
            employee_data=employee_data,
            session=session
        )
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)


@router.get("/profile/tasks", response_model=list[TaskResponse])
async def get_employee_tasks(
    user: User = Depends(employee_by_token),
    session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        return await employee_service.get_employee_tasks_by_id(user.employee.id, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)


@router.get("/{employee_id}/tasks", response_model=list[TaskResponse])
async def get_employee_tasks_by_id(
    employee_id: int,
    session: AsyncSession = Depends(db_helper.create_scoped_session)
):
    try:
        return await employee_service.get_employee_tasks_by_id(employee_id, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)