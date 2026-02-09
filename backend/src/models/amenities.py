from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from . import Base


if TYPE_CHECKING:
    from . import RoomTypes


class Amenities(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(unique=True)

    room_types: Mapped[list["RoomTypes"]] = relationship(
        secondary="room_type_amenities",
        back_populates="amenities"
    )