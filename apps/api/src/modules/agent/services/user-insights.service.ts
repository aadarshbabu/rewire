import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from '../../neo4j/neo4j.service';
import { DatabaseService } from '../../database/database.service';
import {
  UserDynamicInsights,
  TriggerInsight,
  StrategyEfficacy,
  DistortionTrend,
  SyncEntryPayload,
} from '@rewire/types';

@Injectable()
export class UserInsightsService {
  private readonly logger = new Logger(UserInsightsService.name);

  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * Syncs a single journal entry and its cognitive reframing outcome into the Neo4j graph.
   */
  async syncEntryToGraph(payload: SyncEntryPayload): Promise<void> {
    const {
      userId,
      entryId,
      moodBefore,
      moodAfter,
      distressTags = [],
      actionTaken,
      distortions = [],
      strategyUsed,
      createdAt = new Date(),
    } = payload;

    const mb = moodBefore ?? null;
    const ma = moodAfter ?? null;
    const deltaMood = mb !== null && ma !== null ? ma - mb : 0;
    const createdDate = new Date(createdAt).toISOString();

    try {
      this.logger.log(`Syncing journal entry ${entryId} to Neo4j for user ${userId}...`);

      // 1. Create or match User and Entry node
      await this.neo4jService.write(
        `MERGE (u:User {id: $userId})
         MERGE (e:JournalEntry {id: $entryId})
         SET e.moodBefore = $mb,
             e.moodAfter = $ma,
             e.deltaMood = $deltaMood,
             e.actionTaken = $actionTaken,
             e.createdAt = $createdDate
         MERGE (u)-[:LOGGED_ENTRY]->(e)`,
        { userId, entryId, mb, ma, deltaMood, actionTaken: actionTaken || 'saved', createdDate },
      );

      // 2. Link Triggers (Distress Tags)
      for (const tag of distressTags) {
        if (!tag || !tag.trim()) continue;
        const normalizedTag = tag.trim();

        await this.neo4jService.write(
          `MATCH (u:User {id: $userId})
           MATCH (e:JournalEntry {id: $entryId})
           MERGE (t:Trigger {name: $tag})
           MERGE (e)-[:HAS_TRIGGER]->(t)
           MERGE (u)-[r:EXPERIENCES_TRIGGER]->(t)
           ON CREATE SET r.count = 1
           ON MATCH SET r.count = r.count + 1`,
          { userId, entryId, tag: normalizedTag },
        );
      }

      // 3. Link Detected Distortions
      for (const dist of distortions) {
        if (!dist.name) continue;
        await this.neo4jService.write(
          `MATCH (e:JournalEntry {id: $entryId})
           MERGE (d:Concept {name: $distName})
           MERGE (e)-[r:EXHIBITS_DISTORTION]->(d)
           SET r.detectedThought = $thought`,
          {
            entryId,
            distName: dist.name,
            thought: dist.detectedThought || '',
          },
        );
      }

      // 4. Link Strategy Applied
      if (strategyUsed && strategyUsed.trim()) {
        await this.neo4jService.write(
          `MATCH (e:JournalEntry {id: $entryId})
           MERGE (s:Strategy {name: $strategyName})
           MERGE (e)-[r:APPLIED_STRATEGY]->(s)
           SET r.moodImprovement = $deltaMood`,
          {
            entryId,
            strategyName: strategyUsed.trim(),
            deltaMood,
          },
        );
      }

      this.logger.log(`Successfully synced entry ${entryId} into Neo4j graph.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Could not sync entry ${entryId} to Neo4j: ${msg}`);
    }
  }

