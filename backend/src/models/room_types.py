from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Integer
from typing import TYPE_CHECKING
from . import Base


if TYPE_CHECKING:
    from . import Amenities


class RoomTypes(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), unique=True)
    description: Mapped[str] = mapped_column(Text)
    image: Mapped[str] = mapped_column(nullable=True)
    price_per_day: Mapped[int] = mapped_column(Integer, nullable=False)

    amenities: Mapped[list["Amenities"]] = relationship(
        secondary="room_type_amenities",
        back_populates="room_types"
    )