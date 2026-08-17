/**
 * The CareRadar crystal: one dense blue crystalline body.
 *
 * TARGET
 * reference/blue-crystal-target.png. A dense triangulated crystalline mass on a
 * near-black navy ground, lit hard from the UPPER LEFT (the reference states
 * this in its own annotation), with bright edge highlights along every cut and
 * star-like glints where edges converge. Facet tone runs the full range from
 * near-black to near-white — neighbouring facets differ strongly.
 *
 * WHY THIS SHAPE OF SOLUTION
 * Three structural facts drive everything here.
 *
 * 1. CELLS ARE PYRAMIDS, NOT PLANES. A flat cell has one normal, so it shades
 *    as one flat colour and the field reads as coloured polygons no matter how
 *    the colour is chosen. Each cell here raises an apex above its centroid and
 *    fan-triangulates to its boundary, so one cell yields 4-7 triangles that
 *    each catch the light differently. That is where the tonal variation in the
 *    reference comes from, and it is geometry doing it rather than shading.
 *
 * 2. THE CELL HINGES, THE TRIANGLES DO NOT. Triangles are the cell's internal
 *    faceting and never move independently. Rotating them separately is exactly
 *    the "cloud of flying triangles" the brief forbids.
 *
 * 3. EDGES ARE THE SUBJECT. In the reference the bright cut lines carry the
 *    image; the fills sit behind them. So edges are built as first-class output
 *    with their own brightness, not as a stroke applied afterwards.
 *
 * WHY CANVAS AND NOT SVG
 * Rotation about arbitrary per-facet axes, a camera looking into the cut
 * section, and real depth ordering cannot be expressed as SVG transforms. The
 * geometry is real 3D evaluated on the CPU. buildFrame() returns a plain draw
 * list so the same code path can be rasterised headlessly for visual checking.
 */

import { clamp01, makeRng } from "./surface";

export type V2 = readonly [number, number];
export type V3 = { x: number; y: number; z: number };
export type Rgb = readonly [number, number, number];

/* ------------------------------------------------------------------ *
 * 1. FRACTURE — one rectangle, split along cleavage planes
 * ------------------------------------------------------------------ */

/**
 * Minerals cleave along a small number of preferred planes fixed by the
 * lattice, which is why a broken crystal reads as ordered where broken glass
 * does not. Splits come from four families with scatter.
 */
const CLEAVAGE = [-1.18, -0.42, 0.36, 1.24] as const;

function polygonArea(poly: readonly V2[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i += 1) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return Math.abs(a) / 2;
}

function polygonCentroid(poly: readonly V2[]): V2 {
  let x = 0;
  let y = 0;
  for (const p of poly) {
    x += p[0];
    y += p[1];
  }
  return [x / poly.length, y / poly.length];
}

/** Bounding box size. Must be measured per axis: a min/max taken across x and
 *  y together is contaminated by the polygon's POSITION, not just its shape. */
function polygonExtent(poly: readonly V2[]): { w: number; h: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of poly) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { w: maxX - minX, h: maxY - minY };
}

function polygonSpan(poly: readonly V2[]): number {
  const { w, h } = polygonExtent(poly);
  return Math.max(w, h);
}

/**
 * How well a cell fills its own bounding box, and how elongated it is.
 * A thin sliver lights up as a long bright streak once its edges catch, which
 * reads as a scratch across the field rather than as a facet.
 */
function isSliver(poly: readonly V2[]): boolean {
  const { w, h } = polygonExtent(poly);
  if (w < 1e-6 || h < 1e-6) return true;
  if (Math.max(w, h) / Math.min(w, h) > 4.6) return true;
  return polygonArea(poly) / (w * h) < 0.3;
}

