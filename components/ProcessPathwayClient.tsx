"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeEuro,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  GraduationCap,
  Landmark,
  Plane,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/locale";
import CurrencySwitch, { type Currency } from "@/components/CurrencySwitch";

type PathwayId = "degree" | "gnm" | "anm";

type StepTone =
  | "blue"
  | "gold"
  | "green"
  | "purple"
  | "darkGreen"
  | "grey";

type PathwayStep = {
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
      eyebrow: "Choose Your Starting Point",
      title: "Start with your current qualification.",
      description:
        "Each qualification route has a different journey. Select the route that best matches your current nursing background.",
    },
    labels: {
      location: "Location",
      duration: "Timeline",
      work: "Work",
      study: "Study",
      salary: "Salary",
      note: "Note",
      outcome: "Outcome",
      selected: "Selected route",
      indicative: "Indicative",
    },
    cost: {
      eyebrow: "Candidate Cost",
      title: "You pay €0 in recruitment fees.",
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
      free: "€0 recruitment fees",
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
        "Wählen Sie Ihre aktuelle Pflegequalifikation und folgen Sie dem Weg zur Arbeit in Deutschland. Der Weg zeigt Sprachvorbereitung, Anerkennung, Arbeitsmöglichkeiten, Lernaufwand, Gehaltsstufen und langfristige Entwicklung.",
      primary: "Konto erstellen",
      secondary: "CareRadar kontaktieren",
    },
    selector: {
      eyebrow: "Startpunkt wählen",
      title: "Beginnen Sie mit Ihrer aktuellen Qualifikation.",
      description:
        "Jede Qualifikation hat einen anderen Weg. Wählen Sie die Route, die am besten zu Ihrem aktuellen Pflegehintergrund passt.",
    },
    labels: {
      location: "Ort",
      duration: "Zeitrahmen",
      work: "Arbeit",
      study: "Lernen",
      salary: "Gehalt",
      note: "Hinweis",
      outcome: "Ergebnis",
      selected: "Ausgewählte Route",
      indicative: "Richtwert",
    },
    cost: {
      eyebrow: "Kosten für Kandidaten",
      title: "Sie zahlen €0 Rekrutierungsgebühren.",
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
        "Ein echter, konkreter Jobweg vor der Verpflichtung",
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
      free: "€0 Rekrutierungsgebühren",
      note: "Bruttomonatsgehalt als Richtwert. Das finale Gehalt kann je nach Arbeitgeber, Tarif, Schicht-/Wochenendzuschlägen und individuellem Anerkennungsweg variieren.",
    },
    disclaimer:
      "Zeitrahmen, Gehälter, Lernaufwand, Anerkennungswege und finale Ergebnisse sind Richtwerte. Sie können je nach Arbeitgeber, Tarif, Behördenentscheidung, individuellem Profil, Dokumentation und finalem Anerkennungsweg variieren.",
    cta: {
      eyebrow: "Nächster Schritt",
      title: "Bereit, Ihre Route zu verstehen?",
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
          title: "B.Sc / Post-Basic B.Sc / M.Sc",
          location: "India",
          duration: "Starting qualification",
          summary: "You begin from a recognised nursing degree background.",
          note: "Registered nurse profile.",
          tone: "blue",
          icon: GraduationCap,
        },
        {
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
          title: "GNM",
          location: "India",
          duration: "Starting qualification",
          summary: "You begin from a General Nursing and Midwifery diploma.",
          note: "Diploma profile.",
          tone: "blue",
          icon: GraduationCap,
        },
        {
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
          title: "ANM",
          location: "India",
          duration: "Starting qualification",
          summary: "You begin from a 2-year ANM qualification.",
          tone: "blue",
          icon: GraduationCap,
        },
        {
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
          title: "ANM",
          location: "Indien",
          duration: "Startqualifikation",
          summary: "Sie starten mit einer 2-jährigen ANM-Qualifikation.",
          tone: "blue",
          icon: GraduationCap,
        },
        {
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
};

