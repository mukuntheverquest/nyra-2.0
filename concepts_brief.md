# Nyra 2.0 — Guardrailed AI Agent Harness Concept Brief
*Multi-Perspective Synthesis across 7 Goldfish Lenses*

* **Product Name:** Nyra 2.0 (Canadian Bill Guard, Scam Shield & FFE Money Coach)
* **Author / Sponsor:** mukuntheverquest / Financial Futures Education (FFE) — Co-founders Sanya Bajaj & Aryan Kapur
* **Status:** Synthesized & Verified Architecture (Post-Goldfish Review)
* **Core Stack:** Python 3.11+ / FastAPI / SQLite (local demo) / Next.js 15 / Claude Haiku 5.5 (ephemeral prompt caching)

---

## 1. Executive Summary & Problem-Solution Fit

Nyra 1.0 failed due to execution friction: direct-to-consumer app acquisition costs (CAC), unconstrained generative API spend, and founder support overload. Nyra 2.0 pivots from a generic consumer app to a **guardrailed, text-first AI agent harness** designed specifically as a B2B2C distribution engine for FFE's institutional partners (university student unions, student affairs, and youth agencies).

### Core Hypotheses & Strategic Anchors
1. **Zero Bank Credentials (Zero-PII Risk):** 18–25 Canadian young adults resist linking bank accounts to unproven third-party apps. Nyra 2.0 tracks bills via manual, natural-language text entry, auto-rolling dates deterministically without storing account tokens, SINs, or statements.
2. **Deterministic Code Controls Math, Money & Privacy:** Claude Haiku 5.5 handles conversational intent routing and curriculum retrieval only. Python code calculates 2026 CRA/Ontario taxes, runs MITRE F3 scam pattern rules, and enforces CASL zero-token commands.
3. **Institutional B2B2C Licensing ($10/Seat):** Access is sold in bulk codes (`MCMASTER-2026`, `FFE-COHORT-04`) bundled into FFE's $7,000+ workshop contracts, transferring acquisition friction away from cash-strapped students.
4. **The $20,000 Liquid Cash Gate & 40% Retention Kill-Switch:** No capital is drawn from FFE’s baseline $5,000 reserve. Full production development ($8K–$10K) is locked until FFE accumulates $20,000 in workshop profits. A 60-day closed beta requires $\ge 40\%$ active user retention (Days 31–60) or the project is cleanly terminated.

---

## 2. Multi-Lens Brainstorm Synthesis (Findings Across 7 Lenses)

### Lens 1: UX & Ergonomics (`egm-design`)
* **SMS Conciseness & Multi-Part Paging:** Canadian carriers (Rogers, Bell, Telus) split messages over 160 GSM-7 characters. Unbounded LLM output produces fragmented texts that arrive out of order. Nyra 2.0 enforces `max_tokens=300` and structured 3-point outputs (e.g., Scam Verdict -> 3 Red Flags -> Next Step) to guarantee 1–2 SMS segment readability.
* **Low-Friction Natural Language Bill Capture:** Rather than demanding structured forms, the user texts: *"Fido $65 due on the 18th"* or *"Adobe trial 14 days"*. The deterministic tool parser handles date computation, calendar rollover, and Pre-Authorized Debit (PAD) balance warnings automatically.
* **Split-Screen Telemetry Ergonomics:** For B2B institutional buyers and executive demos, the 45% Phone Simulator / 55% "Under the Hood" Dashboard reveals live token counts, exact per-turn costs (< $0.001 USD), and real-time PII redaction, directly proving safety and margin viability.

### Lens 2: Codebase & Deterministic Engines (`egm-codebase-details`)
* **PII Scrubber Precision:** Canadian Social Insurance Numbers (`r'\b\d{3}[-\s]?\d{3}[-\s]?\d{3}\b'`) can falsely trigger on 9-digit campus student IDs or order tracking numbers. Middleware must inspect digit context and scrub before LLM invocation, immediately returning an educational boundary notice and logging a zero-cost turn.
* **2026 Ontario & Federal Payroll Exactness:** The 2026 tax year introduces the reduced lowest federal bracket (14% up to $58,523 with $16,452 BPA) and updated CPP2 rules ($74,600 to $85,000 at 4%). Python's `ontario_calc.py` guarantees pennies-exact take-home pay calculations that LLMs routinely hallucinate.
* **Prompt Caching Telemetry:** The tool block places `"cache_control": {"type": "ephemeral"}` on the final tool schema, locking the system prompt and 7 tools in cache for 5-minute windows, yielding 90% savings on repeat turns.