/** Cuts a convex polygon with the line through `p` at angle `ang`. */
function splitConvex(
  poly: readonly V2[],
  p: V2,
  ang: number,
): [V2[], V2[]] | null {
  const nx = -Math.sin(ang);
  const ny = Math.cos(ang);
  const side = (v: V2) => (v[0] - p[0]) * nx + (v[1] - p[1]) * ny;

  const a: V2[] = [];
  const b: V2[] = [];

  for (let i = 0; i < poly.length; i += 1) {
    const cur = poly[i];
    const nxt = poly[(i + 1) % poly.length];
    const sc = side(cur);
    const sn = side(nxt);

    if (sc >= 0) a.push(cur);
    if (sc <= 0) b.push(cur);

    if ((sc > 0 && sn < 0) || (sc < 0 && sn > 0)) {
      const t = sc / (sc - sn);
      const cut: V2 = [
        cur[0] + (nxt[0] - cur[0]) * t,
        cur[1] + (nxt[1] - cur[1]) * t,
      ];
      a.push(cut);
      b.push(cut);
    }
  }

  if (a.length < 3 || b.length < 3) return null;
  return [a, b];
}

/**
 * Fractures the rectangle into `count` connected cells.
 *
 * The cells tile the rectangle exactly and every interior edge is in contact
 * with a neighbour, so this is one body that breaks along its own boundaries
 * rather than an arrangement of separate pieces.
 */
export function fractureCells(
  seed: number,
  width: number,
  height: number,
  count: number,
): V2[][] {
  const rng = makeRng(seed ^ 0x51ed270b);
  let cells: V2[][] = [
    [
      [0, 0],
      [width, 0],
      [width, height],
      [0, height],
    ],
  ];

  let guard = 0;
  while (cells.length < count && guard < count * 40) {
    guard += 1;

    cells.sort((p, q) => polygonArea(q) - polygonArea(p));
    const pick = Math.floor(Math.pow(rng(), 2.1) * Math.min(cells.length, 6));
    const target = cells[pick];
    const area = polygonArea(target);
    const [cx, cy] = polygonCentroid(target);
    const span = polygonSpan(target);

    let done = false;
    for (let attempt = 0; attempt < 14 && !done; attempt += 1) {
      const family = CLEAVAGE[Math.floor(rng() * CLEAVAGE.length)];
      const ang = family + (rng() * 2 - 1) * 0.34;
      const px = cx + (rng() * 2 - 1) * span * 0.22;
      const py = cy + (rng() * 2 - 1) * span * 0.22;

      const halves = splitConvex(target, [px, py], ang);
      if (!halves) continue;

      const [h1, h2] = halves;
      if (Math.min(polygonArea(h1), polygonArea(h2)) < area * 0.2) continue;
      if (isSliver(h1) || isSliver(h2)) continue;

      cells = cells.filter((c) => c !== target);
      cells.push(h1, h2);
      done = true;
    }

    if (!done) cells.push(cells.shift() as V2[]);
  }

  return cells;
}

/* ------------------------------------------------------------------ *
 * 2. THE BODY — cells raised into faceted pyramids
 * ------------------------------------------------------------------ */

const sub = (a: V3, b: V3): V3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const cross = (a: V3, b: V3): V3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});
const norm = (v: V3): V3 => {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
};
const dot = (a: V3, b: V3): number => a.x * b.x + a.y * b.y + a.z * b.z;

export type Cell = {
  /** Boundary ring in body space. */
  rim: V3[];
  /** Raised apex the fan triangulates from. */
  apex: V3;
  centroid: V3;
  /** Hinge pivot, a point on one of the cell's own edges. */
  pivot: V3;
  /** Hinge axis, unit length, close to vertical. */
  axis: V3;
  /** Signed peak rotation in radians. */
  swing: number;
  u: number;
  v: number;
  /** 0 = interior mass set back, 1 = the presented face. */
  tier: number;
};

export type CrystalBody = {
  width: number;
  height: number;
  cells: Cell[];
};

