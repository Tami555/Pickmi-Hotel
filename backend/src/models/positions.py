from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from . import Base
from .position_services_association import PositionServices

if TYPE_CHECKING:
    from . import Employee, Services


class Position(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), unique=True)
    description: Mapped[str | None] = mapped_column(Text)
    # Связи
    employees: Mapped[list["Employee"]] = relationship(back_populates="position")
    services: Mapped[list["Services"]] = relationship(secondary=PositionServices, back_populates="positions")