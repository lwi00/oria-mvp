# ORIA Implementation Plan

## Phase 0 -- Project Setup
- [ ] Initialize monorepo structure (`/backend`, `/frontend`)
- [ ] Backend: scaffold Fastify + TypeScript project (`oria-backend/`)
- [ ] Backend: configure `tsconfig.json`, ESLint, Prettier
- [ ] Backend: install core deps (fastify, @fastify/cors, @fastify/rate-limit, prisma, zod)
- [ ] Backend: copy `schema.prisma`, run `prisma generate` + first migration
- [ ] Backend: create `.env.example` with all required variables (see Architecture doc S9.2)
- [ ] Frontend: scaffold Next.js 14 app with App Router (`oria-frontend/`)
- [ ] Frontend: install core deps (tailwindcss, @privy-io/react-auth, viem, wagmi)
- [ ] Frontend: set up Tailwind config with ORIA design tokens (colors, fonts, spacing)
- [ ] Frontend: configure Inter font (Google Fonts) and base layout (mobile-first 390px)
- [ ] Set up Supabase project, get `DATABASE_URL`
- [ ] Set up Privy app, get `PRIVY_APP_ID` + `PRIVY_APP_SECRET`

## Phase 1 -- Backend Foundation
- [ ] Create Fastify app entry (`src/app.ts`, `src/server.ts`)
- [ ] Create env config with Zod validation (`src/config/env.ts`)
- [ ] Create constants file: APY formula params, streak thresholds (`src/config/constants.ts`)
- [ ] Create Prisma plugin (`src/plugins/prisma.ts`)
- [ ] Create CORS plugin (`src/plugins/cors.ts`)
- [ ] Create Privy auth plugin -- JWT verification middleware (`src/plugins/auth.ts`)
- [ ] Create shared error classes (`src/lib/errors.ts`)
- [ ] Create health check endpoint (`GET /health`)
- [ ] Verify: server starts, connects to DB, health check returns 200

## Phase 2 -- Auth Module
- [ ] `POST /api/auth/verify` -- verify Privy JWT, upsert user, return user + streak
- [ ] `GET /api/users/me` -- get current user profile with streak data
- [ ] `PATCH /api/users/me` -- update displayName, avatarUrl, goalType, targetKm
- [ ] `GET /api/users/:id` -- get public profile of another user
- [ ] Zod schemas for all request/response validation
- [ ] Verify: login flow works end-to-end with Privy test tokens

## Phase 3 -- Streaks & Activities Module
- [ ] APY utility function (`src/modules/streaks/apy.utils.ts`)
  - `computeApy(streakCount)` -- logarithmic formula: 4 + 4 * min(1, ln(1+s)/ln(11))
  - Unit tests for edge cases (0, 1, 5, 10, 100)
- [ ] `POST /api/activities` -- log/update activity for current week
  - Upsert on (userId, weekStart), auto-compute goalMet vs user.targetKm
- [ ] `GET /api/activities?weeks=N` -- get activity history
- [ ] `GET /api/streaks/me` -- get current streak, APY, week dots (M-S progress)
- [ ] `POST /api/streaks/evaluate` -- weekly evaluation cron logic
  - For each user: check this week's activity, increment/reset streak, recompute APY
  - Emit feed events for milestones (3, 5, 10 weeks)
- [ ] Verify: log activities, run evaluation, confirm streak increments + APY changes

