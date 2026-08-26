/**
 * The E1–E3 environment: one structural system in three states.
 *
 * THE NARRATIVE IS THE GEOMETRY
 * Every node holds three positions, and the page's scroll position blends
 * between them. Nothing here is decoration that happens to move:
 *
 *   CONNECTED    a broad structural field, evenly spaced, open        (E1)
 *   CONSTRAINED  the same field squeezed into one narrow column       (E2)
 *   BRANCHED     that column released into two                        (E3)
 *
 * The node set never changes and no node is ever created or destroyed. It is
 * one system being compressed and then opened, which is the difference between
 * a system with a bottleneck and three separate animations.
 *
 * WHY IT COMPRESSES HORIZONTALLY
 * The squeeze is on the x axis, into a vertical throat, and the release is into
 * two vertical columns. That keeps the axis consistent with E3's two-column
 * route layout and with the convergence drawn beneath it, so the environment
 * and the page agree about where the two paths are. Compressing vertically
 * would read as strata and would point the wrong way.
 *
 * WHAT CARRIES THE BOTTLENECK
 * Crowding alone is ambiguous — dense could read as rich. Two vertical rules
 * close in on the throat as compression peaks and fade as it releases. That is
 * the single legible device; everything else is the field responding to it.
 *
 * Edges are fixed pairs chosen once from the CONNECTED layout, so as the field
 * opens into two columns the pairs that span the gap stretch and fade out on
 * their own. The two routes separate because the geometry separates them, not
 * because a second edge set was swapped in.
 */

import { clamp01, makeRng, seedFromString } from "../journey/surface";

export type Vec = readonly [number, number];

export type EnvNode = {
  /** Normalised viewport coordinates, 0..1, for each of the three states. */
  connected: Vec;
  constrained: Vec;
  branched: Vec;
  /** Rendered as a visible dot. A minority, as everywhere else on this page. */
  shown: boolean;
  driftPhase: number;
  driftSpeed: number;
};

export type EnvNetwork = {
  nodes: EnvNode[];
  edges: readonly (readonly [number, number])[];
  facets: readonly (readonly [number, number, number])[];
  /** Nominal neighbour distance in aspect space, for the edge-length fade. */
  span: number;
};

/* ------------------------------------------------------------------ *
 * Composition
 *
 * Geometry is built in an aspect-corrected space (x runs 0..ASPECT, y runs
 * 0..1) so that "nearest neighbour" means what it looks like on a wide screen.
 * Normalised coordinates come out at the end.
 * ------------------------------------------------------------------ */

const ASPECT = 1.6;

/** The CONNECTED field starts here, clear of the E1 headline column. */
const FIELD_LEFT = 0.44;
/** Centre of the CONSTRAINED throat. Sits where E1 and E2 already carried
 *  their line work, so the compression happens where the eye already is. */
const THROAT_U = 0.72;
/** How much of the field's width survives the squeeze. */
/* 0.12 first time round, which turned every cell into a sliver and made the
   constrained state read as spiky noise rather than as compression. */
const THROAT_SQUEEZE = 0.22;
/** Centres of the two BRANCHED columns, aligned with E3's two route columns.
 *
 *  On a narrow screen the routes stack into one column, so there is no layout
 *  left to align with — and columns at 0.25 / 0.75 land squarely on the body
 *  copy. There they move out to the margins and frame the text instead of
 *  crossing it. Still two, which is all the narrative needs. */
const COLUMN_U: readonly [number, number] = [0.25, 0.75];
const COLUMN_U_NARROW: readonly [number, number] = [0.06, 0.94];
const COLUMN_SPREAD = 0.5;

export function nodeBudget(width: number): number {
  if (width < 640) return 20;
  if (width < 1024) return 32;
  if (width < 1440) return 46;
  return 56;
}

