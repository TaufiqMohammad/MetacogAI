"use client";

import { Question } from "@/types/quiz";
import { AlertTriangle, Lightbulb } from "lucide-react";

interface SocraticInterventionProps {
  question: Question;
  selectedAnswerIndex: number;
  onClose: () => void;
}

export default function SocraticIntervention({
  question,
  selectedAnswerIndex,
  onClose,
}: SocraticInterventionProps) {
  const selectedOptionText = question.options[selectedAnswerIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm transition-opacity dark:bg-black/60">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="border-b border-orange-200 bg-orange-50 px-6 py-4 dark:border-orange-900/50 dark:bg-orange-950/30">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-200 p-2 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-orange-900 dark:text-orange-200">
                Misconception Detected
              </h2>
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                You were certain, but incorrect. Let's unpack this.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="mb-6">
            <p className="mb-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
              The Option You Chose:
            </p>
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-red-800 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-300">
              "{selectedOptionText}"
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Socratic Hint
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {question.socraticHint}
            </p>
          </div>

          {/* Action */}
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-orange-600 px-6 py-4 text-base font-bold text-white shadow-md transition hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:hover:bg-orange-500"
          >
            I See My Flaw Now, Continue
          </button>
        </div>
      </div>
    </div>
  );
}
