"use client";

import React, { useEffect, useRef, useState } from "react";
import { Wind, CheckCircle2, Sparkles } from "lucide-react";

interface ReleaseAnimationProps {
  textToRelease: string;
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

export function ReleaseAnimation({ textToRelease, onComplete }: ReleaseAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"burning" | "dissolving" | "released">("burning");
  const [breathPrompt, setBreathPrompt] = useState("Take a deep breath in...");

  useEffect(() => {
    // Breathing timer cues
    const t1 = setTimeout(() => setBreathPrompt("Now breathe out slowly as these thoughts leave your mind..."), 2000);
    const t2 = setTimeout(() => {
      setPhase("released");
      setBreathPrompt("Your thoughts are released. You are safe in this present moment.");
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = 320);

    const particles: Particle[] = [];
    const colors = ["#2dd4bf", "#38bdf8", "#818cf8", "#f43f5e", "#fbbf24", "#ffffff"];

    // Initialize particles across canvas
    for (let i = 0; i < 160; i++) {
      particles.push({
        x: Math.random() * width,
        y: height * 0.4 + Math.random() * (height * 0.4),
        vx: (Math.random() - 0.5) * 2.5,
        vy: -Math.random() * 2.5 - 0.8,
        alpha: Math.random() * 0.9 + 0.1,
        size: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.005;

        if (p.alpha <= 0) {
          p.x = Math.random() * width;
          p.y = height * 0.6;
          p.alpha = Math.random() * 0.8 + 0.2;
          p.vy = -Math.random() * 2 - 0.5;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 p-8 text-center text-white shadow-2xl">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Floating Icon */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/40 animate-pulse">
          {phase === "released" ? (
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          ) : (
            <Wind className="h-8 w-8 text-teal-300 animate-spin-slow" />
          )}
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-white">
          {phase === "released" ? "Ritual Complete: Released" : "Dissolving Mental Clutter..."}
        </h3>

        {/* Guided Breathing Exhalation Cue */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-950/60 px-5 py-2 text-sm font-medium text-teal-200 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-teal-400 animate-pulse" />
          <span>{breathPrompt}</span>
        </div>

        {/* Fading text preview */}
        <div className="mt-6 max-h-28 max-w-lg overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs italic text-zinc-400 transition-opacity duration-1000 select-none">
          <p className={phase === "released" ? "line-through opacity-20" : "opacity-60 blur-[0.6px]"}>
            &ldquo;{textToRelease.slice(0, 240)}...&rdquo;
          </p>
        </div>

        {/* Finish button when complete */}
        {phase === "released" && (
          <button
            onClick={onComplete}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-teal-500/20 transition-all hover:scale-105 hover:from-teal-500 hover:to-emerald-500"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Check In With How You Feel Now</span>
          </button>
        )}
      </div>
    </div>
  );
}
