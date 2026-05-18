# backend/app/main.py
"""
Metacog AI — FastAPI application entrypoint.

Starts the API server, mounts global middleware (CORS, logging),
and registers all route modules under their canonical prefixes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints.quiz import router as quiz_router

# ---------------------------------------------------------------------------
# Application factory
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Metacog AI — Orchestration Engine",
    description=(
        "AI-powered backend for Confidence-Based Assessment (CBA). "
        "Generates structured quiz questions and evaluates learner states "
        "using the Metacog four-state confidence matrix."
    ),
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS Middleware
# ---------------------------------------------------------------------------
# Origins list covers local Next.js dev (3000), Vite fallback (5173),
# and a placeholder for the production Vercel domain.
# Add your live domain here before deploying to production.

import os

FRONTEND_URL = os.getenv("FRONTEND_URL")
ALLOWED_ORIGINS = [
    "http://localhost:3000",        # Next.js dev server
    "http://localhost:5173",        # Vite fallback
    "https://metacog-ai.vercel.app",  # Production frontend
]
if FRONTEND_URL:
    ALLOWED_ORIGINS.append(FRONTEND_URL)
    if FRONTEND_URL.endswith("/"):
        ALLOWED_ORIGINS.append(FRONTEND_URL[:-1])

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Route registration
# ---------------------------------------------------------------------------

app.include_router(quiz_router, prefix="/api")

# ---------------------------------------------------------------------------
# Health-check
# ---------------------------------------------------------------------------

@app.get("/", tags=["Health"], summary="Root health check")
async def root() -> dict:
    """Returns a simple heartbeat to confirm the server is live."""
    return {"status": "ok", "service": "Metacog AI Orchestration Engine", "version": "0.1.0"}
