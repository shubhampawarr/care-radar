import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  HeartHandshake,
  SearchCheck,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { getSafeLocale, type Locale } from "@/lib/locale";

const supportIcons = [UsersRound, SearchCheck, FileCheck2, ShieldCheck];
const darkIcons = [Stethoscope, ClipboardCheck, HeartHandshake];

const pageText = {
  en: {
    metadata: {
      title: "For Employers",
      description:
        "CareRadar supports healthcare employers with structured international nurse recruitment, candidate coordination, screening guidance, and ethical hiring support.",
    },
    hero: {
      eyebrow: "For Healthcare Employers",
      title:
        "Recruit international nurses with structure, clarity, and care.",
      description:
        "CareRadar helps healthcare employers connect with qualified nursing candidates through a more organised, ethical, and healthcare-focused recruitment pathway.",
      primary: "Enquire as Employer",
      secondary: "View Process",
      cardEyebrow: "Employer Support",
      cardTitle:
        "International hiring requires more than candidate forwarding.",
      cardNote:
        "CareRadar focuses on responsible recruitment support — organised communication, candidate suitability, and a clear pathway for healthcare employers.",
      heroPoints: [
        "Understand candidate readiness before progressing",
        "Coordinate recruitment communication more clearly",
        "Support early-stage profile and document review",
        "Create a more dependable hiring pathway",
      ],
    },
    intro: {
      eyebrow: "Employer Pathway",
      title:
        "Healthcare hiring needs reliable people and a reliable process.",
      paragraphs: [
        "Recruiting nurses internationally can be complex. Employers need more than a list of names. They need candidates who are prepared, informed, suitable for the role, and able to move through the recruitment journey with clarity.",
        "CareRadar supports healthcare employers by creating a more organised early-stage recruitment experience. The focus is on understanding requirements, coordinating candidate information, supporting communication, and helping suitable candidates progress through the process.",
        "This approach is especially important in healthcare, where hiring decisions affect patient care, team stability, service quality, and long-term workforce planning.",
      ],
    },
    support: {
      eyebrow: "Recruitment Support",
      title: "Structured support for healthcare employers.",
      description:
        "CareRadar helps employers approach international nurse recruitment with better organisation, communication, and candidate readiness.",
      areas: [
        {
          title: "Candidate Coordination",
          description:
            "Support in connecting with nursing candidates who are better prepared for employer conversations.",
        },
        {
          title: "Profile Screening",
          description:
            "A structured early-stage review approach to help understand candidate background, readiness, and suitability.",
        },
        {
          title: "Documentation Clarity",
          description:
            "Better coordination around candidate information, documents, and preparation before moving ahead.",
        },
        {
          title: "Ethical Hiring Support",
          description:
            "Recruitment communication built around transparency, realistic expectations, and long-term fit.",
        },
      ],
    },
    dark: {
      eyebrow: "Why It Matters",
      title: "Strong healthcare teams begin with careful recruitment.",
      description:
        "Nursing recruitment is not only about filling vacancies. It is about bringing suitable professionals into environments where patient care, communication, responsibility, and stability matter every day.",
      cta: "Discuss hiring needs",
      items: [
        {
          title: "Nursing-specific understanding",
          description:
            "The process is focused on nursing and healthcare staffing, not generic recruitment.",
        },
        {
          title: "Organised early-stage coordination",
          description:
            "Candidate communication, profile readiness, and recruitment steps are handled with structure.",
        },
        {
          title: "Human, responsible communication",
          description:
            "CareRadar keeps the candidate experience respectful while supporting employer-side recruitment needs.",
        },
      ],
    },
    employerTypes: {
      eyebrow: "Who We Support",
      title:
        "Built for healthcare organisations with nursing hiring needs.",
      points: [
        "Hospitals seeking qualified nursing professionals",
        "Clinics requiring dependable healthcare staffing support",
        "Care homes and elderly care providers",
        "Healthcare organisations exploring international recruitment channels",
      ],
    },
    process: {
      eyebrow: "Recruitment Flow",
      title:
        "A practical flow from requirement to candidate coordination.",
      description:
        "CareRadar helps employers create a clearer recruitment path before candidates move into deeper selection, interview, or placement stages.",
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
    },
    cta: {
      eyebrow: "Employer Enquiry",
      title: "Looking to recruit international nurses?",
      description:
        "Share your hiring needs with CareRadar and understand how we can support your recruitment pathway.",
      primary: "Enquire Now",
      secondary: "View process",
    },
  },
  de: {
    metadata: {
      title: "Für Arbeitgeber",
      description:
        "CareRadar unterstützt Arbeitgeber im Gesundheitswesen mit strukturierter internationaler Pflegekräfte-Rekrutierung, Kandidatenkoordination, Vorauswahl und ethischer Einstellungsunterstützung.",
    },
    hero: {
      eyebrow: "Für Arbeitgeber im Gesundheitswesen",
      title:
        "Rekrutieren Sie internationale Pflegekräfte mit Struktur, Klarheit und Sorgfalt.",
      description:
        "CareRadar hilft Arbeitgebern im Gesundheitswesen, qualifizierte Pflegefachkräfte über einen besser organisierten, ethischen und gesundheitsorientierten Rekrutierungsweg zu finden.",
      primary: "Als Arbeitgeber anfragen",
      secondary: "Prozess ansehen",
      cardEyebrow: "Arbeitgeber-Unterstützung",
      cardTitle:
        "Internationale Einstellung erfordert mehr als das Weiterleiten von Kandidaten.",
      cardNote:
        "CareRadar konzentriert sich auf verantwortungsvolle Rekrutierungsunterstützung — organisierte Kommunikation, Kandidateneignung und einen klaren Weg für Arbeitgeber im Gesundheitswesen.",
      heroPoints: [
        "Kandidatenbereitschaft verstehen, bevor der Prozess weitergeht",
        "Rekrutierungskommunikation klarer koordinieren",
        "Frühe Profil- und Dokumentenprüfung unterstützen",
        "Einen verlässlicheren Einstellungsweg schaffen",
      ],
    },
    intro: {
      eyebrow: "Weg für Arbeitgeber",
      title:
        "Einstellungen im Gesundheitswesen brauchen verlässliche Menschen und einen verlässlichen Prozess.",
      paragraphs: [
        "Internationale Pflegekräfte-Rekrutierung kann komplex sein. Arbeitgeber benötigen mehr als nur eine Liste von Namen. Sie benötigen Kandidaten, die vorbereitet, informiert, für die Rolle geeignet und in der Lage sind, den Rekrutierungsprozess mit Klarheit zu durchlaufen.",
        "CareRadar unterstützt Arbeitgeber im Gesundheitswesen, indem es eine besser organisierte frühe Rekrutierungserfahrung schafft. Der Fokus liegt darauf, Anforderungen zu verstehen, Kandidateninformationen zu koordinieren, Kommunikation zu unterstützen und geeignete Kandidaten durch den Prozess zu begleiten.",
        "Dieser Ansatz ist im Gesundheitswesen besonders wichtig, da Einstellungsentscheidungen Patientenversorgung, Teamstabilität, Servicequalität und langfristige Personalplanung beeinflussen.",
      ],
    },
    support: {
      eyebrow: "Rekrutierungsunterstützung",
      title: "Strukturierte Unterstützung für Arbeitgeber im Gesundheitswesen.",
      description:
        "CareRadar hilft Arbeitgebern, internationale Pflegekräfte-Rekrutierung mit besserer Organisation, Kommunikation und Kandidatenbereitschaft anzugehen.",
      areas: [
        {
          title: "Kandidatenkoordination",
          description:
            "Unterstützung bei der Verbindung mit Pflegekräften, die besser auf Arbeitgebergespräche vorbereitet sind.",
        },
        {
          title: "Profilprüfung",
          description:
            "Ein strukturierter Ansatz zur frühen Prüfung, um Hintergrund, Bereitschaft und Eignung von Kandidaten besser zu verstehen.",
        },
        {
          title: "Dokumentenklarheit",
          description:
            "Bessere Koordination rund um Kandidateninformationen, Dokumente und Vorbereitung vor den nächsten Schritten.",
        },
        {
          title: "Ethische Einstellungsunterstützung",
          description:
            "Rekrutierungskommunikation, die auf Transparenz, realistischen Erwartungen und langfristiger Passung basiert.",
        },
      ],
    },
    dark: {
      eyebrow: "Warum es wichtig ist",
      title:
        "Starke Teams im Gesundheitswesen beginnen mit sorgfältiger Rekrutierung.",
      description:
        "Pflegekräfte-Rekrutierung bedeutet nicht nur, offene Stellen zu besetzen. Es geht darum, geeignete Fachkräfte in Umgebungen zu bringen, in denen Patientenversorgung, Kommunikation, Verantwortung und Stabilität täglich zählen.",
      cta: "Personalbedarf besprechen",
      items: [
        {
          title: "Pflegespezifisches Verständnis",
          description:
            "Der Prozess ist auf Pflege und Personalbedarf im Gesundheitswesen ausgerichtet, nicht auf allgemeine Rekrutierung.",
        },
        {
          title: "Organisierte frühe Koordination",
          description:
            "Kandidatenkommunikation, Profilbereitschaft und Rekrutierungsschritte werden strukturiert begleitet.",
        },
        {
          title: "Menschliche, verantwortungsvolle Kommunikation",
          description:
            "CareRadar hält die Kandidatenerfahrung respektvoll und unterstützt gleichzeitig die Rekrutierungsanforderungen der Arbeitgeberseite.",
        },
      ],
    },
    employerTypes: {
      eyebrow: "Wen wir unterstützen",
      title:
        "Entwickelt für Gesundheitsorganisationen mit Bedarf an Pflegekräften.",
      points: [
        "Krankenhäuser, die qualifizierte Pflegefachkräfte suchen",
        "Kliniken, die verlässliche Unterstützung bei der Personalgewinnung benötigen",
        "Pflegeheime und Anbieter der Altenpflege",
        "Gesundheitsorganisationen, die internationale Rekrutierungskanäle erkunden",
      ],
    },
    process: {
      eyebrow: "Rekrutierungsablauf",
      title:
        "Ein praktischer Ablauf von der Anforderung bis zur Kandidatenkoordination.",
      description:
        "CareRadar hilft Arbeitgebern, einen klareren Rekrutierungsweg zu schaffen, bevor Kandidaten in tiefere Auswahl-, Interview- oder Vermittlungsphasen übergehen.",
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
    },
    cta: {
      eyebrow: "Arbeitgeberanfrage",
      title: "Möchten Sie internationale Pflegekräfte rekrutieren?",
      description:
        "Teilen Sie CareRadar Ihren Personalbedarf mit und erfahren Sie, wie wir Ihren Rekrutierungsweg unterstützen können.",
      primary: "Jetzt anfragen",
      secondary: "Prozess ansehen",
    },
  },
} as const;

