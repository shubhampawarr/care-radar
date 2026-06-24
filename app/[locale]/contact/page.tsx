import type { Metadata } from "next";
import ContactPageClient from "@/components/ContactPageClient";
import { getSafeLocale } from "@/lib/locale";

const pageText = {
  en: {
    title: "Contact",
    description:
      "Contact CareRadar for international nurse recruitment enquiries, nurse applications, and healthcare employer hiring support.",
  },
  de: {
    title: "Kontakt",
    description:
      "Kontaktieren Sie CareRadar für internationale Pflegekräfte-Rekrutierung, Bewerbungen von Pflegekräften und Unterstützung für Arbeitgeber im Gesundheitswesen.",
  },
} as const;

type ContactProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ContactProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = pageText[locale];

  return {
    title: text.title,
    description: text.description,
  };
}

export default async function ContactPage({ params }: ContactProps) {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);

  return <ContactPageClient locale={locale} />;
}