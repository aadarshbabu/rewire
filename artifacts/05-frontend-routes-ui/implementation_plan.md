# Next.js Route Architecture Implementation Plan

This plan implements the Next.js routes, queue producer, and Redis Streams SSE endpoint strictly adhering to the mental-health conversational AI architecture outlined in [SKILL.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/.agents/skills/app-architecture/SKILL.md).

## Architectural Overview

According to the `app-architecture` specification:
- **Next.js acts as the BFF**: Handles Auth (Better Auth), User UI, Conversation & Message APIs, creating AI jobs, and the SSE streaming endpoint.
- **Queue Architecture (Job Producer)**:
  When a user sends a message:
  1. Next.js saves user message to PostgreSQL (`conversationMessage`)
  2. Next.js creates an `AiRun` record in PostgreSQL with status `"queued"`
  3. Next.js enqueues an AI job to AWS SQS via `@aws-sdk/client-sqs` containing `{ runId, conversationId, messageId, userId }`
  4. Next.js returns `{ message, runId }` immediately to the browser
- **Streaming Architecture (Redis Streams SSE)**:
  - Endpoint: `GET /api/ai/runs/:runId/stream`
  - Subscribes and reads Redis Stream `ai:run:{runId}`
  - Streams real-time events (`run.started`, `node.started`, `message.delta`, `node.completed`, `run.completed`, `run.failed`) to the client using Server-Sent Events (SSE)
  - Supports reconnection via `Last-Event-ID` or `?lastEventId=` for recoverable streaming
  - Authenticates and authorizes that the current user owns the conversation for that run
  - Closes cleanly on run completion, failure, or client abort

---

## User Review Required

> [!IMPORTANT]
> - Next.js needs AWS SDK v3 (`@aws-sdk/client-sqs`) and Redis (`ioredis`) added to `apps/web/package.json`.
> - SQS producer will include safe local fallback logging if AWS credentials or queue URL are not configured in local environment, avoiding crashes during development.
> - The Prisma schema uses `cuid()` for IDs (`Conversation.id`, `User.id`, `AiRun.id`), so validation schemas will support CUID/UUID strings.

---

## Proposed Changes

### Web Application Dependencies (`apps/web`)

#### [MODIFY] [package.json](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/package.json)
- Add `@aws-sdk/client-sqs` and `ioredis` to `dependencies`.
- Add `@types/ioredis` to `devDependencies`.

---

### Infrastructure Helpers (`apps/web/lib`)

#### [NEW] [redis.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/lib/redis.ts)
- Create a shared/singleton `ioredis` client configured from environment variables (`REDIS_URL` or `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`).
- Provide helper methods for reading Redis streams (`XREAD` / `XRANGE`) with blocking support.

#### [NEW] [queue.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/lib/queue.ts)
- Initialize `@aws-sdk/client-sqs` `SQSClient`.
- Implement `enqueueAiJob(payload: AiJobPayload)` matching the payload format required by `SqsConsumerService` in `apps/api`:
  ```ts
  {
    runId: string;
    conversationId: string;
    messageId: string;
    userId: string;
  }
  ```
- Gracefully handle local development when AWS SQS queue URL is not configured or in mock/offline mode.

---

### API Route Handlers (`apps/web/app/api`)

#### [NEW] [route.ts (SSE Stream)](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/api/ai/runs/[runId]/stream/route.ts)
- Implements `GET /api/ai/runs/:runId/stream`:
  1. Authenticates request via Better Auth session (`auth.api.getSession`).
  2. Verifies that `runId` exists in PostgreSQL and belongs to the authenticated user.
  3. Reads Redis stream `ai:run:{runId}` starting from `lastEventId` (from `Last-Event-ID` header or URL search param) or `0-0`.
  4. Returns a `text/event-stream` `Response` using `ReadableStream`.
  5. Formats events as SSE (`id: <id>\nevent: <type>\ndata: <json>\n\n`).
  6. Sends periodic ping comments (`: ping\n\n`) to keep connections alive.
  7. Closes stream when `run.completed` or `run.failed` event is reached or client aborts.

#### [NEW] [route.ts (Conversations)](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/api/conversations/route.ts)
- Implements:
  - `GET /api/conversations`: List user's conversations.
  - `POST /api/conversations`: Create new conversation.

#### [NEW] [route.ts (Conversation by ID)](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/api/conversations/[id]/route.ts)
- Implements:
  - `GET /api/conversations/:id`: Retrieve conversation state and historical messages.
  - `DELETE /api/conversations/:id`: Delete conversation.

#### [NEW] [route.ts (Messages & AI Job Creation)](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/api/conversations/[id]/messages/route.ts)
- Implements `POST /api/conversations/:id/messages`:
  1. Authenticates user and checks conversation ownership.
  2. Validates message content.
  3. Saves user message to PostgreSQL (`ConversationMessage`).
  4. Creates `AiRun` in PostgreSQL with status `"queued"`.
  5. Dispatches job to AWS SQS via `enqueueAiJob`.
  6. Returns `{ message, runId, conversationId }`.
- Implements `GET /api/conversations/:id/messages`:
  - Retrieves chronological message list.

---

### Shared Validation & tRPC Sync

#### [MODIFY] [sendMessageSchema.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/validation/src/sendMessageSchema.ts)
- Update validation to accept string IDs (both CUID and UUID) and content/message fields cleanly.

#### [MODIFY] [conversation.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/routers/conversation.ts)
- Update `sendMessage` procedure to also create the `AiRun` and dispatch to AWS SQS, maintaining complete parity between tRPC and REST endpoints.

---

## Verification Plan

### Automated Build & Typecheck
- Run `pnpm --filter @rewire/web build` to verify all routes and types compile without error.
- Run `pnpm typecheck` to verify workspace-wide TypeScript integrity.

### Integration Verification
1. Test route compilation and endpoint structure.
2. Test session verification and authentication protection.
3. Test SQS producer payload shape against `AiJobPayload` expected by `apps/api`.
4. Test SSE stream headers (`text/event-stream`, `Cache-Control: no-cache`) and stream reading loop logic.
