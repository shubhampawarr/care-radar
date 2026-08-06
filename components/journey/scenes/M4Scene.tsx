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
} from "../surface";

/* ------------------------------------------------------------------ *
 * M4 — Qualification and official procedures
 *
 * Three vertical columns, identical at 360px and 1440px. The braid is gone at
 * all widths: it read as a single woven rope at mobile, and keeping braid on
 * desktop with a different mechanic at mobile would mean two designs to
 * maintain and five more scenes inheriting the split.
 *
 * Simultaneity is now carried by geometry rather than by weaving — a common
 * start line and a common end line, with a brace across the top and a matching
 * closing rule at the base. Three columns that begin together and end together
 * cannot be misread as three consecutive steps, which is the failure mode this
 * scene exists to avoid (it would turn a 12-18 month route into an apparent
 * 22-month one).
 *
 * Coordinates are in SHEET space (PaperScene translates children by `inset`).
 * ------------------------------------------------------------------ */

type Layout = {
  viewW: number;
  viewH: number;
  /** Common start and end lines — the simultaneity carriers. */
  startY: number;
  endY: number;
  colX: [number, number, number];
  colWidth: number;
  objScale: number;
  labelSize: number;
};

const INSET = 26;

const MOBILE: Layout = {
  viewW: 360,
  viewH: 470,
  startY: 74,
  endY: 372,
  colX: [52, 154, 256],
  colWidth: 40,
  objScale: 0.62,
  labelSize: 10,
};

const DESKTOP: Layout = {
  viewW: 900,
  viewH: 500,
  startY: 84,
  endY: 404,
  colX: [178, 424, 670],
  colWidth: 72,
  objScale: 1,
  labelSize: 15,
};

const COLUMNS = [
  { key: "sprache", label: "Sprache", colour: PAPER.teal },
  { key: "dossier", label: "Anerkennungsdossier", colour: PAPER.navy },
  { key: "visum", label: "Visum", colour: PAPER.tealLight },
] as const;

function ink(rng: () => number, extra = 0) {
  return {
    stroke: PAPER.ink,
    strokeWidth: 2.3 + rng() * 1.1 + extra,
    strokeLinejoin: "round" as const,
  };
}

/* ------------------------------------------------------------------ *
 * Objects — paper cut-outs on paper, reoriented for vertical columns.
 * No crossings: each object sits on its own column.
 * ------------------------------------------------------------------ */

type ObjProps = { x: number; y: number; seed: string; scale: number };

/** Sprache — speech bubbles. */
function SpeechBubbles({ x, y, seed, scale }: ObjProps) {
  const rng = makeRng(seedFromString(seed));
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path
        id="m4-sprache-bubble-back"
        d={wobblePolygon(
          [[-34, -26], [6, -29], [8, -2], [-10, 0], [-18, 11], [-19, 0], [-34, -2]],
          rng,
          1.4,
        )}
        fill={PAPER.white}
        {...ink(rng)}
      />
      <path
        id="m4-sprache-bubble-front"
        d={wobblePolygon(
          [[-4, 8], [34, 5], [36, 30], [16, 32], [8, 43], [7, 32], [-3, 33]],
          rng,
          1.4,
        )}
        fill={PAPER.teal}
        {...ink(rng)}
      />
      <path
        id="m4-sprache-bubble-line-01"
        d={wobbleLine(-28, -18, -4, -19, rng, 3, 0.9)}
        stroke={PAPER.ink}
        strokeWidth={1.9}
        fill="none"
        opacity={0.7}
      />
      <path
        id="m4-sprache-bubble-line-02"
        d={wobbleLine(-28, -10, -12, -11, rng, 3, 0.9)}
        stroke={PAPER.ink}
        strokeWidth={1.9}
        fill="none"
        opacity={0.7}
      />
    </g>
  );
}

/** Sprache — alphabet cards, stacked down the column. */
function AlphabetCards({ x, y, seed, scale }: ObjProps) {
  const rng = makeRng(seedFromString(seed));
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          id={`m4-sprache-card-0${i + 1}`}
          d={wobbleRect(-30 + i * 21, -16 + i * 5, 26, 32, rng, 1.3, 2)}
          fill={i === 2 ? PAPER.teal : PAPER.white}
          {...ink(rng)}
        />
      ))}
    </g>
  );
}

