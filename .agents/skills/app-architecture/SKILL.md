---
name: app-architecture
description: >-
  Provides guidelines, folder structures, and architectural patterns for the
  rewire application (NestJS backend, Turborepo packages, and Next.js frontend).
  Use this skill when designing new modules, refactoring layers, or scaffolding features.
---

# App Requirement (Purpose)
- ** Main purpose of my application is provide a full fladeg techinque a patatint which have a struggleing the Overthinking and depression and stress in some case. and the user should be able to create a journal entry and the user should be able to chat with the AI assistant and the AI assistant should be able to provide a personalized response to the user and the user should be able to see a graph of their mood over time and the user should be able to see a list of their journal entries and the user should be able to see a list of their mood over time and the user should be able to see a list of their journal entries and the user should be able to see a list of their mood over time and also provide the technique which overcalm the overthinking and depression and stress.**


# Application Architecture Guidelines

## Architecture Overview
- **Monorepo Structure**: Turborepo with apps in `apps/*` and shared libraries in `packages/*`.
- **Backend**: NestJS modular architecture with Clean Architecture / DDD boundaries.
  - Controllers handle HTTP routing and validation.
  - Services contain business logic.
  - Repositories/Database layer in `packages/database`.

## Module Scaffolding Checklist
1. Create module, controller, and service files under `apps/api/src/<feature>/`.
2. Ensure database models and schemas stay in `packages/database`.
3. Export interfaces and DTOs cleanly for consumption across apps.

## Key Rules & Boundaries
- Never import database drivers directly into controller files.
- Shared domain logic should reside in shared packages.

Build a production-ready MVP for a mental-health conversational AI application using a pnpm + Turborepo monorepo.

## Core architecture

Use this architecture:

Browser
↓
Next.js
↓
AWS SQS (AWS SDK v3)
↓
NestJS AI Worker (AWS Lambda)
↓
LangGraph
↓
LLM / Neo4j GraphRAG / Safety
↓
PostgreSQL

For realtime AI response streaming:

NestJS AI Worker (AWS Lambda)
↓
Redis Stream
↓
Next.js SSE endpoint
↓
Browser

The AI Worker is deployed as an AWS Lambda function triggered by SQS events, completely independent from the Next.js application.

## Monorepo structure

Create:

rewire/
├── apps/
│   ├── web/                  # Next.js application
│   └── api/            # NestJS AI Worker
│
├── packages/
│   ├── types/                # Shared TypeScript types
│   ├── validation/           # Shared Zod schemas
│   └── config/               # Shared configuration
│   └── database/             # PostgreSQL client
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── pnpm-lock.yaml
└── README.md

Use:

* pnpm workspaces
* Turborepo
* TypeScript
* Next.js App Router
* NestJS
* PostgreSQL
* Redis (Redis Streams for token & event streaming)
* AWS SQS (AWS SDK v3) for event-driven job queue
* AWS Lambda for scale-to-zero serverless worker execution
* Neo4j for GraphRAG knowledge base
* LangGraph for the AI workflow
* Zod for shared validation

## Next.js responsibilities

Next.js is the Backend-for-Frontend.

It should handle:

* Authentication
* Session management
* Authorization
* User-facing UI
* Conversation APIs
* Message APIs
* Creating AI jobs
* Reading conversation state
* SSE streaming endpoint
* Basic request validation

Do NOT put LangGraph, LLM API keys, RAG implementation, or AI business logic inside Next.js.

The browser must never receive LLM provider API keys.

## AI Worker responsibilities

The NestJS AI Worker is responsible for all AI execution.

Structure it approximately as:

apps/api/src/modules
├── agent/
│   ├── graph/
│   ├── nodes/
│   ├── prompts/
│   ├── tools/
│   ├── memory/
│   ├── rag/
│   └── safety/
├── queue/
├── conversations/
├── database/
└── main.ts

The worker should:

1. Receive an AI job from the queue.
2. Load the required conversation and user information from PostgreSQL.
3. Run the LangGraph workflow.
4. Perform safety/risk assessment as a separate workflow concern.
5. Retrieve relevant context when required.
6. Call the LLM.
7. Stream AI events/tokens to Redis Streams.
8. Persist the final assistant response to PostgreSQL.
9. Mark the AI run as completed or failed.

The worker should be stateless and disposable. Do not depend on in-memory state for conversation persistence.

## Queue architecture

When the user sends a message:

Browser
↓
Next.js
↓
Save user message to PostgreSQL
↓
Create AI run
↓
Add AI job to queue
↓
Return runId immediately

The queue payload should contain identifiers rather than the entire conversation:

{
runId,
conversationId,
messageId,
userId
}

The AI Worker retrieves the actual required data from PostgreSQL.

Do not put large conversation histories or sensitive unnecessary data into queue messages.

## AI run state

Create an AI run concept with states:

* queued
* running
* completed
* failed
* cancelled

The database is the source of truth for the AI run state.

The worker should update the run status:

queued → running → completed

or:

queued → running → failed

## Streaming architecture

Do NOT use the queue for streaming.

The queue is only for job delivery.

Use Redis Streams for realtime AI events.

Each AI run should have its own stream:

ai:run:{runId}

