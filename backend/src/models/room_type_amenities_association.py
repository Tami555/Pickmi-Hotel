from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from . import Base


class RoomTypeAmenities(Base):
    room_type_id: Mapped[int] = mapped_column(ForeignKey("room_types.id"), primary_key=True)
    amenity_id: Mapped[int] = mapped_column(ForeignKey("amenities.id"), primary_key=True)