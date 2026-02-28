from pydantic import BaseModel


class RoomResult(BaseModel):
    room_number: str
    floor: int
    quantity_places: int
