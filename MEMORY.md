# MEMORY.md — Nyra 2.0 Project Continuity & Architecture Context

> **Purpose:** This file preserves the authoritative context, architectural decisions, invariants, operational commands, API contracts, deployment configurations, and technical history so that any future agent or engineer can pick up work seamlessly without regression.

---

## 1. Executive Summary & Brand Identity

* **Project:** Nyra 2.0 — Text-First Canadian Financial Guardrails & A2UI v0.9 Mobile Harness.
* **Organization:** Financial Futures Education (FFE) — Canadian non-profit dedicated to youth financial literacy.
* **Founders:** Sanya Bajaj & Aryan Kapur.
* **Official Website:** `https://www.nyra-app.ca/`
* **Live Render Deployment:** `https://nyra-2-0.onrender.com` (Render Service: `nyra-2.0`, `srv-dc1hnoutlv9c73c4tjb0`).
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
* **Framework:** Python 3.11 / 3.14 + FastAPI + Uvicorn.
* **Database:** SQLite (`backend/db/nyra.db`) with automatic schema initialization and demo seed data.
* **AI Model:** Anthropic Claude Haiku 5.5 (`claude-haiku-5-5`) with deterministic mock offline fallback engine (`backend/agent/mock_engine.py`).
* **Protocol Compiler:** `backend/a2ui/compiler.py` compiling deterministic A2UI v0.9 declarative JSON messages.
* **Testing:** `pytest` (17 comprehensive integration and unit tests in `backend/tests/test_harness.py`).

### Frontend (`frontend/`)
* **Framework:** Next.js 15.0.3 (App Router, `output: 'standalone'`) + React 19 + TypeScript.
* **Styling:** Tailwind CSS 3.4.15 + PostCSS + Lucide React icons.
* **3D Engine:** Pure `three` (`^0.187.0`) + `@types/three` (`RoundedBoxGeometry`).
* **A2UI Packages:**
  * `@a2ui/react` (`^0.15.0`) — Provides `A2uiSurface`.
  * `@a2ui/web_core` (`^0.15.0`) — Provides `MessageProcessor` and `basicCatalog`.
* **Scroll Engine:** Custom scroll-craft engine (`frontend/src/lib/scrollCraftEngine.tsx`) managing reactive hooks (`--sc-p`, `data-sc-tilt`, `data-sc-magnet`, `AnimatedNumber`).
* **Process Orchestration & Container:** Multi-stage `Dockerfile` with `scripts/start.py` running Next.js standalone on `$PORT` (default 10000) and FastAPI internal on port 8000 with Next.js reverse-proxy rewrites (`/api/:path*`).

---

## 4. Repository Structure & File Map

