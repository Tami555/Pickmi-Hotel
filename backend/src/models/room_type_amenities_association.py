from sqlalchemy import ForeignKey, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from . import Base


if TYPE_CHECKING:
    from . import RoomTypes, Amenities


class RoomTypeAmenities(Base):

    __tablename__ = "room_type_amenities_association"

    room_type_id: Mapped[int] = mapped_column(ForeignKey("room_types.id"), primary_key=True)
    amenity_id: Mapped[int] = mapped_column(ForeignKey("amenities.id"), primary_key=True)
    is_main: Mapped[bool] = mapped_column(default=False, server_default=text('false'))

    room_type: Mapped["RoomTypes"] = relationship(back_populates="amenities_association")
    amenity: Mapped["Amenities"] = relationship(back_populates="room_types_association")
