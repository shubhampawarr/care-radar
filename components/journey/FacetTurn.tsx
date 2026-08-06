"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useJourneyVariant } from "./PaperScene";
import {
  buildCrystalFacets,
  buildSheet,
  clamp01,
  facetAxisPhase,
  facetTurnProgress,
  facetTurnScaleX,
  PAPER,
  seedFromString,
  spreadFromMs,
  type TurnAxis,
} from "./surface";

/* ------------------------------------------------------------------ *
 * FacetTurn — the crystalline transition between milestones.
 *
 * Replaces crumple-away as the exit. The uncrumple ENTRY is unchanged and
 * still belongs to PaperScene: paper objects uncrumple inside a milestone,
 * the ground turns between them.
 *
 * Scrubbed to scroll position, never timed and never pinned, so scrolling
 * back up reverses it exactly — same approach already verified on the
 * exit crumple.
 * ------------------------------------------------------------------ */

/** Text is fully gone before the field goes edge-on, and returns after. */
const OUT_END = 0.4;
const IN_START = 0.6;

export type FacetTurnProps = {
  seed: string;
  width: number;
  height: number;
  /** Copy leaving to the left. */
  outgoing: ReactNode;
  /** Copy arriving from the left. */
  incoming: ReactNode;
  /** Accessible summary of the transition. */
  label: string;
  /** Wave direction. Varied per boundary so the six turns are not identical. */
  axis?: TurnAxis;
  /** Stagger spread in ms, mapped 1:1 (180 -> 0.18). */
  spreadMs?: number;
  className?: string;
};

export default function FacetTurn({
  seed,
  width,
  height,
  outgoing,
  incoming,
  label,
  axis = "lr",
  spreadMs = 180,
  className = "",
}: FacetTurnProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLDivElement>(null);

  // 360px: no turn. The facet lattice is desktop-scale — at mobile width a
  // collapsing facet leaves a gap wider than the slivers that survive, so the
  // field reads as shards rather than a surface. Facets stay flush and the
  // copy cross-fades instead. The turn is a transition, not content.
  const { reducedMotion, isClient, isMobile } = useJourneyVariant();
  const staticSurface = reducedMotion || isMobile || !isClient;

  const sheet = useMemo(
    () => buildSheet(seedFromString(seed), width, height),
    [seed, width, height],
  );
  const crystal = useMemo(
    () => buildCrystalFacets(seedFromString(seed), sheet.facets.length),
    [seed, sheet.facets.length],
  );

  const lastP = useRef(-1);
  const rafId = useRef<number | null>(null);

  const applyProgress = useCallback(
    (p: number) => {
      const svg = svgRef.current;
      if (!svg || p === lastP.current) return;
      lastP.current = p;

      const nodes = svg.querySelectorAll<SVGPathElement>("[data-turn-facet]");
      nodes.forEach((node) => {
        const i = Number(node.dataset.turnFacet);
        const f = sheet.facets[i];
        if (!f) return;
        const [cx, cy] = f.centroid;
        const phase = facetAxisPhase(axis, cx, cy, sheet.width, sheet.height);
        const fp = facetTurnProgress(p, phase, spreadFromMs(spreadMs));
        const sx = facetTurnScaleX(fp);
        node.setAttribute(
          "transform",
          `translate(${cx.toFixed(2)},0) scale(${sx.toFixed(5)},1) translate(${(-cx).toFixed(2)},0)`,
        );
      });

      /* Text choreography. Out by 0.4, nothing across the middle, in from
         0.6. Text never sits on the field while it is translucent. */
      const outNode = outRef.current;
      const inNode = inRef.current;
      if (outNode) {
        const t = clamp01(p / OUT_END);
        outNode.style.opacity = (1 - t).toFixed(3);
        outNode.style.transform = `translateX(${(-46 * t).toFixed(2)}px)`;
        outNode.style.visibility = t >= 1 ? "hidden" : "visible";
      }
      if (inNode) {
        const t = clamp01((p - IN_START) / (1 - IN_START));
        inNode.style.opacity = t.toFixed(3);
        inNode.style.transform = `translateX(${(-46 * (1 - t)).toFixed(2)}px)`;
        inNode.style.visibility = t <= 0 ? "hidden" : "visible";
      }
    },
    [sheet.facets, sheet.width, sheet.height, axis, spreadMs],
  );

  const applyRef = useRef(applyProgress);
  useEffect(() => {
    applyRef.current = applyProgress;
  }, [applyProgress]);

  /* No turn: facets stay flush, text cross-fades. Reduced motion and 360px. */
  useEffect(() => {
    if (!staticSurface) return;
    const svg = svgRef.current;
    if (!svg) return;
    svg.querySelectorAll<SVGPathElement>("[data-turn-facet]").forEach((n) => {
      n.removeAttribute("transform");
    });
    if (outRef.current) {
      outRef.current.style.opacity = "0";
      outRef.current.style.visibility = "hidden";
      outRef.current.style.transform = "none";
    }
    if (inRef.current) {
      inRef.current.style.opacity = "1";
      inRef.current.style.visibility = "visible";
      inRef.current.style.transform = "none";
      inRef.current.style.transition = "opacity 320ms ease-out";
    }
  }, [staticSurface]);

  useEffect(() => {
    if (staticSurface) return;
    const root = rootRef.current;
    if (!root) return;

    applyRef.current(0);

    const frame = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // p runs 0 -> 1 as the boundary crosses the viewport. Pure function of
      // scroll position, so scrolling up reverses it exactly.
      const p = clamp01((vh - rect.top) / (vh + rect.height));
      applyRef.current(p);
      rafId.current = requestAnimationFrame(frame);
    };

    const start = () => {
      if (rafId.current === null) rafId.current = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.isIntersecting ? start : stop)();
      },
      { rootMargin: "20% 0px", threshold: 0 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      stop();
    };
  }, [staticSurface]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <svg
        ref={svgRef}
        className="facet-turn block h-auto w-full"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
      >
        {/* Crystal field. Large facets, flat stepped tints, 1px light edge,
            no black outline — this is the machined ground, not the paper. */}
        {sheet.facets.map((f, i) => {
          const c = crystal[i];
          return (
            <path
              key={f.id}
              id={`crystal-${f.id}`}
              data-turn-facet={i}
              d={f.d}
              fill={c.fill}
              fillOpacity={c.opacity}
              stroke={c.edge}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* Copy sits on an opaque paper panel, never on the translucent field. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
        <div className="relative w-full max-w-xl">
          <div
            ref={outRef}
            data-turn-text="outgoing"
            className="rounded-sm bg-[#F6F1E6] px-5 py-4 shadow-sm"
          >
            {outgoing}
          </div>
          <div
            ref={inRef}
            data-turn-text="incoming"
            className="absolute inset-0 rounded-sm bg-[#F6F1E6] px-5 py-4 shadow-sm"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            {incoming}
          </div>
        </div>
      </div>
    </div>
  );
}

export { PAPER };
