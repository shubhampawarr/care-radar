import type { EmployerCopy, SolutionRoute } from "./content";
import Reveal from "./Reveal";

/**
 * E3 — Was wir liefern.
 *
 * TWO ENTRY POINTS, ONE SYSTEM
 * The composition is symmetrical on purpose. Two panels of equal weight, a
 * single hairline and the word "oder" between them, and below that two lines
 * that leave each panel and meet at one node. That node is the whole argument
 * of the section: the routes differ in how the qualification comes about, and
 * from there they are the same journey. A pair of stacked marketing cards
 * cannot say that; a convergence can, with two lines and a dot.
 *
 * DIVISION OF LABOUR WITH THE ENVIRONMENT
 * EmployerEnvironment reaches its BRANCHED state here: the single constrained
 * column of E2 opens into two, positioned to sit behind these two route
 * columns. It supplies the release - atmospheric, imprecise, spanning the whole
 * viewport. The inline convergence below supplies the resolution, anchored to
 * the real column positions. The environment says the system opened into two;
 * the SVG says the two become one. Neither draws the other, so nothing on this
 * screen is stated twice.
 *
 * NOT CARDS, AND NOT CLICKABLE
 * The panels carry no hover lift and no per-panel call to action. They are
 * content, not controls — the page has one primary action and it is in E1.
 * Putting a hover state on a non-interactive block promises an affordance that
 * is not there, and adding two more CTAs here would dilute the one that
 * matters.
 *
 * THE HANDOFF
 * The section ends by graduating from the light ground the page has used
 * throughout into the deep navy E4 occupies, so the immersive section takes
 * over from a surface that is already its own colour. This block is the lead-in
 * only. E4 itself is not implemented here.
 *
 * THE SPLIT HAPPENS AT lg, NOT md
 * Same measurement as the hero: at 768 the two routes get about 340px each and
 * run to three or four words a line, with the titles at three lines and "oder"
 * jammed against the rule. They stack below 1024 instead.
 *
 * WHAT IS DELIBERATELY ABSENT
 * No durations, and nothing about how a Pflegekraft in Anerkennung counts
 * toward the Fachkraftquote. E2 raises the quota as the operator's problem and
 * the temptation to resolve it here is strong, but the §113c SGB XI
 * classification is unresolved with the Pflegekassen and the source document
 * marks it as a gap that must not be filled during design. See content.ts.
 */

