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
  buildCrystalMaterial,
  buildSheet,
  type CrystalMaterial,
  clamp01,
  facetAxisPhase,
  facetTurnScaleX,
  travellingHighlight,
  dissolveOpacity,
  latticeForViewport,
  phaseTurnProgress,
  spreadFromMs,
  type TurnAxis,
} from "./surface";

/* ------------------------------------------------------------------ *
 * CrystalPhases — fullscreen phase transition.
 *
 * GEOMETRY RESOLUTION
 * Facets rotate about their own vertical axis AND never separate cannot both
 * hold: adjacent facets on different axes must open at their shared edge. The
 * resolution is that facets NEVER TRANSLATE. Each holds its grid cell and only
 * scales about its own centroid, so the eye reads one surface turning even as
 * gaps open. The gaps are the midpoint — "hundreds of thin crystalline edges"
 * IS a gapped lattice seen edge-on.
 *
 * Hard rules held here: no translation ever, no facet leaves its cell, no
 * explosion, no drift, no floating tiles, no 3D camera, no background rotation.
 * The transform below is a pure X scale about the facet's own centroid; the
 * two translates cancel exactly, which the centroid-invariance test asserts.
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
          // Falloff runs off-canvas on every side, so there is no visible
          // boundary anywhere on screen — it reads as the crystal deepening
          // under the copy, not as a shape laid on top of it.
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


/**
 * Gradient defs for one crystal. Declared once, never touched per frame —
 * the light is a static environment, so the fills cost nothing to animate.
 */
