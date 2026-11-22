# SCROLL-CRAFT DESIGN PLAN: NYRA 2.0
**Aesthetic Family:** Crisp White / Light Editorial Architectural Canvas  
**Brand:** Nyra 2.0 by Financial Futures Education (FFE) — Canadian Youth Financial Safety & Literacy  
**Engine & Standard:** `scroll-craft` (Strict Light Ground) + `a2ui` (`@a2ui/react/v0_9` + `@a2ui/web_core/v0_9`)

---

## 1. Brand Tokens & Color Palette (Strict White / Light Ground)

* **Primary Ground Canvas:** `#FFFFFF` (Pure crisp white)
* **Depth Plane 1 (Elevated Cards / Stage):** `#FFFFFF` with hairline borders (`#E2E8F0` / `rgba(226, 232, 240, 0.8)`) and diffused ambient shadows (`rgba(15, 23, 42, 0.06)`)
* **Depth Plane 2 (Alternating Section Bedding):** `#F8FAFC` (Alabaster / ice-slate tint) and `#F1F5F9` (Muted structural paneling)
* **Depth Plane 3 (Atmospheric Glow):** `#EFF6FF` (Subtle 4% Nyra blue wash)
* **Typography Ink:**
  * **Headings / Primary:** Deep charcoal-navy `#0F172A` (WCAG AAA contrast: 15.8:1 on white)
  * **Body / Subtitles:** Slate `#334155` and `#475569` (WCAG AA+ contrast: 7.2:1 on white)
  * **Muted Indicators / Monospace Meta:** `#64748B` (WCAG AA contrast: 4.6:1 on white)
* **Nyra Brand Accents:**
  * **Primary Nyra Blue (`--nyra-accent`):** `#2177D1` (Verified from `https://www.nyra-app.ca/`)
  * **Nyra Blue Bright:** `#3A8EE0`
  * **Nyra Blue Dark:** `#1658A8`
  * **Nyra Light Ice Tint:** `#EFF6FF`
* **Semantic Status Indicators (Light-Surface Tuned):**
  * **Critical Scam Alert:** Text/Border `#DC2626` on `#FEF2F2` tint
  * **Suspicious / Due Soon / Free Trial Warning:** Text/Border `#D97706` on `#FFFBEB` tint
  * **PII Redacted / On-Time Streak / Payment Verified:** Text/Border `#059669` on `#ECFDF5` tint

### Hard Refuse List (Strictly Enforced)
* ❌ NO black or dark page sections (`#000000`, `#0B0E14`, `#121620`, `bg-slate-950`, `bg-gray-900`, etc.)
* ❌ NO `00 //`, `01 //`, `02 //` chapter numbers
* ❌ NO `ScrambleText` broken wordmark glitches (static, crisp brand wordmark: `Nyra 2.0`)
* ❌ NO identical cookie-cutter 3-card or 4-card bento grids
* ❌ NO generic "Scroll to explore" badges or generic AI-purple gradients

---

## 2. Page Grammar: `split stage` & `live surface`
* **Grammar Selection:** `split stage` transitioning into `live surface`.
* **Mechanical Function:** Scroll progress directly scrubs an active timeline that leads into the physical interactive `@a2ui/react` mobile simulator and companion HUD.

---

## 3. The 4-Act Feeling Curve (All on White / Light Ground)

### Act 1: Opening Tension — Layered White Editorial Hero
* **Canvas:** Pure white (`#FFFFFF`) with soft directional Nyra Blue light (`#EFF6FF`).
* **Visual Planes:**
  * **Background Plane:** Subtle hairline architectural grid with soft radial sky-blue gradient.
  * **Subject Plane:** Bold editorial typographic lockup: **"NEVER MISS A BILL. NEVER FALL FOR A SCAM."** (Ink: `#0F172A`).
  * **Foreground Depth Plane:** 3 floating, dimensional frosted cards (an Adobe trial charge alert, an urgent CRA e-transfer text, a student hydro bill) drifting with subtle pointer parallax.
* **Emotion:** *The relatable anxiety of scattered student bills, hidden free-trial traps, and urgent Canadian scam texts.*

### Act 2: Scroll-Scrubbed Intercept — Pinned Timeline
* **Canvas:** Transition to `#F8FAFC` architectural slate plane with sticky pinning.
* **Mechanical Behavior:** As the visitor scrolls, 3 raw student threats are scrubbed through Nyra's deterministic guardrails:
  1. *Raw text with SIN/Credit card* ➔ Edge PII scrubber redacts tokens before API (`$0.00 spent`).
  2. *Urgent $240 Interac OSAP scam* ➔ MITRE F3 rule catches urgency & unverified domain (`CAFC safe-steps`).
  3. *Ontario $18/hr 20hr work week* ➔ CRA 2026 tax formulas evaluate rent affordability.
* **Emotion:** *Instant relief, order, and understanding that deterministic guardrails protect them without bank login.*

### Act 3: THE ENGINEERED PEAK — Real A2UI Mobile App & Companion Light HUD
* **Canvas:** Dedicated, expansive crisp white `#FFFFFF` stage with full scroll room.
* **Left Pane:** Precision light-aluminum mobile viewport running **real `@a2ui/react/v0_9` (`A2uiSurface`)** and `@a2ui/web_core/v0_9` (`MessageProcessor`).
  * Features 5 interactive monospace test chips.
  * Real interactive A2UI surfaces: Bill kill-switch, Canadian Scam Shield, 2026 Ontario paycheque, FFE coach, and PII confirmation.
  * Tapping `Mark Paid` or `Add Rent as Bill` executes `POST /api/a2ui/action` against FastAPI, mutating the card in-place via `updateDataModel` at **$0.00 LLM cost**.
* **Right Pane:** Light-mode companion HUD cards:
  1. **Live Bills & Impact:** Streak counter, $105 CAD fees saved, 20% Youth Impact Pool minutes.
  2. **Haiku 5.5 Telemetry & Unit Economics:** Exact token split (90% cache read discount), `< $0.02 CAD/user/mo` projected cost, ~84% gross margin.
  3. **Deterministic Guardrail Terminal:** PII scrubbed confirmation, MITRE F3 scam classification, zero-token CASL filter.
  4. **A2UI Protocol Wire Inspector:** Collapsible light-slate drawer showing raw JSON envelopes (`createSurface`, `updateComponents`, `updateDataModel`).
* **Emotion:** *Tangible conviction and delight that this is a real, working AI agent built on an open protocol.*

### Act 4: Grounded Close — Mission, Access & Youth Impact
* **Canvas:** Airy editorial conclusion on `#F8FAFC`.
* **Components:**
  * 3 transparent, clean pricing cards: **$5/mo** Monthly, **$45/yr** Annual Supporter (highlighted in Nyra Blue), and **$10/seat/yr** Campus Bulk.
  * Explicit 20% Net Profit guarantee funding Financial Futures Education high school workshops.
  * PIPEDA Privacy & CASL SMS compliance badges.
  * Canonical footer with links to `https://www.nyra-app.ca/` and co-founders Sanya Bajaj & Aryan Kapur.
* **Emotion:** *Deep social trust and readiness to adopt.*

---

## 4. Bespoke Signature Move: "Threat-to-Surface" Morph
* A chaotic, red-flagged raw SMS text message pinned during the Act 2/3 transition physically scrubs its PII tokens in real-time, contracts its margins, and crystallizes into a crisp white-and-blue interactive A2UI mobile card inside the phone simulator as the user reaches the peak.
