# ORIA — Backend Architecture Document

**Version:** 1.0  
**Date:** March 2026  
**Context:** Hackathon MVP  
**Target chain:** Avalanche C-Chain  

---

## 1. Executive Summary

ORIA is a gamified crypto savings app that ties yield-bearing deposits to personal fitness goals. Users deposit USDC/AVAX into a wallet, connect Strava/Apple Health, and earn variable APY (4–8%) based on weekly streak consistency. The backend orchestrates authentication (Privy), activity tracking, streak computation, social features, and on-chain interactions.

This document defines the backend architecture for a hackathon-scoped MVP: real authentication, functional social layer, and mockable gamification/yield mechanics.

---

## 2. Technology Stack

### 2.1 Core Runtime

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Runtime | Node.js 20 LTS + TypeScript | Best crypto/web3 ecosystem, Privy SDK support, fast prototyping |
| Framework | Fastify 4.x | 2x faster than Express, schema validation built-in, great DX |
| ORM | Prisma 5.x | Type-safe queries, easy migrations, Supabase-compatible |
| Database | PostgreSQL 15 (Supabase) | Free tier, real-time subscriptions, Row Level Security |
| Cache | Upstash Redis (optional) | Streak caching, rate limiting. Can skip for MVP |
| Task Queue | BullMQ (optional) | Background jobs (streak computation). Can use cron for MVP |

### 2.2 Web3 & Auth

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Auth | Privy SDK | Embedded wallets, social login, fastest onboarding |
| Chain interaction | viem + wagmi (server) | Type-safe Avalanche C-Chain interactions |
| Chain | Avalanche C-Chain (Fuji testnet for MVP) | EVM-compatible, low fees, fast finality |
| Tokens | USDC (Avalanche), WAVAX | Stablecoins for savings, native token for gas |

### 2.3 External Integrations

| Service | Purpose | MVP Status |
|---------|---------|------------|
| Privy | Auth + embedded wallet | **Real** |
| Strava API | Activity data (km/week) | **Mocked** (with real OAuth flow stub) |
| Apple Health | Activity data | **Mocked** (future: via mobile SDK) |
| Morpho/Aave | Yield generation | **Mocked** (simulated APY) |
| Safe (multisig) | Fund custody | **Mocked** (simple EOA for MVP) |

---

## 3. System Architecture

### 3.1 High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                     │
│              Mobile-first PWA / React Native                │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / REST + WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY (Fastify)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │   Auth    │  │  Streaks │  │  Social  │  │   Wallet   │  │
│  │  Module   │  │  Module  │  │  Module  │  │   Module   │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
     ┌──────────────┐ ┌────────┐ ┌──────────────┐
     │  PostgreSQL   │ │ Redis  │ │  Avalanche   │
     │  (Supabase)   │ │(cache) │ │  C-Chain     │
     └──────────────┘ └────────┘ └──────────────┘
```

### 3.2 Module Breakdown

#### Auth Module
Handles Privy-based authentication. Verifies JWT tokens from Privy, creates/retrieves user profiles, and manages session state.

**Responsibilities:**
- Verify Privy access tokens (JWT validation)
- Create user record on first login
- Link wallet address to user profile
- Manage user preferences (goal type, target km/week)

#### Streaks Module
Core gamification engine. Tracks weekly goal completion and computes streak counts.

**Responsibilities:**
- Receive activity data (mocked or real from Strava)
- Evaluate weekly goal completion (e.g., user ran ≥ target km)
- Increment/reset streak counter every Sunday midnight UTC
- Compute current APY based on streak count
- Emit streak events for the social feed

#### Social Module
Friend system, leaderboard, and activity feed.

**Responsibilities:**
- Friend requests (send, accept, reject, remove)
- Activity feed (friend streak updates, milestones)
- Leaderboard (by streak length, by savings amount)
- Group challenges (future: co-jars)

#### Wallet Module
On-chain interactions and balance tracking.

**Responsibilities:**
- Read wallet balances (USDC, AVAX) via viem
- Track deposits/withdrawals
- "Start Earning" flow (for MVP: mock yield accrual)
- Compute and display projected/actual yield

---

## 4. Data Model

### 4.1 Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    users     │       │   activities     │       │  friendships │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (uuid)    │──┐    │ id (uuid)        │       │ id (uuid)    │
│ privy_id     │  │    │ user_id (fk)     │──┐    │ requester_id │
│ wallet_addr  │  ├───>│ week_start (date)│  │    │ addressee_id │
│ display_name │  │    │ distance_km      │  │    │ status       │
│ avatar_url   │  │    │ source           │  │    │ created_at   │
│ goal_type    │  │    │ goal_met (bool)  │  │    └──────────────┘
│ target_km    │  │    │ created_at       │  │
│ created_at   │  │    └──────────────────┘  │    ┌──────────────┐
│ updated_at   │  │                          │    │  feed_events │
└──────────────┘  │    ┌──────────────────┐  │    ├──────────────┤
                  │    │    streaks       │  │    │ id (uuid)    │
                  │    ├──────────────────┤  │    │ user_id (fk) │
                  ├───>│ id (uuid)        │  │    │ event_type   │
                  │    │ user_id (fk)     │  │    │ payload JSON │
                  │    │ current_count    │  │    │ created_at   │
                  │    │ longest_count    │  │    └──────────────┘
                  │    │ last_week_met    │  │
                  │    │ current_apy      │  │    ┌──────────────┐
                  │    │ updated_at       │  │    │   deposits   │
                  │    └──────────────────┘  │    ├──────────────┤
                  │                          ├───>│ id (uuid)    │
                  │                          │    │ user_id (fk) │
                  │    ┌──────────────────┐  │    │ amount       │
                  │    │   challenges     │  │    │ token        │
                  │    ├──────────────────┤  │    │ tx_hash      │
                  └───>│ id (uuid)        │  │    │ status       │
                       │ creator_id (fk)  │  │    │ created_at   │
                       │ title            │  │    └──────────────┘
                       │ goal_km_week     │  │
                       │ start_date       │  │    ┌──────────────────┐
                       │ end_date         │  │    │challenge_members │
                       │ status           │  │    ├──────────────────┤
                       └──────────────────┘  └───>│ challenge_id(fk) │
                                                  │ user_id (fk)     │
                                                  │ joined_at        │
                                                  └──────────────────┘
```

