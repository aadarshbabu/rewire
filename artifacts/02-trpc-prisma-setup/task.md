# tRPC + Prisma Setup Tasks

## 1. Shared Database Package (`packages/database`)
- [x] Create `packages/database/package.json`
- [x] Create `packages/database/prisma/schema.prisma`
- [x] Create `packages/database/src/client.ts`
- [x] Create `packages/database/src/index.ts`
- [x] Generate Prisma client & push schema

## 2. tRPC Server Init (`apps/web/trpc/`)
- [x] Create `trpc/init.ts`
- [x] Create `trpc/routers/_app.ts`
- [x] Create `trpc/routers/user.ts`
- [x] Create `trpc/routers/conversation.ts`

## 3. tRPC Client Plumbing (`apps/web/trpc/`)
- [x] Create `trpc/query-client.ts`
- [x] Create `trpc/client.tsx`
- [x] Create `trpc/server.tsx`

## 4. Next.js API Route Handler
- [x] Create `app/api/trpc/[trpc]/route.ts`

## 5. Layout & Config Updates
- [x] Modify `app/layout.tsx` — wrap with TRPCReactProvider
- [x] Modify `next.config.ts` — add `@rewire/database` to transpilePackages
- [x] Install dependencies in `apps/web`

## 6. Verification
- [x] `pnpm install` at root
- [x] Prisma generate & db push
- [x] Type-check passes (zero errors)
- [x] Dev server starts
- [x] tRPC endpoint responds correctly
