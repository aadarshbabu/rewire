# Walkthrough: tRPC v11 + Prisma Setup

## Summary

Set up end-to-end type-safe APIs using **tRPC v11** with the **Next.js App Router** pattern, backed by **Prisma** (SQLite) for database access. All integrated into the existing turborepo monorepo.

---

## Files Created

### `packages/database/` — Shared Prisma Package

| File | Purpose |
|------|---------|
| [package.json](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/database/package.json) | `@rewire/database` package with `@prisma/client` + `prisma` |
| [prisma/schema.prisma](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/database/prisma/schema.prisma) | Data models: `User`, `Conversation`, `ConversationMessage` |
| [src/client.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/database/src/client.ts) | Singleton Prisma client (prevents connection exhaustion) |
| [src/index.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/database/src/index.ts) | Barrel re-exporting `db` + all Prisma types |
| [.env](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/database/.env) | `DATABASE_URL=file:./dev.db` |

### `apps/web/trpc/` — tRPC Infrastructure

| File | Purpose |
|------|---------|
| [init.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/init.ts) | `initTRPC` with context containing `db` + `headers` |
| [routers/_app.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/routers/_app.ts) | Root router merging sub-routers, exports `AppRouter` type |
| [routers/user.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/routers/user.ts) | `user.list`, `user.byId`, `user.create` |
| [routers/conversation.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/routers/conversation.ts) | `conversation.list`, `conversation.byId`, `conversation.create`, `conversation.sendMessage` |
| [query-client.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/query-client.ts) | `makeQueryClient()` factory with SSR-friendly defaults |
| [client.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/client.tsx) | `TRPCReactProvider` + `useTRPC` hook for client components |
| [server.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/server.tsx) | `serverTRPC` caller for React Server Components |

### `apps/web/app/api/trpc/` — API Route

| File | Purpose |
|------|---------|
| [[trpc]/route.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/api/trpc/%5Btrpc%5D/route.ts) | `fetchRequestHandler` mounting `appRouter` (GET + POST) |

---

## Files Modified

| File | Change |
|------|--------|
| [layout.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/layout.tsx) | Wrapped `{children}` with `<TRPCReactProvider>` |
| [next.config.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/next.config.ts) | Added `@rewire/database` to `transpilePackages` |
| [package.json (web)](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/package.json) | Added `@trpc/*`, `@tanstack/react-query`, `zod`, `@rewire/database`, `client-only`, `server-only` |
| [package.json (root)](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/package.json) | Added `pnpm.onlyBuiltDependencies` for Prisma build scripts |

---

## Verification Results

| Check | Result |
|-------|--------|
| `pnpm install` | ✅ All 6 workspace packages resolved |
| `prisma generate` | ✅ Client generated (v6.19.3) |
| `prisma db push` | ✅ SQLite `dev.db` created and synced |
| `tsc --noEmit` | ✅ Zero errors |
| Dev server (`next dev`) | ✅ Ready in 581ms |
| `GET /api/trpc/user.list` | ✅ Returns `{"result":{"data":[]}}` |
| `POST /api/trpc/user.create` (invalid) | ✅ Returns Zod validation errors (400) |

---

## Usage Examples

### In a Client Component (hooks)

```tsx
"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";

export function UserList() {
  const trpc = useTRPC();
  const { data: users } = useQuery(trpc.user.list.queryOptions());

  const createUser = useMutation(trpc.user.create.mutationOptions());

  return (
    <div>
      {users?.map((u) => <p key={u.id}>{u.name}</p>)}
      <button onClick={() => createUser.mutate({ name: "New", email: "new@test.com" })}>
        Add User
      </button>
    </div>
  );
}
```

### In a Server Component (RSC)

```tsx
import { serverTRPC } from "@/trpc/server";

export default async function UsersPage() {
  const users = await serverTRPC.user.list();

  return (
    <div>
      {users.map((u) => <p key={u.id}>{u.name}</p>)}
    </div>
  );
}
```

### Adding a New Router

1. Create a new file in `trpc/routers/` (e.g. `trpc/routers/post.ts`)
2. Define procedures using `baseProcedure` and `createTRPCRouter`
3. Add it to the root router in `trpc/routers/_app.ts`

> [!NOTE]
> The `@rewire/validation` package uses **Zod 4** while the tRPC routers use **Zod 3** (the version tRPC v11 depends on). These are separate installations and both work correctly. If you want to reuse validation schemas from `@rewire/validation` in tRPC routers, you'll need to either migrate to Zod 3 in the validation package or wait for tRPC to support Zod 4.
