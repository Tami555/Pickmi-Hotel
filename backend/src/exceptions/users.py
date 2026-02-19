from . import AppException


class UserAlreadyExistsError(AppException):
    """Пользователь уже существует"""
    def __init__(self, field: str):
        super().__init__(
            message=f"Пользователь с таким {field} уже существует",
            status_code=409
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


class InvalidUserCredentialsError(AppException):
    def __init__(self):
        super().__init__(
            message="Неверный email или пароль",
            status_code=401
        )