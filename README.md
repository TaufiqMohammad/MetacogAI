# MetacogAI
An AI-powered study partner utilizing Confidence-Based Assessment (CBA) to map technical aptitude against self-confidence, exposing cognitive blind spots and fixing critical misconceptions through real-time Socratic remediation.

```markdown
# 🎯 Metacog AI: Metacognitive Study Partner & Confidence-Based Assessment Engine

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-API-blue?style=for-the-badge&logo=googlegemini)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Metacog AI is an advanced, production-ready educational technology platform engineered to systematically dismantle **the illusion of competence** in student learning. Traditional testing relies on a reductionist binary framework (Pass/Fail, Correct/Incorrect) that leaves critical cognitive vulnerabilities completely unaddressed. 

By integrating **Confidence-Based Assessment (CBA)** with a state-of-the-art **Multi-Agent Large Language Model Engine**, Metacog AI requires students to submit a real-time subjective confidence vector alongside every answer. The application cross-references this behavioral metadata against objective correctness to isolate deep-seated misconceptions, intercept lucky guesses, and deploy dynamic, real-time Socratic remediation scaffolding.

---

## 📌 Table of Contents
1. [Theoretical Framework & The Metacognitive Matrix](#1-theoretical-framework--the-metacognitive-matrix)
2. [Core Functional Modules](#2-core-functional-modules)
3. [System Architecture & Data Flows](#3-system-architecture--data-flows)
4. [Technical Stack Architecture](#4-technical-stack-architecture)
5. [Database Schema (PostgreSQL DDL)](#5-database-schema-postgresql-ddl)
6. [Structured AI Schema Specifications (Pydantic)](#6-structured-ai-schema-specifications-pydantic)
7. [API Specification (RESTful Endpoints)](#7-api-specification-restful-endpoints)
8. [Installation & Local Deployment Guide](#8-installation--local-deployment-guide)
9. [Hackathon Team & Agentic Development Implementation](#9-hackathon-team--agentic-development-implementation)

---

## 1. Theoretical Framework & The Metacognitive Matrix

Metacog AI bases its testing engine on **Metacognitive Calibration**—the degree of alignment between a learner's perceived knowledge and their demonstrated performance. When a user interacts with the system, they evaluate their confidence across three tiers: **Certain (High)**, **Doubtful (Medium)**, or **Guessing (Low)**. 

The core evaluation framework dynamically maps results into a 2x2 Metacognitive Matrix:


```

```
              HIGH CONFIDENCE             LOW CONFIDENCE
         ┌───────────────────────────┬───────────────────────────┐
         │                           │                           │
         │         MASTERY           │   LUCKY GUESS / DOUBT     │

```

CORRECT    │  • Action: Log to Spaced  │  • Action: Generate core  │
│    Repetition Queue       │    concept variations     │
│                           │                           │
├───────────────────────────┼───────────────────────────┤
│                           │                           │
│     THE DANGER ZONE       │      FOUNDATIONAL GAP     │
INCORRECT   │  • Action: HALT test;     │  • Action: Deploy brief,  │
│    Trigger Socratic Loop  │    highly structured text │
│                           │    micro-lessons          │
└───────────────────────────┴───────────────────────────┘

```

### Cognitive State Breakdown & System Intervention Logic
* **🎯 Mastery (Correct + High Confidence):** The student possesses valid, well-calibrated mental schemas. The engine logs this topic and schedules it into a Spaced-Repetition algorithmic loop to optimize long-term memory retention.
* **🎲 Lucky Guess / Doubt (Correct + Low/Medium Confidence):** The student arrived at the correct conclusion but exhibits cognitive hesitation or relied on blind chance. The platform flags this as unanchored knowledge, instantly generating parallel conceptual variants to build true certainty.
* **⚠️ The Danger Zone (Incorrect + High Confidence):** The most critical academic hazard. The learner holds an uncalibrated ego and deep-seated structural misconceptions (they believe they are correct but are fundamentally wrong). The engine immediately triggers an emergency halt to standard testing and launches a **Socratic Remediation Sequence**.
* **🛑 Foundational Gap (Incorrect + Low Confidence):** The student demonstrates healthy metacognitive calibration; they are aware of their ignorance. The system skips deep cross-examination and deploys an interactive, beginner-friendly structural micro-lesson.

---

## 2. Core Functional Modules

### 🔹 Dynamic Multi-Subject AI Assessment Engine
The platform bypasses fixed, static question banks. Powered by Google Gemini models via structured JSON schemas, the AI constructs contextual, domain-specific conceptual multiple-choice items or programming debugging exercises in real-time, matching the student's tracked skill limits.

### 🔹 Dual-Vector Performance Logging
Every student action maps onto two separate vectors:
1.  **Aptitude Vector:** Tracking conceptual accuracy, logical syntax, and computational precision.
2.  **Confidence Vector:** Measuring metacognitive assurance across subjects like Object-Oriented Programming, Logic Design, and Engineering Mathematics.

### 🔹 Interactive Metacognitive Dashboard
Built with `Next.js` and `Recharts`, the analytics interface transforms raw evaluation matrices into an interactive scatter-plot heatmap. Students can visualize their exact academic standing, seeing a clear graphical rendering of which sub-topics reside safely within the **Mastery** zone and which ones have migrated into the high-risk **Danger Zone**.

### 🔹 Live Socratic Scaffolding & Remediation
When a high-confidence error occurs, the Socratic Engine activates. Instead of printing the right answer, the AI behaves like an interactive peer mentor, extracting the student's flawed logic and serving progressive, guiding feedback loops until the student corrects their own architectural error.

---

## 3. System Architecture & Data Flows

The system architecture utilizes a strictly decoupled, asynchronous request-response architecture optimized for predictable LLM execution windows.


```

