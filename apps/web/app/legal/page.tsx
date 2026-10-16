import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CreditCard,
  Scale,
  FileText,
  Clock,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Legal Information & Merchant Details — Rewire",
  description:
    "Official legal information, registered merchant entity details, contact credentials, and compliance disclosures for Rewire.",
  alternates: {
    canonical: "/legal",
  },
  openGraph: {
    title: "Legal Information & Merchant Details — Rewire",
    description:
      "Registered merchant information, compliance disclosures, and official contact information for Rewire.",
  },
};

const legalJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Legal Information & Merchant Details — Rewire",
  description:
    "Official legal identity, registered contact information, and compliance terms for Rewire operated by Aadarsh Kumar.",
  url: "https://heyrewire.com/legal",
  publisher: {
    "@type": "Person",
    name: "Aadarsh Kumar",
    email: "aadarshsingh121@gmail.com",
    telephone: "+91 96315 26557",
  },
};

export default function LegalInfoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <JsonLd data={legalJsonLd} />
      <SiteHeader />

      <main className="flex-1 py-12 md:py-20 px-6">
        <article className="mx-auto max-w-4xl space-y-12">
          {/* Header */}
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300">
              <Building2 className="h-3.5 w-3.5" />
              <span>Registered Merchant & Legal Disclosure</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Legal Information & Merchant Details
            </h1>
            <p className="mx-auto max-w-2xl text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              In accordance with payment aggregator regulations, RBI merchant guidelines, and IT Act requirements, below are the verified legal registration and merchant identity details for Rewire.
            </p>
            <p className="text-xs text-zinc-400">
              Last Updated & Verified: October 2026
            </p>
          </header>

          {/* Primary Legal Information Card */}
          <section className="rounded-3xl border border-zinc-200/80 bg-white p-8 md:p-10 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Business Entity Identification
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Registered details matching payment gateway onboarding & verification
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {/* Legal Name */}
              <div className="rounded-2xl border border-zinc-200/70 bg-zinc-50/60 p-5 dark:border-zinc-800/80 dark:bg-zinc-950/50 space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  Legal Entity / Proprietor Name
                </span>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Aadarsh Kumar
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Individual / Sole Proprietor operating Rewire
                </p>
              </div>

              {/* Trade / Brand Name */}
              <div className="rounded-2xl border border-zinc-200/70 bg-zinc-50/60 p-5 dark:border-zinc-800/80 dark:bg-zinc-950/50 space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Trade / Brand Name
                </span>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Rewire (HeyRewire)
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Digital Cognitive Journaling & AI Companion Platform
                </p>
              </div>

              {/* Registered Mobile */}
              <div className="rounded-2xl border border-zinc-200/70 bg-zinc-50/60 p-5 dark:border-zinc-800/80 dark:bg-zinc-950/50 space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Registered Mobile Number
                </span>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  <a
                    href="tel:+919631526557"
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    +91 96315 26557
                  </a>
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Support & Verification Contact (Mon–Sat, 9:00 AM – 7:00 PM IST)
                </p>
              </div>

              {/* Registered Email */}
              <div className="rounded-2xl border border-zinc-200/70 bg-zinc-50/60 p-5 dark:border-zinc-800/80 dark:bg-zinc-950/50 space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  Official & Registered Email ID
                </span>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50 break-all">
                  <a
                    href="mailto:aadarshsingh121@gmail.com"
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    aadarshsingh121@gmail.com
                  </a>
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Direct communication for billing, legal, and user support
                </p>
              </div>
            </div>

            {/* Additional Operating Details */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span>Operating Location & Jurisdiction</span>
              </h3>
              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Rewire is operated by <strong>Aadarsh Kumar</strong> in <strong>India</strong>. All commercial operations, transactions, and legal dispute resolutions are subject to the exclusive jurisdiction of the courts of India.
              </p>
            </div>
          </section>

          {/* Nature of Service & Payment Processing */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Payment Gateway Integration
              </h3>
              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Payments on Rewire are securely processed through regulated payment aggregators including <strong>Cashfree Payments</strong>. Transactions are protected using 256-bit SSL encryption and strict PCI-DSS compliance. Rewire does not directly store credit or debit card CVV/PIN data.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Service Delivery Timeline
              </h3>
              <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Rewire is a pure digital software-as-a-service (SaaS) platform. All premium upgrades, access tiers, and subscription entitlements are delivered <strong>instantaneously</strong> online upon successful payment authorization.
              </p>
            </div>
          </section>

          {/* Compliance & Policy Directory */}
          <section className="rounded-3xl border border-zinc-200/80 bg-white p-8 md:p-10 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Compliance & Legal Policies Directory
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Quick links to all published customer terms and governing guidelines
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Link
                href="/terms"
                className="group flex items-center justify-between rounded-2xl border border-zinc-200/80 p-4 hover:border-teal-500 hover:bg-teal-50/30 dark:border-zinc-800 dark:hover:border-teal-500 dark:hover:bg-teal-950/20 transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    Terms & Conditions
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    User rights, account rules, acceptable use
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-zinc-400 group-hover:text-teal-600" />
              </Link>

              <Link
                href="/privacy"
                className="group flex items-center justify-between rounded-2xl border border-zinc-200/80 p-4 hover:border-teal-500 hover:bg-teal-50/30 dark:border-zinc-800 dark:hover:border-teal-500 dark:hover:bg-teal-950/20 transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    Privacy Policy
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Zero-sale data pledge, encryption standards
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-zinc-400 group-hover:text-teal-600" />
              </Link>

              <Link
                href="/refund-policy"
                className="group flex items-center justify-between rounded-2xl border border-zinc-200/80 p-4 hover:border-teal-500 hover:bg-teal-50/30 dark:border-zinc-800 dark:hover:border-teal-500 dark:hover:bg-teal-950/20 transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    Cancellation & Refund Policy
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Refund eligibility, turnaround, process
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-zinc-400 group-hover:text-teal-600" />
              </Link>

              <Link
                href="/shipping-policy"
                className="group flex items-center justify-between rounded-2xl border border-zinc-200/80 p-4 hover:border-teal-500 hover:bg-teal-50/30 dark:border-zinc-800 dark:hover:border-teal-500 dark:hover:bg-teal-950/20 transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    Shipping & Delivery Policy
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Instant digital fulfillment terms
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-zinc-400 group-hover:text-teal-600" />
              </Link>

              <Link
                href="/contact"
                className="group flex items-center justify-between rounded-2xl border border-zinc-200/80 p-4 hover:border-teal-500 hover:bg-teal-50/30 dark:border-zinc-800 dark:hover:border-teal-500 dark:hover:bg-teal-950/20 transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    Contact Us & Customer Support
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Direct helpline, grievance officer, contact form
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-zinc-400 group-hover:text-teal-600" />
              </Link>

              <Link
                href="/disclaimer"
                className="group flex items-center justify-between rounded-2xl border border-zinc-200/80 p-4 hover:border-teal-500 hover:bg-teal-50/30 dark:border-zinc-800 dark:hover:border-teal-500 dark:hover:bg-teal-950/20 transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    Clinical & Medical Disclaimer
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Non-diagnostic wellness limits & crisis hotlines
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-zinc-400 group-hover:text-teal-600" />
              </Link>
            </div>
          </section>

          {/* Grievance Officer & Contact Details */}
          <section className="rounded-3xl border border-teal-200/70 bg-teal-50/40 p-8 dark:border-teal-900/40 dark:bg-teal-950/20 space-y-3">
            <h3 className="text-base font-bold text-teal-950 dark:text-teal-200 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <span>Grievance Redressal & Compliance Officer</span>
            </h3>
            <p className="text-xs md:text-sm text-teal-900/90 dark:text-teal-200/80 leading-relaxed">
              In accordance with Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules and Payment Aggregator guidelines, the Grievance Officer for Rewire is:
            </p>
            <div className="text-xs md:text-sm text-teal-950 dark:text-teal-100 font-medium space-y-1 pt-1">
              <p><strong>Officer / Proprietor:</strong> Aadarsh Kumar</p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:aadarshsingh121@gmail.com" className="underline hover:text-teal-700">
                  aadarshsingh121@gmail.com
                </a>
              </p>
              <p>
                <strong>Phone / Mobile:</strong>{" "}
                <a href="tel:+919631526557" className="underline hover:text-teal-700">
                  +91 96315 26557
                </a>
              </p>
              <p><strong>Response Turnaround:</strong> Within 24–48 business hours</p>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
