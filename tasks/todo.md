# ORIA Implementation Plan

## Phase 0 -- Project Setup
- [x] Initialize monorepo structure (`/backend`, `/frontend`)
- [x] Backend: scaffold Fastify + TypeScript project
- [x] Backend: configure `tsconfig.json`
- [x] Backend: install core deps (fastify, @fastify/cors, prisma, zod, fastify-plugin)
- [x] Backend: copy `schema.prisma`, run `prisma generate` + first migration
- [x] Backend: create `.env.example` with all required variables
- [x] Frontend: scaffold Next.js 14 app with App Router
- [x] Frontend: install core deps (tailwindcss, @tanstack/react-query, viem, wagmi)
- [x] Frontend: set up Tailwind config with ORIA design tokens
- [x] Frontend: configure Inter font and base layout (mobile-first 420px)
- [x] Local PostgreSQL via Homebrew (DATABASE_URL configured)
- [ ] Set up Privy app, get `PRIVY_APP_ID` + `PRIVY_APP_SECRET` (using MOCK_AUTH=true)

## Phase 1 -- Backend Foundation
- [x] Create Fastify app entry (`src/app.ts`, `src/server.ts`)
- [x] Create env config with Zod validation (`src/config/env.ts`)
- [x] Create constants file: APY formula params, streak thresholds (`src/config/constants.ts`)
- [x] Create Prisma plugin (`src/plugins/prisma.ts`)
- [x] Create CORS plugin (`src/plugins/cors.ts`)
- [x] Create Privy auth plugin with MOCK_AUTH support (`src/plugins/auth.ts`)
- [x] Create shared error classes (`src/lib/errors.ts`)
- [x] Create health check endpoint (`GET /health`)
- [x] Verify: server starts, connects to DB, health check returns 200

## Phase 2 -- Auth Module
- [x] `POST /api/auth/verify` -- verify Privy JWT, upsert user, return user + streak
- [x] `GET /api/users/me` -- get current user profile with streak data
- [x] `PATCH /api/users/me` -- update displayName, avatarUrl, goalType, targetKm
- [x] `GET /api/users/:id` -- get public profile of another user
- [x] Zod schemas for all request/response validation

## Phase 3 -- Streaks & Activities Module
- [x] APY utility function (`src/modules/streaks/apy.utils.ts`)
- [x] Unit tests for computeApy (7 tests passing)
- [x] `POST /api/activities` -- log/update activity for current week
- [x] `GET /api/activities?weeks=N` -- get activity history
- [x] `GET /api/streaks/me` -- get current streak, APY, week data
- [x] `POST /api/streaks/evaluate` -- weekly evaluation with feed events

## Phase 4 -- Social Module
- [x] `POST /api/friends/request` -- send friend request
- [x] `POST /api/friends/:id/accept` -- accept friend request
- [x] `POST /api/friends/:id/reject` -- reject friend request
- [x] `DELETE /api/friends/:id` -- remove friend
- [x] `GET /api/friends` -- list accepted friends with streaks
- [x] `GET /api/feed` -- social feed (friends' events, paginated, newest first)
- [x] `GET /api/leaderboard` -- friends leaderboard sorted by streak

## Phase 5 -- Challenges Module
- [x] `POST /api/challenges` -- create challenge (creator auto-joins)
- [x] `GET /api/challenges` -- list active challenges
- [x] `POST /api/challenges/:id/join` -- join a challenge
- [x] `GET /api/challenges/:id` -- challenge details + members + progress

## Phase 6 -- Wallet Module
- [x] `GET /api/wallet/balance` -- mock on-chain balances
- [x] `POST /api/wallet/deposit` -- record deposit + feed event
- [x] `POST /api/wallet/start-earning` -- trigger earning state
- [x] `GET /api/wallet/earnings` -- compute projected yield

## Phase 7 -- Seed Data
- [x] 5 users (Talam, Eva, Louis, Emma, Raph) with varied streaks
- [x] Activities for past 8 weeks
- [x] All 10 friend connections (accepted)
- [x] 2 active challenges with members
- [x] 3 deposits + 5 feed events

## Phase 8 -- Frontend: Layout & Components
- [x] Mobile shell (420px max-width, background blobs)
- [x] Header component (Oria logo, bell, avatar)
- [x] Tab bar component (Home, Social, Challenges, Wallet)
- [x] Shared components: Card, Avatar, ProgressRing, MiniJar, WeekDots
- [x] API client (`src/lib/api.ts`)

## Phase 9 -- Frontend: Dashboard (Home Tab)
- [x] Streak Hero Card with MiniJar + streak count + APY + WeekDots
- [x] Weekly Progress Card with km counter + ProgressRing + ProgressBar
- [x] Quick Stats grid (Balance + Current APY)
- [x] APY Progression mini bar chart
- [x] Friends Activity preview (3 items)
- [x] Wire to real API data (TanStack Query hooks)
- [x] Activity logging modal

## Phase 10 -- Frontend: Social Tab
- [x] Leaderboard Card with ranked rows
- [x] Activity Feed Card
- [x] Wire to real API data

## Phase 11 -- Frontend: Challenges Tab
- [x] Create Challenge dashed button
- [x] Challenge Cards with progress bars + stacked avatars
- [x] Wire to real API data
- [x] Challenge creation form/modal

## Phase 12 -- Frontend: Wallet Tab
- [x] Balance Hero Card
- [x] Earning Status Card with Active badge + 3-col stats
- [x] On-chain Balances card
- [x] Deposit flow (amount input, token selector modal)
- [x] Wire to real API data

## Phase 13 -- Polish & Integration
- [x] Loading skeletons for all cards
- [x] Empty states (no friends, no challenges, no feed)
- [x] Toast notifications (success/error) on activity log + deposit
- [x] `tabular-nums` on all financial numbers
- [x] PWA manifest (theme_color, background_color, icons)
- [x] Responsive check: 375px, 390px, 414px widths
- [x] 44px min touch targets check

## Phase 14 -- Deployment
- [ ] Backend -> Railway/Render
- [ ] Frontend -> Vercel
- [ ] Database -> Supabase production
- [ ] Fuji testnet AVAX

## Phase 15 -- Demo Prep
- [ ] Demo script
- [ ] Backup demo video
