import type { Locale } from "@/lib/locale";

/**
 * Copy for the employer Pflegeheim page, blocks E1–E3.
 *
 * Kept in one module so the text can be edited without touching layout, and so
 * the later blocks (E5–E14) can extend the same shape rather than inventing a
 * second content structure.
 *
 * AUDIENCE
 * Pflegeheime only. Not hospitals, not ambulatory care, not rehabilitation.
 * Every sentence here is written for a Pflegeheim operator and should stay that
 * way — generalising the audience is what turns this back into the existing
 * /employers page, which already covers everyone and therefore no one.
 *
 * REGISTER
 * B2B, understated. No superlatives, no sector statistics, no Fachkräftemangel
 * lecture. The operator lives the shortage daily and does not need it
 * explained; what earns trust is naming their operational reality precisely and
 * then being concrete about what we do.
 *
 * LOCALISATION
 * Keyed by locale and read as `employerContent[locale]`, which is the pattern
 * every other page in this app already uses (see app/[locale]/about/page.tsx).
 * Before this, the module exported a single German object, so /en/pflegeheime
 * rendered German — the language switch was building the right URL the whole
 * time and the page simply ignored it.
 *
 * GERMAN IS THE APPROVED SOURCE. English is marked `draft` in
 * TRANSLATION_STATUS and carries a visible notice, because these sentences
 * describe a statutory recognition procedure and a signed-off German text is
 * not a mandate to publish an English one. Every German legal and institutional
 * name is kept verbatim in the English — Landesprüfungsamt für
 * Gesundheitsberufe, Anerkennungsverfahren, § 16d AufenthG, Fachkraftquote,
 * Aufnahmestopp, Ausbildungsvertrag, Praxisanleitung. Translating those would
 * turn a proper noun into an implied legal equivalence that does not exist.
 *
 * SOURCED CLAIMS — see CARERADAR-E4-BUILD-V2.md
 * The two product descriptions are grounded in the approved E4 build content
 * (M2, M3, M4 and §4 "The Ausbildungskohorte variant") rather than written
 * fresh. Where that document leaves something open, this file leaves it open
 * too. Three constraints carried across deliberately:
 *
 *  1. §113c SGB XI classification of a Pflegekraft in Anerkennung is
 *     UNSTATED, pending clarification with the Pflegekassen. Nothing here may
 *     imply that a candidate in the Anerkennungsverfahren counts toward the
 *     Fachkraftquote. E2 names the quota as the operator's problem; E3 must not
 *     answer it. That is the single easiest way to make this page wrong.
 *  2. No first start window is named for Ausbildungskohorten — the source
 *     lists it as an open item, so timing is simply absent rather than hedged.
 *  3. No durations anywhere in E1–E3. The timeline is E4's, it carries its own
 *     caveat, and duration figures are design values rather than commitments.
 */

export type SolutionRoute = {
  /** Two-digit index, shown as a label. */
  index: string;
  title: string;
  /** One paragraph. What the operator is actually buying. */
  summary: string;
  /** Short factual points. No promises, no durations. */
  points: readonly string[];
  /** One line naming who this route suits. */
  suitedTo: string;
};

export type EmployerCopy = {
  metadata: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryCta: string;
    primaryNote: string;
    secondaryCta: string;
    markersLabel: string;
    markers: readonly string[];
  };
  situation: {
    eyebrow: string;
    title: string;
    statement: string;
    symptomsLabel: string;
    symptoms: readonly { index: string; term: string; note: string }[];
  };
  solutions: {
    eyebrow: string;
    title: string;
    intro: string;
    routes: readonly SolutionRoute[];
    orLabel: string;
    caveat: string;
    handoff: { label: string; title: string; line: string };
  };
  journey: JourneyCopy;
};

/**
 * E4 copy. The seven milestones are the approved M1-M7 of
 * CARERADAR-E4-BUILD-V2.md, one per lattice anchor — the geometry has exactly
 * seven and the choreography is timed against them, so this array is not free
 * to change length.
 *
 * GERMAN WORDING IS NOT SIGNED OFF. The build document sets out M1-M7 in
 * English and states plainly that its working language is English and that the
 * German draft follows once the English structure settles. What is below is a
 * close rendering of that approved substance, carrying no durations and no
 * claim the source does not make. It needs a copy pass before it goes in front
 * of a client. Flagged rather than quietly shipped.
 */
