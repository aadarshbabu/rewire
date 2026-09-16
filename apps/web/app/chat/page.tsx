"use client";

import Link from "next/link";
import { UserButton } from "@/components/auth/user-button";
import { ChatInterface } from "@/components/mental-health/chat-interface";
import { Heart, Sparkles, ArrowLeft } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function ChatPage() {
  const { data: session, isPending } = useSession();

  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Bar */}
      <header className="h-14 shrink-0 border-b border-zinc-200/80 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>

          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white shadow-sm shadow-teal-500/20">
              <Heart className="h-4 w-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Rewire
            </span>
            <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
              Companion
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <UserButton />
        </div>
      </header>

      {/* Main Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
