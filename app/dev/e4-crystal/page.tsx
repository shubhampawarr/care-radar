import type { Metadata } from "next";
import CrystalPhases, {
  type Phase,
  type PhaseTransition,
} from "@/components/journey/CrystalPhases";

export const metadata: Metadata = {
  title: "E4 · crystalline phase sequence",
  robots: { index: false, follow: false },
};

/**
 * E1 -> E2 -> E3 only. Three phases, two transitions.
 * Copy follows the register of V2 §1: E1 opening statement, E2 recognition of
 * the situation, E3 the fork.
 */
const PHASES: readonly [Phase, Phase, Phase] = [
  {
    id: "e1",
    eyebrow: "E1 — Opening",
    title: "International nurse recruitment is a procedure, not a promise.",
    body: "Every step in it is defined, sequenced and accountable. What follows is the whole of it, in the order it actually happens.",
  },
  {
    id: "e2",
    eyebrow: "E2 — The situation",
    title: "Most placements fail somewhere no one was watching.",
    body: "Not at the interview and not at the visa, but in the gaps between them, where responsibility was never named and no one held the file.",
  },
  {
    id: "e3",
    eyebrow: "E3 — The fork",
    title: "Two legal routes lead to the same place.",
    body: "Which one fits depends on your timeline. The choice is made with you, in writing, before anything is filed.",
  },
];

/** Two transitions: L->R then R->L, 180ms spread each. */
const TRANSITIONS: readonly [PhaseTransition, PhaseTransition] = [
  { axis: "lr", spreadMs: 180 },
  { axis: "rl", spreadMs: 180 },
];

/**
 * No leading or trailing spacer: the crystal runs edge to edge between the
 * global header and footer, so the surface is uninterrupted.
 */
export default function E4CrystalPage() {
  return (
    <main className="bg-[#041826]">
      <CrystalPhases seed="e1-e3-crystal" phases={PHASES} transitions={TRANSITIONS} />
    </main>
  );
}