function RoutePanel({
  route,
  className,
}: {
  route: SolutionRoute;
  className?: string;
}) {
  return (
    <article className={`relative ${className ?? ""}`}>
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[12px] tracking-[0.2em] text-[#08a99d]">
          {route.index}
        </span>
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-[linear-gradient(90deg,rgba(8,169,157,0.35),rgba(8,38,74,0.08))]"
        />
      </div>

      <h3 className="mt-5 max-w-[24ch] text-[1.3rem] font-semibold leading-[1.2] tracking-tight text-[#061f3d] md:text-[1.6rem]">
        {route.title}
      </h3>

      <p className="mt-4 max-w-[46ch] text-[14.5px] leading-8 text-slate-600 md:text-[15.5px]">
        {route.summary}
      </p>

      <ul className="mt-7 space-y-3.5">
        {route.points.map((point) => (
          <li key={point} className="flex items-start gap-3.5">
            <span
              aria-hidden="true"
              className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rotate-45 border border-[#08a99d] bg-white"
            />
            <span className="max-w-[48ch] text-[13.5px] leading-7 text-[#08264a]">
              {point}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-7 border-t border-slate-200 pt-4 text-[13px] leading-6 text-slate-500">
        {route.suitedTo}
      </p>
    </article>
  );
}

export type EmployerSolutionsProps = {
  solutions: EmployerCopy["solutions"];
};

export default function EmployerSolutions({
  solutions,
}: EmployerSolutionsProps) {
  const [first, second] = solutions.routes;

  return (
    <section
      aria-labelledby="e3-title"
      data-env-section="branched"
      className="relative"
    >
      <div className="relative mx-auto max-w-7xl px-5 pt-16 md:px-8 md:pt-24">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {solutions.eyebrow}
            </p>
            <h2
              id="e3-title"
              className="mt-4 text-[1.75rem] font-semibold leading-[1.14] tracking-tight text-[#061f3d] md:text-[2.6rem]"
            >
              {solutions.title}
            </h2>
            <p className="mx-auto mt-5 max-w-[56ch] text-[15px] leading-8 text-slate-600 md:text-[16.5px]">
              {solutions.intro}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Subgrid, so index, title, summary, points and the closing line
              share a row each across both routes. Two independent columns drift
              apart the moment one title wraps to a different number of lines,
              and once the bullet lists start at different heights the section
              stops reading as two equal alternatives — which is the one thing
              it exists to say. Rows are shared; min-heights are not needed and
              would break the next time the copy changes. */}
          <div className="mt-14 grid gap-12 lg:mt-16 lg:grid-cols-[1fr_auto_1fr] lg:grid-rows-[auto_auto_auto_1fr_auto] lg:gap-0">
            <RoutePanel
              route={first}
              className="lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:pr-12 xl:pr-16"
            />

            {/* One hairline and one word. The two routes are alternatives, and
                this is the cheapest honest way to say so. Sat at the vertical
                centre at first, where it read as dividing the two bullet lists
                rather than the two routes; it belongs beside the titles. */}
            <div
              className="relative flex items-center justify-center lg:row-span-5 lg:w-px lg:flex-col lg:items-center lg:justify-start lg:pt-[5.5rem]"
              aria-hidden="true"
            >
              <span className="absolute inset-0 h-px w-full bg-slate-200 lg:left-1/2 lg:h-full lg:w-px" />
              {/* Sits on the page ground rather than on white, now that the
                  section itself is transparent over the shared gradient. */}
              <span className="relative bg-[#fafcff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                {solutions.orLabel}
              </span>
            </div>

            <RoutePanel
              route={second}
              className="lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:pl-12 xl:pl-16"
            />
          </div>
        </Reveal>

        {/* Convergence. Two lines leaving the two panels and meeting at one
            node — the section's argument, drawn. Desktop only: once the panels
            stack there is nothing left to converge and the same graphic would
            be decoration. */}
        <div aria-hidden="true" className="mt-4 hidden lg:block">
          <svg
            viewBox="0 0 1000 130"
            preserveAspectRatio="none"
            className="h-[130px] w-full"
            role="presentation"
            focusable="false"
          >
            <g stroke="#08264a" strokeOpacity="0.28" fill="none">
              <path
                d="M250 6 L500 96"
                vectorEffect="non-scaling-stroke"
                strokeWidth="1"
              />
              <path
                d="M750 6 L500 96"
                vectorEffect="non-scaling-stroke"
                strokeWidth="1"
              />
              <path
                d="M500 96 L500 124"
                vectorEffect="non-scaling-stroke"
                strokeWidth="1"
              />
            </g>
            <circle cx="250" cy="6" r="2.5" fill="#08a99d" fillOpacity="0.55" />
            <circle cx="750" cy="6" r="2.5" fill="#08a99d" fillOpacity="0.55" />
            <circle cx="500" cy="96" r="4" fill="#08a99d" />
          </svg>
        </div>

        {/* Mobile keeps the idea, at a tenth of the ink. */}
        <div
          aria-hidden="true"
          className="mt-10 flex flex-col items-center lg:hidden"
        >
          <span className="h-10 w-px bg-slate-200" />
          <span className="h-2 w-2 rotate-45 bg-[#08a99d]" />
        </div>

        <p className="mx-auto mt-8 max-w-[62ch] text-center text-[12.5px] leading-6 text-slate-500">
          {solutions.caveat}
        </p>
      </div>

      {/* ----------------------------------------------------------------
          E4 MOUNT POINT.
          The lead-in only: label, forward title, one line. The immersive
          seven-milestone journey is developed separately and mounts directly
          below this block. Nothing here should grow into E4.
          ---------------------------------------------------------------- */}
      <div
        id="ihr-weg"
        data-env-exit=""
        /* Graduates to #04121f, which is the ground E4 is built on — not to
           #061f3d, which is the footer's colour. Ending on the footer colour
           made the lead-in dissolve straight into the footer and the whole
           build-up read as a sign-off instead of a threshold. The tonal step at
           the bottom edge is what keeps them separate until E4 lands between
           them. */
        className="relative mt-16 scroll-mt-24 bg-[linear-gradient(180deg,#ffffff_0%,#0a2436_52%,#04121f_100%)] px-5 pb-28 pt-20 md:mt-20 md:px-8 md:pb-36 md:pt-24"
      >
        {/* The convergence carries on into the dark: one hairline and one node,
            so the eye is handed downward rather than left at a caption. */}
        <div aria-hidden="true" className="mx-auto mb-12 flex w-px flex-col items-center md:mb-16">
          <span className="h-16 w-px bg-[linear-gradient(180deg,rgba(8,38,74,0.22)_0%,rgba(127,227,214,0.5)_100%)] md:h-24" />
          <span className="h-1.5 w-1.5 rotate-45 bg-[#7fe3d6]" />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#7fe3d6]">
            {solutions.handoff.label}
          </p>
          <p className="mt-4 text-[1.5rem] font-semibold tracking-tight text-white md:text-[2rem]">
            {solutions.handoff.title}
          </p>
          <p className="mx-auto mt-4 max-w-[46ch] text-[14.5px] leading-8 text-[#b9ccd6]">
            {solutions.handoff.line}
          </p>
        </div>
      </div>
    </section>
  );
}
