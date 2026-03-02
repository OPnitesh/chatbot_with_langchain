from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GGOGLE_API_KEY: str
    MODEL_NAME: str
    TEMPERATURE: float

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()