```text
nyra-2.0/
├── Dockerfile                         <-- Multi-stage production container (FastAPI + Next.js Standalone)
├── render.yaml                        <-- 1-click Render.com Blueprint specification
├── requirements.txt                   <-- Python dependencies (fastapi, uvicorn, pydantic, pytest)
├── MEMORY.md                          <-- This continuity record
├── scripts/
│   ├── start.py                       <-- Cross-platform Python production supervisor (FastAPI + Next.js)
│   └── start.sh                       <-- Legacy bash startup script
├── backend/
│   ├── main.py                        <-- FastAPI REST endpoints, A2UI action handler, outreach REST endpoints
│   ├── config.py                      <-- System configuration & OUTREACH_MODE ("sandbox" | "live")
│   ├── db/
│   │   ├── database.py                <-- SQLite connection, CRUD helpers & outreach queries
│   │   ├── schema.sql                 <-- Database schema (users, bills, trials, outreach leads & emails)
│   │   └── seed_demo.py               <-- Clean database initialization (0 dummy leads, 3 core bills)
│   ├── agent/
│   │   ├── email_sender.py            <-- Safe sandbox outbox dispatcher & optional live SMTP sender
│   │   ├── outreach_guard.py          <-- Deterministic CASL compliance validator
│   │   ├── pii_scrubber.py            <-- PIPEDA zero-trust regex scrubber (SIN, card numbers)
│   │   ├── quota_guard.py             <-- 25-message free tier quota enforcement & CASL STOP/START
│   │   ├── scam_rules.py              <-- MITRE F3 Canadian phishing detection
│   │   ├── ontario_calc.py            <-- 2026 Ontario/CRA statutory paycheque formulas
│   │   ├── router.py                  <-- 4-agent skill router (Bill Guard, Scam Shield, Money Coach, Outreach)
│   │   ├── tools.py                   <-- Deterministic tools (add_bill, mark_bill_paid, draft_outreach_email)
│   │   ├── mock_engine.py             <-- Offline deterministic engine ($0.00 cost)
│   │   └── system_prompt.md           <-- Authoritative prompt for Claude Haiku 5.5
│   ├── a2ui/
│   │   ├── catalog.py                 <-- Official v0.9 basic catalog URI
│   │   └── compiler.py                <-- Compiles declarative A2UI v0.9 JSON messages
│   ├── scheduler/
│   │   └── reminder_cron.py           <-- Batched 9:00 AM daily reminder digest runner
│   └── tests/
│       └── test_harness.py            <-- 17 passing pytest test cases
├── frontend/
│   ├── next.config.mjs                <-- Configures outputFileTracingRoot, output: 'standalone', and /api/:path* rewrites
│   ├── tailwind.config.js             <-- Light architectural design tokens & typography
│   ├── public/
│   │   └── .gitkeep                   <-- Preserves public directory for multi-stage Docker build
│   ├── src/
│   │   ├── lib/
│   │   │   └── scrollCraftEngine.tsx  <-- Scroll-craft reactive hooks (--sc-p, data-sc-tilt, AnimatedNumber)
│   │   ├── app/
│   │   │   ├── layout.tsx             <-- Root layout with Google fonts and sc-ready class
│   │   │   ├── globals.css            <-- Pure white ground tokens & scrollbar styles
│   │   │   └── page.tsx               <-- Root page coordinating 3D Hero, Simulator, and 4-Tier Dashboard
│   │   └── components/
│   │       ├── Navbar.tsx             <-- Translucent frosted glass navbar (fades in past 3D Hero)
│   │       ├── SettingsModal.tsx      <-- B2B campus promo codes, 1-click cancel, PIPEDA/CASL modal
│   │       ├── hero3d/
│   │       │   ├── dollarBlocks.ts    <-- 25-block modular procedural $ matrix (stem, curves, callout targets)
│   │       │   └── DollarSculptureStage.tsx <-- 400vh Three.js stage, 3-layer snowy alpine mountains, 4 callout cards
│   │       ├── a2ui/
│   │       │   └── A2UIMobileRuntime.tsx <-- Titanium iPhone mockup, dynamic island, real A2UI v0.9 cards
│   │       └── scroll/
│   │           ├── LiveSimulatorSection.tsx <-- Titanium iPhone Left + 5-Card Command Deck Right
│   │           ├── LiveDashboardSection.tsx <-- 4-Tier Kinetic Animated Dashboard with Live Owner Outreach Pipeline
│   │           └── AccessAct.tsx      <-- Pricing tiers & 20% Youth Literacy social covenant
└── scrollcraft/
    └── shots/                         <-- Headless Playwright contact sheet & full upgrade screenshots
```

---

## 5. Critical Technical Decisions & Solved Pitfalls

### 1. Separation of Concerns: Mobile Simulator vs. Owner Field
* **Domain Invariant:** The smartphone simulator represents a student's personal mobile device. Card #6 (*Youth Outreach & Email Agent*) was deliberately removed from the mobile simulator and command deck.
* **5 Core Student Scenarios:**
  1. `01` **Trial Kill-Switch:** Adobe Creative Cloud $34.99/mo trial with 48h advance warning.
  2. `02` **Canadian Scam Shield:** Fake Interac / OSAP refund caught by MITRE F3 rule.
  3. `03` **2026 Ontario Paycheque:** $18/hr, 20h/wk net take-home math vs. $850 rent.
  4. `04` **Zero-Trust PII Guardrail:** Client/edge regex scrub of SIN `123-456-789` before LLM ($0.00 cost).
  5. `05` **Mark Bill Paid + Streak:** Pay Rogers Phone ($55), auto-roll due date by 1 month, and advance streak. Formatted to span `md:col-span-2` cleanly across the bottom row.
* **Outreach Agent Belongs to Owner Dashboard:** The outreach capability is exclusively housed in Tier 4 of `LiveDashboardSection.tsx` (the owner-facing telemetry and operational dashboard).

### 2. Zero Dummy Data Invariant
* **Problem:** Hardcoded demo leads (`Jordan Patel`, `Priya Nair`, etc.) created clutter during real pitch presentations and made it impossible to test user input fields cleanly.
* **Solution:**
  * Purged all hardcoded leads and drafts from `backend/db/seed_demo.py`. The application starts with `0` prospective leads and `0` outbox emails.
  * Removed hardcoded fallback counters (`outreachLeads.length || 5`) from `LiveDashboardSection.tsx`.
  * Added an inline **"+ Add Campus Lead"** interactive form with validation for Name, Organization, Email, Reach Estimate, Segment, and CASL Consent type.
  * Added 1-tap **"Draft Email"** and 1-tap **"Approve & Send Email"** / **"Discard"** buttons with live state mutations.