### Lens 3: Skeptical Architect & Systems Viability (`egm-zoom-out`)
* **Institutional Code Activation Trap:** Bulk university codes often suffer from low activation (<15%) if distributed via mass email. Nyra 2.0 integrates activation directly into the FFE workshop flow: students activate their bulk code during the live 90-minute workshop as an interactive budgeting exercise.
* **Asynchronous 48-Hour SLA Realism:** Sanya and Aryan cannot maintain real-time support without academic failure. Technical triage is routed to structured error logs monitored asynchronously by a McMaster CS co-op contractor. The harness operates strictly offline in demo mode during campus sales pitches.
* **Cash Gate Invariant:** The $20,000 cash reserve gate ensures FFE's core educational operations are never jeopardized by speculative software overhead.

### Lens 4: Mental Models & Comprehension (`egm-comprehension`)
* **Zero-Bank Trust Architecture:** Users expect financial apps to demand bank logins (Plaid/Flinks). Nyra 2.0 explicitly educates users on *why* it never asks for logins: zero liability, zero credential exposure, complete privacy.
* **Non-Advisory Guardrail Boundary:** Users frequently ask *"Should I buy Tesla stock?"* or *"How do I invest $500 in crypto?"* The harness enforces an algorithmic refusal mechanism, pivoting immediately to general financial literacy concepts (TFSA room, emergency funds) and appending the non-advisory disclaimer.
* **The 20% Mission Impact Loop:** To incentivize payment logging, every confirmed on-time bill payment increments a personal streak counter and funds minutes of youth financial literacy workshops via FFE's social enterprise model.

### Lens 5: Implementation Readiness (`egm-implementation-readiness`)
* **10 Automated Regression Tests:** Clean verification suite (`pytest + httpx`) validating:
  1. Past-due date auto-roll (clamping months with 28/30/31 days).
  2. 48-hour free trial kill-switch alert calculation.
  3. Credit card statement date vs. due date distinction.
  4. Canadian Scam Shield high-risk Interac/OSAP detection.
  5. Deterministic 2026 Ontario payroll & rent strain math.
  6. PII scrubber blocking SIN & credit cards prior to API calls.
  7. Non-advisory stock-picking refusal.
  8. Quota cap blocking Coach on message 26 while keeping Bill Guard active.
  9. CASL `STOP`/`START` zero-token interceptor.
  10. Batched 9 AM daily reminder SMS digest.
* **Offline Mock Engine:** Complete deterministic mock system replicating all 7 Anthropic tool calls, ensuring demo presentations never fail due to Wi-Fi drops or API rate limits.

### Lens 6: Structural Architecture (`egm-structural`)
* **Strict Layer Separation:**
  ```text
  Incoming SMS / Web Text
             │
             ▼
  ┌──────────────────────────────────────────────────┐
  │ Middleware: PII Scrubber + CASL / Quota Guard    │
  └──────────────────────┬───────────────────────────┘
                         │ (Sanitized & Quota-Cleared)
                         ▼
  ┌──────────────────────────────────────────────────┐
  │ Claude Haiku 5.5 Router (7 Strict JSON Tools)    │
  └──────────────────────┬───────────────────────────┘
                         │ (Tool Call Dispatched)
                         ▼
  ┌──────────────────────────────────────────────────┐
  │ Deterministic Python Engines & Local KB          │
  │ • ontario_calc.py (2026 CRA/ON Math)             │
  │ • scam_rules.py (MITRE F3 Pattern Engine)        │
  │ • tools.py (Bill Due-Date & Trial Rollover)      │
  │ • rag/retriever.py (TF-IDF Grounded Chunks)      │
  └──────────────────────┬───────────────────────────┘
                         │
                         ▼
  ┌──────────────────────────────────────────────────┐
  │ SQLite / PostgreSQL Telemetry & Audit Logs       │
  └──────────────────────────────────────────────────┘
  ```

