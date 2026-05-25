# ORIA MVP — Missing Frontend Elements

## Context
This document lists every frontend element that is specified in the design system (`docs/ORIA_Design_System.md`), mockups (`mockups/OriaAppMock.jsx`, `mockups/OriaLanding.jsx`), or architecture docs — but is **not covered** by the current implementation plan (`tasks/todo.md`).

---

## 1. Full Screens / Flows Missing

### 1.1 Landing Page
- **Source:** `mockups/OriaLanding.jsx` (348 lines), Design System S8.2
- **What exists:** A complete mockup with nav bar, hero section + animated jar, stats strip, 6 feature cards with scroll-reveal, 3-step "how it works", APY bar chart, email CTA, footer
- **What's in the plan:** Nothing. No phase or task mentions the landing page.
- **Needed:** Nav bar, hero with SavingsJar, feature cards grid (3-col at 768px+), step components, APY visualization, CTA with email input, footer. Responsive layout (max-width 1080px).

### 1.2 Onboarding Flow (4 screens)
- **Source:** Design System S11.1
- **What exists:** Screen tree defines: Welcome (logo + tagline) -> Connect Wallet (Privy) -> Choose Goal (type + target km) -> Fund Wallet (deposit USDC/AVAX)
- **What's in the plan:** Phase 8 has "Privy login/signup flow" then "sees empty dashboard" — no onboarding screens between login and dashboard.
- **Needed:** Welcome screen, goal selection screen (running/cycling/steps radio + km slider/input), initial deposit prompt. Without this, `user.goalType` and `user.targetKm` are never set.

### 1.3 Activity Logging UI
- **Source:** Backend has `POST /api/activities`, Strava is mocked
- **What's in the plan:** Phase 9 covers displaying the "Weekly Progress Card" but no input UI to log activity
- **Needed:** Manual km entry form/modal (distance input, source selector). This is the **only way** users can interact with the core loop since Strava is mocked.

### 1.4 Friend Request UI
- **Source:** Backend Phase 4 has full friend lifecycle (request, accept, reject, remove)
- **What's in the plan:** Phase 10 only covers leaderboard display + activity feed display
- **Needed:** Send friend request flow (user search/invite), pending requests list, accept/reject buttons, remove friend action. Without this, the social tab is read-only.

### 1.5 Profile Editing UI
- **Source:** Backend `PATCH /api/users/me` (Phase 2), Design System S11.1 mentions Settings
- **What's in the plan:** No frontend task for editing profile
- **Needed:** Profile screen or modal to edit displayName, avatarUrl, goalType, targetKm. At minimum accessible from header avatar tap.

### 1.6 Withdraw Flow
- **Source:** `OriaAppMock.jsx:318` — Wallet tab has both "Deposit" and "Withdraw" buttons
- **What's in the plan:** Phase 12 covers deposit flow only
- **Needed:** Withdraw amount input, token selector, confirmation (even if mocked/disabled for MVP)

---

## 2. Reusable Components Missing from Plan

### 2.1 Savings Jar SVG Component
- **Source:** Design System S5.8, `OriaAppMock.jsx:79-100` (MiniJar), `OriaLanding.jsx:18-54` (full SavingsJar)
- **Spec:** Jar outline with `rgba(124,58,237,0.06)` fill, `0.15` stroke. Liquid uses gradient jar (dark bottom to light top) with clip-path. Surface ellipse on top of liquid. Glass reflet line. Lid rectangle. Animated fill with `1.5-1.8s cubic-bezier(0.34, 1.56, 0.64, 1)`.
- **Two sizes:** 240x320 (landing/hero) and 100x140 (dashboard card)
- **Plan says:** "savings jar illustration" — doesn't specify building the SVG component

### 2.2 Card Component (Glassmorphism)
- **Source:** Design System S5.1, `OriaAppMock.jsx:52-58`
- **Spec:** `background: rgba(255,255,255,0.85)`, `border-radius: 20px`, `border: 1px solid rgba(196,181,253,0.2)`, `backdrop-filter: blur(12px)`, `box-shadow: 0 2px 12px rgba(0,0,0,0.03)`. Hero variant uses gradient surface background. Hover state: translateY(-4px), shadow intensified, border color change.
- **Plan says:** No task for building this foundational component

### 2.3 Avatar Component
- **Source:** Design System S5.3, `OriaAppMock.jsx:41-50`
- **Spec:** Circle with initials. Default variant: lavender gradient, purple text. Highlight variant: brand gradient, white text, avatar shadow. 4 sizes: 28px (stacked), 32px (feed), 34px (leaderboard), 36px (feed extended).
- **Plan says:** No explicit task

