/**
 * Painting the lattice as something ON glass rather than something behind it.
 *
 * THE ONE RULE THIS FILE ENFORCES
 * Everything is drawn in a single pass, front to back, with no depth sort. The
 * lattice is a plane. Depth is expressed by exactly two devices — a few pixels
 * of node parallax, and one dimmer echo of the line work offset behind it, read
 * as the second pane of a double-glazed unit. Neither device can ever put one
 * facet in front of another, because facets tile.
 *
 * WHY THE GROUND IS NOT BLACK
 * A window has daylight on the far side of it. The ground here carries a soft
 * exterior bloom low and right of centre, so the glass reads as glazed rather
 * than as a void with lines on it. That bloom is also where the window later
 * opens, so the light is telling the truth about what is coming.
 */

import { clamp01 } from "../surface";
import type { Lattice, LatticeMode } from "./lattice";
import { depthOf } from "./lattice";

/* ------------------------------------------------------------------ *
 * Palette — the existing CareRadar navy/teal family, nothing new.
 * ------------------------------------------------------------------ */

export const PALETTE = {
  /** Deep navy at the head of the glass. */
  glassTop: "#04121f",
  /** Body of the pane. */
  glassBody: "#082337",
  /** Daylight beyond the glass. Cool, never warm — warmth arrives with sky. */
  glassHaze: "#12496b",
  /** Line work: CareRadar teal cooled toward ice. */
  line: "134, 217, 210",
  lineHot: "234, 251, 255",
  node: "94, 234, 212",
  facet: "127, 201, 224",
  /** Frame: anodised aluminium, not black. */
  frame: "#0d2233",
  frameEdge: "#1d4055",
} as const;

/** Where the exterior light sits, in normalised pane coordinates. */
export const LIGHT_UV = { u: 0.66, v: 0.44 } as const;

export type Camera = {
  /** Parallax offset in px, applied against node z. */
  ax: number;
  ay: number;
  /** >1 pushes the lattice outward toward the frame. */
  scale: number;
  cx: number;
  cy: number;
  /* Lattice space to canvas space. A lattice is built from window.innerWidth /
     innerHeight, but the canvas it lands on is measured with clientWidth /
     clientHeight, and those differ by a scrollbar, by a stage that is not a
     full viewport tall, and by anything that resizes between the two reads.
     Mapping 1:1 and hoping leaves the bottom of the composition off the canvas,
     so the fit is computed rather than assumed. */
  fitX: number;
  fitY: number;
  /** Mean of the two, for anything measured in lattice units. */
  fit: number;
};

export type LatticeView = {
  /** Seconds since mount, for the ambient drift. */
  time: number;
  /** Journey position in milestone units, 0..6. Negative disables journey
   *  lighting entirely and the whole lattice sits at full presence. */
  journey: number;
  /** 0..1 — the window opening. Pushes the lattice out and thins the centre. */
  openness: number;
  /** 0..1 — master opacity of the line work. */
  presence: number;
};

export const IDLE_VIEW: LatticeView = {
  time: 0,
  journey: -1,
  openness: 0,
  presence: 1,
};

/* ------------------------------------------------------------------ *
 * Glass
 * ------------------------------------------------------------------ */

type GradientCache = {
  key: string;
  base: CanvasGradient;
  haze: CanvasGradient;
};

let glassCache: GradientCache | null = null;

function glassGradients(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
): GradientCache {
  const key = `${Math.round(w)}x${Math.round(h)}`;
  if (glassCache && glassCache.key === key) return glassCache;

  const base = ctx.createLinearGradient(0, 0, w * 0.25, h);
  base.addColorStop(0, PALETTE.glassTop);
  base.addColorStop(0.55, PALETTE.glassBody);
  base.addColorStop(1, "#061a2a");

  const cx = w * LIGHT_UV.u;
  const cy = h * LIGHT_UV.v;
  const haze = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.72);
  haze.addColorStop(0, "rgba(18,73,107,0.62)");
  haze.addColorStop(0.42, "rgba(18,73,107,0.24)");
  haze.addColorStop(1, "rgba(18,73,107,0)");

  glassCache = { key, base, haze };
  return glassCache;
}

/**
 * The pane itself.
 *
 * `openness` lifts the exterior light: as the window starts to give, more of
 * the outside reaches the glass before anything has visibly moved. That is what
 * makes the opening feel like a consequence rather than an effect.
 */
export function paintGlass(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  openness: number,
): void {
  const g = glassGradients(ctx, w, h);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = g.base;
  ctx.fillRect(0, 0, w, h);

  ctx.globalAlpha = 0.55 + openness * 0.45;
  ctx.fillStyle = g.haze;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 1;
}

