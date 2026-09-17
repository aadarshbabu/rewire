# Neo4j Seed Data & Dynamic Cognitive Insights Implementation Plan

This plan introduces clinical knowledge graph seed data to Neo4j and implements dynamic user insights to help users identify their recurrent distress triggers and the most effective cognitive reframing strategies.

---

## User Review Required

> [!IMPORTANT]
> **Neo4j Container & Local Setup**:
> - We will add a `neo4j:5-community` container to [`docker/compose.yml`](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/docker/compose.yml) with credentials `neo4j / password` on ports `7687` (Bolt) and `7474` (HTTP browser).
> - Seeding is completely idempotent (uses Cypher `MERGE`), so it can safely run multiple times without duplicating nodes.
> - An automatic check will seed Neo4j on startup if the database is currently empty, alongside a dedicated CLI command `pnpm --filter @rewire/api seed:neo4j`.

---

## Architecture & Data Model

### 1. Domain Knowledge Graph (Seed Data)
The static evidence-based clinical ontology contains:
- **`Concept` (Cognitive Distortions)**: e.g. *Catastrophizing*, *All-or-Nothing Thinking*, *Mind Reading*, *Emotional Reasoning*, *Should Statements*, *Imposter Syndrome*, *Overgeneralization*, *Personalization*, *Mental Filtering*, *Fortune Telling*.
- **`Strategy` (CBT Reframing Techniques)**: e.g. *Circle of Control*, *Decatastrophizing Matrix*, *Evidence-Testing Audit*, *Shades of Grey Spectrum*, *Fact vs Feeling Separation*, *Compassionate Friend Perspective*, *Behavioral Micro-Action*, *Box Breathing Grounding*.
- **`TriggerCategory`**: e.g. *Work & Deadlines*, *Interpersonal Conflict*, *Health & Body Anxiety*, *Financial Uncertainty*, *Self-Criticism & Perfectionism*, *Social Evaluation*.
- **`Emotion`**: e.g. *Anxiety*, *Overwhelm*, *Dread*, *Frustration*, *Shame*, *Helplessness*.
- **Relationships**:
  - `(:Concept)-[:HAS_STRATEGY]->(:Strategy)`
  - `(:Concept)-[:TRIGGERED_BY]->(:TriggerCategory)`
  - `(:Concept)-[:EVOKES]->(:Emotion)`
  - `(:Strategy)-[:COUNTERACTS]->(:Emotion)`

### 2. Personal Cognitive Graph (Dynamic Insights)
As users complete brain dumps, tag distress, reframe thoughts, and log their before/after moods, their personal experiences are synced into Neo4j:
- Nodes: `(:User {id})`, `(:JournalEntry {id, moodBefore, moodAfter, deltaMood, actionTaken, createdAt})`
- Relationships:
  - `(:User)-[:LOGGED_ENTRY]->(:JournalEntry)`
  - `(:JournalEntry)-[:HAS_TRIGGER]->(:Trigger {name})`
  - `(:JournalEntry)-[:EXHIBITS_DISTORTION]->(:Concept {name})`
  - `(:JournalEntry)-[:APPLIED_STRATEGY {moodImprovement}]->(:Strategy {name})`
- Traversal Analytics:
  - **Recurrent Triggers**: Triggers ranked by frequency and average initial distress level.
  - **Strategy Efficacy**: Reframing strategies ranked by average positive mood delta (`moodAfter - moodBefore`) and % success rate for particular triggers.
  - **Distortion Trends**: Which distortions most frequently accompany specific triggers.

---

## Proposed Changes

### Docker & Infrastructure

#### [MODIFY] [compose.yml](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/docker/compose.yml)
- Add `neo4j:5-community` service with environment `NEO4J_AUTH=neo4j/password`, volume `neo4j-data`, and exposed ports `7474:7474`, `7687:7687`.

---

### Shared Packages

#### [NEW] [insights.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/types/src/insights.ts)
- Define TypeScript types for dynamic insights:
  - `TriggerInsight`: `{ name: string; count: number; avgMoodBefore: number; avgMoodDelta: number }`
  - `StrategyEfficacy`: `{ strategy: string; timesApplied: number; avgMoodImprovement: number; successRate: number; triggersHandled: string[] }`
  - `DistortionTrend`: `{ distortion: string; occurrences: number; associatedTriggers: string[] }`
  - `UserDynamicInsights`: Overall summary, top triggers, strategy rankings, distortion breakdown, total reframes, and personalized recommendations.

