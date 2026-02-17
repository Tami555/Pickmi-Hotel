class UserAlreadyExistsError(Exception):
    """Пользователь уже существует"""
    def __init__(self, field: str):
        self.field = field
        self.message = f"Пользователь с таким {field} уже существует"
        super().__init__(self.message)


class EmailAlreadyExistsError(UserAlreadyExistsError):
    def __init__(self):
        super().__init__("email")


class PhoneAlreadyExistsError(UserAlreadyExistsError):
    def __init__(self):
        super().__init__("телефоном")


class PassportAlreadyExistsError(UserAlreadyExistsError):
    def __init__(self):
        super().__init__("паспортом")