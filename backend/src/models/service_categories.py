from sqlalchemy import event
from sqlalchemy.orm import Mapped, mapped_column, relationship 
from typing import TYPE_CHECKING
from src.utils import create_slug
from . import Base


if TYPE_CHECKING:
    from . import Services


class ServiceCategories(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(unique=True, nullable=False)
    title: Mapped[str] = mapped_column(unique=True) 

    # Связи
    services: Mapped[list['Services']] = relationship(back_populates='category')


@event.listens_for(ServiceCategories, 'before_insert')
def generate_slug_before_insert(mapper, connection, target):
    target.slug = create_slug(target.title)


@event.listens_for(ServiceCategories, 'before_update')
def update_slug_before_update(mapper, connection, target):
    if target.title and connection.in_transaction():
        session = target._sa_instance_state.session
        if session:
            history = target._sa_instance_state.attrs.title.history
            if history.has_changes():
                target.slug = create_slug(target.title)