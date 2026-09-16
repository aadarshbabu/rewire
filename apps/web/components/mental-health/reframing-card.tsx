"use client";

import React, { useState } from "react";
import { ReframingAnalysis } from "@rewire/types";
import {
  Brain,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Bookmark,
  Copy,
  Check,
  RotateCcw,
  Compass,
} from "lucide-react";

interface ReframingCardProps {
  analysis: ReframingAnalysis;
  rawContent?: string;
  moodBefore: number | null;
  distressTags?: string[];
  isSaving?: boolean;
  onSave?: (moodAfter: number) => void;
  onReset?: () => void;
}

export function ReframingCard({
  analysis,
  rawContent,
  moodBefore,
  distressTags,
  isSaving = false,
  onSave,
  onReset,
}: ReframingCardProps) {
  const [moodAfter, setMoodAfter] = useState<number>(Math.max(1, (moodBefore ?? 7) - 3));
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const reliefDelta = moodBefore ? moodBefore - moodAfter : null;

  const handleCopy = () => {
    const text = `REWIRE COGNITIVE REFRAMING SUMMARY
${analysis.summary}

WHAT IS IN MY CONTROL:
${analysis.circleOfControl.inControl.map((i) => `• ${i}`).join("\n")}

WHAT IS OUTSIDE MY CONTROL:
${analysis.circleOfControl.outsideControl.map((i) => `• ${i}`).join("\n")}

MY 2-MINUTE MICRO-STEP:
${analysis.microAction}

GROUNDING AFFIRMATION:
${analysis.groundingAffirmation}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave(moodAfter);
      setIsSaved(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="rounded-3xl border border-teal-200/80 bg-gradient-to-br from-white via-teal-50/40 to-emerald-50/30 p-6 shadow-sm dark:border-teal-900/50 dark:from-zinc-900 dark:via-teal-950/20 dark:to-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Cognitive Restructuring & Reframe
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Separating actionable reality from mental noise
              </p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-teal-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied!" : "Copy Summary"}</span>
          </button>
        </div>

        <p className="mt-4 text-xs font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* Personal Journey & Evolution Context */}
      {analysis.evolutionNote && (
        <div className="rounded-3xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-teal-50/40 p-5 shadow-sm dark:border-indigo-900/50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-zinc-900">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300">
              <Compass className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Your Emotional Journey & Trajectory
              </h4>
            </div>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Personalized Context
            </span>
          </div>

          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
            {analysis.evolutionNote}
          </p>

          {analysis.recurringPatterns && analysis.recurringPatterns.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-indigo-100/60 dark:border-indigo-900/40">
              <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                Recurring themes noticed in your story:
              </span>
              {analysis.recurringPatterns.map((pat, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-zinc-800 dark:text-indigo-300 shadow-2xs border border-indigo-100 dark:border-indigo-900"
                >
                  {pat}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Circle of Control Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* In My Control */}
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-950/60 dark:bg-emerald-950/20 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 mb-3">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Within Your Control (Your Agency)
            </h4>
          </div>
          <ul className="space-y-2.5">
            {analysis.circleOfControl.inControl.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed bg-white/70 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/80 dark:text-emerald-300">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Outside My Control */}
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 shadow-sm">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 mb-3">
            <Compass className="h-4 w-4 shrink-0 text-zinc-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Outside Your Control (To Accept & Release)
            </h4>
          </div>
          <ul className="space-y-2.5">
            {analysis.circleOfControl.outsideControl.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed bg-white/70 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  ○
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Identified Cognitive Distortions & Reframes */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 mb-4">
          <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Cognitive Distortions Unmasked
          </h4>
        </div>

        <div className="space-y-4">
          {analysis.distortions.map((dist, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200/60 bg-zinc-50/60 p-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  {dist.name}
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {dist.description}
                </span>
              </div>

              <div className="mt-2 rounded-xl bg-white p-2.5 text-xs text-zinc-600 italic dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-200/40 dark:border-zinc-800">
                <span className="font-semibold text-zinc-500 not-italic">Extracted Thought: </span>
                &ldquo;{dist.detectedThought}&rdquo;
              </div>

              <div className="mt-3 flex items-start gap-2 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">
                    Empathetic Reframe:{" "}
                  </span>
                  <span>{dist.compassionateReframe}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Single 2-Minute Micro Action */}
      <div className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/40 p-6 shadow-sm dark:border-amber-900/50 dark:from-amber-950/30 dark:to-zinc-900">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 mb-2">
          <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Single 2-Minute Micro-Action
          </h4>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
          To combat executive dysfunction, avoid doing everything at once. Focus only on this single, low-friction micro-step:
        </p>
        <div className="rounded-2xl border border-amber-300/80 bg-white p-4 text-xs font-semibold text-zinc-900 shadow-sm dark:border-amber-800/80 dark:bg-zinc-900 dark:text-zinc-100">
          👉 {analysis.microAction}
        </div>
      </div>

      {/* Grounding Affirmation */}
      <div className="rounded-2xl border border-teal-200/60 bg-teal-50/40 p-4 text-center text-xs italic text-teal-800 dark:border-teal-900/40 dark:bg-teal-950/20 dark:text-teal-300">
        &ldquo;{analysis.groundingAffirmation}&rdquo;
      </div>

      {/* Post-Session Distress Barometer */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              Post-Offload Check-in
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              How overwhelmed or tense do you feel right now?
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
              {moodAfter}/10
            </span>
            {reliefDelta !== null && reliefDelta > 0 && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                ↓ {reliefDelta} points calmer
              </span>
            )}
          </div>
        </div>

        <input
          type="range"
          min="1"
          max="10"
          value={moodAfter}
          onChange={(e) => setMoodAfter(parseInt(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-teal-600 dark:bg-zinc-800"
        />
        <div className="flex justify-between text-[10px] font-medium text-zinc-400 mt-1">
          <span>1 (Clear & Calm)</span>
          <span>5 (Moderate)</span>
          <span>10 (Overwhelmed)</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>New Brain Dump</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveClick}
              disabled={isSaving || isSaved}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-500/20 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 transition-all"
            >
              {isSaved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              <span>{isSaved ? "Saved to Journal" : isSaving ? "Saving..." : "Save to Journal"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
