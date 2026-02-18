from fastapi import APIRouter, Depends, Path, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from core import db_helper
import crud.employees as crud
from schemas import EmployeeDetailResponse, EmployeeResponse
from typing import Annotated


router = APIRouter()


@router.get('/', response_model=list[EmployeeResponse])
async def get_employees(session: AsyncSession = Depends(db_helper.create_scoped_session)) -> list[EmployeeResponse]:
    return await crud.get_employees(session)


@router.get('/{employee_id}', response_model=EmployeeDetailResponse)
async def get_employees_by_id(
    employee_id: Annotated[int, Path(example=1)],
    session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> EmployeeDetailResponse:
    employee = await crud.get_employee_by_id(employee_id, session)
    if employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Employee {employee_id} not found")
    return employee
