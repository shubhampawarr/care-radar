"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  GraduationCap,
  Landmark,
  Plane,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/locale";
import CurrencySwitch, { type Currency } from "@/components/CurrencySwitch";
import ProcessAudienceDoors, {
  type ProcessAudience,
} from "@/components/ProcessAudienceDoors";

type PathwayId = "degree" | "gnm" | "anm";

type QualificationChoice = {
  id: "bsc" | "pbbsc" | "msc" | "gnm" | "anm";
  label: string;
  pathwayId: PathwayId;
};

// Same abbreviations are used verbatim in both locales, so this list isn't localized.
const qualificationChoices: QualificationChoice[] = [
  { id: "bsc", label: "B.Sc", pathwayId: "degree" },
  { id: "pbbsc", label: "PB B.Sc", pathwayId: "degree" },
  { id: "msc", label: "M.Sc", pathwayId: "degree" },
  { id: "gnm", label: "GNM", pathwayId: "gnm" },
  { id: "anm", label: "ANM", pathwayId: "anm" },
];

const pathwayAccent: Record<PathwayId, string> = {
  degree: "#08a99d",
  gnm: "#b88622",
  anm: "#94a3b8",
};

type StepKind = "milestone" | "phase";

type StepTone =
  | "blue"
  | "gold"
  | "green"
  | "purple"
  | "darkGreen"
  | "grey";

type PathwayStep = {
  kind: StepKind;
  title: string;
  location: string;
  duration: string;
  summary: string;
  work?: string;
  study?: string;
  salary?: string;
  note?: string;
  tone: StepTone;
  icon: LucideIcon;
};

type Pathway = {
  id: PathwayId;
  title: string;
  subtitle: string;
  badge: string;
  outcome: string;
  description: string;
  steps: PathwayStep[];
  extraNote?: string;
};

const toneClasses: Record<
  StepTone,
  {
    card: string;
    icon: string;
    pill: string;
    border: string;
  }
> = {
  blue: {
    card: "border-[#315f86]/15 bg-[#f5f9fc]",
    icon: "bg-[#315f86] text-white",
    pill: "bg-[#315f86]/10 text-[#315f86]",
    border: "bg-[#315f86]",
  },
  gold: {
    card: "border-[#b88622]/20 bg-[#fbf5e7]",
    icon: "bg-[#b88622] text-white",
    pill: "bg-[#b88622]/10 text-[#8a6419]",
    border: "bg-[#b88622]",
  },
  green: {
    card: "border-[#177e68]/20 bg-[#eaf7f1]",
    icon: "bg-[#177e68] text-white",
    pill: "bg-[#177e68]/10 text-[#126a58]",
    border: "bg-[#177e68]",
  },
  purple: {
    card: "border-[#655096]/20 bg-[#f0ecfb]",
    icon: "bg-[#655096] text-white",
    pill: "bg-[#655096]/10 text-[#4d3d73]",
    border: "bg-[#655096]",
  },
  darkGreen: {
    card: "border-[#0f6b55]/20 bg-[#e7f5ef]",
    icon: "bg-[#0f6b55] text-white",
    pill: "bg-[#0f6b55]/10 text-[#0f6b55]",
    border: "bg-[#0f6b55]",
  },
  grey: {
    card: "border-slate-200 bg-slate-50",
    icon: "bg-slate-600 text-white",
    pill: "bg-slate-200 text-slate-700",
    border: "bg-slate-500",
  },
};

const toneHex: Record<StepTone, string> = {
  blue: "#315f86",
  gold: "#b88622",
  green: "#177e68",
  purple: "#655096",
  darkGreen: "#0f6b55",
  grey: "#94a3b8",
};

