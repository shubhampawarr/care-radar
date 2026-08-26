"use client";

/**
 * SECTION 2 — the milestones live inside the lattice.
 *
 * The seven anchors are real vertices of the graph, not markers placed over a
 * picture of one. The connection between two milestones is the shortest path
 * through the lattice between their vertices, routed at build time before the
 * graph was thinned, and it is drawn by a crest of light travelling along it.
 * That is the whole argument of this section: the lattice is the navigation.
 *
 * SCROLL SHAPE
 * Progress is dwelled, not linear. Each milestone holds for roughly a third of
 * its segment before the next connection starts to draw, so the reader gets a
 * beat to actually read the copy. A linear ramp across seven milestones reads as
 * a conveyor and nothing lands.
 */

import { useMemo, useRef, useState } from "react";
import { seedFromString } from "../surface";
import { ANCHOR_UV, buildLattice, nodeBudget } from "./lattice";
import {
  makeCamera,
  paintGlass,
  paintLattice,
  paintRefraction,
  projectNodes,
  type LatticeView,
} from "./render";
import { MILESTONES, type Milestone } from "./milestones";
import { FrameEdge } from "./FrameEdge";
import { clampStage, useStage, useStill, useViewport } from "./use-stage";

/* The number of stops is a property of the GEOMETRY, not of the copy: the
   lattice has one anchor per milestone and the choreography is timed against
   those anchors. Deriving it from the copy array would let a caller pass six
   milestones and silently desynchronise the labels from the nodes. */
const LAST = ANCHOR_UV.length - 1;

/**
 * Dwelled progress: p in 0..1 becomes a journey position in 0..LAST that rests
 * at each whole number. The plateau is the first 28% of each segment; the
 * remaining 54% carries the move and the last 18% settles.
 */
function dwell(p: number): number {
  const s = clampStage(p) * LAST;
  const i = Math.min(Math.floor(s), LAST - 1);
  const f = s - i;
  const e = f <= 0.28 ? 0 : f >= 0.82 ? 1 : (f - 0.28) / 0.54;
  return i + e * e * (3 - 2 * e);
}

/**
 * Copy is injected so this stage can serve both the exploration and the real
 * employer page without being forked. Every prop defaults to what the
 * exploration already showed, so /dev/crystal-exploration renders exactly as it
 * did before. Nothing about the geometry, the dwell timing, the lighting or the
 * camera is configurable — that is the design, and it is not up for
 * reinterpretation per host.
 */
export type StageJourneyProps = {
  simplified: boolean;
  /** One per lattice anchor. Must be ANCHOR_UV.length long. */
  milestones?: readonly Milestone[];
  /** Small label above the active milestone. */
  sectionLabel?: string;
  /** Accessible name for the section and its screen-reader heading. */
  ariaLabel?: string;
  /** Line under the progress rule. Receives the current and last ordinals. */
  progressNote?: (current: string, total: string) => string;
};

const DEFAULT_PROGRESS_NOTE = (current: string, total: string) =>
  `Milestone ${current} of ${total} · connection routed through the lattice`;