The worker publishes events such as:

{
type: "run.started"
}

{
type: "node.started",
node: "safety"
}

{
type: "message.delta",
content: "I understand..."
}

{
type: "node.completed",
node: "retrieval"
}

{
type: "run.completed",
messageId: "..."
}

The Next.js SSE endpoint subscribes/reads the Redis stream and forwards events to the browser.

Example endpoint:

GET /api/ai/runs/:runId/stream

The SSE connection should exist only while an individual AI response is being generated.

Do NOT maintain an SSE connection for the entire lifetime of a conversation.

The user can keep a conversation open for hours without maintaining a permanent AI streaming connection.

## Reconnection

Streaming must be recoverable.

Use Redis Streams rather than ephemeral Redis Pub/Sub so that events can be replayed when possible.

The frontend should use the runId and event ID/stream position to recover from temporary connection failures.

If the browser disconnects while the AI worker is running, the worker must continue processing.

The final result must always be persisted to PostgreSQL.

When the user reconnects, Next.js should retrieve the authoritative conversation state from PostgreSQL.

## PostgreSQL

Use PostgreSQL as the primary persistent database.

At minimum create concepts/tables for:

users
conversations
messages
ai_runs

A conversation contains many messages.

A message should contain:

* id
* conversationId
* role
* content
* createdAt

Roles:

* user
* assistant
* system

An AI run should contain:

* id
* conversationId
* triggeringMessageId
* status
* startedAt
* completedAt
* error information where appropriate

Use UUIDs.

Use migrations.

Do not store transient streaming tokens individually in PostgreSQL.

Stream tokens through Redis and persist the final assistant message once the generation is complete.

## LangGraph

The initial LangGraph workflow should have a clear structure:

START
↓
Load conversation context
↓
Safety assessment
↓
Context / memory retrieval
↓
Relevant knowledge retrieval
↓
LLM response generation
↓
Response safety validation
↓
Persist final response
↓
END

Keep each responsibility in a separate node where practical.

Do not build an unnecessarily complex agent initially.

The architecture should allow additional nodes/tools to be added later.

## Mental-health safety

This is a mental-health application.

Do not design the system as a replacement for a licensed psychologist or emergency service.

Keep safety/risk detection separate from ordinary conversational generation.

The architecture should allow the system to detect potentially high-risk situations and apply a dedicated safety response/escalation policy rather than blindly allowing the normal conversational agent to respond.

Do not hard-code medical diagnoses.

The AI should not claim that it has diagnosed the user.

## Security

Implement:

* Authentication
* Authorization
* Input validation
* Rate limiting
* Secure session handling
* Server-side secrets only
* PostgreSQL parameterized queries/ORM
* Redis authentication
* Strict CORS policy where applicable

Never expose:

* LLM API keys
* Database credentials
* Redis credentials
* internal worker credentials

to the browser.

Treat conversation data as sensitive.

## Cost-conscious MVP architecture

The system must be designed so that the AI Worker can scale to zero.

The AI Worker should not be designed as a permanently running API server.

The desired lifecycle is:

No AI jobs
↓
0 AI workers

New job arrives in AWS SQS
↓
AWS Lambda invokes NestJS AI Worker
↓
Process SQS record / job
↓
Persist result
↓
Lambda shuts down when idle (Scale to Zero)

The infrastructure supports event-driven worker execution and scale-to-zero via AWS SQS + AWS Lambda.

Do not introduce a permanently running NestJS API server just for normal application APIs.

Next.js acts as the application backend/BFF.

## Important separation

Next.js:

* UI
* Auth
* API/BFF
* Conversation management
* AWS SQS job producer (AWS SDK v3)
* SSE endpoint (subscribing to Redis Stream)

NestJS Worker (AWS Lambda):

* AWS SQS event consumer (AWS SDK v3)
* LangGraph workflow orchestration
* LLM generation
* Neo4j GraphRAG retrieval
* Memory
* AI safety processing & risk detection
* Redis Streams event publishing (`ai:run:{runId}`)
* AI result persistence (PostgreSQL)

PostgreSQL:

* Durable application state
* Users
* Conversations
* Messages
* AI runs

Neo4j:

* Mental health concepts & domain knowledge graph
* User-specific relationship and context graph for GraphRAG

Redis:

* Temporary realtime AI event streams (`ai:run:{runId}`)
* Streaming coordination for Next.js SSE endpoint

## Development commands

The root workspace should support:

pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm typecheck

Turborepo should orchestrate all applications and packages.

## Development priority

Do not implement the complete AI system immediately.

Build incrementally:

Phase 1:

* Monorepo
* Next.js
* NestJS Worker
* PostgreSQL
* Redis
* Queue
* Shared packages

Phase 2:

* Authentication
* Users
* Conversations
* Messages
* AI run model

Phase 3:

* Queue → NestJS Worker
* Basic LangGraph workflow
* LLM integration

Phase 4:

* Redis Streams
* Next.js SSE
* Token streaming

Phase 5:

* Memory
* RAG
* Safety workflow
* Production hardening

Every component should have clear interfaces and be replaceable without tightly coupling Next.js to the AI implementation.

Prefer simple, maintainable architecture over premature abstraction.


