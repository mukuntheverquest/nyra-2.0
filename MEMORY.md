# MEMORY.md — Nyra 2.0 Project Continuity & Architecture Context

> **Purpose:** This file preserves the authoritative context, architectural decisions, invariants, operational commands, and technical debt log so that any future agent or engineer can pick up work seamlessly without regression.

---

## 1. Executive Summary & Brand Identity

* **Project:** Nyra 2.0 — Text-First Canadian Financial Guardrails & A2UI v0.9 Mobile Harness.
* **Organization:** Financial Futures Education (FFE) — Canadian non-profit dedicated to youth financial literacy.
* **Founders:** Sanya Bajaj & Aryan Kapur.
* **Official Website:** `https://www.nyra-app.ca/`
* **GitHub Repository:** `https://github.com/mukuntheverquest/nyra-2.0.git` (Default Branch: `main`).
* **Core Value Proposition:**
  1. **Zero Bank Linking (PIPEDA Compliant):** Users never link bank accounts or share login credentials; bills and reminders are tracked via conversational SMS.
  2. **Automated Free Trial Kill-Switches:** Alerts users 48 hours prior to charges with an instant 1-tap cancellation workflow.
  3. **Canadian Scam Shield (MITRE F3):** Deterministic pattern matching against CRA, Interac, and OSAP phishing lures.
  4. **The 20% Social Covenant:** 20% of net profits from $5/mo and $45/yr subscriptions fund free financial literacy seminars for Ontario students.
  5. **4th Agent — Youth Outreach & Email Agent:** Semi-autonomous, CASL-compliant campus lead discovery and email drafting with deterministic 1-tap owner dispatch at $0.00.

---

## 2. Strict Design Invariants (Scroll-Craft & Light Grounds)

All frontend interfaces strictly adhere to the guidelines established in `docs/SCROLL_CRAFT_PLAN.md`:

1. **Strict White / Light Ground Rules:**
   * **Zero Dark Mode:** All dark backgrounds (`#000000`, `#0B0E14`, `#121620`, and `bg-slate-950`) are strictly forbidden.
   * **Primary Canvas:** `#FFFFFF` (Pure crisp white).
   * **Depth Planes:** `#F8FAFC` (Alabaster / ice-slate tint) and `#F1F5F9` (Muted architectural slate).
   * **Typography:** Charcoal navy `#0F172A` for headings (15.8:1 WCAG AAA contrast) and slate `#334155` / `#475569` for body copy (7.2:1 WCAG AA+ contrast).
   * **Brand Blue:** `#2177D1` (Nyra Blue), hover `#3A8EE0`, tint `#EFF6FF`.
   * **Semantic Badges:**
     * Scam / High Risk: `#DC2626` text on `#FEF2F2` background with `#FCA5A5` border.
     * Warning / Due Soon: `#D97706` text on `#FFFBEB` background with `#FDE68A` border.
     * Success / Paid: `#059669` text on `#ECFDF5` background with `#A7F3D0` border.
2. **Hard Refuse List:**
   * ❌ No chapter badges like `00 //`, `01 //`, `02 //` or `"ACT 3: THE ENGINEERED PEAK..."`.
   * ❌ No `ScrambleText` or text-glitch animations on the brand wordmark (keep static: `NYRA 2.0`).
   * ❌ No cookie-cutter 3-card or 4-card generic bento grids.
   * ❌ No generic "Scroll to explore" badges.

---

## 3. Technology Stack & Key Libraries

### Backend (`backend/`)
* **Framework:** Python 3.14 + FastAPI + Uvicorn.
* **Database:** SQLite (`backend/db/nyra.db`) with automatic schema initialization and demo seed data.
* **AI Model:** Anthropic Claude Haiku 5.5 (with mock offline fallback engine).
* **Protocol Compiler:** `backend/a2ui/compiler.py` compiling deterministic A2UI v0.9 declarative JSON messages.
* **Testing:** `pytest` (17 comprehensive integration and unit tests in `backend/tests/test_harness.py`).

### Frontend (`frontend/`)
* **Framework:** Next.js 15.0.3 (App Router) + React 19 + TypeScript.
* **Styling:** Tailwind CSS 3.4.15 + PostCSS + Lucide React icons.
* **3D Engine:** Pure `three` (`^0.187.0`) + `@types/three` (`RoundedBoxGeometry`).
* **A2UI Packages:**
  * `@a2ui/react` (`^0.15.0`) — Provides `A2uiSurface`.
  * `@a2ui/web_core` (`^0.15.0`) — Provides `MessageProcessor` and `basicCatalog`.
