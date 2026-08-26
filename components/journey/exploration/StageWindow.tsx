"use client";

/**
 * SECTION 3 — the window opens.
 *
 * HOW THIS IS PUT TOGETHER
 * The pane is painted into two leaf canvases that are each clipped to their half
 * of the stage. Both painters are handed the identical lattice and the identical
 * view, and paintPane is pure, so the two halves are the same image and the seam
 * between them is exact by construction — there is no second lattice, and no
 * chance of the halves drifting out of register as they move.
 *
 * The pane is NOT repainted every frame. It was, via an offscreen canvas and two
 * full-screen drawImage blits, and that measured at 64% of main-thread script
 * time on this stage while the other three stages sat near 1%. Since the pane
 * only changes with the opening and with a barely-perceptible ambient drift,
 * repaints are keyed on a quantised openness and a 12Hz clock, and the leaf
 * canvases simply hold their last image in between. Per frame this stage now
 * costs two style writes and the sky.
 *
 * The leaves themselves are DOM elements on real hinges: transform-origin at the
 * outer jamb, rotateY outward, under a perspective on the parent. So the glass
 * and the lattice printed on it travel together, on the compositor, at no
 * per-frame cost beyond two style writes.
 *
 * WHY IT OPENS OUTWARD
 * An inward-opening leaf — which is what a German Dreh-Kipp actually does —
 * swings toward the camera and blocks the view at precisely the moment the view
 * is the point. Outward is the honest cinematic choice and still a real window.
 *
 * WHAT MAKES IT NOT A GIMMICK
 * The frame has been on screen since the first stage, and the exterior light has
 * been sitting at the spot where the leaves part since the first frame painted.
 * By the time anything moves, the reader has been looking at a window for two
 * sections. The opening is a consequence, not a reveal.
 */

import { useMemo, useRef } from "react";
import { seedFromString } from "../surface";
import { buildLattice, nodeBudget } from "./lattice";
import { paintPane, paintSky, IDLE_VIEW } from "./render";
import { drawAircraft } from "./aircraft";
import { clampStage, useStage, useStill, useViewport } from "./use-stage";
import { FrameEdge } from "./FrameEdge";

/** Scroll keyframes. Named because the choreography is the deliverable here
 *  and it needs to be adjustable in one place during a review. */
const HOLD_END = 0.16;
const GIVE_END = 0.3;
const SWING_END = 0.74;

const smooth = (t: number): number => t * t * (3 - 2 * t);
const seg = (p: number, a: number, b: number): number =>
  clampStage((p - a) / (b - a));

/** Heavy casement: slow to start, decisive in the middle, slow to settle. */
const easeSwing = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

/** Maximum leaf angle. Past about 85 degrees the leaf is edge-on and becomes a
 *  hairline, which reads as it vanishing rather than as it having opened. */
const MAX_ANGLE = 84;

