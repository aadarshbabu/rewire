import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Truck,
  Zap,
  Globe,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Building2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy — Service Fulfillment — Rewire",
  description:
    "Review Rewire's Shipping and Delivery Policy. Rewire provides digital software-as-a-service (SaaS) products with instant electronic delivery and activation.",
  alternates: {
    canonical: "/shipping-policy",
  },
  openGraph: {
    title: "Shipping & Delivery Policy — Rewire",
    description:
      "Details on electronic service delivery, account activation, and digital fulfillment for Rewire.",
  },
};

const shippingJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Shipping & Delivery Policy — Rewire",
  description:
    "Official digital service fulfillment and delivery guidelines for Rewire operated by Aadarsh Kumar.",
  url: "https://heyrewire.com/shipping-policy",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <JsonLd data={shippingJsonLd} />
      <SiteHeader />

      <main className="flex-1 py-12 md:py-20 px-6">
        <article className="mx-auto max-w-4xl space-y-12">
          {/* Header */}
          <header className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300">
              <Truck className="h-3.5 w-3.5" />
              <span>Digital Fulfillment & Service Delivery</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Shipping & Delivery Policy
            </h1>
            <p className="mx-auto max-w-2xl text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Information regarding how products, subscriptions, and services are delivered to customers on Rewire (operated by <strong>Aadarsh Kumar</strong>).
            </p>
            <p className="text-xs text-zinc-400">
              Last Updated: October 2026
            </p>
          </header>

          {/* Core Fulfillment Highlights */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                100% Instant Delivery
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                As a cloud software platform, access to all features and upgrades is granted immediately upon successful payment confirmation.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Zero Physical Shipping
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                No physical shipping or logistics are required. All services are consumed online through your web browser.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Automated Confirmation
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                A digital receipt and order confirmation is automatically sent to your registered email upon payment approval.
              </p>
            </div>
          </section>

          {/* Detailed Policy Text */}
          <section className="rounded-3xl border border-zinc-200/80 bg-white p-8 md:p-10 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 space-y-8 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                1. Mode of Service Delivery
              </h2>
              <p>
                Rewire operates as a Software-as-a-Service (SaaS) web application. All tools—including the Brain Dump journaling canvas, cognitive reframing assistant, box breathing guides, and longitudinal analytics—are hosted digitally in cloud infrastructure. We do not dispatch any physical merchandise or postal parcels.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                2. Delivery Timeline & Service Activation
              </h2>
              <p>
                Upon completion of a payment via Cashfree Payments or other supported gateways:
              </p>
              <ul className="space-y-2 pl-4 list-disc">
                <li>
                  <strong>Instant Account Crediting:</strong> Your account tier is upgraded immediately. You do not need to wait for manual verification or activation codes.
                </li>
                <li>
                  <strong>Electronic Invoice & Receipt:</strong> A detailed electronic receipt and payment confirmation will be transmitted to your registered email address within seconds of transaction authorization.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                3. Access Troubleshooting
              </h2>
              <p>
                If for any reason your account does not reflect upgraded privileges immediately after payment completion:
              </p>
              <ul className="space-y-2 pl-4 list-disc">
                <li>Refresh your browser or sign out and sign back in to refresh your authentication session.</li>
                <li>Verify that the transaction amount was deducted by your bank and that an authorized payment confirmation ID was generated.</li>
                <li>
                  Contact our support team immediately at <a href="mailto:aadarshsingh121@gmail.com" className="text-teal-600 underline">aadarshsingh121@gmail.com</a> or call <a href="tel:+919631526557" className="text-teal-600 underline">+91 96315 26557</a> with your order ID. We will resolve access within 2 hours.
                </li>
              </ul>
            </div>

            {/* Merchant Details */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-zinc-800 dark:text-zinc-200">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-teal-600" />
                <span>Merchant Fulfillment Contact</span>
              </h3>
              <p><strong>Legal Entity:</strong> Aadarsh Kumar</p>
              <p><strong>Platform:</strong> Rewire (heyrewire.com)</p>
              <p><strong>Support Email:</strong> aadarshsingh121@gmail.com</p>
              <p><strong>Support Mobile:</strong> +91 96315 26557</p>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
