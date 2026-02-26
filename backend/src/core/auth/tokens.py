from .jwt import encode_jwt, decode_jwt
from enum import StrEnum as PyEnum
from src.models import User
from ..config import settings
from src.schemas import RefreshTokenContent, AccessTokenContent


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
    """ Генерация jwt токена по типу """
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
    """ Генерация access токена """
    payload = AccessTokenContent.from_user(user)
    return create_token(
        type_token=TokenType.ACCESS_TOKEN,
        payload=payload,
        expire_minutes=settings.expire_access_token_minutes
    )


def create_refresh_token(user: User):
    """ Генерация refresh токена """
    payload = RefreshTokenContent.from_user(user)
    return create_token(
        type_token=TokenType.REFRESH_TOKEN,
        payload=payload,
        expire_minutes=settings.expire_refresh_token_minutes
    )


def check_token_type(type_token: TokenType, token: bytes | str) -> dict | None:
    """ Проверка типа jwt токена """
    payload = decode_jwt(token)
    if payload["type"] != type_token:
        return None
    return payload


def check_access_token(token: bytes | str):
    """ Проверка, что токен типа access """
    return check_token_type(TokenType.ACCESS_TOKEN, token)


def check_refresh_token(token: bytes | str):
    """ Проверка, что токен типа refresh """
    return check_token_type(TokenType.REFRESH_TOKEN, token)