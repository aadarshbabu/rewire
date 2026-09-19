# Walkthrough: Neo4j Seed Data & Dynamic Cognitive Insights

We implemented the clinical CBT domain knowledge graph seed data for Neo4j and built the dynamic user insights engine, uncovering recurrent distress triggers and ranking effective cognitive reframing strategies based on measurable mood elevation.

---

## What Was Implemented

### 1. Docker Compose Neo4j Service
- Added `neo4j:5-community` to [`docker/compose.yml`](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/docker/compose.yml):
  - HTTP UI: `http://localhost:7474`
  - Bolt Protocol: `bolt://localhost:7687`
  - Authentication: `neo4j / password`
  - Persistent volume: `neo4j-data`

### 2. Clinical CBT Knowledge Graph (Seed Data)
- Defined comprehensive clinical psychology data in [`neo4j-seed.data.ts`](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/neo4j/seed/neo4j-seed.data.ts):
  - **10 Cognitive Distortions (`Concept`)**: Catastrophizing, All-or-Nothing Thinking, Mind Reading, Emotional Reasoning, Should Statements, Imposter Syndrome, Overgeneralization, Personalization, Mental Filtering, Fortune Telling.
  - **12 Evidence-Based Reframing Strategies (`Strategy`)**: Circle of Control Delineation, Decatastrophizing Matrix, Fact vs Feeling Audit, Shades of Grey Spectrum, Compassionate Friend Perspective, Two-Minute Behavioral Micro-Action, Evidence-Testing Audit, Cognitive Defusion, Somatic Box Breathing, Values-Based Action Step, Worst/Best/Most Likely Analysis, Preferential Reframing.
  - **8 Common Stressors (`TriggerCategory`)**: Work & Deadlines, Interpersonal Conflict, Perfectionism & Self-Doubt, Social Evaluation, Overcommitment & Burnout, Financial Uncertainty, Health & Physical Anxiety, Future Uncertainty.
  - **10 Emotional States (`Emotion`)**: Anxiety, Overwhelm, Dread, Frustration, Shame, Helplessness, Relief, Clarity, Agency.
  - **Multi-Hop Relational Links**: `[:HAS_STRATEGY]`, `[:TRIGGERED_BY]`, `[:EVOKES]`, `[:COUNTERACTS]`.
- Implemented [`Neo4jSeedService`](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/neo4j/seed/neo4j-seed.service.ts):
  - Runs idempotent Cypher `MERGE` queries.
  - Automatically seeds Neo4j on startup if 0 concepts exist.
  - Provides a CLI script: `pnpm --filter @rewire/api seed:neo4j` ([`run-seed.ts`](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/neo4j/seed/run-seed.ts)).

### 3. Dynamic User Insights Engine (Personal Cognitive Graph)
- Created [`UserInsightsService`](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/services/user-insights.service.ts):
  - **`syncEntryToGraph`**: Links user journal entries, triggers (`[:HAS_TRIGGER]`), identified distortions (`[:EXHIBITS_DISTORTION]`), and applied reframes (`[:APPLIED_STRATEGY]`) with before/after mood deltas.
  - **`getUserInsights`**: Traverses the personal graph to compute:
    - **Recurrent Triggers**: Ranked by occurrences, initial distress level, and average mood relief.
    - **Strategy Efficacy**: Ranked by average positive mood lift (`moodAfter - moodBefore`) and % success rate.
    - **Distortion Trends**: Unmasks which cognitive traps recur most frequently with which triggers.
    - **Personalized Digest**: Synthesizes an executive natural-language cognitive summary.
  - **`syncAllUserEntries`**: Backfills all prior PostgreSQL journal records into Neo4j in batch.
- Exposed endpoints in [`AgentController`](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/agent.controller.ts):
  - `GET /agent/insights/:userId`
  - `POST /agent/insights/sync-entry`
  - `POST /agent/insights/sync-all/:userId`
  - `POST /agent/neo4j/seed`

### 4. Next.js Web App Integration & UI
- Added [`insightsRouter`](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/routers/insights.ts) and registered in [`_app.ts`](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/routers/_app.ts).
- Integrated background sync into [`journalRouter.updateAfter`](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/routers/journal.ts) so saving a reframed thought automatically syncs the outcome to the personal cognitive graph.
- Created [`DynamicInsights`](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/components/mental-health/dynamic-insights.tsx):
  - Executive summary card with gradient styling.
  - High-level metric tiles: Entries Ingested, Overall Relief Rate %, Top Trigger, Best Reframe.
  - Strategy Efficacy Leaderboard with visual progress bars and tags handled.
  - Recurrent Distress Triggers with severity indicators.
  - Cognitive Distortion Habit Patterns matrix.
  - "Sync Past Entries" action button for backfilling.
- Added **"Cognitive Insights"** tab in [`app/offload/page.tsx`](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/offload/page.tsx).

---

## Verification Results

### 1. Automated Tests (`@rewire/api`)
Ran `pnpm --filter @rewire/api test`:
- **6 / 6 Test Suites Passed**
- **26 / 26 Tests Passed**:
  - `user-insights.service.spec.ts` (3 tests verifying entry sync, graph traversal calculations, and error resilience)
  - `agent.controller.spec.ts` (9 tests verifying all endpoints including `getInsights`, `syncEntry`, `syncAllEntries`, and `seedKnowledge`)
  - `agent.service.spec.ts`, `sqs-consumer.service.spec.ts`, `safety.service.spec.ts`, `app.controller.spec.ts`

### 2. TypeScript Validation (`@rewire/web`)
Ran `pnpm --filter @rewire/web exec tsc --noEmit`:
- **0 Type Errors**. Clean type safety across tRPC caller, TanStack query hooks, and shared domain types.
