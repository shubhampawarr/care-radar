"use client";

import { useMemo, useState } from "react";
import {
  Users,
  Bookmark,
  BookmarkCheck,
  ClipboardList,
  Briefcase,
  Send,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type {
  NurseProfile,
  ShortlistEntry,
  EmployerApplication,
} from "@/lib/supabase/employer-queries";
import type { ApplicationStatus } from "@/lib/supabase/nurse-queries";

type Tab = "browse" | "shortlist" | "pipeline";

type Labels = {
  browseTab: string;
  shortlistTab: string;
  pipelineTab: string;
  noNurses: string;
  shortlistButton: string;
  shortlistedButton: string;
  emptyShortlist: string;
  moveToPipeline: string;
  positionPlaceholder: string;
  submitApplication: string;
  cancel: string;
  alreadyInPipeline: string;
  emptyPipeline: string;
  years: string;
  statusLabels: Record<ApplicationStatus, string>;
  qualificationLabel: string;
  locationLabel: string;
  recognitionLabel: string;
  recognitionStatusLabels: Record<string, string>;
  availabilityLabel: string;
  regionLabel: string;
  employmentTypeLabel: string;
  employmentTypeLabels: Record<string, string>;
  phoneLabel: string;
  aboutLabel: string;
  notProvided: string;
};

type EmployerWorkspaceProps = {
  employerId: string;
  employerName: string;
  initialNurses: NurseProfile[];
  initialShortlist: ShortlistEntry[];
  initialApplications: EmployerApplication[];
  labels: Labels;
};

const statusOrder: ApplicationStatus[] = [
  "submitted",
  "under_review",
  "interview",
  "offer",
  "rejected",
];

const statusColor: Record<ApplicationStatus, string> = {
  submitted: "bg-slate-400",
  under_review: "bg-[#08a99d]",
  interview: "bg-[#08264a]",
  offer: "bg-emerald-500",
  rejected: "bg-red-500",
};

export default function EmployerWorkspace({
  employerId,
  employerName,
  initialNurses,
  initialShortlist,
  initialApplications,
  labels,
}: EmployerWorkspaceProps) {
  const [tab, setTab] = useState<Tab>("browse");
  const [shortlist, setShortlist] = useState<ShortlistEntry[]>(initialShortlist);
  const [applications, setApplications] =
    useState<EmployerApplication[]>(initialApplications);
  const [movingNurseId, setMovingNurseId] = useState<string | null>(null);
  const [positionInput, setPositionInput] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const supabase = createClient();

  const shortlistedNurseIds = useMemo(
    () => new Set(shortlist.map((entry) => entry.nurse_id)),
    [shortlist],
  );

  const appliedNurseIds = useMemo(
    () => new Set(applications.map((application) => application.user_id)),
    [applications],
  );

  const shortlistedNurses = useMemo(
    () => initialNurses.filter((nurse) => shortlistedNurseIds.has(nurse.id)),
    [initialNurses, shortlistedNurseIds],
  );

  async function toggleShortlist(nurseId: string) {
    setPendingId(nurseId);

    if (shortlistedNurseIds.has(nurseId)) {
      const entry = shortlist.find((item) => item.nurse_id === nurseId);
      if (entry) {
        const { error } = await supabase
          .from("shortlists")
          .delete()
          .eq("id", entry.id);

        if (!error) {
          setShortlist((prev) => prev.filter((item) => item.id !== entry.id));
        }
      }
    } else {
      const { data, error } = await supabase
        .from("shortlists")
        .insert({ employer_id: employerId, nurse_id: nurseId })
        .select()
        .single();

      if (!error && data) {
        setShortlist((prev) => [data as ShortlistEntry, ...prev]);
      }
    }

    setPendingId(null);
  }

  async function confirmMoveToPipeline(nurseId: string) {
    if (!positionInput.trim()) return;

    setPendingId(nurseId);

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: nurseId,
        employer_id: employerId,
        employer_name: employerName,
        position: positionInput.trim(),
        status: "submitted",
      })
      .select()
      .single();

    if (!error && data) {
      setApplications((prev) => [data as EmployerApplication, ...prev]);
      setMovingNurseId(null);
      setPositionInput("");
    }

    setPendingId(null);
  }

  async function updateStatus(applicationId: string, newStatus: ApplicationStatus) {
    setPendingId(applicationId);

    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", applicationId);

    if (!error) {
      setApplications((prev) =>
        prev.map((application) =>
          application.id === applicationId
            ? { ...application, status: newStatus }
            : application,
        ),
      );
    }

    setPendingId(null);
  }

  function nurseName(nurse: NurseProfile) {
    return nurse.full_name?.trim() || "—";
  }

  const tabs: { value: Tab; label: string; icon: typeof Users }[] = [
    { value: "browse", label: labels.browseTab, icon: Users },
    { value: "shortlist", label: labels.shortlistTab, icon: Bookmark },
    { value: "pipeline", label: labels.pipelineTab, icon: ClipboardList },
  ];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-100 sm:p-6 md:p-7">
      <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-[#f7fbff] p-1.5">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-xs font-semibold transition sm:flex-row sm:text-sm ${
                tab === t.value
                  ? "bg-white text-[#08264a] shadow-sm ring-1 ring-slate-100"
                  : "text-slate-500 hover:text-[#08a99d]"
              }`}
            >
              <Icon size={16} className="shrink-0" />
              <span className="truncate">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Browse tab */}
      {tab === "browse" && (
        <div className="mt-5 space-y-3">
          {initialNurses.length === 0 ? (
            <p className="text-sm text-slate-500">{labels.noNurses}</p>
          ) : (
            initialNurses.map((nurse) => {
              const isShortlisted = shortlistedNurseIds.has(nurse.id);

              const infoRows: { label: string; value: string }[] = [
                {
                  label: labels.qualificationLabel,
                  value: nurse.nursing_qualification || labels.notProvided,
                },
                {
                  label: labels.locationLabel,
                  value: nurse.current_location || labels.notProvided,
                },
                {
                  label: labels.recognitionLabel,
                  value:
                    labels.recognitionStatusLabels[nurse.recognition_status] ||
                    labels.notProvided,
                },
                {
                  label: labels.availabilityLabel,
                  value: nurse.earliest_start_date || labels.notProvided,
                },
                {
                  label: labels.regionLabel,
                  value: nurse.preferred_region || labels.notProvided,
                },
                {
                  label: labels.employmentTypeLabel,
                  value: nurse.employment_type
                    ? labels.employmentTypeLabels[nurse.employment_type]
                    : labels.notProvided,
                },
                {
                  label: labels.phoneLabel,
                  value: nurse.phone || labels.notProvided,
                },
              ];

              return (
                <div
                  key={nurse.id}
                  className="rounded-xl border border-slate-100 bg-[#f7fbff] p-3.5 sm:p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#08264a]">
                        {nurseName(nurse)}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {[
                          nurse.specialization,
                          nurse.experience_years
                            ? `${nurse.experience_years} ${labels.years}`
                            : null,
                          nurse.german_level,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={pendingId === nurse.id}
                      onClick={() => toggleShortlist(nurse.id)}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                        isShortlisted
                          ? "bg-[#08a99d]/10 text-[#087f77] ring-1 ring-[#08a99d]/20"
                          : "bg-[#08264a] text-white hover:bg-[#08a99d]"
                      }`}
                    >
                      {isShortlisted ? (
                        <BookmarkCheck size={14} />
                      ) : (
                        <Bookmark size={14} />
                      )}
                      {isShortlisted ? labels.shortlistedButton : labels.shortlistButton}
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-200/70 pt-3 sm:grid-cols-3">
                    {infoRows.map((row) => (
                      <div key={row.label} className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                          {row.label}
                        </p>
                        <p className="truncate text-xs font-semibold text-[#08264a]">
                          {row.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {nurse.bio && (
                    <div className="mt-3 border-t border-slate-200/70 pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                        {labels.aboutLabel}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        {nurse.bio}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Shortlist tab */}
      {tab === "shortlist" && (
        <div className="mt-5 space-y-3">
          {shortlistedNurses.length === 0 ? (
            <p className="text-sm text-slate-500">{labels.emptyShortlist}</p>
          ) : (
            shortlistedNurses.map((nurse) => {
              const alreadyApplied = appliedNurseIds.has(nurse.id);
              const isMoving = movingNurseId === nurse.id;

              return (
                <div
                  key={nurse.id}
                  className="rounded-xl border border-slate-100 bg-[#f7fbff] p-3.5 sm:p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#08264a]">
                        {nurseName(nurse)}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {[nurse.specialization, nurse.german_level]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </p>
                    </div>

                    {alreadyApplied ? (
                      <span className="shrink-0 rounded-full bg-[#08a99d]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#087f77]">
                        {labels.alreadyInPipeline}
                      </span>
                    ) : !isMoving ? (
                      <button
                        type="button"
                        onClick={() => {
                          setMovingNurseId(nurse.id);
                          setPositionInput("");
                        }}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#08264a] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#08a99d]"
                      >
                        <Briefcase size={14} />
                        {labels.moveToPipeline}
                      </button>
                    ) : null}
                  </div>

                  {isMoving && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={positionInput}
                        onChange={(event) => setPositionInput(event.target.value)}
                        placeholder={labels.positionPlaceholder}
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#08264a] outline-none focus:border-[#08a99d] focus:ring-2 focus:ring-[#08a99d]/10"
                      />
                      <button
                        type="button"
                        disabled={!positionInput.trim() || pendingId === nurse.id}
                        onClick={() => confirmMoveToPipeline(nurse.id)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#08a99d] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#08264a] disabled:opacity-50"
                      >
                        <Send size={14} />
                        {labels.submitApplication}
                      </button>
                      <button
                        type="button"
                        onClick={() => setMovingNurseId(null)}
                        className="shrink-0 rounded-full border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#08a99d] hover:text-[#08a99d]"
                      >
                        {labels.cancel}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pipeline tab */}
      {tab === "pipeline" && (
        <div className="mt-5 space-y-3">
          {applications.length === 0 ? (
            <p className="text-sm text-slate-500">{labels.emptyPipeline}</p>
          ) : (
            applications.map((application) => (
              <div
                key={application.id}
                className="rounded-xl border border-slate-100 bg-[#f7fbff] p-3.5 sm:p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#08264a]">
                      {application.position}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {statusOrder
                        .filter((s) => s !== "rejected")
                        .map((step) => (
                          <div
                            key={step}
                            className={`h-2 w-2 rounded-full ${
                              application.status === "rejected"
                                ? "bg-slate-200"
                                : statusOrder.indexOf(step) <=
                                    statusOrder.indexOf(application.status)
                                  ? statusColor[step]
                                  : "bg-slate-200"
                            }`}
                          />
                        ))}
                    </div>
                  </div>

                  <select
                    value={application.status}
                    disabled={pendingId === application.id}
                    onChange={(event) =>
                      updateStatus(
                        application.id,
                        event.target.value as ApplicationStatus,
                      )
                    }
                    className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#08264a] outline-none focus:border-[#08a99d] disabled:opacity-50"
                  >
                    {statusOrder.map((status) => (
                      <option key={status} value={status}>
                        {labels.statusLabels[status]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}