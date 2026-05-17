import json
import uuid
from google import genai
from google.genai import types
from pydantic import BaseModel
from app.schemas import QuestionSchema

class QuizContainer(BaseModel):
    questions: list[QuestionSchema]

client = genai.Client()

def generate_quiz(subject: str, count: int) -> list[QuestionSchema]:
    system_instruction = (
        "You are a world-class engineering educator. Your task is to generate highly technical, "
        "multiple-choice questions matching the provided subject. "
        "Crucially, the `socraticHint` field must contain a specialized pedagogical clue designed "
        "to help a student deconstruct their own logic if they confidently guess a specific incorrect "
        "answer option trap. Output a list of questions."
    )
    
    prompt = f"Please generate {count} highly technical multiple-choice questions for the subject: '{subject}'."

    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        response_mime_type="application/json",
        response_schema=QuizContainer,
    )

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=config
    )
    
    try:
        data = json.loads(response.text)
        container = QuizContainer(**data)
        # Ensure all questions have a valid unique string ID if the LLM generated poorly formatted ones
        for q in container.questions:
            if not q.id or q.id == "string":
                q.id = str(uuid.uuid4())
        return container.questions
    except Exception as e:
        print(f"Error parsing Gemini response: {e}")
        return []
