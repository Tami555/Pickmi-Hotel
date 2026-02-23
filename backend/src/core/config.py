from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


BASE_PATH = Path(__file__).parent.parent.parent.parent


class Settings(BaseSettings):
    db_user: str
    db_password: str
    db_name: str
    db_host: str = "localhost"
    db_port: int = 5432

    app_secret_key: str
    jwt_algorithm: str = "HS256"
    expire_access_token_minutes: int = 30
    expire_refresh_token_minutes: int = 60

    @property
    def db_async_url(self) -> str:
        return f"postgresql+asyncpg://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"
    
    model_config = SettingsConfigDict(
        env_file=BASE_PATH / ".env",
        env_file_encoding="utf-8"
    )


settings = Settings()