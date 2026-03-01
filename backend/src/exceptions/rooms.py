from fastapi import status
from .base import AppException


class NoAvailableRoomsError(AppException):
    """ Нет свободных номеров """
    def __init__(self, plural=True):
        super().__init__(
            message="Нет доступных номеров" if plural else "Номер не доступен",
            status_code=status.HTTP_404_NOT_FOUND
        )


class RoomTypeNotFoundError(AppException):
    """ Тип номера не найден """
    def __init__(self):
        super().__init__(
            message=f"Тип номера не найден",
            status_code=status.HTTP_404_NOT_FOUND
        )


class RoomNotFoundError(AppException):
    """ Номер не найден """
    def __init__(self, number: str):
        super().__init__(
            message=f"Номер {number} найден",
            status_code=status.HTTP_404_NOT_FOUND
        )