### 4.2 Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  privyId      String   @unique @map("privy_id")
  walletAddr   String?  @unique @map("wallet_addr")
  displayName  String?  @map("display_name")
  avatarUrl    String?  @map("avatar_url")
  goalType     String   @default("running") @map("goal_type")
  targetKm     Float    @default(10.0) @map("target_km")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  streak             Streak?
  activities         Activity[]
  deposits           Deposit[]
  feedEvents         FeedEvent[]
  sentRequests       Friendship[] @relation("requester")
  receivedRequests   Friendship[] @relation("addressee")
  createdChallenges  Challenge[]  @relation("creator")
  challengeMembers   ChallengeMember[]

  @@map("users")
}

model Streak {
  id           String   @id @default(uuid())
  userId       String   @unique @map("user_id")
  currentCount Int      @default(0) @map("current_count")
  longestCount Int      @default(0) @map("longest_count")
  lastWeekMet  Boolean  @default(false) @map("last_week_met")
  currentApy   Float    @default(4.0) @map("current_apy")
  updatedAt    DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id])

  @@map("streaks")
}

model Activity {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  weekStart  DateTime @map("week_start") @db.Date
  distanceKm Float    @map("distance_km")
  source     String   @default("manual") // "strava" | "apple_health" | "manual"
  goalMet    Boolean  @default(false) @map("goal_met")
  createdAt  DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])

  @@unique([userId, weekStart])
  @@map("activities")
}

model Deposit {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  amount    Float
  token     String   @default("USDC") // "USDC" | "AVAX"
  txHash    String?  @map("tx_hash")
  status    String   @default("pending") // "pending" | "confirmed" | "failed"
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])

  @@map("deposits")
}

model Friendship {
  id          String   @id @default(uuid())
  requesterId String   @map("requester_id")
  addresseeId String   @map("addressee_id")
  status      String   @default("pending") // "pending" | "accepted" | "rejected"
  createdAt   DateTime @default(now()) @map("created_at")

  requester User @relation("requester", fields: [requesterId], references: [id])
  addressee User @relation("addressee", fields: [addresseeId], references: [id])

  @@unique([requesterId, addresseeId])
  @@map("friendships")
}

model FeedEvent {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  eventType String   @map("event_type") // "streak_milestone" | "goal_met" | "deposit" | "challenge_joined"
  payload   Json     @default("{}")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])

  @@index([createdAt(sort: Desc)])
  @@map("feed_events")
}

model Challenge {
  id        String   @id @default(uuid())
  creatorId String   @map("creator_id")
  title     String
  goalKmWk  Float    @map("goal_km_week")
  startDate DateTime @map("start_date") @db.Date
  endDate   DateTime @map("end_date") @db.Date
  status    String   @default("active") // "active" | "completed" | "cancelled"
  createdAt DateTime @default(now()) @map("created_at")

  creator User              @relation("creator", fields: [creatorId], references: [id])
  members ChallengeMember[]

  @@map("challenges")
}

