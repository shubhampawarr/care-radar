/**
 * Paper-cut material system for the E4 employer journey scenes.
 *
 * Everything here is deterministic: the same seed always produces the same
 * sheet, so a facet does not jump between server render, hydration and
 * re-render.
 */

/* ------------------------------------------------------------------ *
 * Palette — CareRadar logo colours + paper white + outline black only.
 * No gradients, no glass, no glow.
 * ------------------------------------------------------------------ */

export const PAPER = {
  /** Warm paper white, the base fill for every sheet. */
  white: "#F6F1E6",
  /** Outline black — slightly warm so it sits on the paper, not over it. */
  ink: "#141210",
  /** Warm-grey shadow, always used at 12% opacity, never blurred. */
  shadow: "#8A7F6E",
  navy: "#08264a",
  navyDeep: "#061f3d",
  teal: "#08a99d",
  tealLight: "#5eead4",
  /** Secondary paper tones for layered cut-outs. */
  cream: "#EFE7D6",
  sand: "#E3D7BF",
} as const;

export const SHADOW_OFFSET = { x: 4, y: 6 } as const;
export const SHADOW_OPACITY = 0.12;

/* ------------------------------------------------------------------ *
 * Deterministic randomness
 * ------------------------------------------------------------------ */

/** mulberry32 — small, fast, stable across engines. */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFromString(source: string): number {
  let hash = 2166136261;
  for (let i = 0; i < source.length; i += 1) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const between = (rng: () => number, min: number, max: number): number =>
  min + rng() * (max - min);

/* ------------------------------------------------------------------ *
 * Hand-drawn feel
 * ------------------------------------------------------------------ */

/**
 * Outline weight, varied per path so no two cut edges share a width.
 * Spec: ~3px at 1x, hand-varied, never uniform.
 */
export function handStroke(rng: () => number): number {
  return Number(between(rng, 2.4, 3.6).toFixed(2));
}

/**
 * Scissor-cut wobble: walks a closed polygon and pushes each vertex 1-2px off
 * true, then emits a path that alternates tiny line segments so the edge is
 * never mathematically straight.
 */
export function wobblePolygon(
  points: readonly (readonly [number, number])[],
  rng: () => number,
  amount = 1.6,
): string {
  const out: string[] = [];
  points.forEach(([x, y], i) => {
    const dx = between(rng, -amount, amount);
    const dy = between(rng, -amount, amount);
    out.push(`${i === 0 ? "M" : "L"}${(x + dx).toFixed(2)},${(y + dy).toFixed(2)}`);
  });
  out.push("Z");
  return out.join(" ");
}

/** Wobbled rectangle, subdividing each side so the wobble reads along it. */
export function wobbleRect(
  x: number,
  y: number,
  w: number,
  h: number,
  rng: () => number,
  amount = 1.6,
  perSide = 3,
): string {
  const pts: [number, number][] = [];
  const push = (ax: number, ay: number, bx: number, by: number) => {
    for (let i = 0; i < perSide; i += 1) {
      const t = i / perSide;
      pts.push([ax + (bx - ax) * t, ay + (by - ay) * t]);
    }
  };
  push(x, y, x + w, y);
  push(x + w, y, x + w, y + h);
  push(x + w, y + h, x, y + h);
  push(x, y + h, x, y);
  return wobblePolygon(pts, rng, amount);
}

/** A hand-drawn open line — used for creases, table edges, dashed arcs. */
export function wobbleLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rng: () => number,
  segments = 5,
  amount = 1.4,
): string {
  const out: string[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    const off = i === 0 || i === segments ? 0 : between(rng, -amount, amount);
    out.push(`${i === 0 ? "M" : "L"}${(x + off).toFixed(2)},${(y + off).toFixed(2)}`);
  }
  return out.join(" ");
}

/* ------------------------------------------------------------------ *
 * Colour
 * ------------------------------------------------------------------ */

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace("#", "");
  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ];
}

/**
 * Shift a colour's lightness by a percentage of the full range.
 * Facet fills use -12%..+8% when crumpled, 0% when flat — that spread is what
 * produces visible shadow discontinuity between adjacent facets.
 */
export function shiftLightness(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex);
  const amount = (percent / 100) * 255;
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const to2 = (n: number) => clamp(n).toString(16).padStart(2, "0");
  return `#${to2(r + amount)}${to2(g + amount)}${to2(b + amount)}`;
}

/* ------------------------------------------------------------------ *
 * The crumpled sheet
 * ------------------------------------------------------------------ */

