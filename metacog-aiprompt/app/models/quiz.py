from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

class LearnerState(str, Enum):
    MASTERY = "Mastery"
    LUCKY_GUESS = "Lucky Guess"
    DANGER_ZONE = "Danger Zone"
    FOUNDATIONAL_GAP = "Foundational Gap"

class QuestionResponse(BaseModel):
    id: str = Field(..., description="Unique identifier for the question")
    stem: str = Field(..., description="The main text or body of the question")
    options: List[str] = Field(..., description="List of possible answer options")
    correct_index: int = Field(..., description="Index of the correct option in the options list")

class EvaluationResponse(BaseModel):
    is_correct: bool = Field(..., description="Whether the user's answer was correct")
    learner_state: LearnerState = Field(..., description="The evaluated learner state based on correctness and confidence")
    socratic_remediation: Optional[str] = Field(
        default=None, 
        description="Socratic dialogue, explanation, or micro-lesson based on the learner state"
    )
