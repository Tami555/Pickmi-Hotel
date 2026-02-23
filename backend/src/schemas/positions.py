from pydantic import BaseModel, Field
from typing import Optional


class PositionCreate(BaseModel):
    title: str = Field(max_length=100)
    description: Optional[str] = None


class PositionResponse(BaseModel):
    id: int
    title: str


class PositionDetailResponse(PositionCreate):
    id: int