export default function StageJourney({
  simplified,
  milestones = MILESTONES,
  sectionLabel = "Section 2 — Journey lattice",
  ariaLabel = "Journey lattice",
  progressNote = DEFAULT_PROGRESS_NOTE,
}: StageJourneyProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const { w, h } = useViewport();

  /* Committed only when the whole number changes — at most seven state updates
     across the entire section, so scrolling never re-renders React. */
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const lattice = useMemo(
    () =>
      buildLattice(
        seedFromString("exploration-journey"),
        w,
        Math.max(h, 560),
        "journey",
        nodeBudget(w),
      ),
    [w, h],
  );

  useStage(
    sectionRef,
    canvasRef,
    ({ ctx, time, w: cw, h: ch, p }) => {
      const journey = dwell(p);
      const view: LatticeView = { time, journey, openness: 0, presence: 1 };

      /* The pieces are called directly rather than through paintPane so the
         projected points can be reused to place the DOM labels. Projecting
         twice would be both wasteful and — because of the ambient drift — very
         slightly wrong, with labels lagging their own nodes. */
      const cam = makeCamera(lattice, cw, ch, view);
      const pts = projectNodes(lattice, cam, time);
      paintGlass(ctx, cw, ch, 0);
      paintRefraction(ctx, cw, ch, time, 0.8);
      paintLattice(ctx, lattice, cam, view, pts);

      lattice.anchors.forEach((nodeIndex, m) => {
        const el = labelRefs.current[m];
        if (!el) return;
        const pt = pts[nodeIndex];
        const near = Math.max(0, 1 - Math.abs(journey - m));
        const passed = journey > m ? 1 : 0;
        const opacity = 0.16 + near * 0.84 * (1 - 0) + passed * 0.24;
        /* Clamped inward so a label on the last anchor cannot run off the
           right jamb of the frame. */
        const x = Math.min(Math.max(pt.x, 96), cw - 96);
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${(
          pt.y - 26 - near * 8
        ).toFixed(1)}px, 0) translate(-50%, -100%)`;
        el.style.opacity = Math.min(1, opacity).toFixed(3);
      });

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${(journey / LAST).toFixed(4)})`;
      }
    },
    !simplified,
    {
      /* Roughly one viewport of travel per milestone, plus a little. Below that
         the dwell at each node stops being long enough to read the line. */
      vh: 5.6,
      onProgress: (p) => {
        const next = Math.round(dwell(p));
        if (next === activeRef.current) return;
        activeRef.current = next;
        setActive(next);
      },
    },
  );

  useStill(
    canvasRef,
    (ctx, cw, ch) => {
      const view: LatticeView = { time: 8, journey: LAST, openness: 0, presence: 1 };
      const cam = makeCamera(lattice, cw, ch, view);
      const pts = projectNodes(lattice, cam, 8);
      paintGlass(ctx, cw, ch, 0);
      paintLattice(ctx, lattice, cam, view, pts);
    },
    simplified,
    [lattice],
  );

  const current = milestones[Math.min(active, LAST)];

  if (simplified) {
    return (
      <JourneyStack
        canvasRef={canvasRef}
        milestones={milestones}
        sectionLabel={sectionLabel}
        ariaLabel={ariaLabel}
      />
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      className="relative h-[100svh] w-full overflow-hidden bg-[#04121f]"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />
      <FrameEdge />

      {/* Node labels, tracking their own vertices every frame. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {milestones.map((m, i) => (
          <div
            key={m.no}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 whitespace-nowrap text-center will-change-transform"
            style={{ opacity: 0 }}
          >
            <span className="font-mono text-[10px] tracking-[0.24em] text-[#7fe3d6]">
              {m.no}
            </span>
            <span className="ml-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#e8f4f7]">
              {m.label}
            </span>
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(72% 56% at 8% 92%, rgba(4,18,31,0.95) 0%, rgba(4,18,31,0.84) 32%, rgba(4,18,31,0.44) 62%, rgba(4,18,31,0) 86%)",
        }}
      />

      <div className="relative flex h-full flex-col justify-end px-6 pb-12 md:px-14 md:pb-16">
        <div className="max-w-[34rem]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7fe3d6]">
            {sectionLabel}
          </p>
          <h2 className="mt-4 flex items-baseline gap-4 text-[1.7rem] font-semibold leading-[1.1] tracking-tight text-[#F4F7F7] md:text-[2.6rem]">
            <span className="font-mono text-[1rem] text-[#5f8ba0] md:text-[1.3rem]">
              {current.no}
            </span>
            {current.label}
          </h2>
          <p className="mt-4 min-h-[3.5rem] text-[15px] leading-7 text-[#B9CCD6] md:text-[17px] md:leading-8">
            {current.detail}
          </p>

          <div className="mt-7 h-px w-full max-w-[22rem] bg-white/12">
            <div
              ref={barRef}
              className="h-px origin-left bg-[#08a99d] will-change-transform"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#5d8296]">
            {progressNote(current.no, milestones[LAST].no)}
          </p>
        </div>
      </div>

      {/* The sequence is scroll-driven; the content is not. */}
      <div className="sr-only">
        <h2>{ariaLabel}</h2>
        <ol>
          {milestones.map((m) => (
            <li key={m.no}>
              {m.no} — {m.label}. {m.detail}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/**
 * Mobile and reduced motion: one still of the completed lattice, then the
 * milestones as a list.
 *
 * Deliberately not a shrunken version of the cinematic scroll. The point of the
 * section is that the milestones are connected and in order, and a list says
 * that on a phone better than a compressed choreography does.
 */
function JourneyStack({
  canvasRef,
  milestones,
  sectionLabel,
  ariaLabel,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  milestones: readonly Milestone[];
  sectionLabel: string;
  ariaLabel: string;
}) {
  return (
    <section aria-label={ariaLabel} className="relative bg-[#04121f]">
      <div className="relative h-[52svh] w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        />
        <FrameEdge />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(4,18,31,0) 40%, rgba(4,18,31,0.9) 100%)",
          }}
        />
      </div>
      <div className="px-6 pb-16 pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7fe3d6]">
          {sectionLabel}
        </p>
        <ol className="mt-6 space-y-5">
          {milestones.map((m) => (
            <li key={m.no} className="flex gap-4 border-t border-white/10 pt-5">
              <span className="shrink-0 font-mono text-[11px] tracking-[0.2em] text-[#5f8ba0]">
                {m.no}
              </span>
              <div>
                <p className="text-[15px] font-semibold text-[#F4F7F7]">
                  {m.label}
                </p>
                <p className="mt-1 text-[14px] leading-6 text-[#9fb6c2]">
                  {m.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
