import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileCheck2,
  Globe2,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { getSafeLocale, type Locale } from "@/lib/locale";

const pageText = {
  en: {
    hero: {
      eyebrow: "International Nurse Recruitment",
      title:
        "Helping nurses and healthcare employers move forward with care.",
      description:
        "CareRadar supports qualified nurses exploring international healthcare careers and helps employers connect with nursing talent through a structured, transparent, and human recruitment process.",
      nurseCta: "Apply as a Nurse",
      employerCta: "Hire Nurses",
      note:
        "The recruitment journey can feel complex for both sides. Nurses need clarity about requirements, documents, interviews, and realistic opportunities. Employers need reliable candidates, proper screening, and clear coordination. CareRadar sits between both with a care-first approach.",
      promiseLabel: "CareRadar Promise",
      promiseTitle: "We really do care.",
      promiseDescription:
        "A recruitment experience built on dignity, guidance, and dependable support.",
      values: ["Care", "Clarity", "Trust"],
    },
    trustPoints: [
      "Guidance for qualified nurses exploring international opportunities",
      "Recruitment support for hospitals, clinics, and healthcare organisations",
      "Structured process covering screening, preparation, and coordination",
      "Care-led communication for candidates and employers",
    ],
    intro: {
      eyebrow: "What CareRadar Does",
      title:
        "A focused recruitment bridge for nurses and healthcare providers.",
      paragraphs: [
        "CareRadar is built for international nurse recruitment. The goal is not just to collect applications or pass profiles forward, but to make the journey clearer for nurses and more dependable for healthcare employers.",
        "For nurses, this means guidance before important steps such as profile screening, documentation, interview preparation, and employer conversations. For employers, this means a recruitment partner that understands the need for responsible communication, candidate suitability, and organised coordination.",
        "The brand stands on a simple belief: recruitment should feel professional, structured, and human. That is why CareRadar’s promise is direct — we really do care.",
      ],
    },
    pathwaysSection: {
      eyebrow: "Two Pathways",
      title: "Clear support for both sides of recruitment.",
      description:
        "CareRadar guides each visitor toward the right pathway — whether they are a nurse exploring opportunities or a healthcare employer looking to hire.",
    },
    pathways: [
      {
        title: "Nurses looking for international opportunities",
        description:
          "CareRadar helps nurses understand the overseas recruitment journey with support around eligibility, profile preparation, documentation, interview readiness, and employer coordination.",
        href: "/nurses",
        cta: "Explore nurse pathway",
        type: "nurse",
      },
      {
        title: "Healthcare employers looking to recruit nurses",
        description:
          "We support healthcare organisations with a more focused recruitment process by helping identify suitable nursing candidates and coordinating the early stages of international hiring.",
        href: "/employers",
        cta: "Explore employer support",
        type: "employer",
      },
    ],
    why: {
      eyebrow: "Why It Matters",
      title: "International healthcare recruitment needs more than speed.",
      description:
        "For nurses, moving abroad can shape an entire career and family future. For employers, every hiring decision affects patient care, team stability, and service quality. CareRadar focuses on careful matching, structured guidance, and responsible communication.",
      cta: "View recruitment process",
      cards: [
        {
          title: "Ethical recruitment mindset",
          description:
            "We position the process around honest expectations, candidate dignity, and dependable employer coordination.",
          type: "shield",
        },
        {
          title: "International pathway clarity",
          description:
            "Nurses receive clearer direction on the journey ahead, while employers receive better organised recruitment support.",
          type: "globe",
        },
        {
          title: "Preparation before placement",
          description:
            "The focus is on readiness — profile, documents, communication, interview preparation, and suitable matching.",
          type: "file",
        },
      ],
    },
    process: {
      eyebrow: "Process Snapshot",
      title: "Simple enough to understand. Structured enough to trust.",
      description:
        "The full recruitment process can vary depending on country, employer requirements, documentation, and candidate readiness. But the CareRadar journey always begins with clarity.",
      steps: [
        {
          title: "Initial enquiry and registration",
          description:
            "The first step is understanding whether the visitor is a nurse or employer and what support they need.",
        },
        {
          title: "Profile review and eligibility understanding",
          description:
            "CareRadar reviews the basic situation so the next steps are realistic, not vague or confusing.",
        },
        {
          title: "Document and interview preparation guidance",
          description:
            "The candidate journey is strengthened through clearer preparation before employer interaction.",
        },
        {
          title: "Employer matching and recruitment coordination",
          description:
            "Suitable candidates and employers are connected through a more organised recruitment pathway.",
        },
      ],
    },
    finalCta: {
      eyebrow: "Start Your Journey",
      title: "Speak with CareRadar about your next step.",
      description:
        "Whether you are a nurse exploring international opportunities or a healthcare employer looking for recruitment support, CareRadar can help you understand the right pathway.",
      primary: "Contact CareRadar",
      secondary: "Explore nurse pathway",
    },
  },
  de: {
    hero: {
      eyebrow: "Internationale Pflegekräfte-Rekrutierung",
      title:
        "Wir begleiten Pflegekräfte und Arbeitgeber im Gesundheitswesen mit Sorgfalt in den nächsten Schritt.",
      description:
        "CareRadar unterstützt qualifizierte Pflegekräfte auf dem Weg zu internationalen Karrierechancen und hilft Arbeitgebern im Gesundheitswesen, passende Pflegefachkräfte über einen strukturierten, transparenten und menschlichen Rekrutierungsprozess zu finden.",
      nurseCta: "Als Pflegekraft bewerben",
      employerCta: "Pflegekräfte rekrutieren",
      note:
        "Der Rekrutierungsprozess kann für beide Seiten komplex wirken. Pflegekräfte benötigen Klarheit zu Anforderungen, Dokumenten, Vorstellungsgesprächen und realistischen Möglichkeiten. Arbeitgeber benötigen verlässliche Kandidaten, eine sorgfältige Vorauswahl und klare Koordination. CareRadar verbindet beide Seiten mit einem fürsorglichen Ansatz.",
      promiseLabel: "CareRadar Versprechen",
      promiseTitle: "We really do care.",
      promiseDescription:
        "Ein Rekrutierungserlebnis, das auf Würde, Orientierung und verlässlicher Unterstützung basiert.",
      values: ["Fürsorge", "Klarheit", "Vertrauen"],
    },
    trustPoints: [
      "Begleitung für qualifizierte Pflegekräfte mit internationalen Karriereplänen",
      "Rekrutierungsunterstützung für Krankenhäuser, Kliniken und Gesundheitseinrichtungen",
      "Strukturierter Prozess für Vorauswahl, Vorbereitung und Koordination",
      "Sorgfältige Kommunikation für Kandidaten und Arbeitgeber",
    ],
    intro: {
      eyebrow: "Was CareRadar macht",
      title:
        "Eine fokussierte Rekrutierungsbrücke für Pflegekräfte und Gesundheitsanbieter.",
      paragraphs: [
        "CareRadar ist auf internationale Pflegekräfte-Rekrutierung ausgerichtet. Ziel ist es nicht nur, Bewerbungen zu sammeln oder Profile weiterzuleiten, sondern den Prozess für Pflegekräfte klarer und für Arbeitgeber im Gesundheitswesen verlässlicher zu machen.",
        "Für Pflegekräfte bedeutet das Unterstützung vor wichtigen Schritten wie Profilprüfung, Dokumentenvorbereitung, Interviewvorbereitung und Gesprächen mit Arbeitgebern. Für Arbeitgeber bedeutet es einen Rekrutierungspartner, der verantwortungsvolle Kommunikation, Kandidateneignung und organisierte Koordination versteht.",
        "Die Marke steht für eine einfache Überzeugung: Rekrutierung sollte professionell, strukturiert und menschlich sein. Deshalb ist das Versprechen von CareRadar klar — we really do care.",
      ],
    },
    pathwaysSection: {
      eyebrow: "Zwei Wege",
      title: "Klare Unterstützung für beide Seiten der Rekrutierung.",
      description:
        "CareRadar führt jeden Besucher zum passenden Weg — ob Pflegekraft auf der Suche nach Chancen oder Arbeitgeber im Gesundheitswesen mit Personalbedarf.",
    },
    pathways: [
      {
        title: "Pflegekräfte mit internationalen Karriereplänen",
        description:
          "CareRadar hilft Pflegekräften, den internationalen Rekrutierungsprozess besser zu verstehen — mit Unterstützung bei Eignung, Profilvorbereitung, Dokumenten, Interviewbereitschaft und Arbeitgeberkoordination.",
        href: "/nurses",
        cta: "Weg für Pflegekräfte ansehen",
        type: "nurse",
      },
      {
        title: "Arbeitgeber im Gesundheitswesen mit Rekrutierungsbedarf",
        description:
          "Wir unterstützen Gesundheitseinrichtungen mit einem fokussierten Rekrutierungsprozess, indem wir geeignete Pflegekräfte identifizieren und die frühen Phasen internationaler Einstellungen koordinieren.",
        href: "/employers",
        cta: "Arbeitgeber-Unterstützung ansehen",
        type: "employer",
      },
    ],
    why: {
      eyebrow: "Warum es wichtig ist",
      title:
        "Internationale Rekrutierung im Gesundheitswesen braucht mehr als Schnelligkeit.",
      description:
        "Für Pflegekräfte kann der Schritt ins Ausland eine ganze Karriere und familiäre Zukunft prägen. Für Arbeitgeber wirkt sich jede Einstellung auf Patientenversorgung, Teamstabilität und Servicequalität aus. CareRadar setzt auf sorgfältiges Matching, strukturierte Begleitung und verantwortungsvolle Kommunikation.",
      cta: "Rekrutierungsprozess ansehen",
      cards: [
        {
          title: "Ethischer Rekrutierungsansatz",
          description:
            "Wir richten den Prozess an ehrlichen Erwartungen, Würde der Kandidaten und verlässlicher Arbeitgeberkoordination aus.",
          type: "shield",
        },
        {
          title: "Klarheit im internationalen Prozess",
          description:
            "Pflegekräfte erhalten mehr Orientierung für den weiteren Weg, während Arbeitgeber strukturierte Rekrutierungsunterstützung erhalten.",
          type: "globe",
        },
        {
          title: "Vorbereitung vor Vermittlung",
          description:
            "Der Fokus liegt auf Bereitschaft — Profil, Dokumente, Kommunikation, Interviewvorbereitung und passendem Matching.",
          type: "file",
        },
      ],
    },
    process: {
      eyebrow: "Prozessüberblick",
      title: "Einfach zu verstehen. Strukturiert genug, um zu vertrauen.",
      description:
        "Der vollständige Rekrutierungsprozess kann je nach Land, Arbeitgeberanforderungen, Dokumentation und Kandidatenbereitschaft variieren. Doch die CareRadar-Reise beginnt immer mit Klarheit.",
      steps: [
        {
          title: "Erste Anfrage und Registrierung",
          description:
            "Der erste Schritt ist zu verstehen, ob der Besucher Pflegekraft oder Arbeitgeber ist und welche Unterstützung benötigt wird.",
        },
        {
          title: "Profilprüfung und Eignungseinschätzung",
          description:
            "CareRadar prüft die Ausgangssituation, damit die nächsten Schritte realistisch und nicht vage oder verwirrend sind.",
        },
        {
          title: "Unterstützung bei Dokumenten und Interviewvorbereitung",
          description:
            "Die Kandidatenreise wird durch klare Vorbereitung vor dem Arbeitgeberkontakt gestärkt.",
        },
        {
          title: "Arbeitgeber-Matching und Rekrutierungskoordination",
          description:
            "Geeignete Kandidaten und Arbeitgeber werden über einen besser organisierten Rekrutierungsweg zusammengeführt.",
        },
      ],
    },
    finalCta: {
      eyebrow: "Starten Sie Ihre Reise",
      title: "Sprechen Sie mit CareRadar über Ihren nächsten Schritt.",
      description:
        "Ob Sie eine Pflegekraft mit internationalen Karriereplänen sind oder ein Arbeitgeber im Gesundheitswesen Rekrutierungsunterstützung sucht — CareRadar hilft Ihnen, den passenden Weg zu verstehen.",
      primary: "CareRadar kontaktieren",
      secondary: "Weg für Pflegekräfte ansehen",
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

function getPathwayIcon(type: string) {
  if (type === "employer") return Building2;
  return Stethoscope;
}

function getWhyIcon(type: string) {
  if (type === "globe") return Globe2;
  if (type === "file") return FileCheck2;
  return ShieldCheck;
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
                {text.hero.nurseCta} <ArrowRight size={17} />
              </Link>

              <Link
                href={localizedHref(locale, "/employers")}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] shadow-sm transition hover:border-[#08a99d] hover:text-[#08a99d]"
              >
                {text.hero.employerCta}
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
                      className="rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm"
                    >
                      <p className="text-xs font-semibold text-[#08264a]">
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

          <div className="space-y-5 text-sm leading-8 text-slate-600 md:text-base">
            {text.intro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* PATHWAYS */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.pathwaysSection.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              {text.pathwaysSection.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {text.pathwaysSection.description}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {text.pathways.map((item) => {
              const Icon = getPathwayIcon(item.type);

              return (
                <Link
                  href={localizedHref(locale, item.href)}
                  key={item.title}
                  className="group relative overflow-hidden rounded-[1.8rem] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100 transition hover:-translate-y-1 hover:border-[#08a99d]/30 hover:shadow-xl md:p-8"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#08a99d] to-[#08264a]" />
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-[#08a99d]/5" />

                  <div className="relative flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
                      <Icon size={24} />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-[#08264a] md:text-2xl">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {item.description}
                      </p>

                      <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#08a99d]/10 px-4 py-2 text-sm font-semibold text-[#087d76]">
                        {item.cta}
                        <ArrowRight
                          size={16}
                          className="transition group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* DARK CALM SECTION */}
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

      {/* PROCESS SNAPSHOT */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
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
                  <h3 className="font-semibold text-[#08264a]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_45%,#eafffb_100%)] p-7 text-center shadow-xl shadow-slate-100 md:p-12">
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

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={localizedHref(locale, "/contact")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              {text.finalCta.primary} <ArrowRight size={17} />
            </Link>

            <Link
              href={localizedHref(locale, "/nurses")}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
            >
              {text.finalCta.secondary}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}