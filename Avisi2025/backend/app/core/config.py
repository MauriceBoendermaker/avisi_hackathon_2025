from pydantic import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="../../../.env")

class Settings(BaseSettings):
    # Database URL for SQLAlchemy
    DATABASE_URL: str = os.environ.get("DB_URL")

    # Optional FastAPI settings
    API_V1_STR: str = "/api/v1"
    APP_NAME: str = "WattShare"
    DEBUG: bool = True

    class Config:
        env_file = "../../../.env"
        env_file_encoding = "utf-8"


settings = Settings()