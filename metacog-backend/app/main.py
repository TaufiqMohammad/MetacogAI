# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    QuizGenerationRequest,
    QuestionSchema,
    QuizSubmissionRequest,
)
from app.database import supabase
from app.gemini_client import generate_quiz as gemini_generate_quiz

app = FastAPI(title="MetacogAI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
    
    if questions:
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

    rows_to_insert = [
        {
            "subject": payload.subject,
            "question_id": response.questionId,
            "selected_answer_index": response.selectedAnswerIndex,
            "confidence_level": response.confidenceLevel,
            "is_correct": response.isCorrect,
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
