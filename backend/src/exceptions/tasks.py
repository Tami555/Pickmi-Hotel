from fastapi import status
from .base import AppException


class CannotCreateTaskError(AppException):
    def __init__(self, reason: str):
        super().__init__(
            message=f"Невозможно заказать услугу: {reason}",
            status_code=status.HTTP_400_BAD_REQUEST
        )
