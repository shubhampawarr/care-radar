/**
 * Airliner to paper plane, as one silhouette losing information.
 *
 * WHY NOT A CROSSFADE
 * A crossfade between two drawings is the cartoon morph the brief rules out:
 * for the middle third of it there are two aircraft on screen. What happens
 * here instead is that ONE closed outline is interpolated between two planforms
 * that have been resampled to a shared point count, so at every instant there
 * is exactly one aircraft and it is always a plausible shape.
 *
 * WHY THE STAGGER MATTERS MORE THAN THE MORPH
 * Interpolating every point on the same clock reads as a shape being squashed.
 * Each point here runs on its own clock, offset by how far aft it sits, so the
 * tail assembly and the wing root simplify before the nose does. The eye reads
 * that as detail falling away from the back forward, which is what
 * simplification actually looks like, rather than as a shape changing size.
 *
 * The detail layer — nacelles, fuselage spine, fin — fades out early, under the
 * outline, and the fold creases fade in late. So the sequence is: an aircraft
 * with parts, then an aircraft as a silhouette, then a folded sheet. Three
 * readings, one object, no cut.
 */

import { clamp01 } from "../surface";
import { PAPER } from "../surface";

export type Pt2 = { x: number; y: number };

/* ------------------------------------------------------------------ *
 * The two planforms
 *
 * Both authored as the upper half only, nose (+1, 0) to tail (-1, 0), and
 * mirrored below. Symmetry has to be exact or the morph develops a wobble that
 * reads as a mistake at exactly the moment the shape is meant to look resolved.
 * ------------------------------------------------------------------ */

type Profile = {
  /** Upper half only, nose (+1, 0) first, tail (-1, 0) last. */
  half: readonly Pt2[];
  /** Indices into `half` of the six landmarks, in order. */
  marks: readonly [number, number, number, number, number, number];
};

/**
 * Landmark order, shared by both aircraft:
 *
 *   0 nose · 1 wing leading-edge root · 2 wingtip
 *   3 wing trailing-edge root · 4 aft feature · 5 tail
 *
 * The aft feature is the tailplane tip on the airliner and the notch between
 * wing and keel on the dart. They are not the same part, but they occupy the
 * same place in the silhouette, which is what the morph needs of them.
 */
const AIRLINER: Profile = {
  half: [
    { x: 1.0, y: 0.0 },
    { x: 0.95, y: 0.036 },
    { x: 0.86, y: 0.058 },
    { x: 0.68, y: 0.068 },
    { x: 0.22, y: 0.078 },
    { x: -0.2, y: 0.6 },
    { x: -0.3, y: 0.615 },
    { x: -0.12, y: 0.105 },
    { x: -0.58, y: 0.088 },
    { x: -0.82, y: 0.3 },
    { x: -0.9, y: 0.305 },
    { x: -0.94, y: 0.078 },
    { x: -1.0, y: 0.0 },
  ],
  marks: [0, 4, 6, 7, 10, 12],
};

/**
 * A classic folded dart. Long straight leading edges, wide tips, and a trailing
 * edge that sweeps back in toward a central keel — the notch between wing and
 * keel is the single detail that makes it read as folded paper rather than as a
 * generic arrowhead.
 */
const DART: Profile = {
  half: [
    { x: 1.0, y: 0.0 },
    { x: 0.62, y: 0.14 },
    { x: 0.16, y: 0.31 },
    { x: -0.62, y: 0.6 },
    { x: -0.95, y: 0.74 },
    { x: -0.78, y: 0.34 },
    { x: -0.7, y: 0.16 },
    { x: -0.88, y: 0.1 },
    { x: -0.95, y: 0.0 },
  ],
  marks: [0, 2, 4, 5, 7, 8],
};

/**
 * Points allocated to each of the five landmark-to-landmark runs.
 *
 * WHY NOT PLAIN ARC-LENGTH RESAMPLING
 * The first version resampled each whole outline evenly by arc length and
 * assumed that would put nose on nose and tip on tip, because both shapes start
 * at the nose and run the same way round. It does not. The airliner's perimeter
 * is dominated by a thin fuselage and two spikes, the dart's by two long
 * straight leading edges, so the same fraction of the way round lands on the
 * tailplane of one and the wingtip of the other. Every intermediate frame was
 * then an interpolation between parts that do not correspond, and it rendered
 * as a shapeless grey blob through the whole middle of the transition.
 *
 * Resampling run by run between matched landmarks fixes it by construction:
 * nose to nose, tip to tip, tail to tail, and evenly spaced points along
 * corresponding edges in between.
 */
const RUN_POINTS = [14, 10, 8, 10, 6] as const;