/**
 * Two broad, near-invisible diagonals across the pane.
 *
 * This is the entire "refraction" budget. A sheet of glass at an angle to a
 * light source shows a couple of soft bands and nothing else; more than two and
 * the surface stops being glass and starts being a lens flare.
 */
export function paintRefraction(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  amount: number,
): void {
  if (amount <= 0.01) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const bands: readonly [number, number, number][] = [
    [0.28, 0.16, 0.026],
    [0.62, 0.1, 0.017],
  ];
  for (const [at, width, alpha] of bands) {
    const drift = Math.sin(time * 0.045 + at * 9) * 0.02;
    const x = (at + drift) * w;
    const grad = ctx.createLinearGradient(x - w * width, 0, x + w * width, h);
    grad.addColorStop(0, "rgba(150,214,235,0)");
    grad.addColorStop(0.5, `rgba(180,228,248,${(alpha * amount).toFixed(4)})`);
    grad.addColorStop(1, "rgba(150,214,235,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}

/* ------------------------------------------------------------------ *
 * Journey lighting
 * ------------------------------------------------------------------ */

/**
 * How lit an island is at journey position `j`.
 *
 * Three states in one expression: ahead sits at 0.13 and is barely there;
 * active peaks near 0.85; passed settles back to 0.46 rather than going dark,
 * because a completed step is still part of the built system. The client asked
 * for the previous milestone to recede — recede, not vanish.
 */
export function islandLight(island: number, j: number): number {
  if (j < 0 || island < 0) return 1;
  const d = j - island;
  const near = Math.max(0, 1 - Math.abs(d));
  const built = clamp01(d);
  return clamp01(0.13 + built * 0.33 + near * 0.72);
}

/**
 * Brightness of a spine element as the connection travels along it.
 *
 * `arrive` is the wipe that leaves the path lit behind it; `head` is a narrow
 * crest riding the wavefront. The crest is what makes a connection read as
 * being MADE rather than switched on.
 */
function spineLight(spine: number, spineT: number, j: number): number {
  if (j < 0 || spine < 0) return -1;
  const delta = j - spine - spineT;
  const arrive = clamp01(delta * 7 + 0.5);
  const head = Math.exp(-((delta * 5.5) ** 2));
  return clamp01(arrive * 0.62 + head * 0.55);
}

/* ------------------------------------------------------------------ *
 * Lattice
 * ------------------------------------------------------------------ */

const EDGE_BUCKETS = 6;

type Screen = { x: number; y: number };

/** Node positions for this frame, in screen space. */
export function projectNodes(
  lattice: Lattice,
  cam: Camera,
  time: number,
): Screen[] {
  const out: Screen[] = new Array(lattice.nodes.length);
  for (let i = 0; i < lattice.nodes.length; i += 1) {
    const n = lattice.nodes[i];
    /* Drift is in canvas pixels and must not be scaled by the fit, or a
       stage with a different aspect would breathe at a different amplitude. */
    const bx = n.x * cam.fitX + Math.sin(time * n.speed + n.phase) * n.drift;
    const by =
      n.y * cam.fitY + Math.cos(time * n.speed * 0.83 + n.phase) * n.drift * 0.72;
    out[i] = {
      x: cam.cx + (bx - cam.cx) * cam.scale + n.z * cam.ax,
      y: cam.cy + (by - cam.cy) * cam.scale + n.z * cam.ay,
    };
  }
  return out;
}

export function makeCamera(
  lattice: Lattice,
  w: number,
  h: number,
  view: LatticeView,
): Camera {
  const depth = depthOf(lattice.mode);
  /* The camera breathes, the lattice does not. Moving the observer is both
     more physical and far less distracting than animating the material, and it
     is the one place the existing crystal got the principle right. */
  const fitX = w / lattice.width;
  const fitY = h / lattice.height;
  return {
    ax: Math.sin(view.time * 0.11) * depth,
    ay: Math.cos(view.time * 0.083) * depth * 0.55,
    /* A light outward push only. This was 0.85 while the pane was one flat
       surface, which was right then and wrong the moment the pane became two
       hinged leaves: the leaves already carry the lattice to the edges
       themselves, and scaling on top of that swept the whole right half of the
       composition off its own leaf, leaving a bare dark panel. */
    scale: 1 + view.openness * 0.22,
    cx: w * LIGHT_UV.u,
    cy: h * LIGHT_UV.v,
    fitX,
    fitY,
    fit: (fitX + fitY) / 2,
  };
}

/**
 * One lattice frame: facets, then the echo pane, then edges, then nodes.
 *
 * Facets go first and stay under the line work, so every fill is bounded by a
 * drawn edge. That is what stops a facet reading as a free-floating surface.
 */
export function paintLattice(
  ctx: CanvasRenderingContext2D,
  lattice: Lattice,
  cam: Camera,
  view: LatticeView,
  pts: Screen[],
): void {
  const { journey, presence, openness } = view;

  /* As the window opens the centre of the pane clears first — the leaves are
     parting there. Distance from the light centre decides how much line work
     survives, which keeps the fade spatial rather than a flat dissolve. */
  const clearRadius =
    Math.hypot(lattice.width * cam.fitX, lattice.height * cam.fitY) * 0.5;
  const centreFade = (x: number, y: number): number => {
    if (openness <= 0.001) return 1;
    const d = Math.hypot(x - cam.cx, y - cam.cy) / clearRadius;
    /* Same correction: the leaves parting clear the centre physically, so the
       painted clearance only has to help, not do the job on its own. */
    return clamp01(d * 1.5 - openness * 0.6 + 0.35);
  };

  /* ---- facets ---- */
  ctx.globalCompositeOperation = "source-over";
  for (const f of lattice.facets) {
    const a = pts[f.a];
    const b = pts[f.b];
    const c = pts[f.c];
    const light =
      f.spine >= 0 && journey >= 0
        ? Math.max(islandLight(f.island, journey), spineLight(f.spine, 0.5, journey))
        : islandLight(f.island, journey);
    const alpha =
      f.alpha * light * presence * centreFade((a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3);
    if (alpha < 0.002) continue;
    ctx.fillStyle = `rgba(${PALETTE.facet},${alpha.toFixed(4)})`;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.closePath();
    ctx.fill();
  }

  /* ---- echo pane ----
     The same line work, scaled a fraction about the light centre and offset a
     few pixels. Read as the reflection in the inner pane of a sealed unit. It
     is the only depth cue in the composition that is allowed to be visible, and
     it works because it is a copy of the lattice rather than another lattice. */
  if (presence > 0.02) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `rgba(${PALETTE.line},${(0.055 * presence).toFixed(4)})`;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    for (const e of lattice.edges) {
      if (journey >= 0 && islandLight(e.island, journey) < 0.3 && e.spine < 0) continue;
      const a = pts[e.a];
      const b = pts[e.b];
      ctx.moveTo(cam.cx + (a.x - cam.cx) * 0.972 + 5, cam.cy + (a.y - cam.cy) * 0.972 + 7);
      ctx.lineTo(cam.cx + (b.x - cam.cx) * 0.972 + 5, cam.cy + (b.y - cam.cy) * 0.972 + 7);
    }
    ctx.stroke();
    ctx.restore();
  }

  /* ---- edges ----
     Bucketed by brightness so ~400 lines cost six strokes. Additive, so where
     lines converge the accumulation itself makes the junction bright — the
     node is a consequence of the network meeting, not a sprite. */
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";

  const buckets: number[][] = Array.from({ length: EDGE_BUCKETS }, () => []);
  for (let i = 0; i < lattice.edges.length; i += 1) {
    const e = lattice.edges[i];
    const spine = spineLight(e.spine, e.spineT, journey);
    const light = spine >= 0 ? Math.max(spine, islandLight(e.island, journey)) : islandLight(e.island, journey);
    const a = pts[e.a];
    const b = pts[e.b];
    const power =
      e.weight * light * presence * centreFade((a.x + b.x) / 2, (a.y + b.y) / 2);
    if (power < 0.015) continue;
    const bucket = Math.min(EDGE_BUCKETS - 1, Math.floor(power * EDGE_BUCKETS));
    buckets[bucket].push(i);
  }

  for (let b = 0; b < EDGE_BUCKETS; b += 1) {
    if (buckets[b].length === 0) continue;
    const mid = (b + 0.5) / EDGE_BUCKETS;
    ctx.beginPath();
    for (const i of buckets[b]) {
      const e = lattice.edges[i];
      ctx.moveTo(pts[e.a].x, pts[e.a].y);
      ctx.lineTo(pts[e.b].x, pts[e.b].y);
    }
    /* Hot lines shift toward white, cool ones stay teal. The shift is small —
       the lattice is one material under one light, not a colour ramp. */
    const hot = mid ** 2.2;
    ctx.strokeStyle = `rgba(${
      Math.round(134 + hot * 100)
    },${Math.round(217 + hot * 34)},${Math.round(210 + hot * 45)},${(
      0.1 + mid * 0.62
    ).toFixed(3)})`;
    ctx.lineWidth = 0.55 + hot * 0.85;
    ctx.stroke();
  }
  ctx.restore();

  /* ---- nodes ---- */
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < lattice.nodes.length; i += 1) {
    const n = lattice.nodes[i];
    if (!n.shown) continue;
    const p = pts[i];
    const spine = spineLight(n.spine, n.spineT, journey);
    const light = Math.max(islandLight(n.island, journey), spine);
    const alpha = light * presence * centreFade(p.x, p.y);
    if (alpha < 0.02) continue;

    const isAnchor = n.anchor >= 0;
    const active = isAnchor && journey >= 0 ? Math.max(0, 1 - Math.abs(journey - n.anchor)) : 0;
    const r = isAnchor ? 2.6 + active * 2.2 : 1.05 + Math.min(n.degree, 6) * 0.16;

    ctx.fillStyle = `rgba(${PALETTE.node},${(alpha * (isAnchor ? 0.95 : 0.5)).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();

    /* A milestone under the cursor of the journey gets one ring and one soft
       halo. Two devices, not five — the label beside it is doing the rest of
       the work and the node only has to say "here". */
    if (active > 0.02) {
      const ring = lattice.spacing * cam.fit * (0.2 + (1 - active) * 0.34);
      ctx.strokeStyle = `rgba(${PALETTE.lineHot},${(active * 0.5 * presence).toFixed(3)})`;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(p.x, p.y, ring, 0, Math.PI * 2);
      ctx.stroke();

      const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, ring * 1.7);
      halo.addColorStop(0, `rgba(180,246,238,${(active * 0.3 * presence).toFixed(3)})`);
      halo.addColorStop(1, "rgba(180,246,238,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(p.x, p.y, ring * 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

/** Full pane: glass, refraction, lattice. */
export function paintPane(
  ctx: CanvasRenderingContext2D,
  lattice: Lattice,
  w: number,
  h: number,
  view: LatticeView,
): void {
  const cam = makeCamera(lattice, w, h, view);
  const pts = projectNodes(lattice, cam, view.time);
  paintGlass(ctx, w, h, view.openness);
  paintRefraction(ctx, w, h, view.time, view.presence * (1 - view.openness * 0.7));
  paintLattice(ctx, lattice, cam, view, pts);
}

/** Screen position of each milestone anchor, for DOM labels to track. */
export function anchorPositions(
  lattice: Lattice,
  w: number,
  h: number,
  view: LatticeView,
): Screen[] {
  const cam = makeCamera(lattice, w, h, view);
  const pts = projectNodes(lattice, cam, view.time);
  return lattice.anchors.map((i) => pts[i]);
}

/* ------------------------------------------------------------------ *
 * Sky
 * ------------------------------------------------------------------ */

type SkyCache = { key: string; grad: CanvasGradient };
let skyCache: SkyCache | null = null;

/**
 * Northern European daylight: cool high, pale and slightly warm at the horizon,
 * never tropical. The window opens onto Germany, and the light should already
 * say so before the aircraft does.
 */
export function paintSky(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  amount: number,
): void {
  if (amount <= 0.002) return;
  const key = `${Math.round(w)}x${Math.round(h)}`;
  if (!skyCache || skyCache.key !== key) {
    const grad = ctx.createLinearGradient(0, 0, w * 0.15, h);
    grad.addColorStop(0, "#2f6b96");
    grad.addColorStop(0.34, "#6ba3c6");
    grad.addColorStop(0.68, "#b3d3e2");
    grad.addColorStop(0.88, "#dfe9e6");
    grad.addColorStop(1, "#eae2d2");
    skyCache = { key, grad };
  }

  ctx.save();
  ctx.globalAlpha = clamp01(amount);
  ctx.fillStyle = skyCache.grad;
  ctx.fillRect(0, 0, w, h);

  /* Five cloud banks, all horizontal, all very soft. Clouds that read as
     individual objects turn the sky into an illustration; these are meant to
     register as atmosphere and depth cue only. */
  const banks: readonly [number, number, number, number][] = [
    [0.18, 0.3, 0.34, 0.2],
    [0.62, 0.2, 0.4, 0.16],
    [0.88, 0.42, 0.3, 0.14],
    [0.36, 0.56, 0.46, 0.1],
    [0.08, 0.68, 0.34, 0.08],
  ];
  ctx.globalCompositeOperation = "screen";
  for (const [u, v, size, alpha] of banks) {
    const drift = ((time * 0.004 + u) % 1.35) - 0.18;
    const cx = drift * w;
    const cy = v * h;
    const rx = w * size;
    const ry = h * size * 0.14;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    g.addColorStop(0, `rgba(255,255,255,${(alpha * amount).toFixed(4)})`);
    g.addColorStop(0.55, `rgba(255,255,255,${(alpha * 0.4 * amount).toFixed(4)})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, ry / rx);
    ctx.translate(-cx, -cy);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

/** Reset the module-level gradient caches — used on resize. */
export function invalidateGradients(): void {
  glassCache = null;
  skyCache = null;
}

export type { LatticeMode };
