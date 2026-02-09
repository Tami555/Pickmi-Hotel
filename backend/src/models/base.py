from sqlalchemy.orm import DeclarativeBase, declared_attr
from utils import pascal_to_snake


class Base(DeclarativeBase):
    __abstract__ = True

    @declared_attr.directive
    def __tablename__(cls) -> str:
        return pascal_to_snake(cls.__name__)