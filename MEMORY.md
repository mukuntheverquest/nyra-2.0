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

---

## 2. Strict Design Invariants (Scroll-Craft & Light Grounds)

All frontend interfaces strictly adhere to the guidelines established in `docs/SCROLL_CRAFT_PLAN.md`:

1. **Strict White / Light Ground Rules:**
   * **Zero Dark Mode:** All `#000000`, `#0B0E14`, `#121620`, and `bg-slate-950` backgrounds are strictly forbidden.
   * **Primary Canvas:** `#FFFFFF` (Pure crisp white).
   * **Depth Planes:** `#F8FAFC` (Alabaster / ice-slate tint) and `#F1F5F9` (Muted architectural slate).
   * **Typography:** Charcoal navy `#0F172A` for headings (15.8:1 WCAG AAA contrast) and slate `#334155` / `#475569` for body copy (7.2:1 WCAG AA+ contrast).
   * **Brand Blue:** `#2177D1` (Nyra Blue), hover `#3A8EE0`, tint `#EFF6FF`.
   * **Semantic Badges:**
     * Scam / High Risk: `#DC2626` text on `#FEF2F2` background with `#FCA5A5` border.
     * Warning / Due Soon: `#D97706` text on `#FFFBEB` background with `#FDE68A` border.
     * Success / Paid: `#059669` text on `#ECFDF5` background with `#A7F3D0` border.
2. **Hard Refuse List:**
   * ❌ No chapter badges like `00 //`, `01 //`, `02 //`.
   * ❌ No `ScrambleText` or text-glitch animations on the brand wordmark (keep static: `Nyra 2.0`).
   * ❌ No cookie-cutter 3-card or 4-card generic bento grids.
   * ❌ No generic "Scroll to explore" badges.

---

## 3. Technology Stack & Key Libraries

### Backend (`backend/`)
* **Framework:** Python 3.14 + FastAPI + Uvicorn.
* **Database:** SQLite (`backend/db/nyra.db`) with automatic schema initialization and demo seed data.
* **AI Model:** Anthropic Claude Haiku 5.5 (with mock offline fallback engine).
* **Protocol Compiler:** `backend/a2ui/compiler.py` compiling deterministic A2UI v0.9 declarative JSON messages.
* **Testing:** `pytest` (14 comprehensive integration and unit tests in `backend/tests/test_harness.py`).

### Frontend (`frontend/`)
* **Framework:** Next.js 15.0.3 (App Router) + React 19 + TypeScript.
* **Styling:** Tailwind CSS 3.4.15 + PostCSS + Lucide React icons.
* **A2UI Packages:**
  * `@a2ui/react` (`^0.15.0`) — Provides `A2uiSurface`.
  * `@a2ui/web_core` (`^0.15.0`) — Provides `MessageProcessor` and `basicCatalog`.
* **Scroll Engine:** `scroll-craft` (`.agents/skills/scroll-craft/`).

---

## 4. Repository Structure & File Map

```text
nyra-2.0/
├── MEMORY.md                          <-- This continuity record
├── docs/
│   └── SCROLL_CRAFT_PLAN.md           <-- Authoritative light-theme design specifications
├── backend/
│   ├── main.py                        <-- FastAPI application & REST endpoints
│   ├── db/
│   │   ├── database.py                <-- SQLite connection & table creation
│   │   └── models.py                  <-- Pydantic request/response schemas
│   ├── engine/
│   │   ├── pii_scrubber.py            <-- Deterministic pre-LLM regex scrubber (SIN, cards)
│   │   ├── quota_guard.py             <-- 25-message free tier quota enforcement
│   │   ├── scam_rules.py              <-- MITRE F3 Canadian phishing detection
│   │   ├── ontario_calc.py            <-- 2026 Ontario/CRA statutory tax & rent formulas
│   │   ├── router.py                  <-- Skill router (bill_tracker, scam_shield, etc.)
│   │   ├── mock_engine.py             <-- Offline deterministic engine ($0 cost)
│   │   └── reminder_cron.py           <-- 9:00 AM EST batched SMS notification engine
│   ├── a2ui/
│   │   ├── catalog.py                 <-- v0.9 catalog definition URI
│   │   └── compiler.py                <-- Compiles 6 agent flow surfaces into v0.9 envelopes
│   └── tests/
│       └── test_harness.py            <-- 14 passing pytest test cases
├── frontend/
│   ├── next.config.mjs                <-- Configures outputFileTracingRoot for clean static asset resolution
│   ├── tailwind.config.js             <-- Light architectural design tokens & typography
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx             <-- Root layout with Google fonts and sc-ready class
│   │   │   ├── globals.css            <-- Pure white ground tokens & scrollbar styles
│   │   │   └── page.tsx               <-- Root page coordinating the 4-act scroll flow
│   │   └── components/
│   │       ├── Navbar.tsx             <-- Translucent frosted glass navbar with mode toggle
│   │       ├── BillsAndImpactCard.tsx <-- White HUD: streak, fees saved, bills table, trials table
│   │       ├── TelemetryCard.tsx      <-- White HUD: Haiku 5.5 token breakdown, cache rate & unit economics
│   │       ├── GuardrailLogCard.tsx   <-- White HUD: PII scrubbed indicators & tool traces
│   │       ├── A2UIWireInspector.tsx  <-- Collapsible inspector for createSurface/updateComponents envelopes
│   │       ├── SettingsModal.tsx      <-- B2B campus promo codes, 1-click cancel, PIPEDA/CASL modal
│   │       ├── a2ui/
│   │       │   └── A2UIMobileRuntime.tsx <-- Real @a2ui/react v0.9 mobile phone & 5 test chips
│   │       └── scroll/
│   │           ├── HeroAct.tsx        <-- Act 1: Layered White Editorial Hero
│   │           ├── InterceptAct.tsx   <-- Act 2: Deterministic Edge Intercept & Morph
│   │           ├── WorkspaceAct.tsx   <-- Act 3: The Engineered Peak (Mobile + Companion HUD)
│   │           └── AccessAct.tsx      <-- Act 4: Pricing, B2B codes, and 20% Youth Literacy
└── scrollcraft/
    └── shots/                         <-- Headless Playwright contact sheet & 39 verification frames
```

