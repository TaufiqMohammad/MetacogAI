"use client";

import { useState, useEffect } from "react";
import QuizCard from "@/components/QuizCard";
import SocraticIntervention from "@/components/SocraticIntervention";
import { Question, QuizResponse, ConfidenceLevel } from "@/types/quiz";
import { 
  RefreshCcw, 
  CheckCircle2, 
  XCircle, 
  Database, 
  Cpu, 
  Network, 
  Calculator,
  ArrowLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";

const SUBJECTS = [
  { 
    id: "ds", 
    name: "Data Structures", 
    icon: <Network className="h-6 w-6" />, 
    color: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
  },
  { 
    id: "os", 
    name: "Operating Systems", 
    icon: <Cpu className="h-6 w-6" />, 
    color: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" 
  },
  { 
    id: "db", 
    name: "Database Systems", 
    icon: <Database className="h-6 w-6" />, 
    color: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
  },
  { 
    id: "la", 
    name: "Linear Algebra", 
    icon: <Calculator className="h-6 w-6" />, 
    color: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" 
  },
];

export default function QuizPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  // Data State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Socratic Intervention State
  const [showIntervention, setShowIntervention] = useState(false);
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState<number>(0);

  const submitQuizResults = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:8000/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          responses: responses
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit results");
      }
    } catch (error) {
      console.error("Error submitting quiz results:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isFinished && responses.length > 0) {
      submitQuizResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  const fetchQuizData = async (subject: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, question_count: 5 }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      // In a real app, you would handle this error state in the UI
    } finally {
      setIsLoading(false);
    }
  };

  const advanceQuiz = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleAnswerSubmit = (
    selectedOption: number,
    confidence: ConfidenceLevel
  ) => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;

    const newResponse: QuizResponse = {
      questionId: currentQuestion.id,
      selectedAnswerIndex: selectedOption,
      confidenceLevel: confidence,
      isCorrect,
    };

    setResponses((prev) => [...prev, newResponse]);

    // Check for high-confidence error
    if (!isCorrect && confidence === "certain") {
      setLastSelectedAnswer(selectedOption);
      setShowIntervention(true);
      return; // Halt advancement
    }

    advanceQuiz();
  };
  
  const handleCloseIntervention = () => {
    setShowIntervention(false);
    advanceQuiz();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setResponses([]);
    setIsFinished(false);
    setShowIntervention(false);
    setSelectedSubject(null);
    setQuestions([]);
  };

  // 1. Subject Selection View
  if (!selectedSubject) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Choose a Domain to Calibrate Your Metacognition
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
            Select a subject area to begin your adaptive assessment. We'll test both your knowledge and how well you evaluate your own confidence.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              onClick={() => {
                setSelectedSubject(subject.id);
                fetchQuizData(subject.name);
              }}
              className="group flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-700"
            >
              <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${subject.color}`}>
                {subject.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                {subject.name}
              </h3>
            </button>
          ))}
        </div>
      </section>
    );
  }

  // 2. Loading View
  if (isLoading) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse">
          Gemini AI is constructing your metacognitive matrix...
        </p>
      </section>
    );
  }

  // 3. Submitting View
  if (isSubmitting) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse">
          Syncing your performance data to your Metacognitive Matrix...
        </p>
      </section>
    );
  }

  // Fallback if no questions loaded
  if (questions.length === 0) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16">
        <p className="text-lg text-red-500">Failed to load questions or no questions available.</p>
        <button
          onClick={handleRestart}
          className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </section>
    );
  }

  // 3. Quiz Summary View
  if (isFinished) {
    const score = responses.filter((r) => r.isCorrect).length;

    return (
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Quiz Complete!
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            You scored {score} out of {questions.length}. Here is a summary
            of your responses before we wire up the dashboard.
          </p>
        </div>

        <div className="space-y-6">
          {responses.map((response, index) => {
            const question = questions[index];
            return (
              <div
                key={response.questionId}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <span className="mb-2 inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                      {question.topic}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {question.questionText}
                    </h3>
                  </div>
                  {response.isCorrect ? (
                    <div className="flex shrink-0 items-center gap-1 text-green-600 dark:text-green-500">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-medium">Correct</span>
                    </div>
                  ) : (
                    <div className="flex shrink-0 items-center gap-1 text-red-600 dark:text-red-500">
                      <XCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Incorrect</span>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Your Answer:
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                      {question.options[response.selectedAnswerIndex]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Confidence Level:
                    </p>
                    <p className="mt-1 text-sm capitalize text-gray-900 dark:text-gray-200">
                      {response.confidenceLevel}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <RefreshCcw className="h-4 w-4" />
            Choose New Subject
          </button>
          <Link
            href="/dashboard"
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            View Dashboard
          </Link>
        </div>
      </section>
    );
  }

  // 4. Quiz Interface View
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 relative">
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Metacognitive Quiz
          </h1>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Change Subject
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Question {currentIndex + 1} of {questions.length}
        </p>
        
        {/* Progress Bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 ease-out dark:bg-indigo-500"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <QuizCard
        question={questions[currentIndex]}
        onSubmit={handleAnswerSubmit}
      />

      {showIntervention && (
        <SocraticIntervention 
          question={questions[currentIndex]}
          selectedAnswerIndex={lastSelectedAnswer}
          onClose={handleCloseIntervention}
        />
      )}
    </section>
  );
}
