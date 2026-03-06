from sqlalchemy import ForeignKey, Table, Column
from . import Base


PositionServices = Table(
    "position_services_association",
    Base.metadata,
    Column("position_id", ForeignKey("position.id"), primary_key=True),
    Column("service_id", ForeignKey("services.id"), primary_key=True),
)