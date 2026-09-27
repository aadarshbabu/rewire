import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Brain,
  ShieldCheck,
  Compass,
  Wind,
  LineChart,
  PenTool,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Rewire — Purpose, Clinical Methodology & AI Safety",
  description:
    "Learn about Rewire's mission to help people overcome overthinking, depression, and chronic stress through CBT-informed journaling, AI companionship, and privacy-first architecture.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Rewire — Mental Health Companion",
    description:
      "Evidence-informed tools designed to break overthinking spirals, regulate stress, and foster emotional self-awareness.",
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About HeyRewire Mental Health Companion",
  description:
    "Information on the purpose, therapeutic methodology, and technical safety architecture of HeyRewire.",
  url: "https://heyrewire.com/about",
  mainEntity: {
    "@type": "MedicalOrganization",
    name: "HeyRewire Mental Wellness",
    description:
      "A mental health technology platform offering structured emotional reflection, CBT thought reframing, and stress self-regulation.",
    knowsAbout: [
      "Cognitive Behavioral Therapy (CBT)",
      "Acceptance and Commitment Therapy (ACT)",
      "Polyvagal Theory and Nervous System Regulation",
      "Cognitive Offloading for Overthinking",
      "Longitudinal Mood Analytics",
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <JsonLd data={aboutJsonLd} />
      <SiteHeader />

      <main className="flex-1 py-12 md:py-20 px-6">
        <article className="mx-auto max-w-4xl space-y-16">
          {/* Header Section */}
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Evidence-Informed &bull; Privacy-Centric</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Why We Built <span className="text-teal-600 dark:text-teal-400">Rewire</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              When thoughts start spiraling into rumination, chronic stress, or depressive heaviness, conventional advice often falls short. Rewire provides an always-accessible, judgment-free sanctuary to unburden your mind and restore mental clarity.
            </p>
          </header>

          {/* Core Problem & Purpose */}
          <section className="rounded-3xl border border-zinc-200/80 bg-white p-8 md:p-10 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
                <Brain className="h-5 w-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Our Purpose: Quieting the Overwhelmed Mind
              </h2>
            </div>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Modern life inundates our brains with information overload, resulting in three pervasive struggles:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800/60 dark:bg-zinc-950/40">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-200">
                  1. Overthinking Spirals
                </h3>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Repetitive, racing thought loops that drain cognitive energy and cause insomnia or decision paralysis.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800/60 dark:bg-zinc-950/40">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-200">
                  2. Depressive Fatigue
                </h3>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  The sensation of emotional heaviness where even basic tasks feel insurmountable, making self-expression difficult.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800/60 dark:bg-zinc-950/40">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-200">
                  3. Acute Nervous System Stress
                </h3>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Sympathetic nervous system overload manifesting as tight chest, shallow breathing, and fight-or-flight panic.
                </p>
              </div>
            </div>
          </section>

          {/* The Rewire Methodology (E-E-A-T) */}
          <section id="methodology" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Evidence-Informed Methodology
              </h2>
              <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
                Rewire combines proven clinical psychology principles with modern AI reasoning to deliver practical mental health habits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                  <PenTool className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Cognitive Offloading (Brain Dump)
                </h3>
                <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Research in cognitive neuroscience demonstrates that externalizing thoughts from working memory onto an external medium dramatically reduces mental clutter and amygdala hyperactivity. Rewire provides an uncensored digital space to dump everything without judgment.
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Cognitive Behavioral Reframing (CBT)
                </h3>
                <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Our AI companion helps users identify automatic cognitive distortions (catastrophizing, black-and-white thinking, fortune-telling) and gently guides them toward more balanced, realistic viewpoints.
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <Wind className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Somatic & Polyvagal Regulation
                </h3>
                <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  You cannot think your way out of a physiological fight-or-flight state. Rewire includes guided 4-4-4-4 box breathing and 5-4-3-2-1 sensory grounding to stimulate the vagus nerve and engage parasympathetic relaxation.
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                  <LineChart className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Longitudinal Mood Analytics
                </h3>
                <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Tracking emotional state over time transforms fleeting feelings into objective insights. Users can detect triggers, celebrate recovery milestones, and spot recurring cyclical patterns.
                </p>
              </div>
            </div>
          </section>

          {/* AI Safety & GraphRAG Architecture */}
          <section id="architecture" className="rounded-3xl border border-zinc-200/80 bg-white p-8 md:p-10 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Safety First: Responsible AI Architecture
              </h2>
            </div>

            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Mental health AI requires uncompromised guardrails. Our backend is engineered to ensure empathy without medical overreach:
            </p>

            <ul className="space-y-3 text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Dedicated Safety Triage:</strong> A multi-node LangGraph safety pipeline continuously evaluates messages for acute crisis indicators or self-harm risks, bypassing generative LLMs to immediately surface professional lifelines.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Non-Diagnostic Boundaries:</strong> Rewire never provides clinical diagnoses (DSM-5 / ICD-11) or medical prescriptions. It functions as a reflective coaching tool.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Data Privacy by Design:</strong> Serverless scale-to-zero processing ensures conversations are stored with strict PostgreSQL row-level isolation and never used to train third-party public foundation models.
                </span>
              </li>
            </ul>
          </section>

          {/* Call to Action */}
          <section className="text-center rounded-3xl bg-gradient-to-tr from-teal-900 to-emerald-950 text-white p-8 md:p-12 space-y-5">
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to unburden your thoughts?
            </h2>
            <p className="text-xs md:text-sm text-teal-200 max-w-lg mx-auto">
              Start with a free, private brain dump exercise right now. No pressure, no judgment.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/offload"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs md:text-sm font-bold text-teal-950 hover:bg-teal-50 transition-colors shadow-md"
              >
                <PenTool className="h-4 w-4 text-teal-700" />
                <span>Try Brain Dump</span>
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-xl border border-teal-400/40 bg-teal-800/40 px-5 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-teal-800/60 transition-colors"
              >
                <span>Talk with Companion</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
