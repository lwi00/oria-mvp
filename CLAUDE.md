# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Project Overview

ORIA is a gamified crypto savings app. Users deposit USDC into Morpho ERC-4626 vaults on **Base** (with Ethereum mainnet support) and earn a streak-boosted APY (4–8%) gated by their weekly running consistency. Hit your km target every week, your streak grows, your boost grows. Miss a week, streak resets to 0.

**APY formula:** `APY(s) = 4 + 4 * min(1, ln(1+s) / ln(11))` where `s` is consecutive weeks with the goal met. Range: 4.00% (`s=0`) → 8.00% (`s>=10`).

This is the hackathon MVP. Backend and frontend are scaffolded and running; auth and on-chain reads/writes are real.

## Repo Layout

Monorepo, pnpm workspaces, Node 20+.

- `backend/` — Fastify 4 API (TypeScript, Prisma 5, Privy server-auth, viem, web-push)
- `frontend/` — Next.js 14 App Router PWA (TypeScript, Privy React SDK, React Query, Tailwind)
- `schema.prisma` — single source for the deployed Postgres schema (intentionally at repo root)
- `nginx/` — production reverse-proxy configs (oriamvp.cloud, oriamvp.fr)
- `documentation/PROJECT_STATE.md` + `documentation/gitbook/` — live reference docs
- `tasks/todo.md`, `tasks/lessons.md` — workflow tracking
- `_archived/` — frozen pre-implementation specs and JSX mockups (provenance only)
- `README.md`, `wiring.md`, `AGENTS.md` — see Cross-refs below

## Backend Modules

Under `backend/src/modules/`:

- `auth/` — Privy JWT verification + user upsert
- `users/` — profile, leaderboard, friends list
- `streaks/` — core: activity logging, APY calculation, weekly evaluation
- `wallet/` — balances + deposit tracking (real Morpho reads via viem; `/api/wallet/balance` is a legacy mock the UI ignores)
- `strava/` — OAuth token exchange + activity sync
- `social/` — feed events, likes, friend requests
- `challenges/` — group goals, membership
- `cron/` — daily reminders + weekly streak evaluation
- `push/` — web-push subscriptions and dispatch

Plugins under `backend/src/plugins/` (auth, cors, prisma). Errors via `backend/src/lib/errors.ts` (`AppError` + subclasses) with a global handler in `app.ts`. Server entry: `backend/src/server.ts` (default port 3001).

## Frontend Layout

Next.js 14 App Router under `frontend/src/app/`:

- `(app)/` — authenticated routes: `dashboard`, `wallet`, `activities`, `streak`, `stats`, `social`, `challenges`, `profile`, `settings`, `apy`, `friend`
- `(onboarding)/` — first-run wizard (Privy login → Strava connect → goals)
- `landing/` — marketing page
- `strava/callback` — OAuth redirect handler
- `api/` — thin proxy routes to the backend
- `docs/[...slug]` — prebuilt markdown viewer

Client data layer: all queries flow through `frontend/src/lib/hooks.ts` (TanStack React Query v5). API client in `frontend/src/lib/api.ts` injects the Privy bearer token; `NEXT_PUBLIC_USE_MOCK=true` falls back to `lib/mock-data.ts`. Styling: Tailwind with custom `oria-*` tokens (dark OLED theme); animations in `globals.css`. PWA manifest + service worker in `public/`.

## What's Real vs Mocked

- **Real:** Privy auth (server + client), Morpho vault reads & writes on Base/Ethereum, Strava OAuth, Postgres via Prisma, web-push notifications, weekly cron job.
- **On-chain writes:** frontend signs raw hex transactions through the Privy embedded wallet's `sendTransaction` — no viem on the client. Backend uses viem for vault APY reads and balance lookups.
- **Mocked:** `/api/wallet/balance` is a legacy stub (UI ignores it); some seed data; mock-mode toggle behind `NEXT_PUBLIC_USE_MOCK`.

## Common Commands

```bash
pnpm install                          # install all workspace deps
pnpm dev                              # run backend + frontend in parallel
pnpm dev:backend                      # backend only (port 3001)
pnpm dev:frontend                     # frontend only (port 3000)
pnpm --filter backend test            # vitest
pnpm --filter frontend build          # next build
pnpm --filter backend build           # tsc → backend/dist
pnpm lint                             # next lint (frontend); backend has no lint config
pnpm format                           # prettier --write across the repo
pnpm format:check                     # CI-style check, no writes
```

A pre-commit hook (husky + lint-staged) runs Prettier on staged files.

## Conventions

- **Package manager:** pnpm only. Do not introduce `package-lock.json`.
- **Database:** Prisma `@@map` / `@map` enforce snake_case at the SQL layer (e.g., `feed_events`, `wallet_addr`). UUID primary keys. Cascading deletes on FKs. Composite uniques enforce business rules (one activity per user per week, one friendship per pair, one membership per user per challenge). Models: User, Streak, Activity, Deposit, Friendship, FeedEvent, Challenge, ChallengeMember.
- **Client state:** React Query is the single source of truth for server state — no Redux/Zustand. Auth/i18n/toast use thin React Contexts.
- **UI target:** mobile-first 390–420px, 44px minimum touch targets, dark OLED theme.
- **Docs language:** mixed FR/EN in long-form docs; product UI is English.

## Workflow

- Plan first: write to `tasks/todo.md` before non-trivial tasks.
- Track lessons: append to `tasks/lessons.md` after corrections.
- Prefer subagents for research/exploration to keep main context clean.
- Verify before marking done — run tests, hit the endpoints, demonstrate correctness.

## Cross-refs

- `README.md` — product pitch, onboarding, local dev setup (the entry point for newcomers)
- `wiring.md` — API contract and frontend ↔ backend data flow
- `AGENTS.md` — workflow rules (plan-first, subagent strategy, verification, lessons)
- `documentation/PROJECT_STATE.md` — shipped-state mirror, updated as features land
- `documentation/gitbook/` — long-form reference docs

## Don't Touch Without Reason

- `schema.prisma` — drives the deployed DB; changes require coordinated migration
- `nginx/` — production configs, not for local tweaks
- `_archived/` — historical only
