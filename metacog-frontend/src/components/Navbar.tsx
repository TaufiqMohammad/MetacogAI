"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Zap, Terminal, Network } from "lucide-react";
import { audioSynth } from "@/utils/audio";

const navLinks = [
  { href: "/", label: "HQ", icon: <Terminal className="h-4 w-4 mr-1.5" /> },
  { href: "/quiz", label: "MISSIONS", icon: <Zap className="h-4 w-4 mr-1.5" /> },
  { href: "/skill-tree", label: "SKILL TREE", icon: <Network className="h-4 w-4 mr-1.5" /> },
  { href: "/dashboard", label: "STATS", icon: <Brain className="h-4 w-4 mr-1.5" /> },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b-4 border-[var(--retro-gray)] bg-[#222] font-mono">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <Link
          href="/"
          onClick={() => audioSynth.playTick()}
          className="group flex items-center gap-2 font-bold text-white transition-all"
        >
          <div className="relative flex items-center justify-center border-2 border-white bg-[var(--retro-blue)] p-1.5 shadow-[2px_2px_0px_#fff]">
            <Brain className="h-5 w-5" />
          </div>
          <span className="text-xl tracking-tight uppercase ml-2 text-white font-bold" style={{textShadow: "2px 2px 0px #000"}}>METACOG AI</span>
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
                onClick={() => audioSynth.playTick()}
                className={`group relative flex items-center px-4 py-2 text-sm font-bold uppercase ${
                  isActive
                    ? "bg-[var(--retro-blue)] text-white border-2 border-white"
                    : "text-gray-400 hover:bg-white hover:text-black hover:border-2 hover:border-black"
                }`}
              >
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
