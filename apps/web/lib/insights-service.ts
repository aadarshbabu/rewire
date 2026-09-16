import type { UserDynamicInsights, SyncEntryPayload } from "@rewire/types";

const WORKER_BASE_URL = process.env.AI_WORKER_URL || "http://localhost:4000";

/**
 * Fetches dynamic graph-derived user cognitive insights from the NestJS AI worker.
 */
export async function fetchUserInsights(userId: string): Promise<UserDynamicInsights> {
  const endpoint = `${WORKER_BASE_URL}/agent/insights/${encodeURIComponent(userId)}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok) {
      return (await response.json()) as UserDynamicInsights;
    }
  } catch (err) {
    console.warn(`[insights-service] Failed to fetch graph insights for ${userId}:`, err);
  }

  // Safe fallback default
  return {
    topTriggers: [],
    effectiveStrategies: [],
    distortionTrends: [],
    totalEntriesAnalyzed: 0,
    overallPositiveRate: 0,
    personalizedSummary: "Start journaling and recording your mood progression to reveal your cognitive insights.",
  };
}

/**
 * Sends a single journal entry and its reframing outcome to Neo4j.
 */
export async function syncJournalEntryToGraph(payload: SyncEntryPayload): Promise<boolean> {
  const endpoint = `${WORKER_BASE_URL}/agent/insights/sync-entry`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });

    return response.ok;
  } catch (err) {
    console.warn(`[insights-service] Failed to sync entry ${payload.entryId} to graph:`, err);
    return false;
  }
}

/**
 * Backfills all existing user entries into Neo4j.
 */
export async function syncAllUserEntriesToGraph(userId: string): Promise<{ syncedCount: number }> {
  const endpoint = `${WORKER_BASE_URL}/agent/insights/sync-all/${encodeURIComponent(userId)}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) {
      return (await response.json()) as { syncedCount: number };
    }
  } catch (err) {
    console.warn(`[insights-service] Failed to sync all entries for ${userId}:`, err);
  }

  return { syncedCount: 0 };
}
