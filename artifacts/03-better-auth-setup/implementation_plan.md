# Better Auth Implementation Plan

We will implement authentication across the application using **Better Auth**, integrating with the existing Next.js App Router, Prisma ORM (SQLite), and tRPC stack. We will also build modern, responsive UI pages and components for user sign-in, sign-up, and session handling.

## User Review Required

> [!NOTE]
> The database currently uses SQLite via Prisma (`packages/database`). We will extend the Prisma schema with Better Auth models (`User`, `Session`, `Account`, `Verification`) and regenerate the Prisma client without breaking existing `Conversation` relations.

## Proposed Changes

### 1. Database & ORM (`packages/database`)

#### [MODIFY] [packages/database/package.json](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/database/package.json)
- Add `better-auth` dependency if needed for schema exports, or manage dependencies cleanly.

#### [MODIFY] [packages/database/prisma/schema.prisma](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/database/prisma/schema.prisma)
- Update `User` model with Better Auth required fields (`emailVerified`, `image`, `sessions`, `accounts`).
- Add `Session`, `Account`, and `Verification` models.
- Run `prisma db push` / `prisma generate` to update the local database schema and Prisma Client.

#### [MODIFY] [packages/database/src/index.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/packages/database/src/index.ts)
- Re-export new Prisma model types (`Session`, `Account`, `Verification`).

---

### 2. Next.js Web App Auth Setup (`apps/web`)

#### [MODIFY] [apps/web/package.json](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/package.json)
- Install `better-auth` in `apps/web`.
- Install `lucide-react` for UI icons (eye toggle, user avatar, loaders, etc.) if needed or use sleek SVG icons.

#### [NEW] [apps/web/.env.local](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/.env.local)
- Configure `BETTER_AUTH_SECRET` (generated cryptographically secure 32+ char token).
- Configure `BETTER_AUTH_URL=http://localhost:3000`.
- Configure `DATABASE_URL="file:../../packages/database/prisma/dev.db"` (or link to the SQLite DB path).

#### [NEW] [apps/web/lib/auth.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/lib/auth.ts)
- Initialize Better Auth instance with `prismaAdapter(db, { provider: "sqlite" })`.
- Enable `emailAndPassword: { enabled: true }`.
- Export `auth` instance and helper types.

#### [NEW] [apps/web/lib/auth-client.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/lib/auth-client.ts)
- Initialize Better Auth client with `createAuthClient` from `better-auth/react`.
- Export `signIn`, `signUp`, `signOut`, `useSession`, `getSession`.

#### [NEW] [apps/web/app/api/auth/[...all]/route.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/api/auth/[...all]/route.ts)
- Mount the Better Auth Next.js route handler (`toNextJsHandler(auth.handler)`).

---

### 3. tRPC Integration (`apps/web/trpc`)

#### [MODIFY] [apps/web/trpc/init.ts](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/trpc/init.ts)
- Update `createTRPCContext` to extract the session from request headers using `auth.api.getSession({ headers: opts.headers })`.
- Add `protectedProcedure` that ensures the user is authenticated and attaches `ctx.session` / `ctx.user`.

---

### 4. Authentication UI & Pages (`apps/web`)

#### [NEW] [apps/web/components/auth/sign-in-card.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/components/auth/sign-in-card.tsx)
- Modern, clean Card UI for Email & Password Sign In.
- Error alerts, loading spinners, show/hide password toggle, and link to sign up.

#### [NEW] [apps/web/components/auth/sign-up-card.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/components/auth/sign-up-card.tsx)
- Modern Card UI for Account Creation (Name, Email, Password, Password Confirmation).
- Client-side validation, error handling, loading states, and link to sign in.

#### [NEW] [apps/web/components/auth/user-button.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/components/auth/user-button.tsx)
- User profile dropdown / avatar button showing logged in user info with Sign Out option.

#### [NEW] [apps/web/app/(auth)/sign-in/page.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/%28auth%29/sign-in/page.tsx)
- Sign In page route.

#### [NEW] [apps/web/app/(auth)/sign-up/page.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/%28auth%29/sign-up/page.tsx)
- Sign Up page route.

#### [MODIFY] [apps/web/app/page.tsx](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/apps/web/app/page.tsx)
- Update landing page with dynamic auth state:
  - If signed out: Show Welcome header + "Sign In" and "Create Account" buttons.
  - If signed in: Show Welcome back banner with user's name & email, session details, quick actions, and Sign Out button.

---

## Verification Plan

### Automated / Build Verification
- Run `pnpm run build` or `pnpm --filter @rewire/web build` / `turbo build` to ensure all TypeScript types, Prisma schemas, and Next.js routes compile without errors.
- Run `pnpm --filter @rewire/database db:push` and `pnpm --filter @rewire/database db:generate`.

### Manual & Interactive Verification
- Start development server (`pnpm dev`).
- Navigate to `/api/auth/ok` to confirm Better Auth endpoint responds `{ status: "ok" }`.
- Test Sign Up flow at `/sign-up`: Create a new user with name, email, password.
- Test Sign In flow at `/sign-in`: Authenticate with the newly created user credentials.
- Verify session persistence and user state on the home page `/`.
- Test Sign Out flow to confirm session termination.
