from pydantic import BaseModel, EmailStr, Field, field_validator
from pydantic_extra_types.phone_numbers import PhoneNumber


class UserResponse(BaseModel):
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
        if not value.isdigit():
            raise ValueError("Серия паспорта должна содержать только цифры")
        if len(value) != 4:
            raise ValueError("Серия паспорта должна содержать 4 цифры")
        return value
    
    @field_validator("passport_number")
    def validate_passport_number(cls, value):
        if not value.isdigit():
            raise ValueError("Номер паспорта должен содержать только цифры")
        if len(value) != 6:
            raise ValueError("Номер паспорта должен содержать 6 цифр")
        return value
    
    @field_validator("password")
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError('Пароль должен быть не менее 8 символов')
        return value


class UserDetailResponse(UserResponse):
    patronymic: str | None = Field(max_length=50, default=None)
    phone: PhoneNumber
    passport_series: str = Field(max_length=4)
    passport_number: str = Field(max_length=6)