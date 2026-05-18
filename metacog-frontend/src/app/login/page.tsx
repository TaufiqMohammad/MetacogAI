"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Lock, Mail, User, Eye, EyeOff, Zap, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    if (isRegister) {
      if (!fullName.trim()) {
        setError("Full name is required.");
        setIsSubmitting(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error);
      } else {
        setSuccessMsg("Account created! Check your email to confirm, then log in.");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        router.push("/");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center border-4 border-white bg-[var(--retro-blue)] p-4 shadow-[4px_4px_0px_#000] mb-4">
            <Brain className="h-10 w-10 text-[var(--retro-yellow)]" />
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-tight" style={{ textShadow: "3px 3px 0px #000" }}>
            METACOG AI
          </h1>
          <p className="text-gray-400 text-sm uppercase mt-1 tracking-widest">
            {isRegister ? "RECRUIT REGISTRATION" : "AGENT AUTHENTICATION"}
          </p>
        </div>

        {/* Panel */}
        <div className="glass-panel p-8">
          <h2 className="text-xl font-bold uppercase mb-6 border-b-2 border-white/30 pb-3 flex items-center gap-2">
            <Lock className="h-5 w-5 text-[var(--retro-yellow)]" />
            {isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
          </h2>

          {error && (
            <div className="mb-4 flex items-start gap-2 border-4 border-[var(--retro-red)] bg-black p-3 text-[var(--retro-red)] text-sm font-bold">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span className="uppercase">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 border-4 border-[var(--retro-green)] bg-black p-3 text-[var(--retro-green)] text-sm font-bold uppercase">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="register-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="w-full bg-black border-4 border-[var(--retro-gray)] text-white font-mono pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white placeholder-gray-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@example.com"
                  required
                  className="w-full bg-black border-4 border-[var(--retro-gray)] text-white font-mono pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white placeholder-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-black border-4 border-[var(--retro-gray)] text-white font-mono pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-white placeholder-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="retro-btn w-full py-4 text-base font-bold uppercase flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="h-5 w-5" />
              {isSubmitting
                ? "PROCESSING..."
                : isRegister
                ? "CREATE ACCOUNT"
                : "ACCESS SYSTEM"}
            </button>
          </form>

          <div className="mt-6 text-center border-t-2 border-white/20 pt-5">
            <span className="text-gray-400 text-xs uppercase">
              {isRegister ? "Already a recruit?" : "No account yet?"}
            </span>{" "}
            <button
              id="auth-toggle-btn"
              onClick={() => {
                setIsRegister((v) => !v);
                setError(null);
                setSuccessMsg(null);
              }}
              className="text-[var(--retro-yellow)] font-bold text-xs uppercase hover:underline"
            >
              {isRegister ? "SIGN IN" : "REGISTER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
