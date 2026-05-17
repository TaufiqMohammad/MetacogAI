import os
import json
import traceback
from dotenv import load_dotenv
from openai import AsyncOpenAI
from app.models.quiz import QuestionResponse, EvaluationResponse

# Load values from our local .env file
load_dotenv()

client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL")
)

MODEL_NAME = os.getenv("AI_MODEL_NAME", "llama-3.3-70b-versatile")
DEMO_MODE = os.getenv("DEMO_MODE", "False").lower() == "true"


async def generate_question(**kwargs) -> QuestionResponse:
    topic = kwargs.get("topic") or kwargs.get("subject", "")

    if DEMO_MODE:
        return QuestionResponse(
            id="q-demo-123",
            stem=f"[DEMO] What is a core characteristic of: {topic}?",
            options=["Option A", "Option B", "Option C", "Option D"],
            correct_index=0
        )

    try:
        response = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system", 
                    "content": "You are a computer science professor. Generate an advanced multiple-choice test question based on the user's requested topic. You MUST respond with a raw JSON object matching this exact structural schema: {'id': 'string', 'stem': 'string', 'options': ['string', 'string', 'string', 'string'], 'correct_index': 0}"
                },
                {"role": "user", "content": f"Create a structured technical question on: {topic}"}
            ],
            response_format={"type": "json_object"}
        )
        raw_content = response.choices[0].message.content
        parsed_json = json.loads(raw_content)
        return QuestionResponse(**parsed_json)
    except Exception as e:
        traceback.print_exc()
        raise e


async def evaluate_assessment(**kwargs) -> EvaluationResponse:
    if DEMO_MODE:
        return EvaluationResponse(
            is_correct=False,
            learner_state="Danger Zone",
            socratic_remediation="Hold on — let's think this through together..."
        )

    try:
        question = kwargs.get("question") or kwargs.get("stem") or ""
        options = kwargs.get("options") or []
        user_confidence = kwargs.get("user_confidence") or "CERTAIN"
        
        correct_index = kwargs.get("correct_index")
        user_answer_index = kwargs.get("user_answer_index")
        
        user_answer = ""
        if user_answer_index is not None and 0 <= user_answer_index < len(options):
            user_answer = options[user_answer_index]
            
        correct_answer = ""
        if correct_index is not None and 0 <= correct_index < len(options):
            correct_answer = options[correct_index]

        system_prompt = """
        Evaluate the student's answer against the correct answer. Categorize their learning state on our 2x2 matrix:
        - Correct + High/Certain Confidence = Mastery
        - Correct + Low/Doubtful Confidence = Lucky Guess
        - Incorrect + High/Certain Confidence = Danger Zone
        - Incorrect + Low/Doubtful Confidence = Foundational Gap
        
        CRITICAL CONSTRAINT: If they hit 'Danger Zone', set 'is_correct' to false. Do NOT leak the correct answer in your remediation. Instead, write an engaging, peer-like Socratic hint prefixed with 'Hold on — let's think this through together.'
        
        You MUST respond with a raw JSON object matching this exact structural schema: {'is_correct': true/false, 'learner_state': 'string', 'socratic_remediation': 'string'}
        """

        user_payload = f"""
        Question Context: {question}
        Available Options: {options}
        Correct Answer to Validate Against: {correct_answer}
        
        Student's Submitted Guess: {user_answer}
        Student's Self-Reported Confidence: {user_confidence}
        """

        response = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_payload}
            ],
            response_format={"type": "json_object"}
        )
        
        raw_content = response.choices[0].message.content
        parsed_json = json.loads(raw_content)

        # Intercept LLM naming variations for the schema key
        remediation_text = (
            parsed_json.get("socratic_remediation") or 
            parsed_json.get("socratic_hint") or 
            parsed_json.get("remediation") or 
            parsed_json.get("explanation") or 
            parsed_json.get("hint") or ""
        )

        # 🧠 INTELLIGENT FALLBACK MATRIX: Routes responses precisely by state
        if not remediation_text.strip():
            state = parsed_json.get("learner_state")
            
            if state == "Mastery":
                remediation_text = "Excellent work! Your confidence matches your flawless mastery of this concept."
                
            elif state == "Lucky Guess":
                remediation_text = "You selected the correct option! However, since your confidence was lower, take a moment to review why this choice works to solidify it for next time."
                
            elif state == "Danger Zone":
                remediation_text = f"Hold on — let's think this through together. You felt highly confident, but your selection '{user_answer}' doesn't quite match the required performance characteristics. Take another look at the core constraints!"
                
            else: # Foundational Gap fallback
                remediation_text = "Let's review this core concept together to bridge your foundational structural gaps."

        # Assign our properly targeted remediation string back to the schema
        parsed_json["socratic_remediation"] = remediation_text

        return EvaluationResponse(**parsed_json)

    except Exception as e:
        traceback.print_exc()
        raise e