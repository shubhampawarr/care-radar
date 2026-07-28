import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { getSafeLocale, type Locale } from "@/lib/locale";
import { requireRole } from "@/lib/supabase/require-role";
import {
  getBrowsableNurses,
  getShortlist,
  getEmployerApplications,
} from "@/lib/supabase/employer-queries";
import EmployerWorkspace from "@/components/EmployerWorkspace";

const pageText = {
  en: {
    metadata: {
      title: "Employer Dashboard",
      description: "CareRadar employer portal dashboard.",
    },
    eyebrow: "CareRadar Portal",
    greeting: "Hi",
    title: "find and manage your nursing candidates.",
    activeAccount: "Active",

    browseTab: "Browse",
    shortlistTab: "Shortlist",
    pipelineTab: "Pipeline",
    noNurses: "No candidates available yet.",
    shortlistButton: "Shortlist",
    shortlistedButton: "Shortlisted",
    emptyShortlist: "No candidates shortlisted yet.",
    moveToPipeline: "Start Application",
    positionPlaceholder: "Position title (e.g. ICU Nurse)",
    submitApplication: "Submit",
    cancel: "Cancel",
    alreadyInPipeline: "In Pipeline",
    emptyPipeline: "No applications in your pipeline yet.",
    years: "yrs",
    statusLabels: {
      submitted: "Submitted",
      under_review: "Under Review",
      interview: "Interview",
      offer: "Offer",
      rejected: "Rejected",
    },

    qualificationLabel: "Qualification",
    locationLabel: "Location",
    recognitionLabel: "Recognition",
    recognitionStatusLabels: {
      not_started: "Not started",
      in_progress: "In progress",
      recognized: "Recognized",
    },
    availabilityLabel: "Available from",
    regionLabel: "Preferred region",
    employmentTypeLabel: "Employment type",
    employmentTypeLabels: {
      full_time: "Full-time",
      part_time: "Part-time",
      either: "Either",
    },
    phoneLabel: "Phone",
    aboutLabel: "About",
    notProvided: "Not provided",

    backHome: "Back to homepage",
    contact: "Contact CareRadar",
  },
  de: {
    metadata: {
      title: "Arbeitgeber-Dashboard",
      description: "CareRadar Arbeitgeber-Portal-Dashboard.",
    },
    eyebrow: "CareRadar Portal",
    greeting: "Hallo",
    title: "finden und verwalten Sie Ihre Pflegekräfte-Kandidaten.",
    activeAccount: "Aktiv",

    browseTab: "Durchsuchen",
    shortlistTab: "Merkliste",
    pipelineTab: "Pipeline",
    noNurses: "Noch keine Kandidaten verfügbar.",
    shortlistButton: "Merken",
    shortlistedButton: "Gemerkt",
    emptyShortlist: "Noch keine Kandidaten gemerkt.",
    moveToPipeline: "Bewerbung starten",
    positionPlaceholder: "Positionstitel (z. B. Intensivpflegekraft)",
    submitApplication: "Absenden",
    cancel: "Abbrechen",
    alreadyInPipeline: "In Pipeline",
    emptyPipeline: "Noch keine Bewerbungen in Ihrer Pipeline.",
    years: "Jahre",
    statusLabels: {
      submitted: "Eingereicht",
      under_review: "In Prüfung",
      interview: "Vorstellungsgespräch",
      offer: "Angebot",
      rejected: "Abgelehnt",
    },

    qualificationLabel: "Qualifikation",
    locationLabel: "Standort",
    recognitionLabel: "Anerkennung",
    recognitionStatusLabels: {
      not_started: "Nicht begonnen",
      in_progress: "In Bearbeitung",
      recognized: "Anerkannt",
    },
    availabilityLabel: "Verfügbar ab",
    regionLabel: "Bevorzugte Region",
    employmentTypeLabel: "Anstellungsart",
    employmentTypeLabels: {
      full_time: "Vollzeit",
      part_time: "Teilzeit",
      either: "Beides möglich",
    },
    phoneLabel: "Telefon",
    aboutLabel: "Über",
    notProvided: "Nicht angegeben",

    backHome: "Zur Startseite",
    contact: "CareRadar kontaktieren",
  },
} as const;

type EmployerDashboardPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