const pageText = {
  en: {
    hero: {
      eyebrow: "CareRadar Process",
      title: "Your pathway to nursing in Germany.",
      description:
        "Choose your current nursing qualification and follow the route towards working in Germany. The pathway shows language preparation, recognition, work options, study load, salary stages, and long-term progression.",
      primary: "Create Account",
      secondary: "Contact CareRadar",
    },
    selector: {
      title: "Your Prospect",
      eyebrow: "Choose your starting point",
      description:
        "Each qualification route has a different journey. Select the route that best matches your current nursing background.",
    },
    audienceDoors: {
      eyebrow: "CareRadar Process",
      title: "Which door is yours?",
      description:
        "The process looks different for nursing candidates and healthcare employers. Choose the path that matches your role to see the right journey.",
      hint: "Click a door to enter",
      candidate: {
        label: "For Candidates",
        subtitle: "Nurses exploring careers in Germany",
        cta: "Enter as candidate",
      },
      employer: {
        label: "For Employers",
        subtitle: "Hospitals and clinics hiring nurses",
        cta: "Enter as employer",
      },
      backLabel: "Choose a different path",
    },
    employerProcess: {
      eyebrow: "Employer Recruitment Flow",
      title: "From requirement to candidate coordination",
      description:
        "CareRadar helps healthcare employers create a clearer recruitment path before candidates move into deeper selection, interview, or placement stages.",
      steps: [
        {
          title: "Share hiring requirement",
          description:
            "Tell CareRadar about your nursing recruitment needs, role expectations, location, and candidate preferences.",
        },
        {
          title: "Understand candidate fit",
          description:
            "Candidate profiles can be reviewed with attention to experience, communication, readiness, and basic suitability.",
        },
        {
          title: "Coordinate next steps",
          description:
            "CareRadar supports the early recruitment flow between candidates and employer-side requirements.",
        },
        {
          title: "Move toward selection",
          description:
            "Suitable candidates can progress toward interviews, documentation, and placement coordination.",
        },
      ],
      primaryCta: "Enquire as Employer",
      secondaryCta: "View employer services",
    },
    labels: {
      location: "Location",
      duration: "Timeline",
      work: "Work",
      study: "Study",
      salary: "Expected salary",
      milestoneSalary: "Typical salary from here",
      note: "Note",
      outcome: "Outcome",
      selected: "Selected route",
      indicative: "Indicative",
      milestone: "Milestone",
      activities: "Activities",
      selectRoute: "View this route",
      startingQualification: "Starting qualification",
    },
    cost: {
      eyebrow: "Candidate Cost",
      title: "You pay 0€ in recruitment fees.",
      description:
        "From start to finish, candidates pay no recruitment fee. Employer-funded support may include language training, qualification recognition, flights, and first accommodation support, subject to the final agreed programme structure.",
      points: [
        "No recruitment fee",
        "No debt-based placement model",
        "Real job pathway before commitment",
        "Support through language, recognition, visa, and arrival stages",
      ],
    },
    promises: {
      eyebrow: "Our Promise",
      title: "You are not expected to navigate this alone.",
      description:
        "CareRadar is designed around clarity, structured guidance, and long-term support for candidates moving towards a healthcare career in Germany.",
      items: [
        "A real, named job pathway before commitment",
        "Support at every major stage",
        "Fair pay expectations based on German healthcare structures",
        "Guidance continues after arrival, not just before departure",
      ],
    },
    studyFirst: {
      eyebrow: "Alternative Route",
      title: "Study-first alternative",
      description:
        "For B.Sc candidates or strong GNM candidates, there may be a study-first route. This can skip the assistant phase and focus on full-time preparation in Germany before progressing towards Pflegefachkraft recognition.",
      details:
        "This route may involve roughly 4–6 months of full-time exam preparation, 6–8 hours per day of study, little or no income during that period, and faster movement towards licensing.",
    },
    salary: {
      eyebrow: "Salary Progression",
      title: "Indicative monthly pay along this route",
      free: "0€ recruitment fees",
      note: "Gross monthly salary estimates. Final pay may vary by employer, tariff, shift/weekend allowances, and individual recognition route.",
    },
    disclaimer:
      "Timelines, salaries, study load, recognition routes, and final outcomes are indicative. They may vary depending on employer, tariff, authority decision, individual profile, documentation, and final recognition route.",
    cta: {
      eyebrow: "Next Step",
      title: "Ready to understand your route?",
      description:
        "Create an account or contact CareRadar to understand which pathway may fit your qualification and career goals.",
      primary: "Create Account",
      secondary: "Contact CareRadar",
    },
  },
  de: {
    hero: {
      eyebrow: "CareRadar Prozess",
      title: "Ihr Weg in die Pflege in Deutschland.",
      description:
        "Wählen Sie Ihre aktuelle Pflegequalifikation und entdecken Sie Ihren Weg in eine Pflegekarriere in Deutschland. Der Weg zeigt Sprachvorbereitung, Anerkennung, Arbeitsmöglichkeiten, Lernaufwand, Gehaltsstufen und langfristige Entwicklung.",
      primary: "Konto erstellen",
      secondary: "CareRadar kontaktieren",
    },
    selector: {
      title: "Ihre Aussichten",
      eyebrow: "Wählen Sie Ihren Startpunkt",
      description:
        "Jede Qualifikation hat einen anderen Weg. Wählen Sie die Route, die am besten zu Ihrem aktuellen Pflegehintergrund passt.",
    },
    audienceDoors: {
      eyebrow: "CareRadar Prozess",
      title: "Welche Tür gehört zu Ihnen?",
      description:
        "Der Prozess sieht für Pflegekandidaten und Arbeitgeber im Gesundheitswesen unterschiedlich aus. Wählen Sie den Weg, der zu Ihrer Rolle passt.",
      hint: "Klicken Sie auf eine Tür",
      candidate: {
        label: "Für Kandidaten",
        subtitle: "Pflegekräfte mit Karriereziel Deutschland",
        cta: "Als Kandidat eintreten",
      },
      employer: {
        label: "Für Arbeitgeber",
        subtitle: "Krankenhäuser und Kliniken, die Pflegekräfte suchen",
        cta: "Als Arbeitgeber eintreten",
      },
      backLabel: "Anderen Weg wählen",
    },
    employerProcess: {
      eyebrow: "Rekrutierungsablauf für Arbeitgeber",
      title: "Von der Anforderung zur Kandidatenkoordination",
      description:
        "CareRadar hilft Arbeitgebern im Gesundheitswesen, einen klareren Rekrutierungsweg zu schaffen, bevor Kandidaten in tiefere Auswahl-, Interview- oder Vermittlungsphasen übergehen.",
      steps: [
        {
          title: "Personalbedarf mitteilen",
          description:
            "Teilen Sie CareRadar Ihren Bedarf an Pflegekräften, Rollenerwartungen, Standort und Kandidatenpräferenzen mit.",
        },
        {
          title: "Kandidatenpassung verstehen",
          description:
            "Kandidatenprofile können mit Blick auf Erfahrung, Kommunikation, Bereitschaft und grundlegende Eignung geprüft werden.",
        },
        {
          title: "Nächste Schritte koordinieren",
          description:
            "CareRadar unterstützt den frühen Rekrutierungsablauf zwischen Kandidaten und Arbeitgeberanforderungen.",
        },
        {
          title: "In Richtung Auswahl gehen",
          description:
            "Geeignete Kandidaten können in Richtung Interviews, Dokumentation und Vermittlungskoordination weitergeführt werden.",
        },
      ],
      primaryCta: "Als Arbeitgeber anfragen",
      secondaryCta: "Arbeitgeber-Leistungen ansehen",
    },
    labels: {
      location: "Ort",
      duration: "Zeitrahmen",
      work: "Arbeit",
      study: "Lernen",
      salary: "Erwartetes Gehalt",
      milestoneSalary: "Typisches Gehalt ab hier",
      note: "Hinweis",
      outcome: "Ergebnis",
      selected: "Ausgewählte Route",
      indicative: "Richtwert",
      milestone: "Meilenstein",
      activities: "Aktivitäten",
      selectRoute: "Diesen Weg ansehen",
      startingQualification: "Startqualifikation",
    },
    cost: {
      eyebrow: "Kosten für Kandidaten",
      title: "Sie zahlen 0€ Rekrutierungsgebühren.",
      description:
        "Von Anfang bis Ende zahlen Kandidaten keine Rekrutierungsgebühr. Arbeitgeberfinanzierte Unterstützung kann Sprachtraining, Anerkennung, Flüge und Unterstützung bei der ersten Unterkunft umfassen, abhängig von der finalen Programmstruktur.",
      points: [
        "Keine Rekrutierungsgebühr",
        "Kein schuldenbasiertes Vermittlungsmodell",
        "Echter Jobweg vor der Verpflichtung",
        "Unterstützung bei Sprache, Anerkennung, Visum und Ankunft",
      ],
    },
    promises: {
      eyebrow: "Unser Versprechen",
      title: "Sie müssen diesen Weg nicht allein gehen.",
      description:
        "CareRadar basiert auf Klarheit, strukturierter Begleitung und langfristiger Unterstützung für Kandidaten auf dem Weg in eine Pflegekarriere in Deutschland.",
      items: [
        "Unterstützung in jeder wichtigen Phase",
        "Faire Gehaltserwartungen nach deutschen Gesundheitsstrukturen",
        "Begleitung auch nach der Ankunft, nicht nur vor der Abreise",
      ],
    },
    studyFirst: {
      eyebrow: "Alternative Route",
      title: "Studium-zuerst-Alternative",
      description:
        "Für B.Sc-Kandidaten oder starke GNM-Kandidaten kann es eine Studium-zuerst-Route geben. Diese kann die Assistenzphase überspringen und sich auf Vollzeitvorbereitung in Deutschland konzentrieren, bevor der Weg zur Anerkennung als Pflegefachkraft weitergeht.",
      details:
        "Diese Route kann etwa 4–6 Monate Vollzeit-Prüfungsvorbereitung, 6–8 Stunden Lernen pro Tag, wenig oder kein Einkommen in dieser Zeit und einen schnelleren Weg zur Lizenzierung bedeuten.",
    },
    salary: {
      eyebrow: "Gehaltsentwicklung",
      title: "Richtwerte für monatliches Gehalt entlang dieser Route",
      free: "0€ Rekrutierungsgebühren",
      note: "Bruttomonatsgehalt als Richtwert. Das finale Gehalt kann je nach Arbeitgeber, Tarif, Schicht-/Wochenendzuschlägen und individuellem Anerkennungsweg variieren.",
    },
    disclaimer:
      "Zeitrahmen, Gehälter, Lernaufwand, Anerkennungswege und finale Ergebnisse sind Richtwerte. Sie können je nach Arbeitgeber, Tarif, Behördenentscheidung, individuellem Profil, Dokumentation und finalem Anerkennungsweg variieren.",
    cta: {
      eyebrow: "Nächster Schritt",
      title: "Bereit, Ihren Weg zu gehen?",
      description:
        "Erstellen Sie ein Konto oder kontaktieren Sie CareRadar, um zu verstehen, welcher Weg zu Ihrer Qualifikation und Ihren Karrierezielen passen kann.",
      primary: "Konto erstellen",
      secondary: "CareRadar kontaktieren",
    },
  },
} as const;

