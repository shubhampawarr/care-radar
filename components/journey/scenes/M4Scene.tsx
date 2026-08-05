"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import PaperScene, { useJourneyVariant } from "../PaperScene";
import {
  clamp01,
  makeRng,
  PAPER,
  seedFromString,
  wobbleLine,
  wobblePolygon,
  wobbleRect,
} from "../paper";

/* ------------------------------------------------------------------ *
 * Braid geometry
 *
 * Three strands share one centre line and one amplitude, phase-shifted by
 * 2pi/3. Depth is cos() of the same phase, so a strand is in front exactly
 * where it is mid-sweep — that is what produces over/under rather than a
 * merge. Segments are emitted per band, back-to-front, so the ink outline of
 * the nearer strand occludes the one behind it.
 * ------------------------------------------------------------------ */

type BraidConfig = {
  viewW: number;
  viewH: number;
  x0: number;
  x1: number;
  cy: number;
  amp: number;
  periods: number;
  thickness: number;
  bands: number;
};

/* Coordinates below are in SHEET space: PaperScene translates scene children
   by `inset`, so the drawable area is (viewW - inset*2) x (viewH - inset*2). */

const MOBILE: BraidConfig = {
  viewW: 360,
  viewH: 400,
  x0: 56,
  x1: 292,
  cy: 176,
  amp: 58,
  periods: 1.5,
  thickness: 13,
  bands: 30,
};

const DESKTOP: BraidConfig = {
  viewW: 900,
  viewH: 430,
  x0: 116,
  x1: 800,
  cy: 190,
  amp: 62,
  periods: 2,
  thickness: 21,
  bands: 60,
};

const STRANDS = [
  { key: "sprache", label: "Sprache", colour: PAPER.teal, phase: 0 },
  { key: "dossier", label: "Anerkennungsdossier", colour: PAPER.navy, phase: (2 * Math.PI) / 3 },
  { key: "visum", label: "Visum", colour: PAPER.tealLight, phase: (4 * Math.PI) / 3 },
] as const;

type StrandKey = (typeof STRANDS)[number]["key"];

/**
 * Mobile falls back to three stacked strands.
 *
 * The braid was built and judged at 360px first, per the build order, and it
 * read as a single woven rope: the usable sheet is 308x348, the bracket takes
 * ~50 of it, and three strands plus the six objects that give them their
 * identity do not fit in the ~92px of height that leaves. Stacked lanes keep
 * the three concerns separable; the bracket carries the simultaneity instead.
 */
const STACK_LANES = [0, 1, 2] as const;

function laneY(cfg: BraidConfig, lane: number): number {
  return cfg.cy + (lane - 1) * (cfg.amp * 0.92);
}

function strandY(cfg: BraidConfig, phase: number, x: number): number {
  const t = (x - cfg.x0) / (cfg.x1 - cfg.x0);
  return cfg.cy + cfg.amp * Math.sin(2 * Math.PI * cfg.periods * t + phase);
}

function strandDepth(cfg: BraidConfig, phase: number, x: number): number {
  const t = (x - cfg.x0) / (cfg.x1 - cfg.x0);
  return Math.cos(2 * Math.PI * cfg.periods * t + phase);
}

type Segment = { strand: number; d: string; depth: number };

/** Emits band-sliced segments already ordered back-to-front. */
function buildBraid(cfg: BraidConfig): Segment[] {
  const segments: Segment[] = [];
  const bandW = (cfg.x1 - cfg.x0) / cfg.bands;

  for (let b = 0; b < cfg.bands; b += 1) {
    const bx0 = cfg.x0 + b * bandW;
    const bx1 = bx0 + bandW;
    const mid = (bx0 + bx1) / 2;

    const ordered = STRANDS.map((s, i) => ({
      i,
      depth: strandDepth(cfg, s.phase, mid),
    })).sort((a, b2) => a.depth - b2.depth);

    for (const { i, depth } of ordered) {
      const phase = STRANDS[i].phase;
      // 1px overlap each side so bands do not show hairline seams.
      const from = Math.max(cfg.x0, bx0 - 1);
      const to = Math.min(cfg.x1, bx1 + 1);
      const steps = 4;
      const pts: string[] = [];
      for (let s = 0; s <= steps; s += 1) {
        const x = from + ((to - from) * s) / steps;
        pts.push(`${s === 0 ? "M" : "L"}${x.toFixed(2)},${strandY(cfg, phase, x).toFixed(2)}`);
      }
      segments.push({ strand: i, d: pts.join(" "), depth });
    }
  }
  return segments;
}

