\# Metacog Backend \& DB Standards



\## Tech Stack Requirements

\* Framework: FastAPI (Python 3.10+).

\* Data Validation: Pydantic v2 schemas for all requests and responses.

\* Database Layer: Supabase Python Client (PostgreSQL).

\* Server: Uvicorn for asynchronous execution.



\## Architectural Boundaries

\* Enable global CORS middleware explicitly allowing origin: http://localhost:3000

\* Organize code modularly: `app/main.py` for routes, `app/schemas.py` for Pydantic models.

\* Use explicit, semantic status codes for all router endpoints.

\* Never use hardcoded strings for credentials; rely on environment variables (.env).

