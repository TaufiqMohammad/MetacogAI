# Metacog AI: Metacognitive Study Partner

> [!NOTE]
> Metacog AI is an advanced educational technology platform designed to eradicate the **"illusion of competence"** in learning. Instead of relying on traditional binary pass/fail testing, Metacog AI pairs **Confidence-Based Assessment (CBA)** with conversational Socratic AI to track not just *what* a learner knows, but *how confident* they are in that knowledge.

By cross-referencing correctness with subjective confidence, the platform exposes underlying cognitive gaps, isolates high-risk misconceptions, and utilizes an interactive, state-aware Socratic tutor to guide learners into correcting their own logic.

---

## 🧠 The Metacog 4-State Matrix

Metacog AI maps every user response to a dual-dimensional cognitive matrix based on correctness and declared confidence (Certain, Doubtful, or Guessing):

| Cognitive State | Correctness | Confidence | Action Taken by Platform |
| :--- | :--- | :--- | :--- |
| **🥇 Mastery** | Correct | High | Conceptual validation; schedules the topic for a spaced-repetition retention loop. |
| **🎲 Lucky Guess** | Correct | Low | Identifies hesitation; generates similar variations to solidify confidence and understanding. |
| **⚠️ Danger Zone** | Incorrect | High | **Critical Misconception!** Pauses the quiz immediately and triggers a Socratic dialogue. |
| **🕳️ Foundational Gap** | Incorrect | Low | Simple knowledge gap; bypasses deep testing to present a brief, friendly micro-lesson. |

---

## ✨ Key Features

- **Dynamic Quiz Generator**: Real-time AI generation of subject-specific questions matched to the learner's limits.
- **Confidence Logging**: Enforces self-calibration by requiring users to declare their confidence before answers are revealed.
- **Real-Time Socratic Remediation**: A context-aware conversational tutor that prompts self-correction via iterative questioning rather than simply giving away answers.
- **Historic Analytics Dashboard**: High-fidelity progression mapping visualizing safe zones and conceptual vulnerabilities.
- **Unified Authentication**: Seamless registration and session state persistence managed through Supabase.

---

## 🛠️ The Tech Stack

- **Frontend**: Next.js (React), Tailwind CSS, hosted on Vercel.
- **Orchestration Backend (`metacog-aiprompt`)**: FastAPI (Python), AsyncOpenAI client, structured Pydantic schemas, hosted on Render.
- **AI Core**: High-speed **Llama-3.3-70b-versatile** hosted via **Groq Cloud API** (with OpenAI-compatible client).
- **Secondary Backend (`metacog-backend`)**: Standard FastAPI implementation integrating the Google Gemini API.
- **Database & Authentication**: Supabase (PostgreSQL).

---

## 📂 Repository Structure

```filepath
├── metacog-frontend/       # Next.js React frontend application (Vercel)
├── metacog-aiprompt/       # Upgraded FastAPI Orchestration Engine (Render)
├── metacog-backend/        # Alternate FastAPI Backend (Gemini API)
├── supabase_migration.sql  # Database schemas, constraints, and tables
└── render.yaml             # Render deployment blueprint configuration
```

---

## 🚀 Getting Started

### 1. Backend Orchestration Setup (`metacog-aiprompt`)

1. Navigate to the orchestration engine directory:
   ```bash
   cd metacog-aiprompt
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the root of `metacog-aiprompt` and configure your credentials:
   ```env
   OPENAI_API_KEY=your_groq_or_openai_api_key
   OPENAI_BASE_URL=https://api.groq.com/openai/v1  # Optional: For Groq integration
   AI_MODEL_NAME=llama-3.3-70b-versatile           # Model name of choice
   FRONTEND_URL=http://localhost:3000              # URL of local frontend dev
   ```
5. Launch the live development backend:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### 2. Frontend Setup (`metacog-frontend`)

1. Navigate to the frontend directory:
   ```bash
   cd ../metacog-frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```
4. Start the local Next.js development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` to interact with your dashboard.

---

## 🌐 Deployment

### Frontend (Vercel)
The Next.js client is configured for automated global deployment via Vercel. 
- Ensure `NEXT_PUBLIC_API_URL` is set to point to your live Render backend endpoint.
- Commits pushed to `main` automatically deploy to production.

### Backend (Render)
The orchestration engine uses the included `render.yaml` specification for zero-config deployments. 
- **Automated Wildcard CORS**: The backend is configured with automatic Vercel subdomain whitelisting (`allow_origin_regex=r"https://.*\.vercel\.app"`), meaning CORS will dynamically authorize your production site as well as any branch-specific Vercel preview environments automatically!

---

## 🔗 Live Demo
**Interact with the deployed production environment:** [https://metacog-ai-six.vercel.app/](https://metacog-ai-six.vercel.app/)

---

## 👥 The Hackathon Team
Engineered in an intensive 24-hour sprint by a dedicated squad:
- **Taufiq Mohammad**: Backend & Database Architect (Schemas, API endpoints, Supabase orchestration, CORS logic).
- **Karthik Veeranala**: Frontend & UX Lead (Responsive glassmorphic UI, Next.js page routers, dashboard visualizers).
- **Kaushik Veeranala**: AI Orchestration Specialist (Socratic prompting logic, confidence matrix state evaluations, strict JSON structure parsing).
