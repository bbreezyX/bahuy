/** @jsxImportSource react */
import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";

const STORAGE_KEY = "bahuy-admin";

interface AdminAuthProps {
  children: ReactNode;
  title: string;
}

export default function AdminAuth({
  children,
  title,
}: AdminAuthProps) {
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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const normalizedCode = code.trim();
    if (normalizedCode === import.meta.env.PUBLIC_ADMIN_CODE) {
      sessionStorage.setItem(STORAGE_KEY, normalizedCode);
      setAuthenticated(true);
      return;
    }

    setError("Kode admin tidak cocok. Coba lagi.");
    setCode("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthenticated(false);
    setCode("");
    setError("");
  };

  return (
    <section className="px-4 py-12 md:px-6 md:py-16 lg:px-8">
      {checking ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-primary" />
        </div>
      ) : authenticated ? (
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={handleLogout}
              className="font-condensed text-xs font-semibold uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-primary"
            >
              Logout
            </button>
          </div>
          {children}
        </div>
      ) : (
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="w-full max-w-md text-center">
            <h1 className="font-display text-5xl leading-none tracking-wide text-white md:text-6xl">
              {title}
            </h1>

            <form
              onSubmit={handleSubmit}
              className="mt-8 rounded-[28px] border border-white/10 bg-black/35 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-md md:p-8"
            >
              <label
                htmlFor="admin-code"
                className="mb-3 block text-left font-condensed text-xs font-semibold uppercase tracking-[0.22em] text-white/45"
              >
                Admin code
              </label>
              <input
                id="admin-code"
                type="password"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="MASUKKAN KODE"
                className="h-14 w-full rounded-[20px] border border-white/12 bg-white/[0.04] px-5 text-lg font-condensed uppercase tracking-[0.28em] text-white placeholder:text-white/20 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                autoFocus
                autoComplete="off"
                spellCheck={false}
              />

              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-left text-sm text-red-300"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!code.trim()}
                className="mt-5 inline-flex h-14 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-condensed font-semibold uppercase tracking-[0.22em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Masuk
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
