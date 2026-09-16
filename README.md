# Rewire

A full-stack, end-to-end type-safe TypeScript monorepo built with **Turborepo**, **pnpm**, **Next.js**, **NestJS**, **tRPC**, **Better Auth**, and **Prisma**.

---

## System Architecture at a Glance

Rewire is an intelligent mental health platform architected as an **event-driven, decoupled monorepo**. It strictly isolates user-facing web interactions from computationally intensive, safety-governed AI workflows.

> 📖 **Full Architecture Specification**: For comprehensive sequence diagrams, LangGraph state machine topologies, and Architectural Decision Records (ADRs), read [**`ARCHITECTURE.md`**](ARCHITECTURE.md).

```
                      ┌──────────────────────────────┐
                      │    User Browser / Client     │
                      └──────────────┬───────────────┘
                                     │ HTTP / SSE
                                     ▼
                      ┌──────────────────────────────┐
                      │  Next.js 16 BFF (apps/web)   │
                      │  Auth, tRPC, UI & SSE Stream │
                      └──────┬────────────────▲──────┘
         1. Enqueue Job Payload│                │ 4. Read Stream Events
                             ▼                │
                      ┌──────────────┐ ┌──────┴──────────────┐
                      │   AWS SQS    │ │    Redis Streams     │
                      │  (Job Queue) │ │   (ai:run:{runId})   │
                      └──────┬───────┘ └──────▲──────────────┘
         2. SQS Trigger Event│                │ 3. Publish Tokens/Deltas
                             ▼                │
                      ┌───────────────────────┴──────┐
                      │ NestJS AI Worker (apps/api)  │
                      │ Scale-to-Zero on AWS Lambda  │
                      │  LangGraph + Neo4j GraphRAG  │
                      └──────────────┬───────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────────┐
                      │ PostgreSQL (Prisma ORM)      │
                      │ Single Source of Truth       │
                      └──────────────────────────────┘
```

### Architectural Principles

