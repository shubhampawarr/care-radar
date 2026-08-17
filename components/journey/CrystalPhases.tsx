"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useJourneyVariant } from "./PaperScene";
import {
  clamp01,
  facetAxisPhase,
  phaseTurnProgress,
  spreadFromMs,
  type TurnAxis,
} from "./surface";
import {
  buildCrystalBody,
  buildFrame,
  cellCountForViewport,
  css,
  GLOW,
  GROUND,
  makeCamera,
  type Camera,
  type CrystalBody,
} from "./crystal-body";

/* ------------------------------------------------------------------ *
 * CrystalPhases — one crystalline body, fracturing under scroll.
 *
 * WHAT THIS IS
 * A vertical slice presented from a much deeper crystal, matched to
 * reference/blue-crystal-target.png: a dense triangulated mass on a near-black
 * navy ground, lit hard from the upper left, with bright cut lines and hard
 * selective glints where edges converge.
 *
 * The facets are cells of ONE fractured rectangle, and each cell is a shallow
 * pyramid fan-triangulated from a raised apex. The cell is what hinges; its
 * triangles are internal faceting and never move independently. That is what
 * gives many small facets at many orientations while the body stays one piece.
 *
 * WHAT IS RETAINED
 * The scroll architecture is unchanged: the same ScrollTrigger pin, the same
 * phaseTurnProgress timeline with its edge-on hold, the same PhaseTransition
 * API of axis + spreadMs, the same panel fade schedule, the same reduced-motion
 * and mobile fallbacks, and the copy and layout untouched.
 * ------------------------------------------------------------------ */

export type Phase = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
};

export type PhaseTransition = {
  axis: TurnAxis;
  spreadMs: number;
};

export type CrystalPhasesProps = {
  seed: string;
  phases: readonly [Phase, Phase, Phase];
  transitions: readonly [PhaseTransition, PhaseTransition];
};

/** Scroll distance per transition. */
const VH_PER_TRANSITION = 3;
/** Text drifts left by at most this much. */
const TEXT_DRIFT = 26;

function PhaseCopy({ phase }: { phase: Phase }) {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7fe3d6]">
        {phase.eyebrow}
      </p>
      <h2 className="mt-4 text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-[#F4F7F7] md:text-[2.75rem]">
        {phase.title}
      </h2>
      <p className="mt-5 max-w-[34rem] text-[15px] leading-7 text-[#C6D6DC] md:text-[17px] md:leading-8">
        {phase.body}
      </p>
    </>
  );
}

