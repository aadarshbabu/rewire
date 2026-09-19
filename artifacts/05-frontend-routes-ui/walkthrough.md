# Next.js Route Architecture Walkthrough

Based on the [app-architecture skill](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/.agents/skills/app-architecture/SKILL.md) and your feedback, we have implemented the Next.js routes, AWS SQS job producer, and Redis Streams Server-Sent Events (SSE) streaming endpoint.

## What Was Implemented

### 1. Redis Client Singleton
- **File**: [redis.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/lib/redis.ts)
- Configured singleton `ioredis` client supporting connection reuse across Next.js invocations, with resilient error handling.

### 2. AWS SQS Queue Producer
- **File**: [queue.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/lib/queue.ts)
- Implemented `enqueueAiJob(payload: AiJobPayload)` using `@aws-sdk/client-sqs` (AWS SDK v3).
- Strictly follows the lightweight identifier payload rule:
  ```json
  {
    "runId": "...",
    "conversationId": "...",
    "messageId": "...",
    "userId": "..."
  }
  ```
- Handles local development gracefully when AWS credentials/queue URL are not yet provisioned.

### 3. Dedicated Per-Run SSE Streaming Endpoint
- **File**: [route.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/api/ai/runs/[runId]/stream/route.ts)
- **Endpoint**: `GET /api/ai/runs/:runId/stream`
- **Behavior**:
  - Authenticates request and verifies user owns the conversation associated with the `runId`.
  - Opens a dedicated connection when the user sends a message.
  - Subscribes to Redis Stream `ai:run:{runId}` using `XREAD BLOCK`.
  - Supports recoverable streaming via `Last-Event-ID` header or `?lastEventId=` query parameter (defaults to `0-0` to replay any missed events).
  - Forwards `AiStreamEvent` objects as SSE events (`event: <type>\ndata: <json>`).
  - **Self-terminating**: Closes automatically upon terminal events (`run.completed` / `run.failed`), client abort, or timeout, without keeping an indefinite ping connection open.

### 4. Message & AI Job Trigger Endpoint
- **File**: [route.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/api/conversations/[id]/messages/route.ts)
- **Endpoints**:
  - `POST /api/conversations/:id/messages`:
    1. Authenticates user and validates conversation ownership.
    2. Validates input body using `@rewire/validation`.
    3. Persists user message in PostgreSQL (`ConversationMessage`).
    4. Creates `AiRun` in PostgreSQL with status `"queued"`.
    5. Dispatches job to AWS SQS via `enqueueAiJob`.
    6. Returns `{ message, runId, conversationId }` immediately to the client.
  - `GET /api/conversations/:id/messages`: Returns chronological message history.

### 5. Conversation BFF Endpoints
- **Files**:
  - [route.ts (Conversations List & Create)](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/api/conversations/route.ts): `GET` (list), `POST` (create)
  - [route.ts (Conversation Detail & Delete)](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/api/conversations/[id]/route.ts): `GET` (details with messages and recent runs), `DELETE` (delete conversation)

### 6. Synchronized tRPC Conversation Router
- **File**: [conversation.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/routers/conversation.ts)
- Updated `sendMessage` mutation in tRPC to mirror the same flow: saves message, creates `AiRun` in `"queued"` status, and dispatches to AWS SQS, returning `{ ...message, runId }`.

---

## Verification Results


### 7. Mental Health Conversational UI & Components
- **Flagship Mental Health Hub**: [page.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/page.tsx)
  - Serene and trauma-informed design with soothing teal/emerald/cyan tones.
  - Interactive **Emotional Barometer** (Anxious & Racing, Overwhelmed, Down, Seeking Calm, Hopeful).
  - Built-in live **Box Breathing Calm** widget.
  - Prominent **24/7 Crisis Support Resources** banner (988 Lifeline, 741741 Crisis Text Line).
  - Clear clinical disclaimer ensuring users know Rewire is an empathetic AI companion, not medical diagnosis or emergency care.
- **Dedicated Chat Application**: [page.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/chat/page.tsx)
  - Full-featured conversational workspace at `/chat`.
- **Conversational Mental Health Interface**: [chat-interface.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/components/mental-health/chat-interface.tsx)
  - Conversation session sidebar: list, select, create, and delete reflection sessions.
  - Per-message real-time SSE streaming connection connected directly to `GET /api/ai/runs/:runId/stream`.
  - Displays live workflow node progression (`Validating emotional safety...` -> `Drawing coping insights...` -> `Crafting compassionate response...`).
  - Warm mental health conversation starter prompts (Grounding, Cognitive Reframing, Venting, Sleep & Wind-Down).
- **Interactive Box Breathing Tool**: [breathing-widget.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/components/mental-health/breathing-widget.tsx)
  - 4-4-4-4 nervous system regulation tool with smooth expanding visual rings and phase timers.
- **Immediate Crisis Resources Modal**: [crisis-modal.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/components/mental-health/crisis-modal.tsx)
  - 1-click modal containing immediate direct dials for US & Canada 988, Crisis Text Line, UK Samaritans/NHS 111, and international directories.

---

## Verification Results

### Build & Typecheck
- Executed `pnpm --filter @rewire/web build`:
  ```
  ✓ Compiled successfully in 10.4s
  Finished TypeScript in 21.2s ...
  Route (app)
  ┌ ○ /
  ├ ○ /_not-found
  ├ ƒ /api/ai/runs/[runId]/stream
  ├ ƒ /api/auth/[...all]
  ├ ƒ /api/conversations
  ├ ƒ /api/conversations/[id]
  ├ ƒ /api/conversations/[id]/messages
  ├ ƒ /api/trpc/[trpc]
  ├ ○ /chat
  ├ ○ /sign-in
  └ ○ /sign-up
  ```
- All pages, routes, and serverless handlers compiled cleanly with zero errors.

