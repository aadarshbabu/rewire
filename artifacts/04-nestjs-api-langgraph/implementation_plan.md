# NestJS AI Worker Architecture Implementation Plan (AWS Lambda + SQS + Neo4j GraphRAG)

This updated implementation plan incorporates your architectural requirements:
- **Queue**: AWS SQS with AWS SDK v3 (`@aws-sdk/client-sqs`)
- **Compute**: AWS Lambda function (serverless, scale-to-zero, SQS trigger)
- **Knowledge / RAG**: Neo4j graph database (`neo4j-driver`) for GraphRAG
- **Realtime Streaming**: Redis Streams (`ioredis`) published to `ai:run:{runId}` for Next.js SSE consumption
- **Database**: PostgreSQL via Prisma (`@rewire/database`) for durable conversation and run tracking

---

## Architectural Flow

```
User (Browser)
      │
      ▼
Next.js (BFF)
      │
      ├─► Save user message & create AiRun (status: 'queued') in PostgreSQL
      ├─► Send job { runId, conversationId, messageId, userId } to AWS SQS (AWS SDK v3)
      └─► Return runId to Browser
               │
               ▼
      Browser connects to SSE: GET /api/ai/runs/:runId/stream
               ▲
               │ reads stream `ai:run:{runId}`
      Next.js SSE Endpoint

══════════════════════════════════════════════════════════════════
AWS SQS
      │ (triggers Lambda invocation)
      ▼
NestJS AI Worker (AWS Lambda)
      ├── SQSEvent Handler (warms/caches Nest application context)
      ├── DatabaseModule (updates AiRun status -> 'running', loads conversation context)
      ├── LangGraph Workflow:
      │     ├── 1. Context Loader Node (PostgreSQL history)
      │     ├── 2. Safety Assessment Node (crisis/escalation detection)
      │     ├── 3. Neo4j GraphRAG Node (queries Neo4j for relevant graph knowledge & relationships)
      │     ├── 4. LLM Generation Node (streams deltas to Redis Stream `ai:run:{runId}`)
      │     ├── 5. Response Safety Verification Node
      │     └── 6. Result Persistence Node (persists assistant response message to PostgreSQL)
      ├── RedisStreamService (publishes `run.started`, `message.delta`, `run.completed` to Redis)
      └── Updates AiRun status -> 'completed' (or 'failed')
```

---

## User Review Required

> [!IMPORTANT]
> **Dual Mode for Development & Production**:
> - **Production**: AWS Lambda entry point (`src/lambda.ts`) triggered by SQS Event Source Mapping (`SQSEvent`).
> - **Local Development**: Standalone poller mode (`src/main.ts` or `pnpm dev`) that long-polls AWS SQS using `ReceiveMessageCommand` (or LocalStack / AWS SQS) so you can run and debug the worker locally without deploying to AWS every time.

> [!NOTE]
> **Environment Variables Required**:
> - AWS SQS: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SQS_QUEUE_URL`
> - Neo4j: `NEO4J_URI` (e.g. `neo4j+s://...`), `NEO4J_USERNAME`, `NEO4J_PASSWORD`
> - Redis: `REDIS_URL` (for Redis Streams)
> - Database: `DATABASE_URL` (PostgreSQL)

---

## Proposed Changes

### 1. Database Layer (`packages/database`)

#### [MODIFY] [schema.prisma](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/database/prisma/schema.prisma)
- Add `AiRun` model:
  ```prisma
  model AiRun {
    id                  String    @id @default(cuid())
    conversationId      String
    triggeringMessageId String?
    status              String    // "queued" | "running" | "completed" | "failed" | "cancelled"
    error               String?
    startedAt           DateTime?
    completedAt         DateTime?
    createdAt           DateTime  @default(now())
    updatedAt           DateTime  @updatedAt

    conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

    @@index([conversationId])
    @@map("ai_run")
  }
  ```
- Link `aiRuns AiRun[]` in `Conversation`.

#### [MODIFY] [index.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/database/src/index.ts)
- Export `AiRun` type from `@prisma/client`.

---

### 2. Shared Types (`packages/types`)

#### [MODIFY] [conversation.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/types/src/conversation.ts)
- Add types:
  - `AiRunStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'`
  - `AiJobPayload = { runId: string; conversationId: string; messageId: string; userId: string; }`
  - `AiStreamEvent` and event payload definitions (`run.started`, `message.delta`, `node.started`, `node.completed`, `run.completed`, `run.failed`).

---

### 3. NestJS AI Worker (`apps/api`)