export type JourneyCopy = {
  /**
   * The seven approved milestones. E4's visual is the window and flight
   * sequence, which reveals the journey progressively rather than listing it,
   * so these are carried in the screen-reader outline and are here for E5+ to
   * render properly. Kept available, not displayed all at once.
   */
  milestones: readonly { no: string; label: string; detail: string }[];
  /** E4 part one: the lattice on the glass, and the window opening. */
  window: {
    ariaLabel: string;
    srDescription: string;
    before: { eyebrow: string; title: string; body: string };
    after: { eyebrow: string; title: string; body: string };
    still: { eyebrow: string; title: string; body: string };
  };
  /** E4 part two: sky, airliner, the morph, and the paper plane's stops. */
  flight: {
    ariaLabel: string;
    approach: { eyebrow: string; title: string; body: string };
    morph: { eyebrow: string; title: string; body: string };
    navigator: {
      eyebrow: string;
      fallbackLabel: string;
      fallbackDetail: string;
    };
    stops: readonly { label: string; detail: string; at: number }[];
    still: { eyebrow: string; title: string };
  };
};

/** German is signed off. English is not. */
export const TRANSLATION_STATUS: Record<Locale, "approved" | "draft"> = {
  de: "approved",
  en: "draft",
};

/** Shown only where the status is `draft`. */
export const DRAFT_NOTICE: Record<Locale, string> = {
  de: "",
  en: "Draft translation — the German version is the approved source.",
};

