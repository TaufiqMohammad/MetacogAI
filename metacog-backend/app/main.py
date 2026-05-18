# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
import os

from app.schemas import (
    QuizGenerationRequest,
    QuestionSchema,
    QuizSubmissionRequest,
)
from app.database import supabase
from app.gemini_client import generate_quiz as gemini_generate_quiz

app = FastAPI(title="MetacogAI API", version="0.1.0")

# Allow requests from local dev and the deployed Vercel frontend
_frontend_url = os.environ.get("FRONTEND_URL", "")
_allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if _frontend_url:
    _allowed_origins.append(_frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/")
def health_check():
    return {"status": "healthy", "project": "MetacogAI"}


# ---------------------------------------------------------------------------
# POST /api/quiz/generate
# ---------------------------------------------------------------------------
@app.post("/api/quiz/generate", response_model=list[QuestionSchema])
def generate_quiz(payload: QuizGenerationRequest):
    """
    Return quiz questions for the requested subject by generating them live with Gemini AI.
    
    Flow:
      1. Call generate_quiz from our Gemini client.
      2. Bulk-insert the returned questions into the Supabase 'questions' table as a caching archive.
      3. Return the generated questions.
    """
    questions = gemini_generate_quiz(payload.subject, payload.question_count)
    
    if questions and supabase:
        rows_to_insert = [
            {
                "id": q.id,
                "subject": payload.subject,
                "topic": q.topic,
                "question_text": q.questionText,
                "options": q.options,
                "correct_answer_index": q.correctAnswerIndex,
                "socratic_hint": q.socraticHint,
            }
            for q in questions
        ]
        try:
            supabase.table("questions").insert(rows_to_insert).execute()
        except Exception as exc:
            print(f"Warning: Failed to cache generated questions in Supabase: {exc}")

    return questions


# ---------------------------------------------------------------------------
# POST /api/quiz/submit
# ---------------------------------------------------------------------------
@app.post("/api/quiz/submit")
def submit_quiz(payload: QuizSubmissionRequest):
    """
    Persist each individual response as a row in `user_responses`.

    Returns the count of rows successfully inserted.
    """
    if not payload.responses:
        raise HTTPException(status_code=400, detail="No responses provided.")

    if not supabase:
        # Stub response when database is not available
        return {
            "status": "ok",
            "message": f"{len(payload.responses)} response(s) would be saved (database unavailable).",
            "inserted_count": len(payload.responses),
        }

    rows_to_insert = [
        {
            "subject": payload.subject,
            "question_id": response.questionId,
            "selected_answer_index": response.selectedAnswerIndex,
            "confidence_level": response.confidenceLevel,
            "is_correct": response.isCorrect,
            **({"user_id": payload.user_id} if payload.user_id else {}),
        }
        for response in payload.responses
    ]

    try:
        result = supabase.table("user_responses").insert(rows_to_insert).execute()
        inserted_count = len(result.data) if result.data else 0
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save responses: {str(exc)}",
        )

    return {
        "status": "ok",
        "message": f"{inserted_count} response(s) saved successfully.",
        "inserted_count": inserted_count,
    }