/** Dossier — documents stacking one onto another. */
function DocumentStack({ x, y, seed, scale }: ObjProps) {
  const rng = makeRng(seedFromString(seed));
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          id={`m4-dossier-page-0${i + 1}`}
          d={wobbleRect(-26 + i * 6, -34 + i * 15, 46, 34, rng, 1.3, 2)}
          fill={i === 2 ? PAPER.cream : PAPER.white}
          {...ink(rng)}
        />
      ))}
      <path
        id="m4-dossier-rule-01"
        d={wobbleLine(-12, 0, 10, 0, rng, 3, 0.8)}
        stroke={PAPER.ink}
        strokeWidth={1.8}
        fill="none"
        opacity={0.55}
      />
    </g>
  );
}

/** Dossier — folded into a sealed envelope. */
function SealedEnvelope({ x, y, seed, scale }: ObjProps) {
  const rng = makeRng(seedFromString(seed));
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path
        id="m4-dossier-envelope-body"
        d={wobbleRect(-32, -22, 64, 44, rng, 1.4, 3)}
        fill={PAPER.navy}
        {...ink(rng)}
      />
      <path
        id="m4-dossier-envelope-flap"
        d={wobblePolygon([[-32, -22], [32, -22], [0, 8]], rng, 1.4)}
        fill={PAPER.white}
        {...ink(rng)}
      />
      <path
        id="m4-dossier-envelope-seal"
        d={wobblePolygon([[-8, 2], [8, 0], [10, 15], [-6, 17]], rng, 1.2)}
        fill={PAPER.teal}
        {...ink(rng)}
      />
    </g>
  );
}

/** Visum — passport booklet opening. */
function Passport({ x, y, seed, scale }: ObjProps) {
  const rng = makeRng(seedFromString(seed));
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path
        id="m4-visum-passport-left"
        d={wobblePolygon([[-34, -24], [0, -20], [0, 22], [-34, 18]], rng, 1.3)}
        fill={PAPER.navyDeep}
        {...ink(rng)}
      />
      <path
        id="m4-visum-passport-right"
        d={wobblePolygon([[0, -20], [34, -24], [34, 18], [0, 22]], rng, 1.3)}
        fill={PAPER.white}
        {...ink(rng)}
      />
      <path
        id="m4-visum-passport-line-01"
        d={wobbleLine(9, -7, 27, -8, rng, 3, 0.8)}
        stroke={PAPER.ink}
        strokeWidth={1.8}
        fill="none"
        opacity={0.55}
      />
      <path
        id="m4-visum-passport-line-02"
        d={wobbleLine(9, 3, 22, 2, rng, 3, 0.8)}
        stroke={PAPER.ink}
        strokeWidth={1.8}
        fill="none"
        opacity={0.55}
      />
    </g>
  );
}

/** Visum — stamp descending. */
function Stamp({ x, y, seed, scale }: ObjProps) {
  const rng = makeRng(seedFromString(seed));
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <path
        id="m4-visum-stamp-mark"
        d={wobblePolygon([[-24, -16], [24, -19], [26, 14], [-22, 17]], rng, 2)}
        fill="none"
        stroke={PAPER.teal}
        strokeWidth={3.6}
      />
      <path
        id="m4-visum-stamp-bar"
        d={wobbleLine(-14, 0, 16, -1, rng, 3, 1)}
        stroke={PAPER.teal}
        strokeWidth={3.2}
        fill="none"
      />
    </g>
  );
}

/* ------------------------------------------------------------------ *
 * M4
 * ------------------------------------------------------------------ */