/**
 * X positions where a strand is furthest forward — safe places for objects,
 * since a front-most strand is not occluded by the other two there.
 */
function frontPoints(cfg: BraidConfig, phase: number, count: number): number[] {
  const out: number[] = [];
  const span = cfg.x1 - cfg.x0;
  for (let k = -2; k < 12 && out.length < count; k += 1) {
    // cos peaks where 2*pi*periods*t + phase = 2*pi*k
    const t = (2 * Math.PI * k - phase) / (2 * Math.PI * cfg.periods);
    if (t > 0.1 && t < 0.9) out.push(cfg.x0 + span * t);
  }
  // Never hand back an off-strand position.
  return out.map((x) => Math.min(cfg.x1 - 24, Math.max(cfg.x0 + 24, x)));
}

/* ------------------------------------------------------------------ *
 * Scene objects — flat cut-outs, max 3 layers, no gradients
 * ------------------------------------------------------------------ */

type ObjProps = { x: number; y: number; seed: string; idx: number; scale?: number };

function outlineProps(rng: () => number) {
  return {
    stroke: PAPER.ink,
    strokeWidth: 2.4 + rng() * 1.2,
    strokeLinejoin: "round" as const,
  };
}

function SpeechBubbles({ x, y, seed, idx, scale = 1 }: ObjProps) {
  const rng = makeRng(seedFromString(seed));
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <g data-unfold-index={idx} style={{ ["--unfold-delay" as string]: "0ms" }}>
      <path
        id="m4-sprache-bubble-back"
        d={wobblePolygon(
          [[-30, -30], [8, -32], [10, -6], [-6, -4], [-14, 6], [-15, -4], [-30, -6]],
          rng,
          1.4,
        )}
        fill={PAPER.white}
        {...outlineProps(rng)}
      />
      <path
        id="m4-sprache-bubble-front"
        d={wobblePolygon(
          [[-2, -20], [30, -22], [32, 0], [16, 2], [10, 12], [9, 2], [-1, 0]],
          rng,
          1.4,
        )}
        fill={PAPER.teal}
        {...outlineProps(rng)}
      />
      <path
        id="m4-sprache-bubble-line-01"
        d={wobbleLine(-24, -22, -2, -23, rng, 3, 0.9)}
        stroke={PAPER.ink}
        strokeWidth={1.8}
        fill="none"
        opacity={0.75}
      />
      <path
        id="m4-sprache-bubble-line-02"
        d={wobbleLine(-24, -15, -8, -16, rng, 3, 0.9)}
        stroke={PAPER.ink}
        strokeWidth={1.8}
        fill="none"
        opacity={0.75}
      />
      </g>
    </g>
  );
}

function AlphabetCards({ x, y, seed, idx, scale = 1 }: ObjProps) {
  const rng = makeRng(seedFromString(seed));
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <g data-unfold-index={idx} style={{ ["--unfold-delay" as string]: "0ms" }}>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          id={`m4-sprache-card-0${i + 1}`}
          d={wobbleRect(-26 + i * 19, -14 - i * 3, 22, 28, rng, 1.3, 2)}
          fill={i === 2 ? PAPER.teal : PAPER.white}
          {...outlineProps(rng)}
        />
      ))}
      </g>
    </g>
  );
}