const de: EmployerCopy = {
  metadata: {
    title: "Pflegeheime",
    description:
      "CareRadar begleitet Pflegeheime bei der Gewinnung internationaler Pflegefachkräfte – von der Vermittlung über das Anerkennungsverfahren bis zur Ankunft im Haus.",
  },

  /* ---------------------------------------------------------------- *
   * E1 — Hero
   * ---------------------------------------------------------------- */
  hero: {
    eyebrow: "Für Pflegeheime",
    title:
      "Internationale Pflegefachkräfte für Ihr Pflegeheim – von der Vermittlung bis zur Anerkennung begleitet.",
    lead: "Auswahl, Vertrag, Sprache, Anerkennungsverfahren und Ankunft als ein durchgehender Prozess – mit benannten Zuständigkeiten auf beiden Seiten.",
    primaryCta: "Bedarf klären",
    /* Deliberately modest: a first conversation, not a booking. */
    primaryNote: "Ein erstes Gespräch, unverbindlich.",
    secondaryCta: "Ihr Weg im Überblick",
    markersLabel: "So arbeiten wir",
    /* Three plain markers of how we work. Not benefits, not claims. */
    markers: [
      "Zuständigkeiten in jedem Schritt benannt – bei uns und bei Ihnen",
      "Verfahrensweg vorab schriftlich festgelegt",
      "Zwei Wege: Anerkennung oder Ausbildungskohorte",
    ],
  },

  /* ---------------------------------------------------------------- *
   * E2 — Ausgangslage
   * ---------------------------------------------------------------- */
  situation: {
    eyebrow: "Ausgangslage",
    title: "Der Engpass ist selten der Bewerbermarkt allein.",
    /* Two sentences, as specified. The four operational realities the client
       requires are all present and none of them is softened. */
    statement:
      "Dienstplanlücken, steigende Zeitarbeitskosten und eine angespannte Fachkraftquote belasten den Alltag im Pflegeheim – bis hin zum Aufnahmestopp. Gleichzeitig können Erfahrungen aus früheren Auslandsprojekten und daraus entstandene Fluktuation die Entscheidung für einen neuen Anlauf erschweren.",
    symptomsLabel: "Operative Realität",
    /* Read as a diagnosis, not as features. Each qualifier restates the
       symptom in operational terms and stops. */
    symptoms: [
      {
        index: "01",
        term: "Dienstplanlücken",
        note: "Kurzfristig zu schließen, dauerhaft spürbar.",
      },
      {
        index: "02",
        term: "Zeitarbeitskosten",
        note: "Sie steigen und lassen sich kaum planen.",
      },
      {
        index: "03",
        term: "Fachkraftquote",
        note: "Unterschritten bis hin zum Aufnahmestopp.",
      },
      {
        index: "04",
        term: "Fluktuation",
        note: "Frühere Auslandsprojekte wirken nach.",
      },
    ],
  },

  /* ---------------------------------------------------------------- *
   * E3 — Was wir liefern
   * ---------------------------------------------------------------- */
  solutions: {
    eyebrow: "Was wir liefern",
    title: "Zwei Wege in denselben Prozess.",
    intro:
      "Für Pflegeheime gibt es bei uns genau zwei Zugänge. Sie unterscheiden sich darin, wie die Fachkraftqualifikation entsteht – danach laufen beide durch dieselbe Begleitung.",
    orLabel: "oder",
    routes: [
      {
        index: "01",
        title: "Vermittlung zur Anerkennung als Pflegefachkraft",
        summary:
          "Der Weg für eine bereits im Ausland ausgebildete Pflegefachkraft, die das Anerkennungsverfahren in Deutschland durchläuft. Wir begleiten Auswahl, Vertrag und Verfahren und bereiten die Unterlagen vollständig vor.",
        points: [
          "Auswahl aus Absolventinnen und Absolventen unserer Partner-Colleges; Abschluss und Registrierung werden an der Quelle geprüft.",
          "Sie führen die Auswahlgespräche per Video und benennen Ihre Auswahl schriftlich.",
          "Einsatz auf Basis eines Arbeits- oder Vorvertrags als Pflegekraft in Anerkennung, mit Höhergruppierung bei Erteilung der Urkunde.",
          "Der Verfahrensweg wird vorab schriftlich festgelegt: Anerkennungspartnerschaft nach § 16d AufenthG oder beschleunigtes Fachkräfteverfahren nach § 81a AufenthG.",
          "Sprache, Anerkennungsdossier und Visum laufen parallel; der Antrag geht an das Landesprüfungsamt für Gesundheitsberufe.",
        ],
        suitedTo:
          "Für Häuser, die eine ausgebildete Fachkraft in den laufenden Betrieb holen wollen.",
      },
      {
        index: "02",
        title: "Ausbildungskohorten",
        summary:
          "Der planbare Aufbau statt der Einzelvermittlung: eine Gruppe startet gemeinsam in die dreijährige Pflegeausbildung in Deutschland. Für Häuser, die eine Nachwuchslinie aufbauen statt einzelne Stellen nachzubesetzen.",
        points: [
          "Zertifiziertes B2 vor der Ausreise.",
          "Das Zulassungsdatum der Pflegeschule bestimmt das Tempo des Einstiegs.",
          "Die dreijährige Ausbildung mit staatlicher Abschlussprüfung tritt an die Stelle des Anerkennungsverfahrens.",
          "Ausbildungsvertrag und Schulplatzbestätigung treten an die Stelle des Arbeitsvertrags.",
        ],
        suitedTo:
          "Für Häuser, die eine Pipeline planen und Praxisanleitung stellen können.",
      },
    ],
    /* The source document's own caveat, carried verbatim in substance. It sits
       under both routes because both touch a decision that is not ours. */
    caveat:
      "Über den Verfahrensweg und die Dauer der Anerkennung entscheidet das Landesprüfungsamt für Gesundheitsberufe im Einzelfall.",
    handoff: {
      label: "Als Nächstes",
      title: "Ihr Weg",
      line: "Beide Wege laufen ab hier durch denselben begleiteten Prozess.",
    },
  },

  /* ---------------------------------------------------------------- *
   * E4 — Ihr Weg
   * ---------------------------------------------------------------- */
  journey: {
    milestones: [
      {
        no: "01",
        label: "Bedarf",
        detail:
          "Stellenprofil, Sprachniveau bei Eintritt, Zeitfenster und Kostenrahmen werden schriftlich festgelegt.",
      },
      {
        no: "02",
        label: "Vorauswahl",
        detail:
          "Die Partner-Colleges schlagen geeignete Absolventinnen und Absolventen vor. Sie entscheiden und benennen schriftlich.",
      },
      {
        no: "03",
        label: "Vertrag",
        detail:
          "Arbeits- oder Vorvertrag, Tarifeinstufung und die Entscheidung zwischen § 16d und § 81a AufenthG.",
      },
      {
        no: "04",
        label: "Qualifizierung",
        detail:
          "Sprache, Anerkennungsdossier und Visum laufen parallel – nicht nacheinander.",
      },
      {
        no: "05",
        label: "Ankunft",
        detail:
          "Ausreise, Ankunft, Behördengänge und die Einarbeitung im Haus.",
      },
      {
        no: "06",
        label: "Anerkennung",
        detail:
          "Anpassungslehrgang oder Kenntnisprüfung, neben der Arbeit – mit Freistellung und Praxisanleitung.",
      },
      {
        no: "07",
        label: "Fachkraft",
        detail:
          "Mit der Urkunde: Berufsbezeichnung, Höhergruppierung und der Wechsel zu § 18a AufenthG.",
      },
    ],

    /* The hand-off band above already carries "Ihr Weg" as the threshold, so
       the window stage opens on the substance rather than repeating the title. */
    window: {
      ariaLabel: "Ihr Weg — das Fenster öffnet sich",
      srDescription:
        "Das kristalline Gitter liegt auf dem Glas eines Fensters. An dem Punkt, an dem der Weg ins Ausland führt, öffnet sich das Fenster nach außen und der Blick geht vom Verfahren hinaus in den Himmel.",
      before: {
        eyebrow: "Ihr Weg",
        title: "Bis hierhin ist der Prozess unsere Aufgabe.",
        body: "Bedarf, Vorauswahl, Vertrag, Qualifizierung – Meilensteine in einem System, jeder mit benannter Zuständigkeit.",
      },
      after: {
        eyebrow: "Jenseits des Verfahrens",
        title: "Was danach kommt, ist ein Weg – kein Verfahren.",
        body: "Ein Mensch verlässt ein Land und beginnt in einem anderen zu arbeiten. Das System bringt ihn bis ans Fenster. Es steigt nicht mit ins Flugzeug.",
      },
      still: {
        eyebrow: "Ihr Weg",
        title: "Bis hierhin ist der Prozess unsere Aufgabe.",
        body: "Sieben Meilensteine in einem System. An dem Punkt, an dem der Weg ins Ausland führt, öffnet sich das Fenster und der Blick geht hinaus.",
      },
    },

    flight: {
      ariaLabel: "Ihr Weg — von der Ausreise bis zum ersten Dienst",
      approach: {
        eyebrow: "Die Reise",
        title: "Sechstausend Kilometer, und einer davon ist ein Mensch.",
        body: "Weit genug entfernt, um ein Punkt am Himmel zu sein. Nah genug, um das Einzige im Bild zu sein, das sich bewegt.",
      },
      morph: {
        eyebrow: "Aus Distanz wird Nähe",
        title: "Je näher es kommt, desto weniger ist davon übrig.",
        body: "Detail für Detail fällt von hinten nach vorn weg, bis ein gefaltetes Blatt bleibt – derselbe Weg, im Maßstab eines Menschen.",
      },
      navigator: {
        eyebrow: "Die letzten Etappen",
        fallbackLabel: "Ausreise",
        fallbackDetail:
          "Die verbleibenden Stationen ziehen am Blatt vorbei, nicht umgekehrt.",
      },
      /* Grounded in M4 and M5 of CARERADAR-E4-BUILD-V2.md. `at` is choreography
         input: it places each marker on the route line. */
      stops: [
        { label: "Visum", detail: "Verfahren nach § 16d oder § 81a AufenthG", at: 0.08 },
        { label: "Dossier", detail: "Anerkennungsantrag vollständig eingereicht", at: 0.3 },
        { label: "Ausreise", detail: "Abflug steht, das Haus ist informiert", at: 0.53 },
        { label: "Ankunft", detail: "Abholung, Unterkunft, Behördengänge", at: 0.76 },
        { label: "Erster Dienst", detail: "Einarbeitung und Dienstplan", at: 0.98 },
      ],
      still: {
        eyebrow: "Ihr Weg — die Reise",
        title: "Je näher es kommt, desto weniger ist davon übrig.",
      },
    },
  },
};

