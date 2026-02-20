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
    sub: str

    @classmethod
    def from_user(cls, user):
        return cls(
            sub=user.email,
        )


class AccessTokenContent(RefreshTokenContent):
    user_id: int
    role: Role

    @classmethod
    def from_user(cls, user):
        return cls(
            sub=user.email,
            user_id=user.id,
            role=user.role
        )