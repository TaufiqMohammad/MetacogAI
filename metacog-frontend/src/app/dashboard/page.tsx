import MatrixDashboard, { DashboardDataPoint } from "@/components/MatrixDashboard";
import AbilityRadarChart from "@/components/AbilityRadarChart";
import { AlertOctagon, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

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
    userAnswerText: "Stack and Registers", // Actually shares Heap/Code/Data, has its own stack
    confidenceLevel: "certain",
    isCorrect: false,
  },
  {
    id: "h6",
    topic: "Databases",
    questionText: "Which isolation level prevents phantom reads?",
    userAnswerText: "Repeatable Read", // Actually it's Serializable
    confidenceLevel: "certain",
    isCorrect: false,
  },
  {
    id: "h7",
    topic: "Networking",
    questionText: "Which layer of the OSI model handles routing?",
    userAnswerText: "Transport Layer", // Actually it's Network Layer
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
    userAnswerText: "Semantic Analysis", // Actually Syntax Analysis (Parsing)
    confidenceLevel: "doubtful",
    isCorrect: false,
  },
  {
    id: "h12",
    topic: "Computer Architecture",
    questionText: "What is the primary function of a TLB?",
    userAnswerText: "Caching data from main memory", // Actually caches page table entries
    confidenceLevel: "guessing",
    isCorrect: false,
  },
  {
    id: "h13",
    topic: "Cryptography",
    questionText: "RSA algorithm is based on the difficulty of?",
    userAnswerText: "Discrete Logarithm", // Actually Integer Factorization
    confidenceLevel: "guessing",
    isCorrect: false,
  },
  {
    id: "h14",
    topic: "Software Engineering",
    questionText: "In Agile, what is a 'Spike'?",
    userAnswerText: "A sudden increase in bugs", // Actually a research task to reduce risk
    confidenceLevel: "doubtful",
    isCorrect: false,
  },
];

export default function DashboardPage() {
  // Filter out the 'Danger Zone' points (Incorrect, Certain)
  const criticalFixes = MOCK_HISTORY.filter(
    (point) => !point.isCorrect && point.confidenceLevel === "certain"
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Metacognitive Analytics
        </h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Visualize the relationship between your actual performance and your confidence levels.
        </p>
      </div>

      {/* Charts Grid */}
      <div className="mb-12 grid gap-8 lg:grid-cols-2">
        {/* Matrix Dashboard Component */}
        <div className="h-[400px] lg:h-auto">
          <MatrixDashboard data={MOCK_HISTORY} />
        </div>
        
        {/* Ability Graph Component */}
        <div>
          <AbilityRadarChart />
        </div>
      </div>

      {/* Critical Fixes Panel */}
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 shadow-sm dark:border-red-900/50 dark:bg-red-950/20">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
            <AlertOctagon className="h-6 w-6 text-red-600 dark:text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Critical Fixes Needed
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You were highly confident about these answers, but they were incorrect. This indicates a strong misconception.
            </p>
          </div>
        </div>

        {criticalFixes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {criticalFixes.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-red-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-red-900/50 dark:bg-gray-900"
              >
                <div>
                  <span className="mb-3 inline-block rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-400">
                    {item.topic}
                  </span>
                  <p className="mb-2 text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                    {item.questionText}
                  </p>
                </div>
                <div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">You Answered:</p>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    {item.userAnswerText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-12 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-gray-500 dark:text-gray-400">
              No critical misconceptions detected yet! Keep up the good work.
            </p>
          </div>
        )}
      </div>

      {/* Legend / Quick Guide */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Mastery",
            desc: "Correct & Certain",
            icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
            bg: "bg-green-50 dark:bg-green-950/50",
            border: "border-green-200 dark:border-green-900",
          },
          {
            title: "Danger Zone",
            desc: "Incorrect & Certain",
            icon: <AlertOctagon className="h-5 w-5 text-red-600" />,
            bg: "bg-red-50 dark:bg-red-950/50",
            border: "border-red-200 dark:border-red-900",
          },
          {
            title: "Lucky Guess",
            desc: "Correct & Unsure",
            icon: <HelpCircle className="h-5 w-5 text-sky-600" />,
            bg: "bg-sky-50 dark:bg-sky-950/50",
            border: "border-sky-200 dark:border-sky-900",
          },
          {
            title: "Foundational Gap",
            desc: "Incorrect & Unsure",
            icon: <AlertTriangle className="h-5 w-5 text-gray-600" />,
            bg: "bg-gray-50 dark:bg-gray-900",
            border: "border-gray-200 dark:border-gray-800",
          },
        ].map((item) => (
          <div
            key={item.title}
            className={`flex items-center gap-4 rounded-xl border p-4 ${item.bg} ${item.border}`}
          >
            {item.icon}
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.title}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