function liftCells(
  rng: () => number,
  cells: readonly V2[][],
  width: number,
  height: number,
  tier: number,
  zBase: number,
  reliefScale: number,
): Cell[] {
  const halfW = width / 2;
  const halfH = height / 2;
  const unit = Math.min(width, height);

  return cells.map((cell) => {
    const [ccx, ccy] = polygonCentroid(cell);
    const z0 = zBase + (rng() * 2 - 1) * unit * 0.03;

    /* Relief is proportional to THIS cell's own size, never to the body.
       A fixed global relief gives a small cell a spike many times its own
       width, its fan triangles then cross each other in projection, and the
       surface stops reading as continuous — measured as long crossing slivers
       rather than facets. Sizing relief per cell is what keeps the mesh
       coherent while still tilting every triangle differently.

       The rim rises and falls around the ring and the apex sits proud (or, for
       a minority, sunk), so no two triangles in a fan share a normal — that is
       where the contrast between neighbouring facets comes from. */
    const ext = polygonExtent(cell);
    const cellSize = Math.min(ext.w, ext.h);

    const rim: V3[] = cell.map(([x, y]) => ({
      x: x - halfW,
      y: y - halfH,
      z: z0 + (rng() * 2 - 1) * cellSize * reliefScale * 0.55,
    }));

    const invert = rng() < 0.3 ? -1 : 1;
    const relief = cellSize * reliefScale * (0.6 + rng() * 0.85) * invert;

    const apex: V3 = {
      // Apex offset from dead centre, so the fan is not radially symmetric.
      x: ccx - halfW + (rng() * 2 - 1) * cellSize * 0.07,
      y: ccy - halfH + (rng() * 2 - 1) * cellSize * 0.07,
      z: z0 + relief,
    };

    const centroid: V3 = { x: ccx - halfW, y: ccy - halfH, z: z0 };

    const ei = Math.floor(rng() * rim.length);
    const e0 = rim[ei];
    const e1 = rim[(ei + 1) % rim.length];
    const pivot: V3 = {
      x: (e0.x + e1.x) / 2,
      y: (e0.y + e1.y) / 2,
      z: (e0.z + e1.z) / 2,
    };

    /* Axes lean close to vertical. The collective edge-on moment only reads as
       one compression if the cells fold along a shared direction; the residual
       lean is what keeps it from looking like a single rigid door. */
    const lean = (rng() * 2 - 1) * 0.42;
    const axis = norm({
      x: Math.sin(lean) * 0.55,
      y: Math.cos(lean),
      z: (rng() * 2 - 1) * 0.16,
    });

    return {
      rim,
      apex,
      centroid,
      pivot,
      axis,
      swing: (rng() < 0.5 ? -1 : 1) * (1.24 + rng() * 0.5),
      u: clamp01(ccx / width),
      v: clamp01(ccy / height),
      tier,
    };
  });
}

/**
 * Builds the presented slice.
 *
 * Two tiers. The interior mass is coarser, set back, and barely moves — it is
 * the body the slice was cut from and it is what the presented face is read
 * against. Without it the front facets have nothing behind them and the whole
 * thing flattens.
 */
export function buildCrystalBody(
  seed: number,
  width: number,
  height: number,
  cellCount: number,
): CrystalBody {
  const rng = makeRng(seed ^ 0x1b873593);
  const unit = Math.min(width, height);

  const deep = liftCells(
    rng,
    fractureCells(
      seed ^ 0x2ab3,
      width,
      height,
      Math.max(6, Math.round(cellCount * 0.2)),
    ),
    width,
    height,
    0,
    -unit * 0.3,
    0.34,
  );

  const face = liftCells(
    rng,
    fractureCells(seed, width, height, cellCount),
    width,
    height,
    1,
    0,
    0.46,
  );

  return { width, height, cells: [...deep, ...face] };
}

/**
 * Cell budget. The reference calls for "smaller shards for higher detail", so
 * this is deliberately dense: each cell fans into 4-7 triangles, so a desktop
 * frame carries roughly 700 lit facets.
 */
export function cellCountForViewport(width: number): number {
  if (width < 640) return 64;
  if (width < 1024) return 110;
  if (width < 1600) return 170;
  return 205;
}

/* ------------------------------------------------------------------ *
 * 3. MOTION
 * ------------------------------------------------------------------ */

/** Rodrigues rotation of `v` about unit `axis` through `pivot`. */
export function rotateAbout(v: V3, pivot: V3, axis: V3, ang: number): V3 {
  const p = sub(v, pivot);
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const d = axis.x * p.x + axis.y * p.y + axis.z * p.z;
  const cr = cross(axis, p);
  return {
    x: pivot.x + p.x * c + cr.x * s + axis.x * d * (1 - c),
    y: pivot.y + p.y * c + cr.y * s + axis.y * d * (1 - c),
    z: pivot.z + p.z * c + cr.z * s + axis.z * d * (1 - c),
  };
}

