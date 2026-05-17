import Link from "next/link";
import { Brain, BarChart3, ClipboardList, Zap, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#383838] font-mono text-white p-8 relative">
      
      <main className="max-w-5xl mx-auto relative z-10 py-12">
        
        {/* Header Block */}
        <div className="mb-12 border-b-4 border-[var(--retro-gray)] pb-6 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight" style={{ textShadow: "3px 3px 0px #000" }}>
            HQ: COMMAND CENTER
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base uppercase tracking-wider">
            TACTICAL COGNITIVE SIMULATION & telemetry
          </p>
        </div>

        {/* Central Briefing Deck (Main Blue Retro Panel) */}
        <div className="glass-panel p-8 mb-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 relative inline-flex items-center justify-center border-4 border-white bg-black p-4 shadow-[4px_4px_0px_#000]">
              <Brain className="h-12 w-12 text-[var(--retro-yellow)]" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold uppercase text-white mb-4">
              OPERATION: METACOG INITIATIVE
            </h2>
            
            <p className="max-w-2xl text-base text-gray-200 leading-relaxed mb-8 uppercase">
              Welcome, Agent. This simulator is designed to calibrate your cognitive capacity. Through adaptive scenarios, we will identify your metacognitive blind spots, evaluate your self-awareness index, and maximize your intellectual output.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <Link
                href="/quiz"
                className="retro-btn px-8 py-4 text-xl uppercase text-center block"
              >
                LAUNCH SIMULATOR
              </Link>
              <Link
                href="/dashboard"
                className="retro-btn px-8 py-4 text-xl uppercase text-center block bg-black border-4 border-[var(--retro-gray)] hover:bg-[#111] text-white"
              >
                TACTICAL TELEMETRY
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs font-bold text-gray-300 border-t-2 border-white/20 pt-6 w-full max-w-xl">
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-[var(--retro-green)]" /> 100% ADAPTIVE SIMULATOR</span>
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-[var(--retro-yellow)]" /> REAL-TIME CALIBRATION FEEDBACK</span>
            </div>
          </div>
        </div>

        {/* Cognitive Archive - Retro Cards Grid */}
        <div>
          <div className="mb-8 text-center sm:text-left">
            <h3 className="text-2xl font-bold uppercase">TACTICAL MODULES</h3>
            <p className="text-gray-400 text-sm mt-1 uppercase">Select a node to review cognitive capacity.</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <ClipboardList className="h-10 w-10 text-[var(--retro-yellow)]" />,
                title: "ADAPTIVE SIMULATION",
                description:
                  "Face dynamic training scenarios that adapt to your knowledge levels in real-time. Uncover your cognitive gaps and misconceptions.",
                href: "/quiz",
              },
              {
                icon: <BarChart3 className="h-10 w-10 text-[var(--retro-yellow)]" />,
                title: "TACTICAL TELEMETRY",
                description:
                  "Track your progress across core capabilities. Review your quadrant distribution of Mastery, Lucky Guesses, and Danger Zones.",
                href: "/dashboard",
              },
              {
                icon: <Brain className="h-10 w-10 text-[var(--retro-yellow)]" />,
                title: "NEURAL CARTOGRAPHY",
                description:
                  "Unlock advanced nodes using acquired Mind Experience Points (MXP). Map out your learning and cognitive growth pathway.",
                href: "/skill-tree",
              },
            ].map(({ icon, title, description, href }) => (
              <div
                key={title}
                className="flex flex-col justify-between border-4 border-[var(--retro-gray)] bg-black p-6 shadow-[4px_4px_0px_#000]"
              >
                <div>
                  <div className="mb-4 inline-block border-2 border-white bg-[#222] p-3">
                    {icon}
                  </div>
                  <h4 className="mb-3 text-lg font-bold text-white uppercase tracking-wide">
                    {title}
                  </h4>
                  <p className="text-gray-300 text-xs sm:text-sm uppercase leading-relaxed">
                    {description}
                  </p>
                </div>
                
                <div className="mt-8">
                  <Link
                    href={href}
                    className="retro-btn w-full block text-center py-2 text-sm uppercase"
                  >
                    ACCESS MODULE
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
