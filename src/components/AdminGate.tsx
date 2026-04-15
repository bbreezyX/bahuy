/** @jsxImportSource react */
import { useState, useEffect } from "react";
import type { Member } from "@/data/members";
import ScheduleView from "./ScheduleView";

interface AdminGateProps {
  members: Member[];
}

const STORAGE_KEY = "bahuy-admin";

export default function AdminGate({ members }: AdminGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === import.meta.env.PUBLIC_ADMIN_CODE) {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (code === import.meta.env.PUBLIC_ADMIN_CODE) {
      sessionStorage.setItem(STORAGE_KEY, code);
      setAuthenticated(true);
    } else {
      setError("Kode salah. Coba lagi.");
      setCode("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthenticated(false);
    setCode("");
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-white/10 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 text-center">
          {/* Lock icon */}
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center">
              <svg className="w-7 h-7 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-wide text-white mb-2">
              ADMIN ACCESS
            </h2>
            <p className="font-[var(--font-condensed)] text-sm text-white/40 tracking-wide">
              Masukkan kode admin untuk mengelola jadwal.
            </p>
          </div>

          <div>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Masukkan kode..."
              autoFocus
              className="w-full h-12 rounded-[var(--radius)] border border-white/[0.12] bg-white/[0.08] px-4 text-center text-lg text-white placeholder:text-white/20 font-[var(--font-condensed)] tracking-[0.3em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/30 transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 font-[var(--font-body)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={!code.trim()}
            className="w-full py-3 rounded-[var(--radius)] bg-primary text-primary-foreground font-[var(--font-condensed)] text-sm uppercase tracking-[0.2em] font-semibold hover:bg-primary/90 transition-colors disabled:opacity-30 cursor-pointer"
          >
            Masuk
          </button>

          <a
            href="/schedule"
            className="inline-block font-[var(--font-condensed)] text-xs uppercase tracking-[0.15em] text-white/30 hover:text-white/50 transition-colors"
          >
            &larr; Kembali ke Schedule
          </a>
        </form>
      </div>
    );
  }

  // Authenticated — show admin view
  return (
    <div>
      {/* Admin bar */}
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-primary border border-primary">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
            <span className="font-[var(--font-condensed)] text-xs sm:text-sm uppercase tracking-[0.15em] text-primary-foreground font-medium">
              Admin Mode
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="font-[var(--font-condensed)] text-xs uppercase tracking-[0.12em] text-primary-foreground/70 hover:text-primary-foreground transition-colors cursor-pointer px-3 py-1 rounded-full border border-primary-foreground/20 hover:border-primary-foreground/40"
          >
            Logout
          </button>
        </div>
      </div>

      <ScheduleView members={members} isAdmin={true} />
    </div>
  );
}
