import type { Metadata } from "next";
import { getSafeLocale } from "@/lib/locale";
import LoginPageClient from "@/components/LoginPageClient";

const metadataText = {
  en: {
    title: "Login",
    description:
      "Login or create a CareRadar account to access the CareRadar portal.",
  },
  de: {
    title: "Anmelden",
    description:
      "Melden Sie sich an oder registrieren Sie sich, um auf das CareRadar Portal zuzugreifen.",
  },
} as const;

type LoginPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: LoginPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = metadataText[locale];

  return {
    title: text.title,
    description: text.description,
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);

  return <LoginPageClient locale={locale} />;
}