const pathwaysText: Record<Locale, Pathway[]> = {
  en: [
    {
      id: "degree",
      title: "Degree route",
      subtitle: "B.Sc / Post-Basic B.Sc / M.Sc",
      badge: "Registered nurse background",
      outcome: "Pathway towards Pflegefachkraft and specialist progression",
      description:
        "For candidates with a nursing degree, the pathway focuses on language preparation, moving to Germany as an assistant in recognition, completing the knowledge exam, and progressing towards full nurse recognition.",
      steps: [
        {
          kind: "milestone",
          title: "B.Sc / Post-Basic B.Sc / M.Sc",
          location: "India",
          duration: "Starting qualification",
          summary: "You begin from a recognised nursing degree background.",
          note: "Registered nurse profile.",
          tone: "blue",
          icon: GraduationCap,
        },
        {
          kind: "phase",
          title: "Language A1 → B2",
          location: "India",
          duration: "6–12 months",
          summary:
            "You study German while keeping your India-based role or study structure active.",
          study: "3–5 hours per day",
          note: "Document dossier and apostille preparation run alongside this stage.",
          tone: "gold",
          icon: BookOpenCheck,
        },
        {
          kind: "phase",
          title: "Assistant in Germany",
          location: "Germany",
          duration: "In recognition",
          summary:
            "You move to Germany and begin work as an assistant while your recognition path continues.",
          salary: "€2,300–2,900 / month",
          tone: "gold",
          icon: BriefcaseBusiness,
        },
        {
          kind: "phase",
          title: "Kenntnisprüfung",
          location: "Germany",
          duration: "4–6 months",
          summary:
            "You prepare for and complete the knowledge exam required for recognition.",
          work: "Assistant role, 38.5–40 hours per week",
          study: "2–3 hours per day in the evenings",
          tone: "green",
          icon: ClipboardCheck,
        },
        {
          kind: "milestone",
          title: "Pflegefachkraft",
          location: "Germany",
          duration: "After recognition",
          summary:
            "After successful recognition, you progress into full nurse status.",
          salary: "€3,300–4,100 / month",
          tone: "darkGreen",
          icon: Stethoscope,
        },
        {
          kind: "phase",
          title: "Fachweiterbildung",
          location: "Germany",
          duration: "12–24 months",
          summary:
            "Optional further training after gaining experience as a recognised nurse.",
          work: "Fachkraft role",
          study: "1–2 hours per day",
          note: "Usually after roughly 1–2 years of experience.",
          tone: "green",
          icon: Landmark,
        },
        {
          kind: "milestone",
          title: "Specialist",
          location: "Germany",
          duration: "Long-term progression",
          summary:
            "You can progress into a specialist nursing role after further training.",
          salary: "€3,900–4,900 / month",
          tone: "darkGreen",
          icon: Sparkles,
        },
      ],
    },
    {
      id: "gnm",
      title: "GNM route",
      subtitle: "General Nursing and Midwifery",
      badge: "Diploma background",
      outcome: "Pathway towards Pflegefachkraft through adaptation course",
      description:
        "For GNM candidates, the route includes German language preparation, assistant work in Germany, and an adaptation course towards full nurse recognition.",
      extraNote:
        "A strong GNM candidate may be able to sit the Kenntnisprüfung instead of the adaptation course. Another option is to complete a Post-Basic B.Sc in India first and then follow the Degree route.",
      steps: [
        {
          kind: "milestone",
          title: "GNM",
          location: "India",
          duration: "Starting qualification",
          summary: "You begin from a General Nursing and Midwifery diploma.",
          note: "Diploma profile.",
          tone: "blue",
          icon: GraduationCap,
        },
        {
          kind: "phase",
          title: "Language A1 → B2",
          location: "India",
          duration: "6–12 months",
          summary:
            "You study German while keeping your India-based role or study structure active.",
          study: "3–5 hours per day",
          note: "Document dossier preparation runs alongside this stage.",
          tone: "gold",
          icon: BookOpenCheck,
        },
        {
          kind: "phase",
          title: "Assistant in Germany",
          location: "Germany",
          duration: "In recognition",
          summary:
            "You begin work as an assistant while continuing towards formal recognition.",
          salary: "€2,300–2,900 / month",
          tone: "gold",
          icon: BriefcaseBusiness,
        },
        {
          kind: "phase",
          title: "Anpassungslehrgang",
          location: "Germany",
          duration: "6–12 months",
          summary:
            "You complete the adaptation course route required for recognition.",
          work: "Assistant role, €2,300–2,900 / month",
          study: "1–2 hours per day",
          note: "30–39 hours per week plus theory.",
          tone: "green",
          icon: ClipboardCheck,
        },
        {
          kind: "milestone",
          title: "Pflegefachkraft",
          location: "Germany",
          duration: "After recognition",
          summary:
            "After completing the route, you progress into full nurse status.",
          salary: "€3,300–4,100 / month",
          tone: "darkGreen",
          icon: Stethoscope,
        },
      ],
    },
    {
      id: "anm",
      title: "ANM route",
      subtitle: "Auxiliary Nurse Midwife",
      badge: "2-year qualification",
      outcome:
        "Assistant career route, with upgrade required for full nurse route",
      description:
        "ANM candidates cannot move directly to Pflegefachkraft through this route. The pathway can support assistant career options, or candidates can upgrade to GNM in India first and then follow the GNM route.",
      extraNote:
        "ANM cannot directly reach Pflegefachkraft. To get there, upgrade from ANM to GNM in India, then follow the GNM lane.",
      steps: [
        {
          kind: "milestone",
          title: "ANM",
          location: "India",
          duration: "Starting qualification",
          summary: "You begin from a 2-year ANM qualification.",
          tone: "blue",
          icon: GraduationCap,
        },
        {
          kind: "phase",
          title: "Language + relocate",
          location: "India + Germany",
          duration: "8–12 months",
          summary:
            "You prepare language and relocation steps for an assistant career pathway.",
          work: "Assistant role, €2,300–2,900 / month",
          study: "None or exam/course depending on case",
          salary: "€2,300–2,900 / month",
          tone: "grey",
          icon: Plane,
        },
        {
          kind: "milestone",
          title: "Assistant career",
          location: "Germany",
          duration: "Long-term assistant route",
          summary:
            "You can continue in an assistant career unless you later upgrade your qualification route.",
          salary: "€2,300–2,900 / month",
          tone: "grey",
          icon: BriefcaseBusiness,
        },
      ],
    },
  ],
  de: [
    {
      id: "degree",
      title: "Degree-Route",
      subtitle: "B.Sc / Post-Basic B.Sc / M.Sc",
      badge: "Registrierter Pflegehintergrund",
      outcome: "Weg zur Pflegefachkraft und späteren Spezialisierung",
      description:
        "Für Kandidaten mit Pflegeabschluss konzentriert sich der Weg auf Sprachvorbereitung, Arbeit in Deutschland als Assistenzkraft in Anerkennung, Kenntnisprüfung und Anerkennung als Pflegefachkraft.",
      steps: [
        {
          kind: "milestone",
          title: "B.Sc / Post-Basic B.Sc / M.Sc",
          location: "Indien",
          duration: "Startqualifikation",
          summary:
            "Sie starten mit einem anerkennungsrelevanten Pflegeabschluss.",
          note: "Profil als registrierte Pflegekraft.",
          tone: "blue",
          icon: GraduationCap,
        },
        {
          kind: "phase",
          title: "Sprache A1 → B2",
          location: "Indien",
          duration: "6–12 Monate",
          summary:
            "Sie lernen Deutsch, während Ihre Tätigkeit oder Studienstruktur in Indien weiterläuft.",
          study: "3–5 Stunden pro Tag",
          note: "Dokumentenmappe und Apostille-Vorbereitung laufen parallel.",
          tone: "gold",
          icon: BookOpenCheck,
        },
        {
          kind: "phase",
          title: "Assistenz in Deutschland",
          location: "Deutschland",
          duration: "In Anerkennung",
          summary:
            "Sie ziehen nach Deutschland und arbeiten als Assistenzkraft, während der Anerkennungsweg weiterläuft.",
          salary: "€2.300–2.900 / Monat",
          tone: "gold",
          icon: BriefcaseBusiness,
        },
        {
          kind: "phase",
          title: "Kenntnisprüfung",
          location: "Deutschland",
          duration: "4–6 Monate",
          summary:
            "Sie bereiten sich auf die Kenntnisprüfung vor und absolvieren diese für die Anerkennung.",
          work: "Assistenzrolle, 38,5–40 Stunden pro Woche",
          study: "2–3 Stunden pro Tag abends",
          tone: "green",
          icon: ClipboardCheck,
        },
        {
          kind: "milestone",
          title: "Pflegefachkraft",
          location: "Deutschland",
          duration: "Nach Anerkennung",
          summary:
            "Nach erfolgreicher Anerkennung arbeiten Sie als Pflegefachkraft.",
          salary: "€3.300–4.100 / Monat",
          tone: "darkGreen",
          icon: Stethoscope,
        },
        {
          kind: "phase",
          title: "Fachweiterbildung",
          location: "Deutschland",
          duration: "12–24 Monate",
          summary:
            "Optionale Weiterbildung nach Erfahrung als anerkannte Pflegefachkraft.",
          work: "Fachkraft-Rolle",
          study: "1–2 Stunden pro Tag",
          note: "In der Regel nach etwa 1–2 Jahren Erfahrung.",
          tone: "green",
          icon: Landmark,
        },
        {
          kind: "milestone",
          title: "Spezialist",
          location: "Deutschland",
          duration: "Langfristige Entwicklung",
          summary:
            "Nach weiterer Qualifikation ist eine Entwicklung zur Spezialistenrolle möglich.",
          salary: "€3.900–4.900 / Monat",
          tone: "darkGreen",
          icon: Sparkles,
        },
      ],
    },
    {
      id: "gnm",
      title: "GNM-Route",
      subtitle: "General Nursing and Midwifery",
      badge: "Diplom-Hintergrund",
      outcome: "Weg zur Pflegefachkraft über Anpassungslehrgang",
      description:
        "Für GNM-Kandidaten umfasst die Route Deutschvorbereitung, Assistenzarbeit in Deutschland und einen Anpassungslehrgang zur Anerkennung als Pflegefachkraft.",
      extraNote:
        "Ein starker GNM-Kandidat kann eventuell die Kenntnisprüfung statt des Anpassungslehrgangs absolvieren. Eine weitere Option ist ein Post-Basic B.Sc in Indien, um anschließend der Degree-Route zu folgen.",
      steps: [
        {
          kind: "milestone",
          title: "GNM",
          location: "Indien",
          duration: "Startqualifikation",
          summary:
            "Sie starten mit einem General Nursing and Midwifery Diplom.",
          note: "Diplomprofil.",
          tone: "blue",
          icon: GraduationCap,
        },
        {
          kind: "phase",
          title: "Sprache A1 → B2",
          location: "Indien",
          duration: "6–12 Monate",
          summary:
            "Sie lernen Deutsch, während Ihre Tätigkeit oder Studienstruktur in Indien weiterläuft.",
          study: "3–5 Stunden pro Tag",
          note: "Dokumentenvorbereitung läuft parallel.",
          tone: "gold",
          icon: BookOpenCheck,
        },
        {
          kind: "phase",
          title: "Assistenz in Deutschland",
          location: "Deutschland",
          duration: "In Anerkennung",
          summary:
            "Sie arbeiten als Assistenzkraft, während der Weg zur Anerkennung weiterläuft.",
          salary: "€2.300–2.900 / Monat",
          tone: "gold",
          icon: BriefcaseBusiness,
        },
        {
          kind: "phase",
          title: "Anpassungslehrgang",
          location: "Deutschland",
          duration: "6–12 Monate",
          summary:
            "Sie absolvieren den Anpassungslehrgang für die Anerkennung.",
          work: "Assistenzrolle, €2.300–2.900 / Monat",
          study: "1–2 Stunden pro Tag",
          note: "30–39 Stunden pro Woche plus Theorie.",
          tone: "green",
          icon: ClipboardCheck,
        },
        {
          kind: "milestone",
          title: "Pflegefachkraft",
          location: "Deutschland",
          duration: "Nach Anerkennung",
          summary:
            "Nach Abschluss des Weges arbeiten Sie als Pflegefachkraft.",
          salary: "€3.300–4.100 / Monat",
          tone: "darkGreen",
          icon: Stethoscope,
        },
      ],
    },
    {
      id: "anm",
      title: "ANM-Route",
      subtitle: "Auxiliary Nurse Midwife",
      badge: "2-jährige Qualifikation",
      outcome:
        "Assistenz-Karriereweg, mit Upgrade für die volle Pflegefachkraft-Route",
      description:
        "ANM-Kandidaten können nicht direkt zur Pflegefachkraft wechseln. Die Route kann Assistenzkarrieren unterstützen, oder Kandidaten können zuerst in Indien auf GNM upgraden und dann der GNM-Route folgen.",
      extraNote:
        "ANM kann Pflegefachkraft nicht direkt erreichen. Dafür ist ein Upgrade von ANM zu GNM in Indien erforderlich, anschließend folgt die GNM-Route.",
      steps: [
        {
          kind: "milestone",
          title: "ANM",
          location: "Indien",
          duration: "Startqualifikation",
          summary: "Sie starten mit einer 2-jährigen ANM-Qualifikation.",
          tone: "blue",
          icon: GraduationCap,
        },
        {
          kind: "phase",
          title: "Sprache + Umzug",
          location: "Indien + Deutschland",
          duration: "8–12 Monate",
          summary:
            "Sie bereiten Sprache und Umzugsschritte für einen Assistenz-Karriereweg vor.",
          work: "Assistenzrolle, €2.300–2.900 / Monat",
          study: "Kein oder fallabhängiger Prüfungs-/Kursweg",
          salary: "€2.300–2.900 / Monat",
          tone: "grey",
          icon: Plane,
        },
        {
          kind: "milestone",
          title: "Assistenz-Karriere",
          location: "Deutschland",
          duration: "Langfristige Assistenzroute",
          summary:
            "Sie können in einer Assistenzkarriere bleiben, sofern Sie später Ihre Qualifikation nicht upgraden.",
          salary: "€2.300–2.900 / Monat",
          tone: "grey",
          icon: BriefcaseBusiness,
        },
      ],
    },
  ],
};