export function buildNetwork(
  seed: string,
  count: number,
  narrow = false,
): EnvNetwork {
  const columns = narrow ? COLUMN_U_NARROW : COLUMN_U;
  const rng = makeRng(seedFromString(seed));

  const x0 = FIELD_LEFT * ASPECT;
  const x1 = ASPECT;
  const fieldW = x1 - x0;
  const spacing = Math.sqrt((fieldW * 1.12) / Math.max(count, 6));

  /* Jittered triangular grid — near-equilateral cells, which is what reads as
     crystalline rather than as graph paper. Bled past every edge so the field
     never shows a border. */
  const pts: [number, number][] = [];
  const rowHeight = spacing * 0.866;
  let row = 0;
  for (let y = -0.06; y < 1.08; y += rowHeight, row += 1) {
    const offset = row % 2 === 0 ? 0 : spacing / 2;
    for (let x = x0 - spacing * 0.5; x < x1 + spacing; x += spacing) {
      pts.push([
        x + offset + (rng() * 2 - 1) * spacing * 0.28,
        y + (rng() * 2 - 1) * spacing * 0.28,
      ]);
    }
  }

  /* Nearest-neighbour links, capped by distance. A long line reads as a stray
     mark rather than as structure. */
  const maxLen = spacing * 1.62;
  const seen = new Set<number>();
  const edges: [number, number][] = [];
  const degree = new Array<number>(pts.length).fill(0);

  for (let i = 0; i < pts.length; i += 1) {
    const near = pts
      .map((p, j) => ({ j, d: Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]) }))
      .filter((c) => c.j !== i && c.d <= maxLen)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const { j } of near) {
      const key = Math.min(i, j) * pts.length + Math.max(i, j);
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
      degree[i] += 1;
      degree[j] += 1;
    }
  }

  /* Facets only where all three edges of a triangle survived, so every fill is
     bounded by drawn lines and none can float free of the network. Slivers are
     dropped: at these opacities a thin triangle reads as a scratch. */
  const linked = (a: number, b: number): boolean =>
    seen.has(Math.min(a, b) * pts.length + Math.max(a, b));

  const facets: [number, number, number][] = [];
  const facetKeys = new Set<string>();
  for (const [a, b] of edges) {
    for (let c = 0; c < pts.length; c += 1) {
      if (c === a || c === b) continue;
      if (!linked(a, c) || !linked(b, c)) continue;
      const key = [a, b, c].sort((p, q) => p - q).join(",");
      if (facetKeys.has(key)) continue;

      const [pa, pb, pc] = [pts[a], pts[b], pts[c]];
      const longest = Math.max(
        Math.hypot(pb[0] - pa[0], pb[1] - pa[1]),
        Math.hypot(pc[0] - pb[0], pc[1] - pb[1]),
        Math.hypot(pa[0] - pc[0], pa[1] - pc[1]),
        1e-6,
      );
      const area =
        Math.abs(
          (pb[0] - pa[0]) * (pc[1] - pa[1]) - (pb[1] - pa[1]) * (pc[0] - pa[0]),
        ) / 2;
      if (area / (longest * longest) < 0.17) continue;

      facetKeys.add(key);
      facets.push([a, b, c]);
    }
  }

  const fieldMid = (x0 + x1) / 2;
  const leftMid = (x0 + fieldMid) / 2;
  const rightMid = (fieldMid + x1) / 2;

  const nodes: EnvNode[] = pts.map((p, i) => {
    const [ax, ay] = p;

    /* Squeezed toward one narrow column. Height is untouched — the field is
       being compressed, not shrunk, and keeping v intact is what makes it read
       as pressure from the sides rather than as the whole thing receding. */
    const bx = THROAT_U * ASPECT + (ax - fieldMid) * THROAT_SQUEEZE;

    /* Released into two columns. Which column a node lands in is decided by
       which half of the CONNECTED field it started in, so the system folds
       open like a book rather than reshuffling into two new groups. */
    const side = ax < fieldMid ? 0 : 1;
    const sideMid = side === 0 ? leftMid : rightMid;
    const cx = columns[side] * ASPECT + (ax - sideMid) * COLUMN_SPREAD;

    return {
      connected: [ax / ASPECT, ay],
      constrained: [bx / ASPECT, ay],
      branched: [cx / ASPECT, ay],
      shown: degree[i] >= 3 && rng() < 0.22,
      driftPhase: rng() * Math.PI * 2,
      driftSpeed: 0.05 + rng() * 0.07,
    };
  });

  return { nodes, edges, facets, span: spacing / ASPECT };
}

/* ------------------------------------------------------------------ *
 * Phase
 *
 * `phase` runs 0 at E1, 1 at E2, 2 at E3 and is interpolated from where the
 * sections actually sit on the page, not from a hand-tuned scroll fraction.
 * Content length can change without the choreography drifting out of step.
 * ------------------------------------------------------------------ */

const smooth = (t: number): number => t * t * (3 - 2 * t);

/** Blended position for a node at `phase`, in normalised viewport coordinates. */
export function nodeAt(node: EnvNode, phase: number): Vec {
  if (phase <= 1) {
    const t = smooth(clamp01(phase));
    return [
      node.connected[0] + (node.constrained[0] - node.connected[0]) * t,
      node.connected[1] + (node.constrained[1] - node.connected[1]) * t,
    ];
  }
  const t = smooth(clamp01(phase - 1));
  return [
    node.constrained[0] + (node.branched[0] - node.constrained[0]) * t,
    node.constrained[1] + (node.branched[1] - node.constrained[1]) * t,
  ];
}

/** 0..1, peaking at the constrained state. Drives the rules and the fills. */
export function compression(phase: number): number {
  return clamp01(1 - Math.abs(phase - 1));
}

/** Where the two constraint rules sit, as a normalised half-gap from the
 *  throat centre. Wide and invisible at rest, closed at peak compression. */
export function ruleGap(phase: number): number {
  const c = compression(phase);
  return 0.3 - smooth(c) * 0.24;
}

export const THROAT_CENTRE = THROAT_U;
