# ORIA — Wiring Guide

How to get every API key, configure environment variables, and deploy on **Supabase**, **Railway**, and **Vercel**.

---

## 1. Services Overview

| Service | Role | Free tier? |
|---------|------|------------|
| **Supabase** | PostgreSQL database | Yes (500 MB, 2 projects) |
| **Railway** | Backend API hosting (Fastify) | Yes ($5 credit/month) |
| **Vercel** | Frontend hosting (Next.js) | Yes (hobby plan) |
| **Privy** | Auth + embedded wallets | Yes (dev plan, 1000 MAU) |
| **Avalanche Fuji** | Testnet RPC | Free (public endpoint) |

---

## 2. Supabase — Database

### 2.1 Create project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Pick a name (e.g. `oria`), set a **database password** (save it), choose the closest region
3. Wait for provisioning (~30 s)

### 2.2 Get the connection string

1. Go to **Project Settings → Database**
2. Under **Connection string → URI**, copy the string. It looks like:
   ```
   postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
3. **Important:** Use the **Transaction mode** (port `6543`) for serverless/Railway, or **Session mode** (port `5432`) if you need migrations.
4. For Prisma migrations you need the **direct connection** (Session mode, port `5432`). Supabase provides both under **Connection string**.

### 2.3 Resulting env var

```
DATABASE_URL=postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
```

> Tip: If you use connection pooling (port 6543), add `?pgbouncer=true` at the end and set a separate `DIRECT_URL` for migrations. For the MVP, session mode (5432) is simpler.

---

## 3. Privy — Auth & Embedded Wallets

### 3.1 Create an app

1. Go to [dashboard.privy.io](https://dashboard.privy.io) → **Create App**
2. Name it `ORIA` (or whatever you like)

### 3.2 Get credentials

1. In the app dashboard go to **Settings → Basics**
2. Copy:
   - **App ID** → `PRIVY_APP_ID` (also used on frontend as `NEXT_PUBLIC_PRIVY_APP_ID`)
   - **App Secret** → `PRIVY_APP_SECRET` (backend only, never expose to client)

### 3.3 Configure login methods

1. Go to **Login Methods** → enable the ones you want:
   - **Email** (recommended for MVP)
   - **Google** / **Apple** (optional)
   - **Wallet** (MetaMask, etc.)
2. Go to **Embedded Wallets** → toggle **Create embedded wallets for users** to ON
3. Under **Chains**, add **Avalanche Fuji (43113)** so embedded wallets work on testnet

### 3.4 Set allowed origins

1. Go to **Settings → Allowed Origins**
2. Add:
   - `http://localhost:3000` (local dev)
   - Your Vercel production URL (e.g. `https://oria-app.vercel.app`)

### 3.5 Resulting env vars

**Backend** (`.env`):
```
PRIVY_APP_ID=cmmgcpupg006v0bjp5b7tkpee
PRIVY_APP_SECRET=privy_app_secret_xxxxx...
```

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_PRIVY_APP_ID=cmmgcpupg006v0bjp5b7tkpee
```

> The App ID is the same value on both sides. The App Secret is **backend-only**.

---

## 4. Avalanche Fuji Testnet — RPC

### 4.1 Public RPC (simplest)

No API key needed. Use the public endpoint:

```
AVAX_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVAX_CHAIN_ID=43113
```

### 4.2 Private RPC (optional, for reliability)

If the public RPC is too slow or rate-limited, create a free account on one of these:

| Provider | URL | Free tier |
|----------|-----|-----------|
| **Infura** | [infura.io](https://infura.io) | 100k req/day |
| **Alchemy** | [alchemy.com](https://alchemy.com) | 300M CU/month |
| **Chainstack** | [chainstack.com](https://chainstack.com) | 3M req/month |

After signing up, create an Avalanche Fuji endpoint and use that URL instead.

### 4.3 Get test AVAX

Go to [core.app/tools/testnet-faucet](https://core.app/tools/testnet-faucet/?subnet=c&token=c) → paste your wallet address → get 2 AVAX.

---

## 5. Environment Variable Summary

### Backend — `backend/.env`

```env
# Server
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-app.vercel.app

# Database (from Supabase § 2.3)
DATABASE_URL=postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres

# Privy (from § 3.2)
PRIVY_APP_ID=cmmgcpupg006v0bjp5b7tkpee
PRIVY_APP_SECRET=privy_app_secret_xxxxx...

# Avalanche (from § 4)
AVAX_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVAX_CHAIN_ID=43113

# Feature flags
MOCK_AUTH=false
MOCK_STRAVA=true
MOCK_YIELD=true
```

### Frontend — `frontend/.env.local`

```env
# Backend URL (Railway URL once deployed)
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app

# Disable mock mode to hit real backend
NEXT_PUBLIC_USE_MOCK=false

