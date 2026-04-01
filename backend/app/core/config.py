from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GOOGLE_API_KEY: str = Field(validation_alias=AliasChoices("GOOGLE_API_KEY", "GGOGLE_API_KEY"))
    MODEL_NAME: str
    TEMPERATURE: float

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()
