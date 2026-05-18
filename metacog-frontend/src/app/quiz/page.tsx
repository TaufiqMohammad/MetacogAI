"use client";

import { useState, useEffect } from "react";
import QuizCard from "@/components/QuizCard";
import SocraticIntervention from "@/components/SocraticIntervention";
import AuthGuard from "@/components/AuthGuard";
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
  Loader2,
  Zap,
  Activity,
  Crosshair,
  ShieldAlert,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { audioSynth } from "@/utils/audio";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const SUBJECTS = [
  { 
    id: "ds", 
    name: "Data Structures", 
    icon: <Network className="h-8 w-8" />
  },
  { 
    id: "os", 
    name: "Operating Systems", 
    icon: <Cpu className="h-8 w-8" />
  },
  { 
    id: "db", 
    name: "Database Systems", 
    icon: <Database className="h-8 w-8" />
  },
  { 
    id: "la", 
    name: "Linear Algebra", 
    icon: <Calculator className="h-8 w-8" />
  },
];

function QuizPageInner() {
  const { user, profile, updateProfile } = useAuth();
  const [isBriefingComplete, setIsBriefingComplete] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  // Data State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Game HUD State
  const [shield, setShield] = useState(100);
  const [ci, setCi] = useState(50);
  const [mxp, setMxp] = useState(0);

  // Quiz State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  
  // Socratic Intervention State
  const [showIntervention, setShowIntervention] = useState(false);
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState<number>(0);

  // Sync MXP from profile or localStorage
  useEffect(() => {
    if (profile && profile.mxp !== undefined) {
      setMxp(profile.mxp);
    } else if (typeof window !== "undefined") {
      const storedMxp = localStorage.getItem("metacog_mxp");
      if (storedMxp) setMxp(parseInt(storedMxp, 10));
    }
  }, [profile]);

  const saveMxp = async (newMxp: number) => {
    setMxp(newMxp);
    if (typeof window !== "undefined") {
      localStorage.setItem("metacog_mxp", newMxp.toString());
    }
    if (user) {
      await updateProfile({ mxp: newMxp });
    }
  };

  const fetchQuizData = async (subject: string) => {
    setIsLoading(true);
    try {
      audioSynth.playTick();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/api/quiz/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, question_count: 5 }),
      });
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();
      setQuestions(data);

      // Save questions in Supabase so foreign key references work perfectly
      if (data && data.length > 0) {
        const rows = data.map((q: any) => ({
          id: q.id,
          subject: subject,
          topic: q.topic,
          questionText: q.questionText,
          options: q.options,
          correctAnswerIndex: q.correctAnswerIndex,
          socraticHint: q.socraticHint,
        }));
        await supabase.from("questions").upsert(rows);
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save responses to Supabase when finished
  useEffect(() => {
    if (isFinished && responses.length > 0 && user) {
      const saveResponses = async () => {
        const rows = responses.map((r, index) => {
          return {
            user_id: user.id,
            subject: selectedSubject,
            question_id: r.questionId,
            selected_answer_index: r.selectedAnswerIndex,
            confidence_level: r.confidenceLevel.toUpperCase(), // CERTAIN, DOUBTFUL, GUESSING
            is_correct: r.isCorrect,
          };
        });
        
        const { error } = await supabase
          .from("user_responses")
          .insert(rows);
        
        if (error) {
          console.error("Error saving responses to Supabase:", error);
        } else {
          console.log("Responses successfully saved to Supabase!");
        }
      };
      
      saveResponses();
    }
  }, [isFinished, responses, user, questions, selectedSubject]);

  const advanceQuiz = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      audioSynth.playSuccess();
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

    // Game Logic
    if (isCorrect && confidence === "certain") {
      // Mastery
      setCi(c => Math.min(100, c + 20));
      saveMxp(mxp + 50);
      audioSynth.playHeal();
    } else if (!isCorrect && (confidence === "doubtful" || confidence === "guessing")) {
      // Foundational Gap (Awareness bonus)
      setCi(c => Math.min(100, c + 10));
      saveMxp(mxp + 25);
    } else if (isCorrect && (confidence === "doubtful" || confidence === "guessing")) {
      // Lucky Guess
      setCi(c => Math.min(100, c + 5));
      saveMxp(mxp + 15);
    } else if (!isCorrect && confidence === "certain") {
      // DANGER ZONE - System Anomaly
      setCi(c => Math.max(0, c - 25));
      setShield(s => Math.max(0, s - 25));
      audioSynth.playDamage();
      setLastSelectedAnswer(selectedOption);
      setShowIntervention(true);
      return; // Halt advancement
    }

    advanceQuiz();
  };
  
  const handleCloseIntervention = (solved: boolean) => {
    setShowIntervention(false);
    if (solved) {
      setShield(s => Math.min(100, s + 25));
      saveMxp(mxp + 100); // Boss bonus!
    }
    advanceQuiz();
  };

  const handleRestart = () => {
    audioSynth.playTick();
    setCurrentIndex(0);
    setResponses([]);
    setIsFinished(false);
    setShowIntervention(false);
    setSelectedSubject(null);
    setQuestions([]);
    setShield(100);
    setCi(50);
  };

  // 0. Briefing View
  if (!isBriefingComplete) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 text-white relative">
          <h1 className="text-3xl font-bold tracking-tight uppercase mb-6 text-center text-gradient">
            OPERATION: METACOG
          </h1>
          <p className="mb-8 text-center text-lg text-gray-300">
            Welcome to the training simulator. This isn't just about getting answers right—it's about knowing <i>how confident</i> you are. 
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="border-4 border-[var(--retro-gray)] bg-[#22c55e]/20 p-4">
              <div className="flex items-center gap-2 mb-2 text-white">
                <Crosshair className="h-6 w-6 text-[#22c55e]" />
                <h3 className="font-bold text-xl uppercase">Mastery</h3>
              </div>
              <p className="text-sm">Correct + Certain. You know your stuff. Rewards maximum MXP and Calibration.</p>
            </div>
            
            <div className="border-4 border-[var(--retro-gray)] bg-[#f59e0b]/20 p-4">
              <div className="flex items-center gap-2 mb-2 text-white">
                <Activity className="h-6 w-6 text-[#f59e0b]" />
                <h3 className="font-bold text-xl uppercase">Lucky Guess</h3>
              </div>
              <p className="text-sm">Correct + Doubtful. You survived, but you need to review this to build true confidence.</p>
            </div>

            <div className="border-4 border-[var(--retro-gray)] bg-[#ef4444]/20 p-4">
              <div className="flex items-center gap-2 mb-2 text-white">
                <ShieldAlert className="h-6 w-6 text-[#ef4444]" />
                <h3 className="font-bold text-xl uppercase">Danger Zone</h3>
              </div>
              <p className="text-sm">Incorrect + Certain. The ultimate trap. You will take damage and must debug your logic to survive.</p>
            </div>

            <div className="border-4 border-[var(--retro-gray)] bg-[#06b6d4]/20 p-4">
              <div className="flex items-center gap-2 mb-2 text-white">
                <GraduationCap className="h-6 w-6 text-[#06b6d4]" />
                <h3 className="font-bold text-xl uppercase">Foundational Gap</h3>
              </div>
              <p className="text-sm">Incorrect + Doubtful. You knew you didn't know it. Self-awareness grants a small bonus!</p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                audioSynth.playTick();
                setIsBriefingComplete(true);
              }}
              className="retro-btn px-8 py-4 text-xl uppercase w-full md:w-auto"
            >
              Accept Mission
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 1. Subject Selection View
  if (!selectedSubject) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center border-b-4 border-[var(--retro-gray)] pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase text-gradient">
            SELECT EPISODE
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            Choose your combat zone. Your Cognitive Shield relies on accurate self-assessment.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              onClick={() => {
                setSelectedSubject(subject.name);
                fetchQuizData(subject.name);
              }}
              className="retro-btn flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center">
                {subject.icon}
              </div>
              <h3 className="text-lg font-bold uppercase">
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
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 font-mono text-white">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <p className="mt-6 text-xl font-bold animate-pulse text-[var(--retro-yellow)]">
          LOADING LEVEL DATA...
        </p>
      </section>
    );
  }

  // Fallback if no questions loaded
  if (questions.length === 0) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-white glass-panel max-w-2xl mx-auto mt-10">
        <p className="text-xl font-bold text-[var(--retro-red)] mb-6">MISSION FAILED: NO DATA RETURNED</p>
        <button
          onClick={handleRestart}
          className="retro-btn flex items-center gap-2 px-6 py-3 uppercase"
        >
          <ArrowLeft className="h-5 w-5" />
          Abort Sequence
        </button>
      </section>
    );
  }

  // 3. Quiz Summary View
  if (isFinished) {
    const score = responses.filter((r) => r.isCorrect).length;

    return (
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 mb-8">
          <div className="mb-8 text-center border-b-4 border-[var(--retro-gray)] pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--retro-yellow)] uppercase text-glow-amber">
              LEVEL COMPLETED
            </h1>
            <p className="mt-4 text-xl text-white">
              KILLS (SCORE): {score}/{questions.length} | FINAL CI: {ci}% | SHIELD: {shield}%
            </p>
          </div>

          <div className="space-y-6">
            {responses.map((response, index) => {
              const question = questions[index];
              return (
                <div
                  key={response.questionId}
                  className="border-4 border-[var(--retro-gray)] bg-[#111] p-6 text-white"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <span className="mb-2 inline-block px-2 py-1 text-xs font-bold bg-[var(--retro-blue)] border-2 border-white uppercase">
                        {question.topic}
                      </span>
                      <h3 className="text-lg font-bold mt-2">
                        {question.questionText}
                      </h3>
                    </div>
                    {response.isCorrect ? (
                      <div className="flex shrink-0 items-center gap-1 text-[#22c55e]">
                        <CheckCircle2 className="h-6 w-6" />
                        <span className="text-base font-bold uppercase">Valid</span>
                      </div>
                    ) : (
                      <div className="flex shrink-0 items-center gap-1 text-[var(--retro-red)] text-glow-red">
                        <XCircle className="h-6 w-6" />
                        <span className="text-base font-bold uppercase">Invalid</span>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 border-t-2 border-[var(--retro-gray)] pt-4">
                    <div>
                      <p className="text-sm font-bold text-gray-400">
                        SUBMITTED VALUE:
                      </p>
                      <p className="mt-1 text-base font-bold text-white">
                        {question.options[response.selectedAnswerIndex]}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-400">
                        CONFIDENCE CALIBRATION:
                      </p>
                      <p className="mt-1 text-base font-bold capitalize text-[var(--retro-yellow)]">
                        {response.confidenceLevel}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleRestart}
              className="retro-btn flex items-center justify-center gap-2 px-6 py-4 text-base uppercase"
            >
              <RefreshCcw className="h-5 w-5" />
              Next Level
            </button>
            <Link
              href="/dashboard"
              onClick={() => audioSynth.playTick()}
              className="retro-btn flex items-center justify-center px-6 py-4 text-base uppercase bg-[var(--retro-blue)] text-white hover:text-black"
            >
              Enter Dashboard
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // 4. Quiz Interface View
  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 relative min-h-[80vh] flex flex-col justify-end">
      <div className="flex-1">
        <QuizCard
          question={questions[currentIndex]}
          onSubmit={handleAnswerSubmit}
        />
      </div>

      {/* Dynamic HUD (Bottom Fixed like DOOM/Wolf3D) */}
      <div className="hud-panel p-4 mt-8 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
        
        {/* Shield / Health Bar */}
        <div className="flex flex-col gap-1 w-full md:w-1/3">
          <div className="flex justify-between text-sm font-bold text-white uppercase">
            <span>HEALTH SHIELD</span>
            <span>{shield}%</span>
          </div>
          <div className={`h-6 w-full border-4 ${shield < 30 ? 'border-[var(--retro-red)] animate-pulse' : 'border-white'} bg-black p-0.5`}>
            <div 
              className={`h-full transition-all duration-300 ${shield < 30 ? 'bg-[var(--retro-red)]' : 'bg-[var(--retro-blue)]'}`} 
              style={{ width: `${shield}%` }} 
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 items-center bg-black border-4 border-[var(--retro-gray)] p-3">
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Level</span>
            <div className="flex items-center gap-1 text-white font-bold text-2xl">
              {currentIndex + 1}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center border-l-2 border-[var(--retro-gray)] pl-4">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Calib Idx</span>
            <div className="flex items-center gap-1 text-white font-bold text-2xl">
              <Activity className="h-6 w-6 text-[#22c55e]" /> {ci}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center border-l-2 border-[var(--retro-gray)] pl-4">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Total MXP</span>
            <div className="flex items-center gap-1 text-white font-bold text-2xl">
              <Zap className="h-6 w-6 text-[var(--retro-yellow)] fill-current" /> {mxp}
            </div>
          </div>
        </div>

        {/* Abort */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleRestart}
            className="retro-btn flex items-center gap-1 text-xs font-bold px-3 py-2 uppercase border-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Abort
          </button>
        </div>
      </div>

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

export default function QuizPage() {
  return (
    <AuthGuard>
      <QuizPageInner />
    </AuthGuard>
  );
}