function CrystalDefs({ uid }: { uid: string }) {
  return (
    <defs>
      {/* The light environment. These sit BENEATH the translucent facets, so
          they read as light inside the material rather than as a wash over it.
          Three static layers replace what used to be one gradient per facet:
          the panel gains continuous internal light AND stops re-rasterising
          76 gradients every frame. */}
      <linearGradient id={`wash-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="34%" stopColor="#DCF3F1" stopOpacity="0.72" />
        <stop offset="68%" stopColor="#8FD6D2" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#2E7C8C" stopOpacity="0.42" />
      </linearGradient>

      {/* Internal scattering: light entering upper-left and diffusing through
          the body of the crystal. Gives thickness without any blur. */}
      <radialGradient id={`scatter-${uid}`} cx="0.3" cy="0.24" r="0.85">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.72" />
        <stop offset="42%" stopColor="#CFEFEC" stopOpacity="0.32" />
        <stop offset="100%" stopColor="#7FC6C6" stopOpacity="0" />
      </radialGradient>

      {/* A second, deeper bounce — the far side of a thick panel. */}
      <radialGradient id={`bounce-${uid}`} cx="0.78" cy="0.82" r="0.7">
        <stop offset="0%" stopColor="#BFE9E4" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#BFE9E4" stopOpacity="0" />
      </radialGradient>

      <radialGradient id={`sheen-${uid}`}>
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.34" />
        <stop offset="55%" stopColor="#DFF6F2" stopOpacity="0.13" />
        <stop offset="100%" stopColor="#DFF6F2" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/** The light layers the facets sit on top of. */
function CrystalLight({
  uid,
  w,
  h,
}: {
  uid: string;
  w: number;
  h: number;
}) {
  return (
    <g aria-hidden="true">
      <rect width={w} height={h} fill={`url(#wash-${uid})`} />
      <rect width={w} height={h} fill={`url(#scatter-${uid})`} />
      <rect width={w} height={h} fill={`url(#bounce-${uid})`} />
    </g>
  );
}

/**
 * One facet: a flat tone from the palette ramp, a polished edge, and a
 * specular that only fires when the travelling highlight passes it.
 *
 * The fill is flat by design. The internal gradient a viewer reads comes from
 * the light layers showing through the translucent face — which is both how
 * real laminated glass behaves and far cheaper to repaint while scaling.
 */
function CrystalFacets({
  sheet,
  material,
}: {
  sheet: ReturnType<typeof buildSheet>;
  material: readonly CrystalMaterial[];
}) {
  return (
    <>
      {sheet.facets.map((f, i) => {
        const m = material[i];
        return (
          <g key={f.id} data-turn-facet={i} id={`crystal-${f.id}`}>
            <path
              data-face=""
              d={f.d}
              fill={m.mid}
              fillOpacity={m.fillOpacity}
              stroke={m.edge}
              strokeOpacity={m.edgeOpacity}
              strokeWidth={0.9}
              vectorEffect="non-scaling-stroke"
            />
            <path
              data-spec=""
              d={f.d}
              fill="none"
              stroke={m.specular}
              strokeOpacity={m.specularOpacity}
              strokeWidth={m.specularWidth}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}
    </>
  );
}

export default function CrystalPhases({
  seed,
  phases,
  transitions,
}: CrystalPhasesProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const sheenRef = useRef<SVGGElement>(null);
  const panel0Ref = useRef<HTMLDivElement>(null);
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);

  // Below 768px and under reduced motion: no pin, no turn. Phases stack and
  // scroll normally, crystal renders flush and static, copy cross-fades.
  // Measured, not guessed: fullscreen makes the 360px gap problem worse.
  const { isMobile, reducedMotion, isClient } = useJourneyVariant();
  const staticPath = isMobile || reducedMotion || !isClient;

  const [viewport, setViewport] = useState({ w: 1440, h: 900 });

  useEffect(() => {
    const read = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
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

  const { sheet, crystal } = useMemo(() => {
    const { cols, rows } = latticeForViewport(viewport.w, viewport.h);
    const s = buildSheet(seedFromStringLocal(seed), viewport.w, viewport.h, cols, rows);
    return {
      sheet: s,
      crystal: buildCrystalMaterial(
        seedFromStringLocal(seed),
        s.facets,
        viewport.w,
        viewport.h,
      ),
    };
  }, [seed, viewport.w, viewport.h]);

  const material = crystal;

  /* Node cache. Querying the DOM per facet per frame cost ~77 lookups every
     frame once the lattice went to 76 facets; resolved once here instead. */
  const nodesRef = useRef<
    {
      g: SVGGElement;
      face: SVGPathElement | null;
      spec: SVGPathElement | null;
      cx: number;
      cy: number;
    }[]
  >([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) {
      nodesRef.current = [];
      return;
    }
    nodesRef.current = Array.from(
      svg.querySelectorAll<SVGGElement>("[data-turn-facet]"),
    ).map((g) => {
      const i = Number(g.dataset.turnFacet);
      const f = sheet.facets[i];
      return {
        g,
        face: g.querySelector<SVGPathElement>("[data-face]"),
        spec: g.querySelector<SVGPathElement>("[data-spec]"),
        cx: f ? f.centroid[0] : 0,
        cy: f ? f.centroid[1] : 0,
      };
    });
    // staticPath is in the deps deliberately: useSyncExternalStore serves the
    // SERVER snapshot during hydration, so the static path renders first and
    // the pinned path then mounts a DIFFERENT <svg>. Without this the cache
    // stays bound to the discarded nodes and no facet ever turns.
  }, [sheet.facets, staticPath]);

  const applyProgress = useCallback(
    (T: number) => {
      const svg = svgRef.current;
      if (!svg) return;

      // Two transitions across the pin. Local p runs 0..1 within each.
      const which = T < 0.5 ? 0 : 1;
      const p = clamp01(which === 0 ? T * 2 : (T - 0.5) * 2);
      const cfg = transitions[which];
      const turn = phaseTurnProgress(p);
      const spread = spreadFromMs(cfg.spreadMs);

      /* The highlight front travels around the crystal as it turns — light
         moving over the object, not an effect layered on top. */
      const front = (turn * 1.35 + 0.12) % 1;

      const cache = nodesRef.current;
      for (let i = 0; i < cache.length; i += 1) {
        const { g: node, face, spec, cx, cy } = cache[i];
        const phase = facetAxisPhase(cfg.axis, cx, cy, sheet.width, sheet.height);
        // Stagger shifts WHEN a facet turns, never where it sits.
        const local = clamp01((turn - phase * spread) / (1 - spread));
        const sx = facetTurnScaleX(local);
        node.setAttribute(
          "transform",
          `translate(${cx.toFixed(3)},0) scale(${sx.toFixed(5)},1) translate(${(-cx).toFixed(3)},0)`,
        );

        /* Optics only — the transform above is untouched. As a facet swings
           toward edge-on its edge catches the light harder, so the faces
           dissolve into thin luminous lines at the midpoint rather than
           thinning into bars. One attribute per facet per frame. */
        const m = material[i];
        if (m) {
          if (spec) {
            spec.setAttribute(
              "stroke-opacity",
              travellingHighlight(m.specularOpacity, sx, m.highlightPhase, front).toFixed(3),
            );
          }
          // Faces surrender their fill at the midpoint: the crystal dissolves
          // into light instead of collapsing into bars.
          if (face) {
            face.setAttribute(
              "fill-opacity",
              String(dissolveOpacity(m.fillOpacity, sx)),
            );
          }
        }
      }

      /* Copy leaves by p=0.40 and the panel clears just after, at 0.45 — so
         nothing is on screen across the edge-on hold. Arriving, the panel
         lands first at 0.80 and the copy follows from 0.85. */
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
        // Drift is capped at TEXT_DRIFT px left, and never vertical.
        el.style.transform = `translate(calc(-50% + ${(-TEXT_DRIFT * (1 - textO)).toFixed(1)}px), -50%)`;
      };

      set(0, which === 0 ? textOut : 0, which === 0 ? bgOut : 0);
      set(1, which === 0 ? textIn : textOut, which === 0 ? bgIn : bgOut);
      set(2, which === 1 ? textIn : 0, which === 1 ? bgIn : 0);
    },
    [sheet.facets, sheet.width, sheet.height, transitions, material],
  );

  const applyRef = useRef(applyProgress);
  useEffect(() => {
    applyRef.current = applyProgress;
  }, [applyProgress]);

  /* Static path: flush facets, first phase visible, no pin. */
  useEffect(() => {
    if (!staticPath) return;
    const svg = svgRef.current;
    if (!svg) return;
    svg.querySelectorAll<SVGPathElement>("[data-turn-facet]").forEach((n) => {
      n.removeAttribute("transform");
    });
  }, [staticPath, sheet.facets.length]);

  /* The stationary state.
   *
   * Geometry never moves here — this drifts the light only. One <g> with one
   * transform and a slow opacity swell, on a Lissajous path so it never
   * visibly repeats. Amplitude is a few percent of the viewport over ~40s:
   * the surface stops reading as frozen without ever pulling attention off
   * the copy. Separate from the ScrollTrigger loop and untouched by it. */
  useEffect(() => {
    if (staticPath) return;
    const node = sheenRef.current;
    if (!node) return;

    let raf: number | null = null;
    const t0 = performance.now();

    const drift = (now: number) => {
      const t = (now - t0) / 1000;
      const x = Math.sin(t * 0.152) * 5.2 + Math.sin(t * 0.071) * 2.6;
      const y = Math.cos(t * 0.117) * 3.4 + Math.sin(t * 0.049) * 1.8;
      const swell = 0.86 + Math.sin(t * 0.094) * 0.14;
      node.setAttribute("transform", `translate(${x.toFixed(2)},${y.toFixed(2)})`);
      node.setAttribute("opacity", swell.toFixed(3));
      raf = requestAnimationFrame(drift);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && raf === null) raf = requestAnimationFrame(drift);
          else if (!e.isIntersecting && raf !== null) {
            cancelAnimationFrame(raf);
            raf = null;
          }
        }
      },
      { rootMargin: "10% 0px" },
    );
    const section = sectionRef.current;
    if (section) io.observe(section);

    return () => {
      io.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [staticPath]);

  /* Pinned sequence. Scroll drives timeline progress only. */
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

      applyRef.current(0);

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () =>
          `+=${window.innerHeight * VH_PER_TRANSITION * transitions.length}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => applyRef.current(self.progress),
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
  }, [staticPath, transitions.length]);

  /* ---------------- static stack (mobile / reduced motion) ---------------- */
  if (staticPath) {
    return (
      <section aria-label="CareRadar phases" className="relative">
        {phases.map((phase, i) => (
          <div key={phase.id} className="relative overflow-hidden bg-[#041826]">
            <svg
              ref={i === 0 ? svgRef : undefined}
              className="crystal-field absolute inset-0 h-full w-full"
              viewBox={`0 0 ${sheet.width} ${sheet.height}`}
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <CrystalDefs uid={`s${i}`} />
              <CrystalLight uid={`s${i}`} w={sheet.width} h={sheet.height} />
              <CrystalFacets sheet={sheet} material={crystal} />
            </svg>
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
      className="relative h-screen w-full overflow-hidden bg-white"
    >
      <svg
        ref={svgRef}
        className="crystal-field absolute inset-0 h-full w-full"
        viewBox={`0 0 ${sheet.width} ${sheet.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <CrystalDefs uid="p" />
        <CrystalLight uid="p" w={sheet.width} h={sheet.height} />
        <CrystalFacets sheet={sheet} material={crystal} />
        {/* Lighting breathes; geometry never does. */}
        <g ref={sheenRef} id="crystal-sheen">
          <ellipse
            cx={sheet.width * 0.34}
            cy={sheet.height * 0.3}
            rx={sheet.width * 0.52}
            ry={sheet.height * 0.6}
            fill="url(#sheen-p)"
          />
        </g>
      </svg>

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
