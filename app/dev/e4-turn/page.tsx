import type { Metadata } from "next";
import FacetTurn from "@/components/journey/FacetTurn";
import { E4_BOUNDARIES } from "@/components/journey/boundaries";

export const metadata: Metadata = {
  title: "E4 · crystalline facet turn",
  robots: { index: false, follow: false },
};



function Panel({ text }: { text: string }) {
  return (
    <p className="text-center text-sm font-semibold tracking-tight text-[#061f3d] md:text-base">
      {text}
    </p>
  );
}

export default function E4TurnPage() {
  return (
    <main className="bg-[#FBF9F4]">
      <section className="mx-auto max-w-2xl px-5 pb-12 pt-20 md:px-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          E4 prototype · crystalline facet turn
        </p>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          All six milestone boundaries with their configured wave axis and spread. Each facet rotates about
          its own vertical axis through its centroid — flat SVG scaleX, never a
          3D transform — in a left-to-right wave. Scrubbed to scroll: reverse
          direction and it runs backwards exactly.
        </p>
      </section>

      <div className="h-[40vh]" aria-hidden="true" />

      {E4_BOUNDARIES.map((t, i) => (
        <section key={t.id} className="py-[26vh]">
          <p className="mx-auto mb-4 max-w-2xl px-5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 md:px-0">
            Turn {i + 1} of 6 · {t.axis} · {t.spreadMs}ms
          </p>
          <div className="mx-auto max-w-4xl px-4 md:px-8">
            <FacetTurn
              seed={t.seed}
              width={880}
              height={340}
              axis={t.axis}
              spreadMs={t.spreadMs}
              label={`Crystalline surface turning edge-on between ${t.from} and ${t.to}.`}
              outgoing={<Panel text={t.from} />}
              incoming={<Panel text={t.to} />}
            />
          </div>
        </section>
      ))}

      <div className="h-[80vh]" aria-hidden="true" />
    </main>
  );
}
