from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.schemas import (UserCreate, UserResponse, EmployeeCreate, EmployeeResponse, LoginUser,
                         TokenResponse, TokenVerifyResponse, TokenRequest)
from src.models.users import Role
from src.core import db_helper
from src.services import user_service, employee_service, token_service
from src.exceptions import AppException


router = APIRouter()


async def create_user_by_role(
    user: UserCreate,
    role: Role,
    session: AsyncSession
) -> UserResponse:
    try:
        return await user_service.registration_user(user=user, role_type=role, session=session)
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
        return await employee_service.registration_employee(user_data=user, employee_data=employee, session=session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)
    

@router.post("/login/", response_model=TokenResponse)
async def login_user(
        user: LoginUser,
        session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> TokenResponse:
    try:
        return await user_service.login_user(user, session)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)
    

@router.post("/refresh/", response_model=TokenResponse, response_model_exclude_none=True)
async def get_new_tokens(
    credentials: TokenRequest,
    session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> TokenResponse:
    try:
        token = credentials.token
        access = await token_service.refresh_access_token(token, session)
        return TokenResponse(access_token=access)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)


@router.post("/verify/", response_model=TokenVerifyResponse)
async def get_new_tokens(
    credentials: TokenRequest
) -> TokenVerifyResponse:
    try:
        is_verify = await token_service.verify_access_token(credentials.token)
        return TokenVerifyResponse(is_verify_token=is_verify)
    except AppException as err:
        raise HTTPException(status_code=err.status_code, detail=err.message)
    