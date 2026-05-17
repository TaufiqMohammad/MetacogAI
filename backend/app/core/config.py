from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GEMINI_API_KEY: str = "dummy-key-for-local-dev"
    SUPABASE_URL: str = "http://localhost:8000"

    # When True, all AI calls are short-circuited with deterministic mock payloads.
    # Set to False (or remove) when a live Gemini quota is available.
    DEMO_MODE: bool = False

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