/** Evenly spaced points along one run of a half profile, endpoint excluded. */
function runPoints(
  half: readonly Pt2[],
  from: number,
  to: number,
  count: number,
): Pt2[] {
  const seg: number[] = [];
  let total = 0;
  for (let i = from; i < to; i += 1) {
    const len = Math.hypot(half[i + 1].x - half[i].x, half[i + 1].y - half[i].y);
    seg.push(len);
    total += len;
  }

  const out: Pt2[] = [];
  for (let k = 0; k < count; k += 1) {
    const targetLen = (k / count) * total;
    let walked = 0;
    let edge = 0;
    while (edge < seg.length - 1 && walked + seg[edge] < targetLen) {
      walked += seg[edge];
      edge += 1;
    }
    const t = seg[edge] > 1e-9 ? (targetLen - walked) / seg[edge] : 0;
    const a = half[from + edge];
    const b = half[from + edge + 1];
    out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  }
  return out;
}

/** One profile as a closed polygon with a fixed, landmark-aligned point set. */
function buildOutline(p: Profile): Pt2[] {
  const upper: Pt2[] = [];
  for (let i = 0; i < RUN_POINTS.length; i += 1) {
    upper.push(...runPoints(p.half, p.marks[i], p.marks[i + 1], RUN_POINTS[i]));
  }
  upper.push({ ...p.half[p.marks[5]] });

  /* Mirrored, with nose and tail dropped so neither is duplicated. Symmetry has
     to be exact or the morph develops a wobble that reads as a mistake at
     exactly the moment the shape is meant to look resolved. */
  const lower = upper
    .slice(1, -1)
    .reverse()
    .map((q) => ({ x: q.x, y: -q.y }));

  return [...upper, ...lower];
}

const AIRLINER_PTS = buildOutline(AIRLINER);
const DART_PTS = buildOutline(DART);
const MORPH_POINTS = AIRLINER_PTS.length;

/** Per-point clock offset: 0 at the nose, 1 at the tail. */
const OFFSET = AIRLINER_PTS.map((p) => clamp01((1 - (p.x + 1) / 2) ** 1.15));

const smooth = (t: number): number => t * t * (3 - 2 * t);

/**
 * How far apart the nose and tail clocks run, as a fraction of the morph.
 *
 * Gentler than the 0.38 this started at. With correspondence fixed the stagger
 * no longer has to carry the transition on its own, and a large one now only
 * distorts the intermediate shape it is supposed to be characterising.
 */
const STAGGER = 0.22;

/**
 * The silhouette at morph position `t`, 0 = airliner, 1 = dart.
 *
 * Reuses one array across frames: this runs inside a scroll-driven render loop,
 * and allocating a hundred objects a frame is exactly the kind of quiet cost
 * the brief asks to avoid.
 */
const scratch: Pt2[] = AIRLINER_PTS.map((p) => ({ ...p }));

export function silhouette(t: number): readonly Pt2[] {
  const g = clamp01(t);
  for (let i = 0; i < MORPH_POINTS; i += 1) {
    const lead = OFFSET[i] * STAGGER;
    const local = smooth(clamp01((g - lead) / (1 - STAGGER)));
    scratch[i].x =
      AIRLINER_PTS[i].x + (DART_PTS[i].x - AIRLINER_PTS[i].x) * local;
    scratch[i].y =
      AIRLINER_PTS[i].y + (DART_PTS[i].y - AIRLINER_PTS[i].y) * local;
  }
  return scratch;
}

/* ------------------------------------------------------------------ *
 * Drawing
 * ------------------------------------------------------------------ */

export type AircraftDraw = {
  /** Centre in canvas px. */
  x: number;
  y: number;
  /** Half-span in px. A distant airliner is a handful of pixels. */
  size: number;
  /** 0 = airliner, 1 = paper dart. */
  morph: number;
  /** Radians. Small negative values read as a climb. */
  heading: number;
  /** 0..1 master opacity. */
  alpha: number;
  /** 0..1 how much haze sits between the viewer and the aircraft. */
  haze: number;
};

