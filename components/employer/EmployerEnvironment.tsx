"use client";

import { useEffect, useRef } from "react";
import {
  buildNetwork,
  compression,
  nodeAt,
  nodeBudget,
  ruleGap,
  THROAT_CENTRE,
  type EnvNetwork,
} from "./environment";

/**
 * One canvas behind E1–E3, holding one structural system in three states.
 *
 * WHY A SINGLE FIXED LAYER
 * The brief's failure mode is three independent animation systems that happen
 * to sit near each other. A viewport-fixed canvas makes the camera hold still
 * while the system transforms, which is what turns three sections into one
 * installation. It also means the geometry is never taller than a viewport, so
 * there are no seams to keep in register and no multi-thousand-pixel SVG.
 *
 * WHY THE PHASE COMES FROM THE SECTIONS
 * Progress is read from where the three sections actually sit — each carries a
 * `data-env-section` attribute and the loop interpolates between their centres.
 * A hand-tuned scroll fraction would need re-tuning every time a paragraph
 * changes length, and would be quietly wrong in between.
 *
 * COST
 * Around 56 nodes and 70 edges on a large display, twenty on a phone. Edges are
 * batched into two strokes, the rules are two lines. The loop is gated by an
 * IntersectionObserver on the page wrapper, and under reduced motion there is
 * no loop at all — it draws on scroll and stops.
 *
 * This layer is decoration in the strict sense: it is aria-hidden, it carries
 * no information the copy does not, and if the bundle never arrives the page is
 * unchanged apart from being plainer.
 */

/** Ink for the line work. The page's navy, never a new colour. */
const LINE = "8,38,74";
const NODE = "8,169,157";
const FACET = "8,169,157";

type Viewport = { w: number; h: number; dpr: number };

