"use client";

import React from "react";
import { PhoneCall, MessageSquare, Globe, AlertTriangle, X, ShieldAlert } from "lucide-react";

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl dark:border-rose-900/60 dark:bg-zinc-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crisis-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with warning icon */}
        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/80">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 id="crisis-title" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Immediate Crisis Support
            </h2>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              Free, confidential, 24/7 human help is available
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          If you or someone you know is struggling with acute distress, thoughts of self-harm, or suicide, please know that you are not alone. Please reach out to accredited professionals who are ready to support you right now.
        </p>

        {/* Contact list cards */}
        <div className="mt-5 space-y-3">
          {/* 988 US & Canada */}
          <div className="flex items-center justify-between rounded-xl border border-rose-200/80 bg-rose-50/60 p-3.5 dark:border-rose-900/40 dark:bg-rose-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 text-white font-bold text-sm shadow-sm">
                <PhoneCall className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  988 Suicide & Crisis Lifeline
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  United States & Canada • Call or Text 988
                </p>
              </div>
            </div>
            <a
              href="tel:988"
              className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-rose-700 transition-colors"
            >
              Call 988
            </a>
          </div>

          {/* Crisis Text Line */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-sm">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Crisis Text Line
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Text HOME to 741741 (US & Canada) or 85258 (UK)
                </p>
              </div>
            </div>
            <a
              href="sms:741741?body=HOME"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              Text Now
            </a>
          </div>

          {/* UK Samaritans & 111 */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm shadow-sm">
                <PhoneCall className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Samaritans & NHS 111
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  United Kingdom • Call 116 123 or 111
                </p>
              </div>
            </div>
            <a
              href="tel:116123"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              Call 116 123
            </a>
          </div>

          {/* Find a Helpline International */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-600 text-white font-bold text-sm shadow-sm">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Find A Helpline (Worldwide)
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Confidential support in over 130 countries
                </p>
              </div>
            </div>
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              Visit
            </a>
          </div>
        </div>

        {/* Emergency Alert Note */}
        <div className="mt-5 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>
            If you are in immediate physical danger, please call your country&apos;s emergency number (such as <strong>911</strong>, <strong>999</strong>, or <strong>112</strong>) or proceed to the nearest emergency room.
          </span>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            I understand, return to chat
          </button>
        </div>
      </div>
    </div>
  );
}
