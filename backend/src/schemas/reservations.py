import datetime
from pydantic import BaseModel, field_validator, model_validator, Field
from .rooms import RoomDetailResult, RoomResult
from src.utils import validators


class ReservationCreate(BaseModel):
    room_number: str
    check_in_date: datetime.datetime = Field(examples=["2026-05-02 09:00"])
    check_out_date: datetime.datetime = Field(examples=["2026-05-03 09:00"])

    @field_validator('check_in_date')
    @classmethod
    def validate_check_in(cls, v):
        return validators.validate_check_in(v)

    @model_validator(mode='after')
    def validate_dates(self):
        validators.validate_dates(self.check_in_date, self.check_out_date)
        return self


class ReservationResponse(BaseModel):
    id: int
    check_in_date: datetime.datetime
    check_out_date: datetime.datetime
    status: str
    room: RoomResult
    

class ReservationDetailResponse(BaseModel):
    id: int
    check_in_date: datetime.datetime
    check_out_date: datetime.datetime
    total_price: int
    status: str
    created_at: datetime.datetime
    room: RoomDetailResult