## Phase 4 -- Social Module
- [ ] `POST /api/friends/request` -- send friend request
- [ ] `POST /api/friends/:id/accept` -- accept friend request
- [ ] `POST /api/friends/:id/reject` -- reject friend request
- [ ] `DELETE /api/friends/:id` -- remove friend
- [ ] `GET /api/friends` -- list accepted friends with streaks
- [ ] `GET /api/feed` -- social feed (friends' events, paginated, newest first)
- [ ] `GET /api/leaderboard` -- friends leaderboard sorted by streak then APY
- [ ] Verify: full friend lifecycle, feed populates from streak events

## Phase 5 -- Challenges Module
- [ ] `POST /api/challenges` -- create challenge (creator auto-joins)
- [ ] `GET /api/challenges` -- list active challenges user is in or can join
- [ ] `POST /api/challenges/:id/join` -- join a challenge
- [ ] `GET /api/challenges/:id` -- challenge details + members + progress
- [ ] Challenge progress: compute weeksMet/weeksTotal per member
- [ ] Verify: create challenge, join, check progress after activity logging

## Phase 6 -- Wallet Module
- [ ] Set up viem client for Avalanche Fuji testnet (`src/lib/chain.ts`)
- [ ] `GET /api/wallet/balance` -- read on-chain USDC + AVAX balances via viem
- [ ] `POST /api/wallet/deposit` -- record deposit intent (mock for MVP)
- [ ] `POST /api/wallet/start-earning` -- trigger earning state (mock yield accrual)
- [ ] `GET /api/wallet/earnings` -- compute projected yield from deposits + current APY
- [ ] Verify: balances read from Fuji, mock deposits track correctly

## Phase 7 -- Seed Data & Demo Script
- [ ] Create `prisma/seed.ts` with realistic demo data
  - 5 users (Talam, Sarah, Marcus, Luna, Alex) with varied streaks
  - Activities for past 8 weeks
  - Friend connections between all users
  - 2 active challenges with members
  - Deposits and feed events
- [ ] Verify: seed data matches the Paper mockup designs exactly

## Phase 8 -- Frontend: Layout & Auth
- [ ] Create base layout: mobile shell (390px centered), safe areas, tab bar
- [ ] Implement tab bar component (Home, Social, Challenges, Wallet)
- [ ] Implement header component (Oria logo, bell icon, avatar)
- [ ] Integrate Privy React SDK -- login/signup flow
- [ ] Auth context: store user session, protect routes
- [ ] API client: fetch wrapper with auth headers, error handling
- [ ] Verify: user can log in via Privy, sees empty dashboard

## Phase 9 -- Frontend: Dashboard (Home Tab)
- [ ] Greeting section ("Hello, {name}" + "Dashboard" title)
- [ ] Streak Hero Card: streak count, fire icon, APY, savings jar illustration
- [ ] Week dots row (M-S): filled/check for days with activity, empty for remaining
- [ ] Weekly Progress Card: km counter, progress ring, progress bar, remaining text
- [ ] Quick Stats grid: Balance + Current APY cards
- [ ] APY Progression chart: bar chart showing streak-to-APY mapping
- [ ] Friends Activity preview: 3 recent feed items
- [ ] Wire all components to real API data
- [ ] Verify: dashboard matches Paper mockup pixel-for-pixel

## Phase 10 -- Frontend: Social Tab
- [ ] Leaderboard Card: ranked rows with medal/number, avatar, name, streak, APY
  - Current user row highlighted with gradient background
- [ ] Activity Feed Card: feed items with avatar, name, event text, timestamp
- [ ] Wire to `/api/leaderboard` and `/api/feed`
- [ ] Verify: matches Paper mockup

## Phase 11 -- Frontend: Challenges Tab
- [ ] "Create a Challenge" dashed button (opens creation form/modal)
- [ ] Challenge creation form: title, km/week goal, start/end date, max members
- [ ] Challenge Card component: title, goal, days left badge, stacked avatars, progress bar
- [ ] Challenge detail view (optional for MVP)
- [ ] Wire to `/api/challenges`
- [ ] Verify: matches Paper mockup

## Phase 12 -- Frontend: Wallet Tab
- [ ] Balance Hero Card: total balance display, earned amount, Deposit/Withdraw buttons
- [ ] Deposit flow: amount input, token selector (USDC/AVAX), confirmation
- [ ] Earning Status Card: protocol info, Active badge, 3-col stats (Deposited/Earned/APY)
- [ ] Recent Transactions list: transaction rows with icon, label, amount, date
- [ ] Wire to `/api/wallet/*`
- [ ] Verify: matches Paper mockup

## Phase 13 -- Polish & Integration
- [ ] Loading states and skeleton screens for all cards
- [ ] Error states and empty states (no friends, no challenges, etc.)
- [ ] Pull-to-refresh behavior
- [ ] Toast notifications for actions (friend request sent, activity logged, etc.)
- [ ] Ensure all financial numbers use tabular-nums (font-feature-settings)
- [ ] Responsive check: test on 375px, 390px, 414px widths
- [ ] Accessibility: min 44px touch targets, sufficient color contrast

## Phase 14 -- Deployment
- [ ] Backend: deploy to Railway/Render, set environment variables
- [ ] Frontend: deploy to Vercel, configure CORS origin
- [ ] Database: run migrations on Supabase production
- [ ] Seed demo data on production
- [ ] Smoke test: full user journey on deployed app
- [ ] Get Fuji testnet AVAX from faucet for demo wallet

## Phase 15 -- Demo Prep
- [ ] Write demo script: walkthrough of key flows
  1. Sign up via Privy (social login)
  2. See dashboard with streak + APY
  3. Log a run activity, watch progress update
  4. Check leaderboard, see friends' activity
  5. Join a challenge, view progress
  6. Deposit USDC, see earning status
- [ ] Record backup demo video (in case of live issues)
- [ ] Prepare pitch deck slides highlighting APY formula + social mechanics

---

## Notes
- **Mocked for MVP:** Strava integration, Morpho/Aave yield, Safe multisig custody
- **Real for MVP:** Privy auth, on-chain balance reads (viem), social features, streaks
- **APY formula:** `APY(s) = 4 + 4 * min(1, ln(1+s) / ln(11))` -- range 4.00% to 8.00%
- **Target chain:** Avalanche C-Chain (Fuji testnet)
- **Design reference:** Paper mockups (Dashboard, Social, Challenges, Wallet artboards)
