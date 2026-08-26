/**
 * The exploration lattice: a crystalline NETWORK on a plane, not a crystal body.
 *
 * WHY THIS EXISTS SEPARATELY FROM crystal-body.ts
 * crystal-body.ts builds a solid: cells raised into pyramids, fan-triangulated,
 * depth-sorted and lit. That is a sculpture, and the client reads it as one —
 * facets pass in front of other facets, so the eye resolves it as an object
 * sitting behind the page rather than as a system printed on it.
 *
 * The fix is structural, not cosmetic. Every facet here is a cell of ONE
 * triangulation of ONE point set, so facets tile the plane exactly and can
 * never overlap. There is no depth sort because there is nothing to sort: the
 * lattice occupies a single controlled plane. Depth exists only as a few pixels
 * of parallax and one dimmer echo layer, which reads as the second pane of a
 * double-glazed window rather than as a second crystal.
 *
 * WHAT THE LATTICE MEANS
 * Nodes are milestones and junctions. Edges are dependencies. The kept edge set
 * is a spanning tree plus a minority of extras, so the network is provably
 * connected — "every step connects to the next" is a property of the geometry
 * rather than a caption on it.
 *
 * THE THREE MODES ARE PARAMETERS, NOT THREE ENGINES
 * Same points -> triangulation -> spanning tree -> sparse facets pipeline in all
 * three. Only the point distribution and the selection ratios change. That is
 * what keeps the three interpretations recognisable as one visual language.
 */

import { clamp01, makeRng } from "../surface";

export type LatticeMode = "structural" | "organic" | "journey";

export type Pt = { x: number; y: number };

export type LatticeNode = {
  x: number;
  y: number;
  /** -1..1. Drives a few pixels of parallax and nothing else. */
  z: number;
  /** Ambient drift amplitude in px. Deliberately near zero. */
  drift: number;
  phase: number;
  speed: number;
  /** Journey mode: which milestone island, else -1. */
  island: number;
  degree: number;
  /** Rendered as a visible dot. A minority — nodes are meant to be scarce. */
  shown: boolean;
  /** Milestone index if this node IS a milestone, else -1. */
  anchor: number;
  /** Journey mode: which spine segment this node sits on, else -1. */
  spine: number;
  /** Position along that segment, 0..1. */
  spineT: number;
};

export type LatticeEdge = {
  a: number;
  b: number;
  len: number;
  /** 0..1 resting brightness. Short edges read as structure, long as reach. */
  weight: number;
  island: number;
  /** Journey mode: spine segment index, else -1. */
  spine: number;
  spineT: number;
};

export type LatticeFacet = {
  a: number;
  b: number;
  c: number;
  island: number;
  /** Resting fill alpha. Very low by design — see FACET_ALPHA. */
  alpha: number;
  spine: number;
};

export type Lattice = {
  width: number;
  height: number;
  mode: LatticeMode;
  nodes: LatticeNode[];
  edges: LatticeEdge[];
  facets: LatticeFacet[];
  /** Node index of each milestone, in order. Empty outside journey mode. */
  anchors: number[];
  /** Nominal point spacing — the renderer sizes rings and glints from it. */
  spacing: number;
};

/* ------------------------------------------------------------------ *
 * Milestone anchor constellation
 *
 * Normalised positions, hand-placed rather than generated. A generated path
 * either zigzags or arcs mechanically; this one rises overall while dipping
 * twice, which reads as progress that has real stages in it. Left to right is
 * the journey, and the upward drift is the lift toward departure.
 * ------------------------------------------------------------------ */

export const ANCHOR_UV: readonly (readonly [number, number])[] = [
  [0.13, 0.6],
  [0.26, 0.36],
  [0.39, 0.58],
  [0.52, 0.3],
  [0.65, 0.52],
  [0.79, 0.26],
  [0.91, 0.46],
] as const;

/* ------------------------------------------------------------------ *
 * 1. POINTS
 * ------------------------------------------------------------------ */

/**
 * Composition density. The lattice thins toward the lower left because that is
 * where the copy sits, and it gathers upper right where the light is. This is
 * the single most effective restraint in the file: it produces large negative
 * space without thinning the lattice anywhere the eye is actually looking.
 */
function densityAt(u: number, v: number): number {
  return clamp01(0.22 + 0.92 * (0.42 * u + 0.58 * (1 - v)));
}

