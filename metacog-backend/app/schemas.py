from pydantic import BaseModel
from typing import Literal, Optional

class QuizGenerationRequest(BaseModel):
    subject: str
    question_count: int

class QuestionSchema(BaseModel):
    id: str
    topic: str
    questionText: str
    options: list[str]
    correctAnswerIndex: int
    socraticHint: str

class QuizResponseSchema(BaseModel):
    questionId: str
    selectedAnswerIndex: int
    confidenceLevel: Literal['certain', 'doubtful', 'guessing']
    isCorrect: bool

class QuizSubmissionRequest(BaseModel):
    subject: str
    responses: list[QuizResponseSchema]
    user_id: Optional[str] = None

class DashboardMetric(BaseModel):
    subject: str
    aptitude: float
    confidence: float