model ChallengeMember {
  id          String   @id @default(uuid())
  challengeId String   @map("challenge_id")
  userId      String   @map("user_id")
  joinedAt    DateTime @default(now()) @map("joined_at")

  challenge Challenge @relation(fields: [challengeId], references: [id])
  user      User      @relation(fields: [userId], references: [id])

  @@unique([challengeId, userId])
  @@map("challenge_members")
}
```

---

## 5. API Design

### 5.1 Authentication

All endpoints (except health check) require a valid Privy JWT in the `Authorization: Bearer <token>` header.

### 5.2 Endpoints

#### Auth & User

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/verify` | Verify Privy token, create/return user |
| GET | `/api/users/me` | Get current user profile + streak |
| PATCH | `/api/users/me` | Update display name, avatar, goal settings |
| GET | `/api/users/:id` | Get public profile of another user |

#### Streaks & Activities

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/streaks/me` | Get current streak, APY, history |
| POST | `/api/activities` | Log activity for current week (manual or mock Strava) |
| GET | `/api/activities?weeks=12` | Get activity history |
| POST | `/api/streaks/evaluate` | (Admin/Cron) Evaluate all streaks for the week |

#### Social

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/friends` | List friends (accepted) |
| POST | `/api/friends/request` | Send friend request `{ addresseeId }` |
| POST | `/api/friends/:id/accept` | Accept friend request |
| POST | `/api/friends/:id/reject` | Reject friend request |
| DELETE | `/api/friends/:id` | Remove friend |
| GET | `/api/feed` | Get social feed (friends' events) |
| GET | `/api/leaderboard` | Get leaderboard (streak length, filtered by friends) |

#### Challenges

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/challenges` | Create group challenge |
| GET | `/api/challenges` | List active challenges |
| POST | `/api/challenges/:id/join` | Join a challenge |
| GET | `/api/challenges/:id` | Get challenge details + members + progress |

#### Wallet & Deposits

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/wallet/balance` | Get on-chain balances (USDC, AVAX) |
| POST | `/api/wallet/deposit` | Record deposit intent |
| POST | `/api/wallet/start-earning` | Trigger "start earning" (mock for MVP) |
| GET | `/api/wallet/earnings` | Get projected yield based on current APY + deposits |

---

## 6. APY / Streak Formula

### 6.1 Model

The APY adjusts between **4% (base)** and **8% (max)** based on streak count using a logarithmic curve that rewards early consistency but flattens as streaks grow.

```
APY(streak) = BASE_APY + (MAX_APY - BASE_APY) × min(1, ln(1 + streak) / ln(1 + MAX_STREAK))
```

With `BASE_APY = 4`, `MAX_APY = 8`, `MAX_STREAK = 10`:

| Streak | APY   |
|--------|-------|
| 0      | 4.00% |
| 1      | 4.58% |
| 2      | 5.83% |
| 3      | 6.33% |
| 4      | 6.72% |
| 6      | 7.24% |
| 10     | 8.00% |

### 6.2 Implementation

```typescript
const BASE_APY = 4.0;
const MAX_APY = 8.0;
const MAX_STREAK = 10;

function computeApy(streakCount: number): number {
  if (streakCount <= 0) return BASE_APY;
  if (streakCount >= MAX_STREAK) return MAX_APY;
  
  const progress = Math.log(1 + streakCount) / Math.log(1 + MAX_STREAK);
  return BASE_APY + (MAX_APY - BASE_APY) * Math.min(1, progress);
}
```

### 6.3 Weekly Evaluation Logic

Every Sunday at 23:59 UTC (cron job or manual trigger):

1. For each user, fetch the current week's activity
2. If `activity.distanceKm >= user.targetKm` → `goalMet = true`
3. If goal met → `streak.currentCount += 1`, update `longestCount` if applicable
4. If goal NOT met → `streak.currentCount = 0`
5. Recompute `streak.currentApy = computeApy(streak.currentCount)`
6. Emit feed event if milestone reached (3, 5, 10 weeks)

---

## 7. Project Structure

```
oria-backend/
├── src/
│   ├── app.ts                  # Fastify app setup, plugin registration
│   ├── server.ts               # Entry point
│   ├── config/
│   │   ├── env.ts              # Environment variable validation (zod)
│   │   └── constants.ts        # APY constants, streak thresholds
│   ├── plugins/
│   │   ├── auth.ts             # Privy JWT verification plugin
│   │   ├── prisma.ts           # Prisma client plugin
│   │   └── cors.ts             # CORS configuration
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.schemas.ts # Zod / JSON schema for validation
│   │   ├── users/
│   │   │   ├── users.routes.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.schemas.ts
│   │   ├── streaks/
│   │   │   ├── streaks.routes.ts
│   │   │   ├── streaks.service.ts
│   │   │   ├── streaks.schemas.ts
│   │   │   └── apy.utils.ts    # APY computation
│   │   ├── social/
│   │   │   ├── social.routes.ts
│   │   │   ├── social.service.ts
│   │   │   └── social.schemas.ts
│   │   ├── challenges/
│   │   │   ├── challenges.routes.ts
│   │   │   ├── challenges.service.ts
│   │   │   └── challenges.schemas.ts
│   │   └── wallet/
│   │       ├── wallet.routes.ts
│   │       ├── wallet.service.ts
│   │       └── wallet.schemas.ts
│   ├── jobs/
│   │   └── evaluateStreaks.ts  # Weekly cron/manual evaluation
│   ├── lib/
│   │   ├── privy.ts            # Privy client setup
│   │   ├── chain.ts            # viem Avalanche client
│   │   └── errors.ts           # Custom error classes
│   └── types/
│       └── index.ts            # Shared TypeScript types
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                 # Seed data for demo
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 8. Authentication Flow

```
  Client                    Privy                   ORIA Backend
    │                         │                          │
    │──── Login (email/       │                          │
    │     social/wallet) ────>│                          │
    │                         │                          │
    │<── Access Token (JWT) ──│                          │
    │                         │                          │
    │──── POST /api/auth/verify ────────────────────────>│
    │     Authorization: Bearer <privy_jwt>              │
    │                                                    │
    │                         │<── Verify JWT (Privy SDK)│
    │                         │──── OK + user claims ───>│
    │                                                    │
    │                         │     Upsert user record   │
    │                         │     Link wallet address  │
    │                                                    │
    │<──────────── { user, streak, isNew } ──────────────│
```

---

## 9. Deployment Strategy (Hackathon)

### 9.1 Quick Deploy

| Service | Platform | Notes |
|---------|----------|-------|
| Backend API | Railway / Render | Auto-deploy from GitHub, free tier |
| Database | Supabase | Free PostgreSQL, built-in auth fallback |
| Frontend | Vercel | Auto-deploy Next.js |
| Chain | Avalanche Fuji Testnet | Free test AVAX from faucet |

### 9.2 Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/oria

# Privy
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Avalanche
AVAX_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVAX_CHAIN_ID=43113

# Mock mode (for hackathon)
MOCK_STRAVA=true
MOCK_YIELD=true
```

---

## 10. MVP Implementation Priority

### Phase 1 — Foundation (Hours 0–8)
- Project scaffolding (Fastify + TypeScript + Prisma)
- Privy auth integration (verify, upsert user)
- Database schema & migrations
- Basic health check & CORS

### Phase 2 — Core Features (Hours 8–24)
- Streaks module (log activity, evaluate, compute APY)
- Social module (friends, feed, leaderboard)
- Wallet module (read balance via viem, mock yield)

### Phase 3 — Social & Polish (Hours 24–48)
- Challenges (create, join, progress tracking)
- Seed data for demo
- Error handling & edge cases
- API documentation (Swagger via Fastify)

### Phase 4 — Demo Ready (Hours 48–72)
- End-to-end testing with frontend
- Demo scenario walkthrough
- Presentation prep

---

## 11. Security Considerations

Even for a hackathon MVP, these basics must be in place:

- **JWT validation:** Every request goes through Privy JWT verification middleware — never trust client-side claims
- **Input validation:** All request bodies validated via Zod schemas before processing
- **SQL injection:** Prisma parameterizes all queries by default
- **CORS:** Restrict to frontend origin only
- **Rate limiting:** Basic Fastify rate-limit plugin (10 req/s per IP)
- **Wallet address validation:** Always checksum-validate Avalanche addresses
- **No private keys on backend:** All signing happens client-side via Privy embedded wallet

---

## 12. Future Considerations (Post-Hackathon)

These are out of scope for the MVP but documented for planning:

- **Real Strava integration:** OAuth2 flow, webhook for new activities, rate limit handling
- **Morpho vault integration:** Real on-chain deposit to Morpho USDC vault on Avalanche
- **Smart contract:** Programmable jar logic (if-then oracles for conditional release)
- **Safe multisig:** Custody via Safe{Wallet} on Avalanche for yield-bearing positions
- **Push notifications:** Streak reminders, friend activity alerts
- **KYC/AML:** Privy identity verification, MiCA compliance
- **Multi-chain:** Bridge support via LiFi for cross-chain deposits
- **Screen time tracking:** iOS Screen Time API, Android Digital Wellbeing
