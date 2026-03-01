from pydantic import BaseModel
from .room_types import RoomTypeResponse


class RoomResult(BaseModel):
    room_number: str
    floor: int
    quantity_places: int


class RoomDetailResult(RoomResult):
    room_type: RoomTypeResponse
