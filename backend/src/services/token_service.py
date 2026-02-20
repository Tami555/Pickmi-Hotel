from sqlalchemy.ext.asyncio import AsyncSession
import jwt
from crud.users import get_user_by_email
from exceptions import TokenTypeMismatchError, UserNotFoundError, InvalidTokenError
from models.users import User
from core.auth import check_access_token, check_refresh_token, create_access_token, TokenType


async def get_user_by_token(
    token: str,
    session: AsyncSession,
) -> User:
    """ Получение пользователя по токену с проверкой типа """
    try:
        # Проверяем тип токена
        payload = check_access_token(token)
        if not payload:
            raise TokenTypeMismatchError(expected=TokenType.ACCESS_TOKEN)
    
        # Получаем пользователя
        user = await get_user_by_email(payload.get("sub"), session)
        if not user:
            raise UserNotFoundError()
        return user
    except jwt.exceptions.InvalidTokenError:
        raise InvalidTokenError()
    

async def refresh_access_token(
    token: str,
    session: AsyncSession
) -> str:
    """Получение нового access токена по refresh токену"""
    try:
        # Проверяем что refresh 
        payload = check_refresh_token(token)
        if payload is None:
            raise TokenTypeMismatchError(expected=TokenType.REFRESH_TOKEN)
        
        # Получаем пользователя
        user = await get_user_by_email(payload.get("sub"), session)
        if user is None:
            raise UserNotFoundError()
        
        # Генерируем новый access токен
        return create_access_token(user)
    
    except (jwt.exceptions.InvalidTokenError, InvalidTokenError):
        raise InvalidTokenError()