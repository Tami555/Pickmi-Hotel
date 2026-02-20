from fastapi import status
from . import AppException


class PositionNotFoundError(AppException):
    """ Должность не найдена """
    def __init__(self, position_id: int):
        super().__init__(
            message=f"Должность с Id {position_id} не найдена",
            status_code=status.HTTP_404_NOT_FOUND
        )