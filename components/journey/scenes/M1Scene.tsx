"use client";

import { useMemo } from "react";
import PaperScene from "../PaperScene";
import {
  contourRuns,
  makeRng,
  PAPER,
  pointsToPath,
  seedFromString,
  SHADOW_OFFSET,
  SHADOW_OPACITY,
  wobbleLine,
  wobblePoints,
  wobblePolygon,
  wobbleRect,
  type Pt,
} from "../surface";

/* ------------------------------------------------------------------ *
 * M1 — Needs assessment and mandate
 *
 * The style frame. A crumpled sheet releases into a clean rectangle; two
 * cut-out figures hinge upright from the sheet plane, seated across a table
 * that unfolds from the same plane; then the working objects layer in.
 *
 * Depth is capped at three layers: sheet -> table+figures -> tabletop objects.
 * Coordinates are in SHEET space (PaperScene translates children by `inset`).
 * ------------------------------------------------------------------ */

const VIEW_W = 900;
const VIEW_H = 476;
const INSET = 26;
const SHEET_W = VIEW_W - INSET * 2; // 848
const SHEET_H = VIEW_H - INSET * 2; // 508

/** The table edge — everything hinges up from this line. */
const TABLE_Y = 272;

/** Objects settle 80ms apart, after the figures hinge at 400ms. */
const step = (n: number) => ({ ["--unfold-delay" as string]: `${n * 80}ms` });

/** Flat cut-out shadow: offset 4/6, 12%, warm-grey, never blurred. */
function CutShadow({ d, id }: { d: string; id: string }) {
  return (
    <path
      id={id}
      d={d}
      transform={`translate(${SHADOW_OFFSET.x},${SHADOW_OFFSET.y})`}
      fill={PAPER.shadow}
      opacity={SHADOW_OPACITY}
      stroke="none"
    />
  );
}

/**
 * A scissor-cut shape: one flat fill, and its contour stroked as several
 * overlapping runs at different weights. A cut edge is never one uniform
 * width, and that variation is most of what separates "paper-cut" from
 * "flat-coloured vector".
 */
