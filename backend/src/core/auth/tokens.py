from .jwt import encode_jwt
from enum import StrEnum as PyEnum
from models import User
from ..config import settings
from schemas import RefreshTokenContent, AccessTokenContent


class TokenType(PyEnum):
    ACCESS_TOKEN = "access"
    REFRESH_TOKEN = "refresh"


def create_token(
        type_token: TokenType,
        payload: dict,
        expire_minutes: int = settings.expire_access_token_minutes,
        secret_key: str = settings.app_secret_key,
        algorithm: str = settings.jwt_algorithm
) -> bytes:
    jwt_payload = {"type": type_token}
    jwt_payload.update(payload)

    token = encode_jwt(
        payload=jwt_payload,
        key=secret_key,
        algorithm=algorithm,
        expire_minutes=expire_minutes
     )
    return token


def create_access_token(user: User):
    payload = AccessTokenContent.from_user(user)
    return create_token(
        type_token=TokenType.ACCESS_TOKEN,
        payload=payload,
        expire_minutes=settings.expire_access_token_minutes
    )


def create_refresh_token(user: User):
    payload = RefreshTokenContent.from_user(user)
    return create_token(
        type_token=TokenType.REFRESH_TOKEN,
        payload=payload,
        expire_minutes=settings.expire_refresh_token_minutes
    )