### 2.4 Progress Ring SVG
- **Source:** Design System S5.7, `OriaAppMock.jsx:60-77`
- **Spec:** SVG circle, 64-80px, stroke 5-6px. Track: `purple-100`. Fill: `purple-600`, `stroke-linecap: round`. Animation: `stroke-dashoffset` with bounce easing `cubic-bezier(0.34, 1.56, 0.64, 1)`. Center content (percentage) positioned absolute.
- **Plan says:** "progress ring" mentioned but no SVG build task

### 2.5 Week Dots Component
- **Source:** Design System S5.6, `OriaAppMock.jsx:102-124`
- **Spec:** 7 circles (28px, gap 6px) for M-T-W-T-F-S-S. Three states: completed (brand gradient, white check, shadow), missed (error-100 bg, error-500 x), upcoming (purple-100, dashed border, muted dot). Day label below in mono 10px.
- **Plan says:** "Week dots row" is mentioned in Phase 9 — partially covered but component build not explicit

### 2.6 Progress Bar Component
- **Source:** Design System S5.5
- **Spec:** 8px height, border-radius 4px. Empty: `purple-100`. Filled: horizontal brand gradient. Transition: `width 1s ease`. Must have accompanying text label.
- **Plan says:** Not explicitly tasked as a reusable component

### 2.7 Input Component
- **Source:** Design System S5.10
- **Spec:** `border-radius: 12px`, `border: 1px solid rgba(196,181,253,0.4)`, `background: rgba(255,255,255,0.8)`, `padding: 13px 20px`, Inter 15px. Focus: `border-color: #7c3aed`. Placeholder: `text-muted`.
- **Plan says:** No task. Needed for: challenge creation form, deposit flow, activity logging, profile editing, landing page email CTA.

### 2.8 Badge & Tag Components
- **Source:** Design System S5.4
- **Spec:** Streak badge (brand gradient, 52px circle, white text). Status tags ("Active"/"Mocked": rounded, semantic background). Counter tags ("4/6": radius-8, purple-100 bg, purple-600 text, mono font).
- **Plan says:** Not explicitly tasked

---

## 3. Design Foundation Missing from Plan

### 3.1 CSS Design Token System
- **Source:** Design System S10 — complete `:root` block with 50+ CSS custom properties
- **What's needed:** All colors (8 purples, 5 surfaces, 4 texts, 3 borders, 6 semantics), 3 gradients, 9 spacings, 6 radii, 5 shadows, 2 easing curves, 4 transitions
- **Plan says:** Phase 0 mentions "set up Tailwind config with ORIA design tokens" — this covers Tailwind but not the CSS custom properties. Both are needed.

### 3.2 Background Gradient Blobs
- **Source:** Design System S3.3, `OriaAppMock.jsx:418-421`, `OriaLanding.jsx:57-63`
- **Spec:** 2-3 fixed-position radial-gradient blobs, `purple-300` to `purple-200`, 15-30% opacity, `filter: blur(30-50px)`, `pointer-events: none`. They provide depth without distracting.
- **Plan says:** Not covered

### 3.3 PWA Configuration
- **Source:** Design System S12.3
- **What's needed:**
  - `manifest.json` with `theme_color: #7c3aed`, `background_color: #faf9ff`
  - Favicon: 512x512 gradient square with white "O"
  - `env(safe-area-inset-bottom)` padding on tab bar (S8.3)
- **Plan says:** Nothing about PWA, manifest, favicon, or safe area

### 3.4 Font Setup Details
- **Source:** Design System S2
- **What's needed beyond what's in the plan:**
  - 11 typography tokens (`display-xl` through `overline`) with specific sizes, weights, line-heights, letter-spacings
  - `font-variant-numeric: tabular-nums` utility class for all financial data
  - 65-char max line width for body text
  - APY always displayed with 2 decimal places
- **Plan says:** Phase 0 has "configure Inter font" and Phase 13 has "tabular-nums". Typography tokens not explicitly set up.

---

## 4. Animations & Micro-interactions Missing

### 4.1 Scroll-Reveal Animation
- **Source:** Design System S6.3, used extensively in `OriaLanding.jsx` (FeatureCard, Step components)
- **Spec:** `opacity: 0 -> 1`, `translateY(24px) -> 0`, via IntersectionObserver, 500ms duration, staggered 100-150ms delay between sibling elements
- **Plan says:** Phase 13 vaguely mentions polish but no specific scroll-reveal task

### 4.2 Jar Fill Animation
- **Source:** Design System S5.8, S6.3
- **Spec:** Animate `y` and `height` of SVG rect, 1.8s duration, `cubic-bezier(0.34, 1.56, 0.64, 1)` bounce easing. Surface ellipse animates in sync.
- **Plan says:** Not tasked

