# Vercel Pre-Prod & Prod Deployment Walkthrough

We have configured and linked your Turborepo Next.js app (`@rewire/web`) to Vercel and set up automated pre-prod and prod deployment workflows with environment variable management.

---

## 1. Summary of Changes

| Component | File | Description |
|---|---|---|
| **Vercel Config** | [vercel.json](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/vercel.json) | Sets Next.js framework, monorepo build command (`pnpm --filter @rewire/web... build`), and output directory (`apps/web/.next`). |
| **Env Sync Tool** | [scripts/vercel-env-sync.mjs](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/scripts/vercel-env-sync.mjs) | Batch syncs `.env` files directly into Vercel via CLI without manual copy-pasting. |
| **Scripts** | [package.json](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/package.json) | Added `vercel:deploy`, `vercel:deploy:prod`, `vercel:env:push:prod`, `vercel:env:push:preview`, and env pull commands. |
| **Git Ignore** | [.gitignore](file:///Volumes/CobletSSD/ProjectsSourceCode/rewire/.gitignore) | Ensured `.vercel/` metadata is ignored. |

---

## 2. Project Link & Environment Status

- **Vercel Project**: `rewire-web`
- **Owner Scope**: `aadarshbabus-projects`
- **Framework Preset**: Next.js
- **Build Command**: `pnpm --filter @rewire/web... build`
- **Environment Variables**:
  All 7 production & preview variables have been synced to Vercel:
  - `BETTER_AUTH_SECRET`
  - `BETTER_AUTH_URL`
  - `NEXT_PUBLIC_APP_URL`
  - `DATABASE_URL`
  - `AWS_SQS_QUEUE_URL`
  - `AWS_REGION`
  - `REDIS_URL`

---

## 3. How to Deploy

### A. Pre-prod / Preview Deployment
Run from the root of your project:
```bash
pnpm vercel:deploy
```
- Creates a preview deployment on Vercel.
- Uses your **Preview** environment variables.
- Returns a unique preview URL (e.g., `https://rewire-web-xyz.vercel.app`) to test before promoting to production.

### B. Production Deployment
Run from the root of your project:
```bash
pnpm vercel:deploy:prod
```
- Creates a production deployment.
- Uses your **Production** environment variables.
- Automatically assigns to your production domain / URL.

---

## 4. How to Manage Environment Variables

Whenever you update your secrets or `.env` files:

### Push Variables to Vercel
```bash
# Push apps/web/.env.production to Vercel Production
pnpm vercel:env:push:prod

# Push to Vercel Preview (reads apps/web/.env.preview or falls back to .env.production)
pnpm vercel:env:push:preview

# Push any custom env file to any environment
node scripts/vercel-env-sync.mjs --env=production --file=path/to/.env
```

### Inspect Variables on Vercel
```bash
pnpm vercel:env:ls
```

### Pull Variables Down Locally
```bash
# Pull production variables into apps/web/.env.production.local
pnpm vercel:env:pull:prod

# Pull preview variables into apps/web/.env.preview.local
pnpm vercel:env:pull:preview
```

---

## 5. Verification Performed

1. **Dry-Run Test**: Verified `node scripts/vercel-env-sync.mjs --dry-run` successfully parses and masks secrets.
2. **Project Setup**: Created `rewire-web` on Vercel and linked local repository (`.vercel/project.json`).
3. **Environment Push**: Pushed all 7 keys to both `Production` and `Preview`.
4. **Vercel Confirmation**: Verified with `vercel env ls` that all 7 variables are active under `aadarshbabus-projects/rewire-web`.
