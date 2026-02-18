from . import AppException


class PositionNotFoundError(AppException):
    def __init__(self, position_id: int):
        super().__init__(
            message=f"Должность с Id {position_id} не найдена",
            status_code=404
        )