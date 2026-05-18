from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # OpenAI-compatible credentials — used by ai_service.py via os.getenv
    OPENAI_API_KEY: str = ""
    OPENAI_BASE_URL: str = "https://api.groq.com/openai/v1"
    AI_MODEL_NAME: str = "llama-3.3-70b-versatile"

    # When True, all AI calls are short-circuited with deterministic mock payloads.
    DEMO_MODE: bool = False

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
