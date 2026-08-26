"use client";

/**
 * Scroll and canvas plumbing shared by every stage on the exploration page.
 *
 * WHY GSAP PINNING AND NOT position: sticky
 * Sticky would be the lighter mechanism, and it is what this file used first.
 * It does not work in this codebase: globals.css sets `overflow-x: hidden` on
 * both html and body for mobile overflow safety, which makes body a scroll
 * container that never actually scrolls, and every descendant sticky element
 * silently stops sticking. The global Navbar has the same problem. Measured, not
 * assumed — the stage viewport scrolled away with the page while the canvas
 * carried on painting correctly, which is exactly what that bug looks like.
 *
 * So pinning goes through ScrollTrigger, as it already does in CrystalPhases.
 * ScrollTrigger pins by wrapping the element in a spacer it controls, which is
 * immune to the overflow rules above.
 *
 * WHY A rAF LOOP AND NOT SCROLL EVENTS
 * ScrollTrigger writes progress into a ref; the render loop reads it. Scroll
 * events arrive in bursts and stop between them, so a canvas driven directly off
 * them stutters and its ambient motion freezes the moment the user stops. One
 * rAF loop, gated by an IntersectionObserver so it costs nothing off screen,
 * paints on its own cadence. Nothing here ever sets React state, so scrolling
 * triggers no re-renders.
 */

import { useEffect, useRef, useState, type RefObject } from "react";

export type StageFrame = {
  /** 0..1 across the pinned scroll distance of the stage. */
  p: number;
  /** Seconds since the stage first painted. */
  time: number;
  ctx: CanvasRenderingContext2D;
  /** CSS pixels, not device pixels — the context is pre-scaled. */
  w: number;
  h: number;
};

export type StageOptions = {
  /** Pinned scroll distance, in viewport heights. */
  vh: number;
  /** Called when progress changes, for DOM the canvas cannot draw. */
  onProgress?: (p: number) => void;
};

const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);

export function useStage(
  sectionRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  draw: (frame: StageFrame) => void,
  enabled: boolean,
  options: StageOptions,
): void {
  /* Latest-callback refs, written in an effect rather than during render: the
     loops below are built once and must not be torn down every time a stage
     re-renders, but they still have to call the newest closure. */
  const drawRef = useRef(draw);
  const progressCb = useRef(options.onProgress);
  const vhRef = useRef(options.vh);
  useEffect(() => {
    drawRef.current = draw;
    progressCb.current = options.onProgress;
    vhRef.current = options.vh;
  });

  /** Written by ScrollTrigger, read by the render loop. */
  const progress = useRef(0);

  /* ---------------- pin ---------------- */
  useEffect(() => {
    if (!enabled) return;
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

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * vhRef.current}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          progressCb.current?.(self.progress);
        },
      });

      let t: number | undefined;
      const onResize = () => {
        window.clearTimeout(t);
        t = window.setTimeout(() => ScrollTrigger.refresh(), 200);
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
  }, [sectionRef, enabled]);

  /* ---------------- paint ---------------- */
  useEffect(() => {
    if (!enabled) return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    let w = 0;
    let h = 0;
    let ctx: CanvasRenderingContext2D | null = null;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (cw === 0 || ch === 0) return;
      w = cw;
      h = ch;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    let raf: number | null = null;
    const t0 = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!ctx || canvas.clientHeight !== h || canvas.clientWidth !== w) {
        size();
        if (!ctx) return;
      }
      drawRef.current({
        p: clamp01(progress.current),
        time: (now - t0) / 1000,
        ctx,
        w,
        h,
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && raf === null) {
            raf = requestAnimationFrame(frame);
          } else if (!e.isIntersecting && raf !== null) {
            cancelAnimationFrame(raf);
            raf = null;
          }
        }
      },
      { rootMargin: "15% 0px" },
    );
    io.observe(section);

    return () => {
      io.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [sectionRef, canvasRef, enabled]);
}

/** Debounced viewport size. Lattices are rebuilt from this, so it must not
 *  update on every resize tick. */
export function useViewport(): { w: number; h: number } {
  const [size, setSize] = useState({ w: 1440, h: 900 });

  useEffect(() => {
    const read = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    read();
    let t: number | undefined;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(read, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return size;
}

/**
 * Paints a canvas once, and again on resize.
 *
 * The still path for mobile and reduced motion. Same geometry and the same
 * painter as the animated stages — a different still, not a different picture.
 */
export function useStill(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  enabled: boolean,
  deps: readonly unknown[],
): void {
  const drawRef = useRef(draw);
  useEffect(() => {
    drawRef.current = draw;
  });

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawRef.current(ctx, w, h);
    };

    paint();
    let t: number | undefined;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(paint, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, enabled, ...deps]);
}

export { clamp01 as clampStage };
