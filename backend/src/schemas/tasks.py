import datetime
from pydantic import BaseModel, field_validator, Field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from . import ServiceResponse, ReservationResponse, EmployeeResponse


class TaskCreate(BaseModel):
    service_id: int
    reservation_id: int
    scheduled_time: datetime.datetime = Field(examples=["2026-05-02 09:00"])
    comment: str

    @field_validator('scheduled_time')
    @classmethod
    def validate_scheduled_time(cls, v):
        if v < datetime.datetime.today():
            raise ValueError('Дата планирования выполения услуги не может быть в прошлом')
        return v


class TaskResponse(BaseModel):
    id: int
    scheduled_time: datetime.datetime
    comment: str
    service: 'ServiceResponse'
    status: str


class TaskDetailResponse(TaskResponse):
    reservation: 'ReservationResponse'
    employee: 'EmployeeResponse'
    started_at: datetime.datetime | None
    completed_at: datetime.datetime | None
    created_at: datetime.datetime 
    