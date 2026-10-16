import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Building2,
  MessageSquare,
  ShieldAlert,
  Send,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us & Customer Support — Rewire",
  description:
    "Get in touch with the Rewire team. Official contact information, support helpline, email, and merchant details for Rewire operated by Aadarsh Kumar.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us & Support — Rewire",
    description:
      "Reach out to Rewire for technical support, billing inquiries, or legal clarifications.",
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Us — Rewire",
  description:
    "Official customer support and contact details for Rewire, operated by Aadarsh Kumar.",
  url: "https://heyrewire.com/contact",
  mainEntity: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: "+91 96315 26557",
    email: "aadarshsingh121@gmail.com",
    availableLanguage: ["English", "Hindi"],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <JsonLd data={contactJsonLd} />
      <SiteHeader />

      <main className="flex-1 py-12 md:py-20 px-6">
        <article className="mx-auto max-w-4xl space-y-12">
          {/* Header */}
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300">
              <Mail className="h-3.5 w-3.5" />
              <span>We Are Here to Help</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Contact Us & Customer Support
            </h1>
            <p className="mx-auto max-w-2xl text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Have questions about Rewire, need assistance with your account, or have payment inquiries? Reach out directly using our official verified contact channels.
            </p>
          </header>

          {/* Contact Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone Support */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Direct Phone / Helpline
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Call or message our registered support helpline for urgent billing or account inquiries:
              </p>
              <a
                href="tel:+919631526557"
                className="block text-base font-extrabold text-teal-600 dark:text-teal-400 hover:underline"
              >
                +91 96315 26557
              </a>
              <p className="text-[11px] text-zinc-400">
                Mon – Sat: 9:00 AM – 7:00 PM IST
              </p>
            </div>

            {/* Email Support */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Email Support
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Send us an email for general inquiries, feedback, or payment disputes:
              </p>
              <a
                href="mailto:aadarshsingh121@gmail.com"
                className="block text-sm font-extrabold text-teal-600 dark:text-teal-400 hover:underline break-all"
              >
                aadarshsingh121@gmail.com
              </a>
              <p className="text-[11px] text-zinc-400">
                Typical reply time: Within 24 hours
              </p>
            </div>

            {/* Operating Entity */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Registered Merchant
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Legal Entity & Grievance Officer:
              </p>
              <p className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                Aadarsh Kumar
              </p>
              <p className="text-[11px] text-zinc-400">
                Location: India &bull; Merchant on Cashfree
              </p>
            </div>
          </div>

          {/* Emergency Crisis Reminder Notice */}
          <section className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 md:p-8 dark:border-amber-900/50 dark:bg-amber-950/30 space-y-3">
            <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200 font-bold text-base">
              <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>In Case of Immediate Medical or Mental Health Crisis</span>
            </div>
            <p className="text-xs md:text-sm text-amber-900/90 dark:text-amber-200/80 leading-relaxed">
              Customer support channels are <strong>not</strong> manned by emergency rescue personnel. If you or someone you know is in active emotional crisis or danger of self-harm, please dial <strong>14416</strong> (Tele-MANAS, India), <strong>988</strong> (USA/Canada), or check our{" "}
              <Link href="/crisis-resources" className="underline font-semibold text-amber-800 dark:text-amber-300">
                24/7 Crisis Directory
              </Link>{" "}
              immediately.
            </p>
          </section>

          {/* Detailed Merchant and Support Disclosures */}
          <section className="rounded-3xl border border-zinc-200/80 bg-white p-8 md:p-10 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Merchant & Regulatory Disclosures
            </h2>
            <div className="space-y-4 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                <strong>Legal Name of Business / Proprietor:</strong> Aadarsh Kumar
              </p>
              <p>
                <strong>Trading Name:</strong> Rewire (HeyRewire)
              </p>
              <p>
                <strong>Contact Email:</strong>{" "}
                <a href="mailto:aadarshsingh121@gmail.com" className="text-teal-600 hover:underline">
                  aadarshsingh121@gmail.com
                </a>
              </p>
              <p>
                <strong>Contact Phone:</strong>{" "}
                <a href="tel:+919631526557" className="text-teal-600 hover:underline">
                  +91 96315 26557
                </a>
              </p>
              <p>
                <strong>Operational Country:</strong> India
              </p>
              <p>
                <strong>Payment Processing:</strong> Transactions initiated on this website are routed securely through authorized payment gateway partners including Cashfree Payments.
              </p>
              <p>
                <strong>Related Compliance Links:</strong>{" "}
                <Link href="/legal" className="text-teal-600 underline">Legal Information</Link> &bull;{" "}
                <Link href="/terms" className="text-teal-600 underline">Terms of Service</Link> &bull;{" "}
                <Link href="/privacy" className="text-teal-600 underline">Privacy Policy</Link> &bull;{" "}
                <Link href="/refund-policy" className="text-teal-600 underline">Cancellation & Refund Policy</Link> &bull;{" "}
                <Link href="/shipping-policy" className="text-teal-600 underline">Shipping & Delivery Policy</Link>
              </p>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