#### [MODIFY] [index.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/types/src/index.ts)
- Re-export `insights.ts`.

---

### NestJS Backend (`apps/api`)

#### [NEW] [neo4j-seed.data.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/neo4j/neo4j-seed.data.ts)
- Structured dataset of 10+ clinical distortions, 12 evidence-based strategies, trigger categories, emotions, and cross-links.

#### [NEW] [neo4j-seed.service.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/neo4j/neo4j-seed.service.ts)
- Idempotent `seedDatabase()` method using Cypher `MERGE`.
- Automatic check on startup: if `MATCH (c:Concept) RETURN count(c)` is 0, auto-seed the knowledge graph.

#### [NEW] [user-insights.service.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/services/user-insights.service.ts)
- `syncEntryToGraph(entryData)`: Syncs journal entries, distress tags, distortions, and reframing strategy outcomes into Neo4j.
- `getUserInsights(userId)`: Cypher queries calculating recurrent triggers, strategy efficacy, distortion patterns, and delta mood improvements.
- `syncAllUserEntries(userId)`: Ingests all past Prisma `JournalEntry` records into Neo4j.

#### [MODIFY] [agent.controller.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/agent.controller.ts)
- Add endpoints:
  - `GET /agent/insights/:userId`: Fetch user's dynamic insights.
  - `POST /agent/insights/sync-entry`: Sync a journal entry + reframing outcome to the graph.
  - `POST /agent/insights/sync-all/:userId`: Backfill all past entries for a user.
  - `POST /agent/neo4j/seed`: Trigger knowledge graph seeding.

#### [MODIFY] [package.json](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/package.json)
- Add `"seed:neo4j"` npm script.

---

### Next.js Web Application (`apps/web`)

#### [NEW] [insights.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/routers/insights.ts)
- tRPC router with procedures:
  - `getDynamicInsights`: Queries the API for graph-derived insights.
  - `syncAllEntries`: Triggers backfill of historical entries.

#### [MODIFY] [trpc/routers/_app.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/routers/_app.ts)
- Register `insights` router in tRPC root router.

#### [MODIFY] [trpc/routers/journal.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/routers/journal.ts)
- In `updateAfter`, notify the API `syncEntryToGraph` so saving/reframing immediately updates the user's personal cognitive graph.

#### [NEW] [dynamic-insights.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/components/mental-health/dynamic-insights.tsx)
- Premium mental wellness insights dashboard:
  - **Trigger Frequency & Distress Meter**: Visualizing recurrent distress sources.
  - **Strategy Efficacy Leaderboard**: Visual progress bars showing which reframing technique yields the highest positive mood lift.
  - **Cognitive Distortion Matrix**: Interactive pills showing distortion patterns and trigger associations.
  - **One-Click Sync**: Button to sync prior journal entries to Neo4j if graph is newly connected.

#### [MODIFY] [app/offload/page.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/offload/page.tsx)
- Add `"insights"` tab alongside `"dump"` and `"history"`, letting users toggle into their personal cognitive insights view.

---

## Verification Plan

### Automated Tests
- Run `@rewire/api` unit tests: `pnpm --filter @rewire/api test`
- Add unit test in `apps/api/src/modules/agent/services/user-insights.service.spec.ts` verifying:
  - Cypher query formatting for recurrent triggers and strategy efficacy.
  - Calculation of delta mood improvements and success rates.
  - Graceful degradation when Neo4j is offline or empty.

### Manual Verification
1. **Neo4j Container & Seeding**:
   - Start Neo4j via docker compose or run `pnpm --filter @rewire/api seed:neo4j`.
   - Verify nodes and relationships created via `MATCH (c:Concept) RETURN count(c)` and `MATCH ()-[r:HAS_STRATEGY]->() RETURN count(r)`.
2. **Dynamic Insights Flow**:
   - Complete a Brain Dump with a distress tag (e.g. "Work & Deadlines"), mood before: 3.
   - Reframe thoughts (unmasking "Catastrophizing", applying "Circle of Control").
   - Save reframed entry with mood after: 7 (+4 delta).
   - Navigate to the **Cognitive Insights** tab on `/offload`.
   - Verify that "Work & Deadlines" appears under Recurrent Triggers, "Circle of Control" is ranked with +4 avg mood lift and 100% efficacy, and "Catastrophizing" is registered in the distortion breakdown.
