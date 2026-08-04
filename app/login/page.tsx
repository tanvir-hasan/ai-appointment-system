"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CalendarDays, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-6">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-3xl" />

      </div>

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/90 p-10 shadow-2xl backdrop-blur-xl">

        {/* Logo */}

        <div className="mb-10 text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30">

            <CalendarDays className="h-10 w-10 text-white" />

          </div>

          <h1 className="mt-6 text-3xl font-bold text-white">
            CareFlow AI
          </h1>

          <p className="mt-2 text-zinc-400">
            Smart Clinic Management Platform
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>

            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Email
            </label>

            <input
              type="email"
              placeholder="doctor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 text-white outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              required
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 text-white outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              required
            />

          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold text-white transition hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60"
          >

            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}

          </button>

        </form>

        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">

          <div className="flex items-center gap-3">

            <ShieldCheck className="h-6 w-6 text-emerald-400" />

            <div>

              <p className="text-sm font-semibold text-white">
                Secure Authentication
              </p>

              <p className="text-xs text-zinc-400">
                Powered by Supabase Authentication
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}