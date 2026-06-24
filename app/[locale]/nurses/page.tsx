import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  HeartHandshake,
  Languages,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { getSafeLocale, type Locale } from "@/lib/locale";

const supportIcons = [BadgeCheck, ClipboardCheck, FileCheck2, MessageCircle];
const darkIcons = [Languages, ShieldCheck, Globe2];

const pageText = {
  en: {
    metadata: {
      title: "For Nurses",
      description:
        "CareRadar helps qualified nurses explore international healthcare opportunities with guidance on eligibility, documentation, interview preparation, and recruitment coordination.",
    },
    hero: {
      eyebrow: "For Nurses",
      title:
        "Your international nursing journey starts with the right guidance.",
      description:
        "CareRadar helps qualified nurses understand overseas recruitment pathways with support around eligibility, profile preparation, documentation, interviews, and employer coordination.",
      primary: "Apply Now",
      secondary: "View Process",
      cardEyebrow: "What You Get",
      cardTitle: "A clearer, calmer way to move forward.",
      cardNote:
        "CareRadar does not treat your application like a number. The aim is to help you understand the route, prepare properly, and move with confidence.",
      heroPoints: [
        "Understand where you currently stand",
        "Prepare your nursing profile professionally",
        "Know which documents may be important",
        "Approach employer conversations with confidence",
      ],
    },
    intro: {
      eyebrow: "Nurse Pathway",
      title: "Moving abroad as a nurse should not feel confusing.",
      paragraphs: [
        "International nurse recruitment involves more than simply sending a resume. Nurses often need to understand their eligibility, clinical experience, documents, communication standards, interview expectations, and employer requirements before moving forward.",
        "CareRadar helps make this journey more organised. The focus is to guide you through the early recruitment stages with realistic communication, proper preparation, and a clear understanding of what comes next.",
        "Whether you are just exploring opportunities or already preparing your documents, CareRadar helps you take the next step with more confidence and less confusion.",
      ],
    },
    support: {
      eyebrow: "How We Support You",
      title: "Practical support before important decisions.",
      description:
        "CareRadar focuses on the preparation and clarity nurses need before moving through international recruitment opportunities.",
      areas: [
        {
          title: "Eligibility Understanding",
          description:
            "Get clearer direction on basic requirements, experience expectations, and the early steps needed before applying.",
        },
        {
          title: "Profile Preparation",
          description:
            "Prepare a stronger professional profile so employers can understand your nursing background properly.",
        },
        {
          title: "Document Guidance",
          description:
            "Understand the documents commonly needed during international nurse recruitment and employer coordination.",
        },
        {
          title: "Interview Readiness",
          description:
            "Receive guidance on communication, confidence, and preparation before speaking with healthcare employers.",
        },
      ],
    },
    dark: {
      eyebrow: "Why Nurses Choose Guidance",
      title: "A better-prepared nurse creates a stronger opportunity.",
      description:
        "Employers do not only look at qualifications. They also look at communication, readiness, documentation, attitude, and fit. CareRadar helps nurses prepare with these realities in mind.",
      cta: "Start your enquiry",
      items: [
        {
          title: "Communication readiness",
          description:
            "Guidance to help you present yourself clearly and professionally during employer interactions.",
        },
        {
          title: "Realistic expectations",
          description:
            "Clearer communication around process stages, preparation needs, and practical next steps.",
        },
        {
          title: "International opportunity pathway",
          description:
            "Support designed for nurses who want to explore healthcare careers outside their home country.",
        },
      ],
    },
    journey: {
      eyebrow: "Your Journey",
      title: "From first enquiry to employer coordination.",
      description:
        "Every candidate journey can be different, but the early path should always be clear. CareRadar helps you understand where you are and what needs to happen next.",
      steps: [
        {
          title: "Share your interest",
          description:
            "Tell CareRadar about your nursing background, experience, preferred direction, and current preparation stage.",
        },
        {
          title: "Understand your pathway",
          description:
            "We help you understand what your next steps may look like depending on your profile and target opportunities.",
        },
        {
          title: "Prepare your profile",
          description:
            "You receive guidance around documents, presentation, communication, and employer readiness.",
        },
        {
          title: "Move toward opportunities",
          description:
            "Suitable profiles can be coordinated further with healthcare employers through a structured recruitment process.",
        },
      ],
    },
    ideal: {
      eyebrow: "Is This For You?",
      title:
        "CareRadar is suitable for nurses who want clarity before action.",
      points: [
        "Registered or qualified nurses exploring overseas healthcare opportunities",
        "Nurses who need clarity about documents, interviews, and preparation",
        "Candidates who want a structured recruitment journey rather than vague promises",
        "Nurses looking for responsible guidance before employer conversations",
      ],
    },
    cta: {
      eyebrow: "Apply As A Nurse",
      title: "Ready to understand your international nursing pathway?",
      description:
        "Share your details with CareRadar and take the first step toward a clearer, better-prepared recruitment journey.",
      primary: "Apply Now",
      secondary: "View process",
    },
  },
  de: {
    metadata: {
      title: "Für Pflegekräfte",
      description:
        "CareRadar unterstützt qualifizierte Pflegekräfte bei internationalen Karrierechancen im Gesundheitswesen mit Orientierung zu Eignung, Dokumentation, Interviewvorbereitung und Rekrutierungskoordination.",
    },
    hero: {
      eyebrow: "Für Pflegekräfte",
      title:
        "Ihre internationale Pflegekarriere beginnt mit der richtigen Orientierung.",
      description:
        "CareRadar hilft qualifizierten Pflegekräften, internationale Rekrutierungswege besser zu verstehen — mit Unterstützung bei Eignung, Profilvorbereitung, Dokumentation, Interviews und Arbeitgeberkoordination.",
      primary: "Jetzt bewerben",
      secondary: "Prozess ansehen",
      cardEyebrow: "Was Sie erhalten",
      cardTitle: "Ein klarerer und ruhigerer Weg nach vorne.",
      cardNote:
        "CareRadar behandelt Ihre Bewerbung nicht wie eine Nummer. Ziel ist es, Ihnen den Weg verständlich zu machen, Sie richtig vorzubereiten und Ihnen mehr Sicherheit für den nächsten Schritt zu geben.",
      heroPoints: [
        "Verstehen, wo Sie aktuell stehen",
        "Ihr Pflegeprofil professionell vorbereiten",
        "Wissen, welche Dokumente wichtig sein können",
        "Arbeitgebergespräche mit mehr Sicherheit angehen",
      ],
    },
    intro: {
      eyebrow: "Weg für Pflegekräfte",
      title: "Der Schritt ins Ausland als Pflegekraft sollte nicht verwirrend sein.",
      paragraphs: [
        "Internationale Pflegekräfte-Rekrutierung bedeutet mehr als nur das Versenden eines Lebenslaufs. Pflegekräfte müssen häufig ihre Eignung, klinische Erfahrung, Dokumente, Kommunikationsstandards, Interviewerwartungen und Arbeitgeberanforderungen verstehen, bevor sie den nächsten Schritt gehen.",
        "CareRadar hilft dabei, diesen Weg besser zu organisieren. Der Fokus liegt darauf, Sie durch die frühen Rekrutierungsphasen mit realistischer Kommunikation, guter Vorbereitung und einem klaren Verständnis der nächsten Schritte zu begleiten.",
        "Ob Sie erst Möglichkeiten erkunden oder bereits Ihre Dokumente vorbereiten — CareRadar hilft Ihnen, den nächsten Schritt mit mehr Sicherheit und weniger Unsicherheit zu gehen.",
      ],
    },
    support: {
      eyebrow: "Wie wir Sie unterstützen",
      title: "Praktische Unterstützung vor wichtigen Entscheidungen.",
      description:
        "CareRadar konzentriert sich auf die Vorbereitung und Klarheit, die Pflegekräfte benötigen, bevor sie internationale Rekrutierungschancen verfolgen.",
      areas: [
        {
          title: "Eignung verstehen",
          description:
            "Erhalten Sie klarere Orientierung zu grundlegenden Anforderungen, Erfahrungserwartungen und den frühen Schritten vor einer Bewerbung.",
        },
        {
          title: "Profilvorbereitung",
          description:
            "Bereiten Sie ein stärkeres berufliches Profil vor, damit Arbeitgeber Ihren pflegerischen Hintergrund besser verstehen können.",
        },
        {
          title: "Dokumentenorientierung",
          description:
            "Verstehen Sie, welche Dokumente bei internationaler Pflegekräfte-Rekrutierung und Arbeitgeberkoordination häufig benötigt werden.",
        },
        {
          title: "Interviewvorbereitung",
          description:
            "Erhalten Sie Unterstützung bei Kommunikation, Selbstsicherheit und Vorbereitung vor Gesprächen mit Arbeitgebern im Gesundheitswesen.",
        },
      ],
    },
    dark: {
      eyebrow: "Warum Pflegekräfte Orientierung wählen",
      title: "Eine besser vorbereitete Pflegekraft schafft stärkere Chancen.",
      description:
        "Arbeitgeber achten nicht nur auf Qualifikationen. Sie achten auch auf Kommunikation, Bereitschaft, Dokumentation, Haltung und Passung. CareRadar hilft Pflegekräften, sich mit diesen Realitäten im Blick vorzubereiten.",
      cta: "Anfrage starten",
      items: [
        {
          title: "Kommunikationsbereitschaft",
          description:
            "Orientierung, damit Sie sich in Arbeitgebergesprächen klar und professionell präsentieren können.",
        },
        {
          title: "Realistische Erwartungen",
          description:
            "Klarere Kommunikation zu Prozessphasen, Vorbereitungsbedarf und praktischen nächsten Schritten.",
        },
        {
          title: "Internationaler Karriereweg",
          description:
            "Unterstützung für Pflegekräfte, die Karrieren im Gesundheitswesen außerhalb ihres Heimatlandes erkunden möchten.",
        },
      ],
    },
    journey: {
      eyebrow: "Ihre Reise",
      title: "Von der ersten Anfrage bis zur Arbeitgeberkoordination.",
      description:
        "Jede Kandidatenreise kann unterschiedlich sein, aber der frühe Weg sollte immer klar sein. CareRadar hilft Ihnen zu verstehen, wo Sie stehen und was als Nächstes passieren muss.",
      steps: [
        {
          title: "Interesse mitteilen",
          description:
            "Teilen Sie CareRadar Ihren pflegerischen Hintergrund, Ihre Erfahrung, Ihre gewünschte Richtung und Ihren aktuellen Vorbereitungsstand mit.",
        },
        {
          title: "Ihren Weg verstehen",
          description:
            "Wir helfen Ihnen zu verstehen, wie Ihre nächsten Schritte abhängig von Ihrem Profil und Ihren Zielmöglichkeiten aussehen können.",
        },
        {
          title: "Ihr Profil vorbereiten",
          description:
            "Sie erhalten Orientierung zu Dokumenten, Darstellung, Kommunikation und Arbeitgeberbereitschaft.",
        },
        {
          title: "In Richtung Chancen gehen",
          description:
            "Geeignete Profile können über einen strukturierten Rekrutierungsprozess weiter mit Arbeitgebern im Gesundheitswesen koordiniert werden.",
        },
      ],
    },
    ideal: {
      eyebrow: "Ist das für Sie geeignet?",
      title:
        "CareRadar ist geeignet für Pflegekräfte, die Klarheit vor dem nächsten Schritt möchten.",
      points: [
        "Registrierte oder qualifizierte Pflegekräfte, die internationale Chancen im Gesundheitswesen erkunden",
        "Pflegekräfte, die Klarheit zu Dokumenten, Interviews und Vorbereitung benötigen",
        "Kandidaten, die einen strukturierten Rekrutierungsweg statt vager Versprechen möchten",
        "Pflegekräfte, die vor Arbeitgebergesprächen verantwortungsvolle Orientierung suchen",
      ],
    },
    cta: {
      eyebrow: "Als Pflegekraft bewerben",
      title: "Bereit, Ihren internationalen Pflegeweg zu verstehen?",
      description:
        "Teilen Sie Ihre Daten mit CareRadar und machen Sie den ersten Schritt zu einer klareren und besser vorbereiteten Rekrutierungsreise.",
      primary: "Jetzt bewerben",
      secondary: "Prozess ansehen",
    },
  },
} as const;

type NursesProps = {
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
}: NursesProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = pageText[locale];

  return {
    title: text.metadata.title,
    description: text.metadata.description,
  };
}

export default async function NursesPage({ params }: NursesProps) {
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
              <Stethoscope size={14} />
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
              const Icon = supportIcons[index] ?? BadgeCheck;

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
                  const Icon = darkIcons[index] ?? Languages;

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

      {/* JOURNEY */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.journey.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              {text.journey.title}
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
              {text.journey.description}
            </p>
          </div>

          <div className="space-y-4">
            {text.journey.steps.map((step, index) => (
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

      {/* IDEAL FOR */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-7 shadow-xl shadow-slate-100 md:p-10">
          <div className="mx-auto mb-6 h-px max-w-md bg-gradient-to-r from-transparent via-[#08a99d] to-transparent" />

          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
                {text.ideal.eyebrow}
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-4xl">
                {text.ideal.title}
              </h2>
            </div>

            <div className="space-y-4">
              {text.ideal.points.map((item) => (
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