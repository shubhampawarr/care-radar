"use client";

import { useMemo } from "react";
import PaperScene from "../PaperScene";
import {
  makeRng,
  PAPER,
  seedFromString,
  SHADOW_OFFSET,
  SHADOW_OPACITY,
  wobbleLine,
  wobblePolygon,
  wobbleRect,
} from "../paper";

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

function Figure({ x, lean, seed, bodyFill, idx }: FigureProps) {
  const rng = makeRng(seedFromString(seed));
  const side = lean === 1 ? "left" : "right";

  return (
    <g transform={`translate(${x},${TABLE_Y}) rotate(${lean * 7})`}>
      <g
        data-unfold-index={idx}
        data-unfold-kind="hinge"
        style={step(0)}
        id={`figure-${side}`}
      >
        {/* Torso — a cut shape, shoulders asymmetric so it is not a symbol. */}
        <path
          id={`figure-${side}-torso`}
          d={wobblePolygon(
            [
              [-52, 4],
              [-44, -74],
              [-20, -96],
              [22, -96],
              [48, -72],
              [56, 4],
            ],
            rng,
            1.7,
          )}
          fill={bodyFill}
          {...ink(rng, 0.4)}
        />
        {/* Forearm laid along the table edge — this is a working table, so the
            arms rest on it rather than gesturing. */}
        <path
          id={`figure-${side}-arm`}
          d={wobblePolygon(
            [
              [lean * 30, -62],
              [lean * 78, -18],
              [lean * 76, -2],
              [lean * 52, -4],
              [lean * 20, -40],
            ],
            rng,
            1.5,
          )}
          fill={bodyFill}
          {...ink(rng)}
        />
        {/* Hand */}
        <path
          id={`figure-${side}-hand`}
          d={wobblePolygon(
            [
              [lean * 74, -20],
              [lean * 94, -14],
              [lean * 96, 0],
              [lean * 74, 0],
            ],
            rng,
            1.2,
          )}
          fill={PAPER.sand}
          {...ink(rng)}
        />
        {/* Neck */}
        <path
          id={`figure-${side}-neck`}
          d={wobbleRect(-9, -112, 18, 22, rng, 1.1, 2)}
          fill={PAPER.sand}
          {...ink(rng)}
        />
        {/* Head */}
        <path
          id={`figure-${side}-head`}
          d={wobblePolygon(
            [
              [-30, -140],
              [-18, -164],
              [16, -166],
              [31, -146],
              [28, -116],
              [4, -104],
              [-24, -114],
            ],
            rng,
            1.6,
          )}
          fill={PAPER.sand}
          {...ink(rng, 0.4)}
        />
        {/* Hair — one flat cut shape, no gradient. */}
        <path
          id={`figure-${side}-hair`}
          d={wobblePolygon(
            [
              [-31, -140],
              [-20, -167],
              [17, -169],
              [33, -149],
              [22, -150],
              [2, -158],
              [-19, -150],
            ],
            rng,
            1.5,
          )}
          fill={PAPER.ink}
          stroke="none"
        />
        {/* Face: two eyes and a mouth. Simple, present, not expressive. */}
        <circle
          id={`figure-${side}-eye-left`}
          cx={-13}
          cy={-138}
          r={3.1}
          fill={PAPER.ink}
        />
        <circle
          id={`figure-${side}-eye-right`}
          cx={9}
          cy={-140}
          r={3.1}
          fill={PAPER.ink}
        />
        <path
          id={`figure-${side}-mouth`}
          d={wobbleLine(-8, -124, 7, -125, rng, 2, 0.7)}
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
  const { profileD, noteLeftD, noteRightD } = useMemo(() => {
    const r = makeRng(seedFromString("m1-object-shapes"));
    return {
      profileD: wobbleRect(-74, -34, 148, 68, r, 1.5, 4),
      noteLeftD: wobblePolygon([[-92, -30], [-2, -36], [-2, 30], [-88, 26]], r, 1.4),
      noteRightD: wobblePolygon([[-2, -36], [90, -30], [86, 26], [-2, 30]], r, 1.4),
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
              <path
                id={`${cup.id}-body`}
                d={wobblePolygon(
                  [[-19, -20], [19, -22], [15, 20], [-15, 18]],
                  rng,
                  1.3,
                )}
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
            <path
              id="pen-barrel"
              d={wobblePolygon(
                [[-66, -5], [50, -8], [50, 4], [-66, 6]],
                rng,
                1.1,
              )}
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
