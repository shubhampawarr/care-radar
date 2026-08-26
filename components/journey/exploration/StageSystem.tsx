"use client";

/**
 * SECTION 1 — the three interpretations, side by side in time.
 *
 * One canvas, one painter, three parameter sets. Switching modes dissolves
 * through zero rather than cutting, because a hard cut invites the client to
 * compare two stills; a dissolve invites them to compare two systems, which is
 * the actual question on the table.
 *
 * The readout in the corner is not decoration. The complaint about the current
 * process page is density, and the fastest way to have that conversation is to
 * put the counts on screen next to the picture they produce.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { seedFromString } from "../surface";
import { buildLattice, nodeBudget, type LatticeMode } from "./lattice";
import { IDLE_VIEW, paintPane } from "./render";
import { MODE_COPY } from "./milestones";
import { useStage, useStill, useViewport } from "./use-stage";
import { FrameEdge } from "./FrameEdge";

/** Milliseconds out, then milliseconds back in. Out is faster than in: the
 *  system should look like it takes a moment to form and no time to leave. */
const SWAP_OUT = 240;
const SWAP_IN = 520;

export type StageSystemProps = {
  mode: LatticeMode;
  onModeChange: (mode: LatticeMode) => void;
  simplified: boolean;
};

export default function StageSystem({
  mode,
  onModeChange,
  simplified,
}: StageSystemProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { w, h } = useViewport();

  /** Painted mode. Lags the requested one by SWAP_OUT so the dissolve has
   *  something to dissolve out of. */
  const [painted, setPainted] = useState<LatticeMode>(mode);
  const swapAt = useRef<number>(Number.NEGATIVE_INFINITY);

  useEffect(() => {
    if (mode === painted) return;
    swapAt.current = performance.now();
    const t = window.setTimeout(() => setPainted(mode), SWAP_OUT);
    return () => window.clearTimeout(t);
  }, [mode, painted]);

  const lattice = useMemo(
    () =>
      buildLattice(
        seedFromString(`exploration-${painted}`),
        w,
        Math.max(h, 560),
        painted,
        nodeBudget(w),
      ),
    [painted, w, h],
  );

  const copy = MODE_COPY.find((c) => c.id === mode) ?? MODE_COPY[0];

  useStage(
    sectionRef,
    canvasRef,
    ({ ctx, time, w: cw, h: ch, p }) => {
      const dt = performance.now() - swapAt.current;
      const presence =
        dt < SWAP_OUT
          ? 1 - dt / SWAP_OUT
          : Math.min(1, Math.max(0, (dt - SWAP_OUT) / SWAP_IN));
      paintPane(ctx, lattice, cw, ch, {
        ...IDLE_VIEW,
        time,
        /* A whisper of opening across the section: the frame light lifts as the
           reader nears the bottom, so the next stage is already implied. */
        openness: p * 0.06,
        presence,
      });
    },
    !simplified,
    /* Short. This section is for looking, not for travelling — the reader needs
       room to switch between the three, not a long ride through one. */
    { vh: 1.2 },
  );

  useStill(
    canvasRef,
    (ctx, cw, ch) => {
      paintPane(ctx, lattice, cw, ch, { ...IDLE_VIEW, time: 12 });
    },
    simplified,
    [lattice],
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Crystal system — three interpretations"
      className="relative h-[100svh] w-full overflow-hidden bg-[#04121f]"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />

      <FrameEdge />

      {/* Legibility scrim, weighted to the lower left where densityAt() has
          already thinned the lattice. Two devices agreeing rather than a
          scrim fighting the picture. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(78% 62% at 10% 88%, rgba(4,18,31,0.94) 0%, rgba(4,18,31,0.82) 34%, rgba(4,18,31,0.46) 62%, rgba(4,18,31,0) 85%)",
        }}
      />

      <div className="relative flex h-full flex-col justify-between px-6 pb-10 pt-24 md:px-14 md:pb-16 md:pt-28">
        <ModeSelector active={mode} onChange={onModeChange} />

        <div className="max-w-[38rem]">
          <motion.div
            key={copy.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7fe3d6]">
              {copy.tag} — {copy.title}
            </p>
            <h2 className="mt-4 text-[1.6rem] font-semibold leading-[1.16] tracking-tight text-[#F4F7F7] md:text-[2.5rem]">
              {copy.metaphor}
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-[#B9CCD6] md:text-[16px] md:leading-8">
              {copy.body}
            </p>
            <p className="mt-4 text-[12px] uppercase tracking-[0.16em] text-[#6f92a4]">
              Testing for — {copy.tests}
            </p>
          </motion.div>
        </div>
      </div>

      <Readout lattice={lattice} />
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Controls
 * ------------------------------------------------------------------ */

function ModeSelector({
  active,
  onChange,
}: {
  active: LatticeMode;
  onChange: (m: LatticeMode) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Lattice interpretation"
      className="inline-flex w-fit flex-wrap gap-1 rounded-full border border-white/10 bg-[#061a2a]/70 p-1 backdrop-blur-md"
    >
      {MODE_COPY.map((c) => {
        const on = c.id === active;
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(c.id)}
            className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition md:px-5 md:text-[12px] ${
              on
                ? "bg-[#08a99d] text-white"
                : "text-[#8fb0bf] hover:bg-white/5 hover:text-[#d6e9f0]"
            }`}
          >
            {c.title}
          </button>
        );
      })}
    </div>
  );
}

/** Counts, so density is a number in the conversation and not an adjective. */
function Readout({
  lattice,
}: {
  lattice: { nodes: unknown[]; edges: unknown[]; facets: unknown[] };
}) {
  return (
    <div className="pointer-events-none absolute bottom-6 right-6 hidden text-right md:block">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5d8296]">
        {lattice.nodes.length} nodes · {lattice.edges.length} edges ·{" "}
        {lattice.facets.length} facets
      </p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#3f6376]">
        single plane · no depth sort
      </p>
    </div>
  );
}
