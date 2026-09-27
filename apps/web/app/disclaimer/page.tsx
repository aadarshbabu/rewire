import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import {
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
  Info,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Clinical & Medical Disclaimer — Important Safety Information",
  description:
    "Read Rewire's clinical and medical disclaimer. Rewire is an artificial intelligence wellness companion, not a licensed healthcare provider, medical doctor, or emergency response service.",
  alternates: {
    canonical: "/disclaimer",
  },
  openGraph: {
    title: "Clinical & Medical Disclaimer — Rewire",
    description:
      "Important medical, psychiatric, and emergency safety guidelines regarding the use of Rewire.",
  },
};

const disclaimerJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "Clinical and Medical Disclaimer — HeyRewire",
  description:
    "Official medical and crisis disclaimer explaining that Rewire provides emotional self-regulation tools, not psychiatric diagnosis or emergency medical treatment.",
  url: "https://heyrewire.com/disclaimer",
  lastReviewed: "2026-09-25",
  medicalAudience: {
    "@type": "MedicalAudience",
    audienceType: "General Public and Patients seeking mental health self-care tools",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <JsonLd data={disclaimerJsonLd} />
      <SiteHeader />

      <main className="flex-1 py-12 md:py-20 px-6">
        <article className="mx-auto max-w-4xl space-y-12">
          {/* Header */}
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Mandatory Safety Notice</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Clinical & Medical Disclaimer
            </h1>
            <p className="mx-auto max-w-2xl text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Please read this statement carefully before using Rewire. Your mental well-being and safety are our highest priorities.
            </p>
          </header>

          {/* Urgent Emergency Callout Box */}
          <section className="rounded-3xl border border-rose-300 bg-rose-50/70 p-6 md:p-8 dark:border-rose-900/60 dark:bg-rose-950/30 space-y-4">
            <div className="flex items-center gap-3 text-rose-800 dark:text-rose-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/60">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h2 className="text-lg md:text-xl font-bold">
                If You Are in Immediate Crisis or Danger
              </h2>
            </div>
            <p className="text-xs md:text-sm text-rose-900 dark:text-rose-200 leading-relaxed">
              Rewire is <strong>not</strong> an emergency service and cannot dispatch rescue workers or intervene in acute crises. If you are experiencing thoughts of suicide, self-harm, severe psychiatric episodes, or domestic danger, please reach out for immediate professional help:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-2xl bg-white p-4 shadow-sm border border-rose-100 dark:bg-zinc-900 dark:border-rose-950">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <span>🇮🇳</span>
                  <span>India</span>
                </p>
                <p className="text-sm font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                  Call 14416 (Tele-MANAS)
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Govt 24/7 Toll-Free &bull; Or +91 9999 666 555
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm border border-rose-100 dark:bg-zinc-900 dark:border-rose-950">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <span>🇺🇸 🇨🇦</span>
                  <span>US & Canada</span>
                </p>
                <p className="text-sm font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                  Call or Text 988
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Available 24/7 &bull; Free & Confidential
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm border border-rose-100 dark:bg-zinc-900 dark:border-rose-950">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <span>🇬🇧</span>
                  <span>United Kingdom</span>
                </p>
                <p className="text-sm font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                  Call 111 (Mental Health)
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  NHS 24/7 &bull; Or 116 123 (Samaritans)
                </p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/crisis-resources"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:underline"
              >
                <span>View international hotline directory</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </section>

          {/* Section 1: Non-Medical & Non-Therapeutic Status */}
          <section className="rounded-3xl border border-zinc-200/80 bg-white p-8 md:p-10 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
              <Info className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <span>1. Rewire Is Not a Healthcare Provider</span>
            </h2>
            <div className="space-y-4 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                Rewire is an educational, self-reflection, and mindfulness software application powered by artificial intelligence and natural language processing. It is engineered to provide active listening, cognitive offloading exercises (Brain Dump), and evidence-informed habit structuring.
              </p>
              <p className="font-semibold text-zinc-900 dark:text-zinc-200">
                Rewire does NOT:
              </p>
              <ul className="space-y-2.5 pl-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                  <span>
                    Provide medical, psychiatric, or psychological diagnoses (such as DSM-5 or ICD-11 classifications).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                  <span>
                    Prescribe, recommend, or modify pharmaceutical medications or clinical dosages.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                  <span>
                    Establish a doctor-patient, psychiatrist-patient, or therapist-client legal relationship.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                  <span>
                    Replace the diagnosis, treatment plan, or advice of a licensed physician, clinical psychologist, or psychiatrist.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2: Boundaries of Artificial Intelligence */}
          <section className="rounded-3xl border border-zinc-200/80 bg-white p-8 md:p-10 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
              <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span>2. Technological Limitations of Conversational AI</span>
            </h2>
            <div className="space-y-4 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                While Rewire incorporates advanced safety workflows, retrieval-augmented generation (RAG), and cognitive frameworks, large language models have intrinsic limitations:
              </p>
              <ul className="space-y-2 pl-2">
                <li>
                  &bull; <strong>Nuance and Context:</strong> AI cannot observe physiological vital signs, body language, facial micro-expressions, or vocal tone.
                </li>
                <li>
                  &bull; <strong>Non-Infallible Responses:</strong> AI models may occasionally generate suggestions that do not apply to your specific physical or medical condition. Always exercise personal discretion.
                </li>
                <li>
                  &bull; <strong>Supplemental Use Only:</strong> Rewire is intended as a supplemental companion for daily stress reflection, not a primary intervention for severe clinical disorders.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: User Personal Responsibility */}
          <section className="rounded-3xl border border-zinc-200/80 bg-white p-8 md:p-10 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-4 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              3. User Autonomy & Decision-Making
            </h2>
            <p>
              Any action, exercise, or lifestyle adjustment you undertake based on interactions with Rewire is done at your own sole discretion. If you suspect you have an untreated medical or psychiatric condition, or if you feel your symptoms worsening, we strongly urge you to consult an accredited healthcare professional.
            </p>
          </section>

          {/* Bottom link to Resources */}
          <div className="text-center pt-4">
            <Link
              href="/crisis-resources"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors shadow-sm"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Access Emergency & Crisis Directory</span>
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
