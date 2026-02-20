from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from core import db_helper
from exceptions import AppException
from models.users import User, Role
from services import user_service


http_bearer = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(http_bearer),
    session: AsyncSession = Depends(db_helper.create_scoped_session)
) -> User:
    """ Получение пользователя по токену """
    try:
        token = credentials.credentials
        return await user_service.get_user_by_token(token, session)
        
    except AppException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message
        )
    

def check_current_user_role(role: Role, user: User):
    try:
        return user_service.check_user_role(user, role)
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    

async def guest_by_token(user: User = Depends(get_current_user)) -> User:
    """Зависимость для гостей"""
    return check_current_user_role(Role.GUEST, user)


async def employee_by_token(user: User = Depends(get_current_user)) -> User:
    """Зависимость для сотрудников"""
    return check_current_user_role(Role.EMPLOYEE, user)


async def admin_by_token(user: User = Depends(get_current_user)) -> User:
    """Зависимость для администраторов"""
    return check_current_user_role(Role.ADMIN, user)
