from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text
from . import Base


class RoomTypes(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), unique=True)
    description: Mapped[str] = mapped_column(Text)
    image: Mapped[str] = mapped_column(nullable=True)