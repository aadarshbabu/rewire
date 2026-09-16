import { createTRPCRouter, baseProcedure } from "../init";
import { fetchUserInsights, syncAllUserEntriesToGraph } from "@/lib/insights-service";

export const insightsRouter = createTRPCRouter({
  /**
   * Fetch dynamic cognitive insights for the authenticated user.
   */
  getDynamicInsights: baseProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      return {
        topTriggers: [],
        effectiveStrategies: [],
        distortionTrends: [],
        totalEntriesAnalyzed: 0,
        overallPositiveRate: 0,
        personalizedSummary: "Sign in to view your personal cognitive insights and recurring distress patterns.",
      };
    }

    return await fetchUserInsights(userId);
  }),

  /**
   * Backfill / sync all existing journal entries for the current user into Neo4j.
   */
  syncAllEntries: baseProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new Error("Unauthorized");
    }

    return await syncAllUserEntriesToGraph(userId);
  }),
});
