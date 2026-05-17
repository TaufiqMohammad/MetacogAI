"""
AI Orchestration Service for Metacog AI.

Uses the Google GenAI SDK to communicate with the Gemini model.
All API calls use `response_mime_type='application/json'` and a `response_schema`
derived from our Pydantic models to guarantee structured, parseable outputs.

DEMO_MODE
---------
When `settings.DEMO_MODE` is True, all Gemini API calls are short-circuited.
Both functions return deterministic, realistic mock payloads so the full app
loop can be exercised without any API quota. Toggle it via backend/.env:

    DEMO_MODE=True    ← frontend dev / quota exhausted
    DEMO_MODE=False   ← production / live Gemini
"""

import uuid
import json
import random
from typing import Literal

from google import genai
from google.genai import types

from app.core.config import settings
from app.models.quiz import QuestionResponse, EvaluationResponse, LearnerState
from app.core.prompts import (
    GENERATE_QUESTION_SYSTEM_PROMPT,
    EVALUATE_ASSESSMENT_SYSTEM_PROMPT,
)

# ---------------------------------------------------------------------------
# Client Initialisation (only actually used when DEMO_MODE is False)
# ---------------------------------------------------------------------------

_client = genai.Client(api_key=settings.GEMINI_API_KEY)
_MODEL_ID = "gemini-2.0-flash"

# ---------------------------------------------------------------------------
# JSON Schema helpers
# ---------------------------------------------------------------------------

_QUESTION_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "id":            {"type": "string"},
        "stem":          {"type": "string"},
        "options":       {"type": "array", "items": {"type": "string"}},
        "correct_index": {"type": "integer"},
    },
    "required": ["id", "stem", "options", "correct_index"],
}

_EVALUATION_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "is_correct":           {"type": "boolean"},
        "learner_state":        {
            "type": "string",
            "enum": [s.value for s in LearnerState],
        },
        "socratic_remediation": {"type": "string"},
    },
    "required": ["is_correct", "learner_state", "socratic_remediation"],
}

# ---------------------------------------------------------------------------
# Demo payloads — realistic, state-specific mock responses
# ---------------------------------------------------------------------------

_DEMO_QUESTIONS = [
    {
        "stem"         : "Which of the following best describes a stack data structure?",
        "options"      : [
            "Elements are added at the rear and removed from the front.",
            "Elements are added and removed from the same end.",
            "Elements are stored in sorted order at all times.",
            "Each element points to the next element in a chain.",
        ],
        "correct_index": 1,
    },
    {
        "stem"         : "What does the 'S' in the SOLID principles stand for?",
        "options"      : [
            "Separation of Concerns",
            "Static Binding",
            "Single Responsibility Principle",
            "Substitution Principle",
        ],
        "correct_index": 2,
    },
    {
        "stem"         : "Which gas do plants primarily absorb during photosynthesis?",
        "options"      : ["Oxygen", "Nitrogen", "Hydrogen", "Carbon Dioxide"],
        "correct_index": 3,
    },
]

_DEMO_REMEDIATION: dict[LearnerState, list[str]] = {
    LearnerState.MASTERY: [
        "Locked in — this one's yours. It's queued into your spaced-repetition loop.",
        "Solid. That's exactly the right reasoning — this topic is marked as mastered.",
        "Nailed it with full confidence. This concept is yours to keep.",
    ],
    LearnerState.LUCKY_GUESS: [
        "Right answer, but let's make it stick — what's the core reason this option is correct over the others?",
        "You got it! Since you weren't sure, let's cement it: can you explain *why* the other options are wrong?",
        "Correct! But your confidence was low. Think about what principle makes this the right answer.",
    ],
    LearnerState.DANGER_ZONE: [
        "Hold on — let's think this through together. If your answer were correct, what would that imply about how the system actually works under the hood?",
        "Hold on — let's think this through together. You're confident, but consider: what assumption are you making about the underlying mechanism? Is that assumption always true?",
        "Hold on — let's think this through together. Walk me through your reasoning step by step — at what point does the logic feel slightly uncertain to you?",
    ],
    LearnerState.FOUNDATIONAL_GAP: [
        "No worries — here's the core concept: this topic is about how systems manage data flow. The key rule to remember is that order of operations matters. Try revisiting the basics and we'll come back to it.",
        "That's a tricky one. The main idea here is that definitions matter precisely. Let's break it down: the term refers specifically to one thing, not a family of related things. Start with the textbook definition and build from there.",
        "Let's rebuild from the foundation. The correct answer relates to a fundamental property of the system. Think of it as the default behaviour before any customisation — what would the simplest possible version do?",
    ],
}