export type Facet = {
  id: string;
  /** Flat outline of the facet, with cut-edge wobble. */
  d: string;
  centroid: readonly [number, number];
  /** Crumpled-state transform components. Flat state is identity. */
  rotate: number;
  scale: number;
  dx: number;
  dy: number;
  /** Lightness offset in percent at full crumple. */
  lightness: number;
};

export type Crease = {
  id: string;
  d: string;
  width: number;
};

export type Sheet = {
  width: number;
  height: number;
  facets: Facet[];
  creases: Crease[];
};

/**
 * Builds ~14 irregular polygons that tile the rectangle exactly.
 *
 * Facets come from a jittered lattice, so adjacent cells reference the *same*
 * jittered vertex — edges are shared by construction and there are no gaps.
 * Border vertices stay pinned to the rectangle, so the union is precisely the
 * sheet. Two cells are then split on a diagonal to break the quad rhythm and
 * push the count to 14.
 */
export function buildSheet(
  seed: number,
  width: number,
  height: number,
  cols = 4,
  rows = 3,
): Sheet {
  const rng = makeRng(seed);

  const cellW = width / cols;
  const cellH = height / rows;
  // Wider jitter so the tessellation never reads as a grid. Naturally cut,
  // not computer generated.
  const jitterX = cellW * 0.3;
  const jitterY = cellH * 0.3;

  // Lattice of (rows+1) x (cols+1) vertices, interior ones jittered.
  const grid: [number, number][][] = [];
  for (let r = 0; r <= rows; r += 1) {
    const row: [number, number][] = [];
    for (let c = 0; c <= cols; c += 1) {
      const edge = r === 0 || c === 0 || r === rows || c === cols;
      const x = c * cellW + (edge ? 0 : between(rng, -jitterX, jitterX));
      const y = r * cellH + (edge ? 0 : between(rng, -jitterY, jitterY));
      row.push([x, y]);
    }
    grid.push(row);
  }

  const cx = width / 2;
  const cy = height / 2;
  const facets: Facet[] = [];

  // Roughly one cell in six is split on a diagonal, to break the quad rhythm.
  // Seeded, so the same sheet always splits the same cells.
  const splitCells = new Set<string>();
  {
    const pick = makeRng(seed ^ 0x5bf03635);
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        // Split rate itself varies across the sheet, so runs of quads and
        // runs of triangles cluster the way a real cut would.
        const local = 0.16 + 0.26 * Math.abs(Math.sin(r * 1.7 + c * 0.9));
        if (pick() < local) splitCells.add(`${r}-${c}`);
      }
    }
  }

  const addFacet = (pts: [number, number][], index: number) => {
    const centroid: [number, number] = [
      pts.reduce((s, p) => s + p[0], 0) / pts.length,
      pts.reduce((s, p) => s + p[1], 0) / pts.length,
    ];
    // Pull toward the sheet centre when crumpled.
    const pull = between(rng, 0.06, 0.2);
    facets.push({
      id: `facet-${String(index + 1).padStart(2, "0")}`,
      d: wobblePolygon(pts, rng, 1.5),
      centroid,
      rotate: between(rng, -25, 25),
      scale: between(rng, 0.82, 0.94),
      dx: (cx - centroid[0]) * pull,
      dy: (cy - centroid[1]) * pull,
      lightness: between(rng, -12, 8),
    });
  };

  let index = 0;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const tl = grid[r][c];
      const tr = grid[r][c + 1];
      const br = grid[r + 1][c + 1];
      const bl = grid[r + 1][c];

      if (splitCells.has(`${r}-${c}`)) {
        addFacet([tl, tr, br], index++);
        addFacet([tl, br, bl], index++);
      } else {
        addFacet([tl, tr, br, bl], index++);
      }
    }
  }

  /* Creases follow the facet boundaries exactly — interior lattice lines,
     plus the diagonals of the split cells. Straight, never curved. */
  const creases: Crease[] = [];
  let creaseIndex = 0;
  const addCrease = (pts: [number, number][]) => {
    const d = pts
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
      .join(" ");
    creases.push({
      id: `crease-${String(++creaseIndex).padStart(2, "0")}`,
      d,
      width: Number(between(rng, 1.1, 2.1).toFixed(2)),
    });
  };

  for (let c = 1; c < cols; c += 1) {
    addCrease(Array.from({ length: rows + 1 }, (_, r) => grid[r][c]));
  }
  for (let r = 1; r < rows; r += 1) {
    addCrease(Array.from({ length: cols + 1 }, (_, c) => grid[r][c]));
  }
  for (const key of splitCells) {
    const [r, c] = key.split("-").map(Number);
    addCrease([grid[r][c], grid[r + 1][c + 1]]);
  }

  return { width, height, facets, creases };
}

