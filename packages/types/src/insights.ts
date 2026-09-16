export interface TriggerInsight {
  trigger: string;
  occurrences: number;
  avgDistressLevel: number; // Avg moodBefore (1-10)
  avgMoodDelta: number; // Avg (moodAfter - moodBefore)
}

export interface StrategyEfficacy {
  strategy: string;
  timesApplied: number;
  avgMoodImprovement: number; // Avg (moodAfter - moodBefore)
  successRate: number; // % of times mood improved (> 0)
  triggersHandled: string[];
}

export interface DistortionTrend {
  distortion: string;
  occurrences: number;
  associatedTriggers: string[];
}

export interface UserDynamicInsights {
  topTriggers: TriggerInsight[];
  effectiveStrategies: StrategyEfficacy[];
  distortionTrends: DistortionTrend[];
  totalEntriesAnalyzed: number;
  overallPositiveRate: number; // % of total entries with mood improvement
  personalizedSummary: string;
}

export interface SyncEntryPayload {
  userId: string;
  entryId: string;
  moodBefore?: number | null;
  moodAfter?: number | null;
  distressTags: string[];
  actionTaken?: string | null;
  distortions?: Array<{
    name: string;
    detectedThought?: string;
  }>;
  strategyUsed?: string | null;
  createdAt?: string | Date;
}
