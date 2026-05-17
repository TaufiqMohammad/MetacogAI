import Link from "next/link";
import { Brain, BarChart3, ClipboardList } from "lucide-react";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-50 p-3 dark:bg-indigo-950">
          <Brain className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          MetacogAI
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-500 dark:text-gray-400">
          Assess, track, and improve your metacognitive skills through adaptive
          quizzes and visual analytics.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/quiz"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Start Quiz
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            View Dashboard
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: <ClipboardList className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
            title: "Adaptive Quiz",
            description:
              "Answer scenario-based questions designed to surface your metacognitive strengths and blind spots.",
            href: "/quiz",
          },
          {
            icon: <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
            title: "Analytics Dashboard",
            description:
              "Explore your results across six metacognitive dimensions with interactive Recharts visualisations.",
            href: "/dashboard",
          },
          {
            icon: <Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
            title: "Growth Insights",
            description:
              "Receive personalised recommendations to strengthen your self-regulation and reflective thinking.",
            href: "/",
          },
        ].map(({ icon, title, description, href }) => (
          <Link
            key={title}
            href={href}
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-indigo-50 p-2 dark:bg-indigo-950">
              {icon}
            </div>
            <h2 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
