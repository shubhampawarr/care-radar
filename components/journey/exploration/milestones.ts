/**
 * The journey, as content.
 *
 * Kept out of the components so the same seven milestones drive the lattice
 * anchors, the DOM labels and the accessible reading order from one source. If
 * the milestone list and the anchor constellation ever disagree the labels drift
 * off their nodes, and that is the kind of error nobody notices in review and
 * everybody notices on the client's screen.
 *
 * Register follows the existing CareRadar copy: procedural, verifiable, no
 * adjectives doing work that a fact should be doing.
 */

export type Milestone = {
  /** Two-digit ordinal as shown. */
  no: string;
  label: string;
  /** One line. It has to survive being read at a glance mid-scroll. */
  detail: string;
};

export const MILESTONES: readonly Milestone[] = [
  { no: "01", label: "Profile", detail: "Qualification, language level and documents on file." },
  { no: "02", label: "Matching", detail: "Candidate and employer aligned against a real vacancy." },
  { no: "03", label: "Application", detail: "Filed with the employer and formally acknowledged." },
  { no: "04", label: "Interview", detail: "Employer decision, in writing, with a named owner." },
  { no: "05", label: "Visa", detail: "Recognition file and consular process run in parallel." },
  { no: "06", label: "Travel", detail: "Departure date fixed. Arrival and housing arranged." },
  { no: "07", label: "Arrival", detail: "First day of work. Recognition completed on the ward." },
] as const;

/**
 * What the paper plane carries after the window opens.
 *
 * Deliberately not the same list. The lattice is the SYSTEM — every step
 * CareRadar is accountable for, seen at once. The flight is the JOURNEY — what
 * one nurse actually does, in sequence, from the point the process leaves the
 * office. The overlap at Visa is the hinge between the two readings and is the
 * reason the window opens where it does.
 */
export type FlightStop = {
  label: string;
  detail: string;
  /** 0..1 position along the flight leg. */
  at: number;
};

export const FLIGHT_STOPS: readonly FlightStop[] = [
  { label: "Visa", detail: "Consular appointment cleared", at: 0.1 },
  { label: "Documents", detail: "Recognition file complete", at: 0.32 },
  { label: "Departure", detail: "Flight booked, ward informed", at: 0.55 },
  { label: "Arrival", detail: "Met, housed, registered", at: 0.78 },
  { label: "First shift", detail: "On the roster", at: 0.98 },
] as const;

/* ------------------------------------------------------------------ *
 * Copy for the three interpretations
 * ------------------------------------------------------------------ */

export type ModeCopy = {
  id: "structural" | "organic" | "journey";
  tag: string;
  title: string;
  metaphor: string;
  body: string;
  /** What this option is actually being tested for. */
  tests: string;
};

export const MODE_COPY: readonly ModeCopy[] = [
  {
    id: "structural",
    tag: "Option A",
    title: "Structural",
    metaphor: "The recruitment process is a structured system.",
    body: "A spanning network on a near-regular grid. Every node is a junction, every line is a dependency, and the whole graph is connected by construction. The most corporate of the three, and the one that holds up best behind dense text.",
    tests: "Precision. Reads as engineering, not decoration.",
  },
  {
    id: "organic",
    tag: "Option B",
    title: "Organic",
    metaphor: "The journey develops step by step.",
    body: "The same network grown on Poisson-disc points instead of a grid: irregular cell sizes, less symmetry, more depth, and enough drift to register as forming rather than fixed. Warmer, and closer to how the process is actually experienced.",
    tests: "Humanity. Whether irregularity still reads as intentional.",
  },
  {
    id: "journey",
    tag: "Option C",
    title: "Journey",
    metaphor: "Every step connects to the next.",
    body: "Seven separated fragments, one per milestone, joined only by routes that are drawn as you scroll. The connection is a real shortest path through the lattice, not a line laid over it — so the system genuinely assembles rather than fading up.",
    tests: "Narrative. Whether milestones can live inside the lattice.",
  },
] as const;

/* ------------------------------------------------------------------ *
 * The questions this prototype exists to answer
 * ------------------------------------------------------------------ */

export const REVIEW_QUESTIONS: readonly { q: string; note: string }[] = [
  {
    q: "Does the lattice read as a system rather than as a crystal object?",
    note: "Facets are cells of one triangulation, so none can overlap another. There is no depth sort anywhere in the renderer.",
  },
  {
    q: "Can milestones live inside the lattice naturally?",
    note: "The seven anchors are real nodes in the graph. The connections between them are shortest paths through it, routed before the lattice was thinned.",
  },
  {
    q: "Does lattice to window feel believable?",
    note: "The frame is present from the first frame and the exterior light sits where the window later opens, so the opening is a consequence rather than a reveal.",
  },
  {
    q: "Does opening the window feel meaningful or gimmicky?",
    note: "Two casements on real hinges, lattice travelling with the glass. If it reads as a trick, the fix is to slow it and cut the travel, not to add to it.",
  },
  {
    q: "Does the airplane earn its place as the next stage?",
    note: "It appears only after the visa milestone, at a scale that says distance. Everything before it was procedure; it is the first thing in the sequence that moves.",
  },
  {
    q: "Is airplane to paper plane elegant?",
    note: "One outline, resampled to a shared point count, interpolated back to front so detail falls away rather than the shape squashing. Never two aircraft on screen.",
  },
] as const;
