"use client";

import { useJourneyVariant } from "@/components/journey/use-journey-variant";
import StageWindow from "@/components/journey/exploration/StageWindow";
import StageFlight from "@/components/journey/exploration/StageFlight";
import type { JourneyCopy } from "./content";

/**
 * E4 — Ihr Weg.
 *
 * A mount point, not an implementation. E4 is the window-and-flight sequence
 * built and approved in /dev/crystal-exploration, used here exactly as it
 * stands:
 *
 *   StageWindow   the lattice on the glass, the two casement leaves opening
 *                 outward on real hinges, the sky arriving behind them, and
 *                 the first distant sight of the airliner
 *   StageFlight   the approach, the airliner simplifying into a folded paper
 *                 plane, and the paper plane carrying the remaining stops
 *
 * The two are mounted in that order because the sequence is continuous: the
 * aircraft that appears at the far end of the window's opening is the same one
 * StageFlight grows. Nothing between them, and nothing added on top.
 *
 * WHY STAGEWINDOW'S LATTICE MATTERS HERE
 * It is built from the same seed and the same journey mode as everything else
 * in the crystal system, so what swings away on the glass is recognisably the
 * lattice the reader has been looking at since E1. That is what makes E4 read
 * as the next state of one system rather than as a different animation.
 *
 * WHY IT SITS OUTSIDE THE E1–E3 WRAPPER
 * EmployerEnvironment watches its own parent with an IntersectionObserver and
 * stops when that parent leaves the viewport. Mounting E4 inside that wrapper
 * would hold the parent on screen and leave two animation systems running at
 * once. Out here the environment fades against the hand-off band and then
 * stops, so exactly one loop is ever live.
 *
 * NOT StageJourney. That stage — the seven milestones lit along the lattice —
 * is the exploration's other Journey interpretation. It stays in the
 * exploration, where it belongs, and is no longer mounted in production.
 */

export type EmployerJourneyProps = { journey: JourneyCopy };

export default function EmployerJourney({ journey }: EmployerJourneyProps) {
  /* The same hook the exploration uses, so the mobile and reduced-motion
     fallbacks resolve identically in both places. */
  const { simplified } = useJourneyVariant();

  return (
    <>
      <StageWindow simplified={simplified} copy={journey.window} />
      <StageFlight simplified={simplified} copy={journey.flight} />

      {/* The seven approved milestones, for anyone the cinematic sequence does
          not reach. E4 reveals the journey progressively by design and never
          lists it, so without this the process is available to a sighted
          scroller and to nobody else. */}
      <div className="sr-only">
        <h2>CareRadar — die Meilensteine des Verfahrens</h2>
        <ol>
          {journey.milestones.map((m) => (
            <li key={m.no}>
              {m.no} — {m.label}. {m.detail}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
