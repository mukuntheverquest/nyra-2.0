Save this file as **NYRA\_2\_A2UI\_DASHBOARD\_UPGRADE.md** in the root of your nyra-2.0 repository and instruct Google Antigravity: *"Read NYRA\_2\_A2UI\_DASHBOARD\_UPGRADE.md and execute Phase 1 through Phase 5 sequentially, verifying every test before advancing."*

Markdown  
\# NYRA 2.0 — IGLOO-LITE DASHBOARD & A2UI MOBILE APP UPGRADE SPECIFICATION

**\*\*Target Project:\*\*** \`nyra-2.0\` (Financial Futures Education — Guardrailed AI Agent Harness)    
**\*\*Scope:\*\***  
1\. Use the installed **\*\*Reverse Engineer Anything (\`rea\`)\*\*** skill to extract exact design tokens from \`https\://www\.nyra-app.ca/\` and simplified atmospheric layout/motion patterns from \`https\://www\.igloo.inc/\`.  
2\. Upgrade the **\*\*Backend\*\*** to emit schema-validated **\*\*A2UI Protocol (v1.0)\*\*** declarative UI surfaces (\`createSurface\`, \`updateComponents\`, \`updateDataModel\`, \`deleteSurface\`) and handle **\*\*bidirectional user actions\*\*** (\`POST /api/a2ui/action\`) without breaking any existing FastAPI endpoints or guardrails.  
3\. Upgrade the **\*\*Frontend\*\*** into an **\*\*Igloo-Lite \+ Nyra Blue\*\*** dashboard housing an interactive **\*\*A2UI-powered Mobile App\*\*** where every AI agent response renders as native, interactive React widgets rather than plain text bubbles.

**\*\*Execution Rule:\*\*** Inspect the existing \`backend/\`, \`frontend/\`, and locally installed \`a2ui\` repository first. Preserve 100% of existing harness guardrails (zero bank linking, PII scrubber, 25 AI msg/mo quota, CASL \`STOP\`/\`START\`, Claude Haiku 5.5 prompt caching, and Offline Mock mode).

\---

\#\# 0\. PRE-FLIGHT DISCOVERY (USING INSTALLED REPOS)

Before writing code, execute these three discovery checks:

1\. **\*\*Inspect Existing Codebase:\*\*** Read \`backend/main.py\`, \`backend/agent/router.py\`, \`backend/agent/tools.py\`, \`backend/agent/mock\_engine.py\`, and all files in \`frontend/src/\` to map existing API contracts and state shapes.  
2\. **\*\*Inspect Installed A2UI Repo (\`a2ui-project/a2ui\`):\*\***  
   \* Locate the installed \`a2ui\` directory or package (\`@a2ui/web\_core\`, \`@a2ui/react\`, or \`specification/v1.0\` / \`v0\_9\`).  
   \* Confirm the exact installed package exports. If \`@a2ui/web\_core\` / React adapter is directly importable in \`frontend/\`, wire it directly. Otherwise, implement a strict **\*\*A2UI v1.0-compliant \`MessageProcessor\` \+ React Widget Catalog\*\*** matching the installed \`a2ui\` spec (\`application/a2ui+json\` envelopes, flat adjacency list with \`"id": "root"\`, \`"component": "Type"\` discriminators, and JSON Pointer data bindings).  
3\. **\*\*Run Reverse Engineer Anything (\`rea\`) Analysis:\*\***  
   \* **\*\*Target 1 (\`https\://www\.nyra-app.ca/\`):\*\*** Inspect and extract the exact primary brand accent hex (\`--nyra-accent\`), hover/bright accent shade, status colors (on-track blue, due-soon amber), and brand copy tone. Save findings to \`docs/DESIGN\_TOKENS.md\`.  
   \* **\*\*Target 2 (\`https\://www\.igloo.inc/\`):\*\*** Inspect layout structure, matte slate/obsidian palette (\`\#0B0E14\`, \`\#121620\`, \`\#383E4E\`, \`\#B6BAC5\`), geometric grotesque \+ monospace HUD typography, scroll-waypoint navigation, and text-scramble micro-interactions.  
   \* **\*\*Simplification Rule:\*\*** Do **\*\*NOT\*\*** copy proprietary assets or heavy 3D WebGL/Houdini shaders from \`igloo.inc\`. Replicate its editorial polish using pure CSS gradients, frosted glass panels, lightweight SVG parallax, and a small React text-scramble hook.

\---

\#\# 1\. ARCHITECTURAL PRINCIPLE: DETERMINISTIC A2UI COMPILATION

To keep Claude Haiku 5.5 costs under **\*\*\$0.02 CAD/user/month\*\*** and prevent LLM layout hallucinations, **\*\*do NOT ask the LLM to write raw A2UI JSON directly.\*\***

Instead, insert a **\*\*Deterministic A2UI Surface Compiler\*\*** between the existing Python tools and the mobile app:

\`\`\`text  
\[User Text OR Mobile A2UI Button Tap\]  
                 │  
     ┌───────────┴──────────────────────────────┐  
     ▼                                          ▼  
\[POST /api/chat\]                      \[POST /api/a2ui/action\]  
  1\. pii\_scrubber.py (zero-trust)       (Bidirectional UI Action:  
  2\. quota\_guard.py (CASL & 25 cap)      e.g. tap "Mark Paid",  
  3\. Claude Haiku 5.5 Tool Call          "Cancel Trial", "Block Scam")  
     (max\_tokens=300, cached)                     │  
  4\. Deterministic Python Tool                    │ Executes Python tool  
     (bill / scam / ontario\_calc / RAG)           │ directly (\$0.00 LLM cost\!)  
                 │                                │  
                 └───────────────┬────────────────┘  
                                 ▼  
              \[backend/a2ui/compiler.py (A2UI v1.0)\]  
               • Validates against Nyra Widget Catalog whitelist  
               • Emits ordered A2UI JSON messages:  
                 1\. createSurface (surfaceId, catalogId, root)  
                 2\. updateComponents (flat adjacency list)  
                 3\. updateDataModel (JSON Pointer bindings)  
                                 │  
                                 ▼  
     \[Mobile App A2UI Renderer (frontend/src/components/a2ui/)\]  
       • Parses A2UI messages \-\> renders native React widgets  
       • Dispatches interactive button clicks back to /api/a2ui/action  
\`\`\`

**\*\*Why this matters:\*\*** A2UI enforces a strict **\*\*trust boundary\*\***—the agent can only compose pre-registered, safe widgets from Nyra's catalog (zero arbitrary HTML/JS execution), and interactive card actions (like marking a bill paid) update the surface in place via \`updateDataModel\` at **\*\*\$0.00 LLM cost\*\***.

\---

\#\# 2\. BACKEND A2UI PROTOCOL UPGRADE (\`backend/a2ui/\`)

Create a new module \`backend/a2ui/\` with three files and wire it into \`backend/main.py\`:

\#\#\# 2.1 Approved Component Catalog (\`backend/a2ui/catalog.py\`)  
Register the **\*\*Nyra Mobile A2UI Catalog\*\*** (\`catalogId: "nyra.ffe.mobile.v1"\`), combining standard A2UI v1.0 primitives with 4 tightly scoped custom financial widgets:

\* **\*\*Standard A2UI Primitives:\*\*** \`Card\`, \`Column\`, \`Row\`, \`Text\` (\`variant\`: \`h3\`, \`body\`, \`caption\`, \`mono\`), \`Badge\`, \`Divider\`, \`List\`, \`Button\` (\`variant\`: \`primary\`, \`secondary\`, \`danger\`, \`borderless\`; \`action\`: \`{ name, context }\`), \`ProgressBar\`.  
\* **\*\*Nyra Custom Whitelisted Widgets:\*\***  
  1\. \`ScamRiskBanner\` — Props: \`riskLevel\` (\`HIGH\` \| \`SUSPICIOUS\` \| \`LOW\`), \`scamType\`, \`mitreTactic\`, \`score\`.  
  2\. \`PaychequeGauge\` — Props: \`monthlyNet\`, \`monthlyRent\`, \`rentPct\`, \`status\` (\`Healthy\` \| \`Tight\` \| \`High Strain\`).  
  3\. \`BillStatusRow\` — Props: \`billId\`, \`name\`, \`amount\`, \`nextDueDate\`, \`category\`, \`isPad\`, \`statementDay\`, \`status\`.  
  4\. \`ImpactStatStrip\` — Props: \`streakMonths\`, \`lateFeesSaved\`, \`impactMinutesFunded\`.

\#\#\# 2.2 Deterministic A2UI Surface Compiler (\`backend/a2ui/compiler.py\`)  
Every response from \`/api/chat\` and \`/api/a2ui/action\` returns both the concise SMS fallback text (\`reply\_text\`) **\*\*and\*\*** an ordered list of A2UI v1.0 envelopes (\`a2ui\_messages: list\[dict\]\`, MIME \`application/a2ui+json\`).

Build dedicated surface compilers for all **\*\*6 Nyra 2.0 agent flows\*\***:

1\. **\*\*Bill / Trial Kill-Switch Surface (\`compile*\_bill\_*or*\_trial\_*surface\`)\*\***  
   \* Triggered by \`add\_bill\`, \`add\_trial\_killswitch\`, \`mark\_bill\_paid\`, or \`list\_upcoming\_bills\`.  
   \* Renders a \`Card\` with \`BillStatusRow\` items, auto-rolled due date / 48-hour cancel-by date, PAD balance warning badge if \`is\_pad=1\`, and interactive A2UI \`Button\` actions:  
     \* \`action: { name: "mark\_bill\_paid", context: { bill\_id, bill\_name } }\`  
     \* \`action: { name: "cancel\_trial\_alert", context: { trial\_id, service\_name } }\`  
     \* \`action: { name: "snooze\_reminder", context: { bill\_id, days: 1 } }\`  
2\. **\*\*Canadian Scam Shield Surface (\`compile*\_scam\_*shield*\_surface\`)\*\****  
   ***\* Triggered by \`analyze\_scam\_message\`.***  
   ***\* Renders \`ScamRiskBanner\` (\`HIGH RISK\` red / \`SUSPICIOUS\` amber / \`LIKELY SAFE\` green \+ MITRE F3 tactic), a structured \`List\` of the 3 plain-English red flags, exact next-step guidance, and interactive \`Button\` actions:***  
     ***\* \`action: { name: "confirm\_scam\_blocked", context: { scam\_log\_id } }\` (updates data model to show green \`"Blocked & Logged"\` state)***  
     ***\* \`action: { name: "view\_ca\_antifraud\_steps", context: { scam\_type } }\`***  
***3\. \*\*Ontario 2026 Paycheque & Rent Surface (\`compile\_*****paycheque*\_surface\`)\*\****  
   ***\* Triggered by \`ontario\_paycheque\_and\_rent\_check\`.***  
   ***\* Renders \`PaychequeGauge\` \+ clean 2-column breakdown (\`Gross Monthly\`, \`Fed \+ ON Tax\`, \`CPP \+ EI\`, \`Est. Net Take-Home\`) \+ mandatory muted caption: \*"Approximate 2026 educational estimate only — not official tax or payroll advice."\****  
   ***\* Includes interactive button: \`action: { name: "add\_rent\_as\_bill", context: { amount: monthly\_rent, due\_day: 1 } }\` so the user can turn the checked rent into a tracked bill in 1 tap.***  
***4\. \*\*FFE Money Coach Surface (\`compile\_coach\_surface\`)\*\****  
   ***\* Triggered by \`search\_ffe\_curriculum\`.***  
   ***\* Renders a clean educational \`Card\` with grounded takeaway bullets, FFE curriculum source tag (e.g., \`FFE KB // 03\_canadian\_credit\_scores\`), and mandatory non-advisory disclaimer footer.***  
***5\. \*\*Zero-Trust PII Guardrail Surface (\`compile\_pii\_block\_surface\`)\*\****  
   ***\* Triggered by \`pii\_scrubber.py\` when SIN, card, or bank info is detected (\`est\_cost\_usd \= 0.0\`).***  
   ***\* Renders a green/emerald security confirmation \`Card\` showing redacted PII types (\`\[REDACTED\_SIN\]\`), confirming \`"Blocked before LLM API call — \$0.00 spent"\`, with a quick retry button.***  
***6\. \*\*9 AM Batched SMS Digest & Monthly Impact Surface (\`compile\_digest\_surface\`)\*\****  
   ***\* Triggered by \`/api/demo/trigger-cron\`.***  
   ***\* Renders \`ImpactStatStrip\` (Streak, Late Fees Saved, 20% Youth Impact Pool minutes) \+ batched list of upcoming bills/trials with 1-tap \`Mark Paid\` buttons on each row.***

***\#\#\# 2.3 Bidirectional A2UI Action Endpoint (\`backend/main.py\`)***  
***Keep all existing routes intact and add:***  
***\* \*\*\`POST /api/chat\`\*\*: Extend response payload to include:***  
  ***\`\`\`json***  
  ***{***  
    ***"reply\_text": "...",***  
    ***"skill\_used": "scam\_shield",***  
    ***"a2ui\_mime": "application/a2ui+json",***  
    ***"a2ui\_messages": \[***  
      ***{ "version": "1.0", "createSurface": { "surfaceId": "surf\_...", "catalogId": "nyra.ffe.mobile.v1", "sendDataModel": true } },***  
      ***{ "version": "1.0", "updateComponents": { "surfaceId": "surf\_...", "components": \[ ... \] } },***  
      ***{ "version": "1.0", "updateDataModel": { "surfaceId": "surf\_...", "path": "/", "value": { ... } } }***  
    ***\],***  
    ***"telemetry": { ... },***  
    ***"state": { ... }***  
  ***}***  
  ***\`\`\`***  
***\* \*\*\`POST /api/a2ui/action\`\*\*: Accepts \`{ "surfaceId": str, "actionName": str, "context": dict, "dataModel": dict }\`.***  
  ***\* Executes deterministic Python handlers (\`mark\_bill\_paid\`, \`cancel\_trial\_alert\`, \`snooze\_reminder\`, \`add\_rent\_as\_bill\`, \`confirm\_scam\_blocked\`, \`view\_ca\_antifraud\_steps\`) directly against SQLite with \*\*\$0.00 LLM cost\*\*.***  
  ***\* Logs \`skill\_used="a2ui\_direct\_action"\`, \`est\_cost\_usd=0.0\` in \`usage\_telemetry\`.***  
  ***\* Returns \`updateDataModel\` (and optional \`updateComponents\`) targeting the same \`surfaceId\` so the mobile card mutates smoothly in place, plus refreshed \`state\`.***

***\---***

***\#\# 3\. FRONTEND A2UI MOBILE RENDERER (\`frontend/src/components/a2ui/\`)***

***Build the mobile app's native A2UI rendering engine in \`frontend/src/components/a2ui/\`:***

***1\. \*\*\`processor.ts\` (A2UI v1.0 State & Binding Engine):\*\****  
   ***\* Uses \`@a2ui/web\_core\` if directly installed in \`frontend/package.json\`; otherwise implements a strict TypeScript \`A2UIMessageProcessor\` that:***  
     ***\* Maintains a \`Map\<surfaceId, { catalogId, componentsById, dataModel }\>\`.***  
     ***\* Handles \`createSurface\`, \`updateComponents\` (flat adjacency list starting at \`id: "root"\`), \`updateDataModel\` (JSON Pointer path resolution), and \`deleteSurface\`.***  
     ***\* Resolves \`DynamicString\` / \`DynamicNumber\` / \`DynamicBoolean\` bindings (literal values or JSON Pointer paths like \`/bill/status\`).***  
***2\. \*\*\`NyraWidgetCatalog.tsx\` (Whitelisted React Components):\*\****  
   ***\* Maps every allowed component discriminator (\`Card\`, \`Column\`, \`Row\`, \`Text\`, \`Badge\`, \`Divider\`, \`List\`, \`Button\`, \`ProgressBar\`, \`ScamRiskBanner\`, \`PaychequeGauge\`, \`BillStatusRow\`, \`ImpactStatStrip\`) to styled \*\*Igloo-Lite \+ Nyra Blue\*\* React components.***  
   ***\* Rejects any unregistered component type safely (never renders raw HTML or \`dangerouslySetInnerHTML\`).***  
***3\. \*\*\`A2UISurfaceRenderer.tsx\`:\*\****  
   ***\* Recursively walks the adjacency list from \`id: "root"\`, resolves bound values from \`dataModel\`, and routes every \`Button\` click to \`onAction(surfaceId, actionName, context, dataModel)\` → \`POST /api/a2ui/action\`.***  
   ***\* Includes a subtle monospace toggle icon (\`\</\> A2UI\`) on each rendered mobile card that expands a compact inline drawer showing the raw \`createSurface\` / \`updateComponents\` / \`updateDataModel\` JSON envelopes.***  
***4\. \*\*\`MobileA2UIApp.tsx\` (Replaces/Upgrades \`PhoneSimulator.tsx\`):\*\****  
   ***\* Sleek dark-glass iPhone-style mobile app frame with status bar (\`9:41\`, \`Nyra 2.0 · A2UI v1.0\`, live connection dot).***  
   ***\* Top mobile tab pills: \*\*\`Chat & Cards\`\*\* (A2UI stream) and \*\*\`My Bills\`\*\* (native mobile summary synced with backend state).***  
   ***\* Renders user messages as \*\*Nyra Blue\*\* bubbles and agent responses as \*\*live, interactive A2UI surfaces\*\* (with graceful fallback to plain SMS text if a message has no A2UI payload).***  
   ***\* Pinned below the mobile frame: \*\*5 One-Click Test Chips\*\* styled in monospace:***  
     ***1\. \`Trial Kill-Switch\` (\`"Just started an Adobe free trial today for 14 days, remind me 2 days before it charges"\`)***  
     ***2\. \`Scam Shield\` (\`"INTERAC: You received \$240 from OSAP Refund. Claim now at bit.ly/osap-refund-ca before it expires in 24 hours\!"\`)***  
     ***3\. \`2026 Paycheque Check\` (\`"I make \$18/hr working 20 hours a week in Ontario. Can I afford \$850 rent?"\`)***  
     ***4\. \`PII Guardrail\` (\`"My SIN is 123-456-789, can you check my CRA tax return?"\`)***  
     ***5\. \`Mark Paid \+ Streak\` (\`"Just paid my Rogers Phone bill\!"\`)***

***\---***

***\#\# 4\. IGLOO-LITE \+ NYRA BLUE DASHBOARD DESIGN (\`frontend/\`)***

***\#\#\# 4.1 Design Tokens (\`frontend/src/app/globals.css\`)***  
***Populate \`--nyra-accent\` with the exact hex extracted by \`rea\` from \`nyra-app.ca\` in Phase 1 (defaulting to Nyra Blue \`\#2563EB\` / \`\#3B82F6\` if unavailable):***

***\`\`\`css***  
***:root {***  
  ***/\* Igloo-Lite Atmospheric Matte Slate Canvas \*/***  
  ***\--bg-void: \#0B0E14;***  
  ***\--bg-surface: \#121620;***  
  ***\--bg-glass: rgba(18, 22, 32, 0.74);***  
  ***\--border-slate: \#383E4E;***  
  ***\--border-subtle: rgba(182, 186, 197, 0.14);***  
  ***\--text-primary: \#F1F5F9;***  
  ***\--text-silver: \#B6BAC5;***  
  ***\--text-muted: \#64748B;***

  ***/\* Nyra Brand Accent (Overwrite with exact REA-extracted hex from nyra-app.ca) \*/***  
  ***\--nyra-accent: \#2563EB;***  
  ***\--nyra-accent-bright: \#3B82F6;***  
  ***\--nyra-accent-glow: rgba(59, 130, 246, 0.22);***

  ***/\* Semantic Status & Guardrail Tokens \*/***  
  ***\--status-amber: \#F59E0B;***  
  ***\--status-red: \#EF4444;***  
  ***\--status-green: \#10B981;***  
***}***  
***\`\`\`***

***\* \*\*Fonts (\`layout.tsx\` via \`next/font/google\`):\*\* \`Space Grotesk\` (display headings), \`Inter\` (UI/body), \`JetBrains Mono\` (HUD indices, telemetry, A2UI wire payloads).***  
***\* \*\*Lightweight Motion (\`frontend/src/components/ui/\`):\*\****  
  ***\* \`ScrambleText.tsx\`: 30-line monospace character-scramble hover/mount effect (respects \`prefers-reduced-motion\`).***  
  ***\* \`FloatingShieldVisual.tsx\`: Pure CSS \+ crisp SVG frosted-glass prism/shield with subtle mouse parallax (\`±8px\`) and Nyra Blue edge glow.***

***\#\#\# 4.2 4-Chapter Editorial Dashboard Layout (\`frontend/src/app/page.tsx\`)***

***1\. \*\*Persistent Minimal Top HUD (\`NavbarHud.tsx\`):\*\****  
   ***\* Left: Geometric emblem \+ \`NYRA 2.0\` (\`font-mono\`) \+ \`FFE // A2UI v1.0\`.***  
   ***\* Center: Scroll-synced waypoint links (\`00 INTRO\` · \`01 MOBILE \+ DASHBOARD\` · \`02 ENGINE\` · \`03 ACCESS\`).***  
   ***\* Right: \`LIVE HAIKU 5.5\` / \`OFFLINE MOCK\` toggle, \`SETTINGS\`, and primary Nyra Blue CTA (\`LAUNCH WORKSPACE ↓\`).***

***2\. \*\*Chapter \`00 // INTRO\` (\`HeroSection.tsx\`):\*\****  
   ***\* Asymmetric 2-column hero: bold editorial headline (\`NEVER MISS A BILL. NEVER FALL FOR A SCAM.\`) \+ \`FloatingShieldVisual.tsx\` on the right \+ subtle radial Nyra Blue aurora gradient \+ bottom monospace telemetry strip:***  
     ***\`◆ A2UI NATIVE MOBILE WIDGETS · ◆ ZERO BANK LINKING · ◆ \<\$0.02/MO AI COST · ◆ 20% YOUTH IMPACT POOL\`***

***3\. \*\*Chapter \`01 // MOBILE \+ DASHBOARD\` (\`LiveWorkspaceSection.tsx\`):\*\****  
   ***\* Section header with \`Trigger 9 AM SMS Digest\` and \`Reset Demo\` buttons.***  
   ***\* \*\*Left Pane (45%):\*\* \`MobileA2UIApp.tsx\` (interactive A2UI mobile app \+ 5 one-click test chips).***  
   ***\* \*\*Right Pane (55%):\*\* 4 frosted-glass HUD panels (\`border border-\[var(--border-slate)\] backdrop-blur-md\`):***  
     ***1\. \*\*\`BillsAndImpactCard.tsx\`\*\*: Live Payment Streak, Est. Late Fees Saved, Youth Workshops Funded (20% Pool), Tracked Bills table (Blue \= on track, Amber \= due soon, PAD badge), and Active Trial Kill-Switches.***  
     ***2\. \*\*\`TelemetryCard.tsx\`\*\*: Live Haiku 5.5 Token Split (Input / 90%-off Cache Read / Output), exact reply cost (USD & CAD), projected monthly cost/user (\`\< $0.02CAD`),est.grossmargin(`~84%`on`$45/yr\`), and Nyra Blue \`X / 25\` AI quota progress bar.***  
     ***3\. \*\*\`GuardrailLogCard.tsx\`\*\*: Live middleware terminal showing \`PII SCRUBBED BEFORE API CALL\` (green), \`MITRE F3 SCAM FLAG\` (red), \`A2UI DIRECT ACTION (\$0.00)\` (blue), and deterministic tool-call traces.***  
     ***4\. \*\*\`A2UIWireInspector.tsx\`\*\* \*(Collapsible HUD Drawer)\*: Live stream of the latest \`application/a2ui+json\` envelopes (\`createSurface\`, \`updateComponents\`, \`updateDataModel\`) so engineers can verify protocol compliance in real time.***

***4\. \*\*Chapter \`02 // ENGINE\` (\`SkillsBentoSection.tsx\`):\*\****  
   ***\* 4-card bento grid with Nyra Blue top-edge hover glow covering: \`01 / BILL & TRIAL GUARD\`, \`02 / CANADIAN SCAM SHIELD\`, \`03 / FFE MONEY COACH\`, and \`04 / A2UI TRUST BOUNDARY\` (explaining declarative catalog rendering \+ zero-cost bidirectional actions).***

***5\. \*\*Chapter \`03 // ACCESS & IMPACT\` (\`ImpactPricingSection.tsx\`):\*\****  
   ***\* 3-card access row (\`$5/mo`Monthly,`$45/yr\` Annual highlighted in Nyra Blue, \`\$10/seat/yr\` B2B2C Campus & Cohort Bulk) \+ minimal architectural footer (\`nyra-app.ca\`, PIPEDA Privacy & CASL SMS compliance badges, \`© 2026 Financial Futures Education\`).***  
   ***\* Keep \`SettingsModal.tsx\` wired with 1-click Cancel (never auto-cancelling when bills are deleted), 14-day free trial status, B2B2C code redemption (\`MCMASTER-2026\`, \`FFE-COHORT-04\`), PIPEDA notice, and CASL toggle.***

***\---***

***\#\# 5\. PHASED EXECUTION & VERIFICATION CHECKLIST***

***Execute strictly in order and report pass/fail results after each phase:***

***\* \*\*Phase 1 — Discovery & Design Token Extraction:\*\****  
  ***\* Inspect existing \`backend/\`, \`frontend/\`, and installed \`a2ui\` repo.***  
  ***\* Run \`rea\` on \`nyra-app.ca\` and \`igloo.inc\` and write extracted tokens to \`docs/DESIGN\_TOKENS.md\`.***  
***\* \*\*Phase 2 — Backend A2UI Protocol Layer:\*\****  
  ***\* Build \`backend/a2ui/catalog.py\` and \`backend/a2ui/compiler.py\` (all 6 surface compilers).***  
  ***\* Update \`POST /api/chat\` and \`POST /api/demo/trigger-cron\` to return \`a2ui\_messages\` (\`application/a2ui+json\`).***  
  ***\* Implement \`POST /api/a2ui/action\` for zero-LLM-cost bidirectional mobile widget actions (\`mark\_bill\_paid\`, \`cancel\_trial\_alert\`, \`snooze\_reminder\`, \`add\_rent\_as\_bill\`, \`confirm\_scam\_blocked\`, \`view\_ca\_antifraud\_steps\`).***  
  ***\* Ensure \`mock\_engine.py\` also compiles identical A2UI surfaces in Offline Mock mode.***  
***\* \*\*Phase 3 — Mobile App A2UI Renderer:\*\****  
  ***\* Build \`frontend/src/components/a2ui/processor.ts\`, \`NyraWidgetCatalog.tsx\`, \`A2UISurfaceRenderer.tsx\`, and \`MobileA2UIApp.tsx\`.***  
  ***\* Verify tapping \`Mark Paid\` or \`Add Rent as Bill\` inside a rendered A2UI mobile card calls \`POST /api/a2ui/action\`, updates the card via \`updateDataModel\`, updates \`BillsAndImpactCard\` on the right pane, and logs \`\$0.00\` LLM cost in \`TelemetryCard\`.***  
***\* \*\*Phase 4 — Igloo-Lite \+ Nyra Blue Dashboard:\*\****  
  ***\* Apply extracted tokens and Google Fonts (\`Space Grotesk\`, \`Inter\`, \`JetBrains Mono\`) in \`globals.css\` and \`layout.tsx\`.***  
  ***\* Build \`ScrambleText.tsx\`, \`FloatingShieldVisual.tsx\`, \`NavbarHud.tsx\`, \`HeroSection.tsx\`, \`LiveWorkspaceSection.tsx\`, \`A2UIWireInspector.tsx\`, \`SkillsBentoSection.tsx\`, and \`ImpactPricingSection.tsx\`.***  
  ***\* Restyle \`BillsAndImpactCard.tsx\`, \`TelemetryCard.tsx\`, \`GuardrailLogCard.tsx\`, and \`SettingsModal.tsx\` to the unified frosted-slate \+ Nyra Blue theme.***  
***\* \*\*Phase 5 — Automated QA & Build Verification:\*\****  
  ***1\. Ensure all \*\*10 existing tests\*\* in \`backend/tests/test\_harness.py\` still pass.***  
  ***2\. Add and pass \*\*4 new A2UI protocol tests\*\*:***  
     ***\* \`test\_a2ui\_chat\_emits\_valid\_v1\_surface\_envelopes\` (verifies \`createSurface\`, \`updateComponents\` with \`"id": "root"\`, and \`updateDataModel\`)***  
     ***\* \`test\_a2ui\_catalog\_whitelist\_rejects\_unregistered\_components\`***  
     ***\* \`test\_a2ui\_bidirectional\_mark\_paid\_action\_updates\_db\_at\_zero\_llm\_cost\`***  
     ***\* \`test\_a2ui\_pii\_block\_emits\_security\_surface\_without\_llm\_call\`***  
  ***3\. Run \`npm run build\` in \`frontend/\` and confirm \*\*0 TypeScript or Next.js build errors\*\*.***  
  ***4\. Verify all 5 One-Click Test Chips, interactive A2UI card buttons, \`Trigger 9 AM SMS Digest\`, \`Settings & Compliance\`, \`Live / Mock\` toggle, and \`Reset Demo\` work end-to-end against FastAPI on \`http\://localhost:8000\`.***  
