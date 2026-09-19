# Agentic Graph-Based Mental Reframing & User Evolution

## Overview
Based on user feedback and [app-architecture/SKILL.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/.agents/skills/app-architecture/SKILL.md), LLM and cognitive reframing logic is moved out of the Next.js frontend into the **`apps/api` NestJS AI worker**. 

Instead of an isolated one-shot LLM call, we implement a **LangGraph agentic workflow** that leverages holistic context from PostgreSQL (user history, past journal entries, mood trends, conversations) and Neo4j GraphRAG (mental health concepts and coping strategies) to evaluate the user's mental health journey, detect recurring thought patterns, and generate deeply personalized cognitive restructuring.

---

## The Architecture & Agentic Workflow

```
[apps/web (Next.js BFF)]
        │
        │ POST /agent/reframe { userId, rawContent, moodBefore, distressTags }
        ▼
[apps/api (NestJS Agent)]
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│              LangGraph: Mental Reframing Agent                  │
│                                                                 │
│  1. [loadUserHistoryNode]                                       │
│     ├── Fetches user profile & name from PostgreSQL             │
│     ├── Loads past journal entries, previous dumps & reframes   │
│     ├── Analyzes distress trends (moodBefore → moodAfter)       │
│     └── Reads recent conversation topics & emotional loops       │
│                                                                 │
│  2. [neo4jKnowledgeNode]                                        │
│     └── GraphRAG query to Neo4j for coping strategies tailored   │
│         to detected themes and user distress patterns           │
│                                                                 │
│  3. [evolutionAnalysisNode]                                     │
│     ├── Detects recurring cognitive traps across sessions       │
│     └── Identifies user growth (what worked previously)         │
│                                                                 │
│  4. [cognitiveRestructuringNode] (LangChain / ChatMistralAI)    │
│     ├── Synthesizes holistic context + raw brain dump           │
│     └── Generates structured CBT output:                        │
│         • Personal Evolution Note (tracking their journey)      │
│         • Circle of Control (Agency vs. Surrender)              │
│         • Cognitive Distortions Unmasked                        │
│         • Compassionate Personalized Reframe                    │
│         • 2-Minute Micro-Action & Grounding Affirmation         │
│                                                                 │
│  5. [persistEvolutionNode]                                      │
│     └── Persists evolution metadata to PostgreSQL journal_entry │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼ Return ReframingAnalysis JSON
[apps/web UI: ReframingCard with Evolution & Journey Insights]
```

---

## User Review Required

> [!IMPORTANT]
> **API Separation of Concerns**: All LLM provider keys (`MISTRAL_API_KEY`) and LangGraph orchestration reside strictly in `apps/api`. Next.js communicates with `apps/api` through its configured URL (`AI_WORKER_URL` or `http://localhost:4000`), keeping credentials secure and separating the BFF from the AI engine.

> [!TIP]
> **Graceful Offline Fallback**: If the NestJS worker is unreachable during offline local development, `apps/web` retains a lightweight clinical heuristic fallback so the UI never crashes for the end user.

---

## Proposed Changes

### Component 1: NestJS AI Worker (`apps/api`)

#### [NEW] [apps/api/src/modules/agent/dto/reframe-agent.dto.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/dto/reframe-agent.dto.ts)
- DTO validating `{ userId?: string, rawContent: string, moodBefore?: number, distressTags?: string[] }`.

#### [NEW] [apps/api/src/modules/agent/graph/reframing-state.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/graph/reframing-state.ts)
- State definition for the reframing LangGraph:
  - `userId`, `rawContent`, `moodBefore`, `distressTags`
  - `userHistory`: past journal entries, previous reframes, conversation snippets
  - `retrievedKnowledge`: Neo4j coping strategies
  - `evolutionInsights`: recurring patterns, growth notes
  - `result`: `ReframingAnalysis`
  - `error`: string | null

#### [NEW] [apps/api/src/modules/agent/nodes/reframing-history.node.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/nodes/reframing-history.node.ts)
- Queries PostgreSQL via `DatabaseService` to gather past brain dumps, previous reframes, and conversation context for the specific user.

#### [NEW] [apps/api/src/modules/agent/nodes/reframing-knowledge.node.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/nodes/reframing-knowledge.node.ts)
- Queries Neo4j GraphRAG for relevant coping concepts and strategies matching the user's specific distress themes.

#### [NEW] [apps/api/src/modules/agent/nodes/reframing-generate.node.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/nodes/reframing-generate.node.ts)
- Uses LangChain (`ChatMistralAI`) with a comprehensive clinical prompt that integrates user history, evolution, and Neo4j knowledge into a structured, compassionate CBT reframing output.

#### [NEW] [apps/api/src/modules/agent/graph/reframing.graph.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/graph/reframing.graph.ts)
- Compiles the LangGraph workflow with `loadHistory` -> `loadKnowledge` -> `generateReframing`.

#### [MODIFY] [apps/api/src/modules/agent/agent.service.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/agent.service.ts)
- Initialize the compiled reframing graph.
- Add `reframeThought(dto: ReframeAgentDto): Promise<ReframingAnalysis>`.

#### [MODIFY] [apps/api/src/modules/agent/agent.controller.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/agent.controller.ts)
- Expose `POST /agent/reframe` endpoint.

---

### Component 2: Shared Types (`packages/types`)

#### [MODIFY] [packages/types/src/journal.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/types/src/journal.ts)
- Add `evolutionNote?: string;` and `recurringPatterns?: string[];` to `ReframingAnalysis` interface.

---

### Component 3: Next.js Web App (`apps/web`)

#### [MODIFY] [apps/web/lib/reframing-service.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/lib/reframing-service.ts)
- Update `reframeBrainDump(rawContent, moodBefore, userId, distressTags)` to call the NestJS API worker endpoint `POST ${process.env.AI_WORKER_URL || "http://localhost:4000"}/agent/reframe`.
- Keep fallback heuristic only for network failure/unreachable worker.

#### [MODIFY] [apps/web/trpc/routers/journal.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/routers/journal.ts)
- Forward `ctx.user?.id` to `reframeBrainDump`.

#### [MODIFY] [apps/web/components/mental-health/reframing-card.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/components/mental-health/reframing-card.tsx)
- Add an **"Emotional Journey & Evolution"** section in the UI displaying the agent's personalized trajectory insight (e.g. noticing recurring patterns and celebrating previous coping successes).

---

## Verification Plan

### Automated Verification
1. Build shared packages:
   ```bash
   pnpm --filter @rewire/types build
   ```
2. Build and test NestJS AI Worker:
   ```bash
   pnpm --filter @rewire/api build
   pnpm --filter @rewire/api test
   ```
3. Build Next.js Web App:
   ```bash
   pnpm --filter web build
   ```

### Manual Verification
1. Send a brain dump from a user who has prior entries or conversations.
2. Verify in logs that `apps/api` executes the LangGraph workflow, queries the user's past journal entries and Neo4j knowledge, and compiles the holistic prompt.
3. Verify on the frontend that the reframed card displays the personalized **Evolution Note** connecting to their past history.
