"use client";

import React, { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Wind,
  Trash2,
  ChevronDown,
  ChevronUp,
  Brain,
  Bookmark,
  X,
} from "lucide-react";
import { JournalEntryItem, ReframingAnalysis } from "@rewire/types";

interface OffloadHistoryProps {
  onClose?: () => void;
}

export function OffloadHistory({ onClose }: OffloadHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: rawEntries, isLoading } = useQuery(trpc.journal.list.queryOptions({ limit: 25 }));
  const entries = rawEntries as unknown as JournalEntryItem[] | undefined;

  const deleteMutation = useMutation(
    trpc.journal.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.journal.list.queryFilter());
      },
    })
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this journal entry?")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            Journal & Offload History
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Review past brain dumps, cognitive reframes, and stress reduction trends
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            <span>Close</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3 py-6">
          <div className="h-16 w-full animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800/50" />
          <div className="h-16 w-full animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800/50" />
        </div>
      ) : !entries || entries.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
            <Bookmark className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            No entries yet
          </h4>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
            Your saved brain dumps and cognitive reframes will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const isExpanded = expandedId === entry.id;
            const reframingResult = entry.reframingResult as unknown as ReframingAnalysis | null;
            const dateStr = new Date(entry.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={entry.id}
                className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 transition-all"
              >
                {/* Header summary row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  className="flex cursor-pointer items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white ${
                        entry.actionTaken === "released"
                          ? "bg-rose-500 shadow-rose-500/20"
                          : "bg-teal-600 shadow-teal-500/20"
                      } shadow-sm`}
                    >
                      {entry.actionTaken === "released" ? (
                        <Wind className="h-4 w-4" />
                      ) : (
                        <Brain className="h-4 w-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {entry.title || "Brain Dump"}
                        </span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                          • {dateStr}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                        {entry.moodBefore && (
                          <span className="inline-flex items-center gap-1">
                            <span>Distress:</span>
                            <span className="font-semibold text-rose-600 dark:text-rose-400">
                              {entry.moodBefore}/10
                            </span>
                            {entry.moodAfter && (
                              <>
                                <span>→</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                  {entry.moodAfter}/10
                                </span>
                              </>
                            )}
                          </span>
                        )}

                        {entry.actionTaken && (
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-semibold text-zinc-600 uppercase dark:bg-zinc-800 dark:text-zinc-300">
                            {entry.actionTaken}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(entry.id, e)}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-zinc-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800/80 dark:bg-zinc-950/40 space-y-4">
                    {/* Raw Dump */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Original Brain Dump
                      </span>
                      <p className="mt-1 whitespace-pre-wrap text-xs text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800 leading-relaxed font-mono text-[11px]">
                        {entry.rawContent}
                      </p>
                    </div>

                    {/* Reframing Result if available */}
                    {reframingResult && (
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                          Reframing Breakdown
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                            <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                              In Your Control:
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300 text-[11px]">
                              {reframingResult.circleOfControl?.inControl?.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                            <span className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                              Outside Control:
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-zinc-500 dark:text-zinc-400 text-[11px]">
                              {reframingResult.circleOfControl?.outsideControl?.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {reframingResult.microAction && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
                            <span className="font-bold">2-Minute Action: </span>
                            {reframingResult.microAction}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
