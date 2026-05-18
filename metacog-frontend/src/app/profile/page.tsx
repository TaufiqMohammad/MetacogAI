"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Camera,
  Save,
  LogOut,
  Zap,
  Shield,
  Terminal,
  Edit3,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, profile, isLoading, signOut, updateProfile, uploadAvatar } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // Populate fields from profile
  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? "");
      setAvatarPreview(profile.avatar_url ?? null);
    }
  }, [profile]);

  const mxp =
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem("metacog_mxp") ?? "0", 10)
      : 0;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Local preview immediately
    setAvatarPreview(URL.createObjectURL(file));
    setIsUploading(true);
    setErrorMsg(null);
    const { url, error } = await uploadAvatar(file);
    if (error) {
      setErrorMsg(error);
      setIsUploading(false);
      return;
    }
    if (url) {
      const { error: updateErr } = await updateProfile({ avatar_url: url });
      if (updateErr) setErrorMsg(updateErr);
      else {
        setAvatarPreview(url);
        showSuccess("Avatar updated!");
      }
    }
    setIsUploading(false);
  };

  const handleSaveUsername = async () => {
    if (!username.trim()) {
      setErrorMsg("Username cannot be empty.");
      return;
    }
    setIsSaving(true);
    setErrorMsg(null);
    const { error } = await updateProfile({ username: username.trim() });
    if (error) setErrorMsg(error);
    else showSuccess("Username saved!");
    setIsSaving(false);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 border-b-4 border-[var(--retro-gray)] pb-4">
        <h1 className="text-3xl font-bold uppercase flex items-center gap-3" style={{ textShadow: "3px 3px 0px #000" }}>
          <Terminal className="h-8 w-8 text-[var(--retro-yellow)]" />
          AGENT PROFILE
        </h1>
        <p className="text-gray-400 text-sm mt-1 uppercase tracking-wider">
          Customize your operative identity
        </p>
      </div>

      {/* Feedback banners */}
      {successMsg && (
        <div className="mb-5 flex items-center gap-2 border-4 border-[var(--retro-green)] bg-black px-4 py-3 text-[var(--retro-green)] font-bold text-sm uppercase">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-5 flex items-center gap-2 border-4 border-[var(--retro-red)] bg-black px-4 py-3 text-[var(--retro-red)] font-bold text-sm uppercase">
          <AlertCircle className="h-4 w-4 shrink-0" /> {errorMsg}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">

        {/* Avatar Card */}
        <div className="glass-panel p-6 flex flex-col items-center gap-5">
          <h2 className="text-lg font-bold uppercase self-start border-b-2 border-white/30 pb-2 w-full">
            PROFILE PHOTO
          </h2>
          <div className="relative group">
            <div className="h-28 w-28 border-4 border-white shadow-[4px_4px_0px_#000] overflow-hidden bg-[#222] flex items-center justify-center">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar"
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <User className="h-12 w-12 text-gray-500" />
              )}
            </div>
            <button
              id="avatar-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute -bottom-3 -right-3 bg-[var(--retro-yellow)] text-black border-4 border-black p-1.5 shadow-[2px_2px_0px_#000] hover:bg-white disabled:opacity-60"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="text-center mt-2">
            <p className="text-white font-bold uppercase text-base">
              {profile?.username ?? profile?.full_name ?? "Agent"}
            </p>
            <p className="text-gray-400 text-xs mt-1">{user.email}</p>
          </div>
          <button
            id="signout-btn"
            onClick={handleSignOut}
            className="mt-auto w-full flex items-center justify-center gap-2 border-4 border-[var(--retro-red)] bg-black text-[var(--retro-red)] font-bold uppercase py-2.5 text-sm hover:bg-[var(--retro-red)] hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" /> SIGN OUT
          </button>
        </div>

        {/* Info + Stats */}
        <div className="flex flex-col gap-5">

          {/* Username */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold uppercase mb-4 border-b-2 border-white/30 pb-2 flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-[var(--retro-yellow)]" /> USERNAME
            </h2>
            <div className="flex gap-2">
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a callsign..."
                maxLength={20}
                className="flex-1 bg-black border-4 border-[var(--retro-gray)] text-white font-mono px-3 py-2.5 text-sm focus:outline-none focus:border-white placeholder-gray-600"
              />
              <button
                id="save-username-btn"
                onClick={handleSaveUsername}
                disabled={isSaving}
                className="retro-btn px-4 py-2.5 flex items-center gap-1.5 text-sm font-bold uppercase disabled:opacity-60"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                SAVE
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-2 uppercase">Max 20 characters</p>
          </div>

          {/* Stats */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold uppercase mb-4 border-b-2 border-white/30 pb-2">
              MISSION STATS
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black border-4 border-[var(--retro-gray)] p-4 flex flex-col items-center">
                <Zap className="h-6 w-6 text-[var(--retro-yellow)] fill-current mb-1" />
                <span className="text-2xl font-bold text-white">{mxp}</span>
                <span className="text-[10px] text-gray-400 uppercase mt-0.5">Total MXP</span>
              </div>
              <div className="bg-black border-4 border-[var(--retro-gray)] p-4 flex flex-col items-center">
                <Shield className="h-6 w-6 text-[var(--retro-blue)] mb-1" />
                <span className="text-2xl font-bold text-white">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : "—"}
                </span>
                <span className="text-[10px] text-gray-400 uppercase mt-0.5">Enlisted</span>
              </div>
            </div>
          </div>

          {/* Account info */}
          <div className="border-4 border-[var(--retro-gray)] bg-black p-4">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Account Email</p>
            <p className="text-sm text-white font-mono">{user.email}</p>
            <p className="text-xs text-gray-500 uppercase font-bold mt-3 mb-1">Agent ID</p>
            <p className="text-xs text-gray-600 font-mono break-all">{user.id}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