1. **Asynchronous Decoupling**: Next.js never runs LLMs directly or blocks API threads. Messages are saved to PostgreSQL with an `AiRun` (`queued`), and a lightweight job payload is dispatched to AWS SQS, instantly returning a `runId` to the client.
2. **Scale-to-Zero Worker Economics**: The NestJS AI Worker runs as an AWS Lambda function triggered by SQS events. It boots on demand, executes the LangGraph workflow, flushes events, and scales to zero when idle.
3. **Resilient Ephemeral Streaming**: Token generation streams into dedicated Redis Streams (`ai:run:{runId}`). The Next.js SSE gateway proxies events to the browser. If a network blip occurs, the client seamlessly reconnects using `Last-Event-ID` without re-running inference.
4. **Safety-First Cognitive Graphs**: Dedicated LangGraph state machines enforce pre- and post-generation safety assessments, routing crises to human helpline resources while enriching standard interactions with Neo4j GraphRAG.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Monorepo Tools** | [Turborepo](https://turbo.build/), [pnpm](https://pnpm.io/) |
| **Frontend & BFF** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) |
| **AI Worker Engine** | [NestJS 11](https://nestjs.com/) on [AWS Lambda](https://aws.amazon.com/lambda/) (Scale-to-zero) |
| **AI Orchestration** | [LangGraph](https://langchain-ai.github.io/langgraphjs/), [LangChain](https://js.langchain.com/), [LangSmith](https://smith.langchain.com/) |
| **Knowledge Base** | [Neo4j](https://neo4j.com/) (GraphRAG for therapeutic & cognitive domains) |
| **Queue & Streaming** | [AWS SQS](https://aws.amazon.com/sqs/) (Job ingestion), [Redis Streams](https://redis.io/) (Real-time token delivery) |
| **Type-Safe RPC** | [tRPC v11](https://trpc.io/), [@tanstack/react-query v5](https://tanstack.com/query) |
| **Authentication** | [Better Auth](https://www.better-auth.com/) (Sessions, Credentials, RBAC) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/) (SQLite local dev support) |
| **Validation & Types** | [Zod](https://zod.dev/), [TypeScript](https://www.typescriptlang.org/) |

---

## Applications & Packages

### Apps

- **[`@rewire/web`](apps/web)**:
  - Next.js 16 application featuring Server & Client Components.
  - Better Auth integration with full session handling, sign-up/sign-in flows, and user profile management.
  - Client and server-side tRPC callers with TanStack Query for data fetching and caching.
  - Styled with Tailwind CSS v4.

- **[`@rewire/api`](apps/api)**:
  - NestJS 11 backend service providing high-performance server logic, modular architecture, and extensible REST/microservice controllers.

### Packages

- **[`@rewire/database`](packages/database)**:
  - Prisma schema managing models: `User`, `Session`, `Account`, `Verification`, `Conversation`, and `ConversationMessage`.
  - Singleton database client configuration supporting both SQLite (local dev) and PostgreSQL (production).
  - Database management scripts (`db:generate`, `db:push`, `db:migrate`, `db:studio`).

- **[`@rewire/types`](packages/types)**:
  - Shared domain interfaces such as `User`, `Conversation`, and `ConversationMessage`.

- **[`@rewire/validation`](packages/validation)**:
  - Centralized Zod schemas (e.g. `SendMessageSchema`) shared across client and server to guarantee input validation parity.

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: `v20.x` or higher
- **pnpm**: `v10.x` (or `corepack enable pnpm`)

### 1. Clone & Install Dependencies

```bash
git clone <repo-url>
cd rewire
pnpm install
```

### 2. Configure Environment Variables

#### Web Application (`apps/web/.env.local`)

Create `apps/web/.env.local` (or copy from `.env.example` if available):

```env
BETTER_AUTH_SECRET="your-secure-random-secret"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="file:../../packages/database/prisma/dev.db"
```

> **Note:** Generate a secure secret for `BETTER_AUTH_SECRET` using `openssl rand -base64 32`.

#### Database Package (`packages/database/.env`)

Configure the connection string in `packages/database/.env`:

```env
# For local SQLite development:
DATABASE_URL="file:./dev.db"

# Or for PostgreSQL:
# DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

### 3. Initialize the Database

Generate the Prisma Client and push the schema to your database:

```bash
# Generate Prisma Client
pnpm --filter @rewire/database db:generate

# Sync schema with local database
pnpm --filter @rewire/database db:push
```

### 4. Start the Development Servers

Run all services in watch mode with a single command via Turborepo:

```bash
pnpm dev
```

This starts:
- **Web app**: [http://localhost:3000](http://localhost:3000)
- **API service**: [http://localhost:4000](http://localhost:4000)

---

## Monorepo Scripts

The following commands are available from the repository root:

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts all applications in development mode simultaneously. |
| `pnpm build` | Builds all packages and applications in dependency order. |
| `pnpm lint` | Runs ESLint across all projects in the workspace. |
| `pnpm typecheck` | Validates TypeScript types across the entire repository. |
| `pnpm test` | Runs unit tests across packages and apps. |

### Targeted Workspace Commands

You can filter commands to specific packages using `--filter`:

```bash
# Run web application only
pnpm --filter @rewire/web dev

# Run NestJS API only
pnpm --filter @rewire/api dev

# Open Prisma Studio to inspect data
pnpm --filter @rewire/database db:studio

# Create a new Prisma migration
pnpm --filter @rewire/database db:migrate
```

---

## Database Management

Prisma scripts located in `packages/database`:

| Script | Action |
| :--- | :--- |
| `pnpm --filter @rewire/database db:generate` | Regenerates `@prisma/client` after schema edits. |
| `pnpm --filter @rewire/database db:push` | Directly syncs schema state to database without migrations. |
| `pnpm --filter @rewire/database db:migrate` | Runs dev migrations (`prisma migrate dev`). |
| `pnpm --filter @rewire/database db:studio` | Launches web-based Prisma Studio UI to view and edit data. |

---

## Project Conventions

- **Shared Dependencies**: Dependencies used across apps are extracted into `packages/`.
- **Validation First**: User input schemas must be defined in `packages/validation` using Zod and shared between tRPC routers and frontend forms.
- **Type Imports**: Import database models and Prisma types from `@rewire/database` or `@rewire/types`, keeping the direct Prisma client isolated.
- **Code Quality**: Prettier and ESLint are pre-configured; format before committing using `pnpm lint`.
