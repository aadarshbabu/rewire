"use client";

import React, { useState, useEffect } from "react";
import { Wind, Play, Pause, RotateCcw, X, Sparkles } from "lucide-react";

interface BreathingWidgetProps {
  onClose?: () => void;
  compact?: boolean;
}

type Phase = "Inhale" | "Hold" | "Exhale" | "Rest";

const PHASES: { phase: Phase; duration: number; instruction: string; color: string }[] = [
  { phase: "Inhale", duration: 4, instruction: "Breathe in slowly through your nose...", color: "from-teal-400 to-emerald-500" },
  { phase: "Hold", duration: 4, instruction: "Gently hold your breath...", color: "from-emerald-400 to-cyan-500" },
  { phase: "Exhale", duration: 4, instruction: "Release the air smoothly through your mouth...", color: "from-cyan-400 to-indigo-500" },
  { phase: "Rest", duration: 4, instruction: "Rest and pause before the next breath...", color: "from-indigo-400 to-teal-500" },
];

export function BreathingWidget({ onClose, compact = false }: BreathingWidgetProps) {
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PHASES[0].duration);
  const [completedCycles, setCompletedCycles] = useState(0);

  const currentPhase = PHASES[phaseIndex];

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Next phase
            const nextIdx = (phaseIndex + 1) % PHASES.length;
            if (nextIdx === 0) {
              setCompletedCycles((c) => c + 1);
            }
            setPhaseIndex(nextIdx);
            return PHASES[nextIdx].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, phaseIndex]);

  const handleReset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsLeft(PHASES[0].duration);
    setCompletedCycles(0);
  };

  // Determine circle scale for animation
  let scaleClass = "scale-100";
  if (isActive) {
    if (currentPhase.phase === "Inhale") scaleClass = "scale-125 duration-4000 ease-out";
    else if (currentPhase.phase === "Hold") scaleClass = "scale-125 duration-1000";
    else if (currentPhase.phase === "Exhale") scaleClass = "scale-90 duration-4000 ease-in";
    else if (currentPhase.phase === "Rest") scaleClass = "scale-90 duration-1000";
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-teal-200/80 bg-gradient-to-b from-teal-50/70 via-emerald-50/40 to-cyan-50/60 p-6 shadow-lg backdrop-blur-md dark:border-teal-900/50 dark:from-teal-950/30 dark:via-zinc-900/80 dark:to-cyan-950/30 ${
        compact ? "max-w-md" : "w-full max-w-lg"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
            <Wind className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>Box Breathing Calm</span>
              <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              4-4-4-4 Grounding rhythm to regulate nervous system
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Breathing Circle Area */}
      <div className="my-8 flex flex-col items-center justify-center">
        <div className="relative flex h-48 w-48 items-center justify-center">
          {/* Animated Glow Rings */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr ${currentPhase.color} opacity-20 blur-xl transition-transform duration-1000 ${
              isActive ? "animate-pulse" : ""
            }`}
          />

          <div
            className={`absolute h-40 w-40 rounded-full border border-teal-300/60 bg-teal-100/40 transition-transform ${scaleClass} dark:border-teal-700/50 dark:bg-teal-950/40`}
          />

          {/* Central Counter & Phase indicator */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold tracking-tight text-teal-900 dark:text-teal-100">
              {isActive ? secondsLeft : "4s"}
            </span>
            <span className="mt-1 text-xs font-semibold tracking-wider uppercase text-teal-700 dark:text-teal-300">
              {isActive ? currentPhase.phase : "Ready"}
            </span>
          </div>
        </div>

        {/* Phase instruction */}
        <p className="mt-4 text-center text-xs font-medium text-zinc-600 dark:text-zinc-300 min-h-[1.5rem]">
          {isActive ? currentPhase.instruction : "Click Start when you're ready to begin a calming cycle."}
        </p>
      </div>

      {/* Controls & Metrics */}
      <div className="flex items-center justify-between pt-2 border-t border-teal-200/60 dark:border-teal-900/40">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Cycles completed: <strong className="text-teal-700 dark:text-teal-300">{completedCycles}</strong>
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all ${
              isActive
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            {isActive ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                <span>Start</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="rounded-xl border border-zinc-200 bg-white/80 p-2 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