function localizedHref(locale: Locale, href: string) {
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

export default function ProcessPathwayClient({
  locale,
}: ProcessPathwayClientProps) {
  const text = pageText[locale];
  const pathways = pathwaysText[locale];

  const [selectedPathwayId, setSelectedPathwayId] =
    useState<PathwayId>("degree");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [eurInrRate, setEurInrRate] = useState<number | null>(null);

  const selectedPathway = useMemo(() => {
    return (
      pathways.find((pathway) => pathway.id === selectedPathwayId) ??
      pathways[0]
    );
  }, [pathways, selectedPathwayId]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_76%)] px-5 py-10 md:px-8 md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e6eef7_1px,transparent_1px),linear-gradient(to_bottom,#e6eef7_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.18]" />
        <div className="absolute left-[-130px] top-20 h-72 w-72 rounded-full bg-[#08a99d]/10 blur-3xl" />
        <div className="absolute right-[-130px] top-28 h-80 w-80 rounded-full bg-[#08264a]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center lg:text-left">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#08a99d]/20 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#087d76] shadow-sm backdrop-blur lg:mx-0">
              <ClipboardCheck size={14} />
              {text.hero.eyebrow}
            </div>

            <h1 className="mx-auto mt-5 max-w-4xl text-[2.35rem] font-semibold leading-[1.06] tracking-tight text-[#061f3d] sm:text-5xl md:text-6xl lg:mx-0 lg:leading-[1.04]">
              {text.hero.title}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 md:text-lg md:leading-8 lg:mx-0">
              {text.hero.description}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href={localizedHref(locale, "/login")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-[#08a99d]"
              >
                {text.hero.primary} <ArrowRight size={17} />
              </Link>

              <Link
                href={localizedHref(locale, "/contact")}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] shadow-sm transition hover:border-[#08a99d] hover:text-[#08a99d]"
              >
                {text.hero.secondary}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 rounded-[2.4rem] bg-gradient-to-br from-[#08a99d]/15 via-white to-[#08264a]/10 blur-xl" />

            <div className="relative rounded-[2rem] border border-white bg-white p-5 shadow-2xl shadow-slate-200">
              <div className="rounded-[1.5rem] border border-slate-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_52%,#eafffb_100%)] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
                  <CircleDot size={24} />
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
                  {text.selector.eyebrow}
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#061f3d]">
                  {text.selector.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {text.selector.description}
                </p>

                <div className="mt-6 rounded-2xl border border-[#08a99d]/20 bg-[#08a99d]/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#08a99d] text-white">
                      <BadgeEuro size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#061f3d]">
                        {text.salary.free}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {locale === "en"
                          ? "Salary figures are shown as indicative gross monthly pay."
                          : "Gehaltsangaben sind Richtwerte für monatliches Bruttogehalt."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {pathways.map((pathway) => {
                    const isSelected = pathway.id === selectedPathwayId;

                    return (
                      <button
                        key={pathway.id}
                        type="button"
                        onClick={() => setSelectedPathwayId(pathway.id)}
                        className={`group w-full overflow-hidden rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-[#08a99d] bg-[linear-gradient(135deg,#ecfffb_0%,#ffffff_100%)] shadow-lg shadow-[#08a99d]/10"
                            : "border-slate-100 bg-white hover:-translate-y-0.5 hover:border-[#08a99d]/30 hover:bg-[#f7fbff] hover:shadow-md hover:shadow-slate-100"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-[#061f3d] transition group-hover:text-[#08a99d]">
                              {pathway.subtitle}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {pathway.badge}
                            </p>
                          </div>

                          {isSelected && (
                            <CheckCircle2
                              size={18}
                              className="mt-0.5 shrink-0 text-[#08a99d]"
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CurrencySwitch
        currency={currency}
        onCurrencyChange={setCurrency}
        onRateChange={setEurInrRate}
        locale={locale}
      />

      {/* PATHWAY */}
      <section
        id="pathway"
        className="bg-white px-5 py-12 md:px-8 md:py-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
                {text.labels.selected}
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
                {selectedPathway.title}
              </h2>

              <p className="mt-3 text-lg font-semibold text-[#08a99d]">
                {selectedPathway.subtitle}
              </p>

              <p className="mt-5 text-sm leading-8 text-slate-600 md:text-base">
                {selectedPathway.description}
              </p>

              <div className="mt-6 rounded-[1.5rem] border border-slate-100 bg-[#f7fbff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {text.labels.outcome}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#08264a]">
                  {selectedPathway.outcome}
                </p>
              </div>

              {selectedPathway.extraNote && (
                <div className="mt-4 rounded-[1.5rem] border border-[#b88622]/20 bg-[#fbf5e7] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6419]">
                    {text.labels.note}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#5f4513]">
                    {selectedPathway.extraNote}
                  </p>
                </div>
              )}

              <SalaryProgress
                pathway={selectedPathway}
                locale={locale}
                currency={currency}
                eurInrRate={eurInrRate}
              />
            </div>

            <div className="relative">
              <div className="absolute left-5 top-0 hidden h-full w-px bg-slate-200 md:block" />

              <div className="space-y-5">
                {selectedPathway.steps.map((step, index) => {
                  const tone = toneClasses[step.tone];
                  const Icon = step.icon;

                  return (
                    <div
                      key={`${selectedPathway.id}-${step.title}`}
                      className={`relative overflow-hidden rounded-[1.7rem] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:ml-10 md:p-6 ${tone.card}`}
                    >
                      <div
                        className={`absolute left-0 top-0 h-full w-1 ${tone.border}`}
                      />
                      <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-white/40" />

                      <div
                        className={`absolute -left-[3.7rem] top-6 hidden h-10 w-10 items-center justify-center rounded-full shadow-sm md:flex ${tone.icon}`}
                      >
                        {index + 1}
                      </div>

                      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone.icon}`}
                          >
                            <Icon size={23} />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-xl font-semibold tracking-tight text-[#061f3d]">
                                {step.title}
                              </h3>

                              <span
                                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${tone.pill}`}
                              >
                                {text.labels.indicative}
                              </span>
                            </div>

                            <p className="mt-3 text-sm leading-7 text-slate-600">
                              {step.summary}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
                        <InfoBlock
                          label={text.labels.location}
                          value={step.location}
                        />
                        <InfoBlock
                          label={text.labels.duration}
                          value={step.duration}
                        />
                        {step.work && (
                          <InfoBlock
                            label={text.labels.work}
                            value={step.work}
                          />
                        )}
                        {step.study && (
                          <InfoBlock
                            label={text.labels.study}
                            value={step.study}
                          />
                        )}
                        {step.salary && (
                          <InfoBlock
                            label={text.labels.salary}
                            value={formatSalaryValue(
                              step.salary,
                              currency,
                              eurInrRate,
                              locale
                            )}
                          />
                        )}
                        {step.note && (
                          <InfoBlock
                            label={text.labels.note}
                            value={step.note}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STUDY + COST */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-[#655096]/20 bg-[#f0ecfb] p-7 shadow-xl shadow-slate-100 md:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#655096] text-white">
              <GraduationCap size={24} />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#655096]">
              {text.studyFirst.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d]">
              {text.studyFirst.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-700">
              {text.studyFirst.description}
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-[#655096]/20 bg-white/70 p-5">
              <p className="text-sm leading-7 text-slate-700">
                {text.studyFirst.details}
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-xl shadow-slate-100 md:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
              <BadgeEuro size={24} />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.cost.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d]">
              {text.cost.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {text.cost.description}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {text.cost.points.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-[#f7fbff] p-4"
                >
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-[#08a99d]"
                  />
                  <p className="text-sm font-semibold leading-6 text-[#08264a]">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROMISE */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#061f3d] shadow-2xl shadow-slate-200">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative p-7 text-white md:p-10">
              <div className="absolute left-0 top-0 h-full w-1 bg-[#08a99d]" />

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#10c4b6]">
                {text.promises.eyebrow}
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                {text.promises.title}
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-300 md:text-base">
                {text.promises.description}
              </p>

              <Link
                href={localizedHref(locale, "/login")}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#08a99d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#061f3d]"
              >
                {text.cta.primary} <ArrowRight size={17} />
              </Link>
            </div>

            <div className="border-t border-white/10 p-7 md:p-10 lg:border-l lg:border-t-0">
              <div className="space-y-5">
                {text.promises.items.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-[#10c4b6]"
                    />
                    <p className="text-sm leading-7 text-slate-200">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#10c4b6]">
                  {text.labels.note}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {text.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-7 text-center shadow-xl shadow-slate-100 md:p-12">
          <div className="mx-auto mb-5 h-px max-w-md bg-gradient-to-r from-transparent via-[#08a99d] to-transparent" />

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
            {text.cta.eyebrow}
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
            {text.cta.title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            {text.cta.description}
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={localizedHref(locale, "/login")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              {text.cta.primary} <ArrowRight size={17} />
            </Link>

            <Link
              href={localizedHref(locale, "/contact")}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
            >
              {text.cta.secondary}
            </Link>
          </div>
        </div>
      </section>
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

function SalaryProgress({
  pathway,
  locale,
  currency,
  eurInrRate,
}: {
  pathway: Pathway;
  locale: Locale;
  currency: Currency;
  eurInrRate: number | null;
}) {
  const salarySteps = pathway.steps.filter((step) => step.salary);
  const text = pageText[locale].salary;

  if (salarySteps.length === 0) {
    return null;
  }

  return (
    <div className="mt-7 overflow-hidden rounded-[1.7rem] border border-[#08a99d]/20 bg-[linear-gradient(135deg,#ecfffb_0%,#ffffff_50%,#f7fbff_100%)] p-5 shadow-lg shadow-slate-100">
      <div className="flex flex-col gap-4 md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#08a99d]">
            {text.eyebrow}
          </p>

          <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#061f3d]">
            {text.title}
          </h3>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#08a99d] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#08a99d]/20">
          <BadgeEuro size={18} />
          {text.free}
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {salarySteps.map((step) => (
          <div
            key={`${pathway.id}-${step.title}-salary`}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              {step.title}
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-[#061f3d]">
              {formatSalaryValue(
                step.salary ?? "",
                currency,
                eurInrRate,
                locale
              )}
            </p>

            <p className="mt-2 text-xs font-semibold text-[#08a99d]">
              {step.location}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-6 text-slate-500">{text.note}</p>
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