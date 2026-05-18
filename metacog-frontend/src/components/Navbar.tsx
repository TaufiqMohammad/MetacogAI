"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Brain, Zap, Terminal, Network, User, LogOut, Loader2 } from "lucide-react";
import { audioSynth } from "@/utils/audio";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "HQ", icon: <Terminal className="h-4 w-4 mr-1.5" /> },
  { href: "/quiz", label: "MISSIONS", icon: <Zap className="h-4 w-4 mr-1.5" /> },
  { href: "/skill-tree", label: "SKILL TREE", icon: <Network className="h-4 w-4 mr-1.5" /> },
  { href: "/dashboard", label: "STATS", icon: <Brain className="h-4 w-4 mr-1.5" /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isLoading, signOut } = useAuth();

  const handleSignOut = async () => {
    audioSynth.playTick();
    await signOut();
    router.push("/login");
  };

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

        <div className="flex items-center gap-2">
          {/* Navigation Links */}
          <nav className="flex items-center gap-1">
            {navLinks.map(({ href, label, icon }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => audioSynth.playTick()}
                  className={`group relative flex items-center px-3 py-2 text-sm font-bold uppercase ${
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

          {/* Auth Section */}
          <div className="flex items-center ml-2 pl-2 border-l-2 border-[var(--retro-gray)]">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  id="navbar-profile-link"
                  onClick={() => audioSynth.playTick()}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <div className="h-8 w-8 border-2 border-white overflow-hidden bg-[#333] flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt="avatar"
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <User className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-white uppercase hidden sm:inline">
                    {profile?.username ?? profile?.full_name?.split(" ")[0] ?? "AGENT"}
                  </span>
                </Link>
                <button
                  id="navbar-signout-btn"
                  onClick={handleSignOut}
                  title="Sign out"
                  className="text-gray-400 hover:text-[var(--retro-red)] transition-colors p-1"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                id="navbar-login-link"
                onClick={() => audioSynth.playTick()}
                className="retro-btn px-4 py-2 text-xs font-bold uppercase flex items-center gap-1.5"
              >
                <User className="h-3.5 w-3.5" /> LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
