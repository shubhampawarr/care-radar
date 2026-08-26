"use client";

/**
 * /dev/crystal-exploration — the prototype shell.
 *
 * Reading order down the page is deliberately the reading order of the argument:
 *
 *   glass (nothing on it yet)
 *     -> three ways the lattice could sit on it
 *       -> the milestones living inside the lattice
 *         -> the window opening
 *           -> the sky
 *             -> the aircraft
 *               -> the folded sheet
 *                 -> the six questions this page exists to answer
 *
 * Section 0 paints the pane with NO lattice on it. That empty pane is doing real
 * work: it establishes that the surface is glass before anything is printed on
 * it, so the lattice arrives as something applied to a window rather than as a
 * background that later gets a frame drawn around it.
 */

import { useCallback, useRef, useState } from "react";
import { useJourneyVariant } from "../PaperScene";
import { paintGlass, paintRefraction } from "./render";
import { MODE_COPY, REVIEW_QUESTIONS } from "./milestones";
import type { LatticeMode } from "./lattice";
import StageSystem from "./StageSystem";
import { FrameEdge } from "./FrameEdge";
import StageJourney from "./StageJourney";
import StageWindow from "./StageWindow";
import StageFlight from "./StageFlight";
import { useStill } from "./use-stage";

const NARRATIVE: readonly { step: string; note: string }[] = [
  { step: "User", note: "looking through, not at" },
  { step: "Window", note: "the controlled plane" },
  { step: "Crystalline system", note: "process, dependencies, structure" },
  { step: "Milestones", note: "real nodes in the graph" },
  { step: "The window opens", note: "at the point of international movement" },
  { step: "Sky", note: "possibility" },
  { step: "Airplane", note: "the international journey" },
  { step: "Paper plane", note: "the personal one" },
];

export default function ExplorationClient() {
  const [mode, setMode] = useState<LatticeMode>("journey");
  const systemRef = useRef<HTMLDivElement>(null);

  const choose = useCallback((next: LatticeMode) => {
    setMode(next);
    systemRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const { simplified } = useJourneyVariant();

  return (
    <div className="bg-[#04121f]">
      <IntroSection mode={mode} onChoose={choose} />

      <div ref={systemRef}>
        <StageSystem mode={mode} onModeChange={setMode} simplified={simplified} />
      </div>

      <StageJourney simplified={simplified} />
      <StageWindow simplified={simplified} />
      <StageFlight simplified={simplified} />

      <ClosingSection />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Section 0
 * ------------------------------------------------------------------ */

function IntroSection({
  mode,
  onChoose,
}: {
  mode: LatticeMode;
  onChoose: (m: LatticeMode) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Glass and its two refraction bands only. Painting the lattice here would
     answer the question the next section is meant to ask. */
  useStill(
    canvasRef,
    (ctx, w, h) => {
      paintGlass(ctx, w, h, 0);
      paintRefraction(ctx, w, h, 4, 1);
    },
    true,
    [],
  );

  return (
    <section
      aria-label="Crystal system exploration"
      className="relative min-h-[100svh] overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />
      <FrameEdge />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-6 py-28 md:px-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#7fe3d6]">
          Crystal system / Exploration
        </p>
        <h1 className="mt-6 max-w-[24ch] text-[2rem] font-semibold leading-[1.08] tracking-tight text-[#F4F7F7] md:text-[3.6rem]">
          Three interpretations of the crystalline process system.
        </h1>
        <p className="mt-6 max-w-[46rem] text-[15px] leading-7 text-[#B9CCD6] md:text-[17px] md:leading-8">
          Not a background behind the page. A lattice on the glass of a window —
          one controlled plane, sparse by construction, with the recruitment
          milestones living inside it as real nodes. Scroll to see the system
          assemble, the window open, and the journey continue past it.
        </p>

        <div className="mt-11">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#5d8296]">
            Choose an interpretation
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {MODE_COPY.map((c) => {
              const on = c.id === mode;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChoose(c.id)}
                  aria-pressed={on}
                  className={`group max-w-[22rem] flex-1 rounded-2xl border px-5 py-4 text-left transition ${
                    on
                      ? "border-[#08a99d]/60 bg-[#08a99d]/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#5d8296]">
                    {c.tag}
                  </span>
                  <span className="mt-2 block text-[15px] font-semibold uppercase tracking-[0.14em] text-[#F4F7F7]">
                    {c.title}
                  </span>
                  <span className="mt-2 block text-[13px] leading-6 text-[#9db6c3]">
                    {c.metaphor}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-14 font-mono text-[10px] uppercase tracking-[0.24em] text-[#3f6376]">
          Prototype · not production · desktop first
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Closing — what this page is for
 * ------------------------------------------------------------------ */

function ClosingSection() {
  return (
    <section
      aria-label="What this prototype is testing"
      className="relative bg-[#04121f] px-6 py-24 md:px-14 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#7fe3d6]">
          The spatial concept
        </p>

        <ol className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {NARRATIVE.map((n, i) => (
            <li key={n.step} className="bg-[#061a2a] px-5 py-6">
              <span className="font-mono text-[10px] tracking-[0.22em] text-[#5d8296]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-[15px] font-semibold text-[#F4F7F7]">
                {n.step}
              </p>
              <p className="mt-1.5 text-[13px] leading-6 text-[#93aebc]">
                {n.note}
              </p>
            </li>
          ))}
        </ol>

        <h2 className="mt-20 max-w-[26ch] text-[1.7rem] font-semibold leading-[1.14] tracking-tight text-[#F4F7F7] md:text-[2.4rem]">
          Six questions this prototype exists to answer.
        </h2>
        <p className="mt-4 max-w-[46rem] text-[15px] leading-7 text-[#B9CCD6]">
          None of these are settled. If a transition reads as forced, the fix is
          to simplify it rather than to add another effect on top of it.
        </p>

        <div className="mt-10 grid gap-x-12 gap-y-9 md:grid-cols-2">
          {REVIEW_QUESTIONS.map((r, i) => (
            <div key={r.q} className="border-t border-white/12 pt-5">
              <div className="flex gap-4">
                <span className="font-mono text-[11px] tracking-[0.2em] text-[#08a99d]">
                  Q{i + 1}
                </span>
                <div>
                  <p className="text-[16px] font-semibold leading-6 text-[#F4F7F7]">
                    {r.q}
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-[#93aebc]">
                    {r.note}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 border-t border-white/12 pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#5d8296]">
            Existing routes untouched · /dev/e4-crystal · /dev/e4-turn ·
            /dev/e4-m1 · /dev/e4-m4
          </p>
        </div>
      </div>
    </section>
  );
}
