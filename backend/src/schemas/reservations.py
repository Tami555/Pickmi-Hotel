import datetime
from pydantic import BaseModel, field_validator, model_validator
from .rooms import RoomResult, RoomDetailResult


class ReservationCreate(BaseModel):
    room_number: str
    check_in_date: datetime.datetime
    check_out_date: datetime.datetime

    @field_validator('check_in_date')
    @classmethod
    def validate_check_in(cls, v):
        if v < datetime.datetime.today():
            raise ValueError('Дата заезда не может быть в прошлом')
        return v

    @model_validator(mode='after')
    def validate_dates(self):
        if self.check_out_date <= self.check_in_date:
            raise ValueError('Дата выезда должна быть позже даты заезда')
        return self


class ReservationResponse(BaseModel):
    room: RoomDetailResult
    check_in_date: datetime.datetime
    check_out_date: datetime.datetime
    total_price: int
    status: str
    created_at: datetime.datetime
