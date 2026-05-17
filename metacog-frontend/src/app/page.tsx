import Link from "next/link";
import { Brain, BarChart3, ClipboardList, Sparkles, Zap, Shield, ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50">
      {/* Background Animated Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute top-0 -left-4 w-72 h-72 rounded-full bg-indigo-500/20 mix-blend-multiply blur-3xl filter dark:mix-blend-screen opacity-70"></div>
        <div className="animate-blob animation-delay-2000 absolute top-0 -right-4 w-72 h-72 rounded-full bg-fuchsia-500/20 mix-blend-multiply blur-3xl filter dark:mix-blend-screen opacity-70"></div>
        <div className="animate-blob animation-delay-4000 absolute -bottom-8 left-20 w-72 h-72 rounded-full bg-pink-500/20 mix-blend-multiply blur-3xl filter dark:mix-blend-screen opacity-70"></div>
      </div>

      <main className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center animate-slide-up">
          
          <div className="animate-float mb-8 relative inline-flex items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-indigo-400 opacity-20"></div>
            <div className="relative rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px]">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-slate-900">
                <Brain className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            {/* Sparkle Badges */}
            <div className="absolute -right-4 -top-4 rounded-full bg-amber-400 p-1.5 shadow-lg animate-bounce">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>

          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
            <span className="block text-slate-900 dark:text-white mb-2">Master Your</span>
            <span className="text-gradient">Metacognition</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 md:text-xl leading-relaxed">
            Level up your brain! Assess, track, and improve your cognitive skills through highly adaptive, scenario-based challenges. Earn insights and unlock your true potential.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/quiz"
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0"></div>
              <span className="relative flex items-center gap-2">
                <Zap className="h-5 w-5 fill-current" />
                Start Mission
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="group flex items-center justify-center gap-2 rounded-xl glass-panel px-8 py-4 text-lg font-bold text-slate-800 dark:text-white transition-all hover:scale-105 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 active:scale-95"
            >
              <BarChart3 className="h-5 w-5" />
              View Stats
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-green-500" /> 100% Adaptive</span>
            <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> Instant Feedback</span>
          </div>
        </div>

        {/* Feature Cards - The "Arsenal" */}
        <div className="mt-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Your Cognitive Arsenal</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Tools to map your mind and accelerate growth.</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <ClipboardList className="h-8 w-8 text-indigo-500" />,
                title: "Adaptive Challenges",
                description:
                  "Face dynamic scenarios that adapt to your skill level. Discover your metacognitive blind spots in real-time.",
                href: "/quiz",
                color: "from-blue-500/10 to-indigo-500/10",
                borderColor: "group-hover:border-indigo-500/50",
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-fuchsia-500" />,
                title: "XP & Analytics",
                description:
                  "Track your progress across six dimensions. Watch your stats grow with interactive, beautifully crafted charts.",
                href: "/dashboard",
                color: "from-fuchsia-500/10 to-pink-500/10",
                borderColor: "group-hover:border-fuchsia-500/50",
              },
              {
                icon: <Brain className="h-8 w-8 text-amber-500" />,
                title: "Skill Trees",
                description:
                  "Unlock personalized pathways. Receive targeted recommendations to master self-regulation and reflection.",
                href: "/",
                color: "from-amber-500/10 to-orange-500/10",
                borderColor: "group-hover:border-amber-500/50",
              },
            ].map(({ icon, title, description, href, color, borderColor }, idx) => (
              <Link
                key={title}
                href={href}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl glass-panel p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-indigo-500/10 ${borderColor} animate-slide-up`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity group-hover:opacity-100`}></div>
                
                <div className="relative z-10">
                  <div className="mb-6 inline-flex rounded-xl bg-white/80 dark:bg-slate-900/80 p-4 shadow-sm backdrop-blur-md">
                    {icon}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {description}
                  </p>
                </div>
                
                <div className="relative z-10 mt-8 flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                  Explore <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
