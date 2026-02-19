from pydantic import BaseModel, EmailStr
from models.users import Role


class LoginUser(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str | None = None
    token_type: str = "Bearer"


class RefreshTokenContent(BaseModel):
    sub: int
    role: Role

    @classmethod
    def from_user(cls, user):
        data = {
            "sub": user.id,
            "role": user.role,
        }
        return cls(**data)


class AccessTokenContent(RefreshTokenContent):
    email: str

    @classmethod
    def from_user(cls, user):
        data = {
            "sub": user.id,
            "email": user.email,
            "role": user.role,
        }
        return cls(**data)
