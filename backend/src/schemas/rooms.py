from pydantic import BaseModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .room_types import RoomTypeResponse
    from .users import UserResponse


class RoomResult(BaseModel):
    room_number: str
    floor: int
    quantity_places: int


class RoomDetailResult(RoomResult):
    room_type: 'RoomTypeResponse'


class RoomOccupancyInfo(RoomResult):
    is_occupied: bool
    current_guest: 'UserResponse | None' = None
    days_occupied: int | None = None
