import datetime
from enum import Enum as PyEnum
from sqlalchemy import String, Enum as SQLEnum, func, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from . import Base


class Role(PyEnum):
    ADMIN = "admin" # администратор
    EMPLOYEE = "employee" # сотрудник
    GUEST = "guest" # гость


class User(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True)
    password: Mapped[bytes] = mapped_column(String(255))
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    patronymic: Mapped[str] = mapped_column(String(50), nullable=True)
    phone: Mapped[str] = mapped_column(String(20))
    passport_series: Mapped[str] = mapped_column(String(4)) 
    passport_number: Mapped[str] = mapped_column(String(6))  
    role: Mapped[Role] = mapped_column(SQLEnum(Role, name="user_role_enum"), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.now,
        server_default=func.now()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.now,
        server_default=func.now()
    )
    
    __table_args__ = (
        UniqueConstraint('passport_series', 'passport_number', name='unique_passport'),
    )