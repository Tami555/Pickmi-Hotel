from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from . import Base


if TYPE_CHECKING:
    from . import Employee


class Position(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), unique=True)
    description: Mapped[str | None] = mapped_column(Text)
    # Связи
    employees: Mapped[list["Employee"]] = relationship(back_populates="position")