type ProcessPathwayClientProps = {
  locale: Locale;
  initialAudience?: ProcessAudience | null;
};

function localizedHref(locale: Locale, href: string) {
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

export default function ProcessPathwayClient({
  locale,
  initialAudience = null,
}: ProcessPathwayClientProps) {
  const text = pageText[locale];
  const pathways = pathwaysText[locale];

  const [audience, setAudience] = useState<ProcessAudience | null>(
    initialAudience,
  );
  const [selectedChoiceId, setSelectedChoiceId] = useState<
    QualificationChoice["id"] | null
  >(null);
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [eurInrRate, setEurInrRate] = useState<number | null>(null);

  // Audience lives only in component state: leaving /process unmounts this
  // component, so coming back always lands on the doors again.
  const selectAudience = useCallback((next: ProcessAudience) => {
    setAudience(next);
    setSelectedChoiceId(null);
  }, []);

  const resetAudience = useCallback(() => {
    setAudience(null);
    setSelectedChoiceId(null);
  }, []);

  const selectedChoice = useMemo(
    () => qualificationChoices.find((choice) => choice.id === selectedChoiceId) ?? null,
    [selectedChoiceId],
  );

  const selectedPathway = useMemo(() => {
    if (!selectedChoice) return null;
    return pathways.find((pathway) => pathway.id === selectedChoice.pathwayId) ?? null;
  }, [pathways, selectedChoice]);

  const titleWords = text.selector.title.split(" ");

  if (!audience) {
    return (
      <ProcessAudienceDoors
        eyebrow={text.audienceDoors.eyebrow}
        title={text.audienceDoors.title}
        description={text.audienceDoors.description}
        hint={text.audienceDoors.hint}
        candidate={text.audienceDoors.candidate}
        employer={text.audienceDoors.employer}
        onSelect={selectAudience}
      />
    );
  }

  return (
    <>
      <div className="border-b border-slate-100 bg-white px-5 py-3 md:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={resetAudience}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#08264a] shadow-sm transition hover:border-[#08a99d] hover:text-[#08a99d]"
          >
            <ArrowLeft size={16} />
            {text.audienceDoors.backLabel}
          </button>
        </div>
      </div>

      {audience === "employer" ? (
        <AnimatePresence mode="wait">
          <motion.section
            key="employer-process"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-[#f7fbff] px-5 py-12 md:px-8 md:py-16"
          >
            <div className="mx-auto max-w-7xl">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
                  {text.employerProcess.eyebrow}
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
                  {text.employerProcess.title}
                </h1>
                <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
                  {text.employerProcess.description}
                </p>
              </div>

              <div className="mt-10 space-y-4">
                {text.employerProcess.steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 * index,
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex gap-4 rounded-[1.4rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:border-[#08a99d]/25 hover:shadow-lg hover:shadow-slate-100 md:p-6"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#08264a] text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#08264a]">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href={localizedHref(locale, "/contact")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-[#08a99d]"
                >
                  {text.employerProcess.primaryCta} <ArrowRight size={17} />
                </Link>
                <Link
                  href={localizedHref(locale, "/employers")}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] shadow-sm transition hover:border-[#08a99d] hover:text-[#08a99d]"
                >
                  {text.employerProcess.secondaryCta}
                </Link>
              </div>
            </div>
          </motion.section>
        </AnimatePresence>
      ) : (
        <>
      {/* HERO — dark premium: staggered headline + glass pills strung on a glowing thread */}
      <section className="relative overflow-hidden bg-[#061f3d] px-5 py-12 md:px-8 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,#0d3a66_0%,#061f3d_52%,#040f22_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_72%)]" />
        <motion.div
          className="absolute -left-28 top-6 h-80 w-80 rounded-full bg-[#08a99d]/25 blur-3xl"
          animate={{ x: [0, 18, 0], y: [0, 26, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-16 -right-28 h-96 w-96 rounded-full bg-[#2563eb]/15 blur-3xl"
          animate={{ x: [0, -16, 0], y: [0, -22, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5eead4]"
          >
            {text.selector.eyebrow}
          </motion.p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {titleWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className={`inline-block ${
                  index === titleWords.length - 1
                    ? "bg-gradient-to-r from-[#2dd4bf] to-[#5eead4] bg-clip-text text-transparent"
                    : ""
                }`}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.1 + index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
                {index < titleWords.length - 1 ? " " : ""}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300/90 md:text-[15px] md:leading-7"
          >
            {text.selector.description}
          </motion.p>

          {/* the thread: pills strung on a glowing line */}
          <div className="relative mt-10">
            <motion.div
              className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 sm:block"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(45,212,191,0.65) 18%, rgba(45,212,191,0.65) 82%, transparent)",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
            />

            <div className="relative flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {qualificationChoices.map((choice, index) => {
                const isSelected = choice.id === selectedChoiceId;
                const hex = pathwayAccent[choice.pathwayId];

                return (
                  <motion.button
                    key={choice.id}
                    type="button"
                    onClick={() => {
                      setSelectedChoiceId(choice.id);
                      requestAnimationFrame(() => {
                        document
                          .getElementById("pathway")
                          ?.scrollIntoView({ behavior: "smooth" });
                      });
                    }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.55 + index * 0.08,
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                    }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative rounded-full px-5 py-2.5 text-sm font-bold tracking-tight backdrop-blur transition-colors duration-300"
                    style={
                      isSelected
                        ? {
                            backgroundColor: hex,
                            color: "#04162c",
                            boxShadow: `0 0 26px ${hex}59, 0 0 0 1px ${hex}`,
                          }
                        : {
                            backgroundColor: "rgba(255,255,255,0.06)",
                            color: "#e2e8f0",
                            boxShadow: "0 0 0 1px rgba(255,255,255,0.16)",
                          }
                    }
                  >
                    {isSelected && (
                      <motion.span
                        className="pointer-events-none absolute inset-0 rounded-full"
                        style={{ boxShadow: `0 0 0 1.5px ${hex}` }}
                        initial={{ opacity: 0.7, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.35 }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    )}
                    {choice.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PATHWAY — only appears once a qualification is selected, animates in */}
      <AnimatePresence mode="wait">
        {selectedPathway && selectedChoice && (
          <motion.div
            key={selectedChoice.id}
            initial={{ opacity: 0, y: 56 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <CurrencySwitch
              currency={currency}
              onCurrencyChange={setCurrency}
              onRateChange={setEurInrRate}
              locale={locale}
            />

            <section id="pathway" className="bg-white px-5 py-8 md:px-8 md:py-10">
              <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-[#f7fbff] px-4 py-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#08a99d]">
                      {text.labels.selected}
                    </p>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {text.labels.startingQualification}: {selectedChoice.label}
                    </p>
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#061f3d] md:text-4xl">
                    {selectedPathway.title}
                    <span className="text-[#08a99d]"> · </span>
                    <span className="text-[#08a99d]">{selectedPathway.subtitle}</span>
                  </h2>

                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    {selectedPathway.description}
                  </p>
                </div>

                <div
                  className={`mx-auto mt-6 grid gap-3 ${
                    selectedPathway.extraNote
                      ? "max-w-4xl sm:grid-cols-2"
                      : "max-w-xl"
                  }`}
                >
                  <div className="rounded-2xl border border-slate-100 bg-[#f7fbff] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {text.labels.outcome}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold leading-6 text-[#08264a]">
                      {selectedPathway.outcome}
                    </p>
                  </div>

                  {selectedPathway.extraNote && (
                    <div className="rounded-2xl border border-[#b88622]/20 bg-[#fbf5e7] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6419]">
                        {text.labels.note}
                      </p>
                      <p className="mt-1.5 text-sm leading-6 text-[#5f4513]">
                        {selectedPathway.extraNote}
                      </p>
                    </div>
                  )}
                </div>

                <PathwayTimeline
                  pathway={selectedPathway}
                  text={text}
                  currency={currency}
                  eurInrRate={eurInrRate}
                  locale={locale}
                />
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}
    </>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-6 text-[#08264a]">
        {value}
      </p>
    </div>
  );
}

function PathwayTimeline({
  pathway,
  text,
  currency,
  eurInrRate,
  locale,
}: {
  pathway: Pathway;
  text: (typeof pageText)[Locale];
  currency: Currency;
  eurInrRate: number | null;
  locale: Locale;
}) {
  const gradientStops = pathway.steps
    .map((step, index) => {
      const pct =
        pathway.steps.length > 1
          ? (index / (pathway.steps.length - 1)) * 100
          : 0;
      return `${toneHex[step.tone]} ${pct}%`;
    })
    .join(", ");

  return (
    <div className="relative mt-8">
      <div className="mx-auto mb-5 flex max-w-max items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 shadow-sm">
        <ArrowRight size={12} className="text-[#08a99d]" />
        {text.labels.duration}
      </div>

      <div className="relative">
        {/* edge fade affordances for horizontal scroll */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-gradient-to-r from-white to-transparent md:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-white to-transparent md:w-16" />

        <div className="relative overflow-x-auto pb-6">
          <div className="relative flex min-w-max items-start px-8">
            {/* the horizontal spine, spans the full scrollable width, draws in on mount */}
            <motion.div
              className="pointer-events-none absolute left-8 right-8 top-[124px] h-[3px] rounded-full opacity-90 shadow-sm"
              style={{
                backgroundImage: `linear-gradient(to right, ${gradientStops})`,
                transformOrigin: "left",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />

            {pathway.steps.map((step, index) => {
              const tone = toneClasses[step.tone];
              const hex = toneHex[step.tone];
              const Icon = step.icon;
              const isMilestone = step.kind === "milestone";

              const activities: { label: string; value: string }[] = [];
              if (step.work)
                activities.push({ label: text.labels.work, value: step.work });
              if (step.study)
                activities.push({ label: text.labels.study, value: step.study });
              if (step.salary)
                activities.push({
                  label: text.labels.salary,
                  value: formatSalaryValue(step.salary, currency, eurInrRate, locale),
                });
              if (step.note)
                activities.push({ label: text.labels.note, value: step.note });

              return (
                <motion.div
                  key={`${pathway.id}-${step.title}`}
                  className={`relative flex shrink-0 flex-col items-center px-4 text-center ${
                    isMilestone ? "w-[210px]" : "w-[252px]"
                  }`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.06 }}
                >
                  {/* ABOVE THE LINE: milestones surface their icon + title here */}
                  <div className="flex h-24 w-full flex-col items-center justify-end gap-1.5">
                    {isMilestone && (
                      <>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] ${tone.pill}`}
                        >
                          {text.labels.milestone}
                        </span>
                        <h3 className="text-sm font-semibold leading-tight tracking-tight text-[#061f3d]">
                          {step.title}
                        </h3>
                      </>
                    )}
                  </div>

                  {/* ON THE LINE: the marker itself */}
                  <div className="relative z-10 flex h-14 w-full items-center justify-center">
                    {isMilestone ? (
                      <motion.div
                        className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg ring-[6px] ring-white"
                        style={{ backgroundColor: hex }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.3 + index * 0.07,
                          type: "spring",
                          stiffness: 300,
                          damping: 16,
                        }}
                      >
                        <Icon size={24} className="text-white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="h-4 w-4 rounded-full shadow ring-[6px] ring-white"
                        style={{ backgroundColor: hex }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.3 + index * 0.07,
                          type: "spring",
                          stiffness: 300,
                          damping: 16,
                        }}
                      />
                    )}
                  </div>

                  {/* BELOW THE LINE: duration (and location) */}
                  <div className="flex w-full flex-col items-center gap-1 pt-3">
                    {isMilestone ? (
                      <span className="text-[11px] italic text-slate-400">
                        {step.duration}
                      </span>
                    ) : (
                      <span
                        className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]"
                        style={{ backgroundColor: `${hex}1a`, color: hex }}
                      >
                        {step.duration}
                      </span>
                    )}
                    <span className="text-[10px] uppercase tracking-[0.1em] text-slate-400">
                      {step.location}
                    </span>
                  </div>

                  {/* CARD: activities / objectives for this stage */}
                  <div
                    className={`mt-4 w-full rounded-[1.25rem] border p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${tone.card}`}
                  >
                    {!isMilestone && (
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone.icon}`}
                        >
                          <Icon size={17} />
                        </div>
                        <h4 className="text-sm font-semibold leading-tight tracking-tight text-[#061f3d]">
                          {step.title}
                        </h4>
                      </div>
                    )}

                    <p
                      className={`text-xs leading-5 text-slate-600 ${!isMilestone ? "mt-3" : ""}`}
                    >
                      {step.summary}
                    </p>

                    {isMilestone && step.salary && (
                      <div className="mt-3 rounded-xl bg-white/80 px-3 py-2">
                        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                          {text.labels.milestoneSalary}
                        </p>
                        <p className="text-xs font-semibold text-[#08264a]">
                          {formatSalaryValue(
                            step.salary,
                            currency,
                            eurInrRate,
                            locale,
                          )}
                        </p>
                      </div>
                    )}

                    {!isMilestone && activities.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {activities.map((activity) => (
                          <InfoBlock
                            key={activity.label}
                            label={activity.label}
                            value={activity.value}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatSalaryValue(
  salary: string,
  currency: Currency,
  eurInrRate: number | null,
  locale: Locale
) {
  if (currency === "EUR" || !eurInrRate) {
    return salary;
  }

  const match = salary.match(/€([\d.,]+)[–-]([\d.,]+)/);

  if (!match) {
    return salary;
  }

  const lowerEuro = Number(match[1].replace(/[^\d]/g, ""));
  const upperEuro = Number(match[2].replace(/[^\d]/g, ""));

  if (!lowerEuro || !upperEuro) {
    return salary;
  }

  const lowerInr = Math.round((lowerEuro * eurInrRate) / 1000) * 1000;
  const upperInr = Math.round((upperEuro * eurInrRate) / 1000) * 1000;

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const suffix = locale === "de" ? " / Monat" : " / month";

  return `≈ ${formatter.format(lowerInr)}–${formatter.format(upperInr)}${suffix}`;
}