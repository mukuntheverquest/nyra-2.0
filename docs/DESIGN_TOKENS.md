# NYRA 2.0 & IGLOO-LITE DESIGN TOKENS
**Extracted & Synthesized via Reverse Engineer Anything (`rea`)**
**Sources:** `https://www.nyra-app.ca/` and `https://www.igloo.inc/`

---

## 1. Nyra Brand Identity Tokens (`nyra-app.ca`)

* **Primary Nyra Blue (`--nyra-accent`):** `#2177D1` (Verified live accent from `nyra-app.ca`)
* **Dark Royal Blue (`--nyra-accent-dark`):** `#1658A8`
* **Bright Blue Hover (`--nyra-accent-bright`):** `#3A8EE0`
* **Cyan Highlight (`--nyra-accent-cyan`):** `#5BA3EC`
* **Blue Edge Glow (`--nyra-accent-glow`):** `rgba(33, 119, 209, 0.22)`
* **Canadian Gold / Due-Soon Alert (`--status-amber`):** `#C39A35` (`--gold-light: #D4AE52`)
* **On-Track Green / Streak (`--status-green`):** `#34C759`
* **Scam Flag / Critical Red (`--status-red`):** `#D04040` (`#B03030`)

---

## 2. Igloo-Lite Atmospheric Canvas Tokens (`igloo.inc`)

* **Void Background (`--bg-void`):** `#0B0E14` (Deep matte obsidian)
* **Surface Background (`--bg-surface`):** `#121620` (Subtle blue-slate elevation)
* **Frosted Glass Panel (`--bg-glass`):** `rgba(18, 22, 32, 0.74)` with `backdrop-filter: blur(16px)`
* **Slate Grid Border (`--border-slate`):** `#383E4E`
* **Subtle Wire Border (`--border-subtle`):** `rgba(182, 186, 197, 0.14)`
* **Primary Text (`--text-primary`):** `#F1F5F9`
* **Silver Subtitle (`--text-silver`):** `#B6BAC5`
* **Muted HUD Indicator (`--text-muted`):** `#64748B`

---

## 3. Typography & Hierarchy

* **Display & Editorial Headings:** `Space Grotesk`, sans-serif (tracking `-0.03em`, uppercase lead-ins)
* **Body / System UI:** `Inter`, system-ui, sans-serif
* **HUD Telemetry & A2UI Wire:** `JetBrains Mono` / `Geist Mono`, ui-monospace

---

## 4. Atmospheric Micro-Interactions

* **Monospace Character Scramble:** Rapid 30-cycle text scramble on hover and mount.
* **Frosted Shield Visual:** Pure CSS + SVG geometric prism with subtle parallax (`±8px`) and blue core refraction.
* **A2UI Wire Inspector:** Monospace inspection drawer revealing raw JSON envelopes.
