/**
 * Copy blocks are transcribed verbatim from CARERADAR-E4-BUILD-V2.md §3.
 * Do not edit, shorten or rephrase — German terms stay as written.
 *
 * The copy block never crumples. It scrolls away normally.
 */

export type MilestoneCopyContent = {
  heading: string;
  designValue: string;
  lead: string;
  body: readonly string[];
  leadRole: string;
  yourPart: string;
};

/** §3 preamble — sits above the whole timeline and must remain prominent. */
export const TIMELINE_CAVEAT =
  "Time figures are design values from process planning, not commitments. The Landesprüfungsamt für Gesundheitsberufe decides the procedural route and the duration of recognition case by case.";

export const M1_COPY: MilestoneCopyContent = {
  heading: "M1 — Needs assessment and mandate",
  designValue: "Design value: two to four weeks",
  lead: "Before anyone is recruited, the position is defined.",
  body: [
    "Everything downstream is built against this brief — which is why it is fixed in writing rather than discussed and remembered.",
    "The role profile, the language level at entry, the tolerance on the procedural route, the time window and the cost frame are agreed and set down. The housing question is recorded as a clarification item. Your capacity for Praxisanleitung is captured, because it determines what is possible in the final phase.",
  ],
  leadRole: "CareRadar",
  yourPart: "Named vacancies, decision authority at the table, signature",
};

export const M4_COPY: MilestoneCopyContent = {
  heading: "M4 — Qualification and official procedures",
  designValue: "Parallel, design value: months three to twelve",
  lead: "These three run at the same time.",
  body: [
    "Which is why the phases do not simply add up — and why language progress, not paperwork, usually sets the pace.",
    "Language training runs to the agreed level. The Anerkennungsantrag goes to the Landesprüfungsamt für Gesundheitsberufe with a complete dossier. The visa procedure runs alongside. You initiate the beschleunigtes Fachkräfteverfahren; we prepare the file completely and track every deadline.",
  ],
  leadRole: "CareRadar with language partners and authorities",
  yourPart:
    "Initiation under §81a AufenthG, prompt responses, readiness within the agreed window",
};

export default function MilestoneCopy({
  content,
}: {
  content: MilestoneCopyContent;
}) {
  return (
    <div data-copy-block="" className="mx-auto max-w-2xl px-5 md:px-0">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#08a99d]">
        {content.heading}
      </p>
      <p className="mt-2 text-sm italic text-slate-500">{content.designValue}</p>

      <p className="mt-6 text-xl font-bold leading-snug tracking-tight text-[#061f3d] md:text-2xl">
        {content.lead}
      </p>

      <div className="mt-5 space-y-4 text-[15px] leading-7 text-slate-700">
        {content.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <dl className="mt-6 space-y-1 text-[15px] leading-7 text-slate-700">
        <div className="flex gap-2">
          <dt className="italic text-slate-500">Lead:</dt>
          <dd>{content.leadRole}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 italic text-slate-500">Your part:</dt>
          <dd>{content.yourPart}</dd>
        </div>
      </dl>
    </div>
  );
}
