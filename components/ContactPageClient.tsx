"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import type { Locale } from "@/lib/locale";

const pageText = {
  en: {
    contactOptions: [
      {
        title: "Nurse Application",
        description:
          "For nurses who want to explore international healthcare opportunities with CareRadar.",
      },
      {
        title: "Employer Enquiry",
        description:
          "For hospitals, clinics, care homes, and healthcare organisations looking to recruit nurses.",
      },
      {
        title: "General Enquiry",
        description:
          "For partnership, process, or general recruitment-related questions.",
      },
    ],
    hero: {
      eyebrow: "Contact CareRadar",
      title: "Start with one clear recruitment conversation.",
      description:
        "Whether you are a nurse exploring international opportunities or a healthcare employer looking for recruitment support, CareRadar can help you understand the next step.",
      primary: "Send Enquiry",
      secondary: "View Process",
      cardEyebrow: "Enquiry Types",
      cardTitle: "Choose the right pathway before moving forward.",
      cardNote:
        "Your enquiry will be stored in the CareRadar enquiry sheet so the team can review and respond from one shared place.",
      points: [
        "Apply as a nurse",
        "Enquire as a healthcare employer",
        "Ask about the recruitment process",
        "Speak with the CareRadar team",
      ],
    },
    optionsSection: {
      eyebrow: "How Can We Help?",
      title: "Contact CareRadar for the right recruitment support.",
      description:
        "Select the enquiry type that matches your situation so the team can respond with the right context.",
    },
    formSection: {
      eyebrow: "Enquiry Form",
      title: "Share your details with CareRadar.",
      description:
        "Fill in the form with your basic details. For nurses, include your qualification and experience. For employers, include the type of healthcare role or hiring requirement.",
      contactDetails: "Contact details",
      phoneWhatsapp: "Phone / WhatsApp",
      phonePending: "To be added by client",
    },
    form: {
      fullName: "Full Name *",
      fullNamePlaceholder: "Full Name",
      phone: "Phone / WhatsApp Number *",
      phonePlaceholder: "Phone / WhatsApp Number",
      email: "Email Address *",
      emailPlaceholder: "Email Address",
      cityCountry: "Current City / Country",
      cityCountryPlaceholder: "Current City / Country",
      enquiryType: "I am contacting as *",
      enquiryOptions: [
        "Nurse / Candidate",
        "Healthcare Employer",
        "General Enquiry",
      ],
      message: "Message *",
      messagePlaceholder:
        "Tell us about your background, requirement, or question...",
      submit: "Submit Enquiry",
      submitting: "Submitting...",
      footerNote:
        "Your enquiry will be submitted to the CareRadar team for review.",
    },
    status: {
      loading: "Submitting your enquiry...",
      success: "Thank you. Your enquiry has been submitted successfully.",
      errorFallback: "Could not submit enquiry. Please try again.",
      errorCatch: "Something went wrong. Please try again.",
    },
    finalStrip: {
      eyebrow: "CareRadar",
      title: "We really do care.",
      description:
        "Start the conversation today and move toward a clearer, more organised international nurse recruitment journey.",
      primary: "For Nurses",
      secondary: "For Employers",
    },
  },
  de: {
    contactOptions: [
      {
        title: "Bewerbung als Pflegekraft",
        description:
          "Für Pflegekräfte, die internationale Karrierechancen im Gesundheitswesen mit CareRadar erkunden möchten.",
      },
      {
        title: "Arbeitgeberanfrage",
        description:
          "Für Krankenhäuser, Kliniken, Pflegeheime und Gesundheitsorganisationen, die Pflegekräfte rekrutieren möchten.",
      },
      {
        title: "Allgemeine Anfrage",
        description:
          "Für Partnerschaften, Prozessfragen oder allgemeine Fragen rund um Rekrutierung.",
      },
    ],
    hero: {
      eyebrow: "CareRadar kontaktieren",
      title: "Starten Sie mit einem klaren Gespräch.",
      description:
        "Ob Sie Pflegekraft mit internationalen Karriereplänen sind oder ein Arbeitgeber im Gesundheitswesen Rekrutierungsunterstützung sucht — CareRadar hilft Ihnen, den nächsten Schritt zu verstehen.",
      primary: "Anfrage senden",
      secondary: "Prozess ansehen",
      cardEyebrow: "Anfragearten",
      cardTitle: "Wählen Sie den passenden Weg, bevor Sie weitermachen.",
      cardNote:
        "Ihre Anfrage wird im CareRadar-Anfrageblatt gespeichert, damit das Team sie an einem gemeinsamen Ort prüfen und beantworten kann.",
      points: [
        "Als Pflegekraft bewerben",
        "Als Arbeitgeber im Gesundheitswesen anfragen",
        "Fragen zum Rekrutierungsprozess stellen",
        "Mit dem CareRadar-Team sprechen",
      ],
    },
    optionsSection: {
      eyebrow: "Wie können wir helfen?",
      title: "Kontaktieren Sie CareRadar für passende Unterstützung.",
      description:
        "Wählen Sie die Anfrageart, die zu Ihrer Situation passt, damit das Team mit dem richtigen Kontext antworten kann.",
    },
    formSection: {
      eyebrow: "Anfrageformular",
      title: "Teilen Sie Ihre Daten mit CareRadar.",
      description:
        "Füllen Sie das Formular mit Ihren grundlegenden Angaben aus. Pflegekräfte können Qualifikation und Erfahrung angeben. Arbeitgeber können die gesuchte Rolle oder den Personalbedarf beschreiben.",
      contactDetails: "Kontaktdaten",
      phoneWhatsapp: "Telefon / WhatsApp",
      phonePending: "Wird vom Kunden ergänzt",
    },
    form: {
      fullName: "Vollständiger Name *",
      fullNamePlaceholder: "Vollständiger Name",
      phone: "Telefon / WhatsApp-Nummer *",
      phonePlaceholder: "Telefon / WhatsApp-Nummer",
      email: "E-Mail-Adresse *",
      emailPlaceholder: "E-Mail-Adresse",
      cityCountry: "Aktuelle Stadt / Land",
      cityCountryPlaceholder: "Aktuelle Stadt / Land",
      enquiryType: "Ich kontaktiere als *",
      enquiryOptions: [
        "Pflegekraft / Kandidat",
        "Arbeitgeber im Gesundheitswesen",
        "Allgemeine Anfrage",
      ],
      message: "Nachricht *",
      messagePlaceholder:
        "Erzählen Sie uns von Ihrem Hintergrund, Ihrem Bedarf oder Ihrer Frage...",
      submit: "Anfrage absenden",
      submitting: "Wird gesendet...",
      footerNote:
        "Ihre Anfrage wird zur Prüfung an das CareRadar-Team übermittelt.",
    },
    status: {
      loading: "Ihre Anfrage wird gesendet...",
      success: "Vielen Dank. Ihre Anfrage wurde erfolgreich übermittelt.",
      errorFallback:
        "Die Anfrage konnte nicht übermittelt werden. Bitte versuchen Sie es erneut.",
      errorCatch: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    },
    finalStrip: {
      eyebrow: "CareRadar",
      title: "We really do care.",
      description:
        "Starten Sie heute das Gespräch und bewegen Sie sich in Richtung einer klareren, besser organisierten internationalen Pflegekräfte-Rekrutierung.",
      primary: "Für Pflegekräfte",
      secondary: "Für Arbeitgeber",
    },
  },
} as const;

