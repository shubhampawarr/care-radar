import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { getSafeLocale, type Locale } from "@/lib/locale";
import { createClient } from "@/lib/supabase/server";

const pageText = {
  en: {
    metadata: {
      title: "Dashboard",
      description: "CareRadar portal dashboard.",
    },
    eyebrow: "CareRadar Portal",
    title: "Your CareRadar portal is ready.",
    greeting: "Hi",
    description:
      "This dashboard is the foundation for the future CareRadar recruitment portal. Profile details, applications, documents, and journey tracking will be expanded in the next phases.",
    secureSession: "Secure session active",
    accountVerified: "Account created",
    portalFoundation: "Portal foundation active",

    profileTitle: "Profile Overview",
    profileDescription:
      "Your personal account is connected. Profile completion and detailed candidate information will be added in the next phase.",
    nameLabel: "Name",
    emailLabel: "Email",
    accountStatusLabel: "Account status",
    activeAccount: "Active",

    applicationTitle: "Application Status",
    applicationDescription:
      "Your application journey will appear here once the recruitment workflow is activated.",
    applicationStatus: "Not started",
    applicationNote: "Coming in the next phase",

    documentsTitle: "Documents",
    documentsDescription:
      "Future document upload will support CVs, nursing certificates, language certificates, and verification files.",
    documentsStatus: "Upload coming soon",

    journeyTitle: "Recruitment Journey",
    journeyDescription:
      "CareRadar will guide candidates through profile review, language progress, recognition steps, employer matching, and preparation for Germany.",
    journeyItems: [
      "Profile review",
      "Document collection",
      "Language progress",
      "Recognition pathway",
      "Employer matching",
      "Germany preparation",
    ],

    nextStepsTitle: "Next Steps",
    nextSteps: [
      "Complete the portal dashboard foundation",
      "Add profile completion fields",
      "Add application workflow",
      "Add document upload",
      "Add admin review tools",
    ],

    quickActionsTitle: "Quick Actions",
    contact: "Contact CareRadar",
    backHome: "Back to homepage",
    process: "View process",
    comingSoon: "Coming soon",
  },
  de: {
    metadata: {
      title: "Dashboard",
      description: "CareRadar Portal-Dashboard.",
    },
    eyebrow: "CareRadar Portal",
    title: "Ihr CareRadar Portal ist bereit.",
    greeting: "Hallo",
    description:
      "Dieses Dashboard bildet die Grundlage für das zukünftige CareRadar Rekrutierungsportal. Profildetails, Bewerbungen, Dokumente und Statusverfolgung werden in den nächsten Phasen erweitert.",
    secureSession: "Sichere Sitzung aktiv",
    accountVerified: "Konto erstellt",
    portalFoundation: "Portal-Grundlage aktiv",

    profileTitle: "Profilübersicht",
    profileDescription:
      "Ihr persönliches Konto ist verbunden. Profilvervollständigung und detaillierte Kandidateninformationen werden in der nächsten Phase ergänzt.",
    nameLabel: "Name",
    emailLabel: "E-Mail",
    accountStatusLabel: "Kontostatus",
    activeAccount: "Aktiv",

    applicationTitle: "Bewerbungsstatus",
    applicationDescription:
      "Ihr Bewerbungsprozess wird hier angezeigt, sobald der Rekrutierungsablauf aktiviert ist.",
    applicationStatus: "Noch nicht gestartet",
    applicationNote: "Kommt in der nächsten Phase",

    documentsTitle: "Dokumente",
    documentsDescription:
      "Der zukünftige Dokumentenupload unterstützt Lebensläufe, Pflegezertifikate, Sprachzertifikate und Nachweisdokumente.",
    documentsStatus: "Upload folgt bald",

    journeyTitle: "Rekrutierungsprozess",
    journeyDescription:
      "CareRadar begleitet Kandidaten durch Profilprüfung, Sprachfortschritt, Anerkennungsschritte, Arbeitgebervermittlung und Vorbereitung auf Deutschland.",
    journeyItems: [
      "Profilprüfung",
      "Dokumentensammlung",
      "Sprachfortschritt",
      "Anerkennungsweg",
      "Arbeitgebervermittlung",
      "Vorbereitung auf Deutschland",
    ],

    nextStepsTitle: "Nächste Schritte",
    nextSteps: [
      "Portal-Dashboard-Grundlage fertigstellen",
      "Profilfelder ergänzen",
      "Bewerbungsablauf hinzufügen",
      "Dokumentenupload hinzufügen",
      "Admin-Prüfungstools hinzufügen",
    ],

    quickActionsTitle: "Schnellzugriff",
    contact: "CareRadar kontaktieren",
    backHome: "Zur Startseite",
    process: "Prozess ansehen",
    comingSoon: "Kommt bald",
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

  const statusCards = [
    {
      title: text.secureSession,
      value: "01",
      icon: ShieldCheck,
    },
    {
      title: text.accountVerified,
      value: "02",
      icon: BadgeCheck,
    },
    {
      title: text.portalFoundation,
      value: "03",
      icon: LayoutDashboard,
    },
  ];

  const portalCards = [
    {
      title: text.applicationTitle,
      description: text.applicationDescription,
      status: text.applicationStatus,
      note: text.applicationNote,
      icon: ClipboardList,
    },
    {
      title: text.documentsTitle,
      description: text.documentsDescription,
      status: text.documentsStatus,
      note: text.comingSoon,
      icon: UploadCloud,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_72%)] px-5 py-10 md:px-8 md:py-16">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e6eef7_1px,transparent_1px),linear-gradient(to_bottom,#e6eef7_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.18]" />
      <div className="absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-[#08a99d]/10 blur-3xl" />
      <div className="absolute right-[-120px] top-28 h-80 w-80 rounded-full bg-[#08264a]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-2xl shadow-slate-200 md:p-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
              <LayoutDashboard size={28} />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.eyebrow}
            </p>

            <h1 className="mt-4 max-w-4xl text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-[#061f3d] sm:text-5xl md:text-6xl">
              {text.greeting} {firstName}, {text.title}
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              {text.description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {statusCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-slate-100 bg-[#f7fbff] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#08a99d] shadow-sm">
                        <Icon size={20} />
                      </div>

                      <span className="text-xs font-semibold text-slate-300">
                        {card.value}
                      </span>
                    </div>

                    <p className="mt-4 text-sm font-semibold text-[#08264a]">
                      {card.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-[#08264a] p-7 text-white shadow-2xl shadow-slate-200 md:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#08e0d1] ring-1 ring-white/10">
              <UserRound size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight">
              {text.profileTitle}
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/70">
              {text.profileDescription}
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                  {text.nameLabel}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {fullName}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                  {text.emailLabel}
                </p>
                <p className="mt-1 break-all text-sm font-semibold text-white">
                  {user.email}
                </p>
              </div>

              <div className="rounded-2xl border border-[#08e0d1]/20 bg-[#08e0d1]/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#08e0d1]/70">
                  {text.accountStatusLabel}
                </p>
                <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-[#08e0d1]">
                  <CheckCircle2 size={16} />
                  {text.activeAccount}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {portalCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-xl shadow-slate-100 md:p-8"
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
                    <Icon size={24} />
                  </div>

                  <span className="rounded-full border border-[#08a99d]/20 bg-[#08a99d]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#087f77]">
                    {card.note}
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#061f3d]">
                  {card.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {card.description}
                </p>

                <div className="mt-6 rounded-2xl border border-slate-100 bg-[#f7fbff] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#08264a]">
                    {card.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-xl shadow-slate-100 md:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#08264a]/10 text-[#08264a] ring-1 ring-[#08264a]/10">
              <Sparkles size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#061f3d]">
              {text.journeyTitle}
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              {text.journeyDescription}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {text.journeyItems.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-[#f7fbff] p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#08a99d] shadow-sm">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold text-[#08264a]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-xl shadow-slate-100 md:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
              <FileText size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#061f3d]">
              {text.nextStepsTitle}
            </h2>

            <div className="mt-6 space-y-3">
              {text.nextSteps.map((step) => (
                <div
                  key={step}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-[#f7fbff] p-4"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#08a99d]"
                  />
                  <p className="text-sm font-semibold leading-6 text-[#08264a]">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 text-sm leading-6 text-slate-600">
              <div className="flex items-start gap-3">
                <LockKeyhole
                  size={18}
                  className="mt-0.5 shrink-0 text-[#08a99d]"
                />
                <p>
                  This dashboard is protected. Only logged-in users can access
                  this portal area.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#08a99d]">
                {text.quickActionsTitle}
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#061f3d]">
                CareRadar Portal
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={localizedHref(locale, "/")}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
              >
                {text.backHome}
              </Link>

              <Link
                href={localizedHref(locale, "/process")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
              >
                {text.process}
              </Link>

              <Link
                href={localizedHref(locale, "/contact")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
              >
                <Mail size={17} />
                {text.contact}
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}