/** Opaque panel — copy never sits directly on translucent facets. */
function Panel({
  children,
  refObj,
  id,
}: {
  children: ReactNode;
  refObj: React.RefObject<HTMLDivElement | null>;
  id: string;
}) {
  return (
    <div
      ref={refObj}
      data-phase-panel={id}
      className="absolute left-1/2 top-1/2 w-[min(92vw,44rem)] -translate-x-1/2 -translate-y-1/2"
    >
      {/* Not a card. An edgeless scrim that reads as the crystal deepening
          behind the copy — the type sits inside the material rather than on a
          panel floating over it. Background and text still fade on separate
          schedules so copy is never rendered over bare translucent facets. */}
      <div
        data-panel-bg=""
        className="pointer-events-none absolute -inset-x-[85%] -inset-y-[190%]"
        style={{
          background:
            "radial-gradient(46% 34% at 34% 50%, rgba(3,20,32,0.95) 0%, rgba(3,20,32,0.91) 26%, rgba(3,20,32,0.78) 44%, rgba(3,20,32,0.5) 60%, rgba(3,20,32,0.2) 76%, rgba(3,20,32,0) 90%)",
        }}
      />
      <div data-panel-text="" className="relative px-7 py-8 md:px-10 md:py-10">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Rendering
 * ------------------------------------------------------------------ */

/**
 * The ground the crystal sits in.
 *
 * Near-black navy with a cold bloom set upper-left of centre, behind the mass
 * and agreeing with the key light. The reference reads as a bright crystal on a
 * dark field; painting a bright ground and darkening the facets against it is
 * the same picture inverted, and it is why the previous pass looked like pale
 * glass rather than crystal.
 */
function paintGround(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  openness: number,
) {
  ctx.fillStyle = css(GROUND);
  ctx.fillRect(0, 0, w, h);

  // Must agree with keyFalloff(): the bloom behind the mass and the light on
  // its facets are the same source, so they cannot sit in different places.
  const cx = w * 0.63;
  const cy = h * 0.3;
  const r = Math.max(w, h) * 0.78;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  // Swells slightly as the body opens: more of the interior is exposed.
  g.addColorStop(0, css(GLOW, 0.5 + openness * 0.14));
  g.addColorStop(0.45, css(GLOW, 0.2));
  g.addColorStop(1, css(GLOW, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/** Edge brightness buckets. Batching lets ~1,400 cut lines cost a handful of
 *  strokes per frame instead of one stroke each. */
const EDGE_BUCKETS = 6;

/**
 * One frame.
 *
 * Faces first, back to front, so the interior mass reads behind the presented
 * facets. Then the cut lines additively, so crossings and clusters build up the
 * way converging edges do in the reference. Then the glints last.
 */
function drawFrame(
  ctx: CanvasRenderingContext2D,
  body: CrystalBody,
  cam: Camera,
  w: number,
  h: number,
  turn: number,
  axis: TurnAxis,
  spread: number,
) {
  const openness = Math.sin(clamp01(turn) * Math.PI);
  paintGround(ctx, w, h, openness);

  const frame = buildFrame(
    body,
    cam,
    turn,
    (u, v) =>
      facetAxisPhase(axis, u * body.width, v * body.height, body.width, body.height),
    spread,
  );

  ctx.globalCompositeOperation = "source-over";
  for (const f of frame.faces) {
    ctx.beginPath();
    ctx.moveTo(f.pts[0].x, f.pts[0].y);
    ctx.lineTo(f.pts[1].x, f.pts[1].y);
    ctx.lineTo(f.pts[2].x, f.pts[2].y);
    ctx.closePath();
    ctx.fillStyle = css(f.rgb);
    ctx.fill();
  }

  /* Additive, so the cut lines read as light rather than as ink. Where many
     edges converge the accumulation itself produces the bright node, which is
     how the reference's stars are made. */
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";

  for (let b = 0; b < EDGE_BUCKETS; b += 1) {
    const lo = b / EDGE_BUCKETS;
    const hi = (b + 1) / EDGE_BUCKETS;
    const mid = (lo + hi) / 2;

    ctx.beginPath();
    let any = false;
    for (const e of frame.edges) {
      if (e.power < lo || e.power >= hi) continue;
      ctx.moveTo(e.ax, e.ay);
      ctx.lineTo(e.bx, e.by);
      any = true;
    }
    if (!any) continue;

    ctx.strokeStyle = css([0.62 + mid * 0.36, 0.83 + mid * 0.16, 0.94 + mid * 0.06]);
    ctx.globalAlpha = 0.02 + Math.pow(mid, 2.2) * 0.92;
    ctx.lineWidth = 0.3 + Math.pow(mid, 1.6) * 1.7;
    ctx.stroke();
  }

  // Hard, selective stars where a fan converges under the key.
  for (const g of frame.glints) {
    const r = 5 + g.power * 26;
    const rg = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, r);
    rg.addColorStop(0, `rgba(255,255,255,${(g.power * 0.7).toFixed(3)})`);
    rg.addColorStop(0.3, `rgba(196,232,246,${(g.power * 0.22).toFixed(3)})`);
    rg.addColorStop(1, "rgba(150,205,232,0)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(g.x, g.y, r, 0, Math.PI * 2);
    ctx.fill();

    const arm = r * 1.5;
    ctx.strokeStyle = `rgba(235,248,255,${(g.power * 0.5).toFixed(3)})`;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(g.x - arm, g.y);
    ctx.lineTo(g.x + arm, g.y);
    ctx.moveTo(g.x, g.y - arm * 0.72);
    ctx.lineTo(g.x, g.y + arm * 0.72);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function CrystalPhases({
  seed,
  phases,
  transitions,
}: CrystalPhasesProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const staticCanvases = useRef<(HTMLCanvasElement | null)[]>([]);
  const panel0Ref = useRef<HTMLDivElement>(null);
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);

  // Below 768px and under reduced motion: no pin, no fracture. Phases stack
  // and scroll normally, and the crystal renders as a still of the same body.
  const { isMobile, reducedMotion, isClient } = useJourneyVariant();
  const staticPath = isMobile || reducedMotion || !isClient;

  const [viewport, setViewport] = useState({ w: 1440, h: 900 });

  useEffect(() => {
    const read = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    read();
    let t: number | undefined;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(read, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const body = useMemo(
    () =>
      buildCrystalBody(
        seedFromStringLocal(seed),
        viewport.w,
        viewport.h,
        cellCountForViewport(viewport.w),
      ),
    [seed, viewport.w, viewport.h],
  );

  const camera = useMemo(
    () => makeCamera(viewport.w, viewport.h),
    [viewport.w, viewport.h],
  );

  /* Scroll writes here; the render loop reads it. Decoupling the two is what
     keeps painting continuous — the canvas repaints on its own cadence
     regardless of how scroll events arrive. */
  const progressRef = useRef(0);

  const sizeCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || viewport.w;
      const h = canvas.clientHeight || viewport.h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, w, h };
    },
    [viewport.w, viewport.h],
  );

  /* ---------------- static still (mobile / reduced motion) ---------------- */
  useEffect(() => {
    if (!staticPath) return;
    staticCanvases.current.forEach((canvas, i) => {
      if (!canvas) return;
      const { ctx, w, h } = sizeCanvas(canvas);
      if (!ctx) return;
      const cam = { ...camera, cx: w / 2, cy: h / 2 };
      // Each section holds the same body at a slightly different rest state,
      // so the object stays continuous down the page without animating.
      drawFrame(ctx, body, cam, w, h, i * 0.05, transitions[0].axis, 0.2);
    });
  }, [staticPath, body, camera, sizeCanvas, transitions]);

  /* ---------------- pinned render loop ---------------- */
  useEffect(() => {
    if (staticPath) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    let sized = sizeCanvas(canvas);
    let raf: number | null = null;
    const t0 = performance.now();

    const frame = (now: number) => {
      const { ctx, w, h } = sized;
      if (ctx) {
        const time = (now - t0) / 1000;
        const T = progressRef.current;
        const which = T < 0.5 ? 0 : 1;
        const p = clamp01(which === 0 ? T * 2 : (T - 0.5) * 2);
        const cfg = transitions[which];

        /* The only ambient motion. The camera breathes by about half a degree
           over ~50 seconds; the crystal itself never moves at rest. Moving the
           observer rather than the object is both more physical and far less
           distracting than animating the material. */
        const cam: Camera = {
          ...camera,
          cx: w / 2,
          cy: h / 2,
          yaw: camera.yaw + Math.sin(time * 0.126) * 0.011,
          pitch: camera.pitch + Math.cos(time * 0.098) * 0.006,
        };

        drawFrame(
          ctx,
          body,
          cam,
          w,
          h,
          phaseTurnProgress(p),
          cfg.axis,
          spreadFromMs(cfg.spreadMs),
        );
      }
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && raf === null) raf = requestAnimationFrame(frame);
          else if (!e.isIntersecting && raf !== null) {
            cancelAnimationFrame(raf);
            raf = null;
          }
        }
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(section);

    let rt: number | undefined;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => {
        sized = sizeCanvas(canvas);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      window.clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [staticPath, body, camera, sizeCanvas, transitions]);

  /* Copy schedule. Unchanged: copy leaves by p=0.40 and the panel clears at
     0.45, so nothing is on screen across the edge-on hold. Arriving, the panel
     lands at 0.80 and the copy follows from 0.85. */
  const applyCopy = useCallback((T: number) => {
    const which = T < 0.5 ? 0 : 1;
    const p = clamp01(which === 0 ? T * 2 : (T - 0.5) * 2);

    const textOut = 1 - clamp01((p - 0.15) / 0.25);
    const bgOut = 1 - clamp01((p - 0.4) / 0.05);
    const bgIn = clamp01((p - 0.8) / 0.05);
    const textIn = clamp01((p - 0.85) / 0.15);

    const set = (idx: 0 | 1 | 2, textO: number, bgO: number) => {
      const el =
        idx === 0
          ? panel0Ref.current
          : idx === 1
            ? panel1Ref.current
            : panel2Ref.current;
      if (!el) return;
      const bg = el.querySelector<HTMLElement>("[data-panel-bg]");
      const tx = el.querySelector<HTMLElement>("[data-panel-text]");
      el.style.visibility = bgO <= 0.002 && textO <= 0.002 ? "hidden" : "visible";
      if (bg) bg.style.opacity = bgO.toFixed(3);
      if (tx) tx.style.opacity = textO.toFixed(3);
      el.style.transform = `translate(calc(-50% + ${(-TEXT_DRIFT * (1 - textO)).toFixed(1)}px), -50%)`;
    };

    set(0, which === 0 ? textOut : 0, which === 0 ? bgOut : 0);
    set(1, which === 0 ? textIn : textOut, which === 0 ? bgIn : bgOut);
    set(2, which === 1 ? textIn : 0, which === 1 ? bgIn : 0);
  }, []);

  /* ---------------- pinned sequence ---------------- */
  useEffect(() => {
    if (staticPath) return;
    const section = sectionRef.current;
    if (!section) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      applyCopy(0);

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () =>
          `+=${window.innerHeight * VH_PER_TRANSITION * transitions.length}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          applyCopy(self.progress);
        },
      });

      let t: number | undefined;
      const onResize = () => {
        window.clearTimeout(t);
        t = window.setTimeout(() => ScrollTrigger.refresh(), 150);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        window.clearTimeout(t);
        window.removeEventListener("resize", onResize);
        st.kill();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [staticPath, transitions, applyCopy]);

  /* ---------------- static stack (mobile / reduced motion) ---------------- */
  if (staticPath) {
    return (
      <section aria-label="CareRadar phases" className="relative">
        {phases.map((phase, i) => (
          <div key={phase.id} className="relative overflow-hidden bg-[#041826]">
            <canvas
              ref={(el) => {
                staticCanvases.current[i] = el;
              }}
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            />
            <div className="relative flex min-h-[78svh] items-center px-6 py-24">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 70% at 40% 50%, rgba(3,20,32,0.95) 0%, rgba(3,20,32,0.9) 34%, rgba(3,20,32,0.72) 58%, rgba(3,20,32,0.42) 82%, rgba(3,20,32,0.2) 100%)",
                }}
              />
              <div className="relative w-full max-w-xl">
                <PhaseCopy phase={phase} />
              </div>
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="CareRadar phases"
      className="relative h-screen w-full overflow-hidden bg-[#050B13]"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0">
        {phases.map((phase, i) => (
          <Panel
            key={phase.id}
            id={phase.id}
            refObj={i === 0 ? panel0Ref : i === 1 ? panel1Ref : panel2Ref}
          >
            <PhaseCopy phase={phase} />
          </Panel>
        ))}
      </div>

      {/* Stable reading order for assistive tech — the visual sequence is
          scroll-driven, the content is not. */}
      <div className="sr-only">
        {phases.map((p) => (
          <div key={p.id}>
            <h2>{p.title}</h2>
            <p>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Local copy so this module does not import the paper-side helper set. */
function seedFromStringLocal(source: string): number {
  let hash = 2166136261;
  for (let i = 0; i < source.length; i += 1) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
