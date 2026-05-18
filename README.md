# Metacog AI: Metacognitive Study Partner

Metacog AI is an educational technology platform designed to beat the "illusion of competence" in learning. Instead of using standard pass/fail testing, it combines Confidence-Based Assessment (CBA) with AI to track not just what you know, but how confident you feel about it.

By matching your answers with your declared confidence levels, the app uncovers your exact learning state, isolates hidden misconceptions, and uses conversational AI to help you fix your own logic.

---

## The Core Framework

When answering questions, users choose their confidence level: Certain, Doubtful, or Guessing. The app then evaluates them based on four simple states:

*   **Mastery (Correct + High Confidence):** You know the material well. The topic is saved into a spaced-repetition loop for long-term memory.
*   **Lucky Guess / Doubt (Correct + Low Confidence):** You got it right but hesitated. The app generates similar variations of the concept to help build your certainty.
*   **The Danger Zone (Incorrect + High Confidence):** You are completely confident but fundamentally wrong. The app immediately pauses the quiz and opens a Socratic dialogue to help you find and fix your mistake.
*   **Foundational Gap (Incorrect + Low Confidence):** You know you don't know it. The app skips the deep quiz questions and serves up a quick, beginner-friendly micro-lesson.

---

## Core Features

*   **Adaptive Quiz Engine:** Generates domain-specific questions in real-time matching your current learning limits.
*   **Confidence Logging:** Requires you to log your assurance level before seeing any quiz results.
*   **Analytics Dashboard:** A simple graph mapping out which topics are safe and which ones are in your danger zones.
*   **Socratic Remediation:** A conversational AI assistant that asks guided questions to help you debug your own logic rather than just giving you the answer.

---

## Tech Stack

*   **Frontend:** Next.js (React), Tailwind CSS
*   **Backend:** Python, FastAPI
*   **Database:** Supabase (PostgreSQL)
*   **AI Engine:** Google Gemini API

---

## Project Structure

*   **backend/**: Contains the FastAPI application, database connections, and AI prompt logic.
*   **frontend/**: Contains the Next.js user interface, quiz views, and analytics graphs.

---

## Quick Start Setup

### 1. Backend Setup
1. Open your terminal and navigate to the backend folder:
   cd backend
2. Create and activate a virtual environment:
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
3. Install the dependencies:
   pip install -r requirements.txt
4. Add your API keys to your local configuration (.env file):
   SUPABASE_URL=your_supabase_url
   OPENAI_API_KEY=your_OPENAI_API_KEY
5. Start the server:
   uvicorn app.main:app --reload

### 2. Frontend Setup
1. Open a new terminal window and navigate to the frontend folder:
   cd frontend
2. Install the node packages:
   npm install
3. Point the client to your backend server (.env.local file):
   NEXT_PUBLIC_API_URL=http://localhost:8000
4. Run the development site:
   npm run dev

Open http://localhost:3000 in your browser to view the application.

---

## Deployment and Hosting Guide

To host this full-stack application online completely for free, follow this multi-platform deployment approach.

### 1. Database (Supabase)
Your database is hosted on Supabase cloud infrastructure. Ensure your PostgreSQL instance is active and your tables are initialized via the Supabase SQL editor.

### 2. Frontend Deployment (Vercel)
Next.js integrates natively with Vercel for zero-configuration global hosting.
1. Link your GitHub account to Vercel.
2. Select your repository and add a new project.
3. Configure the Root Directory setting to target the frontend folder.
4. Add the following Environment Variable before clicking Deploy:
   NEXT_PUBLIC_API_URL=your_live_backend_server_url

### 3. Backend Deployment (Render or Koyeb)
Your FastAPI Python server can be hosted on a free cloud service instance.

Configuration for Render:
1. Create a new Web Service and link your repository.
2. Set the Root Directory to backend.
3. Set the Environment Runtime to Python 3.
4. Set the Build Command to: pip install -r requirements.txt
5. Set the Start Command to: uvicorn app.main:app --host 0.0.0.0 --port $PORT
6. In Advanced Settings, input your production environment variables (SUPABASE_URL, OPENAI_API_KEY).

Production CORS Update:
Ensure your backend app/main.py configuration initializes the cross-origin resource sharing middleware with your live Vercel production domain string to authorize API communication.

---
### Live Demo
**Access the live platform here:** [https://metacog-ai-six.vercel.app/](https://metacog-ai-six.vercel.app/)

---

## Deployment

The frontend of this application is configured for seamless deployment on **Vercel**:

1. **Environment Variables:** In your Vercel project settings, ensure you add `NEXT_PUBLIC_API_URL` pointing to your hosted FastAPI backend production URL.
2. **Production Builds:** Any updates pushed to the `main` branch will automatically trigger a new production deployment.

## The Team

Built in 24 hours for the hackathon by a 3-man squad:
- Taufiq Mohammad, Karthik Veeranala and Kaushik Veeranala
*   **Frontend & UX Lead:** Created the responsive layout, user workflows, and score tracking screens.
*   **Backend & Database Architect:** Managed the database schemas, API routes, and user state logic.
*   **AI Engine & Prompt Specialist:** Structured the AI response formatting, JSON evaluation schemas, and conversational fallback paths.