┌──────────────┐     Answer + Confidence Vector     ┌─────────────┐
│              ├───────────────────────────────────>│             │
│ Next.js UI   │                                    │ FastAPI     │
│ Client       │<───────────────────────────────────┤ Backend API │
└──────────────┘       Matrix Diagnostic State       └──────┬──▲───┘
│  │
Read/Write Records                 │  │ Prompt / Struct JSON
▼  │
┌──────────┴──┐
│ Supabase DB │
└─────────────┘
┌─────────────┐
│ Google LLM  │
│ Engine      │
└─────────────┘

```

### End-to-End Core Workflow:
1.  **Request Generation:** The Next.js client requests a test session module for a designated subject.
2.  **LLM Execution:** The FastAPI server connects to the Gemini API, enforcing a rigid Pydantic JSON template schema to guarantee database parsing safety.
3.  **Submission Processing:** The user evaluates the question, logs their subjective confidence index, and submits their answer payload to `/api/v1/quiz/submit`.
4.  **Matrix Calculation:** The Python engine calculates the matrix status, writes transactional records to Supabase PostgreSQL, and triggers conditional workflows based on the resulting quadrant.
5.  **Remediation Loop:** If the response falls into the **Danger Zone**, the backend constructs a customized Socratic interaction prompt state, tracking the session state until the misconception resolves.

---

## 4. Technical Stack Architecture

* **Frontend Engine:** `Next.js 15` utilizing App Router architecture, customized with `Tailwind CSS` for responsive layouts and `Recharts` for high-frequency interactive rendering of the cognitive scatter plots.
* **Application Server:** `FastAPI (Python 3.10+)` chosen for its asynchronous networking capabilities, high-speed routing execution, and native validation pairing with Pydantic.
* **Database Infrastructure:** `Supabase (PostgreSQL)` managing all relational tables, student performance statistics, and logging states with highly performant multi-column indexing.
* **AI & LLM Gateway:** `Google Gemini API` structured exclusively through Pydantic model outputs to guarantee reliable API payloads.
* **Development Automation:** Orchestrated via `Google Antigravity`, utilizing multi-agent AI environments to manage frontend rendering loops, automate API integration validation, and execute continuous test suites.

---

## 5. Database Schema (PostgreSQL DDL)

To run the database setup locally, execute the following relational data definition language statements inside your Supabase SQL editor:

```sql
-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Profile Table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Academic Subjects Table
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE
);

-- Assessment Sessions
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_completed BOOLEAN DEFAULT FALSE
);

-- Question Ledger Log
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of strings format
    correct_option_index INT NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Metacognitive Log Metric Table
CREATE TYPE public.confidence_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE public.matrix_quadrant AS ENUM ('MASTERY', 'LUCKY_GUESS', 'DANGER_ZONE', 'FOUNDATIONAL_GAP');

CREATE TABLE public.metacognitive_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_option_index INT NOT NULL,
    user_confidence public.confidence_level NOT NULL,
    is_correct BOOLEAN NOT NULL,
    diagnosed_quadrant public.matrix_quadrant NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optimize analytics indexing for matrix coordinate calculation
CREATE INDEX idx_logs_session_quadrant ON public.metacognitive_logs(session_id, diagnosed_quadrant);
CREATE INDEX idx_questions_subject ON public.questions(subject_id);

```

---

## 6. Structured AI Schema Specifications (Pydantic)

The backend code ensures strict data parsing formatting through these explicit Pydantic model configurations:

```python
from pydantic import BaseModel, Field
from typing import List, Optional

class QuestionGenerationRequest(BaseModel):
    subject: str = Field(..., description="The academic topic area (e.g., 'Object-Oriented Programming')")
    difficulty_tier: str = Field("intermediate", description="Target difficulty level for question generation")

class StructuredQuestionResponse(BaseModel):
    question_text: str = Field(..., description="The conceptual core challenge text question")
    options: List[str] = Field(..., description="Exactly 4 explicit multiple choice variations")
    correct_option_index: int = Field(..., ge=0, le=3, description="Index of the actual valid response element")
    explanation: str = Field(..., description="Deep architectural breakdown explaining why the choice is correct")

