from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from . import Base


if TYPE_CHECKING:
    from . import RoomTypes, Reservation


class Rooms(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    room_number: Mapped[str] = mapped_column(unique=True)
    floor: Mapped[int]
    quantity_places: Mapped[int]
    room_type_id: Mapped[int] = mapped_column(ForeignKey("room_types.id"))

    # Связи
    room_type: Mapped["RoomTypes"] = relationship(back_populates="rooms")
    reservations: Mapped[list["Reservation"]] = relationship(back_populates="room")