/**
 * How far into its own swing a cell is at global turn progress `t`.
 *
 * sin, not a monotonic ease: the turn runs rest -> edge-on -> rest, so a cell
 * has to come back. The stagger shifts where each peak lands, so cells neither
 * reach edge-on together nor close together.
 */
export function cellSwing(
  c: Cell,
  phase: number,
  t: number,
  spread: number,
): number {
  const local = clamp01((t - phase * spread) / (1 - spread));
  return c.swing * Math.sin(Math.PI * local) * (c.tier === 1 ? 1 : 0.3);
}

/* ------------------------------------------------------------------ *
 * 4. CAMERA — looking slightly into the cut section
 * ------------------------------------------------------------------ */

export type Camera = {
  yaw: number;
  pitch: number;
  focal: number;
  cx: number;
  cy: number;
};

/**
 * A small yaw only. Enough that the eye reads front facets, then depth, then
 * the interior behind — and not so much that the composition becomes a 3D
 * scene. The brief is architectural, so the camera stays nearly square.
 */
export function makeCamera(width: number, height: number): Camera {
  const unit = Math.min(width, height);
  return {
    yaw: 0.16,
    pitch: -0.062,
    focal: unit * 2.4,
    cx: width / 2,
    cy: height / 2,
  };
}

export function viewTransform(v: V3, cam: Camera): V3 {
  const cy = Math.cos(cam.yaw);
  const sy = Math.sin(cam.yaw);
  const x1 = v.x * cy + v.z * sy;
  const z1 = -v.x * sy + v.z * cy;

  const cp = Math.cos(cam.pitch);
  const sp = Math.sin(cam.pitch);
  const y2 = v.y * cp - z1 * sp;
  const z2 = v.y * sp + z1 * cp;

  return { x: x1, y: y2, z: z2 };
}

export type Projected = { x: number; y: number; z: number };

export function project(v: V3, cam: Camera): Projected {
  const s = cam.focal / Math.max(cam.focal + v.z, cam.focal * 0.25);
  return { x: cam.cx + v.x * s, y: cam.cy + v.y * s, z: v.z };
}

/* ------------------------------------------------------------------ *
 * 5. MATERIAL — dense blue crystal under a hard upper-left key
 * ------------------------------------------------------------------ */

/**
 * The CareRadar crystal ramp, read from the reference's own palette swatches:
 * near-black navy, deep blue, crystalline blue, icy cyan, white.
 *
 * A facet's position on this ramp is decided by how its normal meets the key
 * light and nothing else. No facet carries a colour of its own, which is what
 * makes the field read as one substance under one light rather than as a set
 * of tinted shapes.
 */
const RAMP: Rgb[] = [
  [0.031, 0.063, 0.11],
  [0.055, 0.13, 0.216],
  [0.098, 0.243, 0.365],
  [0.169, 0.404, 0.541],
  [0.322, 0.62, 0.733],
  [0.612, 0.827, 0.894],
  [0.925, 0.976, 1.0],
];

function ramp(t: number): Rgb {
  const c = clamp01(t) * (RAMP.length - 1);
  const i = Math.min(Math.floor(c), RAMP.length - 2);
  const f = c - i;
  const a = RAMP[i];
  const b = RAMP[i + 1];
  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ];
}

/** Key light, upper left and slightly toward the viewer — as the reference
 *  annotates it. This is a directional key, not a backlight. */
const KEY = norm({ x: -0.58, y: -0.66, z: 0.48 });
/** A cold, weak fill from the opposite side so shadowed facets keep some
 *  crystalline colour instead of going flat black. */
const FILL = norm({ x: 0.66, y: 0.42, z: 0.62 });
const HALF = norm({ x: KEY.x, y: KEY.y, z: KEY.z + 1 });

export type Shaded = {
  rgb: Rgb;
  /** Brightness of the cut lines bounding this triangle, 0..1. */
  edge: number;
  /** How hard this facet glints, 0..1. */
  glint: number;
};

