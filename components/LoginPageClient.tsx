"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  LockKeyhole,
  UserPlus,
  HeartPulse,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/locale";

type Role = "nurse" | "employer" | "admin";

const pageText = {
  en: {
    eyebrow: "CareRadar Portal",
    title: "Login or create your CareRadar account.",
    description:
      "Access to the CareRadar portal is being prepared. This page sets the foundation for login and registration.",
    candidateTab: "Candidate",
    employerTab: "Employer",
    adminTab: "Admin",
    loginTab: "Login",
    registerTab: "Create Account",
    adminNotice: "Admin accounts are created internally and cannot be self-registered.",
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    password: "Password",
    loginButton: "Login",
    registerButton: "Create Account",
    backHome: "Back to homepage",
    contact: "Contact CareRadar",
    loginSuccess: "Login successful. Redirecting to dashboard...",
    registerSuccess:
      "Account created. Please check your email if confirmation is required.",
    genericError: "Something went wrong. Please try again.",
  },
  de: {
    eyebrow: "CareRadar Portal",
    title: "Anmelden oder registrieren.",
    description:
      "Der Zugang zum CareRadar Portal wird vorbereitet. Diese Seite bildet die Grundlage für Anmeldung und Registrierung.",
    candidateTab: "Pflegekraft",
    employerTab: "Arbeitgeber",
    adminTab: "Admin",
    loginTab: "Anmelden",
    registerTab: "Registrieren",
    adminNotice:
      "Admin-Konten werden intern erstellt und können nicht selbst registriert werden.",
    firstName: "Vorname",
    lastName: "Nachname",
    email: "E-Mail-Adresse",
    password: "Passwort",
    loginButton: "Anmelden",
    registerButton: "Registrieren",
    backHome: "Zur Startseite",
    contact: "CareRadar kontaktieren",
    loginSuccess: "Anmeldung erfolgreich. Weiterleitung zum Dashboard...",
    registerSuccess:
      "Konto erstellt. Bitte prüfen Sie Ihre E-Mails, falls eine Bestätigung erforderlich ist.",
    genericError: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
  },
} as const;

function localizedHref(locale: Locale, href: string) {
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

type LoginPageClientProps = {
  locale: Locale;
};

export default function LoginPageClient({ locale }: LoginPageClientProps) {
  const text = pageText[locale];
  const router = useRouter();

  const [role, setRole] = useState<Role>("nurse");
  const [mode, setMode] = useState<"login" | "register">("login");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function resetForm() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setMessage("");
    setError("");
  }

  function selectRole(nextRole: Role) {
    setRole(nextRole);
    if (nextRole === "admin") {
      setMode("login");
    }
    resetForm();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setMessage("");
    setError("");

    const supabase = createClient();

    try {
      if (mode === "login") {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        setEmail("");
        setPassword("");
        setMessage(text.loginSuccess);

        const userId = signInData.user?.id;

        let destination = "/dashboard/nurse";

        if (userId) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single();

          if (profile?.role === "employer") destination = "/dashboard/employer";
          if (profile?.role === "admin") destination = "/dashboard/admin";
        }

        router.push(localizedHref(locale, destination));
        router.refresh();
        return;
      }

      // Registration only applies to nurse/employer — admin tab hides this mode.
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/${locale}/dashboard/${role}`
              : undefined,
          data: {
            first_name: trimmedFirstName,
            last_name: trimmedLastName,
            full_name: `${trimmedFirstName} ${trimmedLastName}`.trim(),
            requested_role: role,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      resetForm();
      setMode("login");
      setMessage(text.registerSuccess);
    } catch {
      setError(text.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  const roleTabs: { value: Role; label: string; icon: typeof HeartPulse }[] = [
    { value: "nurse", label: text.candidateTab, icon: HeartPulse },
    { value: "employer", label: text.employerTab, icon: Building2 },
    { value: "admin", label: text.adminTab, icon: ShieldCheck },
  ];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_78%)] px-5 py-16 md:px-8 md:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e6eef7_1px,transparent_1px),linear-gradient(to_bottom,#e6eef7_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.18]" />
      <div className="absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-[#08a99d]/10 blur-3xl" />
      <div className="absolute right-[-120px] top-28 h-80 w-80 rounded-full bg-[#08264a]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
            {text.eyebrow}
          </p>

          <h1 className="mx-auto mt-5 max-w-3xl text-[2.1rem] font-semibold leading-[1.12] tracking-tight text-[#061f3d] sm:text-5xl md:text-6xl md:leading-[1.04] lg:mx-0">
            {text.title}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 md:text-base lg:mx-0">
            {text.description}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
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

        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-2xl shadow-slate-200 md:p-7">
          {/* Role selector: candidate / employer / admin */}
          <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-[#f7fbff] p-1.5">
            {roleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => selectRole(tab.value)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-xs font-semibold transition sm:flex-row sm:text-sm ${
                    role === tab.value
                      ? "bg-white text-[#08264a] shadow-sm ring-1 ring-slate-100"
                      : "text-slate-500 hover:text-[#08a99d]"
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Login / Register toggle — hidden for admin, which is login-only */}
          {role !== "admin" ? (
            <div className="mt-3 grid grid-cols-2 rounded-2xl bg-[#f7fbff] p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  resetForm();
                }}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-[#08264a] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#08a99d]"
                }`}
              >
                <LockKeyhole size={17} />
                {text.loginTab}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  resetForm();
                }}
                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  mode === "register"
                    ? "bg-[#08264a] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#08a99d]"
                }`}
              >
                <UserPlus size={17} />
                {text.registerTab}
              </button>
            </div>
          ) : (
            <p className="mt-3 rounded-2xl border border-slate-100 bg-[#f7fbff] px-4 py-3 text-xs font-medium text-slate-500">
              {text.adminNotice}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "register" && role !== "admin" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="text-sm font-semibold text-[#08264a]"
                  >
                    {text.firstName}
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base text-[#08264a] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:ring-4 focus:ring-[#08a99d]/10"
                    placeholder={text.firstName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="text-sm font-semibold text-[#08264a]"
                  >
                    {text.lastName}
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base text-[#08264a] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:ring-4 focus:ring-[#08a99d]/10"
                    placeholder={text.lastName}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="text-sm font-semibold text-[#08264a]">
                {text.email}
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base text-[#08264a] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:ring-4 focus:ring-[#08a99d]/10"
                placeholder={text.email}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-semibold text-[#08264a]">
                {text.password}
              </label>

              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base text-[#08264a] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:ring-4 focus:ring-[#08a99d]/10"
                placeholder={text.password}
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#08a99d] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#08a99d]/15 transition hover:bg-[#08264a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "..."
                : mode === "login"
                  ? text.loginButton
                  : text.registerButton}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}