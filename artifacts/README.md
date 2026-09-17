# Rewire Application — Artifacts Archive

This folder contains all artifacts (implementation plans, architecture walkthroughs, task breakdowns, and setup guides) created during the end-to-end development of the **Rewire** mental health application.

---

## 🗂️ Artifacts Directory Structure

```
artifacts/
├── README.md                                # Master index (this file)
├── 01-monorepo-setup/
│   └── monorepo_guide.md                    # Rewire Monorepo Structure & Best Practices Guide
├── 02-trpc-prisma-setup/
│   ├── implementation_plan.md               # Implementation Plan: tRPC v11 + Prisma in Monorepo
│   ├── task.md                              # Detailed task breakdown & checklist
│   └── walkthrough.md                       # Verification & testing walkthrough
├── 03-better-auth-setup/
│   ├── implementation_plan.md               # Implementation Plan: Better Auth integration
│   └── walkthrough.md                       # Walkthrough: Authentication flows & UI
├── 04-nestjs-api-langgraph/
│   ├── implementation_plan.md               # Implementation Plan: NestJS AI Worker & LangGraph
│   └── walkthrough.md                       # Walkthrough: GraphRAG, SQS & Mistral integration
├── 05-frontend-routes-ui/
│   ├── implementation_plan.md               # Implementation Plan: Next.js routes & mental health UI
│   └── walkthrough.md                       # Walkthrough: Chat UI, breathing widget & state
├── 06-mental-reframing-offloading/
│   ├── implementation_plan.md               # Implementation Plan: Brain dumping & reframing nodes
│   └── walkthrough.md                       # Walkthrough: Reframing pipeline & node separation
└── 07-neo4j-graph-dynamic-insights/
    ├── implementation_plan.md               # Implementation Plan: Neo4j seed & cognitive insights
    └── walkthrough.md                       # Walkthrough: Graph schema, Cypher seed & dynamic insights
```

---

## 🚀 Phase Summary & Direct Links

### Phase 1: Monorepo Setup & Architecture Best Practices
- **Focus**: Setting up Turborepo, pnpm workspaces, package boundary rules (`apps/web`, `apps/api`, `packages/database`, `packages/types`, `packages/validation`), build pipelines, and Vercel deployment strategies.
- **Artifact**:
  - [monorepo_guide.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/artifacts/01-monorepo-setup/monorepo_guide.md)

### Phase 2: tRPC v11 + Prisma Database Setup
- **Focus**: Integrating tRPC v11 into Next.js App Router, configuring shared router procedures, setting up `@rewire/database` with Prisma Client, resolving TypeScript types across monorepo packages.
- **Artifacts**:
  - [implementation_plan.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/artifacts/02-trpc-prisma-setup/implementation_plan.md)
  - [task.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/artifacts/02-trpc-prisma-setup/task.md)
  - [walkthrough.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/artifacts/02-trpc-prisma-setup/walkthrough.md)

### Phase 3: Better Auth Authentication Mechanism & UI
- **Focus**: Better Auth server and client setup with Prisma adapter, session cookie management, credentials (email/password), sign-in/sign-up cards, and protected route handlers.
- **Artifacts**:
  - [implementation_plan.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/artifacts/03-better-auth-setup/implementation_plan.md)
  - [walkthrough.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/artifacts/03-better-auth-setup/walkthrough.md)

### Phase 4: NestJS AI Worker Architecture & LangGraph
- **Focus**: Architecting the backend AI service with NestJS, LangGraph workflow execution, Mistral AI LLM integration, GraphRAG orchestration, and database persistence.
- **Artifacts**:
  - [implementation_plan.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/artifacts/04-nestjs-api-langgraph/implementation_plan.md)
  - [walkthrough.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/artifacts/04-nestjs-api-langgraph/walkthrough.md)

### Phase 5: Next.js Frontend Routes & Mental Health UI
- **Focus**: Designing the primary Next.js pages and mental health conversation UI, including the chat interface, markdown streaming, interactive breathing widget, and responsive layout.
- **Artifacts**:
  - [implementation_plan.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/artifacts/05-frontend-routes-ui/implementation_plan.md)
  - [walkthrough.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/artifacts/05-frontend-routes-ui/walkthrough.md)

### Phase 6: Mental Reframing & Offloading (Brain Dumping)
- **Focus**: Building the Agentic Mental Reframing and Evolution Worker, implementing structured LangGraph nodes (`load-context`, `analyze`, `reframe`, `persist`), prompt separation, and Canvas offloading.
- **Artifacts**:
  - [implementation_plan.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/artifacts/06-mental-reframing-offloading/implementation_plan.md)
  - [walkthrough.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/artifacts/06-mental-reframing-offloading/walkthrough.md)

### Phase 7: Neo4j Graph Database Seed Data & Dynamic Cognitive Insights
- **Focus**: Designing the Neo4j cognitive knowledge graph schema (Distortions, Triggers, Coping Strategies, Themes), executing Cypher seeding scripts, and generating dynamic user insights from chat history.
- **Artifacts**:
  - [implementation_plan.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/artifacts/07-neo4j-graph-dynamic-insights/implementation_plan.md)
  - [walkthrough.md](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/artifacts/07-neo4j-graph-dynamic-insights/walkthrough.md)
