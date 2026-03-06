# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ORIA is a gamified crypto savings app on Avalanche C-Chain. Users deposit USDC/AVAX and earn variable APY (4-8%) based on weekly fitness streak consistency. This repo contains the hackathon MVP: planning docs, database schema, and UI mockups. The actual backend and frontend codebases have not yet been scaffolded.

## Repository Structure

- `schema.prisma` — Prisma data model (PostgreSQL). 7 core tables: users, streaks, activities, deposits, friendships, feed_events, challenges, challenge_members
- `ORIA_Backend_Architecture.md` — Full backend spec: API endpoints, module breakdown, auth flow, streak evaluation logic
- `ORIA_Design_System.md` — Complete design system: colors, typography (Inter), spacing, component specs
- `oria_frame.md` — Product framing document (French): vision, scope, timeline, team
- `OriaAppMock.jsx` — React component mock of the mobile app (dashboard, wallet, social, challenges tabs)
- `OriaLanding.jsx` — React landing page component with savings jar animation
- `AGENTS.md` — Workflow rules (plan-first, subagent strategy, verification, lessons tracking)
- `tasks/` — Task tracking: `todo.md` for current work, `lessons.md` for accumulated patterns

## Tech Stack (Planned)

- **Backend:** Node.js 20 + TypeScript, Fastify 4.x, Prisma 5.x, PostgreSQL (Supabase)
- **Auth:** Privy SDK (JWT verification, embedded wallets, social login)
- **Blockchain:** Avalanche C-Chain (Fuji testnet), viem for on-chain reads, USDC/WAVAX tokens
- **Frontend:** Next.js, mobile-first PWA (390-420px target)
- **Deployment:** Railway/Render (backend), Vercel (frontend), Supabase (DB)

## Key Domain Concepts

- **APY Formula:** `APY(s) = 4 + 4 * min(1, ln(1+s) / ln(11))` where s = consecutive weeks with goal met. Range: 4.00% (s=0) to 8.00% (s>=10)
- **Streaks:** Weekly evaluation — user must hit their km target each week to maintain streak. Streak count drives APY
- **Backend modules:** Auth, Streaks, Social, Challenges, Wallet — each with own routes, services, and validation schemas
- **Mocked for MVP:** Strava integration, Morpho/Aave yield, Safe multisig custody. Auth (Privy) and on-chain reads (viem) are real

## Design System

- **Font:** Inter (weights 300-800), tabular-nums for financial data
- **Colors:** Purple/lavender brand palette (#7c3aed primary, #faf9ff background), light mode only
- **Style:** Light, airy, fintech-meets-fitness. Mobile-first. 44px minimum touch targets
- **Design tokens** are defined inline in the JSX mockups as the `T` object

## Workflow Conventions

- Plan first: write plan to `tasks/todo.md` before implementing non-trivial tasks
- Track lessons: update `tasks/lessons.md` after corrections or discovered patterns
- Prefer subagents for research/exploration to keep main context clean
- Verify before marking done — run tests, check logs, demonstrate correctness
- Documents are mixed French/English; product UI is English

## Database Conventions (from schema.prisma)

- All table names use snake_case via `@@map()` (e.g., `feed_events`)
- All column names use snake_case via `@map()` (e.g., `wallet_addr`)
- UUIDs for all primary keys
- Cascading deletes on all foreign keys
- Composite unique constraints enforce business rules (one activity per user per week, one friendship per pair, one membership per user per challenge)
