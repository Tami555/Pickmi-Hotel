from .base import AppException


class NoAvailableRoomsError(AppException):
    def __init__(self):
        super().__init__(
            message=f"Нет доступных номеров",
            status_code=404
        )


class RoomTypeNotFoundError(AppException):
    def __init__(self):
        super().__init__(
            message=f"Тип номера не найден",
            status_code=404
        )