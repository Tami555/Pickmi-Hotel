from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Text, Integer, event
from typing import TYPE_CHECKING
from utils import create_slug
from . import Base


if TYPE_CHECKING:
    from . import Rooms, RoomTypeAmenities


class RoomTypes(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(100), unique=True)
    description: Mapped[str] = mapped_column(Text)
    image: Mapped[str] = mapped_column(nullable=True)
    price_per_day: Mapped[int] = mapped_column(Integer, nullable=False)
    
    rooms: Mapped[list["Rooms"]] = relationship(back_populates="room_type")
    amenities_association: Mapped[list["RoomTypeAmenities"]] = relationship(back_populates="room_type")


@event.listens_for(RoomTypes, 'before_insert')
def generate_slug_before_insert(mapper, connection, target):
    target.slug = create_slug(target.title)


@event.listens_for(RoomTypes, 'before_update')
def update_slug_before_update(mapper, connection, target):
    if target.title and connection.in_transaction():
        session = target._sa_instance_state.session
        if session:
            history = target._sa_instance_state.attrs.title.history
            if history.has_changes():
                target.slug = create_slug(target.title)