/**
 * Shades one triangle from its own normal.
 *
 * Lambert is raised to a power below 1 so mid tones spread out, then the whole
 * range is used: a facet turned away lands at near-black navy, one square to
 * the key lands at icy white. The reference's tonal spread between neighbouring
 * facets is the point — a narrow range is what makes crystal look like plastic.
 */
/**
 * Where the key actually falls on the body, 0..1 by position.
 *
 * Shading a facet from its normal alone lights every part of the body equally,
 * which is why the field read as an evenly-lit texture rather than as an object
 * with a light on it. A real source has a place: the mass nearest it blazes and
 * the far side falls away. This also gives the composition its dark left flank,
 * which is where the phase copy sits.
 */
export function keyFalloff(u: number, v: number): number {
  const dx = (u - 0.63) * 1.18;
  const dy = (v - 0.3) * 1.42;
  const d = Math.hypot(dx, dy);
  return 0.26 + 0.86 * Math.exp(-(d * d) / 0.34);
}

export function shadeFacet(n: V3, tier: number, light: number): Shaded {
  const lam = Math.max(0, dot(n, KEY)) * light;
  const fil = Math.max(0, dot(n, FILL));
  const nh = Math.max(0, dot(n, HALF));

  // Tight, hard specular plus a broad sheen.
  const spec = (Math.pow(nh, 90) * 0.95 + Math.pow(nh, 14) * 0.1) * light;

  /* Grazing facets pick up a rim: at near-perpendicular incidence a real cut
     face catches the environment hard. This is what lights the crystal up as
     it folds toward edge-on. */
  const graze = Math.pow(1 - Math.min(1, Math.abs(n.z)), 4);

  /* The ambient floor is doing real work. Without it a facet turned away from
     the key lands on the bottom of the ramp and goes near-black, which measured
     out at 55% of the field — a dark mass with sparse bright chips, not the
     reference. A real crystal never has black facets: light that entered
     elsewhere scatters inside and leaves through them, so the shadows sit in
     deep blue. That floor is what makes the body read as one lit substance
     rather than as lit shapes on a dark ground. */
  let t = 0.1 + light * 0.12 + Math.pow(lam, 0.58) * 0.92 + fil * 0.12 * light + graze * 0.22 * light;

  // Interior mass sits back: dimmer and lower contrast, but still blue.
  if (tier === 0) t = 0.1 + t * 0.4;

  const base = ramp(clamp01(t));
  const s = tier === 1 ? spec : spec * 0.25;

  return {
    rgb: [clamp01(base[0] + s), clamp01(base[1] + s * 1.02), clamp01(base[2] + s)],
    /* Cut lines carry the image in the reference, so they never drop out
       entirely — the floor keeps the lattice legible across the whole body
       while the key still decides which cuts sparkle. */
    edge: clamp01(0.16 + light * 0.2 + Math.pow(lam, 0.9) * 0.6 + graze * 0.3 * light),
    glint: tier === 1 ? clamp01(spec * 1.4 + Math.pow(lam, 6) * 0.5) : 0,
  };
}

/* ------------------------------------------------------------------ *
 * 6. FRAME — the draw list
 *
 * Pure output so the browser renderer and the headless rasteriser used to check
 * this against the reference draw exactly the same thing.
 * ------------------------------------------------------------------ */

export type FaceDraw = {
  pts: { x: number; y: number }[];
  z: number;
  rgb: Rgb;
};

export type EdgeDraw = {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  /** 0..1, bucketed by the renderer. */
  power: number;
  z: number;
};

export type GlintDraw = { x: number; y: number; power: number; z: number };

export type Frame = {
  faces: FaceDraw[];
  edges: EdgeDraw[];
  glints: GlintDraw[];
};

function faceNormal(a: V3, b: V3, c: V3): V3 {
  return norm(cross(sub(b, a), sub(c, a)));
}

