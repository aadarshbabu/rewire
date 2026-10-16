import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck, LifeBuoy, PhoneCall, Building2, Mail, Phone, Scale } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200/80 bg-white/70 py-12 px-6 text-zinc-600 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/70 dark:text-zinc-400">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-200 dark:border-zinc-800">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white shadow-sm">
                <Heart className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Rewire
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              An evidence-informed AI companion designed to help break overthinking spirals, navigate depression, and calm acute stress through CBT journaling and structured self-reflection.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Zero data selling guarantee</span>
            </div>
          </div>

          {/* Interactive Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
              Coping Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/offload"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Brain Dump Journaling
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  AI Chat Companion
                </Link>
              </li>
              <li>
                <Link
                  href="/#breathing"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Guided Box Breathing
                </Link>
              </li>
              <li>
                <Link
                  href="/#checkins"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Instant Mood Check-in
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Methodology */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
              About & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/about"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  About Rewire
                </Link>
              </li>
              <li>
                <Link
                  href="/about#methodology"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  CBT & Emotional Regulation
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium text-teal-700 dark:text-teal-300"
                >
                  Contact Us & Support
                </Link>
              </li>
              <li>
                <Link
                  href="/crisis-resources"
                  className="text-rose-600 dark:text-rose-400 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <PhoneCall className="h-3 w-3" />
                  <span>24/7 Crisis Directory (988)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/legal"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium text-zinc-900 dark:text-zinc-200"
                >
                  Legal & Merchant Info
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Clinical & Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Verified Merchant Identification Bar */}
        <div className="pt-6 pb-2">
          <div className="rounded-2xl border border-zinc-200/90 bg-zinc-50/80 p-4 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-teal-600 shrink-0" />
                <span>
                  <strong>Legal Entity:</strong> Aadarsh Kumar &bull; <strong>Operating Name:</strong> Rewire
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <a
                  href="tel:+919631526557"
                  className="inline-flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  <span>+91 96315 26557</span>
                </a>
                <a
                  href="mailto:aadarshsingh121@gmail.com"
                  className="inline-flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-rose-600" />
                  <span>aadarshsingh121@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Disclaimer Callout */}
        <div className="pt-4 pb-4">
          <div className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-4 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
            <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1.5">
              <LifeBuoy className="h-4 w-4" />
              Medical & Safety Disclaimer
            </p>
            <p className="text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-300/80">
              Rewire is an artificial intelligence wellness companion created for self-reflection, mindfulness, and cognitive reframing habits. Rewire does <strong>not</strong> offer medical diagnoses, psychiatric therapy, or emergency crisis care. If you are in immediate danger, experiencing acute distress, or thinking of self-harm, please dial <strong>14416</strong> (India), <strong>988</strong> (USA & Canada), contact <strong>111 / 999</strong> (UK), or reach your local emergency services immediately.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 pt-4">
          <p>
            &copy; {new Date().getFullYear()} Rewire. Owned and operated by <strong>Aadarsh Kumar</strong>. All rights reserved.
          </p>
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <Link href="/legal" className="hover:underline">Legal Info</Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:underline">Contact Support</Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <span>&bull;</span>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