class AnswerSubmissionPayload(BaseModel):
    session_id: str
    question_id: str
    selected_index: int
    confidence: str = Field(..., description="Must match exactly: 'LOW', 'MEDIUM', or 'HIGH'")

class SocraticRemediationStep(BaseModel):
    feedback_message: str = Field(..., description="The Socratic guiding assessment statement highlighting logic flaws without revealing the solution.")
    guiding_question: str = Field(..., description="A targeted question prompt forcing the user to debug their own conclusion.")

```

---

## 7. API Specification (RESTful Endpoints)

### 📥 1. Generate Session Question

* **Endpoint:** `POST /api/v1/quiz/generate`
* **Content-Type:** `application/json`
* **Request Payload:**

```json
{
  "subject": "Data Structures",
  "difficulty_tier": "intermediate"
}

```

* **Response Payload (200 OK):**

```json
{
  "question_id": "a9b8c7d6-e5f4-3210-fedc-ba9876543210",
  "question_text": "In a hash table implementation using separate chaining, what is the worst-case time complexity of searching for an element if all n keys hash to the same slot?",
  "options": [
    "O(1)",
    "O(log n)",
    "O(n)",
    "O(n log n)"
  ],
  "correct_option_index": 2
}

```

### 📤 2. Submit Assessment Response

* **Endpoint:** `POST /api/v1/quiz/submit`
* **Content-Type:** `application/json`
* **Request Payload:**

```json
{
  "session_id": "777e4567-e89b-12d3-a456-426614174000",
  "question_id": "a9b8c7d6-e5f4-3210-fedc-ba9876543210",
  "selected_index": 0,
  "confidence": "HIGH"
}

```

* **Response Payload (200 OK - Intercepting The Danger Zone Error):**

```json
{
  "is_correct": false,
  "diagnosed_quadrant": "DANGER_ZONE",
  "remediation_required": true,
  "socratic_payload": {
    "feedback_message": "Your selection indicates an assumption that hash table lookups are universally constant time regardless of underlying hash collisions.",
    "guiding_question": "If every single node maps into a single slot bucket, what structural data collection format does that specific chain node collection resolve to, and how long does it take to walk through it sequentially?"
  }
}

```

---

## 8. Installation & Local Deployment Guide

### System Prerequisites

Ensure your local host machines have installed Node.js v18.0+, Python 3.10+, and a functional package deployment tool (npm/pip).

### Step 1: Backend Installation & Setup

1. Clone the repository and enter the backend root workspace:
```bash
cd backend


```



```
2.  Instantiate a local isolated virtual environment and activate it:
    ```bash
    python -m venv venv
    # On macOS/Linux:
    source venv/bin/activate
    # On Windows:
    venv\Scripts\activate
    ```
3.  Execute mass dependencies installation:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure the environment variable configuration matrix:
    ```bash
    cp .env.example .env
    

```

```
Open `.env` and fill in the required variables:
```env
SUPABASE_URL=your_supabase_project_endpoint_url
SUPABASE_ANON_KEY=your_supabase_anonymous_public_api_key
GEMINI_API_KEY=your_google_gemini_developer_token_string
```

```

5. Launch the development FastAPI server instance using Uvicorn:
```bash
uvicorn app.main:app --reload --port 8000

```



### Step 2: Frontend Installation & Setup

1. Navigate into the client repository workspace:
```bash
cd ../frontend

```


2. Install required node modules:
```bash
npm install


```



```
3.  Initialize local environmental path pointers:
    ```bash
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
    

```

4. Launch the local client build service:
```bash
npm run dev


```



```
5.  Access the web app interface by opening your browser to `http://localhost:3000`.

---

## 9. Hackathon Team & Agentic Development Implementation

This codebase was engineered within a high-velocity 24-hour hackathon sprint by a 3-man development team. To compress structural engineering pipelines, the team leveraged **Google Antigravity**'s advanced multi-agent development environment, which allowed each team member to accelerate their specialized role workflows:

* **👨‍💻 Frontend & UX Lead:** Utilized Antigravity developer agents running in **Browser Control** mode. The developer defined structural wireframes for the multi-tier confidence buttons and matrix grids, allowing the autonomous UI agents to build components, view live rendering layouts directly inside localhost windows, and isolate CSS errors instantly without touching manual boilerplate code.
* **⚙️ Backend & Database Architect:** Deployed Antigravity in **Plan Mode** to architect relational database tables connecting users to subject performance metrics. The backend agent analyzed structural relational constraints, executed clean table migrations to Supabase, and handled API route logic checks automatically through connected Model Context Protocol (MCP) data channels.
* **🧠 AI Engine & Prompt Specialist:** Managed isolated concurrent agent simulation frameworks inside Antigravity to run high-speed integration testing across Google Gemini API engines. This verified that JSON structured schema returns remained fully typed and parsed accurately into Pydantic structures prior to final frontend feature integrations.

---
*Developed under the 24-Hour Sprint Schedule. Released under the terms of the MIT License.*

```

```

```
