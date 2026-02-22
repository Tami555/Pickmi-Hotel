from pydantic import BaseModel, Field, field_validator
from datetime import date
from typing import Optional, List
from models.employees import EmployeeStatus
from .positions import PositionResponse, PositionDetailResponse
from .users import UserResponse, UserDetailResponse
from utils import validators


class EmployeeCreate(BaseModel):
    position_id: int
    salary: int
    advance: Optional[int]
    hire_date: date
    bank_account: Optional[str] = Field(None, max_length=20)
    weekends: List[int] = Field(default=[6, 7])
    
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
    advance: Optional[int]
    hire_date: date
    bank_account: Optional[str] = Field(None, max_length=20)
    status: EmployeeStatus
    fired_date: date | None
    weekends: List[int] = Field(default=[6, 7])
