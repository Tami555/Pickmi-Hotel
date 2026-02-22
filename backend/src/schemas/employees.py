from pydantic import BaseModel, Field, field_validator
from datetime import date
from typing import List
from models.employees import EmployeeStatus
from .positions import PositionResponse, PositionDetailResponse
from .users import UserResponse, UserDetailResponse
from utils import validators


class EmployeeCreate(BaseModel):
    position_id: int
    salary: int
    advance: int
    hire_date: date
    bank_account: str = Field(max_length=20, default=None)
    weekends: List[int] = Field(default=[6, 7])
    
    @field_validator('bank_account')
    def validate_bank_account(cls, value):
        return validators.validate_bank_account(value)
    
    @field_validator('weekends')
    def validate_weekends(cls, value):
        return validators.validate_weekends(value)


class EmployeeUpdate(BaseModel):
    position_id: int | None = None
    salary: int | None = None
    advance: int | None = None
    status: EmployeeStatus | None = None
    bank_account: str | None = Field(max_length=20, default=None)
    weekends: List[int] | None = Field(default=None)
    
    @field_validator('bank_account')
    def validate_bank_account(cls, value):
        return validators.validate_bank_account(value)
    
    @field_validator('weekends')
    def validate_weekends(cls, value):
        return validators.validate_weekends(value)
    

class EmployeeResponse(BaseModel):
    id: int
    user: UserResponse
    position: PositionResponse
    salary: int
    status: EmployeeStatus


class EmployeeDetailResponse(BaseModel):
    user: UserDetailResponse
    position: PositionDetailResponse
    salary: int
    advance: int
    hire_date: date
    bank_account: str | None = Field(max_length=20, default=None)
    status: EmployeeStatus
    fired_date: date | None
    weekends: List[int] = Field(default=[6, 7])
