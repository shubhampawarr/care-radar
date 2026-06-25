import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeEuro,
  Building2,
  CheckCircle2,
  FileCheck2,
  Globe2,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { getSafeLocale, type Locale } from "@/lib/locale";

const pageText = {
  en: {
    hero: {
      eyebrow: "International Nursing Pathways",
      title: "A clearer route from nursing qualification to Germany.",
      description:
        "CareRadar helps nurses understand their pathway to working in Germany while supporting employers and partners with a structured, ethical, and human recruitment approach.",
      primary: "View Process",
      secondary: "Create Account",
      note:
        "CareRadar is built as an information and trust platform first. Candidates can understand the process, routes, costs, timelines, and support before moving into the account area.",
      promiseLabel: "CareRadar Promise",
      promiseTitle: "We really do care.",
      promiseDescription:
        "A structured pathway with clarity, dignity, and long-term support.",
      values: ["Care", "Clarity", "Trust"],
    },
    trustPoints: [
      "Qualification-based pathways for Degree, GNM, and ANM candidates",
      "Clear process guidance before portal-based applications",
      "€0 recruitment fee promise for candidates",
      "Founder-led support built around responsible recruitment",
    ],
    intro: {
      eyebrow: "What CareRadar Does",
      title: "An information-first platform for nursing careers in Germany.",
      paragraphs: [
        "CareRadar helps nursing candidates understand what their current qualification can lead to in Germany. Instead of presenting a confusing recruitment journey, the website explains the pathway in plain language.",
        "The public website focuses on trust, company information, founder credibility, and the process. Detailed candidate profiles, documents, application tracking, and admin workflows will belong inside the dashboard and portal.",
        "This keeps the website simple for visitors while giving CareRadar a strong foundation for the full recruitment portal in the next phase.",
      ],
    },
    help: {
      eyebrow: "Who CareRadar Helps",
      title: "Built for candidates, employers, and partners.",
      description:
        "The public site gives each visitor a clear first step without overwhelming them with application forms.",
      items: [
        {
          title: "Nursing candidates",
          description:
            "Understand which pathway may fit your qualification, language stage, and long-term goal in Germany.",
          type: "nurse",
        },
        {
          title: "Healthcare employers",
          description:
            "Learn how CareRadar can support structured international recruitment and candidate coordination.",
          type: "employer",
        },
        {
          title: "Partners and institutions",
          description:
            "Explore collaboration around training, candidate pools, pathway preparation, and support.",
          type: "partner",
        },
      ],
    },
    why: {
      eyebrow: "Why It Matters",
      title: "International healthcare recruitment needs clarity before action.",
      description:
        "For nurses, moving abroad affects career, family, income, and identity. For employers, every recruitment decision affects patient care and team stability. CareRadar focuses on realistic guidance before rushing anyone forward.",
      cta: "View the process",
      cards: [
        {
          title: "Realistic pathway guidance",
          description:
            "Candidates can understand whether they fit the Degree, GNM, or ANM route before taking the next step.",
          type: "globe",
        },
        {
          title: "No recruitment fee promise",
          description:
            "The public message stays clear: candidates do not pay recruitment fees to enter the pathway.",
          type: "money",
        },
        {
          title: "Prepared before progression",
          description:
            "Language, documents, recognition, interviews, and arrival are explained before portal submission.",
          type: "file",
        },
      ],
    },
    processPreview: {
      eyebrow: "Process Preview",
      title: "Choose your starting point, then follow the pathway.",
      description:
        "The Process page explains the journey through qualification-based routes. Visitors can choose their current background and see the route that applies to them.",
      routes: [
        {
          title: "Degree route",
          description: "B.Sc / Post-Basic B.Sc / M.Sc candidates",
        },
        {
          title: "GNM route",
          description: "General Nursing and Midwifery candidates",
        },
        {
          title: "ANM route",
          description: "Auxiliary Nurse Midwife candidates",
        },
      ],
      cta: "Explore the process",
    },
    aboutPreview: {
      eyebrow: "About CareRadar",
      title: "Founder-led, human, and structured.",
      description:
        "CareRadar is built around responsible recruitment, clear communication, and long-term support. The About page explains the company mission and the people behind it.",
      cta: "Meet the founders",
    },
    finalCta: {
      eyebrow: "Next Step",
      title: "Understand the pathway before submitting details.",
      description:
        "Start by reviewing the process, contacting CareRadar, or creating an account for the future portal experience.",
      primary: "View Process",
      secondary: "Contact CareRadar",
      tertiary: "Create Account",
    },
  },
  de: {
    hero: {
      eyebrow: "Internationale Pflegewege",
      title: "Ein klarerer Weg von der Pflegequalifikation nach Deutschland.",
      description:
        "CareRadar hilft Pflegekräften, ihren Weg zur Arbeit in Deutschland zu verstehen, und unterstützt Arbeitgeber sowie Partner mit einem strukturierten, ethischen und menschlichen Rekrutierungsansatz.",
      primary: "Prozess ansehen",
      secondary: "Konto erstellen",
      note:
        "CareRadar ist zuerst als Informations- und Vertrauensplattform aufgebaut. Kandidaten können Prozess, Wege, Kosten, Zeitrahmen und Unterstützung verstehen, bevor sie in den Kontobereich wechseln.",
      promiseLabel: "CareRadar Versprechen",
      promiseTitle: "We really do care.",
      promiseDescription:
        "Ein strukturierter Weg mit Klarheit, Würde und langfristiger Unterstützung.",
      values: ["Sorgfalt", "Klarheit", "Vertrauen"],
    },
    trustPoints: [
      "Qualifikationsbasierte Wege für Degree-, GNM- und ANM-Kandidaten",
      "Klare Prozessführung vor portalbasierten Bewerbungen",
      "€0 Rekrutierungsgebühren für Kandidaten",
      "Gründergeführte Unterstützung mit verantwortungsvollem Ansatz",
    ],
    intro: {
      eyebrow: "Was CareRadar macht",
      title:
        "Eine informationsorientierte Plattform für Pflegekarrieren in Deutschland.",
      paragraphs: [
        "CareRadar hilft Pflegekandidaten zu verstehen, wohin ihre aktuelle Qualifikation in Deutschland führen kann. Statt einen verwirrenden Rekrutierungsprozess zu zeigen, erklärt die Website den Weg in einfacher Sprache.",
        "Die öffentliche Website konzentriert sich auf Vertrauen, Unternehmensinformationen, Gründerprofil und den Prozess. Detaillierte Kandidatenprofile, Dokumente, Bewerbungsstatus und Admin-Workflows gehören später in Dashboard und Portal.",
        "So bleibt die Website für Besucher einfach, während CareRadar eine starke Grundlage für das vollständige Rekrutierungsportal in der nächsten Phase erhält.",
      ],
    },
    help: {
      eyebrow: "Wem CareRadar hilft",
      title: "Entwickelt für Kandidaten, Arbeitgeber und Partner.",
      description:
        "Die öffentliche Website gibt jedem Besucher einen klaren ersten Schritt, ohne ihn mit Bewerbungsformularen zu überfordern.",
      items: [
        {
          title: "Pflegekandidaten",
          description:
            "Verstehen Sie, welcher Weg zu Ihrer Qualifikation, Sprachphase und Ihrem langfristigen Ziel in Deutschland passen kann.",
          type: "nurse",
        },
        {
          title: "Arbeitgeber im Gesundheitswesen",
          description:
            "Erfahren Sie, wie CareRadar strukturierte internationale Rekrutierung und Kandidatenkoordination unterstützen kann.",
          type: "employer",
        },
        {
          title: "Partner und Institutionen",
          description:
            "Erkunden Sie Zusammenarbeit bei Training, Kandidatenpools, Wegvorbereitung und Unterstützung.",
          type: "partner",
        },
      ],
    },
    why: {
      eyebrow: "Warum es wichtig ist",
      title:
        "Internationale Rekrutierung im Gesundheitswesen braucht Klarheit vor Aktion.",
      description:
        "Für Pflegekräfte betrifft der Schritt ins Ausland Karriere, Familie, Einkommen und Identität. Für Arbeitgeber beeinflusst jede Rekrutierungsentscheidung Patientenversorgung und Teamstabilität. CareRadar setzt auf realistische Orientierung, bevor jemand weitergeführt wird.",
      cta: "Prozess ansehen",
      cards: [
        {
          title: "Realistische Wegführung",
          description:
            "Kandidaten können verstehen, ob sie zur Degree-, GNM- oder ANM-Route passen, bevor sie den nächsten Schritt gehen.",
          type: "globe",
        },
        {
          title: "Keine Rekrutierungsgebühr",
          description:
            "Die öffentliche Botschaft bleibt klar: Kandidaten zahlen keine Rekrutierungsgebühren, um in den Weg einzusteigen.",
          type: "money",
        },
        {
          title: "Vorbereitung vor Fortschritt",
          description:
            "Sprache, Dokumente, Anerkennung, Interviews und Ankunft werden erklärt, bevor eine Portaleinreichung erfolgt.",
          type: "file",
        },
      ],
    },
    processPreview: {
      eyebrow: "Prozessvorschau",
      title: "Startpunkt wählen und dem Weg folgen.",
      description:
        "Die Prozessseite erklärt die Reise anhand qualifikationsbasierter Routen. Besucher wählen ihren aktuellen Hintergrund und sehen den passenden Weg.",
      routes: [
        {
          title: "Degree-Route",
          description: "B.Sc / Post-Basic B.Sc / M.Sc Kandidaten",
        },
        {
          title: "GNM-Route",
          description: "General Nursing and Midwifery Kandidaten",
        },
        {
          title: "ANM-Route",
          description: "Auxiliary Nurse Midwife Kandidaten",
        },
      ],
      cta: "Prozess erkunden",
    },
    aboutPreview: {
      eyebrow: "Über CareRadar",
      title: "Gründergeführt, menschlich und strukturiert.",
      description:
        "CareRadar basiert auf verantwortungsvoller Rekrutierung, klarer Kommunikation und langfristiger Unterstützung. Die Über-uns-Seite erklärt Mission und Menschen hinter dem Unternehmen.",
      cta: "Gründer kennenlernen",
    },
    finalCta: {
      eyebrow: "Nächster Schritt",
      title: "Verstehen Sie den Weg, bevor Sie Details einreichen.",
      description:
        "Beginnen Sie mit dem Prozess, kontaktieren Sie CareRadar oder erstellen Sie ein Konto für das zukünftige Portal.",
      primary: "Prozess ansehen",
      secondary: "CareRadar kontaktieren",
      tertiary: "Konto erstellen",
    },
  },
} as const;

