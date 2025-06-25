from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    DATABASE_URL: str

    class Config:
        env_file = ".env"  # indica el archivo .env que debe cargar

settings = Settings()