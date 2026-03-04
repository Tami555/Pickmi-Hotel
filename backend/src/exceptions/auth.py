from fastapi import status
from .base import AppException
from src.models.users import Role


class InvalidTokenError(AppException):
    """ Невалидный токен """
    def __init__(self):
        super().__init__(
            message="Невалидный токен",
            status_code=status.HTTP_401_UNAUTHORIZED
        )


class TokenTypeMismatchError(AppException):
    """ Неверный тип токена """
    def __init__(self, expected: str):
        super().__init__(
            message=f"Неверный тип токена. Ожидался: {expected}",
            status_code=status.HTTP_401_UNAUTHORIZED
        )


class InvalidUserCredentialsError(AppException):
    """ Неверные данные для входа """
    def __init__(self):
        super().__init__(
            message="Неверный email или пароль",
            status_code=status.HTTP_401_UNAUTHORIZED
        )


class ForbiddenError(AppException):
    """ Доступ запрещён """
    def __init__(self, message: str = "Доступ запрещён"):
        super().__init__(
            message=message,
            status_code=status.HTTP_403_FORBIDDEN
        )


class ForbiddenRoleError(AppException):
    """ Недостаточно прав """
    def __init__(self, need_role: Role):
        super().__init__(
            message=f"Требуется роль: {need_role}",
            status_code=status.HTTP_403_FORBIDDEN
        )