# Walkthrough: Agentic Mental Reframing & Evolution Worker

We have refactored the cognitive reframing system to execute via a dedicated **LangGraph Agentic Workflow inside the NestJS worker (`apps/api`)**, utilizing PostgreSQL user history and Neo4j GraphRAG for personalized mental health journey evolution.

---

## 1. Architectural Highlights

```
[apps/web (Next.js BFF)]
        │
        │ POST /agent/reframe { userId, rawContent, moodBefore, distressTags }
        ▼
[apps/api (NestJS Agent Controller)]
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│               Reframing LangGraph Workflow                      │
│                                                                 │
│  1. [loadHistory] (reframing-history.node.ts)                   │
│     ├── Fetches user profile & name from PostgreSQL             │
│     ├── Loads past journal entries, previous dumps & reframes   │
│     ├── Tracks relief trajectory (moodBefore → moodAfter)       │
│     └── Reads recent conversation topics & emotional loops       │
│                                                                 │
│  2. [loadKnowledge] (reframing-knowledge.node.ts)               │
│     └── GraphRAG query to Neo4j for coping strategies tailored   │
│         to detected themes and user distress patterns           │
│                                                                 │
│  3. [generate] (reframing-generate.node.ts)                     │
│     ├── Synthesizes holistic context + raw brain dump           │
│     ├── LangChain ChatMistralAI (or clinical heuristic fallback)│
│     └── Outputs CBT Reframing with Personal Evolution Note      │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼ Return ReframingAnalysis JSON
[apps/web UI: ReframingCard with Emotional Journey & Trajectory]
```

### 🧠 Holistic Context & Personal Evolution
- Rather than a stateless prompt, the agent now knows the user's name, previous brain dumps, what coping strategies relieved them in past sessions, and recurring distress patterns.
- Generates a tailored **"Your Emotional Journey & Trajectory"** note on the frontend card to celebrate user growth and recognize recurring loops.

### 🛡️ Clean Separation of Concerns
- No direct LLM API calls or AI keys in `apps/web`.
- `apps/web` calls `POST /agent/reframe` on `apps/api`.
- Graceful offline fallback remains active in `apps/web` if the worker is unreachable during offline local development.

---

## 2. Changes Made

### `apps/api` (NestJS Worker)
- **[user-journey.service.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/services/user-journey.service.ts)**: Dedicated domain service cleanly separating database access (`getUserHolisticHistory`, `updateEntryEvolution`) from orchestration logic. Encapsulates Prisma queries, mood progression calculations, and error handling.
- **`nodes/chat/` (Conversational AI Route `@Post('run')`)**:
  - `load-context.node.ts`: Retrieves message context & chat history.
  - `safety.node.ts`: Assesses crisis risks on input.
  - `rag.node.ts`: Queries Neo4j knowledge context.
  - `generate.node.ts`: Streams tokens via Mistral AI.
  - `response-safety.node.ts`: Sanitizes clinical diagnostic assertions.
  - `persist.node.ts`: Persists messages & emits completion events.
  - `index.ts`: Unified export barrel for chat nodes.
- **`nodes/reframe/` (Cognitive Reframing Route `@Post('reframe')`)**:
  - `history.node.ts`: Pure graph node delegating user journey history retrieval to `UserJourneyService`.
  - `knowledge.node.ts`: Neo4j GraphRAG query node retrieving matching coping strategies.
  - `generate.node.ts`: Clean, 75-line orchestrator that imports prompts from `prompts/reframing.prompt` and fallback logic from `reframing-heuristic.ts`.
  - `reframing-heuristic.ts`: Encapsulates offline clinical CBT heuristic engine and distortion patterns.
  - `index.ts`: Unified export barrel for reframe nodes.
- **`prompts/`**:
  - `mental-health.prompt.ts`: Prompts for conversational AI and crisis safety.
  - `reframing.prompt.ts`: Dedicated prompt template and `buildReframingPrompt(...)` builder for cognitive restructuring.
  - `index.ts`: Barrel export for all prompt definitions.
- **[nodes/index.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/nodes/index.ts)**: Root barrel exporting `./chat` and `./reframe`.
- **[agent.graph.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/graph/agent.graph.ts)**: Compiles `buildAgentGraph` using `import from '../nodes/chat'`.
- **[reframing.graph.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/graph/reframing.graph.ts)**: Compiles `buildReframingGraph` using `import from '../nodes/reframe'`.
- **[agent.controller.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/agent.controller.ts)**: Exposes `@Post('reframe')` and `@Post('run')`.
- **[agent.service.spec.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/modules/agent/agent.service.spec.ts)**: Unit tests for both graph workflows.

### `packages/types` & `packages/validation`
- **[journal.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/types/src/journal.ts)**: Added `evolutionNote?: string` and `recurringPatterns?: string[]` to `ReframingAnalysis`.
- **[journalSchema.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/validation/src/journalSchema.ts)**: Updated `ReframeJournalEntrySchema` to accept `distressTags`.

### `apps/web` (Next.js App Router)
- **[reframing-service.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/lib/reframing-service.ts)**: Calls the NestJS AI worker endpoint `POST /agent/reframe` with user context. Retains offline fallback for local dev.
- **[journal.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/routers/journal.ts)**: Forwards `ctx.user?.id` and `distressTags` to the reframing service.
- **[reframing-card.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/components/mental-health/reframing-card.tsx)**: Added the **"Your Emotional Journey & Trajectory"** visual section displaying personal evolution notes and recurring theme chips.

---

## 3. Verification & Test Results

1. **NestJS API Tests**:
   ```bash
   pnpm --filter @rewire/api test
   # Result: 5 test suites passed, 18 tests passed (including agentic reframing workflow test)
   ```
2. **NestJS API Build**:
   ```bash
   pnpm --filter @rewire/api build
   # Result: Successfully compiled
   ```
3. **Next.js Production Build**:
   ```bash
   pnpm --filter web build
   # Result: Turbopack + TypeScript checks passed; all static pages generated cleanly
   ```
