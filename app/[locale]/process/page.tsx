import type { Metadata } from "next";
import ProcessPathwayClient from "@/components/ProcessPathwayClient";
import type { ProcessAudience } from "@/components/ProcessAudienceDoors";
import { getSafeLocale } from "@/lib/locale";

const metadataText = {
  en: {
    title: "Pathways to Nursing in Germany",
    description:
      "Choose your path as a candidate or employer and explore CareRadar process routes for international nursing recruitment in Germany.",
  },
  de: {
    title: "Wege in die Pflege in Deutschland",
    description:
      "Wählen Sie Ihren Weg als Kandidat oder Arbeitgeber und entdecken Sie CareRadar-Prozesswege für internationale Pflegekräfte-Rekrutierung in Deutschland.",
  },
} as const;

type ProcessProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{ audience?: string }>;
};

function parseAudience(value: string | undefined): ProcessAudience | null {
  if (value === "candidate" || value === "employer") return value;
  return null;
}

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

export default async function ProcessPage({
  params,
  searchParams,
}: ProcessProps) {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const { audience: rawAudience } = await searchParams;
  const initialAudience = parseAudience(rawAudience);

  return (
    <ProcessPathwayClient locale={locale} initialAudience={initialAudience} />
  );
}