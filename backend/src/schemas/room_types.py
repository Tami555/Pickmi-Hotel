from pydantic import BaseModel
from typing import TYPE_CHECKING
from .amenity import AmenityResponse


if TYPE_CHECKING:
    from .rooms import RoomOccupancyInfo


class RoomTypeResponse(BaseModel):
    slug: str
    title: str
    price_per_day: int


class RoomTypeDetailResponse(RoomTypeResponse):
    description: str
    image: str | None


class RoomTypeAmenitiesResponse(RoomTypeDetailResponse):
    amenities: list[AmenityResponse]

    @classmethod
    def from_orm_with_amenities(cls, obj):
        data = {
            "id": obj.id,
            "slug": obj.slug,
            "title": obj.title,
            "description": obj.description,
            "image": obj.image,
            "price_per_day": obj.price_per_day,
            "amenities": [
                {
                    "title": assoc.amenity.title,
                    "is_main": assoc.is_main
                }
                for assoc in obj.amenities_association
            ]
        }
        return cls(**data)
    

class RoomTypeAvailabilityResponse(BaseModel):
    slug: str
    title: str
    price_per_day: int
    available_rooms: int


class RoomTypeOccupancyResponse(BaseModel):
    percentage_occupied: float  # от 0 до 100
    total_rooms: int
    occupied_rooms: int
    rooms: list['RoomOccupancyInfo']