function pathFrom(
  ctx: CanvasRenderingContext2D,
  pts: readonly Pt2[],
  size: number,
  squash: number,
): void {
  ctx.beginPath();
  for (let i = 0; i < pts.length; i += 1) {
    const x = pts[i].x * size;
    const y = pts[i].y * size * squash;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/**
 * One aircraft.
 *
 * Material travels with the shape: a distant airliner is a dark chip against a
 * bright sky and has no colour of its own, so it starts as a desaturated slate
 * that the haze washes out. As it simplifies it takes on the warm paper white
 * and warm ink outline already used by the paper-cut scenes elsewhere in this
 * codebase, which is what ties the ending back to CareRadar's existing
 * illustration language instead of inventing a new one for the last section.
 */
export function drawAircraft(ctx: CanvasRenderingContext2D, d: AircraftDraw): void {
  if (d.alpha <= 0.004 || d.size <= 0.2) return;
  const m = clamp01(d.morph);

  /* Foreshortening opens up as the object simplifies: a jet three kilometres
     off is seen nearly edge-on, a paper plane held at arm's length is seen
     almost flat. The camera closing the distance is doing this, not the plane. */
  const squash = 0.4 + m * 0.5;

  ctx.save();
  ctx.translate(d.x, d.y);
  ctx.rotate(d.heading);

  const pts = silhouette(m);
  const detail = 1 - smooth(clamp01((m - 0.08) / 0.42));
  const creases = smooth(clamp01((m - 0.52) / 0.44));

  /* ---- body ---- */
  const washed = d.haze * (1 - m * 0.75);
  const fill = mixHex("#22323f", PAPER.white, smooth(clamp01((m - 0.3) / 0.55)));
  pathFrom(ctx, pts, d.size, squash);
  ctx.globalAlpha = d.alpha * (1 - washed * 0.45);
  ctx.fillStyle = fill;
  ctx.fill();

  /* One wing sits in shade. Without it the dart is a flat arrowhead; with it
     the sheet has two planes and a fold between them, which is the whole
     reading. Clipped to the silhouette so it can never spill. */
  if (creases > 0.02) {
    ctx.save();
    pathFrom(ctx, pts, d.size, squash);
    ctx.clip();
    ctx.globalAlpha = d.alpha * creases * 0.55;
    ctx.fillStyle = PAPER.sand;
    ctx.fillRect(-d.size * 1.2, 0, d.size * 2.4, d.size * 1.2);
    ctx.restore();
  }

  /* ---- airliner detail, fading out under the outline ---- */
  if (detail > 0.02 && d.size > 5) {
    ctx.globalAlpha = d.alpha * detail * 0.7;
    ctx.fillStyle = "#101c26";
    // Fuselage spine.
    ctx.fillRect(-d.size * 0.9, -d.size * squash * 0.05, d.size * 1.82, d.size * squash * 0.1);
    // Two nacelles.
    for (const s of [-1, 1]) {
      ctx.fillRect(
        -d.size * 0.12,
        s * d.size * squash * 0.3 - d.size * squash * 0.045,
        d.size * 0.26,
        d.size * squash * 0.09,
      );
    }
    // Vertical fin, seen nearly edge-on from this angle.
    ctx.beginPath();
    ctx.moveTo(-d.size * 0.72, 0);
    ctx.lineTo(-d.size * 0.98, -d.size * squash * 0.34);
    ctx.lineTo(-d.size * 0.86, 0);
    ctx.closePath();
    ctx.fill();
  }

  /* ---- outline ---- */
  ctx.globalAlpha = d.alpha * (0.25 + m * 0.6) * (1 - washed * 0.5);
  ctx.strokeStyle = mixHex("#0b1620", PAPER.ink, m);
  ctx.lineWidth = Math.max(0.6, d.size * 0.022);
  ctx.lineJoin = "round";
  pathFrom(ctx, pts, d.size, squash);
  ctx.stroke();

  /* ---- creases, fading in ---- */
  if (creases > 0.02 && d.size > 6) {
    ctx.globalAlpha = d.alpha * creases * 0.42;
    ctx.strokeStyle = PAPER.ink;
    ctx.lineWidth = Math.max(0.5, d.size * 0.014);
    ctx.beginPath();
    // Keel.
    ctx.moveTo(d.size * 0.98, 0);
    ctx.lineTo(-d.size * 0.9, 0);
    // The two folds running out toward the tips.
    for (const s of [-1, 1]) {
      ctx.moveTo(d.size * 0.94, 0);
      ctx.lineTo(-d.size * 0.74, s * d.size * squash * 0.34);
    }
    ctx.stroke();
  }

  ctx.restore();
  ctx.globalAlpha = 1;
}

/**
 * Contrail. Present only while the aircraft is still an aircraft — paper does
 * not leave one, and letting it linger is the detail that would make the whole
 * transformation read as a gimmick.
 */
export function drawContrail(
  ctx: CanvasRenderingContext2D,
  d: AircraftDraw,
  lengthPx: number,
): void {
  const strength = (1 - smooth(clamp01((d.morph - 0.05) / 0.35))) * d.alpha;
  if (strength <= 0.01 || lengthPx < 4) return;

  ctx.save();
  ctx.translate(d.x, d.y);
  ctx.rotate(d.heading);
  const squash = 0.4 + d.morph * 0.5;
  for (const s of [-1, 1]) {
    const y = s * d.size * squash * 0.3;
    const g = ctx.createLinearGradient(-d.size * 0.1, y, -lengthPx, y);
    g.addColorStop(0, `rgba(255,255,255,${(0.4 * strength).toFixed(3)})`);
    g.addColorStop(0.35, `rgba(255,255,255,${(0.16 * strength).toFixed(3)})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.strokeStyle = g;
    ctx.lineWidth = Math.max(0.7, d.size * 0.055);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-d.size * 0.1, y);
    ctx.lineTo(-lengthPx, y);
    ctx.stroke();
  }
  ctx.restore();
}

/* ------------------------------------------------------------------ *
 * Colour helper
 * ------------------------------------------------------------------ */

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace("#", "");
  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ];
}

/** Linear mix in sRGB. Close enough over this short a range, and cheap. */
export function mixHex(a: string, b: string, t: number): string {
  const g = clamp01(t);
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return `rgb(${Math.round(ca[0] + (cb[0] - ca[0]) * g)},${Math.round(
    ca[1] + (cb[1] - ca[1]) * g,
  )},${Math.round(ca[2] + (cb[2] - ca[2]) * g)})`;
}
