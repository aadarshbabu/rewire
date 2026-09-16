import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Neo4jService } from '../neo4j.service';
import {
  SEED_CONCEPTS,
  SEED_STRATEGIES,
  SEED_TRIGGERS,
  SEED_EMOTIONS,
} from './neo4j-seed.data';

@Injectable()
export class Neo4jSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(Neo4jSeedService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async onApplicationBootstrap() {
    // Only attempt auto-seed if Neo4j driver is active
    if (!this.neo4jService.getDriver()) {
      this.logger.warn('Neo4j driver is not active. Skipping automatic seed check.');
      return;
    }

    try {
      const existing = await this.neo4jService.read<{ count: number }>(
        'MATCH (c:Concept) RETURN count(c) AS count',
      );

      const count = existing?.[0]?.count ? Number(existing[0].count) : 0;
      if (count === 0) {
        this.logger.log('Neo4j knowledge graph is empty. Initiating automatic seed...');
        await this.seedDatabase();
      } else {
        this.logger.log(`Neo4j knowledge graph already contains ${count} concepts.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Could not verify or auto-seed Neo4j knowledge graph: ${msg}`);
    }
  }

  /**
   * Idempotent seed function populating Concepts, Strategies, Triggers, and Emotions.
   */
  async seedDatabase(): Promise<{
    conceptsSeeded: number;
    strategiesSeeded: number;
    triggersSeeded: number;
    emotionsSeeded: number;
  }> {
    this.logger.log('Beginning idempotent Neo4j mental health knowledge seeding...');

    // 1. Seed Emotions
    for (const em of SEED_EMOTIONS) {
      await this.neo4jService.write(
        `MERGE (e:Emotion {name: $name})
         SET e.valence = $valence`,
        { name: em.name, valence: em.valence },
      );
    }

    // 2. Seed Triggers
    for (const tr of SEED_TRIGGERS) {
      await this.neo4jService.write(
        `MERGE (t:TriggerCategory {name: $name})
         SET t.description = $description`,
        { name: tr.name, description: tr.description },
      );
    }

    // 3. Seed Strategies
    for (const st of SEED_STRATEGIES) {
      await this.neo4jService.write(
        `MERGE (s:Strategy {name: $name})
         SET s.category = $category,
             s.description = $description,
             s.promptGuidance = $promptGuidance`,
        {
          name: st.name,
          category: st.category,
          description: st.description,
          promptGuidance: st.promptGuidance,
        },
      );

      // Connect Strategy -> Emotion [:COUNTERACTS]
      for (const emotionName of st.counteractsEmotions) {
        await this.neo4jService.write(
          `MATCH (s:Strategy {name: $strategyName})
           MATCH (e:Emotion {name: $emotionName})
           MERGE (s)-[:COUNTERACTS]->(e)`,
          { strategyName: st.name, emotionName },
        );
      }
    }

    // 4. Seed Concepts (Distortions) & Relationships
    for (const cp of SEED_CONCEPTS) {
      await this.neo4jService.write(
        `MERGE (c:Concept {name: $name})
         SET c.category = $category,
             c.description = $description,
             c.commonThoughts = $commonThoughts`,
        {
          name: cp.name,
          category: cp.category,
          description: cp.description,
          commonThoughts: cp.commonThoughts,
        },
      );

      // Connect Concept -> Strategy [:HAS_STRATEGY]
      for (const stratName of cp.strategies) {
        await this.neo4jService.write(
          `MATCH (c:Concept {name: $conceptName})
           MATCH (s:Strategy {name: $stratName})
           MERGE (c)-[:HAS_STRATEGY]->(s)`,
          { conceptName: cp.name, stratName },
        );
      }

      // Connect Concept -> TriggerCategory [:TRIGGERED_BY]
      for (const trigName of cp.triggers) {
        await this.neo4jService.write(
          `MATCH (c:Concept {name: $conceptName})
           MATCH (t:TriggerCategory {name: $trigName})
           MERGE (c)-[:TRIGGERED_BY]->(t)`,
          { conceptName: cp.name, trigName },
        );
      }

      // Connect Concept -> Emotion [:EVOKES]
      for (const emoName of cp.emotions) {
        await this.neo4jService.write(
          `MATCH (c:Concept {name: $conceptName})
           MATCH (e:Emotion {name: $emoName})
           MERGE (c)-[:EVOKES]->(e)`,
          { conceptName: cp.name, emoName },
        );
      }
    }

    this.logger.log(
      `Successfully seeded Neo4j: ${SEED_CONCEPTS.length} concepts, ${SEED_STRATEGIES.length} strategies, ${SEED_TRIGGERS.length} triggers, ${SEED_EMOTIONS.length} emotions.`,
    );

    return {
      conceptsSeeded: SEED_CONCEPTS.length,
      strategiesSeeded: SEED_STRATEGIES.length,
      triggersSeeded: SEED_TRIGGERS.length,
      emotionsSeeded: SEED_EMOTIONS.length,
    };
  }
}
