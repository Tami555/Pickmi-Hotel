from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from . import Base


if TYPE_CHECKING:
    from . import RoomTypeAmenities


class Amenities(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(unique=True)
    image: Mapped[str] = mapped_column(nullable=True)

    room_types_association: Mapped[list["RoomTypeAmenities"]] = relationship(back_populates="amenity")