function CutShape({
  id,
  points,
  fill,
  rng,
  base = 2.9,
  wobble = 1.7,
  runs = 3,
}: {
  id: string;
  points: readonly Pt[];
  fill: string;
  rng: () => number;
  base?: number;
  wobble?: number;
  runs?: number;
}) {
  const pts = wobblePoints(points, rng, wobble);
  const segments = contourRuns(pts, runs);
  return (
    <g id={id}>
      <path id={`${id}-fill`} d={pointsToPath(pts)} fill={fill} stroke="none" />
      {segments.map((run, i) => (
        <path
          key={i}
          id={`${id}-edge-0${i + 1}`}
          d={pointsToPath(run, false)}
          fill="none"
          stroke={PAPER.ink}
          strokeWidth={Number((base + (rng() * 1.5 - 0.6)).toFixed(2))}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

function ink(rng: () => number, extra = 0) {
  return {
    stroke: PAPER.ink,
    strokeWidth: 2.5 + rng() * 1.1 + extra,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };
}

/* ------------------------------------------------------------------ *
 * Figures — cut-out silhouettes, faces present, simple features.
 * Neither presents to the other; both lean slightly inward.
 * ------------------------------------------------------------------ */

type FigureProps = {
  x: number;
  /** +1 leans right, -1 leans left. */
  lean: 1 | -1;
  seed: string;
  bodyFill: string;
  idx: number;
};

/**
 * The two figures are different people, not a shape and its mirror: different
 * shoulder line, different head cut, different hair, different gesture. The
 * employer (left) is pointing into the vacancy profile; the CareRadar side
 * (right) has a hand flat on the table, listening. Neither presents to the
 * other — this is a working table.
 */
function Figure({ x, lean, seed, bodyFill, idx }: FigureProps) {
  const rng = makeRng(seedFromString(seed));
  const side = lean === 1 ? "left" : "right";
  const isLeft = lean === 1;

  const torso: Pt[] = isLeft
    ? [[-56, 6], [-50, -68], [-30, -92], [16, -95], [44, -74], [54, 6]]
    : [[-46, 6], [-42, -60], [-26, -84], [10, -90], [40, -70], [58, 6]];

  const head: Pt[] = isLeft
    ? [[-29, -138], [-19, -162], [14, -165], [30, -145], [27, -117], [3, -105], [-23, -113]]
    : [[-26, -132], [-14, -158], [18, -158], [32, -136], [26, -110], [0, -101], [-22, -110]];

  const hair: Pt[] = isLeft
    ? [[-30, -138], [-21, -165], [15, -168], [32, -147], [20, -149], [0, -157], [-18, -148]]
    : [[-27, -130], [-16, -161], [20, -161], [34, -138], [37, -118], [30, -128], [14, -150], [-10, -146], [-24, -118]];

  // Left points into the profile; right rests a flat hand on the table.
  const arm: Pt[] = isLeft
    ? [[22, -56], [56, -36], [68, -10], [46, -12], [26, -34]]
    : [[-24, -52], [-58, -32], [-70, -8], [-46, -10], [-22, -30]];

  const hand: Pt[] = isLeft
    ? [[62, -18], [84, -15], [86, -3], [60, -1]]
    : [[-64, -16], [-86, -12], [-86, 0], [-60, -1]];

  return (
    <g transform={`translate(${x},${TABLE_Y}) rotate(${lean * 7})`}>
      <g
        data-unfold-index={idx}
        data-unfold-kind="hinge"
        style={step(0)}
        id={`figure-${side}`}
      >
        <CutShape id={`figure-${side}-torso`} points={torso} fill={bodyFill} rng={rng} base={3.1} />
        <CutShape id={`figure-${side}-arm`} points={arm} fill={bodyFill} rng={rng} base={2.7} />
        <CutShape id={`figure-${side}-hand`} points={hand} fill={PAPER.sand} rng={rng} base={2.5} wobble={1.3} />
        <path
          id={`figure-${side}-neck`}
          d={wobbleRect(isLeft ? -9 : -8, isLeft ? -112 : -106, 18, 22, rng, 1.2, 2)}
          fill={PAPER.sand}
          {...ink(rng)}
        />
        <CutShape id={`figure-${side}-head`} points={head} fill={PAPER.sand} rng={rng} base={3} />
        <path
          id={`figure-${side}-hair`}
          d={pointsToPath(wobblePoints(hair, rng, 1.5))}
          fill={PAPER.ink}
          stroke="none"
        />
        {/* Faces: present and simple, and not the same face twice. */}
        <circle id={`figure-${side}-eye-left`} cx={isLeft ? -13 : -11} cy={isLeft ? -137 : -130} r={3.1} fill={PAPER.ink} />
        <circle id={`figure-${side}-eye-right`} cx={isLeft ? 9 : 12} cy={isLeft ? -139 : -131} r={3.1} fill={PAPER.ink} />
        <path
          id={`figure-${side}-mouth`}
          d={
            isLeft
              ? wobbleLine(-8, -123, 7, -124, rng, 2, 0.7)
              : wobbleLine(-6, -117, 9, -119, rng, 2, 0.7)
          }
          stroke={PAPER.ink}
          strokeWidth={2.1}
          fill="none"
        />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ *
 * M1
 * ------------------------------------------------------------------ */

export default function M1Scene({ className = "" }: { className?: string }) {
  const rng = useMemo(() => makeRng(seedFromString("m1-objects")), []);

  /* Computed once so the shadow and the face share exactly one cut edge. */
  const { profileD, noteLeftD, noteRightD, cupD, penD } = useMemo(() => {
    const r = makeRng(seedFromString("m1-object-shapes"));
    return {
      profileD: wobbleRect(-74, -34, 148, 68, r, 1.5, 4),
      noteLeftD: wobblePolygon([[-92, -30], [-2, -36], [-2, 30], [-88, 26]], r, 1.4),
      noteRightD: wobblePolygon([[-2, -36], [90, -30], [86, 26], [-2, 30]], r, 1.4),
      cupD: wobblePolygon([[-19, -20], [19, -22], [15, 20], [-15, 18]], r, 1.3),
      penD: wobblePolygon([[-66, -5], [50, -8], [50, 4], [-66, 6]], r, 1.1),
    };
  }, []);

  const table = useMemo(() => {
    const r = makeRng(seedFromString("m1-table"));
    return {
      top: wobblePolygon(
        [
          [148, TABLE_Y],
          [700, TABLE_Y],
          [744, TABLE_Y + 92],
          [104, TABLE_Y + 92],
        ],
        r,
        2,
      ),
      lip: wobbleLine(148, TABLE_Y, 700, TABLE_Y, r, 9, 1.6),
    };
  }, []);

  return (
    <div className={className}>
      <PaperScene
        seed="m1-needs-assessment"
        width={VIEW_W}
        height={VIEW_H}
        inset={INSET}
        unfoldAt={400}
        title="A flattened paper sheet with two cut-out figures seated upright across a table that has unfolded from the same sheet, a vacancy profile and an open notebook laid between them, two coffee cups and a pen resting on the paper."
      >
        {/* Layer 2 — table, hinged up from the sheet plane. */}
        <g transform={`translate(0,${TABLE_Y})`}>
          <g
            data-unfold-index={0}
            data-unfold-kind="hinge"
            style={step(0)}
            id="table"
          >
            <g transform={`translate(0,${-TABLE_Y})`}>
              <path id="table-top" d={table.top} fill={PAPER.cream} {...ink(rng, 0.5)} />
              <path
                id="table-lip"
                d={table.lip}
                fill="none"
                stroke={PAPER.ink}
                strokeWidth={2.2}
                opacity={0.5}
              />
            </g>
          </g>
        </g>

        {/* Layer 2 — figures, hinged from the same plane, leaning inward. */}
        <Figure x={276} lean={1} seed="m1-figure-left" bodyFill={PAPER.navy} idx={1} />
        <Figure x={576} lean={-1} seed="m1-figure-right" bodyFill={PAPER.teal} idx={2} />

        {/* Layer 3 — the working objects, 80ms apart. */}

        {/* Vacancy profile */}
        <g transform={`translate(258,${TABLE_Y + 44}) rotate(-4)`}>
          <g data-unfold-index={3} style={step(1)} id="vacancy-profile">
            <CutShadow id="vacancy-profile-shadow" d={profileD} />
            <path
              id="vacancy-profile-sheet"
              d={profileD}
              fill={PAPER.white}
              {...ink(rng, 0.3)}
            />
            <path
              id="vacancy-profile-heading"
              d={wobbleLine(-58, -18, 6, -19, rng, 3, 0.9)}
              stroke={PAPER.navy}
              strokeWidth={5}
              fill="none"
            />
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                id={`vacancy-profile-rule-0${i + 1}`}
                d={wobbleLine(-58, -2 + i * 13, i === 2 ? 22 : 56, -2 + i * 13, rng, 4, 0.8)}
                stroke={PAPER.ink}
                strokeWidth={2}
                fill="none"
                opacity={0.55}
              />
            ))}
          </g>
        </g>

        {/* Open notebook — two-page spread */}
        <g transform={`translate(470,${TABLE_Y + 50}) rotate(2)`}>
          <g data-unfold-index={4} style={step(2)} id="notebook">
            <CutShadow id="notebook-shadow-left" d={noteLeftD} />
            <CutShadow id="notebook-shadow-right" d={noteRightD} />
            <path
              id="notebook-page-left"
              d={noteLeftD}
              fill={PAPER.white}
              {...ink(rng, 0.3)}
            />
            <path
              id="notebook-page-right"
              d={noteRightD}
              fill={PAPER.white}
              {...ink(rng, 0.3)}
            />
            <path
              id="notebook-spine"
              d={wobbleLine(-2, -34, -2, 29, rng, 3, 0.8)}
              stroke={PAPER.ink}
              strokeWidth={2.6}
              fill="none"
            />
            {[0, 1, 2].map((i) => (
              <path
                key={`l${i}`}
                id={`notebook-rule-left-0${i + 1}`}
                d={wobbleLine(-78, -16 + i * 15, -14, -16 + i * 15, rng, 3, 0.7)}
                stroke={PAPER.ink}
                strokeWidth={1.9}
                fill="none"
                opacity={0.5}
              />
            ))}
            {[0, 1].map((i) => (
              <path
                key={`r${i}`}
                id={`notebook-rule-right-0${i + 1}`}
                d={wobbleLine(12, -14 + i * 15, 74, -14 + i * 15, rng, 3, 0.7)}
                stroke={PAPER.ink}
                strokeWidth={1.9}
                fill="none"
                opacity={0.5}
              />
            ))}
          </g>
        </g>

        {/* Coffee cups — one per figure */}
        {[
          { id: "coffee-cup-left", x: 334, delay: 3 },
          { id: "coffee-cup-right", x: 652, delay: 4 },
        ].map((cup) => (
          <g key={cup.id} transform={`translate(${cup.x},${TABLE_Y + 30})`}>
            <g data-unfold-index={cup.delay + 2} style={step(cup.delay)} id={cup.id}>
              <CutShadow id={`${cup.id}-shadow`} d={cupD} />
              <path
                id={`${cup.id}-body`}
                d={cupD}
                fill={PAPER.white}
                {...ink(rng, 0.3)}
              />
              <path
                id={`${cup.id}-handle`}
                d={wobblePolygon(
                  [[19, -12], [32, -8], [30, 6], [17, 8], [22, 1], [23, -6]],
                  rng,
                  1.2,
                )}
                fill="none"
                {...ink(rng)}
              />
              <path
                id={`${cup.id}-brew`}
                d={wobbleLine(-14, -14, 14, -16, rng, 3, 0.8)}
                stroke={PAPER.navyDeep}
                strokeWidth={4.5}
                fill="none"
              />
            </g>
          </g>
        ))}

        {/* Pen laid across the vacancy profile */}
        <g transform={`translate(272,${TABLE_Y + 62}) rotate(-13)`}>
          <g data-unfold-index={7} style={step(5)} id="pen">
            <CutShadow id="pen-shadow" d={penD} />
            <path
              id="pen-barrel"
              d={penD}
              fill={PAPER.teal}
              {...ink(rng)}
            />
            <path
              id="pen-nib"
              d={wobblePolygon([[50, -8], [72, -1], [50, 4]], rng, 1)}
              fill={PAPER.white}
              {...ink(rng)}
            />
            <path
              id="pen-clip"
              d={wobbleLine(-56, -4, -34, -5, rng, 2, 0.6)}
              stroke={PAPER.white}
              strokeWidth={2.6}
              fill="none"
            />
          </g>
        </g>
      </PaperScene>
    </div>
  );
}

export { SHEET_W, SHEET_H };
