from sqlalchemy.orm import Mapped, mapped_column
from . import Base


class Amenities(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(unique=True)