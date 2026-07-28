"use client";

import { useState, FormEvent } from "react";
import { UserCog, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type {
  NurseProfileDetails,
  RecognitionStatus,
  EmploymentType,
} from "@/lib/supabase/nurse-queries";

const germanLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

type NurseProfileFormProps = {
  userId: string;
  initialProfile: NurseProfileDetails;
  labels: {
    title: string;
    specialization: string;
    specializationPlaceholder: string;
    experienceYears: string;
    germanLevel: string;
    germanLevelPlaceholder: string;
    nursingQualification: string;
    nursingQualificationPlaceholder: string;
    currentLocation: string;
    currentLocationPlaceholder: string;
    recognitionStatus: string;
    recognitionStatusOptions: Record<RecognitionStatus, string>;
    earliestStartDate: string;
    preferredRegion: string;
    preferredRegionPlaceholder: string;
    employmentType: string;
    employmentTypeOptions: Record<EmploymentType, string>;
    employmentTypePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    bio: string;
    bioPlaceholder: string;
    saveButton: string;
    saving: string;
    saved: string;
  };
};

export default function NurseProfileForm({
  userId,
  initialProfile,
  labels,
}: NurseProfileFormProps) {
  const [specialization, setSpecialization] = useState(
    initialProfile.specialization ?? "",
  );
  const [experienceYears, setExperienceYears] = useState(
    initialProfile.experience_years?.toString() ?? "",
  );
  const [germanLevel, setGermanLevel] = useState(initialProfile.german_level ?? "");
  const [nursingQualification, setNursingQualification] = useState(
    initialProfile.nursing_qualification ?? "",
  );
  const [currentLocation, setCurrentLocation] = useState(
    initialProfile.current_location ?? "",
  );
  const [recognitionStatus, setRecognitionStatus] = useState<RecognitionStatus>(
    initialProfile.recognition_status ?? "not_started",
  );
  const [earliestStartDate, setEarliestStartDate] = useState(
    initialProfile.earliest_start_date ?? "",
  );
  const [preferredRegion, setPreferredRegion] = useState(
    initialProfile.preferred_region ?? "",
  );
  const [employmentType, setEmploymentType] = useState<EmploymentType | "">(
    initialProfile.employment_type ?? "",
  );
  const [phone, setPhone] = useState(initialProfile.phone ?? "");
  const [bio, setBio] = useState(initialProfile.bio ?? "");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setSaved(false);
    setError(null);

    const { error: upsertError } = await supabase.from("nurse_profiles").upsert({
      id: userId,
      specialization: specialization.trim() || null,
      experience_years: experienceYears ? Number(experienceYears) : null,
      german_level: germanLevel || null,
      nursing_qualification: nursingQualification.trim() || null,
      current_location: currentLocation.trim() || null,
      recognition_status: recognitionStatus,
      earliest_start_date: earliestStartDate || null,
      preferred_region: preferredRegion.trim() || null,
      employment_type: employmentType || null,
      phone: phone.trim() || null,
      bio: bio.trim() || null,
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }

    setSaving(false);
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#08264a] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:ring-2 focus:ring-[#08a99d]/10";
  const labelClass = "text-xs font-semibold text-[#08264a]";

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-100 sm:p-6 md:p-7">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
        <UserCog size={20} />
      </div>

      <h2 className="mt-4 text-lg font-semibold tracking-tight text-[#061f3d] sm:text-xl">
        {labels.title}
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nursingQualification" className={labelClass}>
              {labels.nursingQualification}
            </label>
            <input
              id="nursingQualification"
              type="text"
              value={nursingQualification}
              onChange={(event) => setNursingQualification(event.target.value)}
              placeholder={labels.nursingQualificationPlaceholder}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="specialization" className={labelClass}>
              {labels.specialization}
            </label>
            <input
              id="specialization"
              type="text"
              value={specialization}
              onChange={(event) => setSpecialization(event.target.value)}
              placeholder={labels.specializationPlaceholder}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="experienceYears" className={labelClass}>
              {labels.experienceYears}
            </label>
            <input
              id="experienceYears"
              type="number"
              min={0}
              max={60}
              value={experienceYears}
              onChange={(event) => setExperienceYears(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="germanLevel" className={labelClass}>
              {labels.germanLevel}
            </label>
            <select
              id="germanLevel"
              value={germanLevel}
              onChange={(event) => setGermanLevel(event.target.value)}
              className={inputClass}
            >
              <option value="">{labels.germanLevelPlaceholder}</option>
              {germanLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="currentLocation" className={labelClass}>
              {labels.currentLocation}
            </label>
            <input
              id="currentLocation"
              type="text"
              value={currentLocation}
              onChange={(event) => setCurrentLocation(event.target.value)}
              placeholder={labels.currentLocationPlaceholder}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="recognitionStatus" className={labelClass}>
              {labels.recognitionStatus}
            </label>
            <select
              id="recognitionStatus"
              value={recognitionStatus}
              onChange={(event) =>
                setRecognitionStatus(event.target.value as RecognitionStatus)
              }
              className={inputClass}
            >
              {(
                Object.keys(labels.recognitionStatusOptions) as RecognitionStatus[]
              ).map((status) => (
                <option key={status} value={status}>
                  {labels.recognitionStatusOptions[status]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="earliestStartDate" className={labelClass}>
              {labels.earliestStartDate}
            </label>
            <input
              id="earliestStartDate"
              type="date"
              value={earliestStartDate}
              onChange={(event) => setEarliestStartDate(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="preferredRegion" className={labelClass}>
              {labels.preferredRegion}
            </label>
            <input
              id="preferredRegion"
              type="text"
              value={preferredRegion}
              onChange={(event) => setPreferredRegion(event.target.value)}
              placeholder={labels.preferredRegionPlaceholder}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="employmentType" className={labelClass}>
              {labels.employmentType}
            </label>
            <select
              id="employmentType"
              value={employmentType}
              onChange={(event) =>
                setEmploymentType(event.target.value as EmploymentType | "")
              }
              className={inputClass}
            >
              <option value="">{labels.employmentTypePlaceholder}</option>
              {(Object.keys(labels.employmentTypeOptions) as EmploymentType[]).map(
                (type) => (
                  <option key={type} value={type}>
                    {labels.employmentTypeOptions[type]}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              {labels.phone}
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={labels.phonePlaceholder}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className={labelClass}>
            {labels.bio}
          </label>
          <textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder={labels.bioPlaceholder}
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-full bg-[#08264a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#08a99d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? labels.saving : labels.saveButton}
          </button>

          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#08a99d]">
              <CheckCircle2 size={16} />
              {labels.saved}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}