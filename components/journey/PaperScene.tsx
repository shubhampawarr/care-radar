"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  buildSheet,
  clamp01,
  makeRng,
  PAPER,
  power2Out,
  seedFromString,
  shiftLightness,
  SHADOW_OFFSET,
  SHADOW_OPACITY,
  wobbleRect,
} from "./paper";

/* ------------------------------------------------------------------ *
 * Viewport variant
 * ------------------------------------------------------------------ */

const emptySubscribe = () => () => {};

function useMediaQuery(query: string, serverValue: boolean): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export type JourneyVariant = {
  isClient: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  /** Settle immediately, no crumple: mobile or reduced motion. */
  simplified: boolean;
};

/**
 * Scenes and PaperScene both call this; they resolve identically, so no
 * context plumbing is needed.
 */
export function useJourneyVariant(): JourneyVariant {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  // Server-renders as mobile + reduced: the settled, static, legible state.
  const isMobile = useMediaQuery("(max-width: 767px)", true);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  return {
    isClient,
    isMobile,
    reducedMotion,
    simplified: !isClient || isMobile || reducedMotion,
  };
}

/* ------------------------------------------------------------------ *
 * Unfold choreography (CSS side)
 * ------------------------------------------------------------------ */

/**
 * Default state is SETTLED — visible, untransformed, no transition. That is
 * what SSR, no-JS, mobile and reduced-motion all get for free.
 *
 * `data-animate` is set imperatively (never rendered by React, or React would
 * reclaim the attribute on re-render and wipe the imperative value) and is the
 * only thing that opts an instance into the hidden-then-unfold choreography.
 */
const UNFOLD_CSS = `
.paper-scene[data-animate="true"] [data-unfold-index]{
  opacity:0;
  transform-box:fill-box;
  transform-origin:center;
  transform:translateY(9px) scale(.955);
  transition:opacity 400ms ease-out,
             transform 520ms cubic-bezier(.34,1.56,.64,1);
  transition-delay:var(--unfold-delay,0ms);
}
.paper-scene[data-animate="true"] [data-unfold-kind="hinge"]{
  transform-origin:bottom;
  transform:scaleY(.05);
}
.paper-scene[data-animate="true"][data-unfolded="true"] [data-unfold-index]{
  opacity:1;
  transform:none;
}
.paper-scene[data-animate="true"][data-scrubbing="true"] [data-unfold-index]{
  transition:none;
}
@media (prefers-reduced-motion: reduce){
  .paper-scene [data-unfold-index]{
    transition:none!important;
    opacity:1!important;
    transform:none!important;
  }
}
`;

/* ------------------------------------------------------------------ *
 * PaperScene
 * ------------------------------------------------------------------ */

export type PaperSceneProps = {
  /** Stable seed string — the same string always yields the same sheet. */
  seed: string;
  width: number;
  height: number;
  /** Accessible description of what the illustration depicts. */
  title: string;
  children: ReactNode;
  className?: string;
  /** ms into the uncrumple at which scene objects begin to unfold. */
  unfoldAt?: number;
  /** Sheet inset inside the viewBox, so crumpled facets have room to move. */
  inset?: number;
};

const ENTER_MS = 900;

