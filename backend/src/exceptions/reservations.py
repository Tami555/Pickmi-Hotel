from fastapi import status
from .base import AppException


class IntervalReservationError(AppException):
    """ Ошибка промежутка бронирования """
    def __init__(self):
        super().__init__(
            message=f"Ошибка промежутка бронирования. Промежуток не может быть меньше дня",
            status_code=status.HTTP_400_BAD_REQUEST
        )