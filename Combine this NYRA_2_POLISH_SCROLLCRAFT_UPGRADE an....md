Markdown  
\# NYRA 2.0 — UNIFIED UPGRADE: 3D ALPINE HERO, REAL PHONE, SCROLL-CRAFT DASHBOARD & 4TH OUTREACH AGENT

**\*\*Model Execution Guidance:\*\*** Follow every schema, Python module, Three.js geometry snippet, A2UI v0.9 contract, and \`scroll-craft\` integration rule literally. Execute **\*\*Phase 0 through Phase 5\*\*** in exact order. Do NOT switch to dark mode, do NOT break existing Skills 1–3, and do NOT skip verification gates.

\---

\#\# 0\. NON-NEGOTIABLE GUARDRAILS

1\. **\*\*EXTEND BACKEND ADDITIVELY ONLY (DO NOT BREAK SKILLS 1–3):\*\*** Keep existing Bill Guard, Scam Shield, FFE Money Coach, \`pii\_scrubber.py\`, \`quota\_guard.py\`, \`scam\_rules.py\`, \`ontario\_calc.py\`, Claude Haiku 5.5 prompt caching, \`Offline Mock\` mode, and all 14 existing pytest tests 100% intact. Only add the new **\*\*4th Agent (Owner Youth Outreach & Email Agent)\*\*** modules and routes specified in Phase 1\.  
2\. **\*\*PRESERVE REAL A2UI v0.9 RUNTIME:\*\*** Keep \`@a2ui/react/v0\_9\` (\`A2uiSurface\`) and \`@a2ui/web\_core/v0\_9\` (\`MessageProcessor\`) actively rendering live interactive cards inside the mobile app and dispatching \`POST /api/a2ui/action\`.  
3\. **\*\*STRICT HUMAN-IN-THE-LOOP (HITL) FOR OUTREACH EMAILS:\*\*** The LLM (\`claude-haiku-5-5\`) is ONLY allowed to search leads and create \`status='draft'\` emails. Sending an email is strictly a deterministic Python action triggered when the owner taps **\*\*\`Approve & Send Email\`\*\*** on the A2UI v0.9 mobile card (\`\$0.00\` LLM cost). Default delivery is \`OUTREACH\_MODE=sandbox\` (never hits external mail servers unless \`OUTREACH\_MODE=live\` and recipient is in \`OUTREACH\_ALLOWLIST\`).  
4\. **\*\*KEEP BRIGHT WHITE / ALPINE LIGHT THEME:\*\*** Use crisp snowy whites (\`\#FFFFFF\`, \`\#F8FAFC\`), ice-blue alpine shadows (\`\#E2E8F0\`, \`\#DBEAFE\`), deep navy ink (\`\#0F172A\`), and **\*\*Nyra Blue (\`\#2563EB\` / \`\#3B82F6\`)\*\***. Never use dark/black backgrounds.  
5\. **\*\*CLEAN PUBLIC COPY:\*\*** Remove internal dev headers like \`"ACT 3: THE ENGINEERED PEAK — LIVE A2UI RUNTIME"\` and remove the **\*\*\`A2UI v0.9\`\*\*** badge from the top-left corner of the opening 3D hero.  
6\. **\*\*60FPS RULE:\*\*** Never call React \`setState\` inside \`requestAnimationFrame\`. Update Three.js meshes and floating HTML callout card positions via direct \`useRef\` DOM transforms (\`translate3d\`).

\---

\#\# PHASE 0: LOAD & VERIFY THE INSTALLED \`scroll-craft\` SKILL

**\*\*STOP AND INSPECT \`.agents/skills/scroll-craft/\` BEFORE EDITING ANY FILE.\*\***

1\. Read these installed skill files in full:  
   \* \`.agents/skills/scroll-craft/SKILL.md\`  
   \* \`.agents/skills/scroll-craft/references/devices.md\`  
   \* \`.agents/skills/scroll-craft/references/hero-depth.md\`  
   \* All files inside \`.agents/skills/scroll-craft/engine/\`  
2\. Copy or import the real \`scroll-craft\` scroll engine into \`frontend/src/lib/scrollCraftEngine.ts\` (adapted cleanly for React \`useEffect\` lifecycle \+ cleanup) so the **\*\*Mobile Simulator\*\*** and **\*\*Live Dashboard\*\*** run on genuine \`scroll-craft\` mechanics—not generic static divs:  
   \* \`--sc-p\` normalized scroll-progress CSS custom property (\`0\` to \`1\`) driving real scroll-linked entrance scale, vertical lift, and depth offset.  
   \* \`data-sc-tilt\` smooth 3D perspective pointer tilt \+ dynamic specular edge-light sheen on interactive dashboard KPI tiles and simulator trigger cards.  
   \* \`data-sc-magnet\` subtle magnetic cursor pull on primary CTA and simulator trigger buttons.  
   \* Staggered spring-physics choreography, real offset shadows, overlap depth layers, and kinetic count-up/pulse animations whenever live backend state changes.  
3\. Run the skill preflight check and report output:  
   \`\`\`bash  
   node .agents/skills/scroll-craft/scripts/doctor.mjs  
   \`\`\`

\---

\#\# PHASE 1: BACKEND — 4TH AGENT (OWNER YOUTH OUTREACH & EMAIL AGENT \+ A2UI SURFACE 7\)

\#\#\# 1.1 Database Schema (\`backend/db/schema.sql\`)  
Append these two tables:

\`\`\`sql  
CREATE TABLE IF NOT EXISTS outreach\_leads (  
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    name TEXT NOT NULL,  
    email TEXT UNIQUE NOT NULL,  
    organization TEXT NOT NULL,  
    segment TEXT NOT NULL,                   \-- 'youth\_waitlist' \| 'campus\_union' \| 'residence\_life' \| 'workshop\_alumni'  
    casl\_consent\_type TEXT NOT NULL,         \-- 'express\_opt\_in' \| 'implied\_b2b\_inquiry'  
    youth\_reach\_est INTEGER NOT NULL DEFAULT 1, \-- 1 for individual youth, 100-1200+ for campus partners  
    notes TEXT,  
    status TEXT NOT NULL DEFAULT 'new',      \-- 'new' \| 'drafted' \| 'sent' \| 'replied'  
    created\_at TEXT NOT NULL DEFAULT CURRENT\_TIMESTAMP  
);

CREATE TABLE IF NOT EXISTS outreach\_emails (  
    id INTEGER PRIMARY KEY AUTOINCREMENT,  
    lead\_id INTEGER REFERENCES outreach\_leads(id),  
    recipient\_name TEXT NOT NULL,  
    recipient\_email TEXT NOT NULL,  
    segment TEXT NOT NULL,  
    subject TEXT NOT NULL,  
    body\_text TEXT NOT NULL,  
    casl\_verified INTEGER NOT NULL DEFAULT 1,  
    status TEXT NOT NULL DEFAULT 'draft',    \-- 'draft' \| 'approved\_sent' \| 'discarded'  
    delivery\_mode TEXT NOT NULL DEFAULT 'sandbox\_outbox', \-- 'sandbox\_outbox' \| 'smtp\_live'  
    sent\_at TEXT,  
    created\_at TEXT NOT NULL DEFAULT CURRENT\_TIMESTAMP  
);  
\`\`\`

\#\#\# 1.2 Seed 5 Safe Demo Leads (\`backend/db/seed*\_demo.py\`) & CRUD Helpers (\`backend/db/database.py\`)*  
*Pre-seed strictly \`-demo.ca\` addresses (idempotent on reset):*  
*1\. \`Jordan Patel\` \| \`jordan.patel@student-demo.ca\` \| \`McMaster First-Year Waitlist\` \| \`youth\_*waitlist\` \| \`express*\_opt\_*in\` \| \`youth*\_reach\_*est=1\` \| \`"Signed up at campus orientation booth for bill & scam alerts"\`  
2\. \`Priya Nair\` \| \`residence.life@mcmaster-demo.ca\` \| \`McMaster Residence Life\` \| \`residence\_life\` \| \`implied\_b2b\_inquiry\` \| \`youth\_reach\_est=500\` \| \`"Interested in bulk student wellness tools for first-year move-in"\`  
3\. \`Devon Brooks\` \| \`wellness@msu-demo.ca\` \| \`McMaster Students Union\` \| \`campus\_union\` \| \`implied\_b2b\_inquiry\` \| \`youth\_reach\_est=1200\` \| \`"Exploring \$10/seat/yr financial safety perks for undergrads"\`  
4\. \`Chloe Tremblay\` \| \`chloe.t@youth-demo.ca\` \| \`FFE Mississauga Workshop Alumni\` \| \`workshop\_alumni\` \| \`express\_opt\_in\` \| \`youth\_reach\_est=1\` \| \`"Completed FFE independent living workshop; opted in for Nyra beta"\`  
5\. \`Marcus Chen\` \| \`student.success@mohawk-demo.ca\` \| \`Mohawk College Student Life\` \| \`campus\_union\` \| \`implied\_b2b\_inquiry\` \| \`youth\_reach\_est=400\` \| \`"Requested info on scam protection & paycheque literacy for co-op students"\`

Add CRUD helpers in \`backend/db/database.py\`:  
\* \`get\_outreach\_leads(segment="all", status=None, limit=10)\`  
\* \`create\_outreach\_email\_draft(...)\` (also updates matching lead \`status='drafted'\`)  
\* \`get\_outreach\_emails(limit=20)\`  
\* \`update\_outreach\_email\_status(email\_id, status, delivery\_mode, sent\_at=None)\` (when \`approved\_sent\`, updates matching lead \`status='sent'\`)

\#\#\# 1.3 CASL Compliance Guard (\`backend/agent/outreach*\_guard.py\`)*  
*Create \`validate\_*and*\_format\_*outreach*\_email(recipient\_*email, subject, body*\_text, casl\_*consent*\_type)\`:*  
*\* Require \`casl\_*consent*\_type in ("express\_*opt*\_in", "implied\_*b2b*\_inquiry")\`; otherwise return \`casl\_*verified \= False\`.  
\* Validate email format and ensure no \`\[REDACTED\_\` markers are present.  
\* Keep subject concise (\`\<= 90 chars\`) and strip spammy ALL-CAPS.  
\* Automatically append the mandatory CASL footer if not already present:  
  \`\`\`text  
  \---  
  Sent by Financial Futures Education (FFE) · Ontario, Canada · \[https\://nyra-app.ca\](https\://nyra-app.ca)  
  20% of Nyra 2.0 net profits fund free youth financial literacy workshops across Canada.  
  Opt out anytime: reply UNSUBSCRIBE to this email.  
  \`\`\`  
\* Return \`{ "casl\_verified": bool, "clean\_subject": str, "clean\_body": str, "checks\_passed": list\[str\] }\`.

\#\#\# 1.4 Safe Email Dispatcher (\`backend/agent/email*\_sender.py\` & \`backend/config.py\`)*  
*Add env vars in \`backend/config.py\`:*  
*\* \`OUTREACH\_*MODE \= os.getenv("OUTREACH*\_MODE", "sandbox")\` (\`"sandbox"\` \| \`"live"\`)*  
*\* \`OUTREACH\_*ALLOWLIST \= \[e.strip().lower() for e in os.getenv("OUTREACH*\_ALLOWLIST", "").split(",") if e.strip()\]\`*  
*\* \`SMTP\_*HOST\`, \`SMTP*\_PORT\` (default \`587\`), \`SMTP\_*USER\`, \`SMTP*\_PASS\`, \`SMTP\_*FROM\`

Implement \`dispatch\_approved\_email(recipient\_email, subject, body\_text)\`:  
\* If \`OUTREACH\_MODE \== "live"\` AND \`SMTP\_HOST\` is set AND \`recipient\_email.lower() in OUTREACH\_ALLOWLIST\`: send via Python \`smtplib.SMTP(SMTP\_HOST, int(SMTP\_PORT))\` with \`starttls()\` and \`EmailMessage\`, returning \`{ "delivered": True, "delivery\_mode": "smtp\_live" }\`.  
\* Otherwise (default safe path): never make external network calls; return \`{ "delivered": True, "delivery\_mode": "sandbox\_outbox", "note": "Logged in Nyra 2.0 Outbox (Sandbox Mode)" }\`.

\#\#\# 1.5 Add Tools \#8 & \#9 (\`backend/agent/tools.py\`) \+ Update Prompt, Router & Mock Engine  
Keep Tools 1–7 untouched and append Tools 8 & 9 (move \`"cache\_control": {"type": "ephemeral"}\` to Tool 9):  
\* **\*\*Tool 8 — \`find*\_youth\_*outreach*\_leads\`:\*\* Inputs: \`segment ('all'\|'youth\_waitlist'\|'campus\_union'\|'residence\_life'\|'workshop\_alumni', default 'all')\`, \`limit (int, default 5)\`. Queries \`outreach\_leads\`.***  
***\* \*\*Tool 9 — \`draft\_outreach\_email\`:\*\* Inputs: \`lead\_id (int \| None)\`, \`recipient\_name\`, \`recipient\_email\`, \`segment\`, \`subject\`, \`body\_text\`. Looks up consent from \`outreach\_leads\` (defaults \`'express\_opt\_in'\` if manually supplied), validates via \`validate\_and\_format\_outreach\_email(...)\`, inserts into \`outreach\_emails\` with \`status='draft'\`, and returns structured draft JSON including \`email\_id\` and \`youth\_reach\_est\`.***  
***\* \*\*Update \`backend/agent/system\_prompt.md\`:\*\* Change heading to \*\*\`YOUR 4 BOUNDED SKILLS (ALWAYS USE YOUR TOOLS):\`\*\* and add:***  
  ***\`\`\`markdown***  
  ***4\. Owner Outreach Agent: When the owner (Sanya or Aryan) asks to find potential young customers, campus partners, or draft/send an outreach email, ALWAYS call \`find\_youth\_outreach\_leads\` and/or \`draft\_outreach\_email\`. Write warm, concise, youth-relevant emails (never corporate jargon). NEVER claim an email has already been sent — always present the draft for 1-tap owner approval via the A2UI card.***  
  ***\`\`\`***  
***\* \*\*Update \`backend/agent/router.py\`:\*\* Tag Tools 8 & 9 as \`skill\_used \= "outreach\_agent"\` and compile the response via \`compile\_outreach\_draft\_surface(...)\`.***  
***\* \*\*Update \`backend/agent/mock\_engine.py\`:\*\* Match prompts containing \`outreach\`, \`email\`, \`leads\`, \`campus\`, \`waitlist\`, or \`reach young\` (plus specific lead names like \`Priya\`, \`Jordan\`, \`Devon\`, \`Chloe\`, \`Marcus\`). Query the real SQLite lead, execute the real \`draft\_outreach\_email(...)\` CASL validator \+ DB insert, and emit Surface 7 so Offline Mock mode behaves identically to Live Haiku 5.5 API.***

***\#\#\# 1.6 A2UI v0.9 Surface 7 & Direct Action Handlers (\`backend/a2ui/compiler.py\` & \`backend/main.py\`)***  
***\* \*\*Surface 7 (\`compile\_outreach\_draft\_surface\`):\*\* Emits valid A2UI v0.9 messages (\`createSurface\`, \`updateComponents\`, \`updateDataModel\`) rendering an interactive \*\*Owner Email Approval Card\*\* inside \`@a2ui/react/v0\_9\`:***  
  ***\* Header: \`OUTREACH DRAFT · CASL VERIFIED ✓\` \+ Organization & Youth Reach badge (e.g., \`McMaster Residence Life · \~500 youth reach\`).***  
  ***\* Bound fields: \`To:\` (\`{ "path": "/email/recipient" }\`), \`Subject:\` (\`{ "path": "/email/subject" }\`), \`Body Preview:\` (\`{ "path": "/email/body" }\`), \`Status:\` (\`{ "path": "/email/statusLabel" }\`, initialized to \`"Pending Owner Approval"\`).***  
  ***\* Interactive A2UI buttons:***  
    ***1\. Primary Nyra Blue: \*\*\`Approve & Send Email\`\*\* → \`{ "actionName": "approve\_send\_outreach\_email", "context": { "email\_id": email\_id } }\`***  
    ***2\. Secondary: \*\*\`Discard Draft\`\*\* → \`{ "actionName": "discard\_outreach\_email", "context": { "email\_id": email\_id } }\`***  
***\* \*\*Add to \`POST /api/a2ui/action\` (\`backend/main.py\`):\*\****  
  ***\* \`approve\_send\_outreach\_email\`: Calls \`dispatch\_approved\_email(...)\`, updates \`outreach\_emails\` (\`status='approved\_sent'\`, \`sent\_at\`, \`delivery\_mode\`) and \`outreach\_leads\` (\`status='sent'\`), logs \`skill\_used="a2ui\_outreach\_send"\` with \`est\_cost\_usd=0.0\` in \`usage\_telemetry\`, and returns \`updateDataModel\` updating \`/email/statusLabel\` to \`"Sent ✓ (Logged in Outbox · \$0.00 AI)"\` \+ refreshed \`state\`.***  
  ***\* \`discard\_outreach\_email\`: Updates \`outreach\_emails\` (\`status='discarded'\`), logs \`\$0.00\` cost, and returns \`updateDataModel\` setting \`/email/statusLabel\` to \`"Draft Discarded"\`.***  
***\* \*\*Add to \`GET /api/state\` (and \`state\` payload in \`/api/chat\` & \`/api/a2ui/action\`):\*\* Include \`outreach\_leads\`, \`outreach\_emails\`, and \`outreach\_summary\` (\`total\_leads\`, \`drafts\_pending\`, \`emails\_sent\`, \`est\_youth\_reached\`, \`outreach\_mode\`).***

***\---***

***\#\# PHASE 2: FRONTEND — 3D SNOWY ALPINE HERO, BLUE \`\$\`, BIG LOGO & POPPING CALLOUTS (\`frontend/src/components/hero3d/\`)***

***Inspect \`DollarSculptureStage.tsx\` and \`dollarBlocks.ts\` and apply all \*\*4 visual upgrades\*\*:***

***\#\#\# 2.1 Two-Tone Nyra Blue & Frosted Alpine White \`\$\` Sculpture***  
***\* \*\*\`stem\` blocks (6 vertical spine blocks) \+ center bar (\`s\_m1\`, \`s\_m2\`, \`s\_m3\`):\*\* Rich satin \*\*Nyra Blue\*\* PBR material:***  
  ***\`\`\`ts***  
  ***const nyraBlueBlockMat \= new THREE.MeshPhysicalMaterial({***  
    ***color: '\#2563EB',***  
    ***emissive: '\#1D4ED8',***  
    ***emissiveIntensity: 0.22,***  
    ***roughness: 0.24,***  
    ***metalness: 0.12,***  
    ***clearcoat: 0.75,***  
    ***clearcoatRoughness: 0.18,***  
  ***});***  
  ***\`\`\`***  
***\* \*\*Outer \`s\_curve\` blocks:\*\* Crisp frosted alpine-white (\`color: '\#F1F5F9'\`, \`roughness: 0.26\`, \`clearcoat: 0.65\`) WITH thin glowing \*\*Nyra Blue bevel edge lines\*\* (\`EdgesGeometry\` with \`\#3B82F6\`, \`opacity: 0.42\`) so the \`\$\` silhouette pops dramatically against the snowy mountains.***  
***\* \*\*4 \`detached\` floating blocks:\*\* Bright crystalline \*\*Nyra Blue\*\* (\`color: '\#3B82F6'\`, \`emissive: '\#2563EB'\`, \`emissiveIntensity: 0.35\`, \`clearcoat: 0.85\`) with \`\#1D4ED8\` wireframe edges.***  
***\* \*\*Inner Seam Core \+ Point Light:\*\* Recessed glowing core (\`\#2563EB\`, \`emissiveIntensity: 2.8\`) \+ center \`PointLight('\#3B82F6', 6.0, 8.0)\` spilling blue light across surrounding white block edges.***

***\#\#\# 2.2 Procedural 3D Snowy Alpine Mountains Background (Igloo-Inspired Daylight Palette)***  
***Replace the empty white grid with a 3-layer \*\*3D Snowy Mountain Landscape\*\*:***  
***\* \*\*Daylight Alpine Sky CSS behind transparent WebGL:\*\****  
  ***\`\`\`css***  
  ***background: linear-gradient(180deg, \#E8F1FC 0%, \#F4F8FD 42%, \#FFFFFF 100%);***  
  ***\`\`\`***  
***\* \*\*Atmospheric Mist:\*\* \`scene.fog \= new THREE.FogExp2('\#EEF4FB', 0.036);\`***  
***\* \*\*3 Independent Parallax Mountain Layers (\`PlaneGeometry\` vertex displacement \+ \`computeVertexNormals()\`):\*\****  
  ***1\. \*\*Foreground Snowy Ridge (\`y \= \-3.35\`, \`z \= \-1.5\`, \`34×16\`, \`64×32\` segs):\*\* Gentle snow bank with central pedestal crest beneath the \`\$\` and higher ridges on far left/right. Material: \`MeshStandardMaterial({ color: '\#F8FAFC', roughness: 0.88, metalness: 0.02, flatShading: true })\`.***  
  ***2\. \*\*Midground Alpine Peaks (\`y \= \-3.6\`, \`z \= \-9.5\`, \`56×18\`, \`80×28\` segs):\*\* Dramatic jagged snow peaks framing left (\`x ≈ \-11\`, height \`\~7.5\`) and right (\`x ≈ \+12\`, height \`\~8.2\`) with an open sunlit valley saddle behind the \`\$\`:***  
     ***\`\`\`ts***  
     ***const ridge \= (x: number, z: number) \=\> {***  
       ***const sideValley \= Math.min(1, Math.abs(x) / 7.5);***  
       ***const n1 \= Math.abs(Math.sin(x \* 0.22 \+ 0.7) \* Math.cos(z \* 0.18)) \* 5.8;***  
       ***const n2 \= Math.abs(Math.sin(x \* 0.51 \- z \* 0.33)) \* 2.4;***  
       ***const n3 \= Math.sin(x \* 1.15 \+ z \* 0.9) \* 0.55;***  
       ***return (n1 \+ n2 \+ n3) \* (0.35 \+ 0.85 \* sideValley);***  
     ***};***  
     ***\`\`\`***  
     ***Material: \`\#E6EEF8\` (\`flatShading: true\`) so sunlit snow faces gleam white while shadowed cliff facets show crisp glacial slate-blue.***  
  ***3\. \*\*Distant Misty Summit Range (\`y \= \-3.2\`, \`z \= \-18.5\`, \`78×14\`, \`72×20\` segs):\*\* Tall distant summits (\`height up to 11.5\`) in soft ice-blue \`\#DCE7F5\` dissolving into \`FogExp2\`.***  
***\* \*\*Depth Parallax & Snow:\*\* Move Layer 3 at \`0.15×\`, Layer 2 at \`0.40×\`, Layer 1 at \`0.75×\` of pointer/camera motion (\`scroll-craft/references/hero-depth.md\`). Add 90 soft drifting snowflakes (\`\#FFFFFF\` / \`\#93C5FD\`, \`opacity: 0.65\`).***

***\#\#\# 2.3 Top-Left Brand Corner: Remove \`A2UI v0.9\` & Enlarge \`NYRA 2.0\` Logo***  
***\* \*\*DELETE\*\* the \`A2UI v0.9\` badge/text from the top-left corner.***  
***\* \*\*SCALE UP\*\* the top-left emblem and brand lockup:***  
  ***\* Icon box: \*\*\`w-14 h-14\` (\`56px × 56px\`)\*\* rounded-2xl Nyra Blue (\`\#2563EB\`) emblem with \`shadow-lg shadow-blue-600/25\` and bold white shield/coin icon inside.***  
  ***\* Wordmark: \*\*\`text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900\`\*\* reading \*\*\`NYRA 2.0\`\*\* (completely static, zero scramble glitches).***  
  ***\* Subtitle: \*\*\`text-xs md:text-sm font-mono font-medium text-slate-600\`\*\* reading \*\*\`Financial Futures Education · Canada\`\*\*.***

***\#\#\# 2.4 Bigger, Popping Floating Callout Cards (\`01\`–\`04\`)***  
***Replace tiny SVG text with \*\*bold floating HTML Pop-Up Cards\*\* synced to the 4 detached blue blocks via \`useRef\` DOM transforms (\`translate3d\`), using \`\<svg\>\` strictly for crisp Nyra Blue connector lines (\`stroke="\#2563EB"\`, \`strokeWidth="1.75"\`, \`strokeOpacity="0.65"\`) and pulsing target dots:***  
***1\. \`01\` — \*\*\`BILL GUARD\`\*\* (\`Auto-roll dates · 48h trial kill-switch\`)***  
***2\. \`02\` — \*\*\`SCAM SHIELD\`\*\* (\`MITRE F3 · Interac & OSAP intercept\`) \*(Verify spelling is \`SCAM\`, NOT \`SCAN\`)\****  
***3\. \`03\` — \*\*\`PII ZERO\`\*\* (\`Zero bank logins · PIPEDA scrubber\`)***  
***4\. \`04\` — \*\*\`20% IMPACT\`\*\* (\`Funds FFE youth literacy workshops\`)***  
***\* \*\*Styling:\*\* \`bg-white/95 backdrop-blur-md border-2 border-blue-500/25 rounded-2xl px-4 py-3 shadow-\[0\_14px\_34px\_-8px\_rgba(37,99,235,0.22)\] pointer-events-auto transition-transform duration-300 hover:scale-105 hover:border-blue-500\`.***  
***\* \*\*Typography:\*\* Bold Nyra Blue pill number (\`bg-blue-600 text-white font-mono text-xs font-bold px-2 py-0.5 rounded-md\`), title \*\*\`text-base md:text-lg font-extrabold text-slate-900\`\*\*, subtitle \*\*\`text-xs md:text-\[13px\] font-medium text-slate-600\`\*\*.***  
***\* \*\*Spring Pop Entrance:\*\* Staggered \`@keyframes popUpCard\` (\`scale(0.84) translateY(14px)\` → \`scale(1.03) translateY(-2px)\` → \`scale(1) translateY(0)\`, \`550ms cubic-bezier(0.34, 1.56, 0.64, 1)\`, \`120ms\` stagger). Fade smoothly to \`0\` when \`scrollProgress \> 0.20\`.***

***\---***

***\#\# PHASE 3: FRONTEND — REAL SMARTPHONE MOCKUP \+ RIGHT-SIDE 6-CARD SIMULATOR DECK (\`LiveSimulatorSection.tsx\`)***

***Refactor the interactive mobile app section (\`id="live-workspace"\`) on crisp \`\#FFFFFF\`:***

***\#\#\# 3.1 Clean Popping Header***  
***\* Delete \`"ACT 3: THE ENGINEERED PEAK — LIVE A2UI RUNTIME"\`.***  
***\* Replace with:***  
  ***\* Kicker: \`Interactive Mobile Experience\` (\`text-sm font-mono font-bold uppercase tracking-widest text-blue-600\`)***  
  ***\* Headline: \*\*\`Test Nyra 2.0 Live.\`\*\* (\`text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900\`)***  
  ***\* Subtitle: \*\*\`Tap any scenario on the right or text Nyra directly inside the phone to trigger interactive cards, scam defense, and owner outreach approval.\`\*\* (\`text-lg text-slate-600 max-w-2xl\`)***

***\#\#\# 3.2 Left Column (\`lg:col-span-5\`): Realistic Titanium Smartphone Hardware Mockup***  
***Wrap \`@a2ui/react/v0\_9\` (\`A2uiSurface\`) inside an unmistakable \*\*iPhone Titanium Chassis\*\*:***  
***\* \*\*Outer Frame:\*\* \`relative mx-auto w-\[370px\] sm:w-\[395px\] rounded-\[56px\] p-\[13px\] bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 shadow-\[0\_32px\_70px\_-15px\_rgba(15,23,42,0.28),0\_0\_0\_1px\_rgba(15,23,42,0.12),inset\_0\_2px\_4px\_rgba(255,255,255,0.9)\]\`***  
***\* \*\*Inner Bezel & Bright Screen:\*\* \`rounded-\[44px\] bg-slate-950 p-\[4px\]\` wrapping the \`\#FFFFFF\` screen (\`rounded-\[40px\] h-\[720px\] overflow-hidden flex flex-col relative\`).***  
***\* \*\*Protruding Hardware Side Buttons:\*\* Left edge (Action switch \`top-24\`, Volume Up \`top-36\`, Volume Down \`top-52\`); Right edge (Power button \`top-40\`).***  
***\* \*\*Top Dynamic Island & iOS Status Bar:\*\* Centered matte-black Dynamic Island (\`w-\[116px\] h-\[30px\] rounded-full bg-slate-950\`) with subtle dark-blue glass camera dot, \`9:41\` bold on left, Signal \+ Wi-Fi \+ Battery icons on right.***  
***\* \*\*Screen Glass Sheen & Bottom Home Indicator:\*\* Faint diagonal white sheen (\`pointer-events-none opacity-25\`) \+ bottom \`w-32 h-1.5 rounded-full bg-slate-900/25\` bar.***  
***\* \*\*Bigger Popping Typography Inside Phone:\*\* App title \`text-lg font-extrabold\`, segmented \`Chat\` / \`Bills (3)\` pills \`text-sm font-semibold\`, chat messages \`text-\[15px\] leading-snug\`, A2UI card headers \`text-base font-bold\`, prominent interactive A2UI buttons (\`text-sm font-semibold\`), and spacious bottom input (\`text-\[15px\] px-4 py-3\`).***

***\#\#\# 3.3 Right Column (\`lg:col-span-7\`): Interactive 6-Card \`scroll-craft\` Command Deck***  
***Move ALL simulator controls to the \*\*right of the phone\*\*:***  
***\* \*\*Top Control Strip:\*\* \`FastAPI Connected\` green pulse pill, \`Live Haiku 5.5\` / \`Offline Mock\` switch, \*\*\`Simulate 9 AM Digest\`\*\*, \*\*\`Reset Demo\`\*\*, and \*\*\`Settings & Compliance\`\*\*.***  
***\* \*\*6 Bold Popping Trigger Cards (\`grid-cols-1 md:grid-cols-2 gap-4\`):\*\* Each uses \`data-sc-tilt="5"\` \+ \`data-sc-magnet="0.10"\`, \`--sc-p\` staggered entrance, \`bg-white border-2 border-slate-200 hover:border-blue-500 rounded-2xl p-5 shadow-md hover:shadow-xl hover:shadow-blue-600/10 active:scale-\[0.98\]\`, bold Nyra Blue number badge, \*\*\`text-lg font-extrabold text-slate-900\`\*\* title, \*\*\`text-sm text-slate-600\`\*\* copy, and \`"Run →"\` blue cue:***  
  ***1\. \*\*\`01\` · Trial Kill-Switch\*\* — \*"Start a 14-day Adobe free trial and lock in a 48-hour auto-cancel SMS alert."\****  
  ***2\. \*\*\`02\` · Canadian Scam Shield\*\* — \*"Forward a fake Interac / OSAP refund text to trigger MITRE F3 fraud detection."\****  
  ***3\. \*\*\`03\` · 2026 Ontario Paycheque\*\* — \*"Calculate deterministic 2026 net take-home pay (\$18/hr, 20h/wk) vs. \$850 rent."\****  
  ***4\. \*\*\`04\` · Zero-Trust PII Guardrail\*\* — \*"Send test SIN \`123-456-789\` — watch it scrub locally before touching the AI (\$0.00)."\****  
  ***5\. \*\*\`05\` · Mark Bill Paid \+ Streak\*\* — \*"Pay Rogers Phone (\$55) to auto-roll next month's due date and boost your streak."\****  
  ***6\. \*\*\`06\` · Youth Outreach & Email Agent\*\* \*(Highlight pill: \`OWNER AGENT\`)\* — \*"Find our top prospective Ontario youth/campus lead, draft a CASL-compliant email, and approve & send in 1 tap."\****  
     ***\* \*Prompt dispatched on click:\* \`"Find our top prospective youth campus lead and draft a personalized CASL-compliant outreach email introducing Nyra 2.0's bill guard and scam shield."\`***

***\---***

***\#\# PHASE 4: FRONTEND — BELOW-FOLD 4-TIER \`scroll-craft\` ANIMATED DASHBOARD (\`LiveDashboardSection.tsx\`)***

***Move the ENTIRE dashboard directly \*\*BELOW the Mobile Simulator\*\* as a full-width (\`max-w-7xl mx-auto px-6 py-24\`) kinetic showcase powered by \`scrollCraftEngine.ts\` (\`--sc-p\` staggered lift/scale, \`data-sc-tilt\`, real offset shadows, \`AnimatedNumber\` count-up tickers, and live glow pulses on state change):***

***\#\#\# 4.1 Section Header***  
***\* Kicker: \`Live System Telemetry, Impact & Outreach\` (\`text-sm font-mono font-bold uppercase tracking-widest text-blue-600\`)***  
***\* Headline: \*\*\`Everything Happening Under the Hood.\`\*\* (\`text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900\`)***  
***\* Right pill: \`20% Net Profit → FFE Youth Workshops\` (\`text-sm font-bold\`)***

***\#\#\# 4.2 Four Full-Width Animated Dashboard Tiers***

***1\. \*\*Tier 1 — 3 Oversized Animated Hero KPI Tiles (\`grid-cols-1 md:grid-cols-3 gap-6\`):\*\****  
   ***\* Each tile (\`data-sc-tilt="6"\`, \`rounded-3xl bg-white border border-slate-200 p-8 shadow-lg hover:shadow-2xl hover:border-blue-400/60 transition-all\`):***  
     ***\* \*\*Payment Streak:\*\* \*\*\`4 months\`\*\* (\`text-5xl font-black text-amber-500\`) \+ \`AnimatedNumber\` ticker \+ pulse flash on update.***  
     ***\* \*\*Late Fees Saved:\*\* \*\*\`\$105 CAD\`\*\* (\`text-5xl font-black text-emerald-600\`) \+ \`AnimatedNumber\` ticker.***  
     ***\* \*\*Youth Impact Pool:\*\* \*\*\`60 mins\`\*\* (\`text-5xl font-black text-blue-600\`) \+ \`AnimatedNumber\` ticker.***  
***2\. \*\*Tier 2 — Tracked Recurring Bills & Active Trial Kill-Switches (\`rounded-3xl bg-white border border-slate-200 p-8 shadow-lg\`):\*\****  
   ***\* Popping typography (\`text-xl font-extrabold\` headers, \`text-lg font-bold\` bill names, \`text-lg font-extrabold text-blue-600\` amounts, \`text-sm font-semibold\` status pills).***  
   ***\* Row entrance slide-in animation (\`@keyframes rowSlideIn\`) for new trials/bills and emerald flash animation when marked paid.***  
***3\. \*\*Tier 3 — 2-Column Split: Haiku 5.5 Unit Economics \+ Guardrail & A2UI Audit (\`grid-cols-1 lg:grid-cols-2 gap-6\`):\*\****  
   ***\* \*\*Left (\`data-sc-tilt="4"\`):\*\* 4 big metric boxes (\`text-3xl font-black\`) for \`INPUT TOKENS\`, \`CACHE READ (90% OFF)\`, \`OUTPUT TOKENS\`, \`REPLY COST (\< \$0.0001 CAD)\`, plus an animated gradient \*\*Monthly AI Quota Bar (\`X / 25\`)\*\*.***  
   ***\* \*\*Right (\`data-sc-tilt="4"\`):\*\* Readable live middleware log (\`text-sm\` / \`text-base\`) flashing emerald \*\*\`PII SCRUBBED (\$0.00)\`\*\*, crimson \*\*\`MITRE F3 SCAM INTERCEPT\`\*\*, or Nyra Blue \*\*\`A2UI DIRECT ACTION (\$0.00)\`\*\*, plus a collapsible \*\*\`Inspect Live A2UI v0.9 JSON\`\*\* drawer.***  
***4\. \*\*Tier 4 — Youth Outreach Pipeline & Live Email Outbox (\`rounded-3xl bg-white border border-slate-200 p-8 shadow-lg\`, \`data-sc-tilt="3"\`):\*\****  
   ***\* \*\*Header:\*\* \`4th Agent: Youth Outreach Pipeline & Email Outbox\` \+ live delivery badge (\`Sandbox Outbox Mode\` or \`Live SMTP Mode\`).***  
   ***\* \*\*3 Animated Popping Counters (\`text-4xl font-black\` with \`AnimatedNumber\`):\*\****  
     ***\* \*\*Prospective Leads:\*\* \`5\`***  
     ***\* \*\*Emails Sent:\*\* \`0\` → animates live to \`1+\` with emerald glow flash when owner clicks \`Approve & Send Email\` inside the phone\!***  
     ***\* \*\*Est. Youth Reached:\*\* \`0\` → animates live (e.g., \`500\` youth for McMaster Residence Life).***  
   ***\* \*\*2-Column Live Outreach Workspace (\`grid-cols-1 lg:grid-cols-2 gap-6 mt-6\`):\*\****  
     ***\* \*\*Left — Prospective Youth & Campus Leads Queue:\*\* Lists seeded leads with bold name (\`text-base font-bold text-slate-900\`), organization, \`youth\_reach\_est\` pill, \`CASL Opt-In\` badge, live status pill (\`New\` slate → \`Drafted\` amber → \`Sent ✓\` emerald), and a quick \*\*\`Draft Email →\`\*\* button on each row that triggers the Outreach Agent directly inside the phone (smoothly scrolling to \`\#live-workspace\` or updating the phone stream).***  
     ***\* \*\*Right — Sent & Pending Email Outbox:\*\* Lists every drafted/sent email with recipient, bold subject line, \`CASL Verified ✓\` badge, delivery mode pill, timestamp, and an expandable \*\*\`Preview Email\`\*\* toggle displaying the full email body and CASL footer.***

***\---***

***\#\# PHASE 5: MANDATORY VERIFICATION (DO NOT SKIP)***

***Run all 3 verification gates and report exact pass/fail results:***

***1\. \*\*Backend Automated QA (\`pytest\`):\*\****  
   ***Add 3 new outreach tests to \`backend/tests/test\_harness.py\` so \*\*all 17 tests PASS\*\*:***  
   ***\* All 10 original harness tests \+ 4 existing A2UI v0.9 tests PASS.***  
   ***\* \`test\_outreach\_agent\_drafts\_casl\_compliant\_email\_without\_auto\_sending\` (verifies \`status \== 'draft'\`, CASL footer appended, \`sent\_at is None\`).***  
   ***\* \`test\_a2ui\_v09\_approve\_send\_outreach\_email\_dispatches\_at\_zero\_llm\_cost\` (verifies \`POST /api/a2ui/action\` marks email \`approved\_sent\`, updates lead to \`sent\`, logs \`\$0.00\` LLM cost, and returns valid \`updateDataModel\`).***  
   ***\* \`test\_outreach\_sandbox\_prevents\_unapproved\_external\_smtp\_send\` (verifies default \`sandbox\_outbox\` mode makes zero external SMTP calls).***  
***2\. \*\*Frontend Production Build:\*\****  
   ***\`\`\`bash***  
   ***cd frontend***  
   ***npm run build***  
   ***\`\`\`***  
   ***Confirm \*\*0 TypeScript, ESLint, or Next.js build errors\*\* and verify \`@a2ui/react/v0\_9\`, \`@a2ui/web\_core/v0\_9\`, \`three\`, and \`scrollCraftEngine.ts\` are cleanly bundled.***  
***3\. \*\*\`scroll-craft\` Headless Playwright Verification Pass:\*\****  
   ***Launch FastAPI (\`:8000\`) and Next.js (\`:3000\`) and run \`scroll-craft\`'s browser verification across \`1440×900\` desktop \+ mobile viewports. Confirm and fix any defects before finishing:***  
   ***\* \*\*3D Alpine Hero (\`0%\` scroll):\*\* Bright snowy 3D alpine mountains visible behind a vibrant \*\*Nyra Blue \+ white \`\$\` sculpture\*\*, BIG top-left \`NYRA 2.0\` icon \+ logo with \*\*NO \`A2UI v0.9\` badge\*\*, and \*\*4 big popping callout cards\*\* (\`01 BILL GUARD\`, \`02 SCAM SHIELD\`, \`03 PII ZERO\`, \`04 20% IMPACT\`) with zero overlap or clipping.***  
   ***\* \*\*Mobile Simulator \+ Right Deck:\*\* Realistic \*\*Titanium iPhone hardware mockup\*\* on the left with big readable \`@a2ui/react/v0\_9\` cards inside, and all \*\*6 bold popping trigger cards on the right\*\* (zero cut-off buttons below the phone).***  
   ***\* \*\*4th Agent End-to-End Test:\*\* Click \*\*Card \#6 (\`06 · Youth Outreach & Email Agent\`)\*\* → confirm A2UI v0.9 Email Draft Card appears inside the phone → click \*\*\`Approve & Send Email\`\*\* inside the phone → confirm card updates to \`Sent ✓\` and the below-fold \*\*Emails Sent\*\* and \*\*Est. Youth Reached\*\* counters animate up with zero console errors.***  
   ***\* \*\*Below-Fold Dashboard:\*\* Full-width 4-tier animated dashboard positioned cleanly below the simulator on crisp white/light grounds with passing WCAG AA+ contrast and zero dev headers (\`ACT 3...\`).***  
