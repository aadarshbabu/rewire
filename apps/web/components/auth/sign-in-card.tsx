"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function SignInCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authClient.signIn.email({
        email,
        password,
      });

      if (response.error) {
        setError(response.error.message || "Invalid email or password.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 500);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 p-8 shadow-xl backdrop-blur-xl transition-all dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:shadow-2xl dark:shadow-black/50">
        {/* Glow accent */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl dark:from-indigo-500/10 dark:to-purple-500/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-gradient-to-tr from-blue-500/20 to-teal-500/20 blur-3xl dark:from-blue-500/10 dark:to-teal-500/10" />

        <div className="relative">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3.5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-sm text-rose-800 backdrop-blur-sm dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-sm text-emerald-800 backdrop-blur-sm dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Signed in successfully! Redirecting...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading || success}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pr-4 pl-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-indigo-400 dark:focus:bg-zinc-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading || success}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pr-11 pl-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-indigo-400 dark:focus:bg-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="group relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 border-t border-zinc-200/80 pt-6 text-center dark:border-zinc-800/80">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
