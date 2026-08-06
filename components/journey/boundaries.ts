import type { TurnAxis } from "./surface";

/**
 * The six E4 milestone boundaries.
 *
 * Configuration, not six components. The wave axis and spread vary per
 * boundary so a repeated transition does not read as mechanical — an
 * identical left-to-right sweep six times is what makes it feel like a
 * played effect rather than a material behaviour.
 *
 * M6->M7 is the slowest and the only non-directional turn: it opens from the
 * centre outward and should feel like arrival. M7 itself never turns away —
 * six turns, then stillness, which is the resolution.
 *
 * Used ONLY at milestone boundaries inside E4. E1-E3 and E5-E14 keep the
 * quiet register per V2 §1; if every boundary turned, E4 would stop being
 * the performance.
 */
export type BoundaryConfig = {
  id: string;
  seed: string;
  from: string;
  to: string;
  axis: TurnAxis;
  spreadMs: number;
};

export const E4_BOUNDARIES: readonly BoundaryConfig[] = [
  {
    id: "m1-m2",
    seed: "turn-m1-m2",
    from: "M1 — Needs assessment and mandate",
    to: "M2 — Preselection and selection decision",
    axis: "lr",
    spreadMs: 180,
  },
  {
    id: "m2-m3",
    seed: "turn-m2-m3",
    from: "M2 — Preselection and selection decision",
    to: "M3 — Contract and procedural route",
    axis: "rl",
    spreadMs: 180,
  },
  {
    id: "m3-m4",
    seed: "turn-m3-m4",
    from: "M3 — Contract and procedural route",
    to: "M4 — Qualification and official procedures",
    axis: "tl-br",
    spreadMs: 240,
  },
  {
    id: "m4-m5",
    seed: "turn-m4-m5",
    from: "M4 — Qualification and official procedures",
    to: "M5 — Departure, arrival, first day of work",
    axis: "lr",
    spreadMs: 120,
  },
  {
    id: "m5-m6",
    seed: "turn-m5-m6",
    from: "M5 — Departure, arrival, first day of work",
    to: "M6 — Completing recognition in ongoing operation",
    axis: "br-tl",
    spreadMs: 240,
  },
  {
    id: "m6-m7",
    seed: "turn-m6-m7",
    from: "M6 — Completing recognition in ongoing operation",
    to: "M7 — Qualified nurse status and retention",
    axis: "center",
    spreadMs: 300,
  },
] as const;