/** power2.out — the entry ease for the uncrumple. */
export function power2Out(t: number): number {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return 1 - (1 - c) * (1 - c);
}

export const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);

/* ------------------------------------------------------------------ *
 * CRYSTAL MODE
 *
 * The ground: cold, precise, machined. Same seeded 14-facet lattice as paper
 * mode — a facet occupies the identical polygon in both, which is what lets
 * the turn read as one surface changing state rather than two surfaces
 * swapping. Flat stepped tints only: no gradient within a facet, no blur,
 * no glow, no specular, no fake refraction, and no black outline.
 * ------------------------------------------------------------------ */

/** Logo colours only. Facets step between these, never blend. */
const CRYSTAL_BASES = [
  PAPER.navyDeep,
  PAPER.navy,
  PAPER.teal,
  PAPER.tealLight,
] as const;

/** Discrete lightness steps — stepped, not continuous. */
const CRYSTAL_STEPS = [-10, -5, 0, 6, 12] as const;

export type CrystalFacet = {
  fill: string;
  /** 0.55-0.8, varied per facet. */
  opacity: number;
  /** 1px, lighter than the fill — catching the light, not outlining. */
  edge: string;
};

/**
 * Deterministic crystal treatment per facet index. Derived from the same seed
 * family as the sheet so it is stable across renders and across modes.
 */
/**
 * Facet edge: reads as the cut catching the light rather than as an outline.
 *
 * "Lighter than the fill" alone fails for the pale tints — against the warm
 * page ground a near-white 1px line is invisible, and at edge-on the whole
 * field would disappear instead of resolving into lines. So pale fills get a
 * darker edge and dark fills a lighter one: the edge always separates from
 * BOTH its own facet and the ground behind it.
 */
function catchLightEdge(fill: string): string {
  const [r, g, b] = hexToRgb(fill);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return shiftLightness(fill, luminance > 0.6 ? -26 : 22);
}

export function buildCrystalFacets(seed: number, count: number): CrystalFacet[] {
  const rng = makeRng(seed ^ 0x9e3779b9);
  return Array.from({ length: count }, () => {
    const base = CRYSTAL_BASES[Math.floor(rng() * CRYSTAL_BASES.length)];
    const step = CRYSTAL_STEPS[Math.floor(rng() * CRYSTAL_STEPS.length)];
    const fill = shiftLightness(base, step);
    return {
      fill,
      opacity: Number((0.55 + rng() * 0.25).toFixed(3)),
      edge: catchLightEdge(fill),
    };
  });
}

/**
 * The turn: each facet rotates about its own vertical axis through its
 * centroid, rendered as scaleX = |cos(angle)| so it stays flat SVG.
 *
 *   p 0    flush, coplanar, one plane
 *   p 0.5  edge-on, each facet a thin line
 *   p 1    flush again
 *
 * abs() rather than raw cos so p=1 returns to an unmirrored flush and the
 * facets tile exactly again.
 */
export function facetTurnScaleX(facetProgress: number): number {
  const s = Math.abs(Math.cos(clamp01(facetProgress) * Math.PI));
  // Never fully zero: the 1px edge must survive edge-on so the surface reads
  // as a field of lines rather than as nothing.
  return Math.max(s, 0.0012);
}

/**
 * Wave axis. Varied per boundary so six turns share a language without being
 * six copies — an identical left-to-right sweep every time is what makes a
 * repeated transition read as mechanical.
 */
export type TurnAxis = "lr" | "rl" | "tl-br" | "br-tl" | "center";

/** Where a facet sits in the wave, 0 = turns first, 1 = turns last. */
export function facetAxisPhase(
  axis: TurnAxis,
  cx: number,
  cy: number,
  width: number,
  height: number,
): number {
  const u = clamp01(cx / Math.max(width, 1));
  const v = clamp01(cy / Math.max(height, 1));
  switch (axis) {
    case "lr":
      return u;
    case "rl":
      return 1 - u;
    case "tl-br":
      return (u + v) / 2;
    case "br-tl":
      return 1 - (u + v) / 2;
    case "center": {
      // Non-directional: the centre goes first and the turn opens outward.
      const dx = u - 0.5;
      const dy = v - 0.5;
      return clamp01(Math.hypot(dx, dy) / Math.SQRT1_2);
    }
  }
}

/**
 * Spread is the fraction of p the stagger occupies; it maps 1:1 from the
 * design values in ms (180ms -> 0.18).
 */
