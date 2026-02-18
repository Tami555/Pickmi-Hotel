from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from schemas import UserCreate, UserResponse, EmployeeCreate, EmployeeResponse
from models.users import Role
from core import db_helper
from services.user_service import registration_user
from services.employee_service import registration_employee
from exceptions import AppException


router = APIRouter()


async def create_user_by_role(
    user: UserCreate,
    role: Role,
    session: AsyncSession
) -> UserResponse:
    try:
        return await registration_user(user=user, role_type=role, session=session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)


@router.post('/registration/guest/', response_model=UserResponse)
async def create_guest(
        user: UserCreate,
        session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> UserResponse:
    return await create_user_by_role(user=user, role=Role.GUEST, session=session)


@router.post('/registration/admin/', response_model=UserResponse)
async def create_admin(
        user: UserCreate,
        session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> UserResponse:
    return await create_user_by_role(user=user, role=Role.ADMIN, session=session)


@router.post('/registration/employee/', response_model=EmployeeResponse)
async def create_employee(
    user: UserCreate,
    employee: EmployeeCreate,
    session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> EmployeeResponse:
    try:
        return await registration_employee(user_data=user, employee_data=employee, session=session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)