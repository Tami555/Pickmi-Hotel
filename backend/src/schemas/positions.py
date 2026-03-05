from pydantic import BaseModel, Field
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from . import ServiceResponse


class PositionCreate(BaseModel):
    title: str = Field(max_length=100)
    description: Optional[str] = None


class PositionResponse(BaseModel):
    id: int
    title: str


class PositionDetailResponse(PositionCreate):
    id: int
    services: list['ServiceResponse']
