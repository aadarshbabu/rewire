"use client";

import React, { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Sparkles,
  TrendingUp,
  Activity,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Brain,
  Zap,
  BarChart3,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import type {
  UserDynamicInsights,
  TriggerInsight,
  StrategyEfficacy,
  DistortionTrend,
} from "@rewire/types";

export function DynamicInsights() {
  const trpc = useTRPC();
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const {
    data: insights,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.insights.getDynamicInsights.queryOptions());

  const syncAllMutation = useMutation(trpc.insights.syncAllEntries.mutationOptions());

  const handleSyncAll = async () => {
    try {
      setSyncStatus("Syncing journal entries to Neo4j graph...");
      const res = (await syncAllMutation.mutateAsync()) as { syncedCount: number };
      setSyncStatus(`Successfully synchronized ${res.syncedCount} journal entries to your graph!`);
      await refetch();
      setTimeout(() => setSyncStatus(null), 4000);
    } catch (err: unknown) {
      setSyncStatus("Failed to sync entries. Please verify Neo4j is running.");
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 dark:bg-teal-500/20">
          <RefreshCw className="h-6 w-6 animate-spin text-teal-600 dark:text-teal-400" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Traversing Your Cognitive Graph
        </h3>
        <p className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
          Analyzing recurring distress triggers and cognitive reframing efficacy from Neo4j...
        </p>
      </div>
    );
  }

  if (isError || !insights) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 text-center dark:border-red-950/60 dark:bg-red-950/20">
        <ShieldAlert className="mx-auto h-8 w-8 text-red-500" />
        <h4 className="mt-2 text-sm font-semibold text-red-900 dark:text-red-200">
          Unable to Load Cognitive Graph Insights
        </h4>
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          Ensure the Neo4j service and NestJS AI Worker API are running.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-red-700"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Connection
        </button>
      </div>
    );
  }

  const typedInsights = insights as UserDynamicInsights;
  const {
    topTriggers = [],
    effectiveStrategies = [],
    distortionTrends = [],
    totalEntriesAnalyzed = 0,
    overallPositiveRate = 0,
    personalizedSummary = "",
  } = typedInsights;

  const topTrigger: TriggerInsight | undefined = topTriggers[0];
  const topStrategy: StrategyEfficacy | undefined = effectiveStrategies[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/60 bg-teal-50/70 px-3 py-1 text-xs font-semibold text-teal-800 dark:border-teal-800/40 dark:bg-teal-950/30 dark:text-teal-300">
            <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>Neo4j Graph-Powered Analytics</span>
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Your Personal Cognitive Insights
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Derived from longitudinal pattern traversals linking triggers, distortions, and proven coping strategies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncAll}
            disabled={syncAllMutation.isPending}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-zinc-500 ${syncAllMutation.isPending ? "animate-spin" : ""}`}
            />
            <span>{syncAllMutation.isPending ? "Syncing Graph..." : "Sync Past Entries"}</span>
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="rounded-xl border border-teal-200 bg-teal-50/80 px-4 py-3 text-xs font-medium text-teal-800 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200 animate-in fade-in">
          {syncStatus}
        </div>
      )}

      {/* Hero Synthesized Summary Card */}
      <div className="relative overflow-hidden rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent p-6 shadow-sm dark:border-teal-900/50 dark:from-teal-950/30 dark:via-emerald-950/10">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20">
            <Brain className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
              Cognitive Evolution Digest
            </span>
            <p className="text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
              {personalizedSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium uppercase tracking-wider">Entries Ingested</span>
            <BarChart3 className="h-4 w-4" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {totalEntriesAnalyzed}
          </div>
          <span className="text-[10px] text-zinc-400">Cross-referenced in graph</span>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Relief Rate
            </span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {overallPositiveRate}%
          </div>
          <span className="text-[10px] text-zinc-400">Positive mood elevation</span>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Top Trigger
            </span>
            <Activity className="h-4 w-4" />
          </div>
          <div className="mt-2 truncate text-base font-bold text-zinc-900 dark:text-zinc-50">
            {topTrigger ? topTrigger.trigger : "None logged"}
          </div>
          <span className="text-[10px] text-zinc-400">
            {topTrigger ? `${topTrigger.occurrences} occurrences` : "Record brain dump"}
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between text-teal-500">
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              Best Reframe
            </span>
            <Zap className="h-4 w-4" />
          </div>
          <div className="mt-2 truncate text-base font-bold text-teal-600 dark:text-teal-400">
            {topStrategy ? topStrategy.strategy.replace(" Delineation", "") : "None yet"}
          </div>
          <span className="text-[10px] text-zinc-400">
            {topStrategy ? `+${topStrategy.avgMoodImprovement} avg mood lift` : "Apply reframing"}
          </span>
        </div>
      </div>

      {/* Main Insights Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card 1: Effective Reframing Strategies Leaderboard */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Strategy Efficacy Leaderboard
              </h3>
            </div>
            <span className="text-[11px] font-medium text-zinc-400">Ranked by Mood Lift</span>
          </div>

          <div className="mt-4 space-y-4">
            {effectiveStrategies.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400">
                No strategy outcomes recorded yet. Reframing your thoughts and rating your post-offload mood will populate this leaderboard.
              </div>
            ) : (
              effectiveStrategies.map((item: StrategyEfficacy, idx: number) => (
                <div
                  key={item.strategy}
                  className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 transition-all hover:border-teal-200 dark:border-zinc-800/60 dark:bg-zinc-800/40 dark:hover:border-teal-900"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.strategy}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                        <span>Applied {item.timesApplied}x</span>
                        <span>•</span>
                        <span>Success rate: {item.successRate}%</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        +{item.avgMoodImprovement} pts
                      </span>
                      <span className="mt-0.5 text-[10px] text-zinc-400">Avg Lift</span>
                    </div>
                  </div>

                  {/* Visual Efficacy Progress Bar */}
                  <div className="mt-3">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
                        style={{ width: `${Math.min(item.successRate, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Triggers Handled */}
                  {item.triggersHandled && item.triggersHandled.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-1">
                      <span className="text-[10px] font-medium text-zinc-400">Proven for:</span>
                      {item.triggersHandled.map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 shadow-xs dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Card 2: Recurrent Triggers & Initial Distress */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <Activity className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Recurrent Distress Triggers
              </h3>
            </div>
            <span className="text-[11px] font-medium text-zinc-400">Frequency & Distress</span>
          </div>

          <div className="mt-4 space-y-3">
            {topTriggers.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400">
                No triggers logged yet. Tagging your brain dumps (e.g. Work, Overthinking) allows the graph to map your recurring stressors.
              </div>
            ) : (
              topTriggers.map((trig: TriggerInsight) => (
                <div
                  key={trig.trigger}
                  className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/60 p-3.5 dark:border-zinc-800/60 dark:bg-zinc-800/40"
                >
                  <div>
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {trig.trigger}
                    </span>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <span>{trig.occurrences} sessions</span>
                      <span>•</span>
                      <span>Initial Distress: {trig.avgDistressLevel}/10</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                      <ArrowUpRight className="h-3 w-3" />
                      +{trig.avgMoodDelta}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Card 3: Cognitive Distortion Habit Patterns */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Cognitive Distortion Habit Patterns
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Unmasked thought traps identified across your journaling history
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {distortionTrends.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-400">
              No distortions logged yet. When the AI unmasks cognitive distortions in your thoughts, they will appear here with their triggering contexts.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {distortionTrends.map((d: DistortionTrend) => (
                <div
                  key={d.distortion}
                  className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3.5 dark:border-zinc-800/60 dark:bg-zinc-800/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {d.distortion}
                    </span>
                    <span className="rounded-full bg-zinc-200/70 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                      {d.occurrences}x
                    </span>
                  </div>

                  {d.associatedTriggers && d.associatedTriggers.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <span className="text-[10px] text-zinc-400">Linked to:</span>
                      {d.associatedTriggers.map((t: string) => (
                        <span
                          key={t}
                          className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 shadow-2xs dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
