import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/lib/supabase/nurse-queries";

export type NurseProfile = {
  id: string;
  full_name: string | null;
  specialization: string | null;
  experience_years: number | null;
  german_level: string | null;
  bio: string | null;
  avatar_url: string | null;
  nursing_qualification: string | null;
  current_location: string | null;
  recognition_status: "not_started" | "in_progress" | "recognized";
  earliest_start_date: string | null;
  preferred_region: string | null;
  employment_type: "full_time" | "part_time" | "either" | null;
  phone: string | null;
};

export type ShortlistEntry = {
  id: string;
  nurse_id: string;
  created_at: string;
};

export type EmployerApplication = {
  id: string;
  user_id: string; // nurse's id
  employer_id: string;
  employer_name: string;
  position: string;
  status: ApplicationStatus;
  created_at: string;
};

export async function getBrowsableNurses(): Promise<NurseProfile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nurse_profiles")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching nurse profiles:", error.message);
    return [];
  }

  return data as NurseProfile[];
}

export async function getShortlist(employerId: string): Promise<ShortlistEntry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shortlists")
    .select("id, nurse_id, created_at")
    .eq("employer_id", employerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching shortlist:", error.message);
    return [];
  }

  return data as ShortlistEntry[];
}

export async function getEmployerApplications(
  employerId: string,
): Promise<EmployerApplication[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("employer_id", employerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching employer applications:", error.message);
    return [];
  }

  return data as EmployerApplication[];
}