"use client";

/**
 * SECTIONS 4 AND 5 — one continuous flight.
 *
 * Built as a single stage rather than two, because the whole argument of this
 * half of the page is that nothing is cut. The airliner that appeared at the end
 * of the window stage grows here, simplifies here, and carries the remaining
 * milestones here, without the reader ever seeing a boundary.
 *
 * THE CAMERA PANS, THE PLANE DOES NOT RACE
 * Once the paper plane exists it stays near the middle of frame and the world
 * moves past it. That is how flight actually reads, and it is also the only way
 * five stops each get the full width of the viewport to be read in. A plane
 * flying left to right past fixed markers gives each stop a fifth of the screen
 * and none of them land.
 */

import { useMemo, useRef, useState } from "react";
import { PAPER } from "../surface";
import { drawAircraft, drawContrail } from "./aircraft";
import { paintSky } from "./render";
import { FLIGHT_STOPS, type FlightStop } from "./milestones";
import { clampStage, useStage, useStill, useViewport } from "./use-stage";

/** Where the morph runs. Before it, an aircraft; after it, a folded sheet. */
const MORPH_START = 0.46;
const MORPH_END = 0.68;

const smooth = (t: number): number => t * t * (3 - 2 * t);
const seg = (p: number, a: number, b: number): number =>
  clampStage((p - a) / (b - a));

/** Piecewise linear track through hand-set keyframes. Reads as a timeline in
 *  source, which is what a scroll choreography needs to be during review. */
function track(p: number, keys: readonly (readonly [number, number])[]): number {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i += 1) {
    const [pa, va] = keys[i];
    const [pb, vb] = keys[i + 1];
    if (p <= pb) {
      const t = (p - pa) / (pb - pa || 1);
      return va + (vb - va) * smooth(t);
    }
  }
  return keys[keys.length - 1][1];
}

/** How far the world has travelled past the plane, in viewport widths. */
const STOP_SPREAD = 2.4;

/**
 * Copy is injected, defaulting to the exploration's own strings so
 * /dev/crystal-exploration renders exactly as before. The flight stops are data
 * rather than decoration: their `at` positions drive where the markers sit on
 * the route line, so a host supplying its own stops is supplying choreography
 * input, not just words.
 */
export type FlightCopy = {
  ariaLabel: string;
  /** Distant airliner. */
  approach: { eyebrow: string; title: string; body: string };
  /** The morph. */
  morph: { eyebrow: string; title: string; body: string };
  /** Paper plane navigating the stops. */
  navigator: { eyebrow: string; fallbackLabel: string; fallbackDetail: string };
  stops: readonly FlightStop[];
  /** Mobile and reduced-motion fallback. */
  still: { eyebrow: string; title: string };
};

export const DEFAULT_FLIGHT_COPY: FlightCopy = {
  ariaLabel: "Airplane and paper plane",
  approach: {
    eyebrow: "Section 4 — Airplane",
    title: "Six thousand kilometres, and one of them is a person.",
    body: "Far enough away to be a mark in the sky. Close enough to be the only thing in the frame that is moving.",
  },
  morph: {
    eyebrow: "Section 5 — Paper plane",
    title: "The nearer it gets, the less of it there is.",
    body: "Detail falls away from the tail forward until what is left is a folded sheet — the same journey, at the scale a person holds it.",
  },
  navigator: {
    eyebrow: "Paper plane as navigator",
    fallbackLabel: "Departure",
    fallbackDetail:
      "The remaining milestones pass the plane rather than the plane passing them.",
  },
  stops: FLIGHT_STOPS,
  still: {
    eyebrow: "Sections 4 and 5 — Airplane to paper plane",
    title: "The nearer it gets, the less of it there is.",
  },
};

export type StageFlightProps = {
  simplified: boolean;
  copy?: FlightCopy;
};

