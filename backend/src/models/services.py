from sqlalchemy import Text, ForeignKey, event
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from src.utils import create_slug
from . import Base
from .position_services_association import PositionServices

if TYPE_CHECKING:
    from . import ServiceCategories, Position


class Services(Base):
    id : Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(unique=True, nullable=False)
    title: Mapped[str] = mapped_column(unique=True)
    price: Mapped[int]
    description: Mapped[str] = mapped_column(Text)
    image: Mapped[str] = mapped_column(nullable=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("service_categories.id"))
    # Связи
    category: Mapped['ServiceCategories'] = relationship(back_populates='services')
    positions: Mapped[list['Position']] = relationship(secondary=PositionServices, back_populates='services')


@event.listens_for(Services, 'before_insert')
def generate_slug_before_insert(mapper, connection, target):
    target.slug = create_slug(target.title)


@event.listens_for(Services, 'before_update')
def update_slug_before_update(mapper, connection, target):
    if target.title and connection.in_transaction():
        session = target._sa_instance_state.session
        if session:
            history = target._sa_instance_state.attrs.title.history
            if history.has_changes():
                target.slug = create_slug(target.title)