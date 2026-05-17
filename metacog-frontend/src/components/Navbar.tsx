"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Zap, Terminal } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: <Terminal className="h-4 w-4 mr-1.5" /> },
  { href: "/quiz", label: "Mission", icon: <Zap className="h-4 w-4 mr-1.5" /> },
  { href: "/dashboard", label: "Stats", icon: <Brain className="h-4 w-4 mr-1.5" /> },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/70 transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2 font-bold text-slate-900 dark:text-white transition-all hover:scale-105"
        >
          <div className="relative flex items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 p-1.5 shadow-lg group-hover:shadow-indigo-500/50 transition-shadow">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl tracking-tight text-gradient">MetacogAI</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2">
          {navLinks.map(({ href, label, icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`group relative flex items-center rounded-lg px-4 py-2 text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-lg bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]"></span>
                )}
                <span className="relative z-10 flex items-center">
                  {icon}
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
