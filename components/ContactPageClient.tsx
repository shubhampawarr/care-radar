"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  HeartHandshake,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import type { Locale } from "@/lib/locale";

type ContactPageClientProps = {
  locale: Locale;
};

const CONTACT_EMAIL = "info@careradar.de";
const CONTACT_PHONE = "";

const pageText = {
  en: {
    hero: {
      eyebrow: "Contact CareRadar",
      title: "Start with one clear conversation.",
      description:
        "Whether you are a nurse, employer, or partner, contact CareRadar to understand the right next step before moving forward.",
      primary: "Create Account",
      secondary: "View Process",
    },
    form: {
      eyebrow: "Send an enquiry",
      title: "Tell us how we can help.",
      description:
        "This form is for general enquiries only. Detailed candidate profiles, applications, and document uploads will be handled inside the portal.",
      name: "Full name",
      email: "Email address",
      phone: "Phone / WhatsApp",
      interest: "I am contacting as",
      message: "Message",
      submit: "Send enquiry",
      sending: "Preparing message...",
      success:
        "Your email app should open with the enquiry prepared. Please review and send it from there.",
      options: [
        "Nurse / Candidate",
        "Healthcare Employer",
        "Partner / Institution",
        "General Enquiry",
      ],
      placeholders: {
        name: "Your full name",
        email: "you@example.com",
        phone: "+91 / +49 ...",
        message:
          "Tell us briefly who you are and what you would like to understand.",
      },
    },
    direct: {
      eyebrow: "Direct Contact",
      title: "Prefer direct communication?",
      description:
        "You can also contact CareRadar directly. For structured candidate applications, create an account once the portal flow is ready.",
      emailLabel: "Email",
      phoneLabel: "Phone / WhatsApp",
      phoneUnavailable: "To be added",
    },
    who: {
      eyebrow: "Who Should Contact Us",
      title: "Use this page for early conversations.",
      description:
        "The contact page is kept simple so enquiries stay clear. Detailed applications will move into the dashboard in the next phase.",
      items: [
        {
          title: "Nurses and candidates",
          description:
            "Ask about your possible route, qualification background, language preparation, and next steps.",
          icon: Stethoscope,
        },
        {
          title: "Healthcare employers",
          description:
            "Discuss hiring needs, candidate coordination, and long-term recruitment planning.",
          icon: Building2,
        },
        {
          title: "Partners and institutions",
          description:
            "Explore collaboration, candidate pools, training coordination, or operational support.",
          icon: HeartHandshake,
        },
      ],
    },
    trust: {
      eyebrow: "What Happens Next",
      title: "A simple and careful first step.",
      items: [
        "We review your enquiry",
        "We understand whether you are a candidate, employer, or partner",
        "We guide you to the correct next step",
        "If needed, you can continue through the CareRadar account area",
      ],
    },
    cta: {
      eyebrow: "Continue Your Journey",
      title: "Understand the process before submitting details.",
      description:
        "View the qualification pathway or create an account to begin preparing for the future portal experience.",
      primary: "View Process",
      secondary: "Create Account",
    },
  },
  de: {
    hero: {
      eyebrow: "CareRadar kontaktieren",
      title: "Beginnen Sie mit einem klaren Gespräch.",
      description:
        "Ob Pflegekraft, Arbeitgeber oder Partner — kontaktieren Sie CareRadar, um den richtigen nächsten Schritt zu verstehen.",
      primary: "Konto erstellen",
      secondary: "Prozess ansehen",
    },
    form: {
      eyebrow: "Anfrage senden",
      title: "Sagen Sie uns, wie wir helfen können.",
      description:
        "Dieses Formular ist nur für allgemeine Anfragen gedacht. Detaillierte Kandidatenprofile, Bewerbungen und Dokumentenuploads werden später im Portal verwaltet.",
      name: "Vollständiger Name",
      email: "E-Mail-Adresse",
      phone: "Telefon / WhatsApp",
      interest: "Ich kontaktiere als",
      message: "Nachricht",
      submit: "Anfrage senden",
      sending: "Nachricht wird vorbereitet...",
      success:
        "Ihr E-Mail-Programm sollte sich mit der vorbereiteten Anfrage öffnen. Bitte prüfen und senden Sie die Nachricht von dort.",
      options: [
        "Pflegekraft / Kandidat",
        "Arbeitgeber im Gesundheitswesen",
        "Partner / Institution",
        "Allgemeine Anfrage",
      ],
      placeholders: {
        name: "Ihr vollständiger Name",
        email: "sie@example.com",
        phone: "+91 / +49 ...",
        message:
          "Beschreiben Sie kurz, wer Sie sind und was Sie verstehen möchten.",
      },
    },
    direct: {
      eyebrow: "Direkter Kontakt",
      title: "Bevorzugen Sie direkte Kommunikation?",
      description:
        "Sie können CareRadar auch direkt kontaktieren. Strukturierte Bewerbungen werden später über das Konto- und Portal-System geführt.",
      emailLabel: "E-Mail",
      phoneLabel: "Telefon / WhatsApp",
      phoneUnavailable: "Wird ergänzt",
    },
    who: {
      eyebrow: "Wer uns kontaktieren sollte",
      title: "Diese Seite ist für erste Gespräche gedacht.",
      description:
        "Die Kontaktseite bleibt bewusst einfach. Detaillierte Bewerbungen werden in der nächsten Phase in das Dashboard verlagert.",
      items: [
        {
          title: "Pflegekräfte und Kandidaten",
          description:
            "Fragen Sie nach Ihrem möglichen Weg, Ihrer Qualifikation, Sprachvorbereitung und nächsten Schritten.",
          icon: Stethoscope,
        },
        {
          title: "Arbeitgeber im Gesundheitswesen",
          description:
            "Besprechen Sie Personalbedarf, Kandidatenkoordination und langfristige Rekrutierungsplanung.",
          icon: Building2,
        },
        {
          title: "Partner und Institutionen",
          description:
            "Erkunden Sie Zusammenarbeit, Kandidatenpools, Trainingskoordination oder operative Unterstützung.",
          icon: HeartHandshake,
        },
      ],
    },
    trust: {
      eyebrow: "Was als Nächstes passiert",
      title: "Ein einfacher und sorgfältiger erster Schritt.",
      items: [
        "Wir prüfen Ihre Anfrage",
        "Wir verstehen, ob Sie Kandidat, Arbeitgeber oder Partner sind",
        "Wir führen Sie zum richtigen nächsten Schritt",
        "Bei Bedarf können Sie später über den CareRadar-Kontobereich fortfahren",
      ],
    },
    cta: {
      eyebrow: "Ihre Reise fortsetzen",
      title: "Verstehen Sie den Prozess, bevor Sie Details einreichen.",
      description:
        "Sehen Sie sich den Qualifikationsweg an oder erstellen Sie ein Konto, um sich auf das zukünftige Portal vorzubereiten.",
      primary: "Prozess ansehen",
      secondary: "Konto erstellen",
    },
  },
} as const;

