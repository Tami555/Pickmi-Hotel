from fastapi import status
from .base import AppException


class ReservationNotFoundError(AppException):
    def __init__(self):
        super().__init__(
            message=f"Бронь не найдена",
            status_code=status.HTTP_404_NOT_FOUND
        )


class CannotCancelReservationError(AppException):
    def __init__(self, reason: str):
        super().__init__(
            message=f"Невозможно отменить бронь: {reason}",
            status_code=status.HTTP_400_BAD_REQUEST
        )


class IntervalReservationError(AppException):
    """ Ошибка промежутка бронирования """
    def __init__(self):
        super().__init__(
            message=f"Ошибка промежутка бронирования. Промежуток не может быть меньше дня",
            status_code=status.HTTP_400_BAD_REQUEST
        )