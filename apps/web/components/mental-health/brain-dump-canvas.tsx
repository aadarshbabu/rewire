"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import {
  Brain,
  Wind,
  Flame,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { ReframingAnalysis } from "@rewire/types";
import { ReleaseAnimation } from "./release-animation";
import { ReframingCard } from "./reframing-card";

const PROMPTS = [
  "What is the repetitive worry or conversation looping in your mind?",
  "What are you dreading doing, and what's the worst-case scenario your brain is inventing?",
  "What expectations from others or from yourself feel impossibly heavy right now?",
  "What are 3 things on your plate that you cannot actually control today?",
];

const EMOTION_TAGS = [
  "Racing Thoughts",
  "Overwhelmed",
  "Fear of Failure",
  "Paralyzed / Stuck",
  "Exhausted",
  "Anxious",
  "Self-Critical",
];

export function BrainDumpCanvas() {
  const { data: session } = useSession();
  const trpc = useTRPC();

  // Clinical State
  const [moodBefore, setMoodBefore] = useState<number>(7);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Overwhelmed"]);
  const [content, setContent] = useState<string>("");
  const [createdEntryId, setCreatedEntryId] = useState<string | null>(null);

  // Zen Timer State (optional sprint)
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Workflow State: "dumping" | "releasing" | "reframed" | "released-done"
  const [viewState, setViewState] = useState<"dumping" | "releasing" | "reframed" | "released-done">("dumping");
  const [reframingResult, setReframingResult] = useState<ReframingAnalysis | null>(null);
  const [postReleaseMood, setPostReleaseMood] = useState<number>(4);

  // tRPC mutations with React Query v5
  const reframeMutation = useMutation(trpc.journal.reframe.mutationOptions());
  const createMutation = useMutation(trpc.journal.create.mutationOptions());
  const updateMutation = useMutation(trpc.journal.updateAfter.mutationOptions());

  // Handle Timer
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Word count & line estimate
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  // Trigger Cognitive Reframing
  const handleStartReframing = async () => {
    if (!content.trim()) return;

    try {
      // 1. If signed in, create initial journal entry
      let entryId: string | null = null;
      if (session?.user) {
        const entry = await createMutation.mutateAsync({
          rawContent: content,
          moodBefore,
          distressTags: selectedTags,
        });
        entryId = entry.id;
        setCreatedEntryId(entry.id);
      }

      // 2. Request AI cognitive restructuring
      const analysis = await reframeMutation.mutateAsync({
        rawContent: content,
        moodBefore,
        distressTags: selectedTags,
      });

      setReframingResult(analysis);
      setViewState("reframed");

      // 3. Update entry with analysis
      if (entryId) {
        await updateMutation.mutateAsync({
          id: entryId,
          actionTaken: "reframed",
          reframingResult: analysis,
        });
      }
    } catch (err: any) {
      console.error("Error during reframing:", err);
    }
  };

  // Trigger Ritual Release / Dissolve
  const handleStartRelease = async () => {
    if (!content.trim()) return;

    // Save initial entry if signed in
    if (session?.user) {
      try {
        const entry = await createMutation.mutateAsync({
          rawContent: content,
          moodBefore,
          distressTags: selectedTags,
        });
        setCreatedEntryId(entry.id);
      } catch (err: any) {
        console.error("Error creating entry:", err);
      }
    }

    setViewState("releasing");
  };

  const handleReleaseAnimationComplete = () => {
    setViewState("released-done");
  };

  const handleSavePostRelease = async () => {
    if (createdEntryId) {
      await updateMutation.mutateAsync({
        id: createdEntryId,
        moodAfter: postReleaseMood,
        actionTaken: "released",
      });
    }
    handleReset();
  };

  const handleSaveReframed = async (moodAfter: number) => {
    if (createdEntryId && reframingResult) {
      await updateMutation.mutateAsync({
        id: createdEntryId,
        moodAfter,
        actionTaken: "reframed",
        reframingResult,
      });
    }
  };

  const handleReset = () => {
    setContent("");
    setViewState("dumping");
    setReframingResult(null);
    setCreatedEntryId(null);
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Active Phase Routing */}
      {viewState === "releasing" && (
        <ReleaseAnimation
          textToRelease={content}
          onComplete={handleReleaseAnimationComplete}
        />
      )}

      {viewState === "released-done" && (
        <div className="rounded-3xl border border-emerald-200/80 bg-white p-8 text-center shadow-lg dark:border-emerald-900/50 dark:bg-zinc-900">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Wind className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Mental Clutter Released
          </h3>
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            You poured those thoughts out of your head and symbolically let them dissolve. You do not have to carry everything right now.
          </p>

          <div className="mt-6 max-w-xs mx-auto text-left">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              How does your mind feel right now? ({postReleaseMood}/10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={postReleaseMood}
              onChange={(e) => setPostReleaseMood(parseInt(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-teal-600 dark:bg-zinc-800"
            />
            <div className="flex justify-between text-[10px] font-medium text-zinc-400 mt-1">
              <span>1 (Very Calm)</span>
              <span>10 (Overwhelmed)</span>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={handleSavePostRelease}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-500/20 hover:from-teal-500 hover:to-emerald-500 transition-all"
            >
              <span>{session?.user ? "Save To Journal & Finish" : "Finish Session"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {viewState === "reframed" && reframingResult && (
        <ReframingCard
          analysis={reframingResult}
          rawContent={content}
          moodBefore={moodBefore}
          distressTags={selectedTags}
          isSaving={updateMutation.isPending}
          onSave={handleSaveReframed}
          onReset={handleReset}
        />
      )}

      {viewState === "dumping" && (
        <div className="space-y-6">
          {/* Step 1: Initial Distress Barometer & Mindset */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Step 1 &bull; Baseline Check-In
                </span>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Current Distress Level: {moodBefore}/10
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodBefore}
                  onChange={(e) => setMoodBefore(parseInt(e.target.value))}
                  className="h-2 w-36 cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-teal-600 dark:bg-zinc-800"
                />
              </div>
            </div>

            {/* Distress Emotion Tags */}
            <div className="flex flex-wrap gap-1.5">
              {EMOTION_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-teal-600 text-white shadow-sm shadow-teal-600/30"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: The Paper Brain Dump Canvas */}
          <div className="relative overflow-hidden rounded-3xl border border-zinc-300/80 bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-zinc-200/80 bg-zinc-50/70 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-950/50">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  Uninhibited Brain Dump (Lined Paper)
                </span>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-mono font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                  <Clock className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                  <span>{formatTime(timerSeconds)}</span>
                </div>

                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  title={isTimerRunning ? "Pause Timer" : "Start Sprint Timer"}
                >
                  {isTimerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(0);
                  }}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  title="Reset Timer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Prompt Helper Bar */}
            <div className="border-b border-zinc-100 bg-amber-50/40 px-5 py-2.5 text-xs text-amber-900 dark:border-zinc-800/60 dark:bg-amber-950/20 dark:text-amber-200 flex items-center gap-2">
              <Lightbulb className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <span className="font-medium truncate">
                Prompt: "{PROMPTS[Math.floor((timerSeconds / 30) % PROMPTS.length)]}"
              </span>
            </div>

            {/* Paper Lined Textarea */}
            <div className="relative p-6">
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (!isTimerRunning && e.target.value.length > 0 && timerSeconds === 0) {
                    setIsTimerRunning(true);
                  }
                }}
                placeholder="Pour everything out here without judging yourself. Write your fears, racing thoughts, endless to-dos, frustration, or catastrophic predictions. Do not edit, fix grammar, or filter. Just dump it all onto paper..."
                rows={12}
                className="w-full resize-y bg-transparent font-sans text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-600"
                style={{
                  lineHeight: "2rem",
                  backgroundImage: "linear-gradient(transparent 1.9rem, rgba(200, 200, 200, 0.15) 1.95rem)",
                  backgroundSize: "100% 2rem",
                }}
              />
            </div>

            {/* Live Stats Bottom Bar */}
            <div className="flex flex-wrap items-center justify-between border-t border-zinc-200/80 bg-zinc-50/50 px-5 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40">
              <div className="flex items-center gap-3">
                <span>{wordCount} words poured out</span>
                <span>&bull;</span>
                <span className="text-teal-600 dark:text-teal-400 font-medium">
                  {content.length > 0 ? "Mental pressure lowering..." : "Ready when you are"}
                </span>
              </div>

              {content.length > 0 && (
                <button
                  onClick={() => setContent("")}
                  className="text-zinc-400 hover:text-rose-500 transition-colors"
                >
                  Clear Paper
                </button>
              )}
            </div>
          </div>

          {/* Step 3: Choose Your Coping Pathway */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Step 3 &bull; Choose Your Offload Path
              </span>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                What does your nervous system need right now?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Cognitive Reframing */}
              <div className="rounded-2xl border border-teal-200 bg-teal-50/40 p-5 dark:border-teal-900/60 dark:bg-teal-950/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 mb-2">
                    <Brain className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    <h4 className="text-sm font-bold">AI Cognitive Reframing</h4>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Transform mental chaos into structured clarity. Identifies what is in your control, unmasks cognitive distortions, and builds a realistic 2-minute next step.
                  </p>
                </div>

                <button
                  onClick={handleStartReframing}
                  disabled={!content.trim() || reframeMutation.isPending}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-500/20 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-40 transition-all"
                >
                  {reframeMutation.isPending ? (
                    <span>Structuring Clarity...</span>
                  ) : (
                    <>
                      <span>Analyze & Reframe My Thoughts</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Option B: Ritual Release / Let It Go */}
              <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 dark:border-rose-900/60 dark:bg-rose-950/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 mb-2">
                    <Flame className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    <h4 className="text-sm font-bold">Dissolve & Let It Go</h4>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    For things outside your control, past events, or worries you just need to purge. Watch these thoughts dissolve into calming sparks and exhale deeply.
                  </p>
                </div>

                <button
                  onClick={handleStartRelease}
                  disabled={!content.trim()}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:from-rose-500 hover:to-pink-500 disabled:opacity-40 transition-all"
                >
                  <Wind className="h-4 w-4" />
                  <span>Dissolve & Release Thoughts</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