export function facetTurnProgress(
  p: number,
  phase: number,
  spread = 0.18,
): number {
  const s = Math.min(Math.max(spread, 0), 0.6);
  return clamp01((p - phase * s) / (1 - s));
}

export const spreadFromMs = (ms: number): number => ms / 1000;

/* ------------------------------------------------------------------ *
 * Hand-cut contours
 *
 * A single cut edge is never one weight. These return the *jittered* points
 * so the fill and the overlaid stroke segments trace exactly the same edge —
 * re-running wobblePolygon would re-randomise and the outline would drift off
 * the shape.
 * ------------------------------------------------------------------ */

export type Pt = readonly [number, number];

export function wobblePoints(
  points: readonly Pt[],
  rng: () => number,
  amount = 1.6,
): Pt[] {
  return points.map(([x, y]) => [
    x + (rng() * 2 - 1) * amount,
    y + (rng() * 2 - 1) * amount,
  ]);
}

export function pointsToPath(pts: readonly Pt[], close = true): string {
  const d = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  return close ? `${d} Z` : d;
}

/**
 * Splits a closed contour into `count` overlapping open runs, so each can be
 * stroked at a different weight. Runs overlap by one point so there is no gap
 * at the joins.
 */
export function contourRuns(pts: readonly Pt[], count = 3): Pt[][] {
  const n = pts.length;
  if (n < 3 || count < 2) return [[...pts, pts[0]]];
  const loop = [...pts, pts[0]];
  const per = Math.ceil(loop.length / count);
  const runs: Pt[][] = [];
  for (let i = 0; i < loop.length - 1; i += per) {
    runs.push(loop.slice(i, Math.min(i + per + 1, loop.length)));
  }
  return runs.filter((r) => r.length > 1);
}


/**
 * Facet counts for a fullscreen lattice.
 *
 * 14 facets is a panel-scale count and reads as sparse edge to edge. Targets
 * facets of roughly 180-260px on their long edge, so a 1440x900 viewport lands
 * around 7x4 cells (~30 facets after diagonal splits). Facets stay large and
 * irregular — this scales the count, it does not subdivide into detail.
 */
export function latticeForViewport(
  width: number,
  height: number,
  target = 118,
): { cols: number; rows: number } {
  return {
    cols: Math.max(3, Math.round(width / target)),
    rows: Math.max(2, Math.round(height / target)),
  };
}

/**
 * Fullscreen phase timeline. Maps scroll progress p to turn progress, where
 * turn 0 = flush, 0.5 = edge-on, 1 = flush again.
 *
 *   0.00-0.15  flush, phase text settled
 *   0.15-0.45  turning toward edge-on
 *   0.45-0.55  HOLD edge-on — the midpoint the sequence exists for
 *   0.55-0.85  continuing to flush, same facets, no swapped geometry
 *   0.85-1.00  next phase text arrives
 */
export function phaseTurnProgress(p: number): number {
  const c = clamp01(p);
  if (c <= 0.15) return 0;
  if (c < 0.45) return ((c - 0.15) / 0.3) * 0.5;
  if (c <= 0.55) return 0.5;
  if (c < 0.85) return 0.5 + ((c - 0.55) / 0.3) * 0.5;
  return 1;
}

/* ------------------------------------------------------------------ *
 * CRYSTAL MATERIAL
 *
 * One object, one light. Every facet is a different response to the SAME
 * lighting environment rather than a different colour: a single sapphire base
 * modulated by how much a facet faces the light, plus a small cool/warm shift.
 *
 * Light is upper-left, fixed. Every gradient runs along that axis, so
 * highlights and falloff agree across the whole surface — that consistency is
 * what sells it as one solid material instead of tinted polygons.
 *
 * Deliberately cheap: static gradients declared once in <defs>, no filters, no
 * blur, no per-frame repaints of the fills.
 * ------------------------------------------------------------------ */

/**
 * The palette ramp.
 *
 * Every colour in the material is a point on the line walking navyDeep ->
 * navy -> teal -> tealLight. Nothing is mixed in from outside the logo set, so
 * no new blue, purple or cyan can enter: a facet is only ever "further along
 * the CareRadar ramp", which is what makes the whole field read as one lit
 * object rather than many tinted polygons.
 */
const ICE = "#EAF7F6";
const RAMP = [PAPER.navy, PAPER.teal, PAPER.tealLight, ICE] as const;

