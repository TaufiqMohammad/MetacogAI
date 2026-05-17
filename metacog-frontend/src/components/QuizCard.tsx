"use client";

import { useState, useEffect } from "react";
import { Question, ConfidenceLevel } from "@/types/quiz";
import { CheckCircle2, HelpCircle, AlertCircle } from "lucide-react";

interface QuizCardProps {
  question: Question;
  onSubmit: (selectedOption: number, confidence: ConfidenceLevel) => void;
}

export default function QuizCard({ question, onSubmit }: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);

  // Reset state when the question changes
  useEffect(() => {
    setSelectedOption(null);
    setConfidence(null);
  }, [question.id]);

  const handleSubmit = () => {
    if (selectedOption !== null && confidence !== null) {
      onSubmit(selectedOption, confidence);
    }
  };

  const confidenceOptions: {
    level: ConfidenceLevel;
    label: string;
    icon: React.ReactNode;
    colorClass: string;
  }[] = [
    {
      level: "certain",
      label: "I'm Certain",
      icon: <CheckCircle2 className="h-5 w-5" />,
      colorClass:
        "hover:border-green-400 hover:bg-green-50 hover:text-green-700 dark:hover:border-green-500 dark:hover:bg-green-950 dark:hover:text-green-400 data-[selected=true]:border-green-500 data-[selected=true]:bg-green-50 data-[selected=true]:text-green-700 data-[selected=true]:ring-2 data-[selected=true]:ring-green-500/20 dark:data-[selected=true]:border-green-500 dark:data-[selected=true]:bg-green-950 dark:data-[selected=true]:text-green-400",
    },
    {
      level: "doubtful",
      label: "I Think So",
      icon: <HelpCircle className="h-5 w-5" />,
      colorClass:
        "hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-700 dark:hover:border-yellow-500 dark:hover:bg-yellow-950 dark:hover:text-yellow-400 data-[selected=true]:border-yellow-500 data-[selected=true]:bg-yellow-50 data-[selected=true]:text-yellow-700 data-[selected=true]:ring-2 data-[selected=true]:ring-yellow-500/20 dark:data-[selected=true]:border-yellow-500 dark:data-[selected=true]:bg-yellow-950 dark:data-[selected=true]:text-yellow-400",
    },
    {
      level: "guessing",
      label: "Completely Guessing",
      icon: <AlertCircle className="h-5 w-5" />,
      colorClass:
        "hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300 data-[selected=true]:border-gray-500 data-[selected=true]:bg-gray-100 data-[selected=true]:text-gray-800 data-[selected=true]:ring-2 data-[selected=true]:ring-gray-500/20 dark:data-[selected=true]:border-gray-500 dark:data-[selected=true]:bg-gray-800 dark:data-[selected=true]:text-gray-300",
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
      {/* Topic & Question */}
      <div className="mb-8">
        <span className="mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
          {question.topic}
        </span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          {question.questionText}
        </h2>
      </div>

      {/* Options */}
      <div className="mb-8 space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          return (
            <button
              key={index}
              onClick={() => setSelectedOption(index)}
              className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:bg-gray-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm transition-colors ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
                      : "border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span
                  className={`text-base ${
                    isSelected
                      ? "font-medium text-indigo-900 dark:text-indigo-100"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {option}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Confidence Selector */}
      <div className="mb-8">
        <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          How confident are you in this answer?
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {confidenceOptions.map((opt) => (
            <button
              key={opt.level}
              data-selected={confidence === opt.level}
              onClick={() => setConfidence(opt.level)}
              className={`flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600 transition-all duration-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 ${opt.colorClass}`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={selectedOption === null || confidence === null}
        className="w-full rounded-xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 dark:hover:bg-indigo-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
      >
        Submit Answer
      </button>
    </div>
  );
}