/**
 * DRAFT. Not approved copy.
 *
 * Structurally complete so the locale switch works and the English route is
 * real, but every German legal and institutional term is preserved rather than
 * translated. Needs a native review pass before it is shown to a client.
 */
const en: EmployerCopy = {
  metadata: {
    title: "Nursing homes",
    description:
      "CareRadar supports Pflegeheime in recruiting international nursing professionals — from placement through the Anerkennungsverfahren to arrival at the home.",
  },

  hero: {
    eyebrow: "For nursing homes",
    title:
      "International nursing professionals for your nursing home – supported from placement through to recognition.",
    lead: "Selection, contract, language, the Anerkennungsverfahren and arrival as one continuous process – with named responsibilities on both sides.",
    primaryCta: "Clarify your requirement",
    primaryNote: "A first conversation, without obligation.",
    secondaryCta: "Your pathway at a glance",
    markersLabel: "How we work",
    markers: [
      "Responsibilities named at every step – ours and yours",
      "Procedural route agreed in writing, in advance",
      "Two routes: Anerkennung or Ausbildungskohorte",
    ],
  },

  situation: {
    eyebrow: "Situation",
    title: "The bottleneck is rarely the applicant market alone.",
    statement:
      "Gaps in the duty roster, rising agency staffing costs and a strained Fachkraftquote weigh on daily operations in the Pflegeheim – up to and including an Aufnahmestopp. At the same time, experience from earlier international projects, and the turnover that followed, can make the decision to try again harder.",
    symptomsLabel: "Operational reality",
    symptoms: [
      {
        index: "01",
        term: "Roster gaps",
        note: "Closed at short notice, felt for far longer.",
      },
      {
        index: "02",
        term: "Agency costs",
        note: "They rise, and they resist planning.",
      },
      {
        index: "03",
        /* No English equivalent that carries the regulatory meaning. */
        term: "Fachkraftquote",
        note: "Fallen below, up to an Aufnahmestopp.",
      },
      {
        index: "04",
        term: "Turnover",
        note: "Earlier international projects still echo.",
      },
    ],
  },

  solutions: {
    eyebrow: "What we deliver",
    title: "Two routes into the same process.",
    intro:
      "For Pflegeheime there are exactly two ways in. They differ in how the professional qualification comes about – after that, both run through the same support.",
    orLabel: "or",
    routes: [
      {
        index: "01",
        title: "Placement toward recognition as a Pflegefachkraft",
        summary:
          "The route for a nurse already trained abroad who goes through the Anerkennungsverfahren in Germany. We support selection, contract and procedure, and prepare the file in full.",
        points: [
          "Selection from graduates of our partner colleges; degree and registration are verified at source.",
          "You conduct the selection interviews by video and name your selection in writing.",
          "Deployment on an employment or preliminary contract as a Pflegekraft in Anerkennung, with pay regrade on issue of the Urkunde.",
          "The procedural route is set down in writing in advance: Anerkennungspartnerschaft under § 16d AufenthG, or the beschleunigtes Fachkräfteverfahren under § 81a AufenthG.",
          "Language, Anerkennungsdossier and visa run in parallel; the application goes to the Landesprüfungsamt für Gesundheitsberufe.",
        ],
        suitedTo:
          "For homes that want a qualified nurse in ongoing operations.",
      },
      {
        index: "02",
        title: "Ausbildungskohorten",
        summary:
          "Planned build-up rather than individual placement: a group starts the three-year nursing training in Germany together. For homes building a pipeline instead of backfilling single posts.",
        points: [
          "Certified B2 before departure.",
          "The Pflegeschule admission date sets the pace of entry.",
          "The three-year training, with its state final examination, takes the place of the Anerkennungsverfahren.",
          "Ausbildungsvertrag and school place confirmation take the place of the employment contract.",
        ],
        suitedTo:
          "For homes that can plan a pipeline and provide Praxisanleitung.",
      },
    ],
    caveat:
      "The Landesprüfungsamt für Gesundheitsberufe decides the procedural route and the duration of recognition case by case.",
    handoff: {
      label: "Next",
      title: "Your pathway",
      line: "From here, both routes run through the same supported process.",
    },
  },

  journey: {
    milestones: [
      {
        no: "01",
        label: "Requirement",
        detail:
          "Role profile, entry language level, time window and cost frame are set down in writing.",
      },
      {
        no: "02",
        label: "Preselection",
        detail:
          "The partner colleges put forward suitable graduates. You decide, and name your selection in writing.",
      },
      {
        no: "03",
        label: "Contract",
        detail:
          "Employment or preliminary contract, Tarifeinstufung, and the choice between § 16d and § 81a AufenthG.",
      },
      {
        no: "04",
        label: "Qualification",
        detail:
          "Language, Anerkennungsdossier and visa run in parallel — not one after another.",
      },
      {
        no: "05",
        label: "Arrival",
        detail:
          "Departure, arrival, the round of authorities, and induction at the home.",
      },
      {
        no: "06",
        label: "Recognition",
        detail:
          "Anpassungslehrgang or Kenntnisprüfung, alongside the job — with release time and Praxisanleitung.",
      },
      {
        no: "07",
        label: "Registered nurse",
        detail:
          "With the Urkunde: professional title, pay regrade, and the move to § 18a AufenthG.",
      },
    ],

    window: {
      ariaLabel: "Your pathway — the window opens",
      srDescription:
        "The crystalline lattice sits on the glass of a window. At the point where the pathway leads abroad, the window opens outward and the view passes from the procedure to the sky beyond it.",
      before: {
        eyebrow: "Your pathway",
        title: "Up to here, the process is ours to run.",
        body: "Requirement, preselection, contract, qualification — milestones inside one system, each with a named owner.",
      },
      after: {
        eyebrow: "Beyond the procedure",
        title: "What comes next is a journey, not a procedure.",
        body: "Someone leaves one country and starts work in another. The system gets them to the window. It does not get on the plane with them.",
      },
      still: {
        eyebrow: "Your pathway",
        title: "Up to here, the process is ours to run.",
        body: "Seven milestones inside one system. At the point where the pathway leads abroad, the window opens and the view passes to what lies beyond it.",
      },
    },

    flight: {
      ariaLabel: "Your pathway — from departure to the first shift",
      approach: {
        eyebrow: "The journey",
        title: "Six thousand kilometres, and one of them is a person.",
        body: "Far enough away to be a mark in the sky. Close enough to be the only thing in the frame that is moving.",
      },
      morph: {
        eyebrow: "Distance becomes proximity",
        title: "The nearer it gets, the less of it there is.",
        body: "Detail falls away from the tail forward until what is left is a folded sheet — the same journey, at the scale a person holds it.",
      },
      navigator: {
        eyebrow: "The final stages",
        fallbackLabel: "Departure",
        fallbackDetail:
          "The remaining stops pass the sheet rather than the sheet passing them.",
      },
      stops: [
        { label: "Visa", detail: "Procedure under § 16d or § 81a AufenthG", at: 0.08 },
        { label: "Dossier", detail: "Anerkennungsantrag filed in full", at: 0.3 },
        { label: "Departure", detail: "Flight booked, the home informed", at: 0.53 },
        { label: "Arrival", detail: "Met, housed, registered with authorities", at: 0.76 },
        { label: "First shift", detail: "Induction and rostering", at: 0.98 },
      ],
      still: {
        eyebrow: "Your pathway — the journey",
        title: "The nearer it gets, the less of it there is.",
      },
    },
  },
};

export const employerContent: Record<Locale, EmployerCopy> = { de, en };
