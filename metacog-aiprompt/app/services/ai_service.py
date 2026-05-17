import os
import json
import traceback
from dotenv import load_dotenv
from openai import AsyncOpenAI
from app.models.quiz import QuestionResponse, EvaluationResponse, FrontendQuestion
from app.models.socratic import SocraticChatRequest, SocraticChatResponse

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


async def generate_questions(topic: str, count: int = 5) -> list[FrontendQuestion]:
    if DEMO_MODE:
        return [
            FrontendQuestion(
                id=f"q-demo-{i}",
                topic=topic,
                questionText=f"[DEMO] Question {i} about {topic}: Which of the following is a key concept?",
                options=[f"Option A for Q{i}", f"Option B for Q{i} (Correct)", f"Option C for Q{i}", f"Option D for Q{i}"],
                correctAnswerIndex=1,
                socraticHint=f"Think about the foundational concepts of {topic}."
            )
            for i in range(1, count + 1)
        ]

    try:
        system_prompt = (
            "You are an expert computer science professor. Generate a list of multiple-choice test questions "
            "based on the user's requested topic. You MUST respond with a raw JSON object containing "
            "a key 'questions' which is an array of objects matching this exact structural schema:\n"
            "{\n"
            "  \"questions\": [\n"
            "    {\n"
            "      \"id\": \"string (unique UUID or identifier starting with 'q-')\",\n"
            "      \"topic\": \"string (the topic requested)\",\n"
            "      \"questionText\": \"string (the question stem)\",\n"
            "      \"options\": [\"string\", \"string\", \"string\", \"string\"],\n"
            "      \"correctAnswerIndex\": 0,\n"
            "      \"socraticHint\": \"string (a helpful, guided clue that points out a common misconception without revealing the correct option)\"\n"
            "    }\n"
            "  ]\n"
            "}\n"
            "Make sure the options are university-level, plausible, and only one is correct. "
            "Output ONLY the JSON object, with no extra text or markdown formatting."
        )
        user_prompt = f"Create {count} structured technical questions on: {topic}"

        response = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )
        raw_content = response.choices[0].message.content
        parsed_json = json.loads(raw_content)
        questions_list = parsed_json.get("questions", [])
        
        result = []
        for item in questions_list:
            q_id = item.get("id") or item.get("question_id") or f"q-{os.urandom(4).hex()}"
            q_topic = item.get("topic") or topic
            q_text = item.get("questionText") or item.get("stem") or item.get("question_text") or "Technical Question"
            q_opts = item.get("options") or ["Option A", "Option B", "Option C", "Option D"]
            q_correct = item.get("correctAnswerIndex") if item.get("correctAnswerIndex") is not None else item.get("correct_index", 0)
            q_hint = item.get("socraticHint") or item.get("hint") or item.get("socratic_hint") or "Consider the core definition."

            result.append(FrontendQuestion(
                id=str(q_id),
                topic=str(q_topic),
                questionText=str(q_text),
                options=[str(opt) for opt in q_opts],
                correctAnswerIndex=int(q_correct),
                socraticHint=str(q_hint)
            ))
        
        if not result:
            raise ValueError("No questions successfully parsed from AI response.")
            
        return result
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

async def chat_socratic_intervention(request: SocraticChatRequest) -> SocraticChatResponse:
    if DEMO_MODE:
        return SocraticChatResponse(
            response_text="[DEMO] That's right! You've found the logical flaw.",
            is_solved=True
        )

    try:
        system_prompt = """
        You are a Socratic AI mentor for a computer science student.
        The student got a question INCORRECT but they were HIGHLY CONFIDENT. This is the 'Danger Zone'.
        Your job is to guide them to discover their misconception on their own.
        
        CRITICAL RULES:
        1. NEVER reveal the exact correct answer directly.
        2. Ask guiding questions to make them re-evaluate their logic.
        3. Keep your responses short, conversational, and terminal-hacker themed.
        4. If the student's latest message correctly identifies their flaw or arrives at the right reasoning, set 'is_solved' to true and congratulate them!
        
        You MUST respond with a JSON object matching this schema: {'response_text': 'string', 'is_solved': boolean}
        """

        # Build message history
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add context about the question
        context = f"""
        Context:
        Question: {request.question_text}
        Options: {request.options}
        User chose (Incorrect): {request.options[request.user_answer_index]}
        Correct answer: {request.options[request.correct_index]}
        """
        messages.append({"role": "system", "content": context})
        
        # Add history
        for msg in request.chat_history:
            messages.append({"role": msg.role, "content": msg.content})
            
        # Add user's latest message
        messages.append({"role": "user", "content": request.new_message})

        response = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            response_format={"type": "json_object"}
        )
        
        raw_content = response.choices[0].message.content
        parsed_json = json.loads(raw_content)
        
        return SocraticChatResponse(
            response_text=parsed_json.get("response_text", "Let's keep debugging..."),
            is_solved=parsed_json.get("is_solved", False)
        )

    except Exception as e:
        traceback.print_exc()
        raise e