"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Lock } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
        <p className="text-gray-400 text-sm uppercase font-bold animate-pulse">
          Verifying credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Lock className="h-10 w-10 text-[var(--retro-red)]" />
        <p className="text-[var(--retro-red)] font-bold uppercase">Access denied. Redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;
}