### 3. Dockerfile & Render.com Production Orchestration
* **Multi-Stage Build:**
  * Stage 1 (`frontend-builder`): Node 20 alpine, runs `npm run build` using Next.js 15 `output: 'standalone'`.
  * Stage 2 (`production`): `python:3.11-slim` with Node.js runtime installed via official NodeSource GPG keyring.
* **Critical Build Fixes Applied:**
  * Installed `ca-certificates` before downloading NodeSource setup script.
  * Created `frontend/public/.gitkeep` and added `RUN mkdir -p public` in Dockerfile to prevent `COPY --from=frontend-builder /app/frontend/public ./frontend/public` exit code 1 failures.
  * Created `.dockerignore` excluding `.git`, `node_modules`, `.next`, `.venv`, and `__pycache__` to prevent Docker context ballooning.
  * Created `scripts/start.py`: Replaced bash script with Python supervisor that reads `$PORT` (default 10000), starts FastAPI on `127.0.0.1:8000`, starts Next.js standalone on `0.0.0.0:$PORT`, and cleanly forwards OS signals.
* **Low Memory Footprint:** Next.js standalone runs at ~120 MB RAM; FastAPI runs at ~60 MB RAM. Combined ~180 MB is well below Render's 512 MB free tier ceiling.

### 4. Next.js 15 Lockfile Root Resolution (`outputFileTracingRoot`)
* **Problem:** Next.js 15 detected a stray `package-lock.json` in user home directory, causing static CSS chunk 400 errors.
* **Solution:** Explicitly configured `outputFileTracingRoot: __dirname` in `frontend/next.config.mjs`.

### 5. Full-Stack Single-Origin Reverse Proxy Rewrites
* **Problem:** Cross-origin CORS errors or mixed-content HTTPS/HTTP issues when deployed publicly.
* **Solution:** Configured Next.js rewrites in `frontend/next.config.mjs` routing `/api/:path*` to `BACKEND_INTERNAL_URL || http://127.0.0.1:8000`. Frontend code uses relative URLs (`API_BASE = ""`), eliminating CORS overhead.

### 6. A2UI v0.9 Schema Compatibility
* **`Button` variant constraint:** In `@a2ui/web_core/v0_9/basic_catalog`, `Button` schema strictly allows `'default' | 'primary' | 'borderless'` (zod throws validation error on `'secondary'`). Discard button uses `'default'`.
* **`Card` component constraint:** Takes single string `child: "<id>"`, while `Column` / `Row` take `children: [...]`.
* **Bidirectional 1-Tap Execution at $0.00:** Button clicks (`approve_send_outreach_email`, `mark_bill_paid`) mutate SQLite in-place, dispatch emails via the safe sandbox dispatcher, and emit `updateDataModel` without LLM costs.

### 7. 3D Procedural Alpine Hero & 60 FPS Ref Architecture
* **Two-Tone Dollar Sculpture:** Deep Nyra Blue PBR stem blocks (`#2177D1`) + Frosted Alpine White S-curve blocks with glowing `#3B82F6` bevel edges.
* **3-Layer Procedural Mountain Landscape:** Snowy alpine ridges generated with vertex noise displacement and mouse parallax.
* **4 Bold HTML Callout Cards:** Direct 2D DOM projection with SVG leader lines (`01 BILL GUARD`, `02 SCAM SHIELD`, `03 PII ZERO`, `04 20% IMPACT`).
* **Zero setState inside RAF:** Camera choreography and transforms mutate DOM refs directly, guaranteeing rock-solid 60 FPS.

---

## 6. Complete REST API Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | System health, organization, protocol version, and demo user info |
| `GET` | `/api/state` | Returns aggregated state: user, bills, trials, telemetry, scam logs, messages, outreach leads & emails |
| `POST` | `/api/chat` | Send message to agent (`{message, user_id, mode: "live" \| "mock"}`); returns reply, skill_tag, A2UI messages |
| `POST` | `/api/a2ui/action` | Execute A2UI action (`mark_bill_paid`, `add_rent_as_bill`, `approve_send_outreach_email`, etc.) at $0.00 |
| `GET` | `/api/a2ui/catalog` | Returns A2UI basic catalog ID and whitelisted component list |
| `POST` | `/api/outreach/lead` | Create prospective campus lead (`{name, email, organization, segment, casl_consent_type, youth_reach_est, notes}`) |
| `DELETE`| `/api/outreach/lead/{id}` | Delete prospective campus lead by ID |
| `POST` | `/api/outreach/draft-for-lead` | Drafts a personalized CASL-compliant email for specified lead ID and updates status to `contacted` |
| `POST` | `/api/outreach/email/action` | 1-tap action on outbox email (`{email_id, action: "approve_send" \| "discard"}`) |
| `POST` | `/api/settings` | Update user settings (`plan_tier`, `org_code`, `sms_active`, `weekly_tip_opt_in`) |
| `POST` | `/api/demo/reset` | Resets SQLite database to clean seed state (3 bills, 0 leads, 0 emails) |
| `POST` | `/api/demo/trigger-cron` | Simulates 9:00 AM daily batched reminder digest |
| `POST` | `/webhook/twilio` | Twilio SMS webhook handling incoming SMS messages |

---

## 7. How to Run, Test, and Verify

### A. Run Backend (FastAPI)
```powershell
python -m uvicorn backend.main:app --port 8000
# OpenAPI Docs: http://localhost:8000/docs
```

### B. Run Frontend (Next.js)
```powershell
cd frontend
npm run build
npm run start -- -p 3000
# Accessible at http://localhost:3000
```

### C. Run Full Test Suite (17 Passing Tests)
```powershell
python -m pytest -v
```

All 17 test cases cover:
1. `test_past_due_date_auto_roll`: Past due dates automatically advance to next month upon payment.
2. `test_trial_killswitch_48hr_alert`: 48h advance warning triggers cancellation alert.
3. `test_credit_card_statement_and_due_dates`: Statement closing day and payment due day calculations.
4. `test_canadian_scam_shield_high_risk_interac_osap`: High-risk phishing detection catches fake Interac refund texts.
5. `test_ontario_2026_paycheque_and_rent_math`: CRA/Ontario statutory minimum wage take-home calculation.
6. `test_pii_scrubber_blocks_sin_and_card_before_llm`: Client/edge regex blocks SIN and credit card numbers before LLM.
7. `test_non_advisory_stock_picking_refusal`: Refuses illegal financial investment advice.
8. `test_quota_cap_26th_message_blocks_coach_allows_bill_guard`: Quota enforcement blocks money coach but allows bill guard.
9. `test_casl_stop_and_start_zero_tokens`: Standard Canadian SMS STOP / START commands handled at 0 tokens.
10. `test_sms_digest_batches_multiple_bills_into_one_text`: 9:00 AM daily digest batches multiple bills into one text.
11. `test_a2ui_v09_chat_emits_create_update_components_and_data_model`: Emits declarative A2UI JSON envelope.
12. `test_a2ui_v09_bidirectional_mark_paid_mutates_db_at_zero_llm_cost`: Mark paid action mutates DB with zero LLM tokens.
13. `test_a2ui_v09_add_rent_as_bill_action_creates_bill_at_zero_llm_cost`: Add rent action creates bill at zero LLM cost.
14. `test_a2ui_v09_pii_block_emits_security_surface_without_llm_call`: PII block emits security surface without touching LLM.
15. `test_outreach_agent_drafts_casl_compliant_email_without_auto_sending`: CASL outreach agent creates draft without sending.
16. `test_a2ui_v09_approve_send_outreach_email_dispatches_at_zero_llm_cost`: Human approval dispatches email at $0.00 AI cost.
17. `test_outreach_sandbox_prevents_unapproved_external_smtp_send`: Sandbox mode prevents accidental live SMTP sending.

---

## 8. Deployment Architecture (Render.com)

* **Live URL:** `https://nyra-2-0.onrender.com`
* **Render Service ID:** `srv-dc1hnoutlv9c73c4tjb0` (`nyra-2.0`)
* **Environment:** Docker (`python:3.11-slim` + Node.js 20)
* **Configuration:** `render.yaml`
  * Plan: Free
  * Auto Deploy: Yes (or Manual Deploy via Render Dashboard)
  * Port: 10000 (exposed to public web)
* **Manual Deploy Workflow:**
  1. Push changes to GitHub: `git push origin main`.
  2. Open [Render Dashboard](https://dashboard.render.com/web/srv-dc1hnoutlv9c73c4tjb0).
  3. Click **"Manual Deploy"** &rarr; **"Deploy latest commit"**.
