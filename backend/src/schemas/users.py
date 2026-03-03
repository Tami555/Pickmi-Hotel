from pydantic import BaseModel, EmailStr, Field, field_validator
from pydantic_extra_types.phone_numbers import PhoneNumber
from src.utils import validators
from .reservations import ReservationDetailResponse, ReservationResponse


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: str = Field(max_length=50)
    last_name: str = Field(max_length=50)


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str = Field(max_length=50)
    last_name: str = Field(max_length=50)
    patronymic: str | None = Field(max_length=50, default=None)
    phone: PhoneNumber
    passport_series: str = Field(max_length=4)
    passport_number: str = Field(max_length=6)

    @field_validator("passport_series")
    def validate_passport_series(cls, value):
        return validators.validate_passport_series(value)
    
    @field_validator("passport_number")
    def validate_passport_number(cls, value):
        return validators.validate_passport_number(value)
    
    @field_validator("password")
    def validate_password(cls, value):
        return validators.validate_password(value)


class UserUpdateProfile(BaseModel):
    first_name: str | None = Field(max_length=50, default=None)
    last_name: str | None = Field(max_length=50, default=None)
    patronymic: str | None = Field(max_length=50, default=None)
    phone: PhoneNumber | None = None


class UserUpdate(UserUpdateProfile):
    email: EmailStr | None = None
    passport_series: str | None = Field(max_length=4, default=None)
    passport_number: str | None = Field(max_length=6, default=None)

    @field_validator("passport_series")
    def validate_passport_series(cls, value):
        return validators.validate_passport_series(value)
    
    @field_validator("passport_number")
    def validate_passport_number(cls, value):
        return validators.validate_passport_number(value)
    

class UserDetailResponse(UserResponse):
    patronymic: str | None = Field(max_length=50, default=None)
    phone: PhoneNumber
    passport_series: str = Field(max_length=4)
    passport_number: str = Field(max_length=6)


class GuestResponse(UserDetailResponse):
    reservations: list[ReservationDetailResponse]


class GuestWithStatusResponse(UserResponse):
    is_currently_staying: bool
    