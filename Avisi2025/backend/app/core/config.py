from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    # Database URL for SQLAlchemy
    DATABASE_URL: str = "mysql+pymysql://root:password@127.0.0.1:3307/wattshare"

    # Optional FastAPI settings
    API_V1_STR: str = "/api/v1"
    APP_NAME: str = "WattShare"
    DEBUG: bool = True

    class Config:
        env_file = "../.env"
        env_file_encoding = "utf-8"


settings = Settings()