function DocumentStack({ x, y, seed, idx, scale = 1 }: ObjProps) {
  const rng = makeRng(seedFromString(seed));
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <g data-unfold-index={idx} style={{ ["--unfold-delay" as string]: "0ms" }}>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          id={`m4-dossier-page-0${i + 1}`}
          d={wobbleRect(-24 + i * 5, -22 + i * 7, 40, 30, rng, 1.3, 2)}
          fill={i === 2 ? PAPER.cream : PAPER.white}
          {...outlineProps(rng)}
        />
      ))}
      <path
        id="m4-dossier-rule-01"
        d={wobbleLine(-14, 0, 6, 0, rng, 3, 0.8)}
        stroke={PAPER.ink}
        strokeWidth={1.7}
        fill="none"
        opacity={0.6}
      />
      <path
        id="m4-dossier-rule-02"
        d={wobbleLine(-14, 7, 0, 7, rng, 3, 0.8)}
        stroke={PAPER.ink}
        strokeWidth={1.7}
        fill="none"
        opacity={0.6}
      />
      </g>
    </g>
  );
}

function SealedEnvelope({ x, y, seed, idx, scale = 1 }: ObjProps) {
  const rng = makeRng(seedFromString(seed));
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <g data-unfold-index={idx} style={{ ["--unfold-delay" as string]: "0ms" }}>
      <path
        id="m4-dossier-envelope-body"
        d={wobbleRect(-28, -20, 56, 38, rng, 1.4, 3)}
        fill={PAPER.navy}
        {...outlineProps(rng)}
      />
      <path
        id="m4-dossier-envelope-flap"
        d={wobblePolygon([[-28, -20], [28, -20], [0, 6]], rng, 1.4)}
        fill={PAPER.white}
        {...outlineProps(rng)}
      />
      <path
        id="m4-dossier-envelope-seal"
        d={wobblePolygon([[-7, 0], [7, -2], [9, 11], [-5, 13]], rng, 1.2)}
        fill={PAPER.teal}
        {...outlineProps(rng)}
      />
      </g>
    </g>
  );
}

function Passport({ x, y, seed, idx, scale = 1 }: ObjProps) {
  const rng = makeRng(seedFromString(seed));
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <g data-unfold-index={idx} style={{ ["--unfold-delay" as string]: "0ms" }}>
      <path
        id="m4-visum-passport-left"
        d={wobblePolygon([[-30, -22], [0, -18], [0, 20], [-30, 16]], rng, 1.3)}
        fill={PAPER.navyDeep}
        {...outlineProps(rng)}
      />
      <path
        id="m4-visum-passport-right"
        d={wobblePolygon([[0, -18], [30, -22], [30, 16], [0, 20]], rng, 1.3)}
        fill={PAPER.white}
        {...outlineProps(rng)}
      />
      <path
        id="m4-visum-passport-line-01"
        d={wobbleLine(8, -6, 24, -7, rng, 3, 0.8)}
        stroke={PAPER.ink}
        strokeWidth={1.7}
        fill="none"
        opacity={0.6}
      />
      <path
        id="m4-visum-passport-line-02"
        d={wobbleLine(8, 2, 20, 1, rng, 3, 0.8)}
        stroke={PAPER.ink}
        strokeWidth={1.7}
        fill="none"
        opacity={0.6}
      />
      </g>
    </g>
  );
}