function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const to2 = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${to2(ar + (br - ar) * t)}${to2(ag + (bg - ag) * t)}${to2(ab + (bb - ab) * t)}`;
}

function paletteRamp(t: number): string {
  const c = clamp01(t) * (RAMP.length - 1);
  const i = Math.min(Math.floor(c), RAMP.length - 2);
  return mixHex(RAMP[i], RAMP[i + 1], c - i);
}

export type CrystalMaterial = {
  /** Gradient stops, upper-left to lower-right. */
  hi: string;
  mid: string;
  lo: string;
  /** Gradient axis, jittered a little per facet so it is not procedural. */
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  fillOpacity: number;
  /** Polished edge — brighter than the faces it separates. */
  edge: string;
  edgeOpacity: number;
  /** Specular catch on the light-facing side only. */
  specular: string;
  specularOpacity: number;
  specularWidth: number;
  highlightPhase: number;
};

/**
 * Light direction, upper-left, in SVG coordinates (y grows downward).
 * Normalised so the dot product below stays in -1..1.
 */
const LIGHT = { x: -0.707, y: -0.707 } as const;

export function buildCrystalMaterial(
  seed: number,
  facets: readonly Facet[],
  width: number,
  height: number,
): CrystalMaterial[] {
  const rng = makeRng(seed ^ 0x7f4a7c15);

  return facets.map((f) => {
    const [cx, cy] = f.centroid;
    const u = cx / Math.max(width, 1);
    const v = cy / Math.max(height, 1);

    const px = u * 2 - 1;
    const py = v * 2 - 1;

    /* Pseudo-normal. The seeded tilt is deliberately strong relative to the
       positional term: in real crystal a facet's angle, not its location,
       decides what it catches, so a face can fall into shadow with a lit one
       beside it. That is what stops the lighting reading as a smooth ramp
       painted across the field. */
    const tiltX = (rng() * 2 - 1) * 0.95;
    const tiltY = (rng() * 2 - 1) * 0.95;
    const nx = px * 0.3 + tiltX;
    const ny = py * 0.3 + tiltY;
    const len = Math.hypot(nx, ny) || 1;
    const facing = clamp01(0.5 + 0.5 * ((nx / len) * LIGHT.x + (ny / len) * LIGHT.y));

    // Microscopic irregularity — Leica, not scratched.
    const grit = (rng() * 2 - 1) * 0.03;

    /* Sits high on the ramp: pale aqua through cool white, with the navy end
       reserved for the few faces genuinely turned away from the light. */
    const t = clamp01(0.42 + facing * 0.5 + grit);

    return {
      hi: paletteRamp(t + 0.14),
      mid: paletteRamp(t),
      lo: paletteRamp(t - 0.13),
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1,
      /* Thick laminated glass: translucent enough that the light layers
         beneath read through as internal scattering. */
      fillOpacity: Number((0.62 + facing * 0.2 + rng() * 0.05).toFixed(3)),
      edge: paletteRamp(Math.min(1, t + 0.22)),
      edgeOpacity: Number((0.3 + facing * 0.34).toFixed(3)),
      specular: "#FBFFFE",
      specularOpacity: Number((facing * facing * 0.16).toFixed(3)),
      specularWidth: Number((0.7 + facing * 0.85).toFixed(2)),
      /* Where this facet sits in the travelling highlight's path. Diagonal,
         so the front sweeps with the light rather than across it. */
      highlightPhase: Number((((u * 0.62 + v * 0.38) + rng() * 0.05) % 1).toFixed(4)),
    };
  });
}

/**
 * Travelling highlight.
 *
 * A narrow front sweeps across the crystal; only facets it is currently
 * passing catch a hard specular. The band is ~7% wide and wraps, so roughly
 * 5-10% of edges are lit at any instant — they appear, travel, fade, and
 * reappear elsewhere. No sparkle layer and nothing random: the same facet
 * always lights at the same point in the sweep.
 */
export function travellingHighlight(
  base: number,
  scaleX: number,
  phase: number,
  front: number,
): number {
  let d = Math.abs(phase - front);
  if (d > 0.5) d = 1 - d;
  const band = Math.max(0, 1 - d / 0.07);
  // Sharp, not soft: a thin knife rather than a bloom.
  const knife = band * band * band;

  /* Grazing angles catch harder — as a facet turns edge-on its normal swings
     across the light. Kept modest so it never lights the whole field. */
  const graze = Math.pow(1 - clamp01(scaleX), 3) * 0.35;

  return clamp01(base + knife * 0.95 + graze);
}

/**
 * Facet opacity through the turn.
 *
 * At the midpoint the faces surrender their fill rather than shrinking into
 * hard bars — the crystal dissolves into light and reforms.
 */
export function dissolveOpacity(base: number, scaleX: number): number {
  const s = clamp01(scaleX);
  return Number((base * (0.12 + 0.88 * Math.pow(s, 0.55))).toFixed(3));
}
