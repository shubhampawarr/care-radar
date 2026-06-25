import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { getSafeLocale, type Locale } from "@/lib/locale";
import { createClient } from "@/lib/supabase/server";

const pageText = {
  en: {
    metadata: {
      title: "Dashboard",
      description: "CareRadar portal dashboard.",
    },
    eyebrow: "CareRadar Portal",
    title: "Welcome to your CareRadar dashboard.",
    greeting: "Hi",
    description:
      "This is the starting point for the future recruitment portal. Application forms, document upload, status tracking, and portal tools will be added in the next phases.",
    status: "Dashboard foundation active",
    profileTitle: "Account Details",
    emailLabel: "Email",
    nameLabel: "Name",
    contact: "Contact CareRadar",
    backHome: "Back to homepage",
  },
  de: {
    metadata: {
      title: "Dashboard",
      description: "CareRadar Portal-Dashboard.",
    },
    eyebrow: "CareRadar Portal",
    title: "Willkommen in Ihrem CareRadar Dashboard.",
    greeting: "Hallo",
    description:
      "Dies ist der Ausgangspunkt für das zukünftige Rekrutierungsportal. Bewerbungsformulare, Dokumentenupload, Statusverfolgung und Portal-Tools werden in den nächsten Phasen ergänzt.",
    status: "Dashboard-Grundlage aktiv",
    profileTitle: "Kontodetails",
    emailLabel: "E-Mail",
    nameLabel: "Name",
    contact: "CareRadar kontaktieren",
    backHome: "Zur Startseite",
  },
} as const;

type DashboardPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

function localizedHref(locale: Locale, href: string) {
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

function getUserFirstName(user: {
  email?: string;
  user_metadata?: {
    first_name?: string;
    full_name?: string;
  };
}) {
  const firstName = user.user_metadata?.first_name;

  if (typeof firstName === "string" && firstName.trim()) {
    return firstName.trim();
  }

  const fullName = user.user_metadata?.full_name;

  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim().split(" ")[0];
  }

  if (user.email) {
    return user.email.split("@")[0];
  }

  return "";
}

function getFullName(user: {
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    full_name?: string;
  };
}) {
  const firstName = user.user_metadata?.first_name;
  const lastName = user.user_metadata?.last_name;
  const fullName = user.user_metadata?.full_name;

  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim();
  }

  return `${firstName ?? ""} ${lastName ?? ""}`.trim() || "—";
}

export async function generateMetadata({
  params,
}: DashboardPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = pageText[locale];

  return {
    title: text.metadata.title,
    description: text.metadata.description,
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = pageText[locale];

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(localizedHref(locale, "/login"));
  }

  const firstName = getUserFirstName(user);
  const fullName = getFullName(user);

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_78%)] px-5 py-16 md:px-8 md:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e6eef7_1px,transparent_1px),linear-gradient(to_bottom,#e6eef7_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.18]" />
      <div className="absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-[#08a99d]/10 blur-3xl" />
      <div className="absolute right-[-120px] top-28 h-80 w-80 rounded-full bg-[#08264a]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-7 text-center shadow-2xl shadow-slate-200 md:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
            <LayoutDashboard size={28} />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
            {text.eyebrow}
          </p>

          <h1 className="mx-auto mt-4 max-w-3xl text-[2rem] font-semibold leading-[1.12] tracking-tight text-[#061f3d] sm:text-5xl">
            {text.greeting} {firstName}, {text.title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            {text.description}
          </p>

          <div className="mx-auto mt-6 inline-flex rounded-full border border-[#08a99d]/20 bg-[#08a99d]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#087f77]">
            {text.status}
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={localizedHref(locale, "/")}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
            >
              {text.backHome}
            </Link>

            <Link
              href={localizedHref(locale, "/contact")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              {text.contact} <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100 md:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#08264a]/10 text-[#08264a] ring-1 ring-[#08264a]/10">
            <UserRound size={24} />
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#061f3d]">
            {text.profileTitle}
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-[#f7fbff] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {text.nameLabel}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#08264a]">
                {fullName}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-[#f7fbff] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {text.emailLabel}
              </p>
              <p className="mt-1 break-all text-sm font-semibold text-[#08264a]">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-100 bg-white p-4 text-sm leading-6 text-slate-600">
            <LogOut size={18} className="shrink-0 text-[#08a99d]" />
            <span>
              Use the navbar logout button to securely exit your account.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}