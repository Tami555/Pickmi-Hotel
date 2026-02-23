from fastapi import status
from . import AppException


class UserAlreadyExistsError(AppException):
    """ Пользователь уже существует """
    def __init__(self, field: str):
        super().__init__(
            message=f"Пользователь с таким {field} уже существует",
            status_code=status.HTTP_409_CONFLICT
        )


class EmailAlreadyExistsError(UserAlreadyExistsError):
    def __init__(self):
        super().__init__("email")


class PhoneAlreadyExistsError(UserAlreadyExistsError):
    def __init__(self):
        super().__init__("телефоном")


class PassportAlreadyExistsError(UserAlreadyExistsError):
    def __init__(self):
        super().__init__("паспортом")


class UserNotFoundError(AppException):
    """ Пользователь не найден """
    def __init__(self):
        super().__init__(
            message="Пользователь не найден",
            status_code=status.HTTP_404_NOT_FOUND
        )


class EmployeeNotFoundError(AppException):
    """ Сотрудник не найден """
    def __init__(self):
        super().__init__(
            message="Сотрудник не найден",
            status_code=status.HTTP_404_NOT_FOUND
        )