export default function PaperScene({
  seed,
  width,
  height,
  title,
  children,
  className = "",
  unfoldAt = 400,
  inset = 26,
}: PaperSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const grainId = `grain-${uid}`;

  const { simplified } = useJourneyVariant();

  const sheet = useMemo(
    () =>
      buildSheet(
        seedFromString(seed),
        width - inset * 2,
        height - inset * 2,
      ),
    [seed, width, height, inset],
  );

  /** Deterministic paper flecks for the grain pattern. */
  const flecks = useMemo(() => {
    const rng = makeRng(seedFromString(`${seed}-grain`));
    return Array.from({ length: 26 }, () => ({
      x: rng() * 40,
      y: rng() * 40,
      w: 0.5 + rng() * 1.4,
      h: 0.4 + rng() * 0.9,
      o: 0.25 + rng() * 0.5,
    }));
  }, [seed]);

  const sheetOutline = useMemo(
    () =>
      wobbleRect(
        0,
        0,
        sheet.width,
        sheet.height,
        makeRng(seedFromString(`${seed}-outline`)),
        1.8,
        5,
      ),
    [seed, sheet.width, sheet.height],
  );

  /* ---------------- animation ---------------- */

  const creaseLengths = useRef<number[]>([]);
  const enterStart = useRef<number | null>(null);
  const hasEntered = useRef(false);
  const rafId = useRef<number | null>(null);
  const lastP = useRef(-1);
  const scrubbing = useRef(false);

  const applyProgress = useCallback(
    (p: number) => {
      const svg = svgRef.current;
      if (!svg || p === lastP.current) return;
      lastP.current = p;

      const strength = 1 - p;

      const facetNodes = svg.querySelectorAll<SVGPathElement>("[data-facet-index]");
      facetNodes.forEach((node) => {
        const i = Number(node.dataset.facetIndex);
        const f = sheet.facets[i];
        if (!f) return;
        const [cx, cy] = f.centroid;
        const rot = (f.rotate * strength).toFixed(3);
        const sc = (1 - (1 - f.scale) * strength).toFixed(4);
        const dx = (f.dx * strength).toFixed(2);
        const dy = (f.dy * strength).toFixed(2);
        node.setAttribute(
          "transform",
          `translate(${dx},${dy}) translate(${cx.toFixed(2)},${cy.toFixed(2)}) ` +
            `rotate(${rot}) scale(${sc}) translate(${(-cx).toFixed(2)},${(-cy).toFixed(2)})`,
        );
        if (node.dataset.facetRole === "fill") {
          node.setAttribute(
            "fill",
            shiftLightness(PAPER.white, f.lightness * strength),
          );
          // Facet edges fade out with the creases, so a flat sheet is a clean
          // rectangle rather than a visible mesh.
          node.setAttribute("stroke-opacity", (0.18 * strength).toFixed(3));
        }
      });

      const creaseNodes = svg.querySelectorAll<SVGPathElement>("[data-crease-index]");
      creaseNodes.forEach((node, i) => {
        const len = creaseLengths.current[i] ?? 0;
        // dasharray full length; offset walks the dash off as the sheet flattens.
        node.setAttribute("stroke-dashoffset", (len * p).toFixed(2));
      });

      /* Scene objects fold back in reverse order, scrubbed with p. */
      const items = svg.querySelectorAll<SVGGraphicsElement>("[data-unfold-index]");
      const n = items.length;
      if (p >= 1) {
        if (scrubbing.current) {
          scrubbing.current = false;
          svg.dataset.scrubbing = "false";
          items.forEach((el) => {
            el.style.opacity = "";
            el.style.transform = "";
          });
        }
      } else if (hasEntered.current) {
        if (!scrubbing.current) {
          scrubbing.current = true;
          svg.dataset.scrubbing = "true";
        }
        items.forEach((el, i) => {
          const reverseRank = n - 1 - i;
          const threshold = 0.08 + (n <= 1 ? 0 : reverseRank / n) * 0.55;
          const itemP = clamp01((p - threshold) / 0.35);
          el.style.opacity = itemP.toFixed(3);
          el.style.transform =
            el.dataset.unfoldKind === "hinge"
              ? `scaleY(${(0.05 + 0.95 * itemP).toFixed(3)})`
              : `translateY(${(9 * (1 - itemP)).toFixed(2)}px) scale(${(0.955 + 0.045 * itemP).toFixed(3)})`;
        });
      }
    },
    [sheet.facets],
  );

  /* Measure crease path lengths once. */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const nodes = svg.querySelectorAll<SVGPathElement>("[data-crease-index]");
    creaseLengths.current = Array.from(nodes, (n) => {
      const len = n.getTotalLength();
      n.setAttribute("stroke-dasharray", `${len.toFixed(2)} ${len.toFixed(2)}`);
      return len;
    });
  }, [sheet.creases]);

  /* Keeps the effects below free of applyProgress's identity, so they never
     tear down and restart the loop mid-cycle. */
  const applyRef = useRef(applyProgress);
  useEffect(() => {
    applyRef.current = applyProgress;
  }, [applyProgress]);

  /* Settled and static: mobile, reduced motion, and SSR.
   *
   * Deliberately does NOT touch hasEntered. useSyncExternalStore serves the
   * *server* snapshot during hydration, so `simplified` is briefly true on
   * desktop before flipping to false. Marking the scene as entered here would
   * make the IntersectionObserver skip its enter branch for good, leaving the
   * sheet crumpled and the objects hidden forever. */
  useEffect(() => {
    if (!simplified) return;
    const svg = svgRef.current;
    if (!svg) return;
    svg.removeAttribute("data-animate");
    applyRef.current(1);
  }, [simplified]);

  /* Full cycle: enter once, then scrub the exit to scroll position. */
  useEffect(() => {
    if (simplified) return;
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return;

    svg.dataset.animate = "true";
    // Only reset to fully crumpled if this instance has never entered. A
    // re-run must not throw a settled scene back to p=0.
    if (!hasEntered.current) applyRef.current(0);

    let unfoldTimer: number | undefined;

    const exitProgress = (): number => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const line = vh / 3;
      // Settled until the scene's top passes the upper third; fully crumpled
      // once it has left the top of the viewport. Pure function of scroll
      // position, so scrolling back up reverses it exactly.
      const travelled = line - rect.top;
      const total = line + rect.height;
      return clamp01(travelled / total);
    };

    const frame = (now: number) => {
      const enterP =
        enterStart.current === null
          ? 0
          : power2Out(clamp01((now - enterStart.current) / ENTER_MS));
      const p = Math.min(enterP, 1 - exitProgress());
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

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!hasEntered.current) {
              hasEntered.current = true;
              enterStart.current = performance.now();
              unfoldTimer = window.setTimeout(() => {
                svg.dataset.unfolded = "true";
              }, unfoldAt);
            }
            start();
          } else {
            stop();
          }
        }
      },
      { rootMargin: "15% 0px", threshold: 0 },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      stop();
      window.clearTimeout(unfoldTimer);
    };
  }, [simplified, unfoldAt]);

  const inner = `translate(${inset},${inset})`;

  return (
    <div ref={rootRef} className={className}>
      <style dangerouslySetInnerHTML={{ __html: UNFOLD_CSS }} />
      <svg
        ref={svgRef}
        className="paper-scene block h-auto w-full"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={title}
      >
        <defs>
          <pattern
            id={grainId}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            {flecks.map((f, i) => (
              <rect
                key={i}
                x={f.x}
                y={f.y}
                width={f.w}
                height={f.h}
                fill={PAPER.ink}
                opacity={f.o}
              />
            ))}
          </pattern>
        </defs>

        {/* Sheet shadow — offset 4/6, 12%, warm-grey, never blurred. */}
        <g
          transform={`translate(${inset + SHADOW_OFFSET.x},${inset + SHADOW_OFFSET.y})`}
          opacity={SHADOW_OPACITY}
          aria-hidden="true"
        >
          {sheet.facets.map((f, i) => (
            <path
              key={f.id}
              id={`${f.id}-shadow`}
              data-facet-index={i}
              data-facet-role="shadow"
              d={f.d}
              fill={PAPER.shadow}
            />
          ))}
        </g>

        <g transform={inner}>
          {/* Facets: ~14 irregular polygons tiling the sheet, shared edges. */}
          {sheet.facets.map((f, i) => (
            <path
              key={f.id}
              id={f.id}
              data-facet-index={i}
              data-facet-role="fill"
              d={f.d}
              fill={PAPER.white}
              stroke={PAPER.ink}
              strokeWidth={0.5}
              strokeOpacity={0.16}
            />
          ))}

          {/* Creases sit over the facets and are drawn away as it flattens. */}
          <g fill="none" stroke={PAPER.ink} strokeLinecap="round">
            {sheet.creases.map((c, i) => (
              <path
                key={c.id}
                id={c.id}
                data-crease-index={i}
                d={c.d}
                strokeWidth={c.width}
                strokeOpacity={0.42}
              />
            ))}
          </g>

          {/* Cut outline of the whole sheet, hand-varied weight. */}
          <path
            id="sheet-outline"
            d={sheetOutline}
            fill="none"
            stroke={PAPER.ink}
            strokeWidth={3.2}
            strokeLinejoin="round"
          />

          <rect
            id="sheet-grain"
            width={sheet.width}
            height={sheet.height}
            fill={`url(#${grainId})`}
            opacity={0.05}
            pointerEvents="none"
          />
        </g>

        {/* Scene objects layer over the flattened sheet. */}
        <g id="scene-objects" transform={inner}>
          {children}
        </g>
      </svg>
    </div>
  );
}
