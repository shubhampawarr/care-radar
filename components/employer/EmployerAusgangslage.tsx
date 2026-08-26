import type { EmployerCopy } from "./content";
import Reveal from "./Reveal";

/**
 * E2 — Ausgangslage.
 *
 * This section has one job: the operator should finish it thinking "they
 * actually understand my operation." It gets two sentences to do that, so
 * everything else in the composition has to stay out of the way.
 *
 * WHY IT LOOKS LIKE A READOUT AND NOT A FEATURE GRID
 * The four symptoms are set as a single hairline-divided strip — no cards, no
 * fills, no icons, no colour coding. Four boxed tiles would read as four things
 * we are selling. A divided strip reads as four findings recorded about the
 * same operation, which is what they are. The typographic weight sits on the
 * terms themselves; the qualifiers underneath restate each in operational
 * language and stop, without moving toward a solution. The solution is E3's
 * job, and taking it early would cost this section its credibility.
 *
 * THE BOTTLENECK IS NOT DRAWN IN THIS FILE
 * The constraint is carried by EmployerEnvironment, the one structural layer
 * shared across E1-E3, which reaches its CONSTRAINED state as this section
 * comes to the centre of the viewport: the field compresses into a single
 * narrow column and two rules close in on it. That is what makes the four
 * symptoms read as pressure on one system rather than as four independent
 * findings, which is the difference this section has to make and cannot make
 * with typography alone.
 *
 * Locally E2 keeps only the fine 48px grid. It is the quietest section on the
 * page by design, and the environment is doing the talking.
 */

export type EmployerAusgangslageProps = {
  situation: EmployerCopy["situation"];
};

export default function EmployerAusgangslage({
  situation,
}: EmployerAusgangslageProps) {

  return (
    <section
      aria-labelledby="e2-title"
      data-env-section="constrained"
      className="relative overflow-hidden"
    >
      {/* The same 48px grid the rest of the site uses for light sections, held
          back from its old 0.5 now that the environment passes through here.
          Grid plus structural field at full strength is two textures arguing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e6eef7_1px,transparent_1px),linear-gradient(to_bottom,#e6eef7_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.32]"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {situation.eyebrow}
            </p>

            <h2
              id="e2-title"
              className="mt-4 max-w-[22ch] text-[1.75rem] font-semibold leading-[1.14] tracking-tight text-[#061f3d] md:text-[2.6rem]"
            >
              {situation.title}
            </h2>

            <p className="mt-6 text-[15px] leading-8 text-slate-600 md:text-[17px] md:leading-9">
              {situation.statement}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 md:mt-20">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.26em] text-slate-400">
              {situation.symptomsLabel}
            </p>

            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {situation.symptoms.map((symptom, index) => (
                <div
                  key={symptom.term}
                  className={[
                    "border-t border-slate-200 py-7 pr-6",
                    index > 0 ? "sm:even:pl-8 lg:pl-8" : "",
                    index > 0 ? "lg:border-l lg:border-slate-200" : "",
                    index === 1 ? "sm:border-l sm:border-slate-200" : "",
                    index === 3 ? "sm:border-l sm:border-slate-200" : "",
                  ].join(" ")}
                >
                  <dt>
                    <span className="block font-mono text-[11px] tracking-[0.18em] text-[#08a99d]">
                      {symptom.index}
                    </span>
                    <span className="mt-3 block text-[1.1rem] font-semibold uppercase leading-[1.2] tracking-[0.08em] text-[#08264a] md:text-[1.2rem]">
                      {symptom.term}
                    </span>
                  </dt>
                  <dd className="mt-3 max-w-[26ch] text-[13.5px] leading-6 text-slate-500">
                    {symptom.note}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