/** Jittered triangular grid — near-equilateral cells, architectural. */
function hexPoints(
  w: number,
  h: number,
  spacing: number,
  jitter: number,
  rng: () => number,
): Pt[] {
  const out: Pt[] = [];
  const rowH = spacing * 0.866;
  let row = 0;
  for (let y = -rowH; y < h + rowH; y += rowH, row += 1) {
    const offset = row % 2 === 0 ? 0 : spacing / 2;
    for (let x = -spacing; x < w + spacing; x += spacing) {
      const px = x + offset + (rng() * 2 - 1) * spacing * jitter;
      const py = y + (rng() * 2 - 1) * spacing * jitter;
      if (rng() > densityAt(clamp01(px / w), clamp01(py / h))) continue;
      out.push({ x: px, y: py });
    }
  }
  return out;
}

/**
 * Bridson Poisson-disc. Even spacing with no grid in it, which is what makes
 * the organic mode irregular without becoming random scatter — random points
 * clump, and clumps read as noise rather than as formation.
 */
function poissonPoints(
  w: number,
  h: number,
  radius: number,
  rng: () => number,
  tries = 16,
): Pt[] {
  const cell = radius / Math.SQRT2;
  const gw = Math.ceil(w / cell) + 1;
  const gh = Math.ceil(h / cell) + 1;
  const grid = new Int32Array(gw * gh).fill(-1);
  const pts: Pt[] = [];
  const active: number[] = [];

  const fits = (p: Pt): boolean => {
    const gx = Math.floor(p.x / cell);
    const gy = Math.floor(p.y / cell);
    for (let y = Math.max(0, gy - 2); y <= Math.min(gh - 1, gy + 2); y += 1) {
      for (let x = Math.max(0, gx - 2); x <= Math.min(gw - 1, gx + 2); x += 1) {
        const i = grid[y * gw + x];
        if (i < 0) continue;
        if (Math.hypot(pts[i].x - p.x, pts[i].y - p.y) < radius) return false;
      }
    }
    return true;
  };

  const add = (p: Pt) => {
    const i = pts.length;
    pts.push(p);
    active.push(i);
    grid[Math.floor(p.y / cell) * gw + Math.floor(p.x / cell)] = i;
  };

  add({ x: w * 0.62, y: h * 0.34 });

  while (active.length > 0) {
    const ai = Math.floor(rng() * active.length);
    const seed = pts[active[ai]];
    let placed = false;
    for (let t = 0; t < tries; t += 1) {
      const ang = rng() * Math.PI * 2;
      const r = radius * (1 + rng());
      const p = { x: seed.x + Math.cos(ang) * r, y: seed.y + Math.sin(ang) * r };
      if (p.x < 0 || p.y < 0 || p.x >= w || p.y >= h) continue;
      if (!fits(p)) continue;
      add(p);
      placed = true;
      break;
    }
    if (!placed) active.splice(ai, 1);
  }

  /* Thinned by composition density AFTER sampling. Rejecting inside the
     sampler would leave the active list unable to bridge the sparse region and
     the whole lower left would come out empty rather than sparse. */
  return pts.filter((p) => rng() < densityAt(p.x / w, p.y / h) * 1.05);
}

/**
 * Journey points: seven islands around the anchors, plus a thin scatter along
 * the runs between them.
 *
 * The islands have to be genuinely separated at rest — that separation is the
 * entire first half of the "fragment then connection" idea. The connective
 * scatter is what the spine paths are later routed through, so the connection
 * when it arrives is a real route through the lattice rather than a drawn line
 * laid over it.
 */
