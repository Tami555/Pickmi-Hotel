from pydantic import BaseModel
from typing import TYPE_CHECKING


if TYPE_CHECKING:
    from .services import ServiceResponse


class ServiceCategoryResponse(BaseModel):
    slug: str
    title: str


class ServiceCategoryDetailResponse(ServiceCategoryResponse):
    services: list['ServiceResponse']