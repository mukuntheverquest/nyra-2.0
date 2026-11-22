# Nyra 2.0 — Google Antigravity Setup & Repository Installation Guide

This setup installs only the **2 core repositories** and **1 cherry-picked security reference** needed to build the **Nyra 2.0 Guardrailed AI Agent Harness** and generate presentation visuals—without bloating Antigravity's context window.

---

## Official GitHub Links

| # | Repository | Role in Nyra 2.0 | Official GitHub URL |
| :--- | :--- | :--- | :--- |
| **1** | **Diagram Design** | Antigravity skill for generating 16:9 HTML/SVG architecture & unit-economics diagrams for the D610 slides and Briefing Note. | https://github.com/cathrynlavery/diagram-design |
| **2** | **Awesome Harness Engineering** | Architectural reference for agent loops, strict JSON tool schemas, permission guardrails, and cost/turn stop limits. | https://github.com/ai-boost/awesome-harness-engineering |
| **3** | **Anthropic Cybersecurity Skills** *(Cherry-Pick Only)* | Source for **MITRE F3 (Fight Fraud Framework)** patterns (for Nyra's Canadian Scam Shield) and **OWASP** web security checks. | https://github.com/mukul975/Anthropic-Cybersecurity-Skills |

> **Skipped intentionally:** `browser-use/browser-use`, `rohitg00/agentmemory`, `K-Dense-AI/scientific-agent-skills`, and `volcengine/OpenViking` (unnecessary complexity for a zero-bank-linking, 6-file RAG harness).

---

## Prerequisites

* **Git** installed (`git --version`)
* **Node.js 18+ / npx** installed (`node -v`)
* **Google Antigravity** (Desktop or CLI)

---

## Step 1: Initialize Your Nyra 2.0 Workspace

Open your terminal (PowerShell or Bash) and create the project directories:

```bash
mkdir nyra-2.0
cd nyra-2.0
git init
mkdir -p .agents/skills docs/references
```
(On Windows PowerShell, run `mkdir .agents\skills, docs\references` instead of `mkdir -p`.)

## Step 2: Install diagram-design as an Antigravity Skill
### Option A — Recommended (Cross-Agent Skills CLI)
Run the official installer and select your project's `.agents/skills/` directory when prompted:

```bash
npx skills add cathrynlavery/diagram-design
```
Note: On Windows without Developer Mode enabled, the CLI automatically copies the skill files instead of creating symlinks.

### Option B — Manual Project-Scope Install (Fallback)
If you prefer cloning directly into `.agents/skills/`:

```bash
git clone --depth 1 https://github.com/cathrynlavery/diagram-design.git temp-diagram
cp -r temp-diagram/skills/diagram-design .agents/skills/diagram-design
rm -rf temp-diagram
```
(Windows PowerShell cleanup: `Copy-Item -Recurse temp-diagram\skills\diagram-design .agents\skills\diagram-design; Remove-Item -Recurse -Force temp-diagram`)

## Step 3: Clone awesome-harness-engineering (Reference Blueprint)
Keep this repository in `docs/references/` (not `.agents/skills/`) so Antigravity only reads it when you explicitly reference harness design patterns during architecture planning:

```bash
git clone --depth 1 https://github.com/ai-boost/awesome-harness-engineering.git docs/references/awesome-harness-engineering
```

## Step 4: Cherry-Pick Fraud & OWASP Security Skills (Do NOT Full-Install)
Anthropic-Cybersecurity-Skills contains 817+ skills. Loading all of them will clutter skill discovery. Use a shallow clone to pull only the MITRE F3 fraud-mapping schema and targeted OWASP / fraud skills, then delete the temporary folder.

### Bash / macOS / Linux
```bash
git clone --depth 1 https://github.com/mukul975/Anthropic-Cybersecurity-Skills.git temp-sec

# 1. Copy the MITRE F3 (Fight Fraud Framework) schema for Nyra's Scam Shield
cp temp-sec/docs/mitre-f3-mapping.md docs/references/mitre-f3-mapping.md

# 2. Copy targeted OWASP / business-logic security skills into Antigravity
cp -r temp-sec/skills/performing-threat-modeling-with-owasp-threat-dragon .agents/skills/
cp -r temp-sec/skills/testing-for-business-logic-vulnerabilities .agents/skills/

# 3. Remove the remaining 815+ unused skills
rm -rf temp-sec
```

### Windows PowerShell
```powershell
git clone --depth 1 https://github.com/mukul975/Anthropic-Cybersecurity-Skills.git temp-sec

# 1. Copy the MITRE F3 (Fight Fraud Framework) schema for Nyra's Scam Shield
Copy-Item temp-sec\docs\mitre-f3-mapping.md docs\references\mitre-f3-mapping.md

# 2. Copy targeted OWASP / business-logic security skills into Antigravity
Copy-Item -Recurse temp-sec\skills\performing-threat-modeling-with-owasp-threat-dragon .agents\skills\
Copy-Item -Recurse temp-sec\skills\testing-for-business-logic-vulnerabilities .agents\skills\

# 3. Remove the remaining 815+ unused skills
Remove-Item -Recurse -Force temp-sec
```

## Step 5: Verify Installation in Google Antigravity
Open the nyra-2.0 folder in Google Antigravity.

Confirm your workspace looks like this:

```plaintext
nyra-2.0/
├── .agents/
│   └── skills/
│       ├── diagram-design/
│       ├── performing-threat-modeling-with-owasp-threat-dragon/
│       └── testing-for-business-logic-vulnerabilities/
└── docs/
    └── references/
        ├── awesome-harness-engineering/
        └── mitre-f3-mapping.md
```

Run this verification prompt inside Antigravity:

*What skills are available in this workspace?*

Confirm `diagram-design` and the two security skills appear in the list before starting your Nyra 2.0 build.