export function buildFrame(
  body: CrystalBody,
  cam: Camera,
  turn: number,
  phaseOf: (u: number, v: number) => number,
  spread: number,
): Frame {
  const faces: FaceDraw[] = [];
  const edges: EdgeDraw[] = [];
  const glints: GlintDraw[] = [];

  for (const cell of body.cells) {
    const ang = cellSwing(cell, phaseOf(cell.u, cell.v), turn, spread);
    const light = keyFalloff(cell.u, cell.v);

    // The cell hinges as one piece; its triangles are internal faceting.
    const rim = cell.rim.map((v) =>
      viewTransform(rotateAbout(v, cell.pivot, cell.axis, ang), cam),
    );
    const apex = viewTransform(
      rotateAbout(cell.apex, cell.pivot, cell.axis, ang),
      cam,
    );

    const pr = rim.map((v) => project(v, cam));
    const pa = project(apex, cam);

    let brightest = 0;

    for (let i = 0; i < rim.length; i += 1) {
      const j = (i + 1) % rim.length;
      const n = faceNormal(apex, rim[i], rim[j]);
      // Present whichever way the triangle faces; the body is solid.
      const facing: V3 = n.z < 0 ? { x: -n.x, y: -n.y, z: -n.z } : n;
      const sh = shadeFacet(facing, cell.tier, light);

      /* Thin triangles are a small tail of the fan distribution — around 1% of
         the mesh — but a long near-white sliver on a dark ground dominates the
         frame completely, and they read as scratches drawn across the crystal
         rather than as facets. A narrow bevel in real stone is not a mirror, so
         both the fill and the cut are damped by thinness. Removing them instead
         would leave holes in a surface that has to stay continuous. */
      const e0 = Math.hypot(pr[i].x - pa.x, pr[i].y - pa.y);
      const e1 = Math.hypot(pr[j].x - pr[i].x, pr[j].y - pr[i].y);
      const e2 = Math.hypot(pa.x - pr[j].x, pa.y - pr[j].y);
      const longest = Math.max(e0, e1, e2, 1e-6);
      const tri2 = Math.abs(
        (pr[i].x - pa.x) * (pr[j].y - pa.y) - (pr[i].y - pa.y) * (pr[j].x - pa.x),
      );
      const slim = clamp01(tri2 / (longest * longest) / 0.16);
      const damp = 0.34 + slim * 0.66;

      faces.push({
        pts: [pa, pr[i], pr[j]],
        z: (apex.z + rim[i].z + rim[j].z) / 3,
        rgb: [sh.rgb[0] * damp, sh.rgb[1] * damp, sh.rgb[2] * damp],
      });

      // Spoke (apex to rim) and the rim segment itself.
      edges.push({
        ax: pa.x,
        ay: pa.y,
        bx: pr[i].x,
        by: pr[i].y,
        power: sh.edge * slim * (cell.tier === 1 ? 1 : 0.2),
        z: (apex.z + rim[i].z) / 2,
      });
      edges.push({
        ax: pr[i].x,
        ay: pr[i].y,
        bx: pr[j].x,
        by: pr[j].y,
        power: sh.edge * slim * (cell.tier === 1 ? 1 : 0.2),
        z: (rim[i].z + rim[j].z) / 2,
      });

      if (sh.glint > brightest) brightest = sh.glint;
    }

    /* Glints sit where the fan converges. Selective by design — the reference
       carries a handful of hard stars, not a field of sparkles. */
    if (cell.tier === 1 && brightest > 0.52) {
      glints.push({ x: pa.x, y: pa.y, power: brightest, z: apex.z });
    }
  }

  faces.sort((a, b) => b.z - a.z);
  edges.sort((a, b) => b.z - a.z);

  return { faces, edges, glints };
}

/* ------------------------------------------------------------------ *
 * 7. GROUND — the dark field the crystal sits in
 * ------------------------------------------------------------------ */

/** Near-black navy, as in the reference. */
export const GROUND: Rgb = [0.02, 0.043, 0.075];
/** The cold bloom behind the mass, upper-left of centre with the key. */
export const GLOW: Rgb = [0.09, 0.28, 0.42];

export const css = (c: Rgb, a = 1): string =>
  `rgba(${Math.round(clamp01(c[0]) * 255)},${Math.round(clamp01(c[1]) * 255)},${Math.round(clamp01(c[2]) * 255)},${a.toFixed(3)})`;
