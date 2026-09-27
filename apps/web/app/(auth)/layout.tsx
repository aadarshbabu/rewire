import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-teal-500 selection:text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[35%] left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-b from-teal-500/15 via-emerald-500/10 to-transparent blur-3xl dark:from-teal-500/10 dark:via-emerald-500/5" />
        <div className="absolute -bottom-[20%] right-[10%] h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-teal-500/10 to-emerald-500/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-teal-600 dark:text-zinc-400 dark:hover:text-teal-400 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to home</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Heart className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Rewire
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-zinc-400 dark:text-zinc-600">
        &copy; {new Date().getFullYear()} Rewire. Protected by Better Auth.
      </footer>
    </div>
  );
}
