import { createClient } from "@/lib/supabase/server";

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "interview"
  | "offer"
  | "rejected";

export type Application = {
  id: string;
  user_id: string;
  employer_name: string;
  position: string;
  status: ApplicationStatus;
  created_at: string;
};

export type NurseDocument = {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  verified: boolean;
  uploaded_at: string;
};

export type RecognitionStatus = "not_started" | "in_progress" | "recognized";
export type EmploymentType = "full_time" | "part_time" | "either";

export type NurseProfileDetails = {
  specialization: string | null;
  experience_years: number | null;
  german_level: string | null;
  bio: string | null;
  nursing_qualification: string | null;
  current_location: string | null;
  recognition_status: RecognitionStatus;
  earliest_start_date: string | null;
  preferred_region: string | null;
  employment_type: EmploymentType | null;
  phone: string | null;
};

export async function getNurseProfileDetails(
  userId: string,
): Promise<NurseProfileDetails> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nurse_profiles")
    .select(
      "specialization, experience_years, german_level, bio, nursing_qualification, current_location, recognition_status, earliest_start_date, preferred_region, employment_type, phone",
    )
    .eq("id", userId)
    .single();

  if (error || !data) {
    return {
      specialization: null,
      experience_years: null,
      german_level: null,
      bio: null,
      nursing_qualification: null,
      current_location: null,
      recognition_status: "not_started",
      earliest_start_date: null,
      preferred_region: null,
      employment_type: null,
      phone: null,
    };
  }

  return data as NurseProfileDetails;
}

export async function getUserApplications(userId: string): Promise<Application[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching applications:", error.message);
    return [];
  }

  return data as Application[];
}

export async function getUserDocuments(userId: string): Promise<NurseDocument[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error.message);
    return [];
  }

  return data as NurseDocument[];
}