from pydantic import BaseModel
from .amenity import AmenityResponse


class RoomTypeResponse(BaseModel):
    slug: str
    title: str
    description: str
    image: str | None
    price_per_day: int


class RoomTypeDetailResponse(RoomTypeResponse):
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
                    "image": assoc.amenity.image,
                    "is_main": assoc.is_main
                }
                for assoc in obj.amenities_association
            ]
        }
        return cls(**data)