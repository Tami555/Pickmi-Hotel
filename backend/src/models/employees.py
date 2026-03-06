import datetime
from enum import Enum as PyEnum
from sqlalchemy import String, ForeignKey, Enum as SQLEnum, ARRAY, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from . import Base


if TYPE_CHECKING:
    from . import User, Position, Task


class EmployeeStatus(PyEnum):
    ACTIVE = "active"  # Работает
    FIRED = "fired"  # Уволен
    ON_LEAVE = "on_leave"  # В отпуске
    PROBATION = "probation"  # На испытательном сроке


class Employee(Base):    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), unique=True)
    position_id: Mapped[int] = mapped_column(ForeignKey("position.id"))
    salary: Mapped[int]
    advance: Mapped[int] = mapped_column(default=0)
    hire_date: Mapped[datetime.datetime]
    bank_account: Mapped[str | None] = mapped_column(String(20))
    status: Mapped[EmployeeStatus] = mapped_column(
        SQLEnum(EmployeeStatus, name="employee_status_enum"),
        default=EmployeeStatus.ACTIVE
    )
    fired_date: Mapped[datetime.datetime | None]
    weekends: Mapped[list[int]] = mapped_column(ARRAY(Integer), default=[6, 7])
    
    # Связи
    user: Mapped["User"] = relationship(back_populates="employee")
    position: Mapped["Position"] = relationship(back_populates="employees")
    tasks: Mapped[list["Task"]] = relationship(back_populates="employee")