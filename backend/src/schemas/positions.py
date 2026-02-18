from pydantic import BaseModel, Field
from typing import Optional


class PositionBase(BaseModel):
    title: str = Field(max_length=100)
    description: Optional[str] = None


class PositionCreate(PositionBase):
    pass


class PositionResponse(PositionBase):
    id: int