function Stamp({ x, y, seed, idx, scale = 1 }: ObjProps) {
  const rng = makeRng(seedFromString(seed));
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <g data-unfold-index={idx} style={{ ["--unfold-delay" as string]: "0ms" }}>
      <path
        id="m4-visum-stamp-mark"
        d={wobblePolygon([[-20, -14], [20, -17], [22, 12], [-18, 15]], rng, 2)}
        fill="none"
        stroke={PAPER.teal}
        strokeWidth={3.4}
      />
      <path
        id="m4-visum-stamp-bar"
        d={wobbleLine(-12, 0, 14, -1, rng, 3, 1)}
        stroke={PAPER.teal}
        strokeWidth={3}
        fill="none"
      />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ *
 * M4
 * ------------------------------------------------------------------ */

export type M4SceneProps = {
  /** Force a geometry variant — the sandbox uses this to preview 360px. */
  force?: "mobile" | "desktop";
  className?: string;
};

export default function M4Scene({ force, className = "" }: M4SceneProps) {
  const { isMobile, reducedMotion } = useJourneyVariant();
  const useMobile = force ? force === "mobile" : isMobile;
  const cfg = useMobile ? MOBILE : DESKTOP;

  const segments = useMemo(() => buildBraid(cfg), [cfg]);
  const rng = useMemo(() => makeRng(seedFromString("m4-braid")), []);

  const markerRef = useRef<SVGGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* The Sprache level marker slides continuously with scroll and is the last
     element still moving after the others settle. */
  const positionMarker = useCallback(
    (progress: number) => {
      const node = markerRef.current;
      if (!node) return;
      const x = cfg.x0 + (cfg.x1 - cfg.x0) * clamp01(progress);
      const y = useMobile ? laneY(cfg, 0) : strandY(cfg, 0, x);
      node.setAttribute("transform", `translate(${x.toFixed(2)},${y.toFixed(2)})`);
    },
    [cfg, useMobile],
  );

  useEffect(() => {
    if (reducedMotion) {
      positionMarker(0.62);
      return;
    }
    const root = rootRef.current;
    if (!root) return;

    let raf: number | null = null;
    const tick = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the scene enters from the bottom, 1 as it leaves the top.
      const p = clamp01((vh - rect.top) / (vh + rect.height));
      positionMarker(p);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && raf === null) raf = requestAnimationFrame(tick);
          else if (!e.isIntersecting && raf !== null) {
            cancelAnimationFrame(raf);
            raf = null;
          }
        }
      },
      { rootMargin: "15% 0px" },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [reducedMotion, positionMarker]);

  const objScale = useMobile ? 0.74 : 1;

  /**
   * Six object anchors, in render order:
   * bubbles, cards (Sprache) · docs, envelope (Dossier) · passport, stamp (Visum)
   *
   * Desktop places them where their strand is furthest forward, so the other
   * two never occlude them. Mobile places them on their stacked lane.
   */
  const spots = useMemo(() => {
    const span = cfg.x1 - cfg.x0;
    if (useMobile) {
      const at = (lane: number, t: number) => ({
        x: cfg.x0 + span * t,
        y: laneY(cfg, lane),
      });
      return [at(0, 0.3), at(0, 0.74), at(1, 0.3), at(1, 0.74), at(2, 0.3), at(2, 0.74)];
    }
    const front: Record<StrandKey, number[]> = {
      sprache: frontPoints(cfg, STRANDS[0].phase, 2),
      dossier: frontPoints(cfg, STRANDS[1].phase, 2),
      visum: frontPoints(cfg, STRANDS[2].phase, 2),
    };
    const on = (s: 0 | 1 | 2, xs: number[], i: number, fallbackT: number, dy: number) => {
      const x = xs[i] ?? cfg.x0 + span * fallbackT;
      return { x, y: strandY(cfg, STRANDS[s].phase, x) + dy };
    };
    return [
      on(0, front.sprache, 0, 0.2, -46),
      on(0, front.sprache, 1, 0.78, -42),
      on(1, front.dossier, 0, 0.34, -48),
      on(1, front.dossier, 1, 0.86, -48),
      on(2, front.visum, 0, 0.16, 48),
      on(2, front.visum, 1, 0.66, 46),
    ];
  }, [cfg, useMobile]);

  const bracketTop = useMobile
    ? laneY(cfg, 0) - cfg.thickness * 1.6
    : cfg.cy - cfg.amp - cfg.thickness;
  const bracketBottom = useMobile
    ? laneY(cfg, 2) + cfg.thickness * 1.6
    : cfg.cy + cfg.amp + cfg.thickness;
  const bracketX = cfg.x0 - (useMobile ? 32 : 54);

  return (
    <div ref={rootRef} className={className}>
      <PaperScene
        seed="m4-qualification"
        width={cfg.viewW}
        height={cfg.viewH}
        unfoldAt={380}
        title={
          useMobile
            ? "Three paper ribbons — Sprache, Anerkennungsdossier and Visum — running as three parallel lanes across the frame at the same time, with a bracket at the left spanning all three, marked months three to twelve."
            : "Three paper ribbons — Sprache, Anerkennungsdossier and Visum — braided horizontally across the frame, crossing over and under without merging, with a bracket at the left spanning all three, marked months three to twelve."
        }
      >
        {/* Bracket spanning all three strands. */}
        <g data-unfold-index={0} style={{ ["--unfold-delay" as string]: "0ms" }}>
          <path
            id="m4-bracket"
            d={`M${bracketX + 14},${bracketTop} L${bracketX},${bracketTop} L${bracketX},${bracketBottom} L${bracketX + 14},${bracketBottom}`}
            fill="none"
            stroke={PAPER.ink}
            strokeWidth={3.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            id="m4-bracket-label"
            data-scene-text=""
            x={bracketX + 4}
            y={cfg.cy}
            transform={`rotate(-90 ${bracketX + 4} ${cfg.cy})`}
            textAnchor="middle"
            fontSize={useMobile ? 12 : 15}
            fontWeight={700}
            fill={PAPER.ink}
          >
            Monate 3–12
          </text>
        </g>

        {/* All three strands are ONE unfold item, so they can only begin
            together — any stagger would read as three sequential steps and
            turn a 12-18 month route into an apparent 22-month one. */}
        <g data-unfold-index={0} style={{ ["--unfold-delay" as string]: "0ms" }}>
          {useMobile
            ? STACK_LANES.map((lane) => {
                const y = laneY(cfg, lane);
                const d = `M${cfg.x0},${y} L${cfg.x1},${y}`;
                return (
                  <g key={lane}>
                    <path
                      id={`m4-strand-${STRANDS[lane].key}-ink`}
                      d={d}
                      fill="none"
                      stroke={PAPER.ink}
                      strokeWidth={cfg.thickness + 6}
                      strokeLinecap="round"
                    />
                    <path
                      id={`m4-strand-${STRANDS[lane].key}-fill`}
                      d={d}
                      fill="none"
                      stroke={STRANDS[lane].colour}
                      strokeWidth={cfg.thickness}
                      strokeLinecap="round"
                    />
                  </g>
                );
              })
            : segments.map((seg, i) => (
                <g key={i}>
                  <path
                    id={`m4-strand-${STRANDS[seg.strand].key}-ink-${i}`}
                    d={seg.d}
                    fill="none"
                    stroke={PAPER.ink}
                    strokeWidth={cfg.thickness + 6}
                    strokeLinecap="butt"
                  />
                  <path
                    id={`m4-strand-${STRANDS[seg.strand].key}-fill-${i}`}
                    d={seg.d}
                    fill="none"
                    stroke={STRANDS[seg.strand].colour}
                    strokeWidth={cfg.thickness}
                    strokeLinecap="butt"
                  />
                </g>
              ))}
        </g>

        {/* Strand objects. */}
        <SpeechBubbles x={spots[0].x} y={spots[0].y} seed="m4-bubbles" idx={1} scale={objScale} />
        <AlphabetCards x={spots[1].x} y={spots[1].y} seed="m4-cards" idx={2} scale={objScale} />
        <DocumentStack x={spots[2].x} y={spots[2].y} seed="m4-docs" idx={3} scale={objScale} />
        <SealedEnvelope x={spots[3].x} y={spots[3].y} seed="m4-envelope" idx={4} scale={objScale} />
        <Passport x={spots[4].x} y={spots[4].y} seed="m4-passport" idx={5} scale={objScale} />
        <Stamp x={spots[5].x} y={spots[5].y} seed="m4-stamp" idx={6} scale={objScale} />

        {/* Level marker — rides the Sprache strand, driven by scroll. */}
        <g ref={markerRef} id="m4-sprache-level-marker">
          <path
            id="m4-sprache-level-marker-body"
            d={wobblePolygon(
              [[-13, -13], [13, -15], [15, 12], [-11, 14]],
              rng,
              1.2,
            )}
            fill={PAPER.white}
            stroke={PAPER.ink}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <path
            id="m4-sprache-level-marker-notch"
            d={wobbleLine(-6, -2, 8, -3, rng, 2, 0.7)}
            stroke={PAPER.teal}
            strokeWidth={3.4}
            fill="none"
          />
        </g>
      </PaperScene>
    </div>
  );
}
