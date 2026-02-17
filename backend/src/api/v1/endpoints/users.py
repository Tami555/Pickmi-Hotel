from fastapi import APIRouter, HTTPException, status
from schemas import UserCreate, UserResponse
from models.users import Role
from core import db_helper
from services.user_service import registration_user
from exceptions import UserAlreadyExistsError


router = APIRouter()


async def create_user_by_role(
    user: UserCreate,
    role: Role,
) -> UserResponse:
    async with db_helper.create_scoped_session() as session:
        try:
            return await registration_user(user=user, role_type=role, session=session)
        except UserAlreadyExistsError as err:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=err.message)


@router.post('/registration/guest/', response_model=UserResponse)
async def create_guest(user: UserCreate) -> UserResponse:
    return await create_user_by_role(user=user, role=Role.GUEST)


@router.post('/registration/employee/', response_model=UserResponse)
async def create_employee(user: UserCreate) -> UserResponse:
    return await create_user_by_role(user=user, role=Role.EMPLOYEE)


@router.post('/registration/admin/', response_model=UserResponse)
async def create_admin(user: UserCreate) -> UserResponse:
    return await create_user_by_role(user=user, role=Role.ADMIN)