### Lens 7: Inventive Contradictions & TRIZ Resolutions (`egm-inventive-catalyst`)
* **Contradiction 1: Automation vs. Privacy Liability**
  * *Conflict:* Users desire automatic bill updates without typing, but automated bank account scraping creates fatal privacy and regulatory exposure for a small non-profit.
  * *Resolution (TRIZ: Separation in Space / Inversion):* Implement "Forward-or-Text" bill ingestion. Users text bill notifications or forward reminder snippets; Python's calendar engine auto-increments the due date each month upon `mark_bill_paid`. Zero bank tokens stored; 95% of automation benefits retained.
* **Contradiction 2: High-Stakes Scam Anxiety vs. Founder Support Absence**
  * *Conflict:* Users facing urgent fraud texts (e.g. fake Interac e-Transfers) demand immediate answers, but founders cannot provide live 24/7 technical triage.
  * *Resolution (TRIZ: Segmentation / Prior Action):* Asymmetric response tiers. Deterministic rule scoring delivers an instant (<800ms) 3-part verdict (`Verdict`, `3 Red Flags`, `Exact Next Step`), resolving 98% of urgent fraud inquiries instantly. General questions or bugs follow a 48-hour asynchronous ticket workflow.
* **Contradiction 3: Institutional Fixed Cost vs. Generative Token Volatility**
  * *Conflict:* Universities demand a predictable $10/seat annual cost, but unmetered LLM queries can trigger runaway API bills.
  * *Resolution (TRIZ: Local Quality / Parameter Change):* Hard quota gating. Core Bill and Trial Guard reminders are 100% deterministic and unlimited at zero token cost. Generative Money Coach and Scam Shield queries are capped at 25 turns/month with ephemeral prompt caching, guaranteeing maximum monthly AI spend under $0.02 CAD per user and preserving an ~84% gross margin.

---

## 3. Prioritized Strategic & Architectural Triage

### 🔴 Blockers (Must Be Enforced in Phase 1 & 2)
1. **Pre-API PII Scrubbing:** All text must pass through regex redaction *before* being logged or sent to Claude. Detection of a SIN or credit card must abort the API call immediately.
2. **Deterministic Math Invariant:** Tax calculations, take-home pay, and due date advances must never be computed inside the LLM prompt. Python code must return deterministic numbers.
3. **Hard AI Quota Interceptor:** The 26th generative message must be blocked at middleware with a friendly quota notification, while allowing bill tracking to continue unhindered.

### 🟡 Major Considerations (Phase 3 & 4 Demo Polish)
1. **Offline Mock Parity:** The offline mock engine must provide 1-to-1 parity with live Claude Haiku responses for all 5 quick-test presets.
2. **One-Click Subscription Cancellation:** Explicit cancellation controls in Settings must decouple bill deletion from plan cancellation to ensure compliance.

### 🟢 Nits & Ergonomics (Phase 5 & 6)
1. **Phone Number Sanitization:** Distinguish 10-digit North American phone numbers from 9-digit Canadian SINs during regex pattern matching.
2. **SMS Digest Consolidation:** Batch daily 9 AM reminders into a single combined message to optimize carrier delivery rates.

---

## 4. Quantitative Beta Kill-Switch & Cash Gate Invariants

* **Stage 1 (Months 1–8):**
  * Target: Generate $60,000–$65,000 revenue from FFE workshops and corporate wellness.
  * Cash Gate: Accumulate $20,000 liquid reserve. Zero software capital spent until gate is cleared.
* **Stage 2 (Months 9–18):**
  * Ring-fenced build budget: $8,000–$10,000 for production deployment.
  * 60-Day Beta Retention Kill-Switch:
    $$\text{Beta Retention} = \frac{\text{Users with } sms\_active = 1 \text{ and } \ge 1 \text{ active event in Days 31–60}}{\text{Total Onboarded Beta Users}} \ge 40\%$$
  * *Kill Condition:* If retention falls below 40% at Day 60, product development is terminated immediately.