export default function StageFlight({
  simplified,
  copy = DEFAULT_FLIGHT_COPY,
}: StageFlightProps) {
  const stops = copy.stops;
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stopRefs = useRef<(HTMLDivElement | null)[]>([]);
  const copyARef = useRef<HTMLDivElement>(null);
  const copyBRef = useRef<HTMLDivElement>(null);
  const copyCRef = useRef<HTMLDivElement>(null);
  const { w } = useViewport();

  const [stop, setStop] = useState(-1);
  const stopRef = useRef(-1);

  /* Scale the whole scene down on smaller screens: a 96px paper plane on a
     1024px viewport is a different composition from the same plane on 1920. */
  const gauge = useMemo(() => clampStage(w / 1600) * 0.45 + 0.55, [w]);

  useStage(
    sectionRef,
    canvasRef,
    ({ ctx, time, w: cw, h: ch, p }) => {
      const morph = smooth(seg(p, MORPH_START, MORPH_END));
      const cruise = seg(p, MORPH_END, 1);

      ctx.clearRect(0, 0, cw, ch);
      paintSky(ctx, cw, ch, time, 1);

      /* As the aircraft becomes paper the light warms very slightly. Two
         materials in one frame have to agree about the light or the paper reads
         as pasted on rather than as being in the sky. */
      if (morph > 0.01) {
        ctx.save();
        ctx.globalAlpha = morph * 0.16;
        ctx.fillStyle = PAPER.cream;
        ctx.fillRect(0, 0, cw, ch);
        ctx.restore();
      }

      const size =
        track(p, [
          [0, 7],
          [0.22, 15],
          [0.46, 72],
          [0.62, 98],
          [1, 94],
        ]) * gauge;

      const x =
        cw *
        track(p, [
          [0, 0.68],
          [0.22, 0.6],
          [0.46, 0.52],
          [0.68, 0.46],
          [1, 0.46],
        ]);
      const y =
        ch *
          track(p, [
            [0, 0.38],
            [0.22, 0.4],
            [0.46, 0.45],
            [0.68, 0.47],
            [1, 0.44],
          ]) +
        Math.sin(time * 0.55) * (2 + morph * 5);

      /* Bank settles as the shape resolves: the airliner is seen in a shallow
         climb, the paper plane sits almost level with a slow rocking. */
      const heading =
        -0.07 * (1 - morph) + Math.sin(time * 0.42) * 0.035 * morph;

      /* Clear of the aircraft's own span. At 0.36 the line ran straight
         through the airframe and every stop label landed on top of it. */
      const routeY = y + size * 0.8;

      /* ---- route line, drawn only once the plane is doing navigation ---- */
      if (cruise > 0.001) {
        ctx.save();
        ctx.globalAlpha = smooth(clampStage(cruise * 5)) * 0.4;
        ctx.strokeStyle = PAPER.ink;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 9]);
        ctx.beginPath();
        ctx.moveTo(0, routeY);
        ctx.lineTo(cw, routeY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      /* ---- stop markers ----
         Crystalline nodes, deliberately. The milestones did not stop being
         nodes when the window opened; they just stopped being on glass. */
      let reached = -1;
      stops.forEach((s, i) => {
        const el = stopRefs.current[i];
        const sx = cw * ((s.at - cruise) * STOP_SPREAD + 0.46);
        const near = Math.max(0, 1 - Math.abs(sx - x) / (cw * 0.34));
        const visible = cruise > 0.001 && sx > -cw * 0.2 && sx < cw * 1.2;
        if (sx <= x + cw * 0.02 && cruise > 0.001) reached = i;

        if (el) {
          /* Faded out near the jambs rather than clamped inward. Clamping
             detaches a label from the marker it names, which reads as a bug;
             a label leaving the frame reads as the world moving past. */
          const margin = clampStage((cw - Math.abs(sx - cw / 2) * 2) / 240);
          el.style.transform = `translate3d(${sx.toFixed(1)}px, ${routeY.toFixed(
            1,
          )}px, 0) translate(-50%, 0)`;
          el.style.opacity = visible
            ? ((0.2 + near * 0.8) * margin).toFixed(3)
            : "0";
        }

        if (!visible) return;
        ctx.save();
        ctx.globalAlpha = 0.25 + near * 0.75;
        ctx.strokeStyle = PAPER.ink;
        ctx.lineWidth = 1.2;
        const r = 4 + near * 3;
        // A small diamond: the lattice node, carried into the sky.
        ctx.beginPath();
        ctx.moveTo(sx, routeY - r);
        ctx.lineTo(sx + r, routeY);
        ctx.lineTo(sx, routeY + r);
        ctx.lineTo(sx - r, routeY);
        ctx.closePath();
        ctx.stroke();
        if (near > 0.6) {
          ctx.fillStyle = "#08a99d";
          ctx.globalAlpha = (near - 0.6) / 0.4;
          ctx.fill();
        }
        ctx.restore();
      });

      if (reached !== stopRef.current) {
        stopRef.current = reached;
        setStop(reached);
      }

      /* ---- the aircraft ---- */
      const draw = {
        x,
        y,
        size,
        morph,
        heading,
        alpha: 1,
        haze: 1 - smooth(clampStage(p / 0.42)),
      };
      drawContrail(ctx, draw, cw * (0.3 + (1 - morph) * 0.5));
      drawAircraft(ctx, draw);

      /* ---- copy ---- */
      if (copyARef.current) {
        copyARef.current.style.opacity = (1 - smooth(seg(p, 0.28, 0.4))).toFixed(3);
      }
      if (copyBRef.current) {
        copyBRef.current.style.opacity = (
          smooth(seg(p, 0.42, 0.54)) *
          (1 - smooth(seg(p, 0.68, 0.76)))
        ).toFixed(3);
      }
      if (copyCRef.current) {
        copyCRef.current.style.opacity = smooth(seg(p, 0.72, 0.82)).toFixed(3);
      }
    },
    !simplified,
    /* Approach, morph and five stops all live in here. */
    { vh: 4.6 },
  );

  useStill(
    canvasRef,
    (ctx, cw, ch) => {
      paintSky(ctx, cw, ch, 6, 1);
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = PAPER.cream;
      ctx.fillRect(0, 0, cw, ch);
      ctx.restore();
      drawAircraft(ctx, {
        x: cw * 0.5,
        y: ch * 0.46,
        size: Math.min(cw * 0.22, 110),
        morph: 1,
        heading: -0.04,
        alpha: 1,
        haze: 0,
      });
    },
    simplified,
    [],
  );

  const current = stop >= 0 ? stops[stop] : null;

  if (simplified) {
    return <FlightStill canvasRef={canvasRef} copy={copy} />;
  }

  return (
    <section
      ref={sectionRef}
      aria-label={copy.ariaLabel}
      className="relative h-[100svh] w-full overflow-hidden bg-[#b3d3e2]"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />

      {/* Stop labels ride the route line the canvas just drew. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {stops.map((s, i) => (
          <div
            key={s.label}
            ref={(el) => {
              stopRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 whitespace-nowrap pt-4 text-center will-change-transform"
            style={{ opacity: 0 }}
          >
            {/* Label only. The detail line duplicated the copy panel a few
                hundred pixels away, which read as clutter rather than as
                emphasis. */}
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#14342b]">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-end px-6 pb-14 md:px-14 md:pb-20">
        <div className="relative w-full max-w-[36rem]">
          <div ref={copyARef} className="absolute bottom-0 left-0 w-full">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0b6f77]">
              {copy.approach.eyebrow}
            </p>
            <h2 className="mt-4 text-[1.7rem] font-semibold leading-[1.14] tracking-tight text-[#0a2a3c] md:text-[2.6rem]">
              {copy.approach.title}
            </h2>
            <p className="mt-4 max-w-[30rem] text-[15px] leading-7 text-[#1d4256] md:text-[17px] md:leading-8">
              {copy.approach.body}
            </p>
          </div>

          <div
            ref={copyBRef}
            className="absolute bottom-0 left-0 w-full"
            style={{ opacity: 0 }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0b6f77]">
              {copy.morph.eyebrow}
            </p>
            <h2 className="mt-4 text-[1.7rem] font-semibold leading-[1.14] tracking-tight text-[#0a2a3c] md:text-[2.6rem]">
              {copy.morph.title}
            </h2>
            <p className="mt-4 max-w-[30rem] text-[15px] leading-7 text-[#1d4256] md:text-[17px] md:leading-8">
              {copy.morph.body}
            </p>
          </div>

          <div
            ref={copyCRef}
            className="absolute bottom-0 left-0 w-full"
            style={{ opacity: 0 }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0b6f77]">
              {copy.navigator.eyebrow}
            </p>
            <h2 className="mt-3 flex items-baseline gap-3 text-[1.5rem] font-semibold leading-[1.14] tracking-tight text-[#0a2a3c] md:text-[2.1rem]">
              {current ? current.label : copy.navigator.fallbackLabel}
            </h2>
            <p className="mt-3 max-w-[28rem] text-[15px] leading-7 text-[#1d4256] md:text-[16px]">
              {current ? current.detail : copy.navigator.fallbackDetail}
            </p>
          </div>
        </div>
      </div>

      <div className="sr-only">
        <h2>{copy.ariaLabel}</h2>
        <ol>
          {stops.map((s) => (
            <li key={s.label}>
              {s.label} — {s.detail}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FlightStill({
  canvasRef,
  copy,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  copy: FlightCopy;
}) {
  return (
    <section aria-label={copy.ariaLabel} className="relative bg-[#b3d3e2]">
      <div className="relative h-[52svh] w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="bg-[#e9eee9] px-6 pb-16 pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0b6f77]">
          {copy.still.eyebrow}
        </p>
        <h2 className="mt-4 text-[1.5rem] font-semibold leading-[1.16] tracking-tight text-[#0a2a3c]">
          {copy.still.title}
        </h2>
        <ol className="mt-6 space-y-4">
          {copy.stops.map((s) => (
            <li key={s.label} className="flex gap-4 border-t border-[#0a2a3c]/12 pt-4">
              <span className="mt-1 h-2 w-2 shrink-0 rotate-45 bg-[#08a99d]" />
              <div>
                <p className="text-[15px] font-semibold text-[#0a2a3c]">{s.label}</p>
                <p className="mt-1 text-[14px] leading-6 text-[#3d5c53]">
                  {s.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