type HomeProps = {
  params: Promise<{
    locale: string;
  }>;
};

function localizedHref(locale: Locale, href: string) {
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

function getHelpIcon(type: string) {
  if (type === "employer") return Building2;
  if (type === "partner") return UsersRound;
  return Stethoscope;
}

function getWhyIcon(type: string) {
  if (type === "money") return BadgeEuro;
  if (type === "file") return FileCheck2;
  return Globe2;
}

export default async function Home({ params }: HomeProps) {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = pageText[locale];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_78%)] px-5 py-10 md:px-8 md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e6eef7_1px,transparent_1px),linear-gradient(to_bottom,#e6eef7_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.22]" />
        <div className="absolute left-[-130px] top-20 h-72 w-72 rounded-full bg-[#08a99d]/10 blur-3xl" />
        <div className="absolute right-[-130px] top-28 h-80 w-80 rounded-full bg-[#08264a]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.06fr_0.94fr]">
          <div className="text-center md:text-left">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#08a99d]/20 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#087d76] shadow-sm backdrop-blur md:mx-0">
              <HeartHandshake size={14} />
              {text.hero.eyebrow}
            </div>

            <h1 className="mx-auto mt-5 max-w-4xl text-[2rem] font-semibold leading-[1.12] tracking-tight text-[#061f3d] sm:text-5xl md:mx-0 md:text-6xl md:leading-[1.04]">
              {text.hero.title}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 md:mx-0 md:text-lg md:leading-8">
              {text.hero.description}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <Link
                href={localizedHref(locale, "/process")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-[#08a99d]"
              >
                {text.hero.primary} <ArrowRight size={17} />
              </Link>

              <Link
                href={localizedHref(locale, "/login")}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] shadow-sm transition hover:border-[#08a99d] hover:text-[#08a99d]"
              >
                {text.hero.secondary}
              </Link>
            </div>

            <div className="mx-auto mt-8 max-w-2xl rounded-[1.4rem] border border-slate-100 bg-white/90 p-5 text-left shadow-lg shadow-slate-100 backdrop-blur md:mx-0">
              <div className="mb-4 h-px w-full bg-gradient-to-r from-[#08a99d] via-slate-100 to-transparent" />
              <p className="text-sm leading-7 text-slate-600">
                {text.hero.note}
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm md:max-w-md">
            <div className="absolute -inset-3 rounded-[2.4rem] bg-gradient-to-br from-[#08a99d]/15 via-white to-[#08264a]/10 blur-xl" />
            <div className="relative rounded-[2rem] border border-white bg-white p-4 shadow-2xl shadow-slate-200">
              <div className="rounded-[1.5rem] border border-slate-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_52%,#eafffb_100%)] px-5 py-7 text-center">
                <Image
                  src="/images/careradar-logo.jpeg"
                  alt="CareRadar Logo"
                  width={190}
                  height={190}
                  className="mx-auto h-36 w-36 rounded-full object-contain md:h-44 md:w-44"
                  priority
                />

                <div className="mx-auto mt-5 h-px w-28 bg-gradient-to-r from-transparent via-[#08a99d] to-transparent" />

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#08a99d]">
                  {text.hero.promiseLabel}
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#061f3d]">
                  {text.hero.promiseTitle}
                </h2>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-600">
                  {text.hero.promiseDescription}
                </p>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  {text.hero.values.map((item) => (
                    <div
                      key={item}
                      className="flex min-h-[68px] items-center justify-center rounded-2xl border border-slate-100 bg-white px-1.5 py-3 text-center shadow-sm"
                    >
                      <p className="text-[11px] font-semibold leading-tight tracking-tight text-[#08264a] sm:text-xs">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST POINTS */}
      <section className="bg-white px-5 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl rounded-[1.6rem] border border-slate-100 bg-white p-4 shadow-lg shadow-slate-100 md:p-5">
          <div className="grid gap-3 md:grid-cols-4">
            {text.trustPoints.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-2xl bg-[#f8fbff] p-4"
              >
                <CheckCircle2
                  size={18}
                  className="mt-1 shrink-0 text-[#08a99d]"
                />
                <p className="text-sm leading-6 text-slate-600">{point}</p>
              </div>
            ))}
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

      {/* WHO CARE RADAR HELPS */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.help.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              {text.help.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {text.help.description}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {text.help.items.map((item) => {
              const Icon = getHelpIcon(item.type);

              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-[1.7rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#08a99d]/25 hover:shadow-xl hover:shadow-slate-100"
                >
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#08a99d]/5" />

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
                    <Icon size={24} />
                  </div>

                  <h3 className="relative mt-5 text-xl font-semibold tracking-tight text-[#061f3d]">
                    {item.title}
                  </h3>

                  <p className="relative mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#061f3d] shadow-2xl shadow-slate-200">
          <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative p-7 text-white md:p-10">
              <div className="absolute left-0 top-0 h-full w-1 bg-[#08a99d]" />

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#10c4b6]">
                {text.why.eyebrow}
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                {text.why.title}
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-300 md:text-base">
                {text.why.description}
              </p>

              <Link
                href={localizedHref(locale, "/process")}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#08a99d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#061f3d]"
              >
                {text.why.cta} <ArrowRight size={17} />
              </Link>
            </div>

            <div className="border-t border-white/10 p-7 md:border-l md:border-t-0 md:p-10">
              <div className="space-y-6">
                {text.why.cards.map((card, index) => {
                  const Icon = getWhyIcon(card.type);

                  return (
                    <div key={card.title}>
                      {index > 0 && <div className="mb-6 h-px bg-white/10" />}

                      <Icon size={26} className="text-[#10c4b6]" />
                      <h3 className="mt-3 text-lg font-semibold text-white">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        {card.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS PREVIEW */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.processPreview.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              {text.processPreview.title}
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
              {text.processPreview.description}
            </p>

            <Link
              href={localizedHref(locale, "/process")}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              {text.processPreview.cta} <ArrowRight size={17} />
            </Link>
          </div>

          <div className="space-y-4">
            {text.processPreview.routes.map((route, index) => (
              <div
                key={route.title}
                className="flex gap-4 rounded-[1.4rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:border-[#08a99d]/25 hover:shadow-lg hover:shadow-slate-100"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#08264a] text-sm font-semibold text-white">
                  {index + 1}
                </div>

                <div>
                  <h3 className="font-semibold text-[#08264a]">
                    {route.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {route.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_0.9fr] md:items-center">
          <div className="rounded-[2rem] border border-slate-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_55%,#eafffb_100%)] p-7 shadow-xl shadow-slate-100 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.aboutPreview.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              {text.aboutPreview.title}
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
              {text.aboutPreview.description}
            </p>

            <Link
              href={localizedHref(locale, "/about")}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              {text.aboutPreview.cta} <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <div className="rounded-[1.6rem] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100">
              <ShieldCheck size={28} className="text-[#08a99d]" />
              <h3 className="mt-4 text-lg font-semibold text-[#061f3d]">
                {locale === "en" ? "Responsible recruitment" : "Verantwortungsvolle Rekrutierung"}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {locale === "en"
                  ? "A careful approach focused on clarity, preparation, and long-term support."
                  : "Ein sorgfältiger Ansatz mit Fokus auf Klarheit, Vorbereitung und langfristige Unterstützung."}
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100">
              <HeartHandshake size={28} className="text-[#08a99d]" />
              <h3 className="mt-4 text-lg font-semibold text-[#061f3d]">
                {locale === "en" ? "Human guidance" : "Menschliche Begleitung"}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {locale === "en"
                  ? "Support that understands the personal weight of international career decisions."
                  : "Unterstützung, die die persönliche Bedeutung internationaler Karriereentscheidungen versteht."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-7 text-center shadow-xl shadow-slate-100 md:p-12">
          <div className="mx-auto mb-5 h-px max-w-md bg-gradient-to-r from-transparent via-[#08a99d] to-transparent" />

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
            {text.finalCta.eyebrow}
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
            {text.finalCta.title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            {text.finalCta.description}
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={localizedHref(locale, "/process")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              {text.finalCta.primary} <ArrowRight size={17} />
            </Link>

            <Link
              href={localizedHref(locale, "/contact")}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
            >
              {text.finalCta.secondary}
            </Link>

            <Link
              href={localizedHref(locale, "/login")}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
            >
              {text.finalCta.tertiary}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}