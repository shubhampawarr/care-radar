import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { getSafeLocale, type Locale } from "@/lib/locale";

const valueIcons = [HeartHandshake, Compass, ShieldCheck, BadgeCheck];

const pageText = {
  en: {
    metadata: {
      title: "About",
      description:
        "Learn about CareRadar, an international nurse recruitment company built around care, clarity, ethical guidance, and healthcare-focused recruitment support.",
    },
    hero: {
      eyebrow: "About CareRadar",
      title: "A recruitment company built around care, clarity, and trust.",
    },
    brandPromise: {
      label: "Brand Promise",
      title: "We really do care.",
      description:
        "A simple promise behind every candidate conversation and every employer requirement.",
    },
    leadership: {
      eyebrow: "Leadership",
      title: "Meet the people behind CareRadar.",
      description:
        "CareRadar is led by professionals with experience across international business, consulting, finance, recruitment, and human resources.",
    },
    founders: [
      {
        name: "Akshat Gupta",
        role: "Co-Founder",
        image: "/images/akshat-gupta.jpeg",
        bio: [
          "Akshat Gupta brings a multidisciplinary background across finance, consulting, and international business. His experience gives him a strong understanding of how organisations grow, how markets evolve, and how the right talent can shape long-term success.",
          "His approach goes beyond recruitment by placing equal importance on candidate support, professional growth, integration, and long-term partnerships built on trust, quality, and mutual success.",
          "He believes that addressing healthcare workforce challenges requires more than efficient hiring processes. It requires genuine care for the people whose lives, careers, and organisations are shaped by these opportunities.",
          "At CareRadar, Akshat is focused on building a trusted healthcare recruitment platform that supports skilled nursing professionals and healthcare providers through a more structured, transparent, and human process.",
        ],
      },
      {
        name: "Ron Rüdiger",
        role: "Co-Founder",
        image: "/images/ron-rudiger.jpeg",
        bio: [
          "Ron Rüdiger brings several years of experience in human resources leadership, having worked as Head of HR across corporate and mid-sized organisational environments.",
          "Throughout his career, he has led recruitment initiatives, developed and optimised HR structures, advised executive leadership teams, and supported organisations through periods of growth and transformation.",
          "Having hired and supported professionals across a wide range of roles and industries, Ron has developed a strong understanding of what successful recruitment requires from both an employer and candidate perspective.",
          "He believes that sustainable hiring is not about filling vacancies quickly, but about building long-term partnerships that strengthen organisational culture, enhance performance, and create lasting value for everyone involved.",
          "At CareRadar, Ron applies this philosophy to international healthcare recruitment. His focus is on creating transparent, ethical, and sustainable recruitment processes that support candidates on their journey to build a successful future in Germany while delivering long-term value for healthcare organisations.",
        ],
      },
    ],
    story: {
      eyebrow: "Our Story",
      title: "Recruitment should feel organised, honest, and human.",
      paragraphs: [
        "International healthcare recruitment can be overwhelming. Nurses often need guidance on eligibility, documentation, interviews, country-specific expectations, and the practical steps involved in moving forward. Employers need dependable candidates, clear communication, and a recruitment process they can trust.",
        "CareRadar was created to sit between both sides with structure and care. The name reflects direction — helping nurses and employers understand where they are, what comes next, and how to move through the journey with more confidence.",
        "The company does not position recruitment as a rushed transaction. It positions recruitment as a guided pathway. That is why the tagline matters:",
      ],
      highlighted: "we really do care.",
    },
    purpose: {
      eyebrow: "Purpose",
      title: "A clearer pathway for international nurse recruitment.",
      description:
        "CareRadar exists to make the process more understandable for nurses and more dependable for employers.",
      nursesTitle: "For nurses",
      nursesDescription:
        "CareRadar helps nurses understand the international recruitment journey before they make important career decisions. This includes profile readiness, documentation understanding, interview preparation, and employer coordination.",
      employersTitle: "For employers",
      employersDescription:
        "CareRadar supports healthcare organisations looking for nursing talent by bringing structure to early recruitment stages, candidate communication, and suitability-based coordination.",
      closing:
        "The result is a more balanced recruitment experience — one that respects the nurse’s journey while also understanding the employer’s responsibility to patient care and service quality.",
    },
    missionCards: [
      {
        eyebrow: "Mission",
        title: "To guide nurses with clarity and care.",
        description:
          "CareRadar’s mission is to support qualified nurses as they explore international opportunities with better preparation, clearer expectations, and dependable guidance.",
      },
      {
        eyebrow: "Vision",
        title: "To become a trusted healthcare recruitment bridge.",
        description:
          "The long-term vision is to support healthcare systems with suitable nursing talent while helping candidates access meaningful, well-guided opportunities abroad.",
      },
      {
        eyebrow: "Promise",
        title: "To communicate clearly from start to finish.",
        description:
          "CareRadar believes that recruitment should never feel vague. Every candidate and employer should understand the next step and the reason behind it.",
      },
    ],
    valuesSection: {
      eyebrow: "Values",
      title: "The principles behind every recruitment journey.",
      description:
        "CareRadar’s values are designed to create trust, not pressure. The focus is long-term suitability over quick promises.",
      values: [
        {
          title: "Care First",
          description:
            "Every nurse and employer interaction should feel respectful, patient, and properly guided.",
        },
        {
          title: "Clarity Before Promises",
          description:
            "CareRadar focuses on realistic guidance, clear next steps, and responsible communication.",
        },
        {
          title: "Ethical Recruitment",
          description:
            "The process is built around dignity, transparency, and long-term suitability.",
        },
        {
          title: "Healthcare Focus",
          description:
            "CareRadar is designed specifically for nursing and healthcare recruitment pathways.",
        },
      ],
    },
    cta: {
      eyebrow: "Work With CareRadar",
      title: "A recruitment conversation should begin with clarity.",
      description:
        "Whether you are a nurse or a healthcare employer, CareRadar can help you understand the right pathway before moving forward.",
      primary: "Contact CareRadar",
      secondary: "View process",
    },
  },
  de: {
    metadata: {
      title: "Über uns",
      description:
        "Erfahren Sie mehr über CareRadar, ein internationales Rekrutierungsunternehmen für Pflegekräfte, das auf Fürsorge, Klarheit, ethischer Begleitung und Gesundheitsrekrutierung basiert.",
    },
    hero: {
      eyebrow: "Über CareRadar",
      title:
        "Ein Rekrutierungsunternehmen, das auf Fürsorge, Klarheit und Vertrauen aufgebaut ist.",
    },
    brandPromise: {
      label: "Markenversprechen",
      title: "We Really Do Care.",
      description:
        "Ein einfaches Versprechen hinter jedem Gespräch mit Kandidaten und jeder Anforderung von Arbeitgebern.",
    },
    leadership: {
      eyebrow: "Führung",
      title: "Lernen Sie die Menschen hinter CareRadar kennen.",
      description:
        "CareRadar wird von Fachleuten geführt, die Erfahrung in internationalem Geschäft, Beratung, Finanzen, Rekrutierung und Personalwesen mitbringen.",
    },
    founders: [
      {
        name: "Akshat Gupta",
        role: "Gründer",
        image: "/images/akshat-gupta.jpeg",
        bio: [
          "Akshat Gupta bringt einen vielseitigen Hintergrund in den Bereichen Finanzen, Beratung und internationales Geschäft mit. Seine Erfahrung gibt ihm ein starkes Verständnis dafür, wie Organisationen wachsen, wie sich Märkte entwickeln und wie die richtigen Talente langfristigen Erfolg prägen können.",
          "Sein Ansatz geht über reine Rekrutierung hinaus, indem er Kandidatenbetreuung, berufliche Entwicklung, Integration und langfristige Partnerschaften auf Grundlage von Vertrauen, Qualität und gemeinsamem Erfolg gleichermaßen berücksichtigt.",
          "Er ist überzeugt, dass die Herausforderungen im Gesundheitswesen mehr erfordern als effiziente Einstellungsprozesse. Sie erfordern echte Fürsorge für die Menschen, deren Leben, Karrieren und Organisationen durch diese Möglichkeiten geprägt werden.",
          "Bei CareRadar konzentriert sich Akshat darauf, eine vertrauenswürdige Rekrutierungsplattform im Gesundheitswesen aufzubauen, die qualifizierte Pflegefachkräfte und Gesundheitsanbieter durch einen strukturierteren, transparenteren und menschlicheren Prozess unterstützt.",
        ],
      },
      {
        name: "Ron Rüdiger",
        role: "Gründer",
        image: "/images/ron-rudiger.jpeg",
        bio: [
          "Ron Rüdiger bringt mehrere Jahre Erfahrung im Personalwesen mit und war als Personalleiter in Konzernstrukturen sowie mittelständischen Organisationsumfeldern tätig.",
          "Im Laufe seiner Karriere leitete er Rekrutierungsinitiativen, entwickelte und optimierte Personalstrukturen, beriet Geschäftsführungs- und Führungsteams und begleitete Organisationen in Wachstums- und Transformationsphasen.",
          "Durch die Einstellung und Betreuung von Fachkräften in einer Vielzahl von Rollen und Branchen hat Ron ein starkes Verständnis dafür entwickelt, was erfolgreiche Rekrutierung sowohl aus Arbeitgeber- als auch aus Kandidatenperspektive erfordert.",
          "Er ist überzeugt, dass nachhaltige Einstellung nicht bedeutet, offene Stellen schnell zu besetzen, sondern langfristige Partnerschaften aufzubauen, die Organisationskultur stärken, Leistung verbessern und dauerhaften Mehrwert für alle Beteiligten schaffen.",
          "Bei CareRadar überträgt Ron diese Philosophie auf die internationale Rekrutierung im Gesundheitswesen. Sein Fokus liegt darauf, transparente, ethische und nachhaltige Rekrutierungsprozesse zu schaffen, die Kandidaten auf ihrem Weg in eine erfolgreiche Zukunft in Deutschland unterstützen und gleichzeitig langfristigen Mehrwert für Gesundheitsorganisationen schaffen.",
        ],
      },
    ],
    story: {
      eyebrow: "Unsere Geschichte",
      title: "Rekrutierung sollte organisiert, ehrlich und menschlich sein.",
      paragraphs: [
        "Internationale Rekrutierung im Gesundheitswesen kann überwältigend sein. Pflegekräfte benötigen häufig Orientierung zu Eignung, Dokumentation, Interviews, länderspezifischen Erwartungen und den praktischen Schritten, die für den weiteren Weg erforderlich sind. Arbeitgeber benötigen verlässliche Kandidaten, klare Kommunikation und einen Rekrutierungsprozess, dem sie vertrauen können.",
        "CareRadar wurde geschaffen, um mit Struktur und Fürsorge zwischen beiden Seiten zu stehen. Der Name steht für Orientierung — Pflegekräften und Arbeitgebern dabei zu helfen, zu verstehen, wo sie stehen, was als Nächstes kommt und wie sie den Weg mit mehr Sicherheit gehen können.",
        "Das Unternehmen versteht Rekrutierung nicht als schnelle Transaktion. Es versteht Rekrutierung als geführten Weg. Deshalb ist der Leitsatz wichtig:",
      ],
      highlighted: "we really do care.",
    },
    purpose: {
      eyebrow: "Zweck",
      title:
        "Ein klarerer Weg für internationale Pflegekräfte-Rekrutierung.",
      description:
        "CareRadar wurde geschaffen, um den Prozess für Pflegekräfte verständlicher und für Arbeitgeber verlässlicher zu machen.",
      nursesTitle: "Für Pflegekräfte",
      nursesDescription:
        "CareRadar hilft Pflegekräften, den internationalen Rekrutierungsprozess zu verstehen, bevor sie wichtige Karriereentscheidungen treffen. Dazu gehören Profilbereitschaft, Verständnis der Dokumentation, Interviewvorbereitung und Arbeitgeberkoordination.",
      employersTitle: "Für Arbeitgeber",
      employersDescription:
        "CareRadar unterstützt Gesundheitsorganisationen, die Pflegefachkräfte suchen, indem es Struktur in die frühen Rekrutierungsphasen, die Kandidatenkommunikation und die eignungsbasierte Koordination bringt.",
      closing:
        "Das Ergebnis ist eine ausgewogenere Rekrutierungserfahrung — eine, die den Weg der Pflegekraft respektiert und gleichzeitig die Verantwortung des Arbeitgebers für Patientenversorgung und Servicequalität versteht.",
    },
    missionCards: [
      {
        eyebrow: "Mission",
        title: "Pflegekräfte mit Klarheit und Fürsorge begleiten.",
        description:
          "Die Mission von CareRadar ist es, qualifizierte Pflegekräfte bei internationalen Möglichkeiten mit besserer Vorbereitung, klareren Erwartungen und verlässlicher Orientierung zu unterstützen.",
      },
      {
        eyebrow: "Vision",
        title:
          "Eine vertrauenswürdige Brücke in der Gesundheitsrekrutierung werden.",
        description:
          "Die langfristige Vision ist es, Gesundheitssysteme mit geeigneten Pflegefachkräften zu unterstützen und Kandidaten Zugang zu sinnvollen, gut begleiteten Chancen im Ausland zu ermöglichen.",
      },
      {
        eyebrow: "Versprechen",
        title: "Von Anfang bis Ende klar kommunizieren.",
        description:
          "CareRadar ist überzeugt, dass Rekrutierung nie unklar wirken sollte. Jede Kandidatin, jeder Kandidat und jeder Arbeitgeber sollte den nächsten Schritt und den Grund dafür verstehen.",
      },
    ],
    valuesSection: {
      eyebrow: "Werte",
      title: "Die Prinzipien hinter jeder Rekrutierungsreise.",
      description:
        "Die Werte von CareRadar sollen Vertrauen schaffen, nicht Druck. Im Mittelpunkt steht langfristige Eignung statt schneller Versprechen.",
      values: [
        {
          title: "Fürsorge zuerst",
          description:
            "Jede Interaktion mit Pflegekräften und Arbeitgebern sollte respektvoll, geduldig und gut begleitet sein.",
        },
        {
          title: "Klarheit vor Versprechen",
          description:
            "CareRadar setzt auf realistische Orientierung, klare nächste Schritte und verantwortungsvolle Kommunikation.",
        },
        {
          title: "Ethische Rekrutierung",
          description:
            "Der Prozess basiert auf Würde, Transparenz und langfristiger Eignung.",
        },
        {
          title: "Fokus auf Gesundheitswesen",
          description:
            "CareRadar ist speziell auf Rekrutierungswege im Pflege- und Gesundheitswesen ausgerichtet.",
        },
      ],
    },
    cta: {
      eyebrow: "Mit CareRadar arbeiten",
      title: "Ein Rekrutierungsgespräch sollte mit Klarheit beginnen.",
      description:
        "Ob Sie Pflegekraft oder Arbeitgeber im Gesundheitswesen sind — CareRadar hilft Ihnen, den passenden Weg zu verstehen, bevor Sie den nächsten Schritt gehen.",
      primary: "CareRadar kontaktieren",
      secondary: "Prozess ansehen",
    },
  },
} as const;

