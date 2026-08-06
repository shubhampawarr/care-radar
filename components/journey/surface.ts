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
): Sheet {
  const rng = makeRng(seed);
  const cols = 4;
  const rows = 3;

  const cellW = width / cols;
  const cellH = height / rows;
  const jitterX = cellW * 0.16;
  const jitterY = cellH * 0.16;

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

  // Which cells get split into two triangles.
  const splitCells = new Set(["1-1", "2-3"]);

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