### 4.3 Button Lift Effect
- **Source:** Design System S6.3, `OriaLanding.jsx:168-174`
- **Spec:** On hover: `translateY(-2px)`, shadow intensifies from `shadow-button` to `shadow-button-hover`
- **Plan says:** Not tasked

### 4.4 Pulse Animation (Testnet Badge)
- **Source:** Design System S6.3, `OriaLanding.jsx:141`
- **Spec:** `@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.5 } }` on 2s loop, used for the green "live" dot
- **Plan says:** Not covered

### 4.5 Card Hover Effects
- **Source:** Design System S5.1
- **Spec:** On hover (when clickable): `background: rgba(255,255,255,0.95)`, `border-color: rgba(167,139,250,0.3)`, `box-shadow: 0 12px 40px rgba(124,58,237,0.1)`, `transform: translateY(-4px)`
- **Plan says:** Not covered

---

## 5. Specific UI Elements Missing from Individual Tabs

### 5.1 Dashboard (Phase 9)
- **Missing:** "See all ->" link on Friends Activity preview (navigates to Social tab)
- **Missing:** "via Strava" / data source label on Weekly Progress card (`OriaAppMock.jsx:165`)

### 5.2 Social Tab (Phase 10)
- **Missing:** Add friend button or user search
- **Missing:** Pending friend requests section
- **Missing:** Empty state when no friends

### 5.3 Challenges Tab (Phase 11)
- **Missing:** Challenge detail view is marked "optional" but the mockup's member count badge (`4/6`) implies a detail view with member list
- **Missing:** Challenge description field in creation form
- **Missing:** Stacked avatar overflow indicator (`+N` circle, `OriaAppMock.jsx:296-298`)

### 5.4 Wallet Tab (Phase 12)
- **Missing:** Transaction type icons (deposit "down arrow" in purple-100 square, yield "star" — `OriaAppMock.jsx:354`)
- **Missing:** Token amount formatting with token symbol ("+500 USDC" not just "$500")

### 5.5 Header (`OriaAppMock.jsx:423-440`)
- **Missing:** Notification bell with red indicator dot — plan says "bell icon" but there's no notification system backing it (no model, no API, no UI)

---

## 6. Frontend Infrastructure Missing

### 6.1 State Management
- No task for choosing/setting up state management (React Context, Zustand, TanStack Query)
- No task for data fetching patterns (SWR, React Query, or plain fetch)
- No task for client-side caching/revalidation strategy

### 6.2 API Client
- Phase 8 mentions "API client: fetch wrapper with auth headers, error handling" as one bullet — this is a significant piece of infrastructure that deserves its own focused task covering: base URL config, auth header injection from Privy, error parsing, typed response helpers

### 6.3 Frontend Environment Config
- No `.env.example` for frontend (needs `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_PRIVY_APP_ID`, `NEXT_PUBLIC_AVAX_RPC_URL`, `NEXT_PUBLIC_CHAIN_ID`)
- No task for environment variable setup in Next.js

### 6.4 Linting & Formatting
- Phase 0 sets up ESLint/Prettier for backend only
- No frontend linting/formatting configuration

---

## Summary: Priority-Ordered List

| Priority | Element | Why |
|----------|---------|-----|
| P0 | Activity Logging UI | Core loop is broken without it (manual entry is the only input method) |
| P0 | Onboarding Flow | User can't set goalType/targetKm, dashboard data is meaningless |
| P0 | CSS Token System | Foundation for every component |
| P1 | Landing Page | Entry point to the app, 348-line mockup ready to implement |
| P1 | Friend Request UI | Social tab is read-only without it |
| P1 | Savings Jar SVG | Central brand element, used on dashboard + landing |
| P1 | Card Component | Used by every single screen |
| P1 | Avatar Component | Used by feed, leaderboard, challenges, header |
| P1 | Input Component | Needed by 4+ features (activity, challenge, deposit, profile) |
| P2 | Profile Editing UI | Users need to change goals/name |
| P2 | Progress Ring SVG | Dashboard core element |
| P2 | Badge/Tag Components | Used across all tabs |
| P2 | Background Blobs | Design signature element |
| P2 | PWA Config | manifest, favicon, safe-area |
| P2 | State Management Setup | Needed before wiring any API data |
| P3 | Scroll-Reveal Animation | Landing page & polish |
| P3 | Jar Fill Animation | Gamification feel |
| P3 | Button Hover Effects | Polish |
| P3 | Withdraw Flow | Mockup shows it but can be disabled for MVP |
| P3 | Notification System | No backend support, can be cosmetic only |