def _demo_evaluate(
    is_correct: bool,
    user_confidence: Literal["CERTAIN", "DOUBTFUL", "GUESSING"],
    question: str,
    options: list[str],
    correct_index: int,
    user_answer_index: int,
) -> EvaluationResponse:
    """
    Deterministic confidence-matrix logic used in DEMO_MODE.
    Maps (is_correct × confidence) → LearnerState and picks a realistic
    canned remediation string from the pool above.
    """
    high_confidence = user_confidence == "CERTAIN"

    if is_correct and high_confidence:
        state = LearnerState.MASTERY
    elif is_correct and not high_confidence:
        state = LearnerState.LUCKY_GUESS
    elif not is_correct and high_confidence:
        state = LearnerState.DANGER_ZONE
    else:
        state = LearnerState.FOUNDATIONAL_GAP

    remediation = random.choice(_DEMO_REMEDIATION[state])

    return EvaluationResponse(
        is_correct=is_correct,
        learner_state=state,
        socratic_remediation=remediation,
    )


# ---------------------------------------------------------------------------
# Core Async Functions
# ---------------------------------------------------------------------------

async def generate_question(topic: str) -> QuestionResponse:
    """
    Generate a single structured multiple-choice quiz question for the given topic.

    In DEMO_MODE, returns a realistic pre-seeded question without calling Gemini.
    In live mode, the model is constrained by `response_schema` to return a JSON
    object that maps directly onto our `QuestionResponse` Pydantic model.

    Args:
        topic: The academic subject or concept to generate a question about.

    Returns:
        A fully validated `QuestionResponse` instance.
    """
    if settings.DEMO_MODE:
        template = random.choice(_DEMO_QUESTIONS)
        return QuestionResponse(
            id=f"q-demo-{uuid.uuid4().hex[:8]}",
            stem=f"[DEMO] {template['stem']}",
            options=template["options"],
            correct_index=template["correct_index"],
        )

    # ── Live Gemini path ────────────────────────────────────────────────────
    user_message = f"Generate a quiz question for the following topic: {topic}"

    response = await _client.aio.models.generate_content(
        model=_MODEL_ID,
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=GENERATE_QUESTION_SYSTEM_PROMPT,
            response_mime_type="application/json",
            response_schema=_QUESTION_RESPONSE_SCHEMA,
            temperature=0.7,
        ),
    )

    raw_data: dict = json.loads(response.text)

    if not raw_data.get("id") or raw_data["id"].strip() in ("", "string"):
        raw_data["id"] = f"q-{uuid.uuid4().hex[:8]}"

    return QuestionResponse(**raw_data)


async def evaluate_assessment(
    question: str,
    options: list[str],
    correct_index: int,
    user_answer_index: int,
    user_confidence: Literal["CERTAIN", "DOUBTFUL", "GUESSING"],
) -> EvaluationResponse:
    """
    Evaluate a user's submitted answer against the confidence matrix and produce
    a contextually tailored response (Socratic dialogue, affirmation, or micro-lesson).

    In DEMO_MODE, returns a deterministic mock payload without calling Gemini.
    In live mode, the model is constrained by `response_schema` to return a JSON
    object that maps directly onto our `EvaluationResponse` Pydantic model.

    Args:
        question:          The original question stem shown to the user.
        options:           The list of answer options (strings).
        correct_index:     The zero-based index of the correct option.
        user_answer_index: The zero-based index the user selected.
        user_confidence:   The user's self-declared confidence level.

    Returns:
        A fully validated `EvaluationResponse` instance with the learner state
        and a tailored `socratic_remediation` message.
    """
    is_correct = user_answer_index == correct_index

    if settings.DEMO_MODE:
        return _demo_evaluate(
            is_correct=is_correct,
            user_confidence=user_confidence,
            question=question,
            options=options,
            correct_index=correct_index,
            user_answer_index=user_answer_index,
        )

    # ── Live Gemini path ────────────────────────────────────────────────────
    user_selected_text  = options[user_answer_index]
    correct_option_text = options[correct_index]

    user_message = f"""
QUESTION: {question}

OPTIONS:
{chr(10).join(f"  [{i}] {opt}" for i, opt in enumerate(options))}

USER'S SELECTED ANSWER: [{user_answer_index}] {user_selected_text}
USER'S DECLARED CONFIDENCE: {user_confidence}

Pre-computed facts (use these — do not recalculate):
- is_correct: {str(is_correct).lower()}
- correct_option: [{correct_index}] {correct_option_text}

Apply the confidence matrix and return the evaluation JSON.
""".strip()

    response = await _client.aio.models.generate_content(
        model=_MODEL_ID,
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=EVALUATE_ASSESSMENT_SYSTEM_PROMPT,
            response_mime_type="application/json",
            response_schema=_EVALUATION_RESPONSE_SCHEMA,
            temperature=0.5,
        ),
    )

    raw_data: dict = json.loads(response.text)

    # Enforce is_correct from ground truth — never trust the model's calculation
    raw_data["is_correct"] = is_correct

    return EvaluationResponse(**raw_data)