type EmployersProps = {
  params: Promise<{
    locale: string;
  }>;
};

function localizedHref(locale: Locale, href: string) {
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

export async function generateMetadata({
  params,
}: EmployersProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = pageText[locale];

  return {
    title: text.metadata.title,
    description: text.metadata.description,
  };
}

export default async function EmployersPage({ params }: EmployersProps) {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = pageText[locale];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_78%)] px-5 py-10 md:px-8 md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e6eef7_1px,transparent_1px),linear-gradient(to_bottom,#e6eef7_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.18]" />
        <div className="absolute left-[-130px] top-20 h-72 w-72 rounded-full bg-[#08a99d]/10 blur-3xl" />
        <div className="absolute right-[-130px] top-28 h-80 w-80 rounded-full bg-[#08264a]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center md:text-left">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#08a99d]/20 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#087d76] shadow-sm backdrop-blur md:mx-0">
              <Building2 size={14} />
              {text.hero.eyebrow}
            </div>

            <h1 className="mx-auto mt-5 max-w-4xl text-[2.35rem] font-semibold leading-[1.06] tracking-tight text-[#061f3d] sm:text-5xl md:mx-0 md:text-6xl md:leading-[1.04]">
              {text.hero.title}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 md:mx-0 md:text-lg md:leading-8">
              {text.hero.description}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <Link
                href={localizedHref(locale, "/contact")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-[#08a99d]"
              >
                {text.hero.primary} <ArrowRight size={17} />
              </Link>

              <Link
                href={localizedHref(locale, "/process")}
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
                  <HeartHandshake size={24} />
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
                  {text.hero.cardEyebrow}
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#061f3d]">
                  {text.hero.cardTitle}
                </h2>

                <div className="mt-6 space-y-4">
                  {text.hero.heroPoints.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2
                        size={18}
                        className="mt-1 shrink-0 text-[#08a99d]"
                      />
                      <p className="text-sm leading-6 text-slate-600">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 rounded-[1.3rem] border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 h-px w-full bg-gradient-to-r from-[#08a99d] via-slate-100 to-transparent" />
                  <p className="text-sm leading-7 text-slate-600">
                    {text.hero.cardNote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-white px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.intro.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              {text.intro.title}
            </h2>
          </div>

          <div className="rounded-[1.7rem] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100 md:p-8">
            <div className="mb-5 h-px w-full bg-gradient-to-r from-[#08a99d] via-slate-100 to-transparent" />

            <div className="space-y-5 text-sm leading-8 text-slate-600 md:text-base">
              {text.intro.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORT AREAS */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.support.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              {text.support.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {text.support.description}
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {text.support.areas.map((item, index) => {
              const Icon = supportIcons[index] ?? UsersRound;

              return (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#08a99d]/25 hover:shadow-lg hover:shadow-slate-100"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-[#08264a]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DARK SECTION */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#061f3d] shadow-2xl shadow-slate-200">
          <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative p-7 text-white md:p-10">
              <div className="absolute left-0 top-0 h-full w-1 bg-[#08a99d]" />

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#10c4b6]">
                {text.dark.eyebrow}
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                {text.dark.title}
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-300 md:text-base">
                {text.dark.description}
              </p>

              <Link
                href={localizedHref(locale, "/contact")}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#08a99d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#061f3d]"
              >
                {text.dark.cta} <ArrowRight size={17} />
              </Link>
            </div>

            <div className="border-t border-white/10 p-7 md:border-l md:border-t-0 md:p-10">
              <div className="space-y-6">
                {text.dark.items.map((item, index) => {
                  const Icon = darkIcons[index] ?? Stethoscope;

                  return (
                    <div key={item.title}>
                      {index > 0 && <div className="mb-6 h-px bg-white/10" />}

                      <Icon size={26} className="text-[#10c4b6]" />
                      <h3 className="mt-3 text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMPLOYER TYPES */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-7 shadow-xl shadow-slate-100 md:p-10">
          <div className="mx-auto mb-6 h-px max-w-md bg-gradient-to-r from-transparent via-[#08a99d] to-transparent" />

          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
                {text.employerTypes.eyebrow}
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-4xl">
                {text.employerTypes.title}
              </h2>
            </div>

            <div className="space-y-4">
              {text.employerTypes.points.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-1 shrink-0 text-[#08a99d]"
                  />
                  <p className="text-sm leading-7 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.process.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              {text.process.title}
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
              {text.process.description}
            </p>
          </div>

          <div className="space-y-4">
            {text.process.steps.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-4 rounded-[1.4rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:border-[#08a99d]/25 hover:shadow-lg hover:shadow-slate-100"
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
              </div>
            ))}
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
              href={localizedHref(locale, "/contact")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              {text.cta.primary} <ArrowRight size={17} />
            </Link>

            <Link
              href={localizedHref(locale, "/process")}
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