"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import MatrixDashboard, { DashboardDataPoint } from "@/components/MatrixDashboard";
import AbilityRadarChart from "@/components/AbilityRadarChart";
import { AlertOctagon, CheckCircle2, AlertTriangle, HelpCircle, Terminal, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

// Mock history data distributed across all 4 quadrants
const MOCK_HISTORY: DashboardDataPoint[] = [
  // Mastery (Correct, Certain)
  {
    id: "h1",
    topic: "Data Structures",
    questionText: "Which data structure uses LIFO?",
    userAnswerText: "Stack",
    confidenceLevel: "certain",
    isCorrect: true,
  },
  {
    id: "h2",
    topic: "Calculus",
    questionText: "What is the derivative of e^x?",
    userAnswerText: "e^x",
    confidenceLevel: "certain",
    isCorrect: true,
  },
  {
    id: "h3",
    topic: "Linear Algebra",
    questionText: "The determinant of an identity matrix is?",
    userAnswerText: "1",
    confidenceLevel: "certain",
    isCorrect: true,
  },
  {
    id: "h4",
    topic: "Algorithms",
    questionText: "What is the time complexity of Binary Search?",
    userAnswerText: "O(log n)",
    confidenceLevel: "certain",
    isCorrect: true,
  },
  
  // Danger Zone (Incorrect, Certain)
  {
    id: "h5",
    topic: "Operating Systems",
    questionText: "A thread shares which of the following with other threads?",
    userAnswerText: "Stack and Registers",
    confidenceLevel: "certain",
    isCorrect: false,
  },
  {
    id: "h6",
    topic: "Databases",
    questionText: "Which isolation level prevents phantom reads?",
    userAnswerText: "Repeatable Read",
    confidenceLevel: "certain",
    isCorrect: false,
  },
  {
    id: "h7",
    topic: "Networking",
    questionText: "Which layer of the OSI model handles routing?",
    userAnswerText: "Transport Layer",
    confidenceLevel: "certain",
    isCorrect: false,
  },

  // Lucky Guess (Correct, Doubtful/Guessing)
  {
    id: "h8",
    topic: "Machine Learning",
    questionText: "What is the purpose of the ReLU activation function?",
    userAnswerText: "To introduce non-linearity",
    confidenceLevel: "guessing",
    isCorrect: true,
  },
  {
    id: "h9",
    topic: "Discrete Math",
    questionText: "How many subsets does a set of n elements have?",
    userAnswerText: "2^n",
    confidenceLevel: "doubtful",
    isCorrect: true,
  },
  {
    id: "h10",
    topic: "System Design",
    questionText: "Which consistency model does Cassandra typically use?",
    userAnswerText: "Eventual Consistency",
    confidenceLevel: "doubtful",
    isCorrect: true,
  },

  // Foundational Gap (Incorrect, Doubtful/Guessing)
  {
    id: "h11",
    topic: "Compilers",
    questionText: "What phase comes after lexical analysis?",
    userAnswerText: "Semantic Analysis",
    confidenceLevel: "doubtful",
    isCorrect: false,
  },
  {
    id: "h12",
    topic: "Computer Architecture",
    questionText: "What is the primary function of a TLB?",
    userAnswerText: "Caching data from main memory",
    confidenceLevel: "guessing",
    isCorrect: false,
  },
  {
    id: "h13",
    topic: "Cryptography",
    questionText: "RSA algorithm is based on the difficulty of?",
    userAnswerText: "Discrete Logarithm",
    confidenceLevel: "guessing",
    isCorrect: false,
  },
  {
    id: "h14",
    topic: "Software Engineering",
    questionText: "In Agile, what is a 'Spike'?",
    userAnswerText: "A sudden increase in bugs",
    confidenceLevel: "doubtful",
    isCorrect: false,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [dataPoints, setDataPoints] = useState<DashboardDataPoint[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from("user_responses")
          .select("*, questions(*)")
          .eq("user_id", user.id);
        
        if (!error && data && data.length > 0) {
          // Map to DashboardDataPoint structure
          const mappedData = data.map((row: any) => ({
            id: row.id,
            topic: row.subject || "General",
            questionText: row.questions?.questionText || "Quiz Question",
            userAnswerText: row.questions?.options?.[row.selected_answer_index] || `Selected Option #${row.selected_answer_index + 1}`,
            confidenceLevel: row.confidence_level.toLowerCase(),
            isCorrect: row.is_correct,
          }));
          setDataPoints(mappedData);
          setIsDemoMode(false);
        } else {
          // Fallback to Mock history if no real data exists yet
          setDataPoints(MOCK_HISTORY);
          setIsDemoMode(true);
        }
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    
    fetchHistory();
  }, [user]);

  const criticalFixes = dataPoints.filter(
    (point) => !point.isCorrect && point.confidenceLevel === "certain"
  );

  return (
    <AuthGuard>
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-mono text-white">
      {/* Header */}
      <div className="mb-8 border-b-4 border-[var(--retro-gray)] pb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase flex items-center gap-3">
            <Terminal className="h-8 w-8 text-white" />
            METACOGNITIVE STATS
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            PERFORMANCE VS. CALIBRATION MATRIX
          </p>
        </div>
        {isDemoMode && !isLoadingHistory && (
          <div className="border-2 border-[var(--retro-red)] bg-red-950/30 px-3 py-1.5 text-xs text-[var(--retro-red)] font-bold animate-pulse text-glow-red select-none">
            [DEMO ARCHIVE ACTIVE - TAKE A QUIZ TO SYNC LIVE INTEL]
          </div>
        )}
        {!isDemoMode && !isLoadingHistory && (
          <div className="border-2 border-[#22c55e] bg-[#14532d]/30 px-3 py-1.5 text-xs text-[#22c55e] font-bold select-none">
            [LIVE CONNECTION SYNCD - REAL PERFORMANCE ACTIVE]
          </div>
        )}
      </div>

      {isLoadingHistory ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--retro-yellow)]" />
          <p className="mt-4 text-sm animate-pulse text-gray-400">RETRIEVING INTEL FILES...</p>
        </div>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="mb-12 grid gap-8 lg:grid-cols-2">
            <MatrixDashboard data={dataPoints} />
            <AbilityRadarChart />
          </div>

      {/* Critical Fixes Panel */}
      <div className="border-4 border-[var(--retro-red)] bg-[#222] p-6 shadow-[0_0_20px_rgba(213,0,0,0.5)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="bg-[var(--retro-red)] text-white p-2 animate-pulse">
            <AlertOctagon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--retro-red)] uppercase">
              DANGER ZONE ANOMALIES
            </h2>
            <p className="text-sm text-gray-400 uppercase mt-1">
              HIGH CONFIDENCE / INCORRECT. STRONG MISCONCEPTIONS DETECTED.
            </p>
          </div>
        </div>

        {criticalFixes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {criticalFixes.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between border-4 border-[var(--retro-red)] bg-black p-5 transition hover:bg-[#111]"
              >
                <div>
                  <span className="mb-3 inline-block bg-[var(--retro-red)] px-2 py-1 text-xs font-bold text-white uppercase">
                    [{item.topic}]
                  </span>
                  <p className="mb-2 text-sm font-bold text-white line-clamp-2">
                    {item.questionText}
                  </p>
                </div>
                <div className="mt-4 border-t-2 border-[var(--retro-red)] pt-3">
                  <p className="text-xs text-gray-400 uppercase">SUBMITTED VALUE:</p>
                  <p className="text-sm font-bold text-[var(--retro-yellow)]">
                    {item.userAnswerText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center border-4 border-dashed border-[var(--retro-gray)] bg-black py-12">
            <p className="text-gray-400 font-bold uppercase">
              NO CRITICAL MISCONCEPTIONS DETECTED.
            </p>
          </div>
        )}
      </div>

      {/* Legend / Quick Guide */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "MASTERY",
            desc: "VALID & CERTAIN",
            icon: <CheckCircle2 className="h-5 w-5 text-[#22c55e]" />,
            bg: "bg-[#22c55e]/20",
            border: "border-[#22c55e]",
            textColor: "text-[#22c55e]",
          },
          {
            title: "DANGER ZONE",
            desc: "INVALID & CERTAIN",
            icon: <AlertOctagon className="h-5 w-5 text-[var(--retro-red)]" />,
            bg: "bg-[var(--retro-red)]/20",
            border: "border-[var(--retro-red)]",
            textColor: "text-[var(--retro-red)]",
          },
          {
            title: "LUCKY GUESS",
            desc: "VALID & UNSURE",
            icon: <HelpCircle className="h-5 w-5 text-[#f59e0b]" />,
            bg: "bg-[#f59e0b]/20",
            border: "border-[#f59e0b]",
            textColor: "text-[#f59e0b]",
          },
          {
            title: "FOUNDATIONAL GAP",
            desc: "INVALID & UNSURE",
            icon: <AlertTriangle className="h-5 w-5 text-[#06b6d4]" />,
            bg: "bg-[#06b6d4]/20",
            border: "border-[#06b6d4]",
            textColor: "text-[#06b6d4]",
          },
        ].map((item) => (
          <div
            key={item.title}
            className={`flex items-center gap-4 border-4 p-4 transition-all hover:bg-black bg-black ${item.border}`}
          >
            {item.icon}
            <div>
              <p className={`text-sm font-bold ${item.textColor}`}>
                {item.title}
              </p>
              <p className={`text-xs ${item.textColor} opacity-70`}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
        </>
      )}
    </section>
    </AuthGuard>
  );
}