export default function M4Scene({ className = "" }: { className?: string }) {
  const { isMobile, reducedMotion } = useJourneyVariant();
  const L = isMobile ? MOBILE : DESKTOP;

  const rng = useMemo(() => makeRng(seedFromString("m4-frame")), []);
  const markerRef = useRef<SVGGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* The Sprache level marker slides down its column with scroll and is the
     last element still moving after the others settle — it is the pacemaker
     of the overall duration, and the animation says so before the copy does. */
  const positionMarker = useCallback(
    (progress: number) => {
      const node = markerRef.current;
      if (!node) return;
      const y = L.startY + (L.endY - L.startY) * clamp01(progress);
      node.setAttribute("transform", `translate(${L.colX[0]},${y.toFixed(2)})`);
    },
    [L],
  );

  useEffect(() => {
    if (reducedMotion) {
      positionMarker(0.58);
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    let raf: number | null = null;
    const tick = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      positionMarker(clamp01((vh - rect.top) / (vh + rect.height)));
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

  const braceX0 = L.colX[0] - L.colWidth / 2 - (isMobile ? 8 : 16);
  const braceX1 = L.colX[2] + L.colWidth / 2 + (isMobile ? 8 : 16);
  const s = L.objScale;

  /* Object positions down each column, clear of the start and end rules. */
  const span = L.endY - L.startY;
  const at = (col: 0 | 1 | 2, t: number) => ({
    x: L.colX[col],
    y: L.startY + span * t,
  });

  return (
    <div ref={rootRef} className={className}>
      <PaperScene
        seed="m4-qualification"
        width={L.viewW}
        height={L.viewH}
        inset={INSET}
        unfoldAt={380}
        title="Three paper columns side by side — Sprache, Anerkennungsdossier and Visum — all beginning at one shared start line and ending at one shared finish line, braced across the top and closed at the base, marked months three to twelve."
      >
        {/* Brace across the top spanning all three, and the matching closing
            rule at the base. These carry the simultaneity now. */}
        <g data-unfold-index={0} style={{ ["--unfold-delay" as string]: "0ms" }}>
          <path
            id="m4-brace-top"
            d={`M${braceX0},${L.startY - 20} L${braceX0},${L.startY} L${braceX1},${L.startY} L${braceX1},${L.startY - 20}`}
            fill="none"
            stroke={PAPER.ink}
            strokeWidth={3.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="m4-brace-base"
            d={`M${braceX0},${L.endY + 20} L${braceX0},${L.endY} L${braceX1},${L.endY} L${braceX1},${L.endY + 20}`}
            fill="none"
            stroke={PAPER.ink}
            strokeWidth={3.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            id="m4-brace-label"
            data-scene-text=""
            x={(braceX0 + braceX1) / 2}
            y={L.startY - 28}
            textAnchor="middle"
            fontSize={L.labelSize}
            fontWeight={700}
            fill={PAPER.ink}
          >
            Monate 3–12
          </text>
        </g>

        {/* All three columns are ONE unfold item, so they can only begin
            together. Any stagger reintroduces the sequential reading. */}
        <g data-unfold-index={1} style={{ ["--unfold-delay" as string]: "0ms" }}>
          {COLUMNS.map((col, i) => (
            <g key={col.key}>
              <path
                id={`m4-column-${col.key}`}
                d={wobbleRect(
                  L.colX[i] - L.colWidth / 2,
                  L.startY,
                  L.colWidth,
                  span,
                  rng,
                  1.5,
                  4,
                )}
                fill={col.colour}
                {...ink(rng, 0.3)}
              />
            </g>
          ))}
        </g>

        {/* Column objects — no crossings, each sits on its own column. */}
        <g data-unfold-index={2} style={{ ["--unfold-delay" as string]: "80ms" }}>
          <SpeechBubbles {...at(0, 0.18)} seed="m4-bubbles" scale={s} />
          <AlphabetCards {...at(0, 0.72)} seed="m4-cards" scale={s} />
        </g>
        <g data-unfold-index={3} style={{ ["--unfold-delay" as string]: "80ms" }}>
          <DocumentStack {...at(1, 0.24)} seed="m4-docs" scale={s} />
          <SealedEnvelope {...at(1, 0.74)} seed="m4-envelope" scale={s} />
        </g>
        <g data-unfold-index={4} style={{ ["--unfold-delay" as string]: "80ms" }}>
          <Passport {...at(2, 0.22)} seed="m4-passport" scale={s} />
          <Stamp {...at(2, 0.74)} seed="m4-stamp" scale={s} />
        </g>

        {/* Sprache level marker — rides its column, driven by scroll. */}
        <g ref={markerRef} id="m4-sprache-level-marker">
          <path
            id="m4-sprache-level-marker-body"
            d={wobblePolygon(
              [
                [-L.colWidth / 2 - 9, -9],
                [L.colWidth / 2 + 9, -11],
                [L.colWidth / 2 + 10, 9],
                [-L.colWidth / 2 - 8, 11],
              ],
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
            d={wobbleLine(-8, 0, 10, -1, rng, 2, 0.7)}
            stroke={PAPER.teal}
            strokeWidth={3.4}
            fill="none"
          />
        </g>
      </PaperScene>
    </div>
  );
}
