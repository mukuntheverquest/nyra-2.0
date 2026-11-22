export interface SculptureBlockSpec {
  id: string;
  gx: number;          // Grid X (-2..2 core, ±2.7+ detached)
  gy: number;          // Grid Y (-4..4)
  gz: number;          // Base Z depth (S-curve proud, vertical stem slightly recessed)
  role: 's_curve' | 'stem' | 'detached';
  layer: 1 | 2 | 3;    // Semantic explosion layer during scroll
  explodeOffset: [number, number, number]; // Offset added at peak scroll explosion
  callout?: {
    code: string;      // Short monospace tag
    title: string;     // Main wireframe label
    sub: string;       // Secondary detail
    labelDx: number;   // SVG horizontal leader offset in px
    labelDy: number;   // SVG vertical leader offset in px
  };
}

export const BLOCK_STEP = 0.62; // Leaves a crisp 0.06 glowing seam around 0.56-sized blocks

export const DOLLAR_BLOCKS: SculptureBlockSpec[] = [
  // --- VERTICAL STEM BLOCKS (6 blocks, slightly recessed Z = -0.10) ---
  { id: 'v_top',  gx: 0, gy:  4, gz: -0.10, role: 'stem', layer: 1, explodeOffset: [ 0.0,  0.9, -0.8] },
  { id: 'v_u1',   gx: 0, gy:  2, gz: -0.10, role: 'stem', layer: 1, explodeOffset: [ 0.0,  0.4, -0.7] },
  { id: 'v_u2',   gx: 0, gy:  1, gz: -0.10, role: 'stem', layer: 2, explodeOffset: [ 0.0,  0.2, -0.6] },
  { id: 'v_d1',   gx: 0, gy: -1, gz: -0.10, role: 'stem', layer: 2, explodeOffset: [ 0.0, -0.2, -0.6] },
  { id: 'v_d2',   gx: 0, gy: -2, gz: -0.10, role: 'stem', layer: 3, explodeOffset: [ 0.0, -0.4, -0.7] },
  { id: 'v_bot',  gx: 0, gy: -4, gz: -0.10, role: 'stem', layer: 3, explodeOffset: [ 0.0, -0.9, -0.8] },

  // --- S-CURVE CORE BLOCKS (15 blocks, proud Z = +0.08) ---
  // Top arc (Layer 1: Bill & Trial Guard)
  { id: 's_t1',   gx: -1, gy:  3, gz: 0.08, role: 's_curve', layer: 1, explodeOffset: [-0.7,  0.7,  0.5] },
  { id: 's_t2',   gx:  0, gy:  3, gz: 0.08, role: 's_curve', layer: 1, explodeOffset: [ 0.0,  0.7,  0.7] },
  { id: 's_t3',   gx:  1, gy:  3, gz: 0.08, role: 's_curve', layer: 1, explodeOffset: [ 0.7,  0.7,  0.5] },
  { id: 's_ul1',  gx: -2, gy:  2, gz: 0.08, role: 's_curve', layer: 1, explodeOffset: [-1.1,  0.4,  0.4] },
  { id: 's_ur1',  gx:  2, gy:  2, gz: 0.08, role: 's_curve', layer: 1, explodeOffset: [ 1.1,  0.5,  0.6] },
  { id: 's_ul2',  gx: -2, gy:  1, gz: 0.08, role: 's_curve', layer: 2, explodeOffset: [-1.2,  0.1,  0.2] },

  // Center bar (Layer 2: Canadian Scam Shield)
  { id: 's_m1',   gx: -1, gy:  0, gz: 0.10, role: 's_curve', layer: 2, explodeOffset: [-0.6,  0.0,  0.9] },
  { id: 's_m2',   gx:  0, gy:  0, gz: 0.12, role: 's_curve', layer: 2, explodeOffset: [ 0.0,  0.0,  1.1] },
  { id: 's_m3',   gx:  1, gy:  0, gz: 0.10, role: 's_curve', layer: 2, explodeOffset: [ 0.6,  0.0,  0.9] },

  // Lower arc (Layer 3: Zero-Trust Privacy & 20% Youth Impact)
  { id: 's_lr1',  gx:  2, gy: -1, gz: 0.08, role: 's_curve', layer: 2, explodeOffset: [ 1.2, -0.1,  0.2] },
  { id: 's_ll1',  gx: -2, gy: -2, gz: 0.08, role: 's_curve', layer: 3, explodeOffset: [-1.1, -0.5,  0.6] },
  { id: 's_lr2',  gx:  2, gy: -2, gz: 0.08, role: 's_curve', layer: 3, explodeOffset: [ 1.1, -0.4,  0.4] },
  { id: 's_b1',   gx: -1, gy: -3, gz: 0.08, role: 's_curve', layer: 3, explodeOffset: [-0.7, -0.7,  0.5] },
  { id: 's_b2',   gx:  0, gy: -3, gz: 0.08, role: 's_curve', layer: 3, explodeOffset: [ 0.0, -0.7,  0.7] },
  { id: 's_b3',   gx:  1, gy: -3, gz: 0.08, role: 's_curve', layer: 3, explodeOffset: [ 0.7, -0.7,  0.5] },

  // --- 4 DETACHED FLOATING BLOCKS WITH IGLOO-STYLE WIREFRAME CALLOUTS ---
  {
    id: 'float_bill',
    gx: 2.95, gy: 2.45, gz: 0.42,
    role: 'detached', layer: 1, explodeOffset: [1.5, 0.9, 0.9],
    callout: {
      code: '01',
      title: 'BILL_GUARD',
      sub: 'AUTO-ROLL · 48H TRIAL KILL-SWITCH',
      labelDx: 95,
      labelDy: -38,
    },
  },
  {
    id: 'float_scam',
    gx: -3.05, gy: 1.05, gz: 0.36,
    role: 'detached', layer: 2, explodeOffset: [-1.6, 0.3, 0.8],
    callout: {
      code: '02',
      title: 'SCAM_SHIELD',
      sub: 'MITRE F3 · INTERAC / OSAP INTERCEPT',
      labelDx: -115,
      labelDy: -28,
    },
  },
  {
    id: 'float_pii',
    gx: 3.05, gy: -1.15, gz: 0.38,
    role: 'detached', layer: 2, explodeOffset: [1.6, -0.3, 0.8],
    callout: {
      code: '03',
      title: 'PII_ZERO',
      sub: '0 BANK LOGINS · PIPEDA SCRUBBER',
      labelDx: 95,
      labelDy: 24,
    },
  },
  {
    id: 'float_impact',
    gx: -2.85, gy: -2.65, gz: 0.32,
    role: 'detached', layer: 3, explodeOffset: [-1.4, -0.9, 0.7],
    callout: {
      code: '04',
      title: '20%_IMPACT',
      sub: 'FFE YOUTH LITERACY WORKSHOPS',
      labelDx: -110,
      labelDy: 34,
    },
  },
];