function islandPoints(
  w: number,
  h: number,
  spacing: number,
  budget: number,
  rng: () => number,
): { pts: Pt[]; island: number[]; anchorIdx: number[] } {
  /* Island size follows the node budget. The seven islands are a fixed count,
     so without this the phone gets the same 178 points as a 1920 display,
     packed into a fifth of the area. */
  const density = budget >= 150 ? 1 : budget >= 100 ? 0.72 : 0.48;
  const pts: Pt[] = [];
  const island: number[] = [];
  const anchorIdx: number[] = [];
  const unit = Math.min(w, h);
  const rIsland = unit * 0.165;

  ANCHOR_UV.forEach(([u, v], m) => {
    const cx = u * w;
    const cy = v * h;
    anchorIdx.push(pts.length);
    pts.push({ x: cx, y: cy });
    island.push(m);

    /* Rings rather than a disc: a disc fills in and reads as a blob, rings
       keep the interior open so the anchor stays the brightest thing in it. */
    const rings = [0.42, 0.72, 1];
    rings.forEach((rf, ri) => {
      const count = Math.max(3, Math.round((4 + ri * 3) * density));
      const base = rng() * Math.PI * 2;
      for (let i = 0; i < count; i += 1) {
        const ang = base + (i / count) * Math.PI * 2 + (rng() * 2 - 1) * 0.34;
        const r = rIsland * rf * (0.82 + rng() * 0.36);
        const p = {
          x: cx + Math.cos(ang) * r,
          y: cy + Math.sin(ang) * r * 0.86,
        };
        if (p.x < -spacing || p.y < -spacing) continue;
        if (p.x > w + spacing || p.y > h + spacing) continue;
        pts.push(p);
        island.push(m);
      }
    });
  });

  for (let m = 0; m < ANCHOR_UV.length - 1; m += 1) {
    const [u0, v0] = ANCHOR_UV[m];
    const [u1, v1] = ANCHOR_UV[m + 1];
    const steps = budget >= 150 ? 5 : 4;
    for (let i = 1; i < steps; i += 1) {
      const t = i / steps;
      const jitter = unit * 0.075;
      pts.push({
        x: (u0 + (u1 - u0) * t) * w + (rng() * 2 - 1) * jitter,
        y: (v0 + (v1 - v0) * t) * h + (rng() * 2 - 1) * jitter * 1.15,
      });
      island.push(-1);
    }
  }

  return { pts, island, anchorIdx };
}

/* ------------------------------------------------------------------ *
 * 2. TRIANGULATION (Bowyer-Watson)
 *
 * A Delaunay triangulation is what guarantees the facets tile: every triangle
 * is a cell of one partition of the hull, so no two fills can ever stack. This
 * is the structural answer to the client's "crystals on top of crystals".
 * ------------------------------------------------------------------ */

type Tri = {
  a: number;
  b: number;
  c: number;
  cx: number;
  cy: number;
  r2: number;
};

