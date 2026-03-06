from fastapi import status
from .base import AppException


class CannotCreateTaskError(AppException):
    def __init__(self, reason: str):
        super().__init__(
            message=f"Невозможно заказать услугу: {reason}",
            status_code=status.HTTP_400_BAD_REQUEST
        )


class CannotChangeStatusTaskError(AppException):
    def __init__(self, reason: str):
        super().__init__(
            message=f"Невозможно сменить статус задачи: {reason}",
            status_code=status.HTTP_400_BAD_REQUEST
        )


class TaskNotFoundError(AppException):
    def __init__(self):
        super().__init__(
            message=f"Задача не найдена",
            status_code=status.HTTP_404_NOT_FOUND
        )

