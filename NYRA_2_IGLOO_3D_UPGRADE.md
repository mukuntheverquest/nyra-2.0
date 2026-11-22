Markdown  
\# NYRA 2.0 — INTERACTIVE 3D "IGLOO-STYLE" WHITE-THEME HERO & SCROLL STAGE

**\*\*Model Execution Guidance:\*\*** Follow every file path, coordinate array, color hex, and rule below literally. Do NOT improvise extra libraries, do NOT switch to dark mode, and do NOT modify any backend or A2UI logic.

\---

\#\# 0\. HARD RULES (DO NOT VIOLATE)

1\. **\*\*DO NOT TOUCH \`backend/\`\*\*** — All FastAPI routes, SQLite DB, Claude Haiku 5.5 router, PII scrubber, and A2UI v0.9 compilers must remain 100% untouched.  
2\. **\*\*DO NOT BREAK EXISTING A2UI COMPONENTS\*\*** — Keep your existing interactive A2UI Mobile App (\`A2UIMobileRuntime\` / \`@a2ui/react/v0\_9\`), Bills & Impact HUD, Telemetry HUD, Guardrail Log, \`SettingsModal\`, \`Trigger 9 AM Digest\`, \`Reset Demo\`, and \`Live / Mock\` toggle working identically.  
3\. **\*\*STRICT WHITE / LIGHT BACKGROUND ONLY\*\*** — Primary canvas is \`\#FFFFFF\` with soft ice-mist \`\#F8FAFC\` / \`\#F1F5F9\`. NEVER use black or dark-mode sections (\`\#000000\`, \`\#0B0E14\`, \`bg-slate-950\`, etc.).  
4\. **\*\*USE PURE \`three\` ONLY (NO \`@react-three/fiber\` or \`@react-three/drei\`)\*\*** — Pure \`three\` \+ \`@types/three\` avoids React 19 peer dependency conflicts and Next.js SSR hydration failures.  
5\. **\*\*60FPS RULE\*\*** — NEVER call React \`setState\` inside \`requestAnimationFrame\`. Update the 3D scene and the floating SVG wireframe callout positions directly via DOM \`useRef\` mutations.  
6\. **\*\*NO NAVBAR GLITCHES\*\*** — Keep the \`Nyra 2.0\` wordmark crisp and static (do NOT use broken character-scramble loops on the logo).

\---

\#\# PHASE 1: INSTALL THREE.JS & INSPECT EXISTING FRONTEND

1\. Install pure \`three\` inside \`frontend/\`:  
   \`\`\`bash  
   cd frontend  
   npm install three @types/three  
   \`\`\`  
2\. Inspect \`frontend/src/app/page.tsx\` and list the exact component names currently rendering:  
   \* The top navigation bar  
   \* The live A2UI Mobile App \+ Companion HUD section  
   \* The Access / Pricing / 20% Impact footer section  
   \* The \`SettingsModal\` and existing \`Live / Mock\` state props

Do not delete any existing working A2UI or HUD component files.

\---

\#\# PHASE 2: BUILD THE PROCEDURAL 3D MODULAR \`\$\` SCULPTURE (\`frontend/src/components/hero3d/DollarSculptureStage.tsx\`)

Create a new folder \`frontend/src/components/hero3d/\` with two clean \`'use client'\` files:  
1\. \`dollarBlocks.ts\` — Exact 25-block geometry data, 3 semantic explosion layers, and 4 callout anchor definitions.  
2\. \`DollarSculptureStage.tsx\` — The \`400vh\` scroll-driven interactive stage with a \`sticky top-0 h-screen\` WebGL \`\<canvas\>\`, dynamic SVG wireframe callouts, Igloo-style 4-corner HUD, and 3 scroll-revealed storytelling beats.

\#\#\# 2.1 Exact 25-Block Modular \`\$\` Matrix (\`frontend/src/components/hero3d/dollarBlocks.ts\`)

Use these **\*\*exact verified coordinates\*\*** (zero overlapping blocks; forms a crisp, symmetric sculptural \`\$\` with 21 interlocking core blocks \+ 4 floating edge blocks for Igloo-style wireframe callouts):

\`\`\`ts  
export interface SculptureBlockSpec {  
  id: string;  
  gx: number;          // Grid X (-2..2 core, ±2.7+ detached)  
  gy: number;          // Grid Y (-4..4)  
  gz: number;          // Base Z depth (S-curve proud, vertical stem slightly recessed)  
  role: 's\_curve' \| 'stem' \| 'detached';  
  layer: 1 \| 2 \| 3;    // Semantic explosion layer during scroll  
  explodeOffset: \[number, number, number\]; // Offset added at peak scroll explosion  
  callout?: {  
    code: string;      // Short monospace tag  
    title: string;     // Main wireframe label  
    sub: string;       // Secondary detail  
    labelDx: number;   // SVG horizontal leader offset in px  
    labelDy: number;   // SVG vertical leader offset in px  
  };  
}

export const BLOCK\_STEP \= 0.62; // Leaves a crisp 0.06 glowing seam around 0.56-sized blocks

export const DOLLAR\_BLOCKS: SculptureBlockSpec\[\] \= \[  
  // \--- VERTICAL STEM BLOCKS (6 blocks, slightly recessed Z \= \-0.10) \---  
  { id: 'v\_top',  gx: 0, gy:  4, gz: \-0.10, role: 'stem', layer: 1, explodeOffset: \[ 0.0,  0.9, \-0.8\] },  
  { id: 'v\_u1',   gx: 0, gy:  2, gz: \-0.10, role: 'stem', layer: 1, explodeOffset: \[ 0.0,  0.4, \-0.7\] },  
  { id: 'v\_u2',   gx: 0, gy:  1, gz: \-0.10, role: 'stem', layer: 2, explodeOffset: \[ 0.0,  0.2, \-0.6\] },  
  { id: 'v\_d1',   gx: 0, gy: \-1, gz: \-0.10, role: 'stem', layer: 2, explodeOffset: \[ 0.0, \-0.2, \-0.6\] },  
  { id: 'v\_d2',   gx: 0, gy: \-2, gz: \-0.10, role: 'stem', layer: 3, explodeOffset: \[ 0.0, \-0.4, \-0.7\] },  
  { id: 'v\_bot',  gx: 0, gy: \-4, gz: \-0.10, role: 'stem', layer: 3, explodeOffset: \[ 0.0, \-0.9, \-0.8\] },

  // \--- S-CURVE CORE BLOCKS (15 blocks, proud Z \= \+0.08) \---  
  // Top arc (Layer 1: Bill & Trial Guard)  
  { id: 's\_t1',   gx: \-1, gy:  3, gz: 0.08, role: 's\_curve', layer: 1, explodeOffset: \[-0.7,  0.7,  0.5\] },  
  { id: 's\_t2',   gx:  0, gy:  3, gz: 0.08, role: 's\_curve', layer: 1, explodeOffset: \[ 0.0,  0.7,  0.7\] },  
  { id: 's\_t3',   gx:  1, gy:  3, gz: 0.08, role: 's\_curve', layer: 1, explodeOffset: \[ 0.7,  0.7,  0.5\] },  
  { id: 's\_ul1',  gx: \-2, gy:  2, gz: 0.08, role: 's\_curve', layer: 1, explodeOffset: \[-1.1,  0.4,  0.4\] },  
  { id: 's\_ur1',  gx:  2, gy:  2, gz: 0.08, role: 's\_curve', layer: 1, explodeOffset: \[ 1.1,  0.5,  0.6\] },  
  { id: 's\_ul2',  gx: \-2, gy:  1, gz: 0.08, role: 's\_curve', layer: 2, explodeOffset: \[-1.2,  0.1,  0.2\] },

  // Center bar (Layer 2: Canadian Scam Shield)  
  { id: 's\_m1',   gx: \-1, gy:  0, gz: 0.10, role: 's\_curve', layer: 2, explodeOffset: \[-0.6,  0.0,  0.9\] },  
  { id: 's\_m2',   gx:  0, gy:  0, gz: 0.12, role: 's\_curve', layer: 2, explodeOffset: \[ 0.0,  0.0,  1.1\] },  
  { id: 's\_m3',   gx:  1, gy:  0, gz: 0.10, role: 's\_curve', layer: 2, explodeOffset: \[ 0.6,  0.0,  0.9\] },

  // Lower arc (Layer 3: Zero-Trust Privacy & 20% Youth Impact)  
  { id: 's\_lr1',  gx:  2, gy: \-1, gz: 0.08, role: 's\_curve', layer: 2, explodeOffset: \[ 1.2, \-0.1,  0.2\] },  
  { id: 's\_ll1',  gx: \-2, gy: \-2, gz: 0.08, role: 's\_curve', layer: 3, explodeOffset: \[-1.1, \-0.5,  0.6\] },  
  { id: 's\_lr2',  gx:  2, gy: \-2, gz: 0.08, role: 's\_curve', layer: 3, explodeOffset: \[ 1.1, \-0.4,  0.4\] },  
  { id: 's\_b1',   gx: \-1, gy: \-3, gz: 0.08, role: 's\_curve', layer: 3, explodeOffset: \[-0.7, \-0.7,  0.5\] },  
  { id: 's\_b2',   gx:  0, gy: \-3, gz: 0.08, role: 's\_curve', layer: 3, explodeOffset: \[ 0.0, \-0.7,  0.7\] },  
  { id: 's\_b3',   gx:  1, gy: \-3, gz: 0.08, role: 's\_curve', layer: 3, explodeOffset: \[ 0.7, \-0.7,  0.5\] },

  // \--- 4 DETACHED FLOATING BLOCKS WITH IGLOO-STYLE WIREFRAME CALLOUTS \---  
  {  
    id: 'float\_bill',  
    gx: 2.95, gy: 2.45, gz: 0.42,  
    role: 'detached', layer: 1, explodeOffset: \[1.5, 0.9, 0.9\],  
    callout: {  
      code: '01',  
      title: 'BILL\_GUARD',  
      sub: 'AUTO-ROLL · 48H TRIAL KILL-SWITCH',  
      labelDx: 95,  
      labelDy: \-38,  
    },  
  },  
  {  
    id: 'float\_scam',  
    gx: \-3.05, gy: 1.05, gz: 0.36,  
    role: 'detached', layer: 2, explodeOffset: \[-1.6, 0.3, 0.8\],  
    callout: {  
      code: '02',  
      title: 'SCAM\_SHIELD',  
      sub: 'MITRE F3 · INTERAC / OSAP INTERCEPT',  
      labelDx: \-115,  
      labelDy: \-28,  
    },  
  },  
  {  
    id: 'float\_pii',  
    gx: 3.05, gy: \-1.15, gz: 0.38,  
    role: 'detached', layer: 2, explodeOffset: \[1.6, \-0.3, 0.8\],  
    callout: {  
      code: '03',  
      title: 'PII\_ZERO',  
      sub: '0 BANK LOGINS · PIPEDA SCRUBBER',  
      labelDx: 95,  
      labelDy: 24,  
    },  
  },  
  {  
    id: 'float\_impact',  
    gx: \-2.85, gy: \-2.65, gz: 0.32,  
    role: 'detached', layer: 3, explodeOffset: \[-1.4, \-0.9, 0.7\],  
    callout: {  
      code: '04',  
      title: '20%\_IMPACT',  
      sub: 'FFE YOUTH LITERACY WORKSHOPS',  
      labelDx: \-110,  
      labelDy: 34,  
    },  
  },  
\];  
\`\`\`

\#\#\# 2.2 White-Gallery Studio Materials, Glowing Nyra Blue Seams & Lighting

Follow these exact Three.js material & lighting values so the white frosted-ceramic blocks look crisp, sculptural, and high-contrast against a bright white background (never washed out):

\* **\*\*Renderer:\*\*** \`antialias: true\`, \`alpha: true\`, \`powerPreference: 'high-performance'\`, \`renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))\`, \`renderer.toneMapping \= THREE.ACESFilmicToneMapping\`, \`renderer.toneMappingExposure \= 1.08\`.  
\* **\*\*Scene Background & Atmospheric Mist:\*\***  
  \* Leave WebGL canvas transparent over a subtle CSS radial background: \`background: radial-gradient(circle at 50% 42%, \#FFFFFF 0%, \#F8FAFC 58%, \#EEF2F7 100%)\`.  
  \* Add \`scene.fog \= new THREE.Fog('\#F8FAFC', 11, 24)\` for atmospheric depth.  
\* **\*\*Block Geometry:\*\*** Import \`RoundedBoxGeometry\` from \`'three/examples/jsm/geometries/RoundedBoxGeometry.js'\`.  
  \* \`s\_curve\` blocks: \`new RoundedBoxGeometry(0.55, 0.55, 0.54, 4, 0.065)\`  
  \* \`stem\` blocks: \`new RoundedBoxGeometry(0.52, 0.54, 0.46, 4, 0.06)\`  
  \* \`detached\` blocks: \`new RoundedBoxGeometry(0.46, 0.46, 0.46, 4, 0.06)\`  
\* **\*\*Frosted Ceramic Block Material (Distinct on White):\*\***  
  \* \`s\_curve\` & \`detached\`: \`MeshPhysicalMaterial({ color: '\#E8EEF5', roughness: 0.32, metalness: 0.06, clearcoat: 0.45, clearcoatRoughness: 0.28 })\`  
  \* \`stem\`: \`MeshPhysicalMaterial({ color: '\#DCE5F2', roughness: 0.36, metalness: 0.08, clearcoat: 0.35 })\`  
  \* Add subtle architectural hairline wireframe edges to the 4 \`detached\` blocks ONLY (\`EdgesGeometry\` \+ \`LineBasicMaterial({ color: '\#2563EB', transparent: true, opacity: 0.35 })\`) to echo Igloo's technical scan edges.  
\* **\*\*Glowing Nyra Blue Inner Seam Core (Signature Visual):\*\***  
  \* Create a recessed inner glowing core group inside the \`\$\` sculpture (\`z \= \-0.02\`, slightly smaller boxes scaled \`0.42 × 0.42 × 0.32\` at key S-curve joints) using \`MeshStandardMaterial({ color: '\#2563EB', emissive: '\#3B82F6', emissiveIntensity: 2.4, roughness: 0.2 })\`.  
  \* Place a \`THREE.PointLight('\#3B82F6', 4.5, 6.0)\` right at the center \`(0, 0, 0.2)\` of the sculpture group so bright **\*\*Nyra Blue\*\*** light physically spills onto the beveled inner faces of surrounding white blocks.  
\* **\*\*Studio 3-Point Lighting Rig:\*\***  
  \* \`HemisphereLight('\#FFFFFF', '\#CBD5E1', 1.35)\`  
  \* Key \`DirectionalLight('\#FFFFFF', 2.1)\` at \`(-6, 8, 9)\`  
  \* Rim \`DirectionalLight('\#3B82F6', 2.4)\` at \`(7, 3, \-5)\` (gives crisp Nyra Blue rim light along the ceramic edges)  
  \* Fill \`DirectionalLight('\#E0ECFF', 0.9)\` at \`(5, \-6, 6)\`  
\* **\*\*Soft Grounded Horizon Shadow \+ Subtle Architectural Grid Floor:\*\***  
  \* Below the sculpture (\`y \= \-3.45\`), add a subtle horizontal \`THREE.GridHelper(24, 28, '\#CBD5E1', '\#E2E8F0')\` with \`material.transparent \= true; material.opacity \= 0.28\` tilted subtly in perspective, plus a soft radial contact shadow disc underneath the \`\$\` so the sculpture feels grounded in space.  
\* **\*\*Floating Micro-Particles:\*\***  
  \* Add 45 tiny floating dust/ice motes (\`THREE.Points\`, size \`0.045\`, color \`\#93C5FD\`, \`opacity: 0.45\`) drifting slowly around the sculpture.

\#\#\# 2.3 Exact 3D-to-2D Floating Wireframe Callouts (Zero React Re-Renders)

Overlay a full-screen \`\<svg className="pointer-events-none absolute inset-0 z-10 h-full w-full"\>\` on top of the canvas.  
For each of the **\*\*4 detached blocks\*\*** (\`float\_bill\`, \`float\_scam\`, \`float\_pii\`, \`float\_impact\`):  
\* Store direct refs to its \`\<circle\>\` (anchor dot on the 3D block), \`\<polyline\>\` (crisp 2-segment angled leader line), and \`\<g\>\` (callout label group).  
\* Inside \`requestAnimationFrame\`:  
  1\. Get the block mesh's world position: \`mesh.getWorldPosition(tempVec)\`.  
  2\. Project to Normalized Device Coordinates: \`tempVec.project(camera)\`.  
  3\. Convert to screen pixels: \`sx \= (tempVec.x \* 0.5 \+ 0.5) \* width\`, \`sy \= (-tempVec.y \* 0.5 \+ 0.5) \* height\`.  
  4\. Calculate elbow point \`(ex \= sx \+ labelDx \* 0.55, ey \= sy \+ labelDy)\` and end point \`(tx \= sx \+ labelDx, ty \= sy \+ labelDy)\`.  
  5\. Update DOM attributes directly (\`polyline.setAttribute('points', ...)\` and \`labelGroup.setAttribute('transform', ...)\`).  
  6\. Fade callout opacity smoothly to \`0\` when \`scrollProgress \> 0.20\` (so callouts shine cleanly on the opening hero screen and get out of the way when the scroll storytelling beats appear\!). Hide callouts on narrow mobile screens (\`width \< 768px\`) to prevent clipping.  
\* **\*\*Visual Styling of Each Callout:\*\***  
  \* Anchor dot: \`r="3.5"\`, fill \`\#2563EB\` with outer ring \`r="7"\`, stroke \`\#93C5FD\`, \`strokeWidth="1"\`.  
  \* Connector line: stroke \`\#94A3B8\`, \`strokeWidth="1"\`, \`fill="none"\`.  
  \* Label text (\`JetBrains Mono\`):  
    \* Top line: \`\[01\] BILL\_GUARD\` (\`11px\`, font-semibold, fill \`\#0F172A\`, \`letter-spacing: 0.08em\`)  
    \* Second line: \`AUTO-ROLL · 48H TRIAL KILL-SWITCH\` (\`9.5px\`, fill \`\#64748B\`, \`letter-spacing: 0.05em\`)

\---

\#\# PHASE 3: SCROLL CHOREOGRAPHY & IGLOO-STYLE 4-CORNER HUD

Wrap the \`DollarSculptureStage\` inside a \`\<section className="relative h-\[400vh\] w-full"\>\` with an inner \`\<div className="sticky top-0 h-screen w-full overflow-hidden"\>\`.

\#\#\# 3.1 Compute Normalized \`scrollProgress\` (\`0.0\` → \`1.0\`)  
In a passive scroll listener, compute:  
\`\`\`ts  
const rect \= sectionRef.current.getBoundingClientRect();  
const scrollable \= sectionRef.current.offsetHeight \- window.innerHeight;  
const raw \= scrollable \> 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1\) : 0;  
targetScrollRef.current \= raw;  
\`\`\`  
Inside \`requestAnimationFrame\`, smoothly damp \`currentScroll \+= (targetScroll \- currentScroll) \* 0.08\` and \`mouseX/Y\` with \`0.06\` damping so motion feels weighted, luxurious, and silky smooth.

\#\#\# 3.2 Exact 4-Beat Scroll Timeline (\`currentScroll\` from \`0.0\` to \`1.0\`)

Use a helper \`smoothstep(edge0, edge1, x)\` to drive both the 3D sculpture transforms and the text overlay opacities:

\| Scroll Range \| 3D \`\$\` Sculpture Behavior \| On-Screen Editorial Content \|  
\| :--- \| :--- \| :--- \|  
\| **\*\*\`0.00 – 0.18\`\*\*** *\*(Opening Hero — Pure Igloo Feel)\** \| Assembled at center \`(0, 0.1, 0)\`. Gentle sinusoidal hover \+ pointer parallax tilt (\`±0.22 rad\`). Detached blocks drift subtly with all **\*\*4 wireframe callouts\*\*** visible (\`opacity: 1\`). \| **\*\*NO big center headline clutter.\*\*** Only the crisp **\*\*4-Corner HUD\*\*** (exact details in Section 3.3 below). Clean, gallery-white calm. \|  
\| **\*\*\`0.18 – 0.44\`\*\*** *\*(Beat 1 — Never Miss a Bill)\** \| Sculpture glides smoothly left (\`x \= \-2.15\`), rotates \`+0.38 rad\` on Y, and Layer 1 blocks begin opening (\`explosion \= 0.45\`). Wireframe callouts fade out (\`opacity: 0\`). \| **\*\*Right-side editorial panel\*\*** fades & slides in (\`max-w-md\`):\<br\>• Eyebrow: \`BILL & TRIAL GUARD\` (Nyra Blue mono)\<br\>• Headline: **\*\*\`NEVER MISS A BILL.\`\*\*** (\`\#0F172A\`)\<br\>• Concise copy: Auto-rolling monthly due dates, credit card statement vs. due cycles, PAD balance warnings, and 48-hour free-trial kill-switches via simple text.\<br\>• Crisp stat chip: \`0 LATE FEES · 1-TAP SMS\`. \|  
\| **\*\*\`0.44 – 0.70\`\*\*** *\*(Beat 2 — Never Fall for a Scam)\** \| Sculpture sweeps smoothly right (\`x \= \+2.15\`), rotates \`-0.42 rad\` on Y, and hits **\*\*peak explosion (\`explosion \= 1.0\`)\*\*** showing the bright glowing **\*\*Nyra Blue\*\*** core radiating between all 3 separated architectural layers. \| **\*\*Left-side editorial panel\*\*** fades & slides in (\`max-w-md\`):\<br\>• Eyebrow: \`CANADIAN SCAM SHIELD\` (Nyra Blue mono)\<br\>• Headline: **\*\*\`NEVER FALL FOR A SCAM.\`\*\***\<br\>• Concise copy: Forward sketchy Interac e-Transfers, fake OSAP/CRA texts, or rental deposit lures. Deterministic MITRE F3 rules \+ Claude Haiku 5.5 flag red flags in seconds.\<br\>• Crisp stat chip: \`0 BANK LOGINS · PIPEDA SCRUBBED\`. \|  
\| **\*\*\`0.70 – 0.90\`\*\*** *\*(Beat 3 — Reassembly & Mission Reveal)\** \| Sculpture glides back to center \`(0, 0.55, 0)\`, **\*\*reassembles (\`explosion \-\> 0\`)\*\***, and rotates cleanly to front. \| **\*\*Bottom-center editorial panel\*\*** fades in beneath the reassembled \`\$\`:\<br\>• Headline: **\*\*\`\< \$0.02/MO AI COST. 20% FUNDS YOUTH.\`\*\***\<br\>• Concise copy: Powered by Claude Haiku 5.5 prompt caching and open-standard **\*\*A2UI v0.9\*\*** declarative mobile widgets. 20% of net profits fund free Financial Futures Education workshops across Canada.\<br\>• Primary Nyra Blue button: **\*\*\`Enter Live A2UI App ↓\`\*\*** (smooth-scrolls to \`\#live-workspace\`). \|  
\| **\*\*\`0.90 – 1.00\`\*\*** *\*(Seamless Handoff)\** \| Sculpture scales down softly (\`1.0 \-\> 0.85\`) and fades gracefully (\`opacity \-\> 0\`) into \`\#FFFFFF\`, seamlessly revealing \`\#live-workspace\` right below. \| 4-corner HUD fades out cleanly as the compact sticky white workspace navbar appears for \`\#live-workspace\`. \|

\#\#\# 3.3 The Igloo-Style 4-Corner Opening HUD (Inside Sticky Stage)

Match \`igloo.inc\`'s whisper-quiet, uncrowded 4-corner composition on white:  
\* **\*\*Top-Left (\`top-7 left-8\`):\*\***  
  \* Small Nyra Blue geometric emblem \+ **\*\*\`NYRA 2.0\`\*\*** (\`Space Grotesk\`, bold, \`\#0F172A\`, static — zero glitch)  
  \* \`// Financial Futures Education\` (\`11px JetBrains Mono\`, \`\#64748B\`)  
  \* \`A2UI v0.9 · Canada\` (\`11px JetBrains Mono\`, \`\#94A3B8\`)  
\* **\*\*Top-Right (\`top-7 right-8 text-right max-w-\[260px\]\`):\*\***  
  \* \`////// Mission\` (\`11px JetBrains Mono\`, \`\#2563EB\`)  
  \* 4 tight lines in \`11.5px JetBrains Mono\` (\`\#334155\`):  
    \`Empowering Canadian youth to never miss a bill and never fall for a scam. Zero bank logins. 20% of profits fund free workshops.\`  
\* \*\*Bottom-Left (\`bottom-7 left-8\`):\*\*  
  \* \`Scroll down to discover\` (\`11px JetBrains Mono\`, \`\#475569\`) with tiny pulsing Nyra Blue downward arrow  
  \* Thin \`96px × 2px\` progress track (\`\#E2E8F0\`) filled with Nyra Blue (\`\#2563EB\`) driven directly by \`scrollProgress\`  
\* \*\*Bottom-Right (\`bottom-7 right-8\`):\*\*  
  \* Clean pill button: \`Jump to Live App ↓\` (scrolls smoothly to \`\#live-workspace\`, styled \`border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 hover:border-blue-500 hover:text-blue-600\`)

\---

\#\# PHASE 4: WIRE INTO \`frontend/src/app/page.tsx\`

Update \`frontend/src/app/page.tsx\` cleanly:  
1\. **\*\*Top of page:\*\*** Render \`\<DollarSculptureStage onJumpToApp={() \=\> scrollTo('\#live-workspace')} /\>\`.  
2\. **\*\*Workspace Navbar Behavior:\*\*** Hide the existing workspace navbar while the user is inside the 3D Hero Stage (\`scrollY \< stageHeight \- 120\`), and smoothly fade/slide it in as a clean frosted-white sticky bar (\`bg-white/90 backdrop-blur-md border-b border-slate-200\`) once the user enters **\*\*\`\#live-workspace\`\*\***. That way the opening screen stays 100% clean like \`igloo.inc\`, while the live simulator keeps all its controls (\`Offline Mock / Live Haiku 5.5\`, \`Settings\`, \`Trigger 9 AM Digest\`, \`Reset Demo\`) right at hand\!  
3\. **\*\*Middle of page (\`id="live-workspace"\`):\*\*** Render the **\*\*existing\*\*** A2UI v0.9 Mobile App \+ Real-Time HUD section completely intact on \`\#FFFFFF\`.  
4\. **\*\*Bottom of page (\`id="access-impact"\`):\*\*** Render the **\*\*existing\*\*** Access & 20% Youth Impact Pool section \+ footer (\`nyra-app.ca\`, PIPEDA & CASL badges) on \`\#F8FAFC\`.  
5\. **\*\*Accessibility Fallback:\*\*** If \`window.matchMedia('(prefers-reduced-motion: reduce)').matches\` is true, pause continuous bobbing/explosion and render the sculpture statically with clean beat navigation links.

\---

\#\# PHASE 5: MANDATORY VERIFICATION (DO NOT SKIP)

Run all 3 checks and report the exact pass/fail results:

1\. **\*\*Production Build Check:\*\***  
   \`\`\`bash  
   cd frontend  
   npm run build  
   \`\`\`  
   Confirm **\*\*0 TypeScript, ESLint, or Next.js build errors\*\*** and confirm no SSR \`window is not defined\` crashes.  
2\. **\*\*Backend & A2UI Regression Check:\*\***  
   \`\`\`bash  
   cd backend  
   pytest  
   \`\`\`  
   Confirm all existing tests (10 harness \+ 4 A2UI v0.9 tests) still PASS.  
3\. **\*\*Headless Browser Visual Verification (Playwright):\*\***  
   Launch FastAPI (\`:8000\`) and Next.js (\`:3000\`) and capture desktop screenshots (\`1440×900\`) at **\*\*5 scroll positions\*\*** to verify every beat renders cleanly:  
   \* \`0%\` scroll: Verify white gallery background, crisp 3D modular \`\$\` sculpture with Nyra Blue inner seam glow, 4 floating wireframe callout labels (\`BILL\_GUARD\`, \`SCAM\_SHIELD\`, \`PII\_ZERO\`, \`20%\_IMPACT\`), and clean 4-corner HUD (zero navbar overlap, zero glitch text).  
   \* \`30%\` scroll: Verify sculpture shifted left \+ Beat 1 (\`NEVER MISS A BILL.\`) clearly readable on the right.  
   \* \`58%\` scroll: Verify sculpture shifted right & exploded into 3 glowing layers \+ Beat 2 (\`NEVER FALL FOR A SCAM.\`) clearly readable on the left.  
   \* \`80%\` scroll: Verify sculpture reassembled \+ Beat 3 (\`\< \$0.02/MO AI COST. 20% FUNDS YOUTH.\`) centered cleanly.  
   \* \`100%\` scroll (\`\#live-workspace\`): Verify sticky workspace navbar appears cleanly and the interactive \`@a2ui/react/v0\_9\` Mobile App \+ Live HUD render and respond to clicks with zero console errors.

Drop this file into your nyra-2.0 folder and kick off Phase 1 in Antigravity—if anything looks off in the 3D lighting, camera distance, or callout spacing once it renders, share a screenshot and we can dial in the exact coordinates or light intensity in seconds.