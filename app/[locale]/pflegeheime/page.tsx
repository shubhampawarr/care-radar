import type { Metadata } from "next";
import EmployerEnvironment from "@/components/employer/EmployerEnvironment";
import EmployerHero from "@/components/employer/EmployerHero";
import EmployerAusgangslage from "@/components/employer/EmployerAusgangslage";
import EmployerSolutions from "@/components/employer/EmployerSolutions";
import EmployerJourney from "@/components/employer/EmployerJourney";
import {
  DRAFT_NOTICE,
  TRANSLATION_STATUS,
  employerContent,
} from "@/components/employer/content";
import { getSafeLocale } from "@/lib/locale";

/**
 * The employer Pflegeheim page.
 *
 * A new route rather than a rewrite of /[locale]/employers. That page is the
 * general employer page and covers hospitals, clinics and care providers; this
 * one is written for Pflegeheim operators specifically, and merging them would
 * cost each its audience.
 *
 * BLOCKS
 *   E1  Hero            implemented
 *   E2  Ausgangslage    implemented
 *   E3  Was wir liefern implemented, ending in the lead-in to E4
 *   E4  Ihr Weg         the Option C Journey from /dev/crystal-exploration,
 *                       mounted through EmployerJourney
 *   E5+ not started. E9's identifier is reserved — do not renumber E10–E14.
 *
 * ONE ENVIRONMENT, ONE GROUND
 * E1–E3 share a single background gradient and a single structural layer rather
 * than owning one each. The sections themselves are transparent, so the ground
 * runs unbroken from the first headline to the hand-off band, and
 * EmployerEnvironment sits behind all three as one system changing state:
 * connected, then constrained, then branched. Three separate grounds and three
 * separate artworks is precisely what made this read as three information
 * sections rather than one continuous space.
 *
 * The canvas is first in the DOM inside the wrapper and every section after it
 * is transparent, so it shows through without any z-index arrangement — and the
 * dark hand-off band, being a later positioned element with its own background,
 * covers it exactly where it should stop.
 */

type PflegeheimeProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PflegeheimeProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const { metadata } = employerContent[locale];

  return { title: metadata.title, description: metadata.description };
}

export default async function PflegeheimePage({ params }: PflegeheimeProps) {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const copy = employerContent[locale];
  const isDraft = TRANSLATION_STATUS[locale] === "draft";

  return (
    <div lang={locale}>
      {/* Shown while a locale's copy has not been signed off. Deliberately
          plain and impossible to mistake for part of the design. */}
      {isDraft ? (
        <p
          role="note"
          className="border-b border-amber-200 bg-amber-50 px-5 py-2 text-center text-[12px] text-amber-900 md:px-8"
        >
          {DRAFT_NOTICE[locale]}
        </p>
      ) : null}

      <div className="relative bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_16%,#f5f9fe_46%,#fafcff_74%,#ffffff_100%)]">
        <EmployerEnvironment />
        <EmployerHero locale={locale} hero={copy.hero} />
        <EmployerAusgangslage situation={copy.situation} />
        <EmployerSolutions solutions={copy.solutions} />
      </div>

      {/* E4 sits OUTSIDE the environment wrapper on purpose. The wrapper is
          what EmployerEnvironment observes; leaving E4 inside it would hold the
          wrapper in view and keep the E1–E3 canvas painting underneath the
          Journey's own loop. Out here the environment has already faded into
          the hand-off band and then stops, so only one system is ever live. */}
      <EmployerJourney journey={copy.journey} />
    </div>
  );
}