function drawFrame(
  ctx: CanvasRenderingContext2D,
  net: EnvNetwork,
  view: Viewport,
  phase: number,
  alpha: number,
  time: number,
  drift: number,
): void {
  const { w, h } = view;
  ctx.clearRect(0, 0, w, h);
  if (alpha <= 0.004) return;

  const squeeze = compression(phase);

  /* Positions for this frame. Drift is tiny and slow — the system should read
     as settled, not as floating. */
  const pts: [number, number][] = net.nodes.map((n) => {
    const [u, v] = nodeAt(n, phase);
    const wobble = drift * Math.sin(time * n.driftSpeed + n.driftPhase);
    return [(u + wobble * 0.004) * w, (v + wobble * 0.003) * h];
  });

  /* ---- facets ----
     They FADE as the field compresses. The first pass strengthened them, on the
     theory that closing material should thicken; in practice a compressed cell
     is a sliver, and a field of lit slivers reads as spiky noise. Surfaces
     closing up and disappearing is also the truer reading of a bottleneck —
     there is no room left for them. */
  const facetAlpha = alpha * 0.03 * (1 - squeeze * 0.8);
  if (facetAlpha > 0.003) {
    ctx.fillStyle = `rgba(${FACET},${facetAlpha.toFixed(4)})`;
    for (const [a, b, c] of net.facets) {
      ctx.beginPath();
      ctx.moveTo(pts[a][0], pts[a][1]);
      ctx.lineTo(pts[b][0], pts[b][1]);
      ctx.lineTo(pts[c][0], pts[c][1]);
      ctx.closePath();
      ctx.fill();
    }
  }

  /* ---- edges ----
     Faded by how far they have been stretched from their nominal length. This
     is what separates the two columns in the branched state: pairs that span
     the gap simply stop being drawn, so the field divides itself instead of
     being handed a second edge set. Two brightness buckets, two strokes. */
  const nominal = net.span * w;
  const near: number[] = [];
  const far: number[] = [];

  for (let i = 0; i < net.edges.length; i += 1) {
    const [a, b] = net.edges[i];
    const len = Math.hypot(pts[a][0] - pts[b][0], pts[a][1] - pts[b][1]);
    const stretch = (len - nominal * 1.25) / (nominal * 1.7);
    if (stretch >= 1) continue;
    if (stretch <= 0.35) near.push(i);
    else far.push(i);
  }

  const strokeBatch = (list: number[], strength: number) => {
    if (list.length === 0) return;
    ctx.beginPath();
    for (const i of list) {
      const [a, b] = net.edges[i];
      ctx.moveTo(pts[a][0], pts[a][1]);
      ctx.lineTo(pts[b][0], pts[b][1]);
    }
    ctx.strokeStyle = `rgba(${LINE},${(alpha * strength).toFixed(4)})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  /* Deliberately faint. These are the values the page can carry behind live
     type — anything heavier and the environment stops being an environment and
     starts competing with the headline it sits behind. */
  strokeBatch(far, 0.045);
  strokeBatch(near, 0.11);

  /* ---- the two constraint rules ----
     The one device that says "constrained" rather than merely "dense". They
     close on the throat as compression peaks and are gone either side of it. */
  if (squeeze > 0.02) {
    const gap = ruleGap(phase) * w;
    const cx = THROAT_CENTRE * w;
    for (const side of [-1, 1]) {
      const x = cx + gap * side;
      const grad = ctx.createLinearGradient(x, 0, x, h);
      /* The rules carry the whole bottleneck reading on their own, so they
         sit above the line work rather than inside its range. */
      const peak = (alpha * squeeze * 0.32).toFixed(4);
      grad.addColorStop(0, `rgba(${LINE},0)`);
      grad.addColorStop(0.22, `rgba(${LINE},${peak})`);
      grad.addColorStop(0.78, `rgba(${LINE},${peak})`);
      grad.addColorStop(1, `rgba(${LINE},0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
  }

  /* ---- nodes ---- */
  ctx.fillStyle = `rgba(${NODE},${(alpha * 0.4).toFixed(4)})`;
  for (let i = 0; i < net.nodes.length; i += 1) {
    if (!net.nodes[i].shown) continue;
    ctx.beginPath();
    ctx.arc(pts[i][0], pts[i][1], 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function EmployerEnvironment() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const root = canvas.parentElement;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let view: Viewport = { w: 0, h: 0, dpr: 1 };
    let ctx: CanvasRenderingContext2D | null = null;
    let net: EnvNetwork | null = null;
    let centres: number[] = [];
    let exitTop = Number.POSITIVE_INFINITY;

    const measure = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      view = { w, h, dpr };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      net = buildNetwork("careradar-employer-environment", nodeBudget(w), w < 700);

      /* Section centres in document space. Re-read on resize because German
         copy reflows a lot between breakpoints. */
      centres = [...document.querySelectorAll("[data-env-section]")].map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + window.scrollY + r.height / 2;
      });

      const exit = document.querySelector("[data-env-exit]");
      exitTop = exit
        ? exit.getBoundingClientRect().top + window.scrollY
        : Number.POSITIVE_INFINITY;
    };

    /** Where the reader is, expressed in section units. */
    const readPhase = (): number => {
      if (centres.length < 2) return 0;
      const focus = window.scrollY + view.h / 2;
      if (focus <= centres[0]) return 0;
      const last = centres.length - 1;
      if (focus >= centres[last]) return last;
      for (let i = 0; i < last; i += 1) {
        if (focus <= centres[i + 1]) {
          const t = (focus - centres[i]) / (centres[i + 1] - centres[i] || 1);
          return i + t;
        }
      }
      return last;
    };

    /** Faded out as the dark hand-off band arrives, which owns the screen from
     *  there down and must not have line work washed across it.
     *
     *  Measured against the band's distance from the TOP of the viewport, not
     *  the bottom. Measuring from the bottom meant a tall E3 pushed the band
     *  into range while the reader was still at the section's midpoint, so the
     *  environment had already faded to nothing by the time it reached the
     *  branched state it exists to show. */
    const readAlpha = (): number => {
      const distance = exitTop - window.scrollY;
      if (distance >= view.h * 0.7) return 1;
      if (distance <= 0) return 0;
      return distance / (view.h * 0.7);
    };

    measure();

    const paint = (time: number) => {
      if (!ctx || !net) return;
      /* Lighter on a phone. The same weight that reads as atmosphere across a
         1600px viewport reads as line work drawn over the paragraph when the
         text runs the full width of the screen. */
      const weight = view.w < 700 ? 0.62 : 1;
      drawFrame(
        ctx,
        net,
        view,
        readPhase(),
        readAlpha() * weight * (reduced ? 0.9 : 1),
        time,
        reduced ? 0 : 1,
      );
    };

    let raf: number | null = null;
    const start = performance.now();

    /* Continuous while visible for the ambient settle; a single coalesced draw
       per scroll when the reader has asked for reduced motion. */
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      paint((now - start) / 1000);
    };

    let queued = false;
    const onScrollStatic = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        paint(0);
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const visible = entry.isIntersecting;
          canvas.style.visibility = visible ? "visible" : "hidden";
          if (reduced) {
            if (visible) onScrollStatic();
            continue;
          }
          if (visible && raf === null) raf = requestAnimationFrame(loop);
          else if (!visible && raf !== null) {
            cancelAnimationFrame(raf);
            raf = null;
          }
        }
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(root);

    if (reduced) window.addEventListener("scroll", onScrollStatic, { passive: true });

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        measure();
        if (reduced) onScrollStatic();
      }, 180);
    };
    window.addEventListener("resize", onResize);

    paint(0);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScrollStatic);
      window.clearTimeout(resizeTimer);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
    />
  );
}
