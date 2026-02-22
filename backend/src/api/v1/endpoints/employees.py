from fastapi import APIRouter, Depends, Path, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from core import db_helper
import crud.employees as crud
from schemas import EmployeeDetailResponse, EmployeeResponse, UserUpdate, EmployeeUpdate
from typing import Annotated
from ..dependencies.auth import admin_by_token, employee_by_token
from models import User
from services import employee_service
from exceptions import AppException


router = APIRouter()


@router.get('/', response_model=list[EmployeeResponse])
async def get_employees(session: AsyncSession = Depends(db_helper.create_scoped_session)) -> list[EmployeeResponse]:
    return await crud.get_employees(session)


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
) -> EmployeeResponse:
    try:
        return await employee_service.update_employee_partial_by_id(
            employee_id=employee_id,
            user_data=user_data,
            employee_data=employee_data,
            session=session
        )
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)