* **Scroll Engine:** `scroll-craft` (`.agents/skills/scroll-craft/`) + custom `scrollCraftEngine.tsx`.
* **Container & Deployment:** Multi-stage `Dockerfile`, `render.yaml`, and Next.js reverse-proxy rewrites for unified free hosting on Render.com, Vercel, or Railway.

---

## 4. Repository Structure & File Map

```text
nyra-2.0/
├── Dockerfile                         <-- Multi-stage production container (FastAPI + Next.js)
├── render.yaml                        <-- 1-click Render.com Blueprint specification
├── requirements.txt                   <-- Python dependencies (fastapi, uvicorn, pydantic, pytest)
├── MEMORY.md                          <-- This continuity record
├── scripts/
│   └── start.sh                       <-- Production startup script running backend & frontend
├── backend/
│   ├── main.py                        <-- FastAPI REST endpoints, A2UI action handler, state aggregator
│   ├── db/
│   │   ├── database.py                <-- SQLite connection, CRUD helpers & outreach queries
│   │   ├── schema.sql                 <-- Database schema (users, bills, trials, outreach leads & emails)
│   │   └── seed_demo.py               <-- Pre-seeds 5 realistic Ontario campus leads & demo bills
│   ├── agent/
│   │   ├── email_sender.py            <-- Safe sandbox outbox dispatcher & optional SMTP sender
│   │   ├── outreach_guard.py          <-- Deterministic CASL compliance validator
│   │   ├── pii_scrubber.py            <-- PIPEDA zero-trust regex scrubber (SIN, card numbers)
│   │   ├── quota_guard.py             <-- 25-message free tier quota enforcement
│   │   ├── scam_rules.py              <-- MITRE F3 Canadian phishing detection
│   │   ├── ontario_calc.py            <-- 2026 Ontario/CRA statutory paycheque formulas
│   │   ├── router.py                  <-- 4-agent skill router (Bill Guard, Scam Shield, Money Coach, Outreach)
│   │   ├── tools.py                   <-- Tool definitions (including outreach leads & email drafting)
│   │   ├── mock_engine.py             <-- Offline deterministic engine ($0.00 cost)
│   │   └── system_prompt.md           <-- Authoritative prompt for Claude Haiku 5.5
│   ├── a2ui/
│   │   ├── catalog.py                 <-- Official v0.9 basic catalog URI
│   │   └── compiler.py                <-- Compiles 7 declarative A2UI v0.9 surfaces (Surface 7: Outreach Draft)
│   └── tests/
│       └── test_harness.py            <-- 17 passing pytest test cases
├── frontend/
│   ├── next.config.mjs                <-- Configures outputFileTracingRoot and /api/:path* reverse proxy rewrite
│   ├── tailwind.config.js             <-- Light architectural design tokens & typography
│   ├── src/
│   │   ├── lib/
│   │   │   └── scrollCraftEngine.tsx  <-- Scroll-craft reactive hooks (--sc-p, data-sc-tilt, AnimatedNumber)
│   │   ├── app/
│   │   │   ├── layout.tsx             <-- Root layout with Google fonts and sc-ready class
│   │   │   ├── globals.css            <-- Pure white ground tokens & scrollbar styles
│   │   │   └── page.tsx               <-- Root page coordinating 3D Hero, Simulator, and 4-Tier Dashboard
│   │   └── components/
│   │       ├── Navbar.tsx             <-- Translucent frosted glass navbar (hidden in 3D Hero)
│   │       ├── SettingsModal.tsx      <-- B2B campus promo codes, 1-click cancel, PIPEDA/CASL modal
│   │       ├── hero3d/
│   │       │   ├── dollarBlocks.ts    <-- 25-block modular procedural $ matrix (stem, curves, callout targets)
│   │       │   └── DollarSculptureStage.tsx <-- 400vh Three.js stage, 3-layer snowy alpine mountains, 4 callout cards
│   │       ├── a2ui/
│   │       │   └── A2UIMobileRuntime.tsx <-- Titanium iPhone mockup, dynamic island, real A2UI v0.9 cards
│   │       └── scroll/
│   │           ├── LiveSimulatorSection.tsx <-- Titanium iPhone Left + 6-Card Command Deck Right
│   │           ├── LiveDashboardSection.tsx <-- 4-Tier Kinetic Animated Dashboard
│   │           └── AccessAct.tsx      <-- Pricing tiers & 20% Youth Literacy social covenant
└── scrollcraft/
    └── shots/                         <-- Headless Playwright contact sheet & full upgrade screenshots
```

