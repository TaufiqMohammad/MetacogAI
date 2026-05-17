# backend/app/api/endpoints/quiz.py
"""
Quiz API endpoints for Metacog AI.

POST /quiz/generate  — generate a structured question from a topic
POST /quiz/evaluate  — evaluate a user's answer against the confidence matrix
"""

from typing import Literal
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.models.quiz import QuestionResponse, EvaluationResponse
from app.services.ai_service import generate_question, evaluate_assessment

router = APIRouter(prefix="/quiz", tags=["Quiz"])

# ---------------------------------------------------------------------------
# Request bodies
# ---------------------------------------------------------------------------

class GenerateRequest(BaseModel):
    topic: str = Field(
        ...,
        min_length=2,
        max_length=200,
        description="The academic subject or concept to generate a question about.",
        examples=["Photosynthesis", "Binary search trees", "Keynesian economics"],
    )

class EvaluateRequest(BaseModel):
    question: str = Field(..., description="The original question stem shown to the user.")
    options: list[str] = Field(..., min_length=2, description="All answer options shown to the user.")
    correct_index: int = Field(..., ge=0, description="Zero-based index of the correct option.")
    user_answer_index: int = Field(..., ge=0, description="Zero-based index of the option the user selected.")
    user_confidence: Literal["CERTAIN", "DOUBTFUL", "GUESSING"] = Field(
        ...,
        description="The learner's self-declared confidence level before seeing the result.",
    )

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post(
    "/generate",
    response_model=QuestionResponse,
    summary="Generate a quiz question",
    description=(
        "Uses the Gemini model to produce a single structured multiple-choice question "
        "for the requested topic. The response is guaranteed to match the `QuestionResponse` schema."
    ),
)
async def generate_quiz_question(body: GenerateRequest) -> QuestionResponse:
    """Generate a new quiz question for the given topic."""
    try:
        return await generate_question(topic=body.topic)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"AI generation failed: {exc}",
        ) from exc


@router.post(
    "/evaluate",
    response_model=EvaluationResponse,
    summary="Evaluate a quiz submission",
    description=(
        "Cross-references the user's answer with their declared confidence level using "
        "the Metacog confidence matrix, and returns the learner state along with a "
        "contextually appropriate Socratic remediation message."
    ),
)
async def evaluate_quiz_submission(body: EvaluateRequest) -> EvaluationResponse:
    """Evaluate the learner's answer and confidence against the four-state matrix."""
    if body.user_answer_index >= len(body.options):
        raise HTTPException(
            status_code=422,
            detail=(
                f"`user_answer_index` ({body.user_answer_index}) is out of range "
                f"for options list of length {len(body.options)}."
            ),
        )
    if body.correct_index >= len(body.options):
        raise HTTPException(
            status_code=422,
            detail=(
                f"`correct_index` ({body.correct_index}) is out of range "
                f"for options list of length {len(body.options)}."
            ),
        )
    try:
        return await evaluate_assessment(
            question=body.question,
            options=body.options,
            correct_index=body.correct_index,
            user_answer_index=body.user_answer_index,
            user_confidence=body.user_confidence,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"AI evaluation failed: {exc}",
        ) from exc