function localizedHref(locale: Locale, href: string) {
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

export default function ContactPageClient({ locale }: ContactPageClientProps) {
  const text = pageText[locale];

  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const interest = String(formData.get("interest") ?? "");
    const message = String(formData.get("message") ?? "");

    const subject =
      locale === "en"
        ? `CareRadar enquiry from ${name || "website visitor"}`
        : `CareRadar Anfrage von ${name || "Website-Besucher"}`;

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone / WhatsApp: ${phone}`,
      `Contacting as: ${interest}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;

    window.setTimeout(() => {
      setStatus("success");
    }, 600);
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_78%)] px-5 py-10 md:px-8 md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e6eef7_1px,transparent_1px),linear-gradient(to_bottom,#e6eef7_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.18]" />
        <div className="absolute left-[-130px] top-20 h-72 w-72 rounded-full bg-[#08a99d]/10 blur-3xl" />
        <div className="absolute right-[-130px] top-28 h-80 w-80 rounded-full bg-[#08264a]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center lg:text-left">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#08a99d]/20 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#087d76] shadow-sm backdrop-blur lg:mx-0">
              <MessageCircle size={14} />
              {text.hero.eyebrow}
            </div>

            <h1 className="mx-auto mt-5 max-w-4xl text-[2.35rem] font-semibold leading-[1.06] tracking-tight text-[#061f3d] sm:text-5xl md:text-6xl lg:mx-0 lg:leading-[1.04]">
              {text.hero.title}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 md:text-lg md:leading-8 lg:mx-0">
              {text.hero.description}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href={localizedHref(locale, "/login")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-[#08a99d]"
              >
                {text.hero.primary} <ArrowRight size={17} />
              </Link>

              <Link
                href={localizedHref(locale, "/process")}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] shadow-sm transition hover:border-[#08a99d] hover:text-[#08a99d]"
              >
                {text.hero.secondary}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 rounded-[2.4rem] bg-gradient-to-br from-[#08a99d]/15 via-white to-[#08264a]/10 blur-xl" />

            <div className="relative rounded-[2rem] border border-white bg-white p-5 shadow-2xl shadow-slate-200">
              <div className="rounded-[1.5rem] border border-slate-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_52%,#eafffb_100%)] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
                  <HeartHandshake size={24} />
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
                  {text.trust.eyebrow}
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#061f3d]">
                  {text.trust.title}
                </h2>

                <div className="mt-6 space-y-4">
                  {text.trust.items.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2
                        size={18}
                        className="mt-1 shrink-0 text-[#08a99d]"
                      />
                      <p className="text-sm leading-6 text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 rounded-[1.3rem] border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 h-px w-full bg-gradient-to-r from-[#08a99d] via-slate-100 to-transparent" />
                  <p className="text-sm leading-7 text-slate-600">
                    {locale === "en"
                      ? "For applications and documents, use the account area once the portal workflow is active."
                      : "Für Bewerbungen und Dokumente nutzen Sie den Kontobereich, sobald der Portal-Workflow aktiv ist."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM + DIRECT */}
      <section className="bg-white px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.form.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-4xl">
              {text.form.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {text.form.description}
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label={text.form.name}
                  name="name"
                  placeholder={text.form.placeholders.name}
                  required
                />
                <Field
                  label={text.form.email}
                  name="email"
                  type="email"
                  placeholder={text.form.placeholders.email}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label={text.form.phone}
                  name="phone"
                  placeholder={text.form.placeholders.phone}
                />

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {text.form.interest}
                  </label>
                  <select
                    name="interest"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#061f3d] outline-none transition focus:border-[#08a99d] focus:ring-4 focus:ring-[#08a99d]/10"
                    required
                    defaultValue={text.form.options[0]}
                  >
                    {text.form.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {text.form.message}
                </label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder={text.form.placeholders.message}
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#061f3d] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:ring-4 focus:ring-[#08a99d]/10"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-[#08a99d] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {status === "sending" ? text.form.sending : text.form.submit}
                <ArrowRight size={17} />
              </button>

              {status === "success" && (
                <div className="rounded-2xl border border-[#08a99d]/20 bg-[#08a99d]/10 p-4">
                  <p className="text-sm font-semibold leading-6 text-[#087d76]">
                    {text.form.success}
                  </p>
                </div>
              )}
            </form>
          </div>

          <div className="space-y-5">
            <div className="rounded-[2rem] border border-slate-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_55%,#eafffb_100%)] p-6 shadow-xl shadow-slate-100 md:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
                <Mail size={24} />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
                {text.direct.eyebrow}
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#061f3d]">
                {text.direct.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {text.direct.description}
              </p>

              <div className="mt-6 space-y-3">
                <ContactRow
                  icon={Mail}
                  label={text.direct.emailLabel}
                  value={CONTACT_EMAIL}
                  href={`mailto:${CONTACT_EMAIL}`}
                />

                <ContactRow
                  icon={Phone}
                  label={text.direct.phoneLabel}
                  value={CONTACT_PHONE || text.direct.phoneUnavailable}
                  href={CONTACT_PHONE ? `tel:${CONTACT_PHONE}` : undefined}
                />
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#061f3d] p-6 text-white shadow-2xl shadow-slate-200 md:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#10c4b6] ring-1 ring-white/10">
                <ShieldCheck size={24} />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#10c4b6]">
                {locale === "en" ? "Important" : "Wichtig"}
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                {locale === "en"
                  ? "This is not the application form."
                  : "Dies ist nicht das Bewerbungsformular."}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                {locale === "en"
                  ? "The contact form is for enquiries. Candidate profiles, documents, and application status will be handled inside the portal."
                  : "Das Kontaktformular ist für Anfragen gedacht. Kandidatenprofile, Dokumente und Bewerbungsstatus werden im Portal verwaltet."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO SHOULD CONTACT */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.who.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              {text.who.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {text.who.description}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {text.who.items.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-[1.7rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#08a99d]/25 hover:shadow-xl hover:shadow-slate-100"
                >
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#08a99d]/5" />

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
                    <Icon size={24} />
                  </div>

                  <h3 className="relative mt-5 text-xl font-semibold tracking-tight text-[#061f3d]">
                    {item.title}
                  </h3>

                  <p className="relative mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_45%,#eafffb_100%)] p-7 text-center shadow-xl shadow-slate-100 md:p-12">
          <div className="mx-auto mb-5 h-px max-w-md bg-gradient-to-r from-transparent via-[#08a99d] to-transparent" />

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
            {text.cta.eyebrow}
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
            {text.cta.title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            {text.cta.description}
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={localizedHref(locale, "/process")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              {text.cta.primary} <ArrowRight size={17} />
            </Link>

            <Link
              href={localizedHref(locale, "/login")}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
            >
              {text.cta.secondary}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#061f3d] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:ring-4 focus:ring-[#08a99d]/10"
      />
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4 transition hover:border-[#08a99d]/25">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#08a99d]/10 text-[#08a99d]">
        <Icon size={19} />
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-[#061f3d]">{value}</p>
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <a href={href} className="block">
      {content}
    </a>
  );
}