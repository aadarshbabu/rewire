"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { UserButton } from "@/components/auth/user-button";
import { CrisisModal } from "@/components/mental-health/crisis-modal";
import { useUserRegion } from "@/lib/use-user-region";
import { Heart, MessageSquare, PenTool, PhoneCall, Menu, X } from "lucide-react";

export function SiteHeader() {
  const { data: session } = useSession();
  const { regionData } = useUserRegion();
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />

      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Heart className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                Rewire
              </span>
              <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 tracking-wide uppercase">
                Mental Health Companion
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <Link
              href="/about"
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              About
            </Link>
            <Link
              href="/offload"
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Brain Dump
            </Link>
            <Link
              href="/disclaimer"
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              Clinical Disclaimer
            </Link>
            <Link
              href="/crisis-resources"
              className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              Crisis Directory
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Quick 24/7 Crisis Access */}
            <button
              onClick={() => setIsCrisisModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 transition-colors"
              title={`Immediate crisis help (${regionData.countryName})`}
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>{regionData.flag}</span>
              <span className="hidden sm:inline">Crisis ({regionData.primaryNumber})</span>
              <span className="sm:hidden">{regionData.primaryNumber}</span>
            </button>

            {session?.user ? (
              <div className="flex items-center gap-2">
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/offload"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300 transition-colors"
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>Try Brain Dump</span>
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 px-6 py-4 space-y-3">
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-teal-600"
            >
              About Rewire
            </Link>
            <Link
              href="/offload"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-teal-600"
            >
              Brain Dump Journal
            </Link>
            <Link
              href="/disclaimer"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-teal-600"
            >
              Clinical & Medical Disclaimer
            </Link>
            <Link
              href="/crisis-resources"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-rose-600 dark:text-rose-400"
            >
              Crisis Directory (988)
            </Link>
            <Link
              href="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-teal-600"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-teal-600"
            >
              Terms of Service
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
