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
        "You are an expert educational assessment designer specializing in deep conceptual understanding.\n"
        "Your job is to generate high-quality multiple-choice quiz questions for the given subject.\n\n"
        "RULES:\n"
        "- Write clear, unambiguous question stems (in `questionText`) that test understanding, NOT rote memorization.\n"
        "- Provide exactly 4 answer options. All options must be plausible — avoid obviously wrong distractors.\n"
        "- Only one option must be definitively correct.\n"
        "- Each question should target a specific, testable concept within the topic.\n"
        "- Crucially, the `socraticHint` field must contain a specialized pedagogical clue designed "
        "to help a student deconstruct their own logic if they confidently guess a specific incorrect "
        "answer option trap.\n"
        "- Use precise academic language appropriate for a university-level learner.\n"
        "- Do NOT include any extra commentary, headers, or preamble in your output.\n"
        "- Respond ONLY with the JSON object that matches the required schema exactly.\n\n"
        "IMPORTANT: The `id` field must be a unique UUID-format string (e.g., \"q-<random-8-chars>\").\n"
        "The `correctAnswerIndex` must be the zero-based integer index of the correct option in the `options` array."
    )
    
    prompt = f"Please generate {count} highly technical multiple-choice questions for the subject: '{subject}'."

    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        response_mime_type="application/json",
        response_schema=QuizContainer,
        temperature=0.7,
    )

    response = client.models.generate_content(
        model='gemini-2.0-flash',
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
