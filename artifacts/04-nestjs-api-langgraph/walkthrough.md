# Architecture Walkthrough: NestJS AI Worker

We have implemented and verified the modular architecture for the NestJS AI Worker (`apps/api`) and the database layer according to [.agents/skills/app-architecture/SKILL.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/.agents/skills/app-architecture/SKILL.md).

## What Was Built

### 1. Database Layer (`packages/database`)
- **[schema.prisma](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/database/prisma/schema.prisma)**:
  - Added `AiRun` model (`id`, `conversationId`, `triggeringMessageId`, `status`, `error`, `startedAt`, `completedAt`, timestamps) mapped to `ai_run`.
  - Added `aiRuns AiRun[]` relation on `Conversation`.
- **[index.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/database/src/index.ts)**:
  - Exported `AiRun` type from `@prisma/client`.
- Generated fresh Prisma client via `prisma generate`.

### 2. Shared Types (`packages/types`)
- **[conversation.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/types/src/conversation.ts)**:
  - Added `AiRunStatus` (`queued | running | completed | failed | cancelled`).
  - Added `AiRun` interface.
  - Added `AiJobPayload` (`runId`, `conversationId`, `messageId`, `userId`).
  - Added `AiStreamEvent` and `AiStreamEventType` definitions for Redis Streams.

### 3. NestJS AI Worker (`apps/api`)

The worker was structured into clean modular boundaries:

```
apps/api/src/
├── lambda.ts                          # AWS Lambda handler for SQS Event Source Mapping
├── main.ts                            # Local development server + optional SQS poller
├── app.module.ts                      # Root module registering all domains
└── modules/
    ├── database/
    │   ├── database.service.ts        # Prisma client lifecycle wrapper (@rewire/database)
    │   └── database.module.ts         # Global DatabaseModule
    ├── neo4j/
    │   ├── neo4j.service.ts           # Neo4j driver connection and Cypher read/write helpers
    │   └── neo4j.module.ts            # Global Neo4jModule
    ├── redis/
    │   ├── redis-stream.service.ts    # Redis Streams publisher (XADD to ai:run:{runId})
    │   └── redis.module.ts            # Global RedisModule
    ├── conversations/
    │   ├── conversations.service.ts   # Context retrieval, AiRun status transitions, assistant message persistence
    │   └── conversations.module.ts    # ConversationsModule
    ├── agent/
    │   ├── prompts/
    │   │   └── mental-health.prompt.ts# Empathetic system prompt & crisis escalation template
    │   ├── safety/
    │   │   ├── safety.service.ts      # Risk detection & clinical diagnosis prevention
    │   │   └── safety.service.spec.ts # Unit tests for safety rules
    │   ├── rag/
    │   │   └── graph-rag.service.ts   # Cypher query builder for coping strategies & concepts
    │   ├── graph/
    │   │   ├── state.ts               # LangGraph AgentState Annotation channels
    │   │   └── agent.graph.ts         # StateGraph assembly (conditional crisis branching)
    │   ├── nodes/
    │   │   ├── load-context.node.ts   # Loads history from PostgreSQL
    │   │   ├── safety.node.ts         # Assesses crisis & danger
    │   │   ├── rag.node.ts            # Retrieves Neo4j knowledge
    │   │   ├── generate.node.ts       # Mistral AI (ChatMistralAI) streaming tokens to Redis Streams
    │   │   ├── response-safety.node.ts# Sanitizes & validates output
    │   │   └── persist.node.ts        # Saves assistant message to PostgreSQL
    │   ├── dto/
    │   │   └── run-agent.dto.ts       # NestJS DTO for payload validation
    │   ├── agent.controller.ts        # HTTP endpoints:
    │                                  # - POST /agent/run (execute AI run)
    │                                  # - GET /agent/graph/image (visual PNG image)
    │                                  # - GET /agent/graph/mermaid (Mermaid definition)
    │                                  # - GET /agent/graph (interactive HTML visualizer)
    │   ├── agent.service.ts           # Orchestrates LangGraph & visual image extraction
    │   └── agent.module.ts            # AgentModule
    └── queue/
        ├── sqs-consumer.service.ts    # AWS SDK v3 SQS handler + local polling loop
        ├── sqs-consumer.service.spec.ts# Unit tests for SQS consumer
        └── queue.module.ts            # QueueModule
```

---

## Verification Results

### Automated Tests
Ran `pnpm --filter @rewire/api test`:
```
PASS src/modules/agent/safety/safety.service.spec.ts
PASS src/app.controller.spec.ts
PASS src/modules/agent/agent.controller.spec.ts
PASS src/modules/queue/sqs-consumer.service.spec.ts
PASS src/modules/agent/agent.service.spec.ts

Test Suites: 5 passed, 5 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        1.513 s
```

### Monorepo Build
Ran `turbo build` across workspace:
```
• turbo 2.10.12
   • Packages in scope: @rewire/api, @rewire/database, @rewire/types, @rewire/validation, @rewire/web
   • Running build in 5 packages
   ✓ @rewire/web built in 2.6s
   ✓ @rewire/api (nest build) built successfully
 Tasks:    2 successful, 2 total
```

---

## Deployment & Execution Modes

1. **Production (AWS Lambda Scale-to-Zero)**:
   - Function entry point is `dist/lambda.handler`.
   - Triggered by AWS SQS Event Source Mapping (`SQSEvent`).
   - Reuses cached `INestApplicationContext` across warm invocations.
2. **Local Development (HTTP / Poller)**:
   - Run `pnpm --filter @rewire/api dev`.
   - Direct HTTP testing: `POST http://localhost:4000/agent/run` with `{ "runId": "...", "conversationId": "...", "messageId": "...", "userId": "..." }`.
   - Set `ENABLE_LOCAL_SQS_POLLER=true` to long-poll AWS SQS locally.

---

## Frontend Markdown Rendering (`apps/web`)

### What Was Changed
- **Dependencies**: Added `react-markdown` (`^10.1.0`) and `remark-gfm` (`^4.0.1`) to `apps/web`.
- **[markdown-renderer.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/components/mental-health/markdown-renderer.tsx)**: Created dedicated, memoized Markdown component with customized styling:
  - Headers (`h1`, `h2`, `h3`) with clean weights, margins, and borders.
  - Lists (`ul`, `ol`) with teal bullet and number accents.
  - Blockquotes with left teal accent bar and subtle background tint.
  - Tables with clean borders, zebra rows, and headers.
  - Inline code tags and full multi-line code blocks with dark background and monospace font.
  - Links with teal underline and safe external target.
- **[chat-interface.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/components/mental-health/chat-interface.tsx)**:
  - Replaced plain text `<div className="whitespace-pre-wrap">{msg.content}</div>` for assistant messages with `<MarkdownRenderer content={msg.content} />`.
  - Maintained smooth pulsing streaming cursor during token generation.

