from sqlalchemy import Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum as PyEnum
from typing import TYPE_CHECKING
from . import Base


if TYPE_CHECKING:
    from . import RoomTypes


class RoomStatus(PyEnum):
    AVAILABLE = "available" # доступно
    OCCUPIED = "occupied" # занято
    MAINTENANCE = "maintenance" # техническое обслуживание


class Rooms(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    room_number: Mapped[str] = mapped_column(unique=True)
    floor: Mapped[int]
    quantity_places: Mapped[int]
    status: Mapped[RoomStatus] = mapped_column(SQLEnum(RoomStatus, name="status_enum"), nullable=False)
    room_type_id: Mapped[int] = mapped_column(ForeignKey("room_types.id"))

    room_type: Mapped["RoomTypes"] = relationship(back_populates="rooms")