# Privy (same App ID as backend, § 3.2)
NEXT_PUBLIC_PRIVY_APP_ID=cmmgcpupg006v0bjp5b7tkpee
```

---

## 6. Deploy on Railway — Backend

### 6.1 Setup

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo**
2. Select the repo `lwi00/oria-app`
3. Railway will auto-detect the monorepo. Set the **Root Directory** to `backend`

### 6.2 Build & start commands

In Railway service settings:

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Start Command** | `npx prisma migrate deploy && npm run start` |

> `prisma migrate deploy` runs pending migrations on every deploy. Safe for production (non-interactive, only applies new migrations).

### 6.3 Environment variables

In Railway → **Variables**, add all the backend env vars from section 5:

| Variable | Value |
|----------|-------|
| `PORT` | `3001` (or let Railway assign via `$PORT`) |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://your-app.vercel.app` |
| `DATABASE_URL` | *(from Supabase)* |
| `PRIVY_APP_ID` | *(from Privy dashboard)* |
| `PRIVY_APP_SECRET` | *(from Privy dashboard)* |
| `AVAX_RPC_URL` | `https://api.avax-test.network/ext/bc/C/rpc` |
| `AVAX_CHAIN_ID` | `43113` |
| `MOCK_AUTH` | `false` |
| `MOCK_STRAVA` | `true` |
| `MOCK_YIELD` | `true` |

> **Note on PORT:** Railway injects its own `PORT` env var. The backend already binds to `0.0.0.0` so this works out of the box. You can either set `PORT=3001` or use Railway's reference variable `${{PORT}}`.

### 6.4 Expose the service

1. In service settings → **Networking** → **Generate Domain**
2. You'll get a URL like `https://oria-backend-production.up.railway.app`
3. Use this as the `NEXT_PUBLIC_API_URL` on the frontend and as the `CORS_ORIGIN` on the backend (update both).

---

## 7. Deploy on Vercel — Frontend

### 7.1 Setup

1. Go to [vercel.com](https://vercel.com) → **Import Project → GitHub repo**
2. Select `lwi00/oria-app`
3. Set **Root Directory** to `frontend`
4. Framework preset: **Next.js** (auto-detected)

### 7.2 Build settings

Vercel auto-detects Next.js. Defaults are fine:

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Build Command** | `next build` (default) |
| **Output Directory** | `.next` (default) |

### 7.3 Environment variables

In Vercel → **Settings → Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://oria-backend-production.up.railway.app` *(from Railway § 6.4)* |
| `NEXT_PUBLIC_USE_MOCK` | `false` |
| `NEXT_PUBLIC_PRIVY_APP_ID` | *(from Privy dashboard)* |

### 7.4 Post-deploy

1. Copy your Vercel production URL (e.g. `https://oria-app.vercel.app`)
2. Go back to **Railway** and update `CORS_ORIGIN` to this URL
3. Go back to **Privy dashboard** and add this URL to **Allowed Origins** (§ 3.4)

---

## 8. Cross-Service Wiring Checklist

After all three services are up, verify these connections:

```
┌──────────────┐   NEXT_PUBLIC_API_URL    ┌──────────────┐   DATABASE_URL   ┌──────────────┐
│   Vercel     │ ───────────────────────> │   Railway    │ ──────────────> │  Supabase    │
│  (Frontend)  │                          │  (Backend)   │                 │  (Postgres)  │
│              │ <─── CORS_ORIGIN ─────── │              │                 │              │
└──────┬───────┘                          └──────┬───────┘                 └──────────────┘
       │                                         │
       │  NEXT_PUBLIC_PRIVY_APP_ID                │  PRIVY_APP_ID + PRIVY_APP_SECRET
       │                                         │
       └──────────────┐     ┌────────────────────┘
                      ▼     ▼
                ┌──────────────┐
                │    Privy     │
                │   (Auth)     │
                └──────────────┘
```

| Check | How to verify |
|-------|---------------|
| Frontend → Backend | Open browser console, trigger an API call, check no CORS errors |
| Backend → Supabase | Railway deploy logs should show `Server running on...` without DB errors |
| Frontend → Privy | Login flow should show Privy modal |
| Backend → Privy | Authenticated API calls should return user data (not 401) |
| Privy allowed origins | Login must not fail with "origin not allowed" |
| CORS_ORIGIN matches Vercel URL | No `Access-Control-Allow-Origin` errors in browser |

---

## 9. Run Database Migrations

After setting `DATABASE_URL` on Railway, the first deploy runs migrations automatically (via `prisma migrate deploy` in the start command). To run manually:

```bash
# From backend/ directory, with DATABASE_URL set to your Supabase connection string
npx prisma migrate deploy    # Apply migrations
npx prisma db seed           # Optional: seed demo data
```

---

## 10. Local Development Quick Start

```bash
# 1. Clone & install
git clone https://github.com/lwi00/oria-app.git
cd oria-app

# 2. Backend
cd backend
cp .env.example .env
# Edit .env → set DATABASE_URL to your local Postgres or Supabase
# Edit .env → set PRIVY_APP_ID and PRIVY_APP_SECRET from Privy dashboard
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev                  # → http://localhost:3001

# 3. Frontend (new terminal)
cd frontend
cp .env.local.example .env.local   # or create manually
# Set NEXT_PUBLIC_API_URL=http://localhost:3001
# Set NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
# Set NEXT_PUBLIC_USE_MOCK=false
npm install
npm run dev                  # → http://localhost:3000
```

---

## 11. Secrets Safety

| Rule | Detail |
|------|--------|
| Never commit `.env` or `.env.local` | Both are in `.gitignore` |
| `PRIVY_APP_SECRET` is backend-only | Never prefix with `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_*` vars are public | They're bundled into the client JS — only put non-sensitive values there |
| Rotate secrets if leaked | Privy dashboard → Settings → Regenerate secret |
| Supabase password | Rotatable in Project Settings → Database |