---

## 5. Critical Technical Decisions & Solved Pitfalls

### 1. Next.js 15 Lockfile Root Resolution (`outputFileTracingRoot`)
* **Problem:** Next.js 15 detected a stray `package-lock.json` in `C:\Users\venka\`, incorrectly assuming `C:\Users\venka\` was the project root. Consequently, requests to `/_next/static/css/...` failed with `HTTP 400 Bad Request`, causing the frontend to render as unstyled HTML in Chrome.
* **Solution:** Configured `outputFileTracingRoot: __dirname` in `frontend/next.config.mjs`.

### 2. Full-Stack Single-Origin Reverse Proxy Rewrites
* **Problem:** Cross-origin CORS errors or mixed-content HTTPS/HTTP issues when deployed publicly or tested across ports 3000 and 8000.
* **Solution:** Configured Next.js rewrites in `frontend/next.config.mjs` routing `/api/:path*` to `BACKEND_INTERNAL_URL || http://127.0.0.1:8000`. Frontend code uses relative URLs (`API_BASE = ""`), eliminating CORS overhead.

### 3. A2UI v0.9 Schema Compatibility
* **`Button` variant constraint:** In `@a2ui/web_core/v0_9/basic_catalog`, `Button` schema strictly allows `'default' | 'primary' | 'borderless'` (zod throws validation error on `'secondary'`). Discard button uses `'default'`.
* **`Card` component constraint:** Takes single string `child: "<id>"`, while `Column` / `Row` take `children: [...]`.
* **Bidirectional 1-Tap Execution at $0.00:** Button clicks (`approve_send_outreach_email`, `mark_bill_paid`) mutate SQLite in-place, dispatch emails via the safe sandbox dispatcher, and emit `updateDataModel` without LLM costs.

### 4. 3D Procedural Alpine Hero & 60 FPS Ref Architecture
* **Two-Tone Dollar Sculpture:** Deep Nyra Blue PBR stem blocks (`#2177D1`) + Frosted Alpine White S-curve blocks with glowing `#3B82F6` bevel edges.
* **3-Layer Procedural Mountain Landscape:** Snowy alpine ridges generated with vertex noise displacement and mouse parallax.
* **4 Bold HTML Callout Cards:** Direct 2D DOM projection with SVG leader lines (`01 BILL GUARD`, `02 SCAM SHIELD`, `03 PII ZERO`, `04 20% IMPACT`).
* **Zero setState inside RAF:** Camera choreography and transforms mutate DOM refs directly, guaranteeing rock-solid 60 FPS.

---

## 6. How to Run, Test, and Verify

### A. Run Backend (FastAPI)
```bash
python -m uvicorn backend.main:app --port 8000
# OpenAPI Docs: http://localhost:8000/docs
```

### B. Run Frontend (Next.js)
```bash
cd frontend
npm run build
npm run start -- -p 3000
# Accessible at http://localhost:3000
```

### C. Run Pytest Suite (17 Tests)
```bash
python -m pytest -v
```

### D. Run Playwright End-to-End Verification
```bash
node scratch/verify_full_upgrade.mjs
# Screenshots saved in scrollcraft/shots/full_upgrade/
```

---

## 7. Public Cloud Deployment (Render.com)

1. **Connect GitHub Repository:** Link `https://github.com/mukuntheverquest/nyra-2.0.git` on [Render.com](https://dashboard.render.com/).
2. **Select Blueprint:** Render will auto-detect `render.yaml` and configure the unified Web Service using the multi-stage `Dockerfile`.
3. **Environment Variables:** Set `OUTREACH_MODE=sandbox` (or `live` with SMTP credentials if external sending is desired).
4. **Deploy:** Render builds both Next.js and FastAPI into a single container running Next.js on port 10000 with FastAPI internal on 8000. All features, 3D graphics, simulator, and dashboard run live out of the box!
