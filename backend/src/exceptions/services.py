from fastapi import status
from .base import AppException


class ServiceCategoriesNotFoundError(AppException):
    """ Категория усуг не найден """
    def __init__(self):
        super().__init__(
            message=f"Категрия услуг не найдена",
            status_code=status.HTTP_404_NOT_FOUND
        )


class ServiceNotFoundError(AppException):
    """ Усуга не найдена """
    def __init__(self):
        super().__init__(
            message=f"Усуга не найдена",
            status_code=status.HTTP_404_NOT_FOUND
        )