"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { UserButton } from "@/components/auth/user-button";
import { BreathingWidget } from "@/components/mental-health/breathing-widget";
import { CrisisModal } from "@/components/mental-health/crisis-modal";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Wind,
  Brain,
  MessageSquare,
  ArrowRight,
  PhoneCall,
  Lock,
  Compass,
  CheckCircle2,
  LifeBuoy,
  ChevronRight,
  Smile,
  AlertTriangle,
  PenTool,
  Flame,
} from "lucide-react";

export default function Home() {
  const { data: session, isPending } = useSession();
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);

  const MOOD_CHECKINS = [
    { label: "Anxious & Racing", icon: Wind, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/40", prompt: "I am feeling anxious and my mind is racing right now." },
    { label: "Overwhelmed", icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40", prompt: "I am feeling completely overwhelmed by everything on my plate." },
    { label: "Down & Exhausted", icon: Heart, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/40", prompt: "I feel exhausted, emotionally heavy, and down today." },
    { label: "Seeking Calm", icon: Compass, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/40", prompt: "I would like to do a peaceful reflection exercise to center myself." },
    { label: "Hopeful & Grounded", icon: Smile, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", prompt: "I am feeling more grounded today and want to build on this positive momentum." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-teal-500 selection:text-white">
      {/* Crisis Modal */}
      <CrisisModal isOpen={isCrisisModalOpen} onClose={() => setIsCrisisModalOpen(false)} />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/20">
              <Heart className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                Rewire
              </span>
              <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 tracking-wide uppercase">
                Mental Health Companion
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick 24/7 Crisis Access */}
            <button
              onClick={() => setIsCrisisModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 transition-colors"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Crisis Resources (988)</span>
              <span className="sm:hidden">988</span>
            </button>

            {session?.user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/offload"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-600/50 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300 transition-colors"
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>Brain Dump</span>
                </Link>
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-teal-500/20 hover:from-teal-500 hover:to-emerald-500 transition-all"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Open Companion</span>
                </Link>
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/offload"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300 transition-colors"
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>Brain Dump</span>
                </Link>
                <Link
                  href="/sign-in"
                  className="rounded-xl px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-1 rounded-xl bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-teal-700 transition-colors"
                >
                  <span>Get Started</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-14 pb-20 md:pt-20 md:pb-28">
          {/* Calming Organic Atmosphere Gradients */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[900px] rounded-full bg-gradient-to-b from-teal-500/15 via-emerald-500/10 to-transparent blur-3xl dark:from-teal-500/10 dark:via-emerald-500/5" />

          <div className="relative mx-auto max-w-5xl px-6 text-center">
            {/* Safety & Empathy Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-4 py-1 text-xs font-medium text-teal-800 backdrop-blur-sm dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300 mb-6">
              <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span>Compassionate • Evidence-Informed • 100% Confidential</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl md:text-7xl leading-tight">
              A Safe, Empathetic Space <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                For Your Mind & Heart
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-600 dark:text-zinc-300 sm:text-lg leading-relaxed">
              Rewire provides active reflection, grounding exercises, and cognitive reframing whenever you feel overwhelmed, anxious, or just need to talk.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isPending ? (
                <div className="h-12 w-48 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
              ) : session?.user ? (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    href="/chat"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-7 font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:from-teal-500 hover:to-emerald-500 hover:shadow-teal-500/35"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Continue Your Conversation</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <span>Welcome back, {session.user.name || session.user.email}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/sign-up"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-7 font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:from-teal-500 hover:to-emerald-500 hover:shadow-teal-500/35"
                  >
                    <span>Begin Free Confidential Reflection</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/sign-in"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-zinc-300 bg-white px-6 font-semibold text-zinc-800 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    <span>Sign In</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Daily Mood Barometer */}
        <section className="border-y border-zinc-200/80 bg-white/50 py-10 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/40">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                Emotional Barometer
              </span>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                How are you holding up right now?
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {MOOD_CHECKINS.map((mood, idx) => {
                const Icon = mood.icon;
                return (
                  <Link
                    key={idx}
                    href="/chat"
                    className="group flex flex-col items-center justify-center rounded-2xl border border-zinc-200/80 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-500/40 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/80"
                  >
                    <div className={`mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl ${mood.bg} ${mood.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {mood.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mental Reframing & Offloading Spotlight */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-white via-teal-50/20 to-zinc-50 dark:from-zinc-950 dark:via-teal-950/10 dark:to-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-3.5 py-1 text-xs font-medium text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300 mb-4">
                  <PenTool className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Cognitive Offloading & Reframing</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                  Unload your mind onto paper. <br />
                  <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                    Interrupt the overthinking loop.
                  </span>
                </h2>
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                  When thoughts race, working memory gets clogged. <strong>Brain Dumping</strong> lets you write down every raw worry, task, or irrational fear without self-censoring. Once externalized, choose your path: <strong>symbolically dissolve</strong> what you cannot control, or let <strong>Cognitive Reframing</strong> isolate distortions and provide a calm, evidence-based next step.
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span><strong>Circle of Control:</strong> Sorts what you can act on vs. let go</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span><strong>Unmask Distortions:</strong> Catastrophizing, Should-statements</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span><strong>Ritual Release:</strong> Watch helpless thoughts dissolve away</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span><strong>Single Micro-Action:</strong> 2-minute step to break paralysis</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/offload"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-teal-500/25 transition-all hover:from-teal-500 hover:to-emerald-500 hover:scale-[1.02]"
                  >
                    <PenTool className="h-4 w-4" />
                    <span>Start A Brain Dump Session</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/chat"
                    className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                  >
                    Or talk with the AI Companion &rarr;
                  </Link>
                </div>
              </div>

              {/* Visual Card Preview */}
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-3xl border border-teal-200/80 bg-white p-6 shadow-xl dark:border-teal-900/50 dark:bg-zinc-900">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 ml-1">
                        Brain Dump Canvas Preview
                      </span>
                    </div>
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[9px] font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                      Uninhibited
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 font-mono text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
                    <p className="line-through opacity-40">"I'm completely behind on everything and my boss probably thinks..."</p>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 font-sans text-xs">
                      <span className="font-bold">✓ Reframed: </span>
                      You completed 3 core deliverables this week. Fatigue is amplifying self-doubt, not factual incompetence.
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Distress dropped: <strong>8/10 → 4/10</strong></span>
                    <span className="font-semibold text-teal-600 dark:text-teal-400">Relief Recorded</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Calming Breathing Tool Spotlight */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-3.5 py-1 text-xs font-medium text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300 mb-4">
                  <Wind className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Instant Nervous System Relief</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                  Take a moment. <br />
                  Breathe with Rewire.
                </h2>
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Box Breathing (4-4-4-4) is a clinically proven method used by therapists and emergency responders to activate the parasympathetic nervous system, slow down heart rate, and clear mental fog.
                </p>

                <div className="mt-6 space-y-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>Inhale 4s &bull; Hold 4s &bull; Exhale 4s &bull; Rest 4s</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>Zero pressure, no sign-in required to practice grounding</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>Designed for immediate anxiety, panic de-escalation, and sleep</span>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/chat"
                    className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                  >
                    <span>Talk Through What Caused The Stress</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Live Interactive Breathing Widget */}
              <div className="flex justify-center">
                <BreathingWidget />
              </div>
            </div>
          </div>
        </section>

        {/* Thoughtfully Engineered Pillars */}
        <section className="border-t border-zinc-200/80 bg-zinc-100/60 py-16 md:py-24 dark:border-zinc-800/80 dark:bg-zinc-900/30">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                Clinical Principles & Architecture
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-2">
                Designed for Safety, Empathy, and Integrity
              </h2>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                Every conversation is governed by safety-first workflows, trauma-informed guidelines, and state-of-the-art serverless architecture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Crisis-First Triage
                </h3>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Dedicated safety assessment nodes immediately detect severe distress or self-harm risks, prioritizing accredited human lifelines over open-ended generation.
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
                  <Brain className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Cognitive Reframing & GraphRAG
                </h3>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Incorporates Neo4j knowledge graphs to securely understand personal coping triggers and evidence-based exercises without generic platitudes.
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Confidential & Private
                </h3>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Protected with encrypted sessions, PostgreSQL isolation, and serverless scale-to-zero processing so your thoughts remain private and secure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 24/7 Lifeline Banner */}
        <section className="bg-rose-50/60 border-t border-rose-200/60 py-12 dark:bg-rose-950/20 dark:border-rose-900/40">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400 mb-3">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Need immediate professional support?
            </h2>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
              If you are in crisis, free and confidential help is available 24/7. Call or text <strong>988</strong> in the US & Canada, or contact local emergency services.
            </p>
            <div className="mt-5">
              <button
                onClick={() => setIsCrisisModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-rose-700 transition-colors"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span>View Full Crisis Directory</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer & Clinical Disclaimer */}
      <footer className="border-t border-zinc-200/80 bg-white/70 py-8 px-6 text-center text-xs text-zinc-400 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/70 dark:text-zinc-500">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="font-medium text-zinc-500 dark:text-zinc-400">
            <strong>Important Clinical Disclaimer:</strong> Rewire is an artificial intelligence companion designed for emotional reflection, active listening, and evidence-informed coping strategies. Rewire is <em>not</em> a medical doctor, psychiatrist, or licensed psychologist, cannot provide medical diagnoses, and cannot replace clinical therapy or emergency intervention.
          </p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
            &copy; {new Date().getFullYear()} Rewire Mental Health AI &bull; Confidential & Secure
          </p>
        </div>
      </footer>
    </div>
  );
}