function localizedHref(locale: Locale, href: string) {
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

function getFirstName(user: {
  email?: string;
  user_metadata?: { first_name?: string; full_name?: string };
}) {
  const firstName = user.user_metadata?.first_name;
  if (typeof firstName === "string" && firstName.trim()) return firstName.trim();

  const fullName = user.user_metadata?.full_name;
  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim().split(" ")[0];
  }

  if (user.email) return user.email.split("@")[0];
  return "";
}

function getFullName(user: {
  user_metadata?: { first_name?: string; last_name?: string; full_name?: string };
}) {
  const firstName = user.user_metadata?.first_name;
  const lastName = user.user_metadata?.last_name;
  const fullName = user.user_metadata?.full_name;

  if (typeof fullName === "string" && fullName.trim()) return fullName.trim();

  return `${firstName ?? ""} ${lastName ?? ""}`.trim() || "—";
}

export async function generateMetadata({
  params,
}: EmployerDashboardPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = pageText[locale];

  return {
    title: text.metadata.title,
    description: text.metadata.description,
  };
}

export default async function EmployerDashboardPage({
  params,
}: EmployerDashboardPageProps) {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = pageText[locale];

  const { user } = await requireRole(locale, "employer");

  const firstName = getFirstName(user);
  const fullName = getFullName(user);

  const [nurses, shortlist, applications] = await Promise.all([
    getBrowsableNurses(),
    getShortlist(user.id),
    getEmployerApplications(user.id),
  ]);

  const initial = (fullName !== "—" ? fullName : firstName || user.email || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_72%)] px-4 py-8 sm:px-6 md:px-8 md:py-12">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e6eef7_1px,transparent_1px),linear-gradient(to_bottom,#e6eef7_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.18]" />
      <div className="absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-[#08a99d]/10 blur-3xl" />
      <div className="absolute right-[-120px] top-28 h-80 w-80 rounded-full bg-[#08264a]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-[#08264a] p-4 shadow-lg shadow-slate-200 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-base font-semibold text-white ring-1 ring-white/15">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{fullName}</p>
              <p className="truncate text-xs text-white/60">{user.email}</p>
            </div>
          </div>

          <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-[#08e0d1]/10 px-3 py-1.5 text-xs font-semibold text-[#08e0d1]">
            <CheckCircle2 size={14} />
            {text.activeAccount}
          </span>
        </div>

        <div className="mt-4 rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-100 sm:p-7 md:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
            {text.eyebrow}
          </p>

          <h1 className="mt-3 text-xl font-semibold leading-tight tracking-tight text-[#061f3d] sm:text-2xl md:text-3xl">
            {text.greeting} {firstName}, {text.title}
          </h1>
        </div>

        <div className="mt-4 sm:mt-6">
          <EmployerWorkspace
            employerId={user.id}
            employerName={fullName !== "—" ? fullName : firstName}
            initialNurses={nurses}
            initialShortlist={shortlist}
            initialApplications={applications}
            labels={{
              browseTab: text.browseTab,
              shortlistTab: text.shortlistTab,
              pipelineTab: text.pipelineTab,
              noNurses: text.noNurses,
              shortlistButton: text.shortlistButton,
              shortlistedButton: text.shortlistedButton,
              emptyShortlist: text.emptyShortlist,
              moveToPipeline: text.moveToPipeline,
              positionPlaceholder: text.positionPlaceholder,
              submitApplication: text.submitApplication,
              cancel: text.cancel,
              alreadyInPipeline: text.alreadyInPipeline,
              emptyPipeline: text.emptyPipeline,
              years: text.years,
              statusLabels: text.statusLabels,
              qualificationLabel: text.qualificationLabel,
              locationLabel: text.locationLabel,
              recognitionLabel: text.recognitionLabel,
              recognitionStatusLabels: text.recognitionStatusLabels,
              availabilityLabel: text.availabilityLabel,
              regionLabel: text.regionLabel,
              employmentTypeLabel: text.employmentTypeLabel,
              employmentTypeLabels: text.employmentTypeLabels,
              phoneLabel: text.phoneLabel,
              aboutLabel: text.aboutLabel,
              notProvided: text.notProvided,
            }}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:justify-end">
          <Link
            href={localizedHref(locale, "/")}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
          >
            {text.backHome}
          </Link>

          <Link
            href={localizedHref(locale, "/contact")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
          >
            <Mail size={16} />
            {text.contact}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}