import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
  Mail,
  Phone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy — Rewire",
  description:
    "Review the Cancellation & Refund Policy for Rewire. Details on subscription cancellation, refund eligibility, processing times, and payment dispute guidelines.",
  alternates: {
    canonical: "/refund-policy",
  },
  openGraph: {
    title: "Cancellation & Refund Policy — Rewire",
    description:
      "Clear, transparent guidelines regarding subscription cancellations and refund requests for Rewire.",
  },
};

const refundJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Cancellation & Refund Policy — Rewire",
  description:
    "Official refund and cancellation guidelines for Rewire operated by Aadarsh Kumar.",
  url: "https://heyrewire.com/refund-policy",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <JsonLd data={refundJsonLd} />
      <SiteHeader />

      <main className="flex-1 py-12 md:py-20 px-6">
        <article className="mx-auto max-w-4xl space-y-12">
          {/* Header */}
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300">
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Customer Satisfaction & Transparency</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Cancellation & Refund Policy
            </h1>
            <p className="mx-auto max-w-2xl text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              At Rewire (operated by <strong>Aadarsh Kumar</strong>), we prioritize customer satisfaction and transparency. Please read our guidelines regarding plan cancellations and refund requests below.
            </p>
            <p className="text-xs text-zinc-400">
              Last Updated: October 2026
            </p>
          </header>

          {/* Quick Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                7-Day Money Back Window
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                If you are unsatisfied with your initial paid subscription, request a refund within 7 days of purchase for a full review.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <RotateCcw className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Cancel Anytime
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                You can cancel your recurring subscription at any moment from your account settings with zero cancellation fees.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                5–7 Day Bank Settlement
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Approved refunds are credited directly back to your original payment method via Cashfree within 5–7 business days.
              </p>
            </div>
          </section>

          {/* Detailed Policy Text */}
          <section className="rounded-3xl border border-zinc-200/80 bg-white p-8 md:p-10 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-8 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {/* Section 1 */}
            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                1. Subscription Cancellation
              </h2>
              <p>
                Users can cancel their active subscription at any time without any termination penalty. When you cancel:
              </p>
              <ul className="space-y-2 pl-4 list-disc">
                <li>
                  Your recurring billing will immediately cease, and you will not be billed for subsequent billing cycles.
                </li>
                <li>
                  You will maintain full access to your paid features and privileges until the end of your current paid billing period.
                </li>
                <li>
                  Your private journal entries and cognitive logs remain saved in your account according to our <Link href="/privacy" className="text-teal-600 underline">Privacy Policy</Link>.
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                2. Refund Eligibility & Conditions
              </h2>
              <p>
                We strive to ensure every user has a valuable experience with our cognitive offloading and AI reflection tools. Refunds are evaluated under the following terms:
              </p>
              <ul className="space-y-2 pl-4 list-disc">
                <li>
                  <strong>Initial Purchase Guarantee:</strong> If you purchase a subscription and determine within <strong>7 days</strong> of your initial payment that Rewire does not meet your expectations, you may write to us for a full refund.
                </li>
                <li>
                  <strong>Duplicate or Erroneous Transactions:</strong> In the rare event of duplicate charges, technical payment double-deductions, or server errors, a 100% refund of the erroneous amount will be processed immediately upon notice.
                </li>
                <li>
                  <strong>Service Unavailability:</strong> If prolonged service outages prevent access to paid features for more than 48 consecutive hours, users are eligible for a prorated refund for that billing period.
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                3. Refund Processing & Timelines
              </h2>
              <p>
                Once a refund request is received:
              </p>
              <ul className="space-y-2 pl-4 list-disc">
                <li>
                  Our customer support team will review and confirm your request within <strong>24 to 48 hours</strong>.
                </li>
                <li>
                  Approved refunds are initiated via our payment gateway partner, <strong>Cashfree Payments</strong>, directly to your original payment source (Credit/Debit Card, UPI, Net Banking, or Wallet).
                </li>
                <li>
                  Depending on your issuing bank or card provider, the funds typically reflect in your account within <strong>5 to 7 business days</strong>.
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                4. How to Request a Refund
              </h2>
              <p>
                To initiate a cancellation or refund inquiry, please email or call our support desk with your registered account email and transaction ID:
              </p>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950 space-y-2 text-zinc-800 dark:text-zinc-200">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-teal-600" />
                  <span><strong>Email:</strong> <a href="mailto:aadarshsingh121@gmail.com" className="underline">aadarshsingh121@gmail.com</a></span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-600" />
                  <span><strong>Mobile / Phone:</strong> <a href="tel:+919631526557" className="underline">+91 96315 26557</a></span>
                </p>
                <p className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-600" />
                  <span><strong>Merchant Entity:</strong> Aadarsh Kumar (Rewire)</span>
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