  /**
   * Calculates longitudinal dynamic user insights from Neo4j graph traversals.
   */
  async getUserInsights(userId: string): Promise<UserDynamicInsights> {
    try {
      this.logger.log(`Fetching dynamic graph insights for userId: ${userId}`);

      // 1. Recurrent Triggers
      const triggersResult = await this.neo4jService.read<{
        trigger: string;
        occurrences: number | { low: number };
        avgDistressLevel: number;
        avgMoodDelta: number;
      }>(
        `MATCH (u:User {id: $userId})-[:LOGGED_ENTRY]->(e:JournalEntry)-[:HAS_TRIGGER]->(t:Trigger)
         RETURN t.name AS trigger,
                count(e) AS occurrences,
                round(avg(coalesce(e.moodBefore, 5)), 1) AS avgDistressLevel,
                round(avg(coalesce(e.deltaMood, 0)), 1) AS avgMoodDelta
         ORDER BY occurrences DESC, avgDistressLevel DESC
         LIMIT 6`,
        { userId },
      );

      const topTriggers: TriggerInsight[] = triggersResult.map((r) => ({
        trigger: r.trigger,
        occurrences: typeof r.occurrences === 'object' ? r.occurrences.low : Number(r.occurrences || 0),
        avgDistressLevel: Number(r.avgDistressLevel || 5),
        avgMoodDelta: Number(r.avgMoodDelta || 0),
      }));

      // 2. Strategy Efficacy
      const strategiesResult = await this.neo4jService.read<{
        strategy: string;
        timesApplied: number | { low: number };
        avgMoodImprovement: number;
        successRate: number;
        triggersHandled: string[];
      }>(
        `MATCH (u:User {id: $userId})-[:LOGGED_ENTRY]->(e:JournalEntry)-[rel:APPLIED_STRATEGY]->(s:Strategy)
         OPTIONAL MATCH (e)-[:HAS_TRIGGER]->(t:Trigger)
         WITH s, e, t
         RETURN s.name AS strategy,
                count(e) AS timesApplied,
                round(avg(coalesce(e.deltaMood, 0)), 1) AS avgMoodImprovement,
                round(100.0 * count(CASE WHEN coalesce(e.deltaMood, 0) > 0 THEN 1 END) / count(e), 0) AS successRate,
                collect(DISTINCT t.name) AS triggersHandled
         ORDER BY avgMoodImprovement DESC, timesApplied DESC
         LIMIT 6`,
        { userId },
      );

      const effectiveStrategies: StrategyEfficacy[] = strategiesResult.map((r) => ({
        strategy: r.strategy,
        timesApplied: typeof r.timesApplied === 'object' ? r.timesApplied.low : Number(r.timesApplied || 0),
        avgMoodImprovement: Number(r.avgMoodImprovement || 0),
        successRate: Number(r.successRate || 0),
        triggersHandled: (r.triggersHandled || []).filter(Boolean),
      }));

      // 3. Distortion Trends
      const distortionsResult = await this.neo4jService.read<{
        distortion: string;
        occurrences: number | { low: number };
        associatedTriggers: string[];
      }>(
        `MATCH (u:User {id: $userId})-[:LOGGED_ENTRY]->(e:JournalEntry)-[:EXHIBITS_DISTORTION]->(d:Concept)
         OPTIONAL MATCH (e)-[:HAS_TRIGGER]->(t:Trigger)
         RETURN d.name AS distortion,
                count(e) AS occurrences,
                collect(DISTINCT t.name) AS associatedTriggers
         ORDER BY occurrences DESC
         LIMIT 6`,
        { userId },
      );

      const distortionTrends: DistortionTrend[] = distortionsResult.map((r) => ({
        distortion: r.distortion,
        occurrences: typeof r.occurrences === 'object' ? r.occurrences.low : Number(r.occurrences || 0),
        associatedTriggers: (r.associatedTriggers || []).filter(Boolean),
      }));

      // 4. Totals and Overall Relief Rate
      const statsResult = await this.neo4jService.read<{
        total: number | { low: number };
        positiveRate: number;
      }>(
        `MATCH (u:User {id: $userId})-[:LOGGED_ENTRY]->(e:JournalEntry)
         WITH count(e) AS total,
              count(CASE WHEN coalesce(e.deltaMood, 0) > 0 THEN 1 END) AS positiveCount
         RETURN total,
                CASE WHEN total > 0 THEN round(100.0 * positiveCount / total, 0) ELSE 0 END AS positiveRate`,
        { userId },
      );

      const totalEntriesAnalyzed = statsResult?.[0]?.total
        ? (typeof statsResult[0].total === 'object' ? statsResult[0].total.low : Number(statsResult[0].total))
        : 0;

      const overallPositiveRate = statsResult?.[0]?.positiveRate
        ? Number(statsResult[0].positiveRate)
        : 0;

      // 5. Generate Personalized Summary
      const summary = this.buildPersonalizedSummary(
        topTriggers,
        effectiveStrategies,
        distortionTrends,
        totalEntriesAnalyzed,
      );

      return {
        topTriggers,
        effectiveStrategies,
        distortionTrends,
        totalEntriesAnalyzed,
        overallPositiveRate,
        personalizedSummary: summary,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Could not compute Neo4j user insights for ${userId}: ${msg}`);
      return {
        topTriggers: [],
        effectiveStrategies: [],
        distortionTrends: [],
        totalEntriesAnalyzed: 0,
        overallPositiveRate: 0,
        personalizedSummary: 'No graph data currently available. Continue journaling to reveal your cognitive patterns.',
      };
    }
  }

  /**
   * Backfills / syncs all existing PostgreSQL journal entries for a user into Neo4j.
   */
  async syncAllUserEntries(userId: string): Promise<{ syncedCount: number }> {
    try {
      this.logger.log(`Backfilling all journal entries for user ${userId} into Neo4j...`);

      const entries = await this.databaseService.client.journalEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });

      let count = 0;
      for (const entry of entries) {
        const reframingData = entry.reframingResult as any;
        const distortions = reframingData?.distortions?.map((d: any) => ({
          name: d.name,
          detectedThought: d.detectedThought,
        })) || [];

        const strategyUsed =
          reframingData?.microAction ? 'Two-Minute Behavioral Micro-Action' :
          (reframingData?.circleOfControl ? 'Circle of Control Delineation' : 'Cognitive Restructuring');

        await this.syncEntryToGraph({
          userId,
          entryId: entry.id,
          moodBefore: entry.moodBefore,
          moodAfter: entry.moodAfter,
          distressTags: entry.distressTags || [],
          actionTaken: entry.actionTaken,
          distortions,
          strategyUsed,
          createdAt: entry.createdAt,
        });

        count++;
      }

      this.logger.log(`Successfully backfilled ${count} entries into Neo4j for user ${userId}`);
      return { syncedCount: count };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to backfill user entries: ${msg}`);
      return { syncedCount: 0 };
    }
  }

  private buildPersonalizedSummary(
    triggers: TriggerInsight[],
    strategies: StrategyEfficacy[],
    distortions: DistortionTrend[],
    total: number,
  ): string {
    if (total === 0 || triggers.length === 0) {
      return 'Keep writing brain dumps and recording your post-offload mood to uncover your personal cognitive blueprint.';
    }

    const topTrigger = triggers[0];
    const topStrategy = strategies[0];
    const topDistortion = distortions[0];

    const parts: string[] = [];

    if (topTrigger) {
      parts.push(`Your most frequent recurring distress source is **${topTrigger.trigger}** (${topTrigger.occurrences} sessions).`);
    }

    if (topDistortion) {
      parts.push(`When stressed, your thoughts most often gravitate toward **${topDistortion.distortion}**.`);
    }

    if (topStrategy && topStrategy.avgMoodImprovement > 0) {
      parts.push(
        `**${topStrategy.strategy}** has proven most effective for you, creating an average mood lift of **+${topStrategy.avgMoodImprovement}** with a **${topStrategy.successRate}%** relief rate.`,
      );
    }

    return parts.join(' ');
  }
}