#### [MODIFY] [package.json](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/package.json)
- Add dependencies:
  - `@aws-sdk/client-sqs`: AWS SDK v3 for SQS.
  - `neo4j-driver`: Official Neo4j driver for GraphRAG.
  - `ioredis` & `@types/ioredis`: Redis Streams client.
  - `@nestjs/config`: Environment configuration.
  - `@types/aws-lambda`: Type definitions for `SQSEvent`, `SQSRecord`, `Context`.

#### [NEW] `apps/api/src/modules/database/`
- `database.module.ts` & `database.service.ts`: Wraps Prisma client connection lifecycle (`db` from `@rewire/database`).

#### [NEW] `apps/api/src/modules/neo4j/`
- `neo4j.module.ts` & `neo4j.service.ts`:
  - Initializes and manages the `neo4j-driver` Driver instance.
  - Provides session execution helpers (`read`, `write`) with proper lifecycle shutdown.

#### [NEW] `apps/api/src/modules/redis/`
- `redis.module.ts` & `redis-stream.service.ts`:
  - Publishes events using `XADD` to stream key `ai:run:{runId}` with payload and event types.

#### [NEW] `apps/api/src/modules/conversations/`
- `conversations.module.ts` & `conversations.service.ts`:
  - Loads conversation history and user details for context window.
  - Updates `AiRun` status (`running`, `completed`, `failed`).
  - Persists generated assistant message to PostgreSQL.

#### [REFACTOR] `apps/api/src/modules/agent/`
Modular LangGraph agent structure:
```
apps/api/src/modules/agent/
├── graph/
│   ├── agent.graph.ts          # StateGraph connecting nodes
│   └── state.ts                # AgentState interface (messages, retrievedKnowledge, riskAssessment, response)
├── nodes/
│   ├── load-context.node.ts    # Reads conversation history from PostgreSQL
│   ├── safety.node.ts          # Evaluates risk/crisis before generating
│   ├── rag.node.ts             # GraphRAG node querying Neo4j for coping strategies & entity relations
│   ├── generate.node.ts        # LLM generation & streaming tokens via RedisStreamService
│   ├── response-safety.node.ts # Post-generation check (ensures no diagnoses, disclaimer adherence)
│   └── persist.node.ts         # Saves final message to PostgreSQL
├── prompts/
│   └── mental-health.prompt.ts # System prompt with safety boundaries & clinical disclaimers
├── rag/
│   └── graph-rag.service.ts    # Neo4j Cypher queries for mental health concepts & user preferences
├── safety/
│   └── safety.service.ts       # Risk score evaluation & crisis resource recommendations
├── agent.module.ts
└── agent.service.ts            # Orchestrates graph execution for an AiJobPayload
```

#### [NEW] `apps/api/src/modules/queue/`
- `queue.module.ts`
- `sqs-consumer.service.ts`:
  - Uses `@aws-sdk/client-sqs` (v3).
  - Handles parsing of `AiJobPayload` from SQS message body.
  - Delegates job to `AgentService`.
  - For local development: Polling loop using `ReceiveMessageCommand` + `DeleteMessageCommand`.

#### [NEW] [lambda.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/lambda.ts)
- AWS Lambda entry point:
  ```ts
  import { SQSEvent, Context } from 'aws-lambda';
  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  import { SqsConsumerService } from './modules/queue/sqs-consumer.service';

  let cachedApp: INestApplicationContext;

  export const handler = async (event: SQSEvent, context: Context) => {
    if (!cachedApp) {
      cachedApp = await NestFactory.createApplicationContext(AppModule);
    }
    const consumer = cachedApp.get(SqsConsumerService);
    for (const record of event.Records) {
      await consumer.processRecord(record);
    }
  };
  ```

#### [MODIFY] [main.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/api/src/main.ts)
- Allows running locally as standalone poller or hybrid HTTP server for local testing.

---

### 4. Documentation Update (`app-architecture/SKILL.md`)

#### [MODIFY] [.agents/skills/app-architecture/SKILL.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/.agents/skills/app-architecture/SKILL.md)
- Update references to reflect:
  - Queue: AWS SQS (AWS SDK v3)
  - Worker deployment: AWS Lambda function (scale-to-zero)
  - Knowledge/RAG: Neo4j graph database

---

## Verification Plan

### Automated Verification
- Run TypeScript build check: `pnpm --filter @rewire/api build`
- Unit tests:
  - `pnpm --filter @rewire/api test`
  - SQS consumer parsing & dispatch tests.
  - Safety node crisis escalation unit test.
  - Neo4j GraphRAG query builder unit test.
- Prisma schema validation: `pnpm --filter @rewire/database db:generate`

### Manual Verification
- Verify AWS SDK v3 SQS command dispatch and parsing with mock `SQSRecord`.
- Test Neo4j connection handling and Cypher query execution.
- Validate LangGraph node flow (load context -> safety -> Neo4j RAG -> generate -> persist).
