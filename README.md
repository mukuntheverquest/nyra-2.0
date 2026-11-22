# Nyra 2.0 — Guardrailed AI Agent Harness

> **Target Organization:** Financial Futures Education (FFE) — Co-founders Sanya Bajaj & Aryan Kapur  
> **System Type:** Text-First Canadian Bill Guard, Scam Shield & FFE Money Coach  
> **Domain:** https://nyra-app.ca  

---

## 1. System Overview

Nyra 2.0 pivots from a high-churn consumer app into a **guardrailed, text-first AI agent harness** designed for B2B2C institutional distribution (university student unions, student affairs, and youth agencies across Ontario).

### Core Pillars & Invariants
1. **Zero Bank Linking & Zero Statement Uploads:** No Plaid/Flinks tokens, no banking passwords, no statement PDFs. All bill tracking operates via natural-language text.
2. **Deterministic Code Controls Math, Money & Privacy:** Python code calculates 2026 CRA/Ontario taxes, date rollovers, and MITRE F3 scam patterns. Claude Haiku 5.5 handles intent routing and curriculum retrieval only.
3. **Institutional B2B2C Licensing:** Access is sold in bulk codes (`MCMASTER-2026`, `FFE-COHORT-04`) bundled into FFE's $7,000+ workshop contracts.
4. **$20,000 Liquid Cash Gate & 40% Retention Kill-Switch:** Base reserves are unconditionally protected; full production build remains locked until $20K cash reserve accumulates from workshops.

---

## 2. Target Architecture & Tech Stack

- **Backend:** Python 3.11+, FastAPI, Uvicorn, SQLite3, Anthropic Python SDK (Claude Haiku 5.5 with ephemeral prompt caching).
- **Frontend:** Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS, Lucide React icons.
- **Verification:** 10 mandatory automated regression tests (`pytest + httpx`).
- **Security:** OWASP Business Logic Vulnerability Guide, OWASP Threat Dragon (STRIDE/LINDDUN), MITRE Fight Fraud Framework (F3 v1.1).

---

## 3. Quick Start & Local Execution

### Backend
```bash
# From workspace root
python -m pip install -r backend/requirements.txt
python -m backend.db.seed_demo
uvicorn backend.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Run 10 Automated Harness Verification Tests
```bash
python -m pytest backend/tests/test_harness.py -v
```

---

## 4. Key Endpoints

- `POST /api/chat`: Process text with PII scrubber, CASL guard, and Haiku 5.5 / Mock router.
- `GET /api/state`: Full state representation (User, Bills, Trials, Telemetry, Messages, Scam Logs).
- `POST /api/settings`: Update plan tier, apply B2B2C code (`MCMASTER-2026`), or toggle CASL consent.
- `POST /api/demo/reset`: Reset demo data to Alex Rivera baseline.
- `POST /api/demo/trigger-cron`: Trigger 9 AM batched SMS reminder digest.
- `POST /webhook/twilio`: Production Twilio SMS webhook.

---

## 5. Documentation & Diagrams

- Security Report: [docs/SECURITY_AUDIT_REPORT.md](docs/SECURITY_AUDIT_REPORT.md)
- Architecture Diagram: [docs/diagrams/01_nyra_2_harness_architecture.html](docs/diagrams/01_nyra_2_harness_architecture.html)
- Unit Economics Diagram: [docs/diagrams/02_unit_economics_comparison.html](docs/diagrams/02_unit_economics_comparison.html)
- 18-Month Gated Roadmap: [docs/diagrams/03_two_stage_roadmap_killswitch.html](docs/diagrams/03_two_stage_roadmap_killswitch.html)
