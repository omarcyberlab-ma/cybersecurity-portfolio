import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "../integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(signInError.message);
        } else {
          navigate({ to: "/admin" });
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
          setError(signUpError.message);
        } else {
          setMessage("Account created! You can now sign in.");
          setMode("signin");
        }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <a href="/" className="text-[var(--accent)] font-mono text-lg no-underline">
            <span className="text-[var(--muted-foreground)]">~</span>/portfolio
          </a>
        </div>

        <div className="border border-[var(--border)] rounded-xl p-8 bg-[var(--card)]">
          <div className="section-marker mb-1">// authentication</div>
          <h1 className="text-2xl font-mono font-bold mb-6">{mode === "signin" ? "Sign in" : "Sign up"}</h1>

          {message && (
            <div className="text-sm font-mono text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-md px-3 py-2 mb-4">{message}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-[var(--muted-foreground)] mb-1">Email</label>
              <input
                className="flex h-9 w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:opacity-50 font-mono"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-[var(--muted-foreground)] mb-1">Password</label>
              <input
                className="flex h-9 w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:opacity-50 font-mono"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-sm font-mono text-[var(--destructive)] bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 rounded-md px-3 py-2">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 font-mono bg-[var(--accent)] text-[#0a0e14] hover:brightness-110 h-9 px-4 py-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-[#0a0e14] border-t-transparent rounded-full animate-spin" />
                  {mode === "signin" ? "signing in..." : "creating account..."}
                </span>
              ) : (
                mode === "signin" ? "sign in →" : "create account →"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setMessage(""); }}
              className="text-xs font-mono text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors bg-transparent border-none cursor-pointer"
            >
              {mode === "signin" ? "no account? sign up" : "already have one? sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
