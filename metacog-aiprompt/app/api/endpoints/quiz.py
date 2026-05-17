# backend/app/api/endpoints/quiz.py
"""
Quiz API endpoints for Metacog AI.

POST /quiz/generate  — generate a structured question from a topic
POST /quiz/evaluate  — evaluate a user's answer against the confidence matrix
"""

from typing import Literal, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.models.quiz import QuestionResponse, EvaluationResponse, FrontendQuestion
from app.models.socratic import SocraticChatRequest, SocraticChatResponse
from app.services.ai_service import generate_question, generate_questions, evaluate_assessment, chat_socratic_intervention

router = APIRouter(prefix="/quiz", tags=["Quiz"])

# ---------------------------------------------------------------------------
# Request bodies
# ---------------------------------------------------------------------------

class GenerateRequest(BaseModel):
    topic: Optional[str] = Field(
        None,
        min_length=2,
        max_length=200,
        description="The academic subject or concept to generate a question about.",
        examples=["Photosynthesis", "Binary search trees", "Keynesian economics"],
    )
    subject: Optional[str] = Field(
        None,
        min_length=2,
        max_length=200,
        description="Alternative field name for topic, used by frontend.",
    )
    question_count: Optional[int] = Field(
        5,
        ge=1,
        le=10,
        description="Number of questions to generate for the quiz.",
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
    response_model=list[FrontendQuestion],
    summary="Generate multiple quiz questions",
    description=(
        "Uses the AI model to produce a list of structured multiple-choice questions "
        "for the requested topic/subject. The response is guaranteed to match the `FrontendQuestion` schema list."
    ),
)
async def generate_quiz_question(body: GenerateRequest) -> list[FrontendQuestion]:
    """Generate a list of new quiz questions for the given topic or subject."""
    topic = body.topic or body.subject
    if not topic:
        raise HTTPException(
            status_code=400,
            detail="Either 'topic' or 'subject' must be provided in the request body.",
        )
    count = body.question_count or 5
    try:
        return await generate_questions(topic=topic, count=count)
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


@router.post(
    "/socratic/chat",
    response_model=SocraticChatResponse,
    summary="Conduct Socratic Debug Dialogue",
    description="Takes chat history and context to perform a multi-turn Socratic debug conversation.",
)
async def socratic_chat(body: SocraticChatRequest) -> SocraticChatResponse:
    """Generate the next socratic hint to help the user debug their logic."""
    try:
        return await chat_socratic_intervention(request=body)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Socratic AI chat failed: {exc}",
        ) from exc

