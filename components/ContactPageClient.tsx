"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Mail, Phone } from "lucide-react";
import type { Locale } from "@/lib/locale";

type ContactPageClientProps = {
  locale: Locale;
};

const CONTACT_EMAIL = "info@careradar.de";
const CONTACT_PHONE = "+4917631457123";

const pageText = {
  en: {
    hero: {
      eyebrow: "Contact CareRadar",
      title: "Send an enquiry.",
      description:
        "Tell us who you are and what you need. We will guide you to the right next step.",
    },
    form: {
      eyebrow: "Enquiry form",
      title: "Tell us how we can help.",
      description:
        "For general questions only. Candidate profiles and documents belong in the portal.",
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
      eyebrow: "Direct lines",
      title: "Reach us directly",
      emailLabel: "General email",
      phoneLabel: "Phone / WhatsApp",
      contacts: [
        {
          name: "Akshat Gupta",
          email: "akshat.gupta@careradar.de",
        },
        {
          name: "Ron Rüdiger",
          email: "ron.ruediger@careradar.de",
        },
      ],
    },
    trust: {
      eyebrow: "What happens next",
      items: [
        "We review your enquiry",
        "We understand whether you are a candidate, employer, or partner",
        "We guide you to the correct next step",
      ],
      note: "Applications and documents are handled inside the CareRadar account area.",
    },
  },
  de: {
    hero: {
      eyebrow: "CareRadar kontaktieren",
      title: "Anfrage senden.",
      description:
        "Sagen Sie uns, wer Sie sind und was Sie brauchen. Wir führen Sie zum richtigen nächsten Schritt.",
    },
    form: {
      eyebrow: "Anfrageformular",
      title: "Sagen Sie uns, wie wir helfen können.",
      description:
        "Nur für allgemeine Fragen. Kandidatenprofile und Dokumente gehören ins Portal.",
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
      eyebrow: "Direkte Kontakte",
      title: "Erreichen Sie uns direkt",
      emailLabel: "Allgemeine E-Mail",
      phoneLabel: "Telefon / WhatsApp",
      contacts: [
        {
          name: "Akshat Gupta",
          email: "akshat.gupta@careradar.de",
        },
        {
          name: "Ron Rüdiger",
          email: "ron.ruediger@careradar.de",
        },
      ],
    },
    trust: {
      eyebrow: "Was als Nächstes passiert",
      items: [
        "Wir prüfen Ihre Anfrage",
        "Wir verstehen, ob Sie Kandidat, Arbeitgeber oder Partner sind",
        "Wir führen Sie zum richtigen nächsten Schritt",
      ],
      note: "Bewerbungen und Dokumente werden im CareRadar-Kontobereich verwaltet.",
    },
  },
} as const;

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
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;

    window.setTimeout(() => {
      setStatus("success");
    }, 600);
  }

  return (
    <>
      {/* HERO — compact dark strip, distinct from home/about */}
      <section className="relative overflow-hidden bg-[#061f3d] px-5 py-12 md:px-8 md:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(90%_120%_at_50%_-20%,#0d3a66_0%,#061f3d_55%,#040f22_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-50" />
        <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#08a99d]/60 to-transparent" />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5eead4]">
            {text.hero.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            {text.hero.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
            {text.hero.description}
          </p>
        </div>
      </section>

      {/* FORM + SIDEBAR */}
      <section className="bg-[#f0f4f8] px-5 py-10 md:px-8 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          {/* Form card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#08a99d]">
              {text.form.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#061f3d] md:text-3xl">
              {text.form.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {text.form.description}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
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

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={text.form.phone}
                  name="phone"
                  placeholder={text.form.placeholders.phone}
                />
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {text.form.interest}
                  </label>
                  <select
                    name="interest"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-[#061f3d] outline-none transition focus:border-[#08a99d] focus:bg-white focus:ring-2 focus:ring-[#08a99d]/15"
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
                <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {text.form.message}
                </label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder={text.form.placeholders.message}
                  className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-[#061f3d] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:bg-white focus:ring-2 focus:ring-[#08a99d]/15"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {status === "sending" ? text.form.sending : text.form.submit}
                <ArrowRight size={16} />
              </button>

              {status === "success" && (
                <div className="rounded-xl border border-[#08a99d]/25 bg-[#08a99d]/8 px-4 py-3">
                  <p className="text-sm leading-6 text-[#087d76]">
                    {text.form.success}
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#08a99d]">
                {text.direct.eyebrow}
              </p>
              <h3 className="mt-1.5 text-lg font-semibold text-[#061f3d]">
                {text.direct.title}
              </h3>

              <div className="mt-4 space-y-2">
                {text.direct.contacts.map((contact) => (
                  <a
                    key={contact.email}
                    href={`mailto:${contact.email}`}
                    className="block rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition hover:border-[#08a99d]/30 hover:bg-white"
                  >
                    <p className="text-sm font-semibold text-[#061f3d]">
                      {contact.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {contact.email}
                    </p>
                  </a>
                ))}

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition hover:border-[#08a99d]/30 hover:bg-white"
                >
                  <Mail size={16} className="shrink-0 text-[#08a99d]" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {text.direct.emailLabel}
                    </p>
                    <p className="text-xs font-medium text-[#061f3d]">
                      {CONTACT_EMAIL}
                    </p>
                  </div>
                </a>

                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition hover:border-[#08a99d]/30 hover:bg-white"
                >
                  <Phone size={16} className="shrink-0 text-[#08a99d]" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {text.direct.phoneLabel}
                    </p>
                    <p className="text-xs font-medium text-[#061f3d]">
                      +49 176 31457123
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-[#061f3d] p-5 md:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5eead4]">
                {text.trust.eyebrow}
              </p>
              <ol className="mt-4 space-y-3">
                {text.trust.items.map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#08a99d]/20 text-[10px] font-bold text-[#5eead4]">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-5 text-slate-400">
                {text.trust.note}
              </p>
            </div>
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
      <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-[#061f3d] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:bg-white focus:ring-2 focus:ring-[#08a99d]/15"
      />
    </div>
  );
}
