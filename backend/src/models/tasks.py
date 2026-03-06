import datetime
from enum import Enum as PyEnum
from sqlalchemy import ForeignKey, Enum as SQLEnum, func, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from . import Base


if TYPE_CHECKING:
    from . import Services, Reservation, Employee


class TaskStatus(PyEnum):
    PENDING = "pending"  # ожидает
    IN_PROGRESS = "in_progress"  # в процессе
    CANCELED = "canceled"  # отменено
    COMPLETED = "completed"  # завершено


class Task(Base):
    id : Mapped[int] = mapped_column(primary_key=True)
    service_id: Mapped[int] = mapped_column(ForeignKey("services.id"))
    reservation_id: Mapped[int] = mapped_column(ForeignKey("reservation.id"))
    employee_id: Mapped[int] = mapped_column(ForeignKey("employee.id"))
    status: Mapped[TaskStatus] = mapped_column(SQLEnum(TaskStatus, name='task_status_enum'), nullable=False, default=TaskStatus.PENDING)
    scheduled_time: Mapped[datetime.datetime]
    comment: Mapped[str] = mapped_column(Text)
    started_at: Mapped[datetime.datetime] = mapped_column(nullable=True)
    completed_at: Mapped[datetime.datetime] = mapped_column(nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.now,
        server_default=func.now()
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        default=datetime.datetime.now,
        server_default=func.now()
    )

    # Связи
    service: Mapped["Services"] = relationship(back_populates="tasks")
    reservation: Mapped["Reservation"] = relationship(back_populates="tasks")
    employee: Mapped["Employee"] = relationship(back_populates="tasks")