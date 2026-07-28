import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { getSafeLocale, type Locale } from "@/lib/locale";
import { requireRole } from "@/lib/supabase/require-role";
import { getUserApplications, getUserDocuments, getNurseProfileDetails } from "@/lib/supabase/nurse-queries";
import NurseDocumentUpload from "@/components/NurseDocumentUpload";
import NurseProfileForm from "@/components/NurseProfileForm";
import type { ApplicationStatus } from "@/lib/supabase/nurse-queries";

const pageText = {
  en: {
    metadata: {
      title: "Nurse Dashboard",
      description: "CareRadar nurse portal dashboard.",
    },
    eyebrow: "CareRadar Portal",
    greeting: "Hi",
    title: "your application journey, at a glance.",
    secureSession: "Secure session active",
    accountVerified: "Account created",
    applicationsInProgress: "Applications in progress",
    activeAccount: "Active",

    applicationsTitle: "Your Applications",
    noApplications: "No applications yet.",

    documentsTitle: "Documents",
    uploadButton: "Upload Document",
    uploading: "Uploading...",
    documentsEmpty: "No documents uploaded yet.",
    verified: "Verified",
    pending: "Pending Review",

    profileFormTitle: "Your Profile Details",
    specialization: "Specialization",
    specializationPlaceholder: "e.g. ICU, Geriatric Care, Pediatrics",
    experienceYears: "Years of experience",
    germanLevel: "German language level",
    germanLevelPlaceholder: "Select level",
    nursingQualification: "Nursing qualification",
    nursingQualificationPlaceholder: "e.g. B.Sc Nursing, GNM, Diploma",
    currentLocation: "Current location",
    currentLocationPlaceholder: "City, Country",
    recognitionStatus: "Credential recognition status",
    recognitionStatusOptions: {
      not_started: "Not started",
      in_progress: "In progress",
      recognized: "Recognized",
    },
    earliestStartDate: "Earliest start date",
    preferredRegion: "Preferred region in Germany",
    preferredRegionPlaceholder: "e.g. Bavaria, NRW, Berlin",
    employmentType: "Employment type preference",
    employmentTypePlaceholder: "Select type",
    employmentTypeOptions: {
      full_time: "Full-time",
      part_time: "Part-time",
      either: "Either",
    },
    phone: "Phone number",
    phonePlaceholder: "+91...",
    bio: "About you",
    bioPlaceholder: "A short summary employers will see...",
    saveButton: "Save Profile",
    saving: "Saving...",
    saved: "Saved",

    backHome: "Back to homepage",
    contact: "Contact CareRadar",
  },
  de: {
    metadata: {
      title: "Pflegekraft-Dashboard",
      description: "CareRadar Pflegekraft-Portal-Dashboard.",
    },
    eyebrow: "CareRadar Portal",
    greeting: "Hallo",
    title: "Ihr Bewerbungsverlauf auf einen Blick.",
    secureSession: "Sichere Sitzung aktiv",
    accountVerified: "Konto erstellt",
    applicationsInProgress: "Laufende Bewerbungen",
    activeAccount: "Aktiv",

    applicationsTitle: "Ihre Bewerbungen",
    noApplications: "Noch keine Bewerbungen.",

    documentsTitle: "Dokumente",
    uploadButton: "Dokument hochladen",
    uploading: "Wird hochgeladen...",
    documentsEmpty: "Noch keine Dokumente hochgeladen.",
    verified: "Verifiziert",
    pending: "Prüfung ausstehend",

    profileFormTitle: "Ihre Profildetails",
    specialization: "Fachgebiet",
    specializationPlaceholder: "z. B. Intensivpflege, Geriatrie, Pädiatrie",
    experienceYears: "Berufserfahrung (Jahre)",
    germanLevel: "Deutsch-Sprachniveau",
    germanLevelPlaceholder: "Niveau wählen",
    nursingQualification: "Pflegerische Qualifikation",
    nursingQualificationPlaceholder: "z. B. B.Sc Pflege, GNM, Diplom",
    currentLocation: "Aktueller Standort",
    currentLocationPlaceholder: "Stadt, Land",
    recognitionStatus: "Anerkennungsstatus",
    recognitionStatusOptions: {
      not_started: "Nicht begonnen",
      in_progress: "In Bearbeitung",
      recognized: "Anerkannt",
    },
    earliestStartDate: "Frühestes Startdatum",
    preferredRegion: "Bevorzugte Region in Deutschland",
    preferredRegionPlaceholder: "z. B. Bayern, NRW, Berlin",
    employmentType: "Bevorzugte Anstellungsart",
    employmentTypePlaceholder: "Art wählen",
    employmentTypeOptions: {
      full_time: "Vollzeit",
      part_time: "Teilzeit",
      either: "Beides möglich",
    },
    phone: "Telefonnummer",
    phonePlaceholder: "+91...",
    bio: "Über Sie",
    bioPlaceholder: "Eine kurze Zusammenfassung für Arbeitgeber...",
    saveButton: "Profil speichern",
    saving: "Wird gespeichert...",
    saved: "Gespeichert",

    backHome: "Zur Startseite",
    contact: "CareRadar kontaktieren",
  },
} as const;

const statusOrder: ApplicationStatus[] = [
  "submitted",
  "under_review",
  "interview",
  "offer",
];

const statusLabel: Record<ApplicationStatus, { en: string; de: string }> = {
  submitted: { en: "Submitted", de: "Eingereicht" },
  under_review: { en: "Under Review", de: "In Prüfung" },
  interview: { en: "Interview", de: "Vorstellungsgespräch" },
  offer: { en: "Offer", de: "Angebot" },
  rejected: { en: "Rejected", de: "Abgelehnt" },
};

const statusColor: Record<ApplicationStatus, string> = {
  submitted: "bg-slate-400",
  under_review: "bg-[#08a99d]",
  interview: "bg-[#08264a]",
  offer: "bg-emerald-500",
  rejected: "bg-red-500",
};

type NurseDashboardPageProps = {
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
}: NurseDashboardPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = pageText[locale];

  return {
    title: text.metadata.title,
    description: text.metadata.description,
  };
}

export default async function NurseDashboardPage({ params }: NurseDashboardPageProps) {
  const { locale: rawLocale } = await params;
  const locale = getSafeLocale(rawLocale);
  const text = pageText[locale];

  const { user } = await requireRole(locale, "nurse");

  const firstName = getUserFirstName(user);
  const fullName = getFullName(user);

  const [applications, documents, profileDetails] = await Promise.all([
    getUserApplications(user.id),
    getUserDocuments(user.id),
    getNurseProfileDetails(user.id),
  ]);

  const statusCards = [
    { title: text.secureSession, icon: ShieldCheck },
    { title: text.accountVerified, icon: BadgeCheck },
    { title: text.applicationsInProgress, icon: ClipboardList },
  ];

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

          <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
            {statusCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-[#f7fbff] px-3.5 py-2"
                >
                  <Icon size={16} className="shrink-0 text-[#08a99d]" />
                  <span className="text-xs font-semibold text-[#08264a] sm:text-sm">
                    {card.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          <NurseProfileForm
            userId={user.id}
            initialProfile={profileDetails}
            labels={{
              title: text.profileFormTitle,
              specialization: text.specialization,
              specializationPlaceholder: text.specializationPlaceholder,
              experienceYears: text.experienceYears,
              germanLevel: text.germanLevel,
              germanLevelPlaceholder: text.germanLevelPlaceholder,
              nursingQualification: text.nursingQualification,
              nursingQualificationPlaceholder: text.nursingQualificationPlaceholder,
              currentLocation: text.currentLocation,
              currentLocationPlaceholder: text.currentLocationPlaceholder,
              recognitionStatus: text.recognitionStatus,
              recognitionStatusOptions: text.recognitionStatusOptions,
              earliestStartDate: text.earliestStartDate,
              preferredRegion: text.preferredRegion,
              preferredRegionPlaceholder: text.preferredRegionPlaceholder,
              employmentType: text.employmentType,
              employmentTypePlaceholder: text.employmentTypePlaceholder,
              employmentTypeOptions: text.employmentTypeOptions,
              phone: text.phone,
              phonePlaceholder: text.phonePlaceholder,
              bio: text.bio,
              bioPlaceholder: text.bioPlaceholder,
              saveButton: text.saveButton,
              saving: text.saving,
              saved: text.saved,
            }}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-100 sm:p-6 md:p-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
              <ClipboardList size={20} />
            </div>

            <h2 className="mt-4 text-lg font-semibold tracking-tight text-[#061f3d] sm:text-xl">
              {text.applicationsTitle}
            </h2>

            {applications.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">{text.noApplications}</p>
            ) : (
              <div className="mt-5 space-y-3">
                {applications.map((application) => {
                  const currentIndex = statusOrder.indexOf(application.status);
                  const isRejected = application.status === "rejected";

                  return (
                    <div
                      key={application.id}
                      className="rounded-xl border border-slate-100 bg-[#f7fbff] p-3.5 sm:p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#08264a]">
                            {application.employer_name}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {application.position}
                          </p>
                        </div>

                        {isRejected ? (
                          <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-red-700">
                            {statusLabel.rejected[locale]}
                          </span>
                        ) : (
                          <div className="flex shrink-0 items-center gap-1.5">
                            {statusOrder.map((step, index) => (
                              <div
                                key={step}
                                className={`h-2 w-2 rounded-full ${
                                  index <= currentIndex
                                    ? statusColor[step]
                                    : "bg-slate-200"
                                }`}
                                title={statusLabel[step][locale]}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {!isRejected && (
                        <p className="mt-2 text-xs font-semibold text-[#08a99d]">
                          {statusLabel[application.status][locale]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <NurseDocumentUpload
            userId={user.id}
            initialDocuments={documents}
            labels={{
              title: text.documentsTitle,
              uploadButton: text.uploadButton,
              uploading: text.uploading,
              empty: text.documentsEmpty,
              verified: text.verified,
              pending: text.pending,
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