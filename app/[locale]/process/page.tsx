import type { Metadata } from "next";
import { getSafeLocale } from "@/lib/locale";
import ProcessPathwayClient from "@/components/ProcessPathwayClient";

const metadataText = {
  en: {
    title: "Pathways to Nursing in Germany",
    description:
      "Explore CareRadar pathways from Indian nursing qualifications to working in Germany, including Degree, GNM, and ANM routes.",
  },
  de: {
    title: "Wege in die Pflege in Deutschland",
    description:
      "Entdecken Sie CareRadar-Wege von indischen Pflegequalifikationen zur Arbeit in Deutschland, einschließlich Degree-, GNM- und ANM-Routen.",
  },
} as const;

type ProcessProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProcessProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = metadataText[locale];

  return {
    title: text.title,
    description: text.description,
  };
}

export default async function ProcessPage({ params }: ProcessProps) {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);

  return <ProcessPathwayClient locale={locale} />;
}