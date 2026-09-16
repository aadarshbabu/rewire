import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[40%] left-[20%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-[120px]" />
        <div className="absolute -bottom-[30%] right-[10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-500/10 to-teal-500/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to home</span>
        </Link>
        <Link
          href="/"
          className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Rewire
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