type ContactPageClientProps = {
  locale: Locale;
};

function localizedHref(locale: Locale, href: string) {
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

export default function ContactPageClient({ locale }: ContactPageClientProps) {
  const text = pageText[locale];

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    cityCountry: "",
    enquiryType: text.form.enquiryOptions[0],
    message: "",
  });

  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus({
      type: "loading",
      message: text.status.loading,
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setStatus({
          type: "error",
          message: result.message || text.status.errorFallback,
        });
        return;
      }

      setStatus({
        type: "success",
        message: text.status.success,
      });

      setFormData({
        fullName: "",
        phone: "",
        email: "",
        cityCountry: "",
        enquiryType: text.form.enquiryOptions[0],
        message: "",
      });
    } catch {
      setStatus({
        type: "error",
        message: text.status.errorCatch,
      });
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_78%)] px-5 py-10 md:px-8 md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e6eef7_1px,transparent_1px),linear-gradient(to_bottom,#e6eef7_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.18]" />
        <div className="absolute left-[-130px] top-20 h-72 w-72 rounded-full bg-[#08a99d]/10 blur-3xl" />
        <div className="absolute right-[-130px] top-28 h-80 w-80 rounded-full bg-[#08264a]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center md:text-left">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#08a99d]/20 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#087d76] shadow-sm backdrop-blur md:mx-0">
              {text.hero.eyebrow}
            </div>

            <h1 className="mx-auto mt-5 max-w-4xl break-words text-[2rem] font-semibold leading-[1.12] tracking-tight text-[#061f3d] [overflow-wrap:anywhere] sm:text-5xl md:mx-0 md:text-6xl md:leading-[1.04]">
              {text.hero.title}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 md:mx-0 md:text-lg md:leading-8">
              {text.hero.description}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <a
                href="#contact-form"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-[#08a99d]"
              >
                {text.hero.primary} <ArrowRight size={17} />
              </a>

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
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
                  {text.hero.cardEyebrow}
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#061f3d]">
                  {text.hero.cardTitle}
                </h2>

                <div className="mt-6 space-y-4">
                  {text.hero.points.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2
                        size={18}
                        className="mt-1 shrink-0 text-[#08a99d]"
                      />
                      <p className="text-sm leading-6 text-slate-600">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 rounded-[1.3rem] border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 h-px w-full bg-gradient-to-r from-[#08a99d] via-slate-100 to-transparent" />
                  <p className="text-sm leading-7 text-slate-600">
                    {text.hero.cardNote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CONTACT OPTIONS */}
      <section className="bg-white px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.optionsSection.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              {text.optionsSection.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {text.optionsSection.description}
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {text.contactOptions.map((item) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-[1.6rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#08a99d]/25 hover:shadow-lg hover:shadow-slate-100"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#08a99d]/5" />

                <h3 className="relative text-lg font-semibold text-[#08264a]">
                  {item.title}
                </h3>

                <p className="relative mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section
        id="contact-form"
        className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16"
      >
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              {text.formSection.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              {text.formSection.title}
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
              {text.formSection.description}
            </p>

            <div className="mt-8 overflow-hidden rounded-[1.7rem] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100">
              <div className="mb-5 h-px w-full bg-gradient-to-r from-[#08a99d] via-slate-100 to-transparent" />

              <h3 className="text-lg font-semibold text-[#08264a]">
                {text.formSection.contactDetails}
              </h3>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-[#f8fbff] p-4">
                  <p className="text-sm font-semibold text-[#08264a]">
                    Akshat Gupta
                  </p>
                  <a
                    href="mailto:akshat.gupta@careradar.de"
                    className="mt-1 inline-block break-all text-sm text-slate-600 transition hover:text-[#08a99d]"
                  >
                    akshat.gupta@careradar.de
                  </a>
                </div>

                <div className="rounded-2xl bg-[#f8fbff] p-4">
                  <p className="text-sm font-semibold text-[#08264a]">
                    Ron Rüdiger
                  </p>
                  <a
                    href="mailto:ron.ruediger@careradar.de"
                    className="mt-1 inline-block break-all text-sm text-slate-600 transition hover:text-[#08a99d]"
                  >
                    ron.ruediger@careradar.de
                  </a>
                </div>

                <div className="rounded-2xl bg-[#f8fbff] p-4">
                  <p className="text-sm font-semibold text-[#08264a]">
                    {text.formSection.phoneWhatsapp}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {text.formSection.phonePending}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-2xl shadow-slate-100 md:p-8"
          >
            <div className="mb-6 h-px w-full bg-gradient-to-r from-[#08a99d] via-slate-100 to-transparent" />

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-[#08264a]">
                  {text.form.fullName}
                </label>
                <input
                  value={formData.fullName}
                  onChange={(event) =>
                    handleChange("fullName", event.target.value)
                  }
                  type="text"
                  placeholder={text.form.fullNamePlaceholder}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-[#f8fbff] px-4 py-3 text-sm text-[#08264a] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#08264a]">
                  {text.form.phone}
                </label>
                <input
                  value={formData.phone}
                  onChange={(event) =>
                    handleChange("phone", event.target.value)
                  }
                  type="text"
                  placeholder={text.form.phonePlaceholder}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-[#f8fbff] px-4 py-3 text-sm text-[#08264a] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#08264a]">
                  {text.form.email}
                </label>
                <input
                  value={formData.email}
                  onChange={(event) =>
                    handleChange("email", event.target.value)
                  }
                  type="email"
                  placeholder={text.form.emailPlaceholder}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-[#f8fbff] px-4 py-3 text-sm text-[#08264a] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#08264a]">
                  {text.form.cityCountry}
                </label>
                <input
                  value={formData.cityCountry}
                  onChange={(event) =>
                    handleChange("cityCountry", event.target.value)
                  }
                  type="text"
                  placeholder={text.form.cityCountryPlaceholder}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-[#f8fbff] px-4 py-3 text-sm text-[#08264a] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:bg-white"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-[#08264a]">
                {text.form.enquiryType}
              </label>
              <select
                value={formData.enquiryType}
                onChange={(event) =>
                  handleChange("enquiryType", event.target.value)
                }
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-[#f8fbff] px-4 py-3 text-sm text-[#08264a] outline-none transition focus:border-[#08a99d] focus:bg-white"
              >
                {text.form.enquiryOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-[#08264a]">
                {text.form.message}
              </label>
              <textarea
                value={formData.message}
                onChange={(event) =>
                  handleChange("message", event.target.value)
                }
                rows={6}
                placeholder={text.form.messagePlaceholder}
                required
                className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-[#f8fbff] px-4 py-3 text-sm text-[#08264a] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={status.type === "loading"}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {status.type === "loading" ? text.form.submitting : text.form.submit}
              <Send size={16} />
            </button>

            {status.message && (
              <p
                className={`mt-4 rounded-2xl px-4 py-3 text-xs leading-6 ${
                  status.type === "success"
                    ? "bg-[#eafffb] text-[#087d76]"
                    : status.type === "error"
                      ? "bg-red-50 text-red-600"
                      : "bg-[#f8fbff] text-slate-500"
                }`}
              >
                {status.message}
              </p>
            )}

            <p className="mt-4 rounded-2xl bg-[#f8fbff] px-4 py-3 text-xs leading-6 text-slate-500">
              {text.form.footerNote}
            </p>
          </form>
        </div>
      </section>

      {/* FINAL STRIP */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_45%,#eafffb_100%)] p-7 text-center shadow-xl shadow-slate-100 md:p-12">
          <div className="mx-auto mb-5 h-px max-w-md bg-gradient-to-r from-transparent via-[#08a99d] to-transparent" />

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
            {text.finalStrip.eyebrow}
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
            {text.finalStrip.title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            {text.finalStrip.description}
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={localizedHref(locale, "/nurses")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              {text.finalStrip.primary} <ArrowRight size={17} />
            </Link>

            <Link
              href={localizedHref(locale, "/employers")}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
            >
              {text.finalStrip.secondary}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}