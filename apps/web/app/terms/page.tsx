import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { Scale, CheckCircle2, AlertOctagon, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — Platform Usage Guidelines",
  description:
    "Review the terms and conditions for using Rewire. Understand account eligibility, non-emergency conditions, intellectual property, and user responsibilities.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service — Rewire",
    description: "Usage agreement and guidelines for the Rewire mental health companion platform.",
  },
};

const termsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Service — HeyRewire",
  url: "https://heyrewire.com/terms",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <JsonLd data={termsJsonLd} />
      <SiteHeader />

      <main className="flex-1 py-12 md:py-20 px-6">
        <article className="mx-auto max-w-4xl space-y-12">
          {/* Header */}
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300">
              <Scale className="h-3.5 w-3.5" />
              <span>User Agreement</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Terms of Service
            </h1>
            <p className="mx-auto max-w-2xl text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              These terms govern your access to and use of Rewire. By creating an account or accessing our tools, you agree to comply with these terms.
            </p>
            <p className="text-xs text-zinc-400">
              Last Updated: September 2026
            </p>
          </header>

          {/* Terms Sections */}
          <section className="rounded-3xl border border-zinc-200/80 bg-white p-8 md:p-10 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-8 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {/* Condition 1: Non-Emergency Usage */}
            <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-5 dark:border-rose-900/40 dark:bg-rose-950/20 space-y-2">
              <h2 className="text-base font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
                <AlertOctagon className="h-4 w-4" />
                <span>1. Critical Non-Emergency Condition</span>
              </h2>
              <p className="text-rose-900/90 dark:text-rose-200/80">
                You explicitly acknowledge and agree that Rewire is <strong>not</strong> designed, intended, or certified to handle life-threatening situations, self-harm, or active psychiatric crises. You agree that in any emergency, you will bypass the application and call <strong>988</strong>, <strong>911</strong>, <strong>111/999</strong>, or your local emergency hospital.
              </p>
            </div>

            {/* Condition 2: Eligibility */}
            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                2. Eligibility & Account Security
              </h2>
              <p>
                You must be at least 18 years old (or the age of legal majority in your jurisdiction) to use Rewire independently. If you are between 13 and 18, you may only use Rewire with verifiable consent and supervision from a parent or legal guardian.
              </p>
              <p>
                You are responsible for safeguarding your login credentials and for all activities that occur under your account.
              </p>
            </div>

            {/* Condition 3: Ownership of Thoughts & Entries */}
            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                3. Your Content & Ownership
              </h2>
              <p>
                You retain 100% intellectual property ownership of any thoughts, reflections, writings, and journal entries you enter into Rewire. We claim no copyright or ownership over your emotional expressions. You grant Rewire only the technical license strictly necessary to store, encrypt, and render that content back to you.
              </p>
            </div>

            {/* Condition 4: Acceptable Use */}
            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                4. Acceptable Conduct
              </h2>
              <p>
                You agree not to misuse the service, including but not limited to:
              </p>
              <ul className="space-y-1.5 pl-4 list-disc">
                <li>Attempting to reverse-engineer prompts, system instructions, or database infrastructure.</li>
                <li>Conducting automated scraping, scraping APIs, or denial of service attacks.</li>
                <li>Submitting unlawful, harassing, defamatory, or malicious content.</li>
              </ul>
            </div>

            {/* Condition 5: Disclaimers & Warranties */}
            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                5. Disclaimer of Warranties
              </h2>
              <p>
                Rewire is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, whether express or implied. We do not warrant that the service will be uninterrupted, error-free, or meet all specific psychological goals. For our complete medical disclaimer, review our <Link href="/disclaimer" className="text-teal-600 dark:text-teal-400 font-semibold underline">Clinical Disclaimer</Link>.
              </p>
            </div>

            {/* Condition 6: Contact */}
            <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Questions or Concerns?
              </h2>
              <p>
                For legal inquiries or clarifications on these terms, contact us at:{" "}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  legal@heyrewire.com
                </span>
              </p>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
