import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getSafeLocale, type Locale } from "@/lib/locale";

const pageText = {
  en: {
    metadata: {
      title: "Privacy Policy",
      description:
        "Privacy policy for CareRadar, including information on data processing, hosting, contact communication, and user rights.",
    },
    eyebrow: "Privacy",
    title: "Privacy Policy",
    intro:
      "This privacy policy explains how CareRadar processes personal data when visitors use this website.",
    back: "Back to home",
    sections: [
      {
        title: "1. Controller",
        paragraphs: [
          "The controller responsible for data processing on this website is:",
          "CareRadar UG (haftungsbeschränkt)\nBachstraße 145\n22083 Hamburg\nGermany",
          "Email: info@careradar.de",
        ],
      },
      {
        title: "2. General information on data processing",
        paragraphs: [
          "We process personal data only where this is necessary to provide this website, communicate with visitors, respond to enquiries, operate technical systems, or comply with legal obligations.",
          "Personal data means any information relating to an identified or identifiable natural person, such as name, email address, IP address, or communication content.",
        ],
      },
      {
        title: "3. Website hosting and server logs",
        paragraphs: [
          "This website may be hosted by an external hosting provider, currently Vercel. When visitors access the website, technical information may be processed automatically, including IP address, browser type, operating system, requested pages, date and time of access, and similar technical log data.",
          "This processing is necessary to deliver the website securely, maintain technical stability, detect errors, and protect the website from misuse.",
        ],
      },
      {
        title: "4. Contact by email",
        paragraphs: [
          "If visitors contact CareRadar by email, the information provided in the enquiry will be processed for the purpose of handling and responding to the request.",
          "This may include name, email address, message content, and any additional information voluntarily provided by the sender.",
        ],
      },
      {
        title: "5. Login and account functionality",
        paragraphs: [
          "If login or account functionality is available on the website, technical and account-related data may be processed to create, manage, and secure user access.",
          "This may include email address, authentication data, login timestamps, and technical information required for secure account operation.",
          "If Supabase or similar infrastructure is used for authentication or database services, data may be processed through that service provider as part of the website’s technical operation.",
        ],
      },
      {
        title: "6. External services and APIs",
        paragraphs: [
          "The website may use external technical services required for its operation, such as hosting providers, authentication infrastructure, or API services.",
          "For example, if an exchange-rate API is used to display salary estimates in another currency, technical request data may be processed by the relevant service provider.",
        ],
      },
      {
        title: "7. Cookies and tracking",
        paragraphs: [
          "The current public website is intended to operate without marketing tracking tools unless such tools are added later.",
          "A cookie consent banner is generally required only if non-essential cookies or tracking technologies are used, such as Google Analytics, Meta Pixel, LinkedIn Insight Tag, Hotjar, or similar tools.",
          "If such tools are added in the future, this privacy policy and the website’s consent mechanism should be updated accordingly.",
        ],
      },
      {
        title: "8. Legal basis for processing",
        paragraphs: [
          "Where processing is necessary to provide the website and maintain security, the legal basis is legitimate interest.",
          "Where visitors contact us voluntarily, processing may be based on pre-contractual measures, consent, or legitimate interest depending on the nature of the enquiry.",
          "Where processing is required by law, the legal basis is compliance with a legal obligation.",
        ],
      },
      {
        title: "9. Data retention",
        paragraphs: [
          "Personal data is stored only for as long as necessary for the respective purpose or as required by legal retention obligations.",
          "Email enquiries may be retained for the duration necessary to handle the request and maintain business records.",
        ],
      },
      {
        title: "10. Data subject rights",
        paragraphs: [
          "Under applicable data protection law, users may have the right to request access to their personal data, rectification, erasure, restriction of processing, data portability, and objection to processing.",
          "Users may also have the right to lodge a complaint with a competent data protection supervisory authority.",
        ],
      },
      {
        title: "11. Updates to this privacy policy",
        paragraphs: [
          "This privacy policy may be updated when the website, technical infrastructure, legal requirements, or data processing activities change.",
          "Before launching a full candidate portal, application system, document upload, or dashboard, this policy should be reviewed and expanded accordingly.",
        ],
      },
    ],
  },
  de: {
    metadata: {
      title: "Datenschutzerklärung",
      description:
        "Datenschutzerklärung von CareRadar mit Informationen zur Verarbeitung personenbezogener Daten, Hosting, Kontaktaufnahme und Betroffenenrechten.",
    },
    eyebrow: "Datenschutz",
    title: "Datenschutzerklärung",
    intro:
      "Diese Datenschutzerklärung erläutert, wie CareRadar personenbezogene Daten verarbeitet, wenn Besucher diese Website nutzen.",
    back: "Zurück zur Startseite",
    sections: [
      {
        title: "1. Verantwortlicher",
        paragraphs: [
          "Verantwortlich für die Datenverarbeitung auf dieser Website ist:",
          "CareRadar UG (haftungsbeschränkt)\nBachstraße 145\n22083 Hamburg\nDeutschland",
          "E-Mail: info@careradar.de",
        ],
      },
      {
        title: "2. Allgemeine Hinweise zur Datenverarbeitung",
        paragraphs: [
          "Wir verarbeiten personenbezogene Daten nur, soweit dies erforderlich ist, um diese Website bereitzustellen, mit Besuchern zu kommunizieren, Anfragen zu beantworten, technische Systeme zu betreiben oder gesetzliche Pflichten zu erfüllen.",
          "Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen, zum Beispiel Name, E-Mail-Adresse, IP-Adresse oder Kommunikationsinhalte.",
        ],
      },
      {
        title: "3. Hosting und Server-Logfiles",
        paragraphs: [
          "Diese Website kann bei einem externen Hosting-Anbieter betrieben werden, derzeit Vercel. Beim Aufruf der Website können automatisch technische Informationen verarbeitet werden, darunter IP-Adresse, Browsertyp, Betriebssystem, aufgerufene Seiten, Datum und Uhrzeit des Zugriffs sowie ähnliche technische Logdaten.",
          "Diese Verarbeitung ist erforderlich, um die Website sicher auszuliefern, technische Stabilität zu gewährleisten, Fehler zu erkennen und die Website vor Missbrauch zu schützen.",
        ],
      },
      {
        title: "4. Kontaktaufnahme per E-Mail",
        paragraphs: [
          "Wenn Besucher CareRadar per E-Mail kontaktieren, werden die in der Anfrage angegebenen Informationen verarbeitet, um die Anfrage zu bearbeiten und zu beantworten.",
          "Dazu können Name, E-Mail-Adresse, Nachrichteninhalt und weitere freiwillig angegebene Informationen gehören.",
        ],
      },
      {
        title: "5. Login- und Kontofunktionen",
        paragraphs: [
          "Sofern Login- oder Kontofunktionen auf der Website verfügbar sind, können technische und kontobezogene Daten verarbeitet werden, um Benutzerzugänge zu erstellen, zu verwalten und zu sichern.",
          "Dazu können E-Mail-Adresse, Authentifizierungsdaten, Login-Zeitpunkte und technische Informationen gehören, die für den sicheren Betrieb des Kontos erforderlich sind.",
          "Wenn Supabase oder eine ähnliche Infrastruktur für Authentifizierung oder Datenbankdienste genutzt wird, können Daten im Rahmen des technischen Betriebs der Website über diesen Dienstleister verarbeitet werden.",
        ],
      },
      {
        title: "6. Externe Dienste und APIs",
        paragraphs: [
          "Die Website kann externe technische Dienste nutzen, die für den Betrieb erforderlich sind, zum Beispiel Hosting-Anbieter, Authentifizierungsinfrastruktur oder API-Dienste.",
          "Wenn beispielsweise eine Wechselkurs-API verwendet wird, um Gehaltsschätzungen in einer anderen Währung anzuzeigen, können technische Anfragedaten durch den jeweiligen Dienstleister verarbeitet werden.",
        ],
      },
      {
        title: "7. Cookies und Tracking",
        paragraphs: [
          "Die aktuelle öffentliche Website ist darauf ausgelegt, ohne Marketing-Tracking-Tools betrieben zu werden, sofern solche Tools nicht später ergänzt werden.",
          "Ein Cookie-Banner ist in der Regel nur erforderlich, wenn nicht notwendige Cookies oder Tracking-Technologien verwendet werden, zum Beispiel Google Analytics, Meta Pixel, LinkedIn Insight Tag, Hotjar oder ähnliche Dienste.",
          "Sollten solche Tools künftig eingebunden werden, müssen diese Datenschutzerklärung und der Einwilligungsmechanismus der Website entsprechend angepasst werden.",
        ],
      },
      {
        title: "8. Rechtsgrundlagen der Verarbeitung",
        paragraphs: [
          "Soweit die Verarbeitung zur Bereitstellung der Website und zur Gewährleistung der Sicherheit erforderlich ist, erfolgt sie auf Grundlage berechtigter Interessen.",
          "Wenn Besucher uns freiwillig kontaktieren, kann die Verarbeitung je nach Art der Anfrage auf vorvertraglichen Maßnahmen, Einwilligung oder berechtigten Interessen beruhen.",
          "Soweit eine Verarbeitung gesetzlich erforderlich ist, erfolgt sie zur Erfüllung einer rechtlichen Verpflichtung.",
        ],
      },
      {
        title: "9. Speicherdauer",
        paragraphs: [
          "Personenbezogene Daten werden nur so lange gespeichert, wie dies für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.",
          "E-Mail-Anfragen können so lange aufbewahrt werden, wie dies zur Bearbeitung der Anfrage und zur Dokumentation geschäftlicher Kommunikation erforderlich ist.",
        ],
      },
      {
        title: "10. Rechte betroffener Personen",
        paragraphs: [
          "Betroffene Personen können nach geltendem Datenschutzrecht das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gegen die Verarbeitung haben.",
          "Außerdem kann ein Beschwerderecht bei einer zuständigen Datenschutzaufsichtsbehörde bestehen.",
        ],
      },
      {
        title: "11. Aktualisierung dieser Datenschutzerklärung",
        paragraphs: [
          "Diese Datenschutzerklärung kann angepasst werden, wenn sich die Website, die technische Infrastruktur, rechtliche Anforderungen oder Datenverarbeitungsvorgänge ändern.",
          "Vor dem Start eines vollständigen Kandidatenportals, Bewerbungssystems, Dokumenten-Uploads oder Dashboards sollte diese Erklärung geprüft und entsprechend erweitert werden.",
        ],
      },
    ],
  },
} as const;

type DatenschutzProps = {
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
}: DatenschutzProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = pageText[locale];

  return {
    title: text.metadata.title,
    description: text.metadata.description,
  };
}

export default async function DatenschutzPage({ params }: DatenschutzProps) {
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
            <ShieldCheck size={14} />
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

                  <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 md:text-base">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
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