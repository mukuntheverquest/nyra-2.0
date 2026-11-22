# NYRA 2.0 — COMPLETE ANTIGRAVITY SETUP & AI AGENT HARNESS BUILD GUIDE

**Target Organization:** Financial Futures Education (FFE) — Co-founders Sanya Bajaj & Aryan Kapur  
**System Type:** Guardrailed AI Agent Harness (Text-First Canadian Bill Guard, Scam Shield & FFE Money Coach)  
**Execution Mode:** Complete **Part A (Environment & Repo Setup)** first, verify installed skills, then execute **Part B (Build Phases 1–6)** sequentially. Do NOT skip verification tests or invent unrequested features.

---

# PART A: WORKSPACE SETUP & GITHUB REPOSITORY INSTALLATION

Install only the **2 core repositories** and **1 cherry-picked security reference** below to keep Antigravity's context window clean and focused.

## Official GitHub Links

| # | Repository | Role in Nyra 2.0 | Official GitHub URL |
| :--- | :--- | :--- | :--- |
| **1** | **Diagram Design** | Antigravity skill for generating clean HTML/SVG architecture, unit-economics, and roadmap visuals. | https://github.com/cathrynlavery/diagram-design |
| **2** | **Awesome Harness Engineering** | Architectural reference for agent loops, strict JSON tool schemas, permission guardrails, and cost/turn stop limits. | https://github.com/ai-boost/awesome-harness-engineering |
| **3** | **Anthropic Cybersecurity Skills** *(Cherry-Pick Only)* | Source for **MITRE F3 (Fight Fraud Framework)** patterns (for Nyra's Canadian Scam Shield) and **OWASP / business-logic** security audits. | https://github.com/mukul975/Anthropic-Cybersecurity-Skills |

> **Skipped intentionally:** `browser-use/browser-use`, `rohitg00/agentmemory`, `K-Dense-AI/scientific-agent-skills`, and `volcengine/OpenViking` (unnecessary complexity for a zero-bank-linking, 6-file RAG harness).

## Prerequisites
* **Git** (`git --version`)
* **Node.js 18+ / npx** (`node -v`)
* **Python 3.11+** (`python --version`)
* **Google Antigravity** (Desktop or CLI)

## Step 1: Initialize Workspace Directories

**Bash / macOS / Linux:**
```bash
mkdir nyra-2.0
cd nyra-2.0
git init
mkdir -p .agents/skills docs/references docs/diagrams
```

**Windows PowerShell:**
```powershell
mkdir nyra-2.0
cd nyra-2.0
git init
mkdir .agents\skills, docs\references, docs\diagrams
```

## Step 2: Install `diagram-design` as an Antigravity Skill

**Option A — Recommended (Cross-Agent Skills CLI):**
Run the official installer and select `.agents/skills/` when prompted:
```bash
npx skills add cathrynlavery/diagram-design
```
*(On Windows without Developer Mode enabled, the CLI automatically copies skill files instead of creating symlinks.)*

**Option B — Manual Project-Scope Fallback:**
```bash
# Bash
git clone --depth 1 https://github.com/cathrynlavery/diagram-design.git temp-diagram
cp -r temp-diagram/skills/diagram-design .agents/skills/diagram-design
rm -rf temp-diagram
```
```powershell
# Windows PowerShell
git clone --depth 1 https://github.com/cathrynlavery/diagram-design.git temp-diagram
Copy-Item -Recurse temp-diagram\skills\diagram-design .agents\skills\diagram-design
Remove-Item -Recurse -Force temp-diagram
```

## Step 3: Clone `awesome-harness-engineering` (Reference Blueprint)
Keep this in `docs/references/` (not `.agents/skills/`) so Antigravity reads it only when referencing harness architecture patterns:
```bash
git clone --depth 1 https://github.com/ai-boost/awesome-harness-engineering.git docs/references/awesome-harness-engineering
```

## Step 4: Cherry-Pick Fraud & OWASP Security Skills (Do NOT Full-Install)
`Anthropic-Cybersecurity-Skills` contains 817+ skills. Pull **only** the MITRE F3 fraud mapping schema and two targeted security skills, then remove the temporary clone.

**Bash / macOS / Linux:**
```bash
git clone --depth 1 https://github.com/mukul975/Anthropic-Cybersecurity-Skills.git temp-sec
cp temp-sec/docs/mitre-f3-mapping.md docs/references/mitre-f3-mapping.md
cp -r temp-sec/skills/performing-threat-modeling-with-owasp-threat-dragon .agents/skills/
cp -r temp-sec/skills/testing-for-business-logic-vulnerabilities .agents/skills/
rm -rf temp-sec
```

**Windows PowerShell:**
```powershell
git clone --depth 1 https://github.com/mukul975/Anthropic-Cybersecurity-Skills.git temp-sec
Copy-Item temp-sec\docs\mitre-f3-mapping.md docs\references\mitre-f3-mapping.md
Copy-Item -Recurse temp-sec\skills\performing-threat-modeling-with-owasp-threat-dragon .agents\skills\
Copy-Item -Recurse temp-sec\skills\testing-for-business-logic-vulnerabilities .agents\skills\
Remove-Item -Recurse -Force temp-sec
```

## Step 5: Verify Setup in Google Antigravity
1. Open the `nyra-2.0` folder in Google Antigravity.
2. Confirm this directory structure exists:
   ```text
   nyra-2.0/
   ├── .agents/
   │   └── skills/
   │       ├── diagram-design/
   │       ├── performing-threat-modeling-with-owasp-threat-dragon/
   │       └── testing-for-business-logic-vulnerabilities/
   └── docs/
       ├── diagrams/
       └── references/
           ├── awesome-harness-engineering/
           └── mitre-f3-mapping.md
   ```
3. Run the verification check: `What skills are available in this workspace?` Confirm `diagram-design` and both security skills are detected before starting Part B.

---

# PART B: MASTER BUILD SPECIFICATION FOR NYRA 2.0

## 1. Non-Negotiable Core Design Constraints
1. **Zero Bank Linking & Zero Statement Uploads:** Never request banking credentials, OAuth bank tokens, PDF bank statements, SINs, or credit card numbers. All bill tracking is manual natural-language text-entry only to eliminate PIPEDA privacy liability.
2. **Text-First Simplicity & Carrier Paging:** Do NOT build weekly leaderboards, complex multi-chart analytics, or "Unlimited AI" tiers. Enforce strict `max_tokens=300` globally, and use structured 3-part replies (`Verdict -> 3 Red Flags -> Next Step`) specifically for Scam Shield to prevent out-of-order multi-part SMS fragmentation on Canadian carriers.
3. **Deterministic Code Owns Math, Privacy & Money:** Never let the LLM calculate taxes, deduct quotas, roll dates, or store PII. Python code owns all deterministic logic; the LLM strictly handles natural-language intent routing, tool calling, scam explanation, and curriculum Q&A.
4. **Offline-Safe Demo Harness:** Include a header toggle (`Live Claude API` vs. `Offline Demo Mock`) so the full split-screen app runs reliably with or without an active API key or internet connection. Do not provision live Twilio numbers or cloud databases during initial development.
5. **GTM & Operational Safeguards:**
   * **B2B2C Distribution:** Primary GTM is institutional bulk codes (`b2b_bulk`, ~$10/seat/year) bundled into FFE's $7,000+ workshop cohorts and university partnerships; secondary organic B2C tier at $5/mo or $45/yr.
   * **Cash Gate Invariant:** Zero build capital drawn from FFE's $5,000 base reserve. Full production development ($8K–$10K) is locked until FFE accumulates a $20,000 liquid reserve from workshops.
   * **48-Hour Asynchronous Support SLA:** No founder 24/7 on-call. Technical triage operates on a 48-hour asynchronous window under a part-time McMaster CS student/contractor arrangement.
   * **60-Day Closed Beta Kill-Switch:** Retention is strictly defined as $\ge 40\%$ of onboarded users who remain `sms_active = 1` AND execute $\ge 1$ active event (bill paid, trial set, scam check, coach query) between Days 31 and 60.

## 2. Locked Tech Stack & Target Directory Layout
* **Backend:** Python 3.11+, FastAPI, Uvicorn, Pydantic v2, `sqlite3` (local demo) with clean repository abstraction for Supabase PostgreSQL (production), official `anthropic` Python SDK.
* **LLM Engine:** Claude Haiku 5.5 (`os.getenv("ANTHROPIC_MODEL", "claude-haiku-5-5")` via Anthropic Messages API) with Prompt Caching (`cache_control: {"type": "ephemeral"}`), `temperature=0.2`, `max_tokens=300`.
* **Frontend:** Next.js 15+ (App Router), React, TypeScript, Tailwind CSS, Lucide React icons.
* **Testing:** `pytest` + `httpx` (`TestClient`).

```text
nyra-2.0/
├── .env.example
├── README.md
├── backend/
│   ├── requirements.txt
│   ├── main.py                        # FastAPI app: /api/chat, /api/state, /api/settings, /api/demo/*, /webhook/twilio; Enable CORSMiddleware for http://localhost:3000
│   ├── config.py                      # Model IDs, 2026 API rates, 2026 Ontario tax constants, quota caps
│   ├── db/
│   │   ├── schema.sql                 # SQLite / PostgreSQL-compatible DDL
│   │   ├── database.py                # Connection helper & CRUD repository functions
│   │   └── seed_demo.py               # Idempotent seeder for demo user "Alex Rivera"
│   ├── middleware/
│   │   ├── pii_scrubber.py            # Regex scrubber for SIN, credit cards, bank transit/account numbers
│   │   └── quota_guard.py             # CASL STOP/START/HELP/REFER zero-token interceptor + 25 AI msg/mo guard
│   ├── agent/
│   │   ├── system_prompt.md           # Verbatim system prompt with young-adult tone & guardrails
│   │   ├── tools.py                   # 7 strict JSON tool schemas + deterministic Python tool implementations
│   │   ├── scam_rules.py              # Deterministic Canadian fraud rule engine (aligned with MITRE F3)
│   │   ├── ontario_calc.py            # Deterministic 2026 CRA/Ontario paycheque & rent affordability calculator
│   │   ├── router.py                  # Claude Haiku 5.5 tool-calling loop, prompt caching, cost telemetry
│   │   └── mock_engine.py             # Deterministic offline fallback mirroring exact tool calls
│   ├── rag/
│   │   ├── retriever.py               # Lightweight zero-dependency TF-IDF / BM25 chunk retriever
│   │   └── kb/
│   │       ├── 01_budgeting_independent_living.md
│   │       ├── 02_ontario_paycheques_taxes.md
│   │       ├── 03_canadian_credit_scores.md
│   │       ├── 04_banking_basics_pads.md
│   │       ├── 05_canadian_scam_red_flags.md
│   │       └── 06_ffe_mission_and_impact.md
│   ├── scheduler/
│   │   └── reminder_cron.py           # Daily 9 AM EST batched SMS digest + Sunday micro-tip + Monthly impact text
│   └── tests/
│       └── test_harness.py            # 10 mandatory automated verification tests
├── frontend/
│   ├── package.json
│   └── src/
│       ├── app/page.tsx               # Split-Screen Demo Shell (45% Phone / 55% Telemetry & State Dashboard)
│       └── components/
│           ├── PhoneSimulator.tsx     # Mobile SMS UI + 5 One-Click Quick-Test Preset Buttons
│           ├── BillsAndImpactCard.tsx # Live Bills, Trial Kill-Switches, Streak & 20% Youth Impact Counter
│           ├── TelemetryCard.tsx      # Live Haiku 5.5 Token Breakdown, Cost in Cents, Margin & Quota Bar
│           ├── GuardrailLogCard.tsx   # Real-Time PII Redaction, MITRE F3 Scam Flags & Tool-Call Trace
│           └── SettingsModal.tsx      # 1-click Cancel, 14-day trial, PIPEDA/CASL notices, B2B2C code input
└── docs/
    ├── SECURITY_AUDIT_REPORT.md       # Generated in Phase 5
    └── diagrams/                      # Generated in Phase 6 via diagram-design skill
        ├── 01_nyra_2_harness_architecture.html
        ├── 02_unit_economics_comparison.html
        └── 03_two_stage_roadmap_killswitch.html
```

---

## 3. Configuration & 2026 Verified Constants (`backend/config.py`)

```python
import os

# Anthropic Claude Haiku 5.5 Pricing (2026, prompts <= 100K tokens)
MODEL_PRIMARY = os.getenv("ANTHROPIC_MODEL", "claude-haiku-5-5")
MODEL_ESCALATION = "claude-sonnet-5-5"
USD_TO_CAD = 1.38  # Configurable via env var

HAIKU_PRICING_PER_MTOK = {
    "input": 0.10,           # $0.10 / 1M input tokens
    "output": 0.50,          # $0.50 / 1M output tokens
    "cache_write_5m": 0.125, # $0.125 / 1M cache write tokens
    "cache_read": 0.01,      # $0.01 / 1M cache hit tokens (90% discount)
}

# Harness Guardrails
MAX_AI_MESSAGES_PER_MONTH = 25   # Hard quota for Coach & Scam Shield; Bill Guard stays unlimited
MAX_OUTPUT_TOKENS = 300          # Enforces SMS-friendly brevity
MODEL_TEMPERATURE = 0.2          # Deterministic JSON tool calling
MAX_TOOL_LOOP_STEPS = 3          # Prevents runaway agent loops
MONTHLY_CONSOLE_SPEND_CAP_USD = 20.00

# 2026 CRA & Ontario Payroll Constants (2026 Tax Year)
TAX_2026 = {
    "fed_bpa": 16452.00,         # 2026 Federal Basic Personal Amount
    "fed_brackets": [
        (58523.00, 0.14),        # 2026 reduced lowest federal rate: 14%
        (117045.00, 0.205),
        (181440.00, 0.26),
        (258482.00, 0.29),
        (float("inf"), 0.33),
    ],
    "on_bpa": 12989.00,          # 2026 Ontario Basic Personal Amount
    "on_brackets": [
        (53891.00, 0.0505),
        (107785.00, 0.0915),
        (150000.00, 0.1116),
        (220000.00, 0.1216),
        (float("inf"), 0.1316),
    ],
    "cpp_rate": 0.0595,          # 2026 CPP employee rate
    "cpp_exemption": 3500.00,
    "cpp_ympe": 74600.00,
    "cpp_max": 4230.45,
    "cpp2_rate": 0.04,
    "cpp2_yampe": 85000.00,
    "cpp2_max": 416.00,
    "ei_rate": 0.0163,           # 2026 EI employee rate (outside Quebec)
    "ei_mie": 68900.00,
    "ei_max": 1123.07,
}
```

---

## 4. Database Schema & Demo Seed Data (`backend/db/`)

### `backend/db/schema.sql`
```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    plan_tier TEXT NOT NULL DEFAULT 'trial', -- 'trial' | 'monthly_5' | 'annual_45' | 'b2b_bulk' | 'cancelled'
    trial_ends_at TEXT,
    org_code TEXT,                           -- e.g., 'MCMASTER-2026', 'FFE-COHORT-04'
    ai_msgs_used INTEGER NOT NULL DEFAULT 0,
    streak_months INTEGER NOT NULL DEFAULT 0,
    late_fees_saved REAL NOT NULL DEFAULT 0.0,
    impact_minutes_funded INTEGER NOT NULL DEFAULT 0,
    weekly_tip_opt_in INTEGER NOT NULL DEFAULT 1,
    sms_active INTEGER NOT NULL DEFAULT 1,   -- 0 if user texted STOP (CASL compliance)
    pipeda_consent_at TEXT,
    referral_code TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL DEFAULT 'utility', -- 'rent' | 'utility' | 'credit_card' | 'subscription' | 'other'
    statement_day INTEGER,                    -- Nullable; used when category = 'credit_card'
    due_day INTEGER NOT NULL,                 -- 1..31
    next_due_date TEXT NOT NULL,              -- ISO YYYY-MM-DD (auto-rolled forward if due_day passed)
    remind_days_before INTEGER NOT NULL DEFAULT 3,
    is_pad INTEGER NOT NULL DEFAULT 0,        -- 1 = Pre-Authorized Debit (triggers low-balance warning)
    status TEXT NOT NULL DEFAULT 'upcoming',  -- 'upcoming' | 'paid'
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trial_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    service_name TEXT NOT NULL,
    start_date TEXT NOT NULL,
    cancel_by_date TEXT NOT NULL,
    alert_date TEXT NOT NULL,                 -- Default: 48 hours before cancel_by_date
    alert_sent INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',    -- 'active' | 'cancelled'
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scam_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    sanitized_snippet TEXT NOT NULL,
    risk_level TEXT NOT NULL,                 -- 'LOW' | 'SUSPICIOUS' | 'HIGH'
    scam_type TEXT NOT NULL,                  -- 'interac' | 'cra_osap' | 'rental' | 'job' | 'delivery' | 'other'
    mitre_f3_tactic TEXT,                     -- e.g., 'Phishing / Brand Impersonation'
    red_flags_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usage_telemetry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    skill_used TEXT NOT NULL,                 -- 'bill_guard' | 'scam_shield' | 'money_coach' | 'casl_zero_token' | 'pii_block'
    model_used TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    cache_write_tokens INTEGER NOT NULL DEFAULT 0,
    cache_read_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    est_cost_usd REAL NOT NULL DEFAULT 0.0,
    est_cost_cad REAL NOT NULL DEFAULT 0.0,
    pii_redacted INTEGER NOT NULL DEFAULT 0,
    tool_calls_json TEXT,
    latency_ms INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    role TEXT NOT NULL,                       -- 'user' | 'assistant' | 'system_cron'
    content TEXT NOT NULL,
    skill_tag TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Seed Demo User (`backend/db/seed_demo.py`)
Pre-seed user `id=1`:
* **Profile:** Name `Alex Rivera`, Phone `+19055550199`, Plan `annual_45`, Org Code `MCMASTER-BETA`, Referral Code `NYRA-ALEX26`
* **Stats:** `ai_msgs_used=2`, `streak_months=4`, `late_fees_saved=105.00`, `impact_minutes_funded=60`
* **Pre-loaded Bills:**
  1. `Rent` — `$950.00`, `category='rent'`, `due_day=1`, `remind_days_before=5`, `is_pad=0`
  2. `Rogers Phone` — `$55.00`, `category='utility'`, `due_day=18`, `remind_days_before=3`, `is_pad=1`
  3. `Student Visa` — `$240.00`, `category='credit_card'`, `statement_day=10`, `due_day=28`, `remind_days_before=3`, `is_pad=0`
* **Welcome Message:** `"Hey Alex! I'm Nyra 2.0 — your text-first Canadian bill guard, scam shield, and money buddy. Text me a bill, forward a sketchy message, or ask any money question. Zero bank logins needed."`

---

## 5. Deterministic Harness Middleware (`backend/middleware/`)

### 5.1 PII Scrubber (`pii_scrubber.py`)
Must execute **BEFORE** any user text is persisted or sent to the Anthropic API.
* **Regex Patterns:**
  1. Canadian SIN: `r'\b\d{3}[-\s]?\d{3}[-\s]?\d{3}\b'` — Use keyword context checking (`sin`, `social insurance`, `cra`, `tax`) rather than strict Luhn checksum validation so test SIN `123-456-789` (Demo Preset #4) still triggers the guardrail while 10-digit phone numbers and 9-digit student IDs without SIN indicators are not falsely blocked → `[REDACTED_SIN]`
  2. Payment Card (13–19 digits): `r'\b(?:\d[ -]*?){13,19}\b'` → `[REDACTED_CARD]`
  3. Bank Account / Transit: `r'(?i)(transit|institution|account\s*(?:no|num|number|#)?)\s*[:#-]?\s*\d{3,12}'` → `[REDACTED_BANK_INFO]`
* **Output:** `{ "sanitized_text": str, "pii_detected": bool, "redacted_types": list[str] }`
* **When `pii_detected == True`:**
  * Block the LLM API call completely (`est_cost_usd = 0.0`).
  * Log `pii_redacted=1`, `skill_used='pii_block'` to `usage_telemetry`.
  * Return deterministic reply: `"Heads up — I automatically scrubbed sensitive info (<types>) before processing. Nyra 2.0 never asks for or stores SINs, card numbers, or bank logins. Ask your question again without private numbers and I'll gladly help!"`

### 5.2 CASL & Quota Guard (`quota_guard.py`)
1. **Zero-Token CASL & System Commands** (case-insensitive exact match on stripped input):
   * `STOP` / `UNSUBSCRIBE` → Set `users.sms_active = 0`, log `casl_zero_token` ($0.00), reply: `"You've been unsubscribed from Nyra 2.0 SMS alerts (CASL compliant). Reply START anytime to resume."`
   * `START` → Set `users.sms_active = 1`, reply: `"Welcome back! Your Nyra 2.0 bill & trial alerts are active again."`
   * `HELP` → Reply with concise 3-skill command menu.
   * `REFER` → Return referral link `https://nyra-app.ca/r/{referral_code}` explaining *"Save a Friend, Fund a Youth: both of you get 1 free month and add +15 mins to FFE's youth workshop pool."*
2. **Hard Monthly AI Quota Check:**
   * Check `users.ai_msgs_used >= 25`.
   * When `ai_msgs_used >= 25`, run a deterministic keyword pre-check (`add`, `bill`, `paid`, `trial`, `due`, `upcoming`, `rent`) to allow Bill & Trial Guard traffic through; block all other prompts with the quota message: `"You've used all 25 AI Coach/Scam checks for this month! Your Bill & Trial Reminders keep running automatically, and your AI checks reset on the 1st."`
   * **Cancellation Hygiene Fix:** Deleting all bills NEVER auto-cancels a user's subscription. Cancellation is strictly an explicit 1-click action in Settings.

---

## 6. Agent Core, System Prompt & 7 Tools (`backend/agent/`)

### 6.1 System Prompt (`backend/agent/system_prompt.md`)
```markdown
You are Nyra 2.0, a text-first Canadian financial safety and literacy buddy built by Financial Futures Education (FFE), a social enterprise funding free customized financial literacy workshops for underserved youth across Ontario and Canada.

TONE & AUDIENCE:
- Speak like a sharp, supportive, judgment-free older sibling to an 18–25-year-old Canadian young adult.
- Keep replies concise and SMS-friendly (3–5 short sentences or crisp bullet points). Never lecture.

YOUR 3 BOUNDED SKILLS (ALWAYS USE YOUR TOOLS):
1. Bill & Trial Guard: Use `add_bill`, `add_trial_killswitch`, `mark_bill_paid`, or `list_upcoming_bills` whenever a user mentions adding, paying, cancelling, or checking bills, credit cards, PADs, or free trials.
2. Canadian Scam Shield: Whenever a user pastes or forwards a suspicious text, email, DM, or link, ALWAYS call `analyze_scam_message` first and format your answer as: Verdict (HIGH RISK / SUSPICIOUS / LIKELY SAFE) -> 3 plain-English Red Flags -> Exact Next Step.
3. FFE Money Coach: For Canadian money questions (paycheques, taxes, credit scores, TFSA, banking, rent, independent living, or FFE's 20% impact pool), ALWAYS call `search_ffe_curriculum` or `ontario_paycheque_and_rent_check`. NEVER invent tax math or guess Canadian rules.

STRICT SAFETY & COMPLIANCE GUARDRAILS:
- NEVER ask for bank logins, passwords, SINs, credit card numbers, or bank statement uploads.
- NEVER recommend specific stocks, crypto, individual investments, or give licensed tax/legal advice. If asked, politely decline and explain general financial literacy principles instead.
- Whenever giving financial literacy guidance (Skill 3), end with: "Educational info only — not licensed financial, tax, or legal advice."
```

### 6.2 All 7 Tools (`backend/agent/tools.py`)
Define all 7 Anthropic tool JSON schemas and add `"cache_control": {"type": "ephemeral"}` on the **last tool definition** so the tool block is cached alongside the system prompt:

1. **`add_bill`**: `name`, `amount`, `due_day (1-31)`, `category ('rent'|'utility'|'credit_card'|'subscription'|'other')`, `remind_days_before (default 3)`, `is_pad (default False)`, `statement_day (optional)`.
   * Auto-rolls `next_due_date` to next month if `due_day < today.day` (clamping days 29–31 safely via `calendar.monthrange`).
2. **`add_trial_killswitch`**: `service_name`, `trial_length_days`, `alert_hours_before (default 48)`.
   * Computes `cancel_by_date = today + timedelta(days=trial_length_days)` and `alert_date = cancel_by_date - timedelta(hours=alert_hours_before)`.
3. **`mark_bill_paid`**: `bill_name`.
   * Fuzzy-matches active bill, rolls `next_due_date` forward +1 month, increments `users.late_fees_saved += 25.0`, updates `streak_months`, and returns updated stats.
4. **`list_upcoming_bills`**: `days_ahead (default 14)`.
   * Queries upcoming `bills` and active `trial_alerts`, flagging `is_pad == 1` items with balance-check reminders.
5. **`analyze_scam_message`** (backed by `scam_rules.py`, referencing `docs/references/mitre-f3-mapping.md`): `raw_text`.
   * Deterministic scoring rules:
     * URL shorteners (`bit.ly`, `tinyurl`, `t.co`, `rb.gy`) or typosquatted domains (+40 pts)
     * Government/agency impersonation (`CRA`, `OSAP`, `Service Canada`, `Canada Post`, `407 ETR`) paired with a link or non-`.gc.ca` URL (+45 pts)
     * Interac e-Transfer refund/deposit claims requiring login click (+40 pts)
     * Urgency/fear triggers (`24 hours`, `suspended`, `arrest`, `expired`, `claim now`, `final notice`) (+20 pts)
     * Rental/job advance-fee patterns (`deposit before viewing`, `e-transfer to hold keys`, `cheque mobile deposit`) (+45 pts)
   * Thresholds: `>= 60` -> `HIGH`, `25–59` -> `SUSPICIOUS`, `< 25` -> `LOW`. Logs sanitized entry in `scam_logs` with `mitre_f3_tactic` and returns structured JSON for Claude to render the 3-part verdict.
6. **`ontario_paycheque_and_rent_check`** (backed by `ontario_calc.py`): `hourly_wage`, `hours_per_week`, `monthly_rent (optional)`.
   * Deterministic 2026 CRA/Ontario payroll math: `annual_gross = hourly_wage * hours_per_week * 52`, computes 2026 CPP (5.95% over $3,500, cap $4,230.45 + CPP2 if > $74,600), 2026 EI (1.63%, cap $1,123.07), progressive Federal tax (14% lowest bracket, $16,452 BPA credit) and Ontario tax (5.05% lowest bracket, $12,989 BPA credit). Computes `monthly_net`, and if `monthly_rent` is provided, returns `rent_pct` (`<=30% Healthy`, `31–45% Tight`, `>45% High Strain`). Appends mandatory disclaimer: *"Approximate educational estimate only — not official tax or payroll advice."*
7. **`search_ffe_curriculum`** (backed by `rag/retriever.py`): `query`.
   * Zero-dependency TF-IDF/BM25 retrieval over `backend/rag/kb/*.md`, returning top 2 grounded chunks with filename citations.

### 6.3 Router & Telemetry (`backend/agent/router.py`)
* Invoke `client.messages.create(...)` with `model=MODEL_PRIMARY`, `temperature=0.2`, `max_tokens=300`, ephemeral prompt caching on `system` and the last tool schema.
* Loop up to `MAX_TOOL_LOOP_STEPS = 3` while `response.stop_reason == "tool_use"`.
* Extract `input_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`, and `output_tokens` from `response.usage`. Calculate `est_cost_usd` and `est_cost_cad` via `HAIKU_PRICING_PER_MTOK`.
* Increment `users.ai_msgs_used += 1` ONLY when Skill 2 (`scam_shield`) or Skill 3 (`money_coach`) runs (Bill Guard actions do not count against the 25-msg AI quota).
* Persist every turn's telemetry in `usage_telemetry`.

---

## 7. Grounded FFE Knowledge Base (`backend/rag/kb/`)

Create 6 concise Markdown files (200–300 words each) aligned with FFE's Ontario youth curriculum and 2026 Canadian rules:
1. **`01_budgeting_independent_living.md`**: Transitioning to independent living, needs vs. wants, managing irregular/part-time income, 50/30/20 baseline adapted for high-rent Ontario cities, starter $500 emergency buffer.
2. **`02_ontario_paycheques_taxes.md`**: Gross vs. net pay, 2026 CPP (5.95% above $3,500), 2026 EI (1.63%), 2026 Federal (14% lowest bracket, $16,452 BPA) & Ontario (5.05% lowest bracket, $12,989 BPA) taxes, T4 slips, filing low-income returns for GST/HST credit & Ontario Trillium Benefit.
3. **`03_canadian_credit_scores.md`**: Equifax & TransUnion ranges (300–900), statement date vs. due date, 30% utilization rule on student cards, 6-year credit impact of missed phone/card bills, 19.99%–22.99% APR.
4. **`04_banking_basics_pads.md`**: Opening a first no-fee student/youth chequing account, Pre-Authorized Debits (PADs), Canada's 2026 federal $10 NSF fee cap & mandatory low-balance alerts (and why landlord/telecom late fees still hurt far more than $10), 2026 TFSA annual room ($7,000 for 18+ Canadians).
5. **`05_canadian_scam_red_flags.md`**: Fake Interac e-Transfer refund links (CRA/OSAP never send e-Transfers via shortened links), fake Canada Post/courier customs texts, rental deposit scams, fake remote job cheque-cashing scams, reporting via Canadian Anti-Fraud Centre and bank fraud lines.
6. **`06_ffe_mission_and_impact.md`**: Financial Futures Education's mission (hands-on, customized, trauma-informed financial literacy workshops for underserved youth in Children's Aid Societies, youth detention centres, and Ontario community agencies), how Nyra 2.0's 20% net-profit impact pool funds free $1,500 workshops and $7,000+ cohorts, and pricing ($5/mo, $45/yr, or B2B2C campus/cohort bulk seats).