type AboutProps = {
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
}: AboutProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = pageText[locale];

  return {
    title: text.metadata.title,
    description: text.metadata.description,
  };
}

type BrandPromiseText = {
  label: string;
  title: string;
  description: string;
};

function BrandPromiseBox({
  mobile = false,
  text,
}: {
  mobile?: boolean;
  text: BrandPromiseText;
}) {
  return (
    <div
      className={`relative mx-auto w-full max-w-sm ${
        mobile ? "md:hidden" : "hidden md:block md:max-w-md"
      }`}
    >
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
            {text.label}
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#061f3d]">
            {text.title}
          </h2>

          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-600">
            {text.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function AboutPage({ params }: AboutProps) {
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

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1fr_0.9fr]">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.hero.eyebrow}
            </p>

            <h1 className="mx-auto mt-5 max-w-4xl break-words text-[2rem] font-semibold leading-[1.12] tracking-tight text-[#061f3d] [overflow-wrap:anywhere] sm:text-5xl md:mx-0 md:text-6xl md:leading-[1.04]">
              {text.hero.title}
            </h1>
          </div>

          <BrandPromiseBox text={text.brandPromise} />
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.leadership.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              {text.leadership.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {text.leadership.description}
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {text.founders.map((founder) => (
              <article
                key={founder.name}
                className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-100 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200"
              >
                <div className="flex h-full flex-col">
                  <div className="relative flex h-[260px] w-full items-center justify-center bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_55%,#eafffb_100%)] p-4 sm:h-[300px]">
                    <Image
                      src={founder.image}
                      alt={founder.name}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <div className="text-center">
                      <h3 className="text-2xl font-semibold tracking-tight text-[#061f3d]">
                        {founder.name}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-[#08a99d]">
                        {founder.role}
                      </p>

                      <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-[#08a99d] to-transparent" />
                    </div>

                    <div className="mt-6 space-y-4">
                      {founder.bio.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-sm leading-7 text-slate-600"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE BRAND PROMISE */}
      <section className="bg-white px-5 py-10 md:hidden">
        <BrandPromiseBox mobile text={text.brandPromise} />
      </section>

      {/* STORY */}
      <section className="bg-white px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.story.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              {text.story.title}
            </h2>
          </div>

          <div className="rounded-[1.7rem] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100 md:p-8">
            <div className="mb-5 h-px w-full bg-gradient-to-r from-[#08a99d] via-slate-100 to-transparent" />

            <div className="space-y-5 text-sm leading-8 text-slate-600 md:text-base">
              {text.story.paragraphs.map((paragraph, index) => (
                <p key={paragraph}>
                  {paragraph}
                  {index === text.story.paragraphs.length - 1 && (
                    <>
                      {" "}
                      <span className="font-semibold text-[#08264a]">
                        {text.story.highlighted}
                      </span>
                    </>
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DARK PURPOSE SECTION */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#061f3d] shadow-2xl shadow-slate-200">
          <div className="grid md:grid-cols-3">
            <div className="relative p-7 text-white md:col-span-1 md:p-10">
              <div className="absolute left-0 top-0 h-full w-1 bg-[#08a99d]" />

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#10c4b6]">
                {text.purpose.eyebrow}
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                {text.purpose.title}
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-300">
                {text.purpose.description}
              </p>
            </div>

            <div className="border-t border-white/10 p-7 md:col-span-2 md:border-l md:border-t-0 md:p-10">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <Stethoscope size={28} className="text-[#10c4b6]" />
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {text.purpose.nursesTitle}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {text.purpose.nursesDescription}
                  </p>
                </div>

                <div>
                  <Users size={28} className="text-[#10c4b6]" />
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {text.purpose.employersTitle}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {text.purpose.employersDescription}
                  </p>
                </div>
              </div>

              <div className="mt-8 h-px bg-white/10" />

              <p className="mt-8 text-sm leading-7 text-slate-300 md:text-base">
                {text.purpose.closing}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION VISION */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {text.missionCards.map((card) => (
            <div
              key={card.eyebrow}
              className="rounded-[1.7rem] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100 md:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
                {card.eyebrow}
              </p>

              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#061f3d]">
                {card.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.valuesSection.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              {text.valuesSection.title}
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
              {text.valuesSection.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {text.valuesSection.values.map((value, index) => {
              const Icon = valueIcons[index] ?? HeartHandshake;

              return (
                <div
                  key={value.title}
                  className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:border-[#08a99d]/25 hover:shadow-lg hover:shadow-slate-100"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-[#08264a]">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
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