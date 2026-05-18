import json
import uuid
from pydantic import BaseModel
from app.schemas import QuestionSchema

class QuizContainer(BaseModel):
    questions: list[QuestionSchema]

# Try to import google genai, but provide a stub if it fails
try:
    from google import genai
    from google.genai import types
    client = genai.Client()
    GENAI_AVAILABLE = True
except ImportError:
    print("Warning: Google GenAI not available. Quiz generation will be stubbed.")
    GENAI_AVAILABLE = False
    client = None

def generate_quiz(subject: str, count: int) -> list[QuestionSchema]:
    if not GENAI_AVAILABLE or client is None:
        print(f"Warning: GenAI not available, returning stub questions for {subject}")
        return _generate_stub_quiz(subject, count)
    
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

    from google.genai import types
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

def _generate_stub_quiz(subject: str, count: int) -> list[QuestionSchema]:
    """Generate stub questions for testing when GenAI is not available."""
    questions = []
    topics = {
        "Data Structures": ["Arrays", "Linked Lists", "Binary Trees", "Hash Tables", "Graphs"],
        "Operating Systems": ["Process Scheduling", "Memory Management", "File Systems", "Concurrency", "I/O"],
        "Database Systems": ["Relational Algebra", "SQL Queries", "Transaction Management", "Indexing", "Normalization"],
        "Linear Algebra": ["Matrix Operations", "Eigenvalues", "Vector Spaces", "Orthogonality", "Decomposition"],
    }
    
    topic_list = topics.get(subject, ["General Topic"])
    
    for i in range(count):
        topic = topic_list[i % len(topic_list)]
        q = QuestionSchema(
            id=f"stub-{uuid.uuid4()}",
            topic=topic,
            questionText=f"[STUB] What is a key concept in {topic}?",
            options=[
                "Option A (correct)",
                "Option B",
                "Option C",
                "Option D",
            ],
            correctAnswerIndex=0,
            socraticHint="Think about the fundamental principles of this concept."
        )
        questions.append(q)
    
    return questions

