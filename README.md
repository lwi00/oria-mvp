# Oria

**Gamified crypto savings on Avalanche.** Deposit USDC, stay active, earn more.

Oria ties yield-bearing deposits to personal fitness goals. Users deposit into a savings jar, connect their activity tracker, and earn variable APY (4-8%) based on weekly streak consistency. The more consistent you are, the higher your yield.

## How It Works

1. **Connect & Deposit** -- Sign in with Privy (social login or wallet), deposit USDC or AVAX
2. **Set Your Goal** -- Choose a weekly km target (running, cycling, or steps)
3. **Stay Active** -- Log activities via Strava, Apple Health, or manually
4. **Earn More** -- Hit your weekly goal to build streaks. Longer streaks = higher APY

### APY Formula

```
APY(s) = 4 + 4 * min(1, ln(1+s) / ln(11))
```

| Streak (weeks) | APY |
|----------------|------|
| 0 | 4.00% |
| 1 | 5.40% |
| 3 | 6.33% |
| 6 | 7.24% |
| 10+ | 8.00% |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, Tailwind CSS, mobile-first PWA |
| Backend | Fastify 4, TypeScript, Prisma 5, PostgreSQL |
| Auth | Privy SDK (embedded wallets, social login) |
| Chain | Avalanche C-Chain (Fuji testnet) |
| Tokens | USDC, WAVAX |
| Deployment | Vercel (frontend), Railway (backend), Supabase (DB) |

## Repository Structure

```
docs/
  ORIA_Backend_Architecture.md   -- Backend spec: API endpoints, modules, auth flow
  ORIA_Design_System.md          -- Design system: colors, typography, components
  oria_frame.md                  -- Product framing (French)
mockups/
  OriaAppMock.jsx                -- React mock of the 4 app screens
  OriaLanding.jsx                -- Landing page with savings jar animation
schema.prisma                    -- Prisma data model (7 tables)
tasks/
  todo.md                        -- Implementation plan (15 phases)
```

## App Screens

The app has 4 main screens, designed mobile-first at 390px:

- **Dashboard** -- Streak hero card, weekly progress ring, APY chart, friends activity
- **Social** -- Friends leaderboard, activity feed
- **Challenges** -- Group challenges with progress tracking and stacked avatars
- **Wallet** -- Balance display, deposit/withdraw, earning status, transaction history

High-fidelity mockups are available in the Paper design file and as React components in `mockups/`.

## Key Features

- **Streak-based APY** -- Logarithmic curve rewards early consistency (4% base, 8% max)
- **Social layer** -- Friend leaderboards, activity feed, streak milestones
- **Group challenges** -- Create or join challenges with shared weekly km goals
- **Non-custodial** -- Privy embedded wallets, user controls their funds
- **Yield via DeFi** -- Deposits routed to Morpho/Aave on Avalanche (mocked for MVP)

## MVP Scope

**Real:** Privy auth, on-chain balance reads (viem), social features, streak computation

**Mocked:** Strava integration, Morpho/Aave yield accrual, Safe multisig custody

## Getting Started

> Backend and frontend are not yet scaffolded. See `tasks/todo.md` for the full implementation plan.

```bash
# Once scaffolded:
cp .env.example .env    # Fill in Privy, Supabase, Avalanche credentials
npm install
npx prisma migrate dev
npm run dev
```

## Team

Built for the Avalanche hackathon, March 2026.

## License

MIT