---

## 5. Critical Technical Decisions & Solved Pitfalls

### 1. Next.js 15 Lockfile Root Resolution (`outputFileTracingRoot`)
* **Problem:** Next.js 15 detected a stray `package-lock.json` in `C:\Users\venka\`, incorrectly assuming `C:\Users\venka\` was the project root. Consequently, requests to `/_next/static/css/...` failed with `HTTP 400 Bad Request`, causing the frontend to render as unstyled HTML in Chrome.
* **Solution:** Created `frontend/next.config.mjs` exporting:
  ```javascript
  import path from "node:path";
  import { fileURLToPath } from "node:url";
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  export default { outputFileTracingRoot: __dirname };
  ```
  This forces Next.js to isolate its asset root to `frontend/`.

### 2. `@a2ui/react` Web Component Node SSR Compatibility
* **Problem:** `@a2ui/react` extends `HTMLElement` (Web Components) inside its internal bundle. During Node.js SSR, this causes `ReferenceError: HTMLElement is not defined`.
* **Solution:** In `frontend/src/components/scroll/WorkspaceAct.tsx`, `A2UIMobileRuntime` is dynamically loaded with SSR disabled:
  ```typescript
  const A2UIMobileRuntime = dynamic(
    () => import("../a2ui/A2UIMobileRuntime").then((mod) => mod.A2UIMobileRuntime),
    { ssr: false }
  );
  ```

### 3. A2UI v0.9 Protocol Envelope Constraints
* **`version`:** Must be string `"v0.9"` (zod schema rejects `"0.9"` or `"1.0"`).
* **`Card` Component:** In v0.9 `basicCatalog`, `Card` takes a single string `child: "<id>"`, whereas `Column` and `Row` take an array `children: ["<id1>", "<id2>"]`.
* **`Button` Component:** Dispatches events structured as:
  ```json
  "action": {
    "event": {
      "name": "action_name",
      "context": { "key": "value" }
    }
  }
  ```
* **Bidirectional Updates at $0.00:** Button clicks (`mark_bill_paid`, `add_rent_as_bill`, `confirm_scam_blocked`) call `POST /api/a2ui/action`. The backend updates SQLite and returns `updateDataModel` messages that mutate the UI card in-place without touching an LLM.

---

## 6. How to Run, Test, and Verify

### A. Run Backend (FastAPI)
```bash
# From workspace root:
python -m uvicorn backend.main:app --port 8000
# Accessible at http://localhost:8000
# OpenAPI Docs: http://localhost:8000/docs
```

### B. Run Frontend (Next.js)
```bash
# Build production bundle:
cd frontend
npm run build

# Start production server on port 3000:
npm run start -- -p 3000
# (Or 'npm run dev' for development)
# Accessible at http://localhost:3000
```

### C. Run Backend Pytest Suite (14 Tests)
```bash
python -m pytest backend/tests/test_harness.py -v
```

### D. Run `scroll-craft` Headless Verification Pass
```bash
node .agents/skills/scroll-craft/scripts/shoot.mjs --url http://localhost:3000 --out scrollcraft/shots --steps 12
# Inspect contact sheet at scrollcraft/shots/sheet.png and audit report at scrollcraft/shots/report.json
```

---

## 7. Next Steps & Future Work

1. **Twilio SMS Webhook Integration:** Connect an incoming Twilio SMS endpoint to route incoming messages into `backend/main.py` -> `router.py` -> `pii_scrubber.py`.
2. **Cloud Deployment:**
   * Deploy `frontend/` to Vercel (link repository `mukuntheverquest/nyra-2.0`).
   * Deploy `backend/` to Railway, Render, or Fly.io with a persistent SQLite mount or Postgres database.
3. **Live Anthropic API Testing:** Set `ANTHROPIC_API_KEY` in environment variables to verify live production inference with Claude Haiku 5.5.
