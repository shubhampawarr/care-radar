import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";
import { getSafeLocale, type Locale } from "@/lib/locale";

const pageText = {
  en: {
    metadata: {
      title: "Legal",
      description: "Legal information for CareRadar.",
    },
    eyebrow: "Legal Information",
    title: "Legal",
    intro:
      "Legal information for CareRadar UG (haftungsbeschränkt).",
    back: "Back to home",
    sections: [
      {
        title: "Information according to § 5 DDG",
        items: [
          "CareRadar UG (haftungsbeschränkt)",
          "Bachstraße 145",
          "22083 Hamburg",
          "Germany",
        ],
      },
      {
        title: "Represented by",
        items: ["Akshat Gupta", "Ron Rüdiger"],
      },
      {
        title: "Contact",
        items: ["Phone: +49 176 31457123", "Email: info@careradar.de"],
      },
      {
        title: "Commercial register entry",
        items: [
          "Registration in the commercial register.",
          "Register court: Amtsgericht Hamburg",
          "Register number: HRB [FOLGT]",
        ],
      },
      {
        title: "VAT ID",
        items: [
          "VAT identification number according to § 27a UStG:",
          "[FOLGT]",
        ],
      },
      {
        title: "Responsible for content",
        items: [
          "CareRadar UG (haftungsbeschränkt)",
          "Bachstraße 145",
          "22083 Hamburg",
          "Germany",
        ],
      },
      {
        title: "EU dispute resolution",
        items: [
          "The European Commission provides a platform for online dispute resolution:",
          "https://ec.europa.eu/consumers/odr/",
        ],
      },
      {
        title: "Consumer dispute resolution",
        items: [
          "We are not obliged and not willing to participate in dispute resolution proceedings before a consumer arbitration board.",
        ],
      },
    ],
  },
  de: {
    metadata: {
      title: "Impressum",
      description: "Impressum und rechtliche Angaben von CareRadar.",
    },
    eyebrow: "Rechtliche Angaben",
    title: "Impressum",
    intro: "Angaben gemäß § 5 DDG für CareRadar UG (haftungsbeschränkt).",
    back: "Zurück zur Startseite",
    sections: [
      {
        title: "Angaben gemäß § 5 DDG",
        items: [
          "CareRadar UG (haftungsbeschränkt)",
          "Bachstraße 145",
          "22083 Hamburg",
          "Deutschland",
        ],
      },
      {
        title: "Vertreten durch",
        items: ["Akshat Gupta", "Ron Rüdiger"],
      },
      {
        title: "Kontakt",
        items: ["Telefon: +49 176 31457123", "E-Mail: info@careradar.de"],
      },
      {
        title: "Registereintrag",
        items: [
          "Eintragung im Handelsregister.",
          "Registergericht: Amtsgericht Hamburg",
          "Registernummer: HRB [FOLGT]",
        ],
      },
      {
        title: "Umsatzsteuer-ID",
        items: [
          "Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:",
          "[FOLGT]",
        ],
      },
      {
        title: "Verantwortlich für den Inhalt",
        items: [
          "CareRadar UG (haftungsbeschränkt)",
          "Bachstraße 145",
          "22083 Hamburg",
          "Deutschland",
        ],
      },
      {
        title: "EU-Streitschlichtung",
        items: [
          "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:",
          "https://ec.europa.eu/consumers/odr/",
        ],
      },
      {
        title: "Verbraucherstreitbeilegung",
        items: [
          "Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
        ],
      },
    ],
  },
} as const;

type ImpressumProps = {
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
}: ImpressumProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = pageText[locale];

  return {
    title: text.metadata.title,
    description: text.metadata.description,
  };
}

export default async function ImpressumPage({ params }: ImpressumProps) {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = pageText[locale];

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_78%)] px-5 py-10 md:px-8 md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e6eef7_1px,transparent_1px),linear-gradient(to_bottom,#e6eef7_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.18]" />
        <div className="absolute left-[-130px] top-20 h-72 w-72 rounded-full bg-[#08a99d]/10 blur-3xl" />
        <div className="absolute right-[-130px] top-28 h-80 w-80 rounded-full bg-[#08264a]/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#08a99d]/20 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#087d76] shadow-sm backdrop-blur">
            <Scale size={14} />
            {text.eyebrow}
          </div>

          <h1 className="mx-auto mt-5 max-w-4xl text-[2.4rem] font-semibold leading-[1.08] tracking-tight text-[#061f3d] sm:text-5xl md:text-6xl">
            {text.title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            {text.intro}
          </p>
        </div>
      </section>

      <section className="bg-white px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100 md:p-8">
            <div className="mb-6 h-px w-full bg-gradient-to-r from-[#08a99d] via-slate-100 to-transparent" />

            <div className="space-y-8">
              {text.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-xl font-semibold tracking-tight text-[#061f3d]">
                    {section.title}
                  </h2>

                  <div className="mt-3 space-y-2 text-sm leading-7 text-slate-600 md:text-base">
                    {section.items.map((item) => {
                      const isUrl = item.startsWith("https://");

                      if (isUrl) {
                        return (
                          <p key={item}>
                            <a
                              href={item}
                              target="_blank"
                              rel="noreferrer"
                              className="break-all font-semibold text-[#08a99d] underline-offset-4 hover:underline"
                            >
                              {item}
                            </a>
                          </p>
                        );
                      }

                      return <p key={item}>{item}</p>;
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href={localizedHref(locale, "/")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] shadow-sm transition hover:border-[#08a99d] hover:text-[#08a99d]"
            >
              <ArrowLeft size={17} />
              {text.back}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}