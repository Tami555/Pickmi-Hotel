import datetime
from enum import Enum as PyEnum
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, func, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from . import Base


if TYPE_CHECKING:
    from . import Rooms, User, Task


class ReservationStatus(PyEnum):
    PENDING = "pending"  # ожидает
    ACTIVE = "active"  # активная
    CANCELED = "canceled"  # отменено
    COMPLETED = "completed"  # завершено


class Reservation(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    room_id: Mapped[int] = mapped_column(ForeignKey("rooms.id"))
    check_in_date: Mapped[datetime.datetime]
    check_out_date: Mapped[datetime.datetime]
    total_price: Mapped[int] = mapped_column(default=0)
    status: Mapped[ReservationStatus] = mapped_column(
        SQLEnum(ReservationStatus, name="reservation_status_enum"),
        nullable=False
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.now,
        server_default=func.now()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.now,
        server_default=func.now()
    )

    # Связи
    room: Mapped["Rooms"] = relationship(back_populates="reservations")
    user: Mapped["User"] = relationship(back_populates="reservations")
    tasks: Mapped[list["Task"]] = relationship(back_populates="reservation")