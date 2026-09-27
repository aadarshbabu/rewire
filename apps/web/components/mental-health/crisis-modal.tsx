"use client";

import React from "react";
import { PhoneCall, Globe, AlertTriangle, X, ShieldAlert } from "lucide-react";
import { useUserRegion, SupportedRegion } from "@/lib/use-user-region";

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  const { region, regionData, allRegions, setRegion } = useUserRegion();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-rose-200 bg-white p-6 md:p-7 shadow-2xl dark:border-rose-900/60 dark:bg-zinc-900 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crisis-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with warning icon */}
        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/80 shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 id="crisis-title" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Immediate Crisis Support
            </h2>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
              Free, confidential, 24/7 human help is ready for you
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs md:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          If you are struggling with overwhelming distress, thoughts of self-harm, or despair, please reach out to trained professionals. You do not have to carry this alone.
        </p>

        {/* Country Selector Tabs */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
            Selected Region (Switch anytime):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {allRegions.map((r) => (
              <button
                key={r.code}
                onClick={() => setRegion(r.code as SupportedRegion)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${region === r.code
                  ? "bg-rose-600 text-white shadow-sm scale-102"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
              >
                <span>{r.flag}</span>
                <span>{r.countryName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Regional Helpline Hero Card */}
        <div className="mt-4 rounded-2xl border border-rose-300 bg-rose-50/80 p-4 dark:border-rose-900/60 dark:bg-rose-950/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 flex items-center gap-1">
              <span>{regionData.flag}</span>
              <span>Primary Helpline for {regionData.countryName}</span>
            </span>
            <span className="text-[10px] font-bold text-white bg-rose-600 px-2 py-0.5 rounded-full">
              Toll-Free &bull; 24/7
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                {regionData.primaryHelplineName}
              </p>
              <p className="text-xs text-rose-800 dark:text-rose-300 font-semibold mt-0.5">
                {regionData.primaryNumber}
              </p>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-snug">
                {regionData.description}
              </p>
            </div>

            <a
              href={regionData.primaryAction}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-transform active:scale-95 shrink-0"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Call Now</span>
            </a>
          </div>
        </div>

        {/* Secondary Helplines for the region */}
        <div className="mt-3 space-y-2.5">
          {regionData.secondaryHelplineName && (
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {regionData.secondaryHelplineName}
                </p>
                <p className="text-xs font-medium text-teal-600 dark:text-teal-400">
                  {regionData.secondaryNumber}
                </p>
              </div>
              <a
                href={regionData.secondaryAction}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                Contact
              </a>
            </div>
          )}

          {/* India specific additional helpline: Tele-MANAS alternative & KIRAN */}
          {region === "IN" && (
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/50">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  KIRAN Mental Health Rehabilitation
                </p>
                <p className="text-xs font-medium text-teal-600 dark:text-teal-400">
                  1800-599-0019 (Govt of India 24/7)
                </p>
              </div>
              <a
                href="tel:18005990019"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                Call
              </a>
            </div>
          )}

          {/* Find a Helpline Worldwide directory link */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Find A Helpline (Worldwide Directory)
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Verified crisis support in over 130 countries
                </p>
              </div>
            </div>
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Browse
            </a>
          </div>
        </div>

        {/* Emergency Alert Note */}
        <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>
            If you or someone around you is in immediate danger of injury, call emergency services directly at <strong>{regionData.emergencyNumber}</strong> or go to your local hospital.
          </span>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-300 bg-white px-5 py-2 text-xs md:text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            I understand, return to companion
          </button>
        </div>
      </div>
    </div>
  );
}
