import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { localizedPath, type Locale } from "@/lib/locale";
import type { EmployerCopy } from "./content";
import Reveal from "./Reveal";

/**
 * E1 — Hero.
 *
 * The proposition has to land without scrolling, so the composition gives the
 * headline the left two thirds and lets everything else stay quiet.
 *
 * THE VISUAL
 * This section owns no artwork of its own. The structural field behind it is
 * EmployerEnvironment, one fixed layer shared with E2 and E3, and here it is in
 * its CONNECTED state: evenly spaced, open, at rest. Read the environment and
 * this section together — the hero is the moment before anything constrains.
 *
 * What is local to E1 is the glass: a hairline-bordered translucent panel for
 * the markers, and one vertical rule where the two columns meet. That rule is
 * the page's first and quietest reference to the window frame E4 opens.
 *
 * Ground is light and continuous across E1–E3 — it belongs to the page wrapper,
 * not to this section. That continuity is what buys E4 its impact: three calm
 * light sections, then the dark immersive one.
 *
 * THE SPLIT HAPPENS AT lg, NOT md
 * Tailwind's md is 768px, and at 768 the two columns leave the headline about
 * 400px — seven lines of it — with the lattice running straight through, and
 * every marker in the panel wrapping to three lines. Measured on a 768x1024
 * tablet rather than assumed. Below 1024 everything stacks, which is what this
 * much German B2B text actually needs.
 */

export type EmployerHeroProps = { locale: Locale; hero: EmployerCopy["hero"] };

export default function EmployerHero({ locale, hero }: EmployerHeroProps) {

  return (
    <section
      aria-labelledby="e1-title"
      data-env-section="connected"
      className="relative overflow-hidden"
    >
      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <Reveal>
            <div>
              <p className="inline-flex items-center rounded-full border border-[#08a99d]/25 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#087d76] shadow-sm">
                {hero.eyebrow}
              </p>

              <h1
                id="e1-title"
                className="mt-6 max-w-[25ch] text-[2.1rem] font-semibold leading-[1.09] tracking-tight text-[#061f3d] sm:text-[2.5rem] md:text-[2.85rem] md:leading-[1.08]"
              >
                {hero.title}
              </h1>

              <p className="mt-6 max-w-[46ch] text-[15px] leading-8 text-slate-600 md:text-[17px]">
                {hero.lead}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={localizedPath(locale, "/contact")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-[#08a99d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08a99d] focus-visible:ring-offset-2"
                >
                  {hero.primaryCta}
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>

                <Link
                  href="#ihr-weg"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-[#08264a] shadow-sm transition hover:border-[#08a99d] hover:text-[#08a99d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08a99d] focus-visible:ring-offset-2"
                >
                  {hero.secondaryCta}
                </Link>
              </div>

              <p className="mt-4 text-[13px] text-slate-500">{hero.primaryNote}</p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative lg:pl-10">
              {/* The mullion. One hairline, only on desktop, only where the two
                  columns meet — the first trace of the frame. */}
              <span
                aria-hidden="true"
                className="absolute -top-6 bottom-[-1.5rem] left-0 hidden w-px bg-[linear-gradient(180deg,transparent_0%,rgba(8,38,74,0.16)_22%,rgba(8,38,74,0.16)_78%,transparent_100%)] lg:block"
              />

              <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/75 p-6 shadow-[0_18px_45px_-28px_rgba(8,38,74,0.4)] backdrop-blur-sm md:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#08a99d]">
                  {hero.markersLabel}
                </p>
                <ul className="mt-5 space-y-4">
                  {hero.markers.map((marker) => (
                    <li key={marker} className="flex items-start gap-3.5">
                      <span
                        aria-hidden="true"
                        className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-[#08a99d]"
                      />
                      <span className="text-[14.5px] leading-7 text-[#08264a]">
                        {marker}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
