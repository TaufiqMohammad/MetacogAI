from pydantic import BaseModel, Field
from typing import List

class SocraticMessage(BaseModel):
    role: str = Field(..., description="Role of the sender (user, assistant, or system)")
    content: str = Field(..., description="Content of the message")

class SocraticChatRequest(BaseModel):
    question_text: str = Field(..., description="Original question stem")
    options: List[str] = Field(..., description="The multiple choice options")
    correct_index: int = Field(..., description="The index of the correct answer")
    user_answer_index: int = Field(..., description="The index of the incorrect answer chosen by the user")
    chat_history: List[SocraticMessage] = Field(default_factory=list, description="Previous messages in this debug session")
    new_message: str = Field(..., description="The user's latest response")

class SocraticChatResponse(BaseModel):
    response_text: str = Field(..., description="The LLM's response message (Socratic hint)")
    is_solved: bool = Field(..., description="True if the user correctly identified and explained their logical flaw")
