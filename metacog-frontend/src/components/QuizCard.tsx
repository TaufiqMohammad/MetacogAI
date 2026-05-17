"use client";

import { useState, useEffect } from "react";
import { Question, ConfidenceLevel } from "@/types/quiz";
import { CheckCircle2, HelpCircle, AlertCircle } from "lucide-react";
import { audioSynth } from "@/utils/audio";

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
      audioSynth.playTick();
      onSubmit(selectedOption, confidence);
    }
  };

  const confidenceOptions: {
    level: ConfidenceLevel;
    label: string;
    icon: React.ReactNode;
    colorClass: string;
    reward: string;
  }[] = [
    {
      level: "certain",
      label: "[ CERTAIN CORE ]",
      icon: <CheckCircle2 className="h-4 w-4" />,
      colorClass:
        "hover:bg-[#22c55e]/20 text-[#22c55e] data-[selected=true]:bg-[#22c55e] data-[selected=true]:text-black border-[#22c55e]",
      reward: "RISK: -25% SHIELD",
    },
    {
      level: "doubtful",
      label: "[ DOUBTFUL ]",
      icon: <HelpCircle className="h-4 w-4" />,
      colorClass:
        "hover:bg-[#f59e0b]/20 text-[#f59e0b] data-[selected=true]:bg-[#f59e0b] data-[selected=true]:text-black border-[#f59e0b]",
      reward: "+10 CI | +25 XP",
    },
    {
      level: "guessing",
      label: "[ SHAKY GUESS ]",
      icon: <AlertCircle className="h-4 w-4" />,
      colorClass:
        "hover:bg-[#06b6d4]/20 text-[#06b6d4] data-[selected=true]:bg-[#06b6d4] data-[selected=true]:text-black border-[#06b6d4]",
      reward: "+5 CI | +15 XP",
    },
  ];

  return (
    <div className="w-full glass-panel p-6 sm:p-8 relative">
      
      {/* Topic & Question */}
      <div className="mb-8 relative z-10">
        <span className="mb-3 inline-block px-3 py-1 text-xs font-bold bg-[var(--retro-blue)] border-2 border-white text-white">
          TOPIC: {question.topic.toUpperCase()}
        </span>
        <h2 className="text-xl font-bold text-white sm:text-2xl mt-2 cursor-blink">
          {question.questionText}
        </h2>
      </div>

      {/* Options */}
      <div className="mb-8 space-y-3 relative z-10">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          return (
            <button
              key={index}
              onClick={() => {
                audioSynth.playTick();
                setSelectedOption(index);
              }}
              className={`w-full border-4 p-4 text-left font-bold ${
                isSelected
                  ? "bg-[var(--retro-gray)] text-black border-white"
                  : "bg-black text-white border-[var(--retro-darkgray)] hover:border-[var(--retro-gray)] hover:bg-[#222]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 font-bold text-sm ${
                    isSelected
                      ? "border-black bg-black text-white"
                      : "border-white bg-transparent text-white"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className={`text-base tracking-wide`}>
                  {option}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Confidence Selector */}
      <div className="mb-8 relative z-10 border-t-4 border-[var(--retro-gray)] pt-6 mt-6">
        <h3 className="mb-4 text-sm font-bold text-white uppercase">
          AWAITING METACOGNITIVE CONFIDENCE CALIBRATION:
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {confidenceOptions.map((opt) => (
            <button
              key={opt.level}
              data-selected={confidence === opt.level}
              onClick={() => {
                audioSynth.playTick();
                setConfidence(opt.level);
              }}
              className={`flex flex-col items-center justify-center gap-2 border-4 bg-black px-2 py-4 text-sm font-bold ${opt.colorClass}`}
            >
              <div className="flex items-center gap-2">
                {opt.icon}
                {opt.label}
              </div>
              <span className="text-xs font-bold mt-1 text-white mix-blend-difference">{opt.reward}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={selectedOption === null || confidence === null}
        className="retro-btn w-full px-6 py-4 text-xl uppercase disabled:opacity-50 disabled:cursor-not-allowed"
      >
        EXECUTE ANSWER
      </button>
    </div>
  );
}
