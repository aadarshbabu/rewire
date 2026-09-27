import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Trash2,
  FileCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Confidential Mental Health Data Standards",
  description:
    "Review Rewire's privacy policy. We adhere to strict zero-data-selling principles, end-to-end transport encryption, and user-governed mental health data retention.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy — Rewire Mental Health",
    description:
      "Your vulnerability deserves protection. How Rewire securely protects and isolates your personal thoughts and journal entries.",
  },
};

const privacyJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy — HeyRewire",
  description:
    "Official privacy policy and security practices for the HeyRewire mental health companion platform.",
  url: "https://heyrewire.com/privacy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <JsonLd data={privacyJsonLd} />
      <SiteHeader />

      <main className="flex-1 py-12 md:py-20 px-6">
        <article className="mx-auto max-w-4xl space-y-12">
          {/* Header */}
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Zero-Sale Data Guarantee</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Mental Health Privacy Policy
            </h1>
            <p className="mx-auto max-w-2xl text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We treat mental health reflections with the highest confidentiality. You own your thoughts, and your private vulnerability is never for sale.
            </p>
            <p className="text-xs text-zinc-400">
              Effective Date: September 2026 &bull; Version 2.4
            </p>
          </header>

          {/* Three Core Guarantees */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <EyeOff className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Never Sold to Advertisers
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                We never monetize, broker, or sell your journal entries, mood scores, or conversations to ad networks or third parties.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Encrypted in Transit & Rest
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Every transmission uses TLS 1.3 encryption. Durable records are stored with AES-256 row-level separation in PostgreSQL.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Instant Erasure (Right to Forget)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                You maintain complete authority to delete any journal entry, conversation thread, or your entire account with immediate purging.
              </p>
            </div>
          </section>

          {/* Detailed Policy Sections */}
          <section className="rounded-3xl border border-zinc-200/80 bg-white p-8 md:p-10 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-8 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                1. Information We Collect
              </h2>
              <p>
                To provide your personalized mental health companion, we collect only necessary data:
              </p>
              <ul className="space-y-2 pl-4 list-disc">
                <li>
                  <strong>Account Credentials:</strong> Email address, hashed authentication credentials, or OAuth tokens handled via Better Auth.
                </li>
                <li>
                  <strong>Journal & Brain Dump Entries:</strong> The text and thoughts you voluntarily record in your private `/offload` canvas.
                </li>
                <li>
                  <strong>Mood Check-Ins:</strong> Emotional rating tags and timestamps to compute your longitudinal progress charts.
                </li>
                <li>
                  <strong>AI Conversation History:</strong> Prompts and responses generated between you and the Rewire assistant to provide continuity.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                2. How Your Data Is Processed
              </h2>
              <p>
                Rewire operates a modern, decoupled microservices monorepo:
              </p>
              <ul className="space-y-2 pl-4 list-disc">
                <li>
                  <strong>Asynchronous Worker Isolation:</strong> AI requests are processed by stateless, disposable AWS Lambda workers via Amazon SQS. Workers discard conversational state from memory upon run completion.
                </li>
                <li>
                  <strong>No Public Model Training:</strong> Your private journal entries are <strong>never</strong> fed into public training corpuses for foundational AI models.
                </li>
                <li>
                  <strong>Transient Streaming:</strong> Real-time token streaming uses isolated Redis Streams with short TTLs (Time-To-Live) that expire after the streaming run finishes.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                3. Your Rights & Global Compliance (GDPR / CCPA)
              </h2>
              <p>
                Regardless of your geographic location, you enjoy full data sovereignty:
              </p>
              <ul className="space-y-2 pl-4 list-disc">
                <li><strong>Right of Access:</strong> You can export all your past journal entries and mood logs.</li>
                <li><strong>Right of Rectification:</strong> Edit or correct any saved entry at any time.</li>
                <li><strong>Right of Erasure:</strong> Delete specific conversations or execute a full account purge.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                4. Contact Our Privacy Officer
              </h2>
              <p>
                If you have questions regarding our data practices, encryption mechanisms, or wish to request complete data extraction, contact us at:
              </p>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                privacy@heyrewire.com
              </p>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