function circumTri(
  p: readonly Pt[],
  a: number,
  b: number,
  c: number,
): Tri | null {
  const { x: ax, y: ay } = p[a];
  const { x: bx, y: by } = p[b];
  const { x: cx, y: cy } = p[c];
  const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
  if (Math.abs(d) < 1e-9) return null;
  const a2 = ax * ax + ay * ay;
  const b2 = bx * bx + by * by;
  const c2 = cx * cx + cy * cy;
  const ux = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d;
  const uy = (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d;
  const dx = ax - ux;
  const dy = ay - uy;
  return { a, b, c, cx: ux, cy: uy, r2: dx * dx + dy * dy };
}

function triangulate(points: readonly Pt[], maxCircumradius: number): Tri[] {
  const n = points.length;
  if (n < 3) return [];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  const dmax = Math.max(maxX - minX, maxY - minY) || 1;
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  const pts: Pt[] = [
    ...points,
    { x: midX - 20 * dmax, y: midY - dmax },
    { x: midX, y: midY + 20 * dmax },
    { x: midX + 20 * dmax, y: midY - dmax },
  ];

  const first = circumTri(pts, n, n + 1, n + 2);
  if (!first) return [];
  let tris: Tri[] = [first];

  const counts = new Map<number, number>();
  const pairs = new Map<number, [number, number]>();
  const stride = n + 3;

  for (let i = 0; i < n; i += 1) {
    const p = pts[i];
    const keep: Tri[] = [];
    counts.clear();
    pairs.clear();

    for (const t of tris) {
      const dx = p.x - t.cx;
      const dy = p.y - t.cy;
      if (dx * dx + dy * dy > t.r2) {
        keep.push(t);
        continue;
      }
      const ring: readonly [number, number][] = [
        [t.a, t.b],
        [t.b, t.c],
        [t.c, t.a],
      ];
      for (const [u, v] of ring) {
        const lo = u < v ? u : v;
        const hi = u < v ? v : u;
        const key = lo * stride + hi;
        counts.set(key, (counts.get(key) ?? 0) + 1);
        pairs.set(key, [lo, hi]);
      }
    }

    tris = keep;
    for (const [key, count] of counts) {
      if (count !== 1) continue;
      const pair = pairs.get(key);
      if (!pair) continue;
      const t = circumTri(pts, pair[0], pair[1], i);
      if (t) tris.push(t);
    }
  }

  /* Drop the super-triangle fan, and with it the long thin hull triangles that
     web the outer boundary together and fill the margins densityAt() just
     worked to clear. */
  const r2max = maxCircumradius * maxCircumradius;
  return tris.filter((t) => t.a < n && t.b < n && t.c < n && t.r2 < r2max);
}

/* ------------------------------------------------------------------ *
 * 3. GRAPH SELECTION
 * ------------------------------------------------------------------ */

type RawEdge = { a: number; b: number; len: number };

function edgesOf(tris: readonly Tri[], points: readonly Pt[]): RawEdge[] {
  const seen = new Set<number>();
  const out: RawEdge[] = [];
  const n = points.length;
  const push = (u: number, v: number) => {
    const lo = u < v ? u : v;
    const hi = u < v ? v : u;
    const key = lo * n + hi;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({
      a: lo,
      b: hi,
      len: Math.hypot(points[lo].x - points[hi].x, points[lo].y - points[hi].y),
    });
  };
  for (const t of tris) {
    push(t.a, t.b);
    push(t.b, t.c);
    push(t.c, t.a);
  }
  return out;
}

/**
 * Minimum spanning tree over a subset of the nodes (Kruskal, union-find).
 *
 * The MST is why this reads as a system. It is the smallest edge set that still
 * connects every node, so the network stays complete on roughly a third of the
 * lines a full triangulation draws. Restraint and meaning happen to be the same
 * decision here, which is the best kind of decision to find.
 */
function spanningTree(
  edges: readonly RawEdge[],
  nodeCount: number,
  member: (i: number) => boolean,
): Set<number> {
  const parent = new Int32Array(nodeCount);
  for (let i = 0; i < nodeCount; i += 1) parent[i] = i;

  const find = (start: number): number => {
    let root = start;
    while (parent[root] !== root) root = parent[root];
    let walk = start;
    while (parent[walk] !== root) {
      const next = parent[walk];
      parent[walk] = root;
      walk = next;
    }
    return root;
  };

  const order = edges
    .map((_, i) => i)
    .filter((i) => member(edges[i].a) && member(edges[i].b))
    .sort((p, q) => edges[p].len - edges[q].len);

  const kept = new Set<number>();
  for (const i of order) {
    const ra = find(edges[i].a);
    const rb = find(edges[i].b);
    if (ra === rb) continue;
    parent[ra] = rb;
    kept.add(i);
  }
  return kept;
}

type Adjacency = readonly { to: number; len: number; edge: number }[][];

/** Dijkstra over the full triangulation, returning the node and edge path. */
function shortestPath(
  adj: Adjacency,
  from: number,
  to: number,
): { nodes: number[]; edges: number[] } {
  const n = adj.length;
  const dist = new Float64Array(n).fill(Infinity);
  const prev = new Int32Array(n).fill(-1);
  const prevEdge = new Int32Array(n).fill(-1);
  const done = new Uint8Array(n);
  dist[from] = 0;

  for (;;) {
    let u = -1;
    let best = Infinity;
    for (let i = 0; i < n; i += 1) {
      if (done[i] === 0 && dist[i] < best) {
        best = dist[i];
        u = i;
      }
    }
    if (u < 0 || u === to) break;
    done[u] = 1;
    for (const e of adj[u]) {
      const d = dist[u] + e.len;
      if (d >= dist[e.to]) continue;
      dist[e.to] = d;
      prev[e.to] = u;
      prevEdge[e.to] = e.edge;
    }
  }

  if (!Number.isFinite(dist[to])) return { nodes: [], edges: [] };

  const nodes: number[] = [];
  const edgeIds: number[] = [];
  let at = to;
  while (at !== -1) {
    nodes.push(at);
    if (prevEdge[at] !== -1) edgeIds.push(prevEdge[at]);
    if (at === from) break;
    at = prev[at];
  }
  nodes.reverse();
  edgeIds.reverse();
  return { nodes, edges: edgeIds };
}

/* ------------------------------------------------------------------ *
 * 4. BUILD
 * ------------------------------------------------------------------ */

type ModeSpec = {
  /** Fraction of non-tree triangulation edges added back as bracing. */
  extraEdges: number;
  /** Fraction of eligible triangles given a fill. */
  facetRate: number;
  /** Fraction of junction nodes drawn as visible dots. */
  nodeRate: number;
  /** Ambient drift amplitude in px at rest. */
  drift: number;
  /** Parallax depth range in px. */
  depth: number;
  jitter: number;
};

export const MODE_SPEC: Record<LatticeMode, ModeSpec> = {
  /* Structural: more cross-bracing so the network reads as engineered, and the
     fewest fills of the three — here the lines are the subject. */
  structural: {
    extraEdges: 0.34,
    facetRate: 0.26,
    nodeRate: 0.28,
    drift: 0.7,
    depth: 5,
    jitter: 0.16,
  },
  /* Organic: fewer braces so the tree's own branching shows through, more fills
     at more varied sizes, and just enough drift to register as alive. */
  organic: {
    extraEdges: 0.21,
    facetRate: 0.4,
    nodeRate: 0.24,
    drift: 2.1,
    depth: 11,
    jitter: 0.42,
  },
  /* Journey: dense inside the islands, bare between them. Fills mark
     milestones rather than decorate, so the rate stays low. */
  journey: {
    extraEdges: 0.22,
    facetRate: 0.22,
    nodeRate: 0.2,
    drift: 1.2,
    depth: 8,
    jitter: 0.3,
  },
};

/** Resting fill alpha. Low, but it can afford to be higher than it looks
 *  because no two fills ever stack — the number that would normally have to
 *  survive being doubled here only ever appears once. */
const FACET_ALPHA = 0.07;

export function nodeBudget(width: number): number {
  if (width < 640) return 62;
  if (width < 1024) return 108;
  if (width < 1600) return 168;
  return 210;
}

export function buildLattice(
  seed: number,
  width: number,
  height: number,
  mode: LatticeMode,
  budget: number,
): Lattice {
  const rng = makeRng(seed ^ 0x9e3779b9);
  const spec = MODE_SPEC[mode];
  const spacing = Math.sqrt((width * height) / Math.max(budget, 8)) * 1.04;

  let points: Pt[];
  let islandOf: number[];
  let anchorIdx: number[] = [];

  if (mode === "journey") {
    const built = islandPoints(width, height, spacing, budget, rng);
    points = built.pts;
    islandOf = built.island;
    anchorIdx = built.anchorIdx;
  } else if (mode === "structural") {
    points = hexPoints(width, height, spacing, spec.jitter, rng);
    islandOf = points.map(() => -1);
  } else {
    /* 0.64 rather than the nominal spacing: poissonPoints is thinned a second
       time by densityAt afterwards, and sampling at face value left organic at
       barely half the node count of structural — sparse enough to stop reading
       as a lattice at all. Measured back to parity. */
    points = poissonPoints(width, height, spacing * 0.64, rng);
    islandOf = points.map(() => -1);
  }

  const tris = triangulate(points, spacing * 2.35);
  const raw = edgesOf(tris, points);

  const adjAll: { to: number; len: number; edge: number }[][] = points.map(
    () => [],
  );
  raw.forEach((e, i) => {
    adjAll[e.a].push({ to: e.b, len: e.len, edge: i });
    adjAll[e.b].push({ to: e.a, len: e.len, edge: i });
  });

  const spineEdge = new Int32Array(raw.length).fill(-1);
  const spineEdgeT = new Float64Array(raw.length);
  const spineNode = new Int32Array(points.length).fill(-1);
  const spineNodeT = new Float64Array(points.length);

  /* The spine is routed BEFORE selection, because the route is what earns those
     edges their place in the kept set. Selecting first and hoping a path exists
     produces detours, and a detour reads as a mistake rather than as a path. */
  if (mode === "journey") {
    for (let m = 0; m < anchorIdx.length - 1; m += 1) {
      const path = shortestPath(adjAll, anchorIdx[m], anchorIdx[m + 1]);
      const total = Math.max(path.edges.length, 1);
      path.edges.forEach((ei, k) => {
        spineEdge[ei] = m;
        spineEdgeT[ei] = (k + 0.5) / total;
      });
      path.nodes.forEach((ni, k) => {
        if (spineNode[ni] !== -1) return;
        spineNode[ni] = m;
        spineNodeT[ni] = k / Math.max(path.nodes.length - 1, 1);
      });
    }
  }

  /* Selection. In journey mode the tree is built per island so the islands stay
     genuinely disconnected; the spine edges are the only things that ever
     bridge them, and they are added explicitly. */
  const keptIdx = new Set<number>();
  if (mode === "journey") {
    for (let m = 0; m < ANCHOR_UV.length; m += 1) {
      for (const i of spanningTree(raw, points.length, (n) => islandOf[n] === m)) {
        keptIdx.add(i);
      }
    }
    raw.forEach((_, i) => {
      if (spineEdge[i] !== -1) keptIdx.add(i);
    });
    raw.forEach((e, i) => {
      if (keptIdx.has(i)) return;
      if (islandOf[e.a] === -1 || islandOf[e.a] !== islandOf[e.b]) return;
      if (rng() < spec.extraEdges) keptIdx.add(i);
    });
  } else {
    for (const i of spanningTree(raw, points.length, () => true)) keptIdx.add(i);
    raw.forEach((e, i) => {
      if (keptIdx.has(i)) return;
      /* Short edges preferentially. A long extra edge cuts clean across the
         composition and reads as a stray line rather than as bracing. */
      const shortness = clamp01(1 - e.len / (spacing * 2.1));
      if (rng() < spec.extraEdges * (0.25 + shortness * 1.5)) keptIdx.add(i);
    });
  }

  const degree = new Int32Array(points.length);
  const edges: LatticeEdge[] = [];
  const keptPairs = new Set<number>();
  for (const i of keptIdx) {
    const e = raw[i];
    degree[e.a] += 1;
    degree[e.b] += 1;
    keptPairs.add(e.a * points.length + e.b);
    edges.push({
      a: e.a,
      b: e.b,
      len: e.len,
      weight: clamp01(0.42 + (1 - clamp01(e.len / (spacing * 2))) * 0.58),
      island: islandOf[e.a] === islandOf[e.b] ? islandOf[e.a] : -1,
      spine: spineEdge[i],
      spineT: spineEdgeT[i],
    });
  }

  const nodes: LatticeNode[] = points.map((p, i) => {
    const anchor = anchorIdx.indexOf(i);
    /* Visible dots are earned: a node has to be a junction, or a milestone. A
       dot on every vertex is the generic particle field the brief bans, and it
       is also simply untrue — most vertices are not decisions. */
    const shown = anchor !== -1 || (degree[i] >= 3 && rng() < spec.nodeRate);
    return {
      x: p.x,
      y: p.y,
      z: rng() * 2 - 1,
      drift: spec.drift * (0.5 + rng()),
      phase: rng() * Math.PI * 2,
      speed: 0.09 + rng() * 0.14,
      island: islandOf[i],
      degree: degree[i],
      shown,
      anchor,
      spine: spineNode[i],
      spineT: spineNodeT[i],
    };
  });

  /* Facets only where all three of the triangle's edges survived selection. A
     fill whose border is not drawn floats free of the network, and that is
     exactly the surface-on-top-of-a-surface the client objected to. */
  const facets: LatticeFacet[] = [];
  const hasEdge = (u: number, v: number): boolean =>
    keptPairs.has(Math.min(u, v) * points.length + Math.max(u, v));

  for (const t of tris) {
    if (!hasEdge(t.a, t.b) || !hasEdge(t.b, t.c) || !hasEdge(t.c, t.a)) continue;
    if (rng() > spec.facetRate * 3.4) continue;
    const sameIsland =
      nodes[t.a].island === nodes[t.b].island &&
      nodes[t.b].island === nodes[t.c].island;
    const spines = [nodes[t.a].spine, nodes[t.b].spine, nodes[t.c].spine].filter(
      (s) => s >= 0,
    );
    facets.push({
      a: t.a,
      b: t.b,
      c: t.c,
      island: sameIsland ? nodes[t.a].island : -1,
      alpha: FACET_ALPHA * (0.55 + rng() * 0.95),
      spine: spines.length > 0 ? Math.min(...spines) : -1,
    });
  }

  const keep = nodes.map((n) => n.degree > 0 || n.anchor >= 0);
  const remap = new Int32Array(nodes.length).fill(-1);
  let next = 0;
  for (let i = 0; i < nodes.length; i += 1) {
    if (keep[i]) remap[i] = next++;
  }

  return {
    width,
    height,
    mode,
    nodes: nodes.filter((_, i) => keep[i]),
    edges: edges.map((e) => ({ ...e, a: remap[e.a], b: remap[e.b] })),
    facets: facets.map((f) => ({
      ...f,
      a: remap[f.a],
      b: remap[f.b],
      c: remap[f.c],
    })),
    anchors: anchorIdx.map((i) => remap[i]),
    spacing,
  };
}

/** Parallax depth in px for a mode — read by the renderer's camera. */
export function depthOf(mode: LatticeMode): number {
  return MODE_SPEC[mode].depth;
}