function fitCanvas(
  canvas: HTMLCanvasElement,
  w: number,
  h: number,
  dpr: number,
): CanvasRenderingContext2D | null {
  const dw = Math.round(w * dpr);
  const dh = Math.round(h * dpr);
  if (canvas.width !== dw || canvas.height !== dh) {
    canvas.width = dw;
    canvas.height = dh;
  }
  const ctx = canvas.getContext("2d");
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

/**
 * Copy is injected so this stage serves both the exploration and the production
 * employer page without being forked. Every field defaults to what the
 * exploration already showed, so /dev/crystal-exploration is unchanged. Nothing
 * about the choreography — the hinges, the sheen, the pane cache, the sky — is
 * configurable, because that is the design and it is not re-decided per host.
 */
export type WindowCopy = {
  ariaLabel: string;
  srDescription: string;
  /** Shown while the window is still shut. */
  before: { eyebrow: string; title: string; body: string };
  /** Shown once the leaves have parted. */
  after: { eyebrow: string; title: string; body: string };
  /** Mobile and reduced-motion fallback. */
  still: { eyebrow: string; title: string; body: string };
};

export const DEFAULT_WINDOW_COPY: WindowCopy = {
  ariaLabel: "Window transition",
  srDescription:
    "The crystalline lattice sits on the glass of a window. As the journey reaches the point of international movement, the window opens outward and the view passes from the recruitment system to the sky beyond it.",
  before: {
    eyebrow: "Section 3 — Window transition",
    title: "Up to here, the process is ours to run.",
    body: "Profile, matching, application, interview, visa. Seven milestones inside one system, and every one of them accountable to someone named.",
  },
  after: {
    eyebrow: "Beyond the process",
    title: "What happens next is a journey, not a procedure.",
    body: "Someone leaves one country and starts work in another. The system got them to the window. It does not get on the plane with them.",
  },
  still: {
    eyebrow: "Section 3 — Window transition",
    title: "Up to here, the process is ours to run.",
    body: "Seven milestones inside one system. At the point of international movement, the window opens and the view passes to what lies beyond it.",
  },
};

export type StageWindowProps = {
  simplified: boolean;
  copy?: WindowCopy;
};

export default function StageWindow({
  simplified,
  copy = DEFAULT_WINDOW_COPY,
}: StageWindowProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const leftLeaf = useRef<HTMLDivElement>(null);
  const rightLeaf = useRef<HTMLDivElement>(null);
  const leftCanvas = useRef<HTMLCanvasElement>(null);
  const rightCanvas = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const copyInRef = useRef<HTMLDivElement>(null);
  const copyOutRef = useRef<HTMLDivElement>(null);
  /** Identifies the pane currently sitting in the leaf canvases. */
  const paneKey = useRef("");

  const { w, h } = useViewport();

  /* Same seed and same mode as Section 2, so the lattice the reader was just
     reading is the lattice that now swings away. A different lattice here would
     silently break the continuity the whole sequence depends on. */
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
    skyRef,
    ({ ctx, time, w: cw, h: ch, p }) => {
      const give = smooth(seg(p, HOLD_END, GIVE_END));
      const swing = easeSwing(seg(p, GIVE_END, SWING_END));
      const through = smooth(seg(p, SWING_END, 1));
      const openness = clampStage(give * 0.18 + swing * 0.82);

      /* ---- sky, behind everything ---- */
      ctx.clearRect(0, 0, cw, ch);
      paintSky(ctx, cw, ch, time, clampStage(give * 0.3 + swing * 0.9));

      /* First sight of the aircraft, at the far end of the opening. It arrives
         here rather than in the next section so the handoff between the two is
         continuous — the reader never sees it appear, only sees that it is
         already there. */
      const planeIn = smooth(seg(p, 0.62, 0.94));
      if (planeIn > 0.01) {
        drawAircraft(ctx, {
          x: cw * 0.66,
          y: ch * 0.4,
          size: 5 + planeIn * 4 + through * 6,
          morph: 0,
          heading: -0.05,
          alpha: planeIn * 0.85,
          haze: 0.75,
        });
      }

      /* ---- the pane ----
         Openness is quantised to 24 steps across the whole swing, which is a
         sub-one-percent scale change per step and invisible, and the ambient
         drift is clocked at 12Hz against an amplitude of about a pixel. Between
         those the leaves keep the image they already hold. */
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const key = `${cw}x${ch}@${dpr}|${Math.round(openness * 24)}|${Math.floor(
        time * 12,
      )}`;
      if (key !== paneKey.current) {
        paneKey.current = key;
        /* One view object shared by both leaves: the same input to a pure
           painter is what guarantees the seam. */
        const paneView = { ...IDLE_VIEW, time, journey: 6, openness, presence: 1 };
        for (const ref of [leftCanvas, rightCanvas]) {
          const c = ref.current;
          if (!c) continue;
          const lctx = fitCanvas(c, cw, ch, dpr);
          if (!lctx) continue;
          lctx.clearRect(0, 0, cw, ch);
          paintPane(lctx, lattice, cw, ch, paneView);
        }
      }

      /* ---- hinges ---- */
      const angle = swing * MAX_ANGLE;
      const lift = give * 3;
      /* Reflectance climbs steeply toward grazing incidence, so a leaf turning
         away picks up more and more sky. Without this the leaves stay the dark
         interior-side glass they were when shut, and two dark slabs swinging
         open read as doors rather than as glazing. The exponent is what keeps
         it off the closed state and only arriving once the leaf is really
         angled. */
      const sheen = swing ** 1.6 * 0.62;
      if (leftLeaf.current) {
        leftLeaf.current.style.transform = `translateZ(${(swing * 40).toFixed(
          1,
        )}px) rotateY(${(angle + lift * 0.4).toFixed(2)}deg)`;
        /* Glass turning toward edge-on transmits more of what is behind it.
           Without this the leaves read as solid dark panels rather than as
           glazing with a lattice printed on it. */
        leftLeaf.current.style.opacity = (
          (1 - swing * 0.14) *
          (1 - through * 1.05)
        ).toFixed(3);
        leftLeaf.current.style.setProperty("--leaf-sheen", sheen.toFixed(3));
      }
      if (rightLeaf.current) {
        rightLeaf.current.style.transform = `translateZ(${(swing * 40).toFixed(
          1,
        )}px) rotateY(${(-angle - lift * 0.4).toFixed(2)}deg)`;
        rightLeaf.current.style.opacity = (
          (1 - swing * 0.14) *
          (1 - through * 1.05)
        ).toFixed(3);
        rightLeaf.current.style.setProperty("--leaf-sheen", sheen.toFixed(3));
      }

      /* The camera moves through the opening rather than the window growing:
         the whole scene scales about the point the leaves parted. */
      if (sceneRef.current) {
        sceneRef.current.style.transform = `scale(${(1 + through * 1.5).toFixed(3)})`;
      }

      if (copyOutRef.current) {
        /* Held through the swing. Leaving at 0.36 left a third of the stage
           with no words on it at all, and the opening is the illustration of
           this sentence — it should still be readable while it happens. */
        copyOutRef.current.style.opacity = (1 - smooth(seg(p, 0.36, 0.54))).toFixed(3);
      }
      if (copyInRef.current) {
        /* Held back until the leaves have actually parted. Earlier than this
           it lands on a leaf, and dark type on dark glass is unreadable at
           exactly the moment the sentence matters. */
        const inOp = smooth(seg(p, 0.7, 0.84)) * (1 - smooth(seg(p, 0.94, 1)));
        copyInRef.current.style.opacity = inOp.toFixed(3);
      }
    },
    !simplified,
    /* Long enough that the swing itself is unhurried. The opening is the single
       most falsifiable moment on the page and it must not feel flicked. */
    { vh: 3.6 },
  );

  useStill(
    skyRef,
    (ctx, cw, ch) => {
      paintSky(ctx, cw, ch, 6, 1);
      drawAircraft(ctx, {
        x: cw * 0.68,
        y: ch * 0.36,
        size: 9,
        morph: 0,
        heading: -0.05,
        alpha: 0.85,
        haze: 0.7,
      });
    },
    simplified,
    [],
  );

  if (simplified) {
    return <WindowStill skyRef={skyRef} copy={copy} />;
  }

  return (
    <section
      ref={sectionRef}
      aria-label={copy.ariaLabel}
      className="relative h-[100svh] w-full overflow-hidden bg-[#04121f]"
      style={{ perspective: "1500px", perspectiveOrigin: "62% 44%" }}
    >
      <canvas
        ref={skyRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />

      <div
        ref={sceneRef}
        aria-hidden="true"
        className="absolute inset-0 will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <Leaf
          side="left"
          leafRef={leftLeaf}
          canvasRef={leftCanvas}
          canvasStyle={{ width: "200%", left: 0 }}
        />
        <Leaf
          side="right"
          leafRef={rightLeaf}
          canvasRef={rightCanvas}
          canvasStyle={{ width: "200%", left: "-100%" }}
        />
      </div>

      {/* The outer frame does not move. The leaves move inside it, which is
          what tells the eye that the building stayed still and the window
          opened, rather than that the whole image transformed. */}
      <FrameEdge />

      <div className="pointer-events-none absolute inset-0 flex items-end px-6 pb-14 md:px-14 md:pb-20">
        <div className="relative w-full">
          <div
            ref={copyOutRef}
            className="absolute bottom-0 left-0 w-full max-w-[36rem]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7fe3d6]">
              {copy.before.eyebrow}
            </p>
            <h2 className="mt-4 text-[1.7rem] font-semibold leading-[1.14] tracking-tight text-[#F4F7F7] md:text-[2.6rem]">
              {copy.before.title}
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#B9CCD6] md:text-[17px] md:leading-8">
              {copy.before.body}
            </p>
          </div>

          {/* Centred, because by the time it appears the opening is in the
              middle of frame and that is the only part of the composition that
              is actually sky. */}
          <div
            ref={copyInRef}
            className="absolute bottom-0 left-1/2 w-full max-w-[34rem] -translate-x-1/2 text-center"
            style={{ opacity: 0 }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0b6f77]">
              {copy.after.eyebrow}
            </p>
            <h2 className="mt-4 text-[1.6rem] font-semibold leading-[1.14] tracking-tight text-[#0a2a3c] md:text-[2.3rem]">
              {copy.after.title}
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#1d4256] md:text-[16px] md:leading-8">
              {copy.after.body}
            </p>
          </div>
        </div>
      </div>

      <div className="sr-only">
        <h2>{copy.ariaLabel}</h2>
        <p>{copy.srDescription}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * One casement leaf
 * ------------------------------------------------------------------ */

function Leaf({
  side,
  leafRef,
  canvasRef,
  canvasStyle,
}: {
  side: "left" | "right";
  leafRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasStyle: React.CSSProperties;
}) {
  const isLeft = side === "left";
  return (
    <div
      ref={leafRef}
      className={`absolute top-0 h-full w-1/2 overflow-hidden will-change-transform ${
        isLeft ? "left-0" : "right-0"
      }`}
      style={{
        transformOrigin: isLeft ? "left center" : "right center",
        backfaceVisibility: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 h-full"
        style={canvasStyle}
        aria-hidden="true"
      />
      {/* Fixed sheen: light on the pane even when shut. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isLeft
            ? "linear-gradient(100deg, rgba(190,226,244,0.09) 0%, rgba(190,226,244,0) 42%)"
            : "linear-gradient(260deg, rgba(190,226,244,0.09) 0%, rgba(190,226,244,0) 42%)",
        }}
      />
      {/* Sky caught in the glass, driven from the render loop by --leaf-sheen.
          Brightest along the free edge, which is the part turned furthest from
          the viewer and therefore the part reflecting hardest. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: "var(--leaf-sheen, 0)",
          background: isLeft
            ? "linear-gradient(90deg, rgba(126,168,196,0.16) 0%, rgba(150,192,218,0.42) 62%, rgba(206,226,236,0.72) 100%)"
            : "linear-gradient(270deg, rgba(126,168,196,0.16) 0%, rgba(150,192,218,0.42) 62%, rgba(206,226,236,0.72) 100%)",
        }}
      />
      {/* Meeting stile — the leaf's own inner edge. When the two part, this is
          the join the eye watches separate. */}
      <div
        className={`pointer-events-none absolute inset-y-0 w-[3px] ${
          isLeft ? "right-0" : "left-0"
        }`}
        style={{
          background:
            "linear-gradient(90deg, rgba(22,48,63,0) 0%, #16303f 50%, rgba(22,48,63,0) 100%)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Mobile / reduced motion
 * ------------------------------------------------------------------ */

function WindowStill({
  skyRef,
  copy,
}: {
  skyRef: React.RefObject<HTMLCanvasElement | null>;
  copy: WindowCopy;
}) {
  return (
    <section aria-label={copy.ariaLabel} className="relative bg-[#04121f]">
      <div className="relative h-[56svh] w-full overflow-hidden">
        <canvas
          ref={skyRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        />
        <FrameEdge opacity={0.55} />
      </div>
      <div className="px-6 pb-14 pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7fe3d6]">
          {copy.still.eyebrow}
        </p>
        <h2 className="mt-4 text-[1.5rem] font-semibold leading-[1.16] tracking-tight text-[#F4F7F7]">
          {copy.still.title}
        </h2>
        <p className="mt-4 text-[15px] leading-7 text-[#B9CCD6]">
          {copy.still.body}
        </p>
      </div>
    </section>
  );
}