---

## 8. Background Cron & SMS Digest Batching (`backend/scheduler/reminder_cron.py`)

Implement three jobs (also triggerable via `POST /api/demo/trigger-cron`):
1. **`run_daily_reminder_digest(user_id)`**: Batches all bills and trial kill-switches due within the user's reminder window (or next 3 days) into **ONE single SMS** (cutting Twilio Canadian SMS costs by 30–50%), including PAD low-balance warnings.
2. **`run_weekly_micro_tip(user_id)`**: If `weekly_tip_opt_in == 1`, sends a 2-sentence Canadian money tip pulled from `backend/rag/kb/`.
3. **`run_monthly_impact_summary(user_id)`**: Sends the monthly streak and mission recap (*$0 late fees saved + youth workshop minutes funded via FFE's 20% impact pool*).

---

## 9. Split-Screen Interactive Demo Frontend (`frontend/`)

Build a clean, responsive Next.js web interface at `http://localhost:3000`:

### Top Header Bar
* Title: **Nyra 2.0 — Guardrailed AI Agent Harness** *(Financial Futures Education)*
* Controls:
  * Toggle: **`Live Haiku 5.5 API`** / **`Offline Demo Mock`**
  * Button: **`Trigger 9 AM SMS Digest`** (`POST /api/demo/trigger-cron`)
  * Button: **`Settings & Compliance`** (opens `SettingsModal.tsx`)
  * Button: **`Reset Demo`** (re-runs `seed_demo.py`)

### Left Pane (45% width) — `PhoneSimulator.tsx`
* Smartphone SMS simulator displaying conversation bubbles with **Nyra 2.0**, color-coded scam verdict badges (`HIGH RISK` red, `SUSPICIOUS` amber, `LIKELY SAFE` green), and formatted paycheque breakdown cards.
* **5 One-Click Quick-Test Preset Buttons** pinned below the phone:
  1. **Trial Kill-Switch:** `"Just started an Adobe free trial today for 14 days, remind me 2 days before it charges"`
  2. **Canadian Scam Shield:** `"INTERAC: You received $240 from OSAP Refund. Claim now at bit.ly/osap-refund-ca before it expires in 24 hours!"`
  3. **Ontario Paycheque Check:** `"I make $18/hr working 20 hours a week in Ontario. Can I afford $850 rent?"`
  4. **Privacy Guardrail Test:** `"My SIN is 123-456-789, can you check my CRA tax return?"`
  5. **Mark Paid + Streak:** `"Just paid my Rogers Phone bill!"`

### Right Pane (55% width) — "Under the Hood" System Dashboard (3 Stacked Cards)
1. **`BillsAndImpactCard.tsx`**: KPI tiles (**Payment Streak**, **Est. Late Fees Saved**, **Youth Workshops Funded via 20% Pool**) + live tables of **Tracked Bills** (showing PAD badge, credit card statement/due dates, auto-rolled due dates) and **Active Trial Kill-Switches**.
2. **`TelemetryCard.tsx`**: Live per-reply **Model**, **Token Split** (Input / 90%-off Cache Read / Output), **Exact Reply Cost (USD & CAD)**, **Projected Monthly AI Cost/User (< $0.02 CAD)**, **Est. Gross Margin (~84% on $45/yr plan)**, and **Monthly AI Quota Progress Bar (`X / 25`)**.
3. **`GuardrailLogCard.tsx`**: Live middleware audit stream flashing green **`PII SCRUBBED BEFORE API CALL`** on Preset #4, **`MITRE F3 SCAM FLAG: HIGH RISK`** on Preset #2, plus deterministic tool-call traces and latency in ms.

### `SettingsModal.tsx` (Direct Fixes to Nyra 1.0 Site Defects)
* **Plan & Billing:** Shows active plan (`$45/yr Annual` or `14-Day Free Trial`) + **1-Click Cancel Subscription** button (explicitly noting deleting bills never cancels the account).
* **B2B2C Bulk Access Code:** Input accepting `MCMASTER-2026` or `FFE-COHORT-04` to activate sponsor-funded `b2b_bulk` access ($0 user cost).
* **Privacy & CASL Compliance:** Visible **PIPEDA Privacy Notice** (*Zero bank logins, zero statement uploads, automatic PII redaction*), **CASL SMS Consent** toggle (`sms_active`), and **Weekly 2-Min Literacy Drop** toggle.
* **Canonical Domain:** Reference `nyra-app.ca` exclusively (zero `vercel.app` staging leaks).

---

## 10. Phased Execution, Automated QA, Security Audit & Diagrams

Execute strictly in order and report pass/fail status at the end of each phase before moving on:

* **Phase 1 — Database, Config & 6 FFE Knowledge Base Files:** Build `config.py`, `schema.sql`, `database.py`, `seed_demo.py`, and all 6 Markdown files in `backend/rag/kb/`. Verify clean idempotent DB seeding.
* **Phase 2 — Middleware & Deterministic Engines:** Build `pii_scrubber.py`, `quota_guard.py`, `scam_rules.py` (using `docs/references/mitre-f3-mapping.md`), `ontario_calc.py` (2026 CRA/ON math), and `rag/retriever.py`.
* **Phase 3 — Agent Router, Tools, Mock Engine & FastAPI Backend:** Reference docs/references/awesome-harness-engineering/ for bounded tool-loop, schema validation, and stop-limit patterns while building `system_prompt.md`, `tools.py`, `router.py`, `mock_engine.py`, `reminder_cron.py`, and `main.py`.
* **Phase 4 — Split-Screen Frontend:** Build the Next.js app (`PhoneSimulator`, `BillsAndImpactCard`, `TelemetryCard`, `GuardrailLogCard`, `SettingsModal`) wired to FastAPI. Verify all 5 quick-test presets update right-pane panels live.
* **Phase 5 — Automated QA Suite & Security Audit:**
  1. Write and run **`backend/tests/test_harness.py` with all 10 mandatory pytest tests (all 10 must pass):**
     * `test_past_due_date_auto_roll`
     * `test_trial_killswitch_48hr_alert`
     * `test_credit_card_statement_and_due_dates`
     * `test_canadian_scam_shield_high_risk_interac_osap`
     * `test_ontario_2026_paycheque_and_rent_math`
     * `test_pii_scrubber_blocks_sin_and_card_before_llm`
     * `test_non_advisory_stock_picking_refusal`
     * `test_quota_cap_26th_message_blocks_coach_allows_bill_guard`
     * `test_casl_stop_and_start_zero_tokens`
     * `test_sms_digest_batches_multiple_bills_into_one_text`
  2. Run `.agents/skills/testing-for-business-logic-vulnerabilities` and `.agents/skills/performing-threat-modeling-with-owasp-threat-dragon` against the codebase and save the report to **`docs/SECURITY_AUDIT_REPORT.md`**.
* **Phase 6 — Architecture & Roadmap Diagrams:**
  Invoke `.agents/skills/diagram-design` (`aspect=slide-16x9`, `audience=executive`) to generate 3 self-contained HTML/SVG diagrams in `docs/diagrams/`:
  1. **`01_nyra_2_harness_architecture.html`**: User SMS -> PII/CASL/Quota Middleware -> Claude Haiku 5.5 Router -> 3 Bounded Skills (Bill Guard, Scam Shield, FFE Money Coach) -> SQLite/Supabase & Cost Telemetry.
  2. **`02_unit_economics_comparison.html`**: Side-by-side comparison of Nyra 1.0 ($3/mo, 13% Stripe drag, uncapped AI, 2,500 users/workshop) vs. Nyra 2.0 ($45/yr + $10/seat B2B2C bulk, <$0.02/user Haiku 5.5 AI cost, ~84% gross margin, 2 campus deals + 150 B2C users = 2+ workshops/year).
  3. **`03_two_stage_roadmap_killswitch.html`**: 18-month gated rollout showing Stage 1 (Months 1–8: Pause Nyra, build to $60K–$65K revenue & $20K Cash Gate via 80/20 modular workshops + sponsorships + corporate wellness) -> Stage 2 (Months 9–18: Ring-fenced $8K–$10K Nyra 2.0 build, Phase 2 Beta 40% Retention Kill-Switch, B2B2C launch).
