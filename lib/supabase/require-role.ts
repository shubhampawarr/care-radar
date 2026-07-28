import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/locale";

export type UserRole = "nurse" | "employer" | "admin";

function localizedHref(locale: Locale, href: string) {
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

const roleDashboardPath: Record<UserRole, string> = {
  nurse: "/dashboard/nurse",
  employer: "/dashboard/employer",
  admin: "/dashboard/admin",
};

/**
 * Ensures the current user is logged in AND has the required role.
 * - No session -> redirect to /login
 * - Logged in but wrong role -> redirect to THEIR correct dashboard
 * - Logged in with correct role -> returns { user, role }
 */
export async function requireRole(locale: Locale, requiredRole: UserRole) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(localizedHref(locale, "/login"));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile?.role as UserRole | undefined) ?? null;

  if (!role) {
    // No profile row found — treat as unauthenticated rather than guessing a role.
    redirect(localizedHref(locale, "/login"));
  }

  if (role !== requiredRole) {
    redirect(localizedHref(locale, roleDashboardPath[role]));
  }

  return { user, role };
}