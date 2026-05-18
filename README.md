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

### Live Site
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


