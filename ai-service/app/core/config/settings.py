from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GOOGLE_API_KEY: str
    API_PREFIX: str
    DOCUMENT_DIR: str
    
    class Config:
        env_file = ".env"

settings = Settings()