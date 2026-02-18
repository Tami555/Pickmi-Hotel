from pydantic import BaseModel, Field, field_validator
from datetime import date
from typing import Optional, List
from models.employees import EmployeeStatus
from .positions import PositionResponse
from .users import UserResponse


class EmployeeCreate(BaseModel):
    position_id: int
    salary: int
    advance: Optional[int]
    hire_date: date
    bank_account: Optional[str] = Field(None, max_length=20)
    weekends: List[int] = Field(default=[6, 7])
    
    @field_validator('bank_account')
    def validate_bank_account(cls, value):
        if value and (not value.isdigit() or len(value) != 20):
            raise ValueError('Расчётный счёт должен содержать 20 цифр')
        return value
    
    @field_validator('weekends')
    def validate_weekends(cls, value):
        valid_days = [1, 2, 3, 4, 5, 6, 7]
        if not all(day in valid_days for day in value):
            raise ValueError('Дни недели должны быть от 1 (пн) до 7 (вс)')
        return value
    

class EmployeeResponse(BaseModel):
    user: UserResponse
    position: PositionResponse
    salary: int
    status: EmployeeStatus
