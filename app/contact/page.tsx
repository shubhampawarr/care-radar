import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Stethoscope,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact CareRadar for international nurse recruitment enquiries, nurse applications, and healthcare employer hiring support.",
};

const contactOptions = [
  {
    title: "Nurse Application",
    description:
      "For nurses who want to explore international healthcare opportunities with CareRadar.",
    icon: Stethoscope,
  },
  {
    title: "Employer Enquiry",
    description:
      "For hospitals, clinics, care homes, and healthcare organisations looking to recruit nurses.",
    icon: Building2,
  },
  {
    title: "General Enquiry",
    description:
      "For partnership, process, or general recruitment-related questions.",
    icon: MessageCircle,
  },
];

const formFields = [
  "Full Name",
  "Phone / WhatsApp Number",
  "Email Address",
  "Current City / Country",
];

export default function ContactPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_72%)] px-5 py-12 md:px-8 md:py-16">
        <div className="absolute left-[-120px] top-16 h-72 w-72 rounded-full bg-[#08a99d]/10 blur-3xl" />
        <div className="absolute right-[-120px] top-28 h-72 w-72 rounded-full bg-[#08264a]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center md:text-left">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#08a99d]/20 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#087d76] shadow-sm md:mx-0">
              <Send size={14} />
              Contact CareRadar
            </div>

            <h1 className="mx-auto mt-5 max-w-4xl text-[2.4rem] font-semibold leading-[1.06] tracking-tight text-[#061f3d] sm:text-5xl md:mx-0 md:text-6xl md:leading-[1.04]">
              Start with one clear recruitment conversation.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 md:mx-0 md:text-lg md:leading-8">
              Whether you are a nurse exploring international opportunities or
              a healthcare employer looking for recruitment support, CareRadar
              can help you understand the next step.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <a
                href="#contact-form"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-[#08a99d]"
              >
                Send Enquiry <ArrowRight size={17} />
              </a>

              <Link
                href="/process"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
              >
                View Process
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
                Enquiry Types
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#061f3d]">
                Choose the right pathway before moving forward.
              </h2>

              <div className="mt-6 space-y-4">
                {[
                  "Apply as a nurse",
                  "Enquire as a healthcare employer",
                  "Ask about the recruitment process",
                  "Speak with the CareRadar team",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-1 shrink-0 text-[#08a99d]"
                    />
                    <p className="text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 border-l-2 border-[#08a99d] bg-[#f8fbff] px-5 py-4">
                <p className="text-sm leading-7 text-slate-600">
                  The first step is simple: share your details and CareRadar can
                  guide you toward the correct recruitment pathway.
                </p>
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
              How Can We Help?
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              Contact CareRadar for the right recruitment support.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              Select the enquiry type that matches your situation so the team
              can respond with the right context.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {contactOptions.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d]">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-[#08264a]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
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
              Enquiry Form
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              Share your details with CareRadar.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
              Fill in the form with your basic details. For nurses, include your
              qualification and experience. For employers, include the type of
              healthcare role or hiring requirement.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#08264a]">
                Contact details
              </h3>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-1 shrink-0 text-[#08a99d]" />
                  <div>
                    <p className="text-sm font-semibold text-[#08264a]">
                      Phone / WhatsApp
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      To be added by client
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-1 shrink-0 text-[#08a99d]" />
                  <div>
                    <p className="text-sm font-semibold text-[#08264a]">
                      Email
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      To be added by client
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-1 shrink-0 text-[#08a99d]" />
                  <div>
                    <p className="text-sm font-semibold text-[#08264a]">
                      Office / Location
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      To be added by client
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              {formFields.map((label) => (
                <div key={label}>
                  <label className="text-sm font-semibold text-[#08264a]">
                    {label}
                  </label>
                  <input
                    type={label.includes("Email") ? "email" : "text"}
                    placeholder={label}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-[#f8fbff] px-4 py-3 text-sm text-[#08264a] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:bg-white"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-[#08264a]">
                I am contacting as
              </label>
              <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-[#f8fbff] px-4 py-3 text-sm text-[#08264a] outline-none transition focus:border-[#08a99d] focus:bg-white">
                <option>Nurse / Candidate</option>
                <option>Healthcare Employer</option>
                <option>General Enquiry</option>
              </select>
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-[#08264a]">
                Message
              </label>
              <textarea
                rows={6}
                placeholder="Tell us about your background, requirement, or question..."
                className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-[#f8fbff] px-4 py-3 text-sm text-[#08264a] outline-none transition placeholder:text-slate-400 focus:border-[#08a99d] focus:bg-white"
              />
            </div>

            <button
              type="button"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d] sm:w-auto"
            >
              Submit Enquiry <Send size={16} />
            </button>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              This form is currently a front-end enquiry layout. We can connect
              it to email, WhatsApp, Google Sheets, or a backend once the client
              confirms the preferred enquiry system.
            </p>
          </form>
        </div>
      </section>

      {/* FINAL STRIP */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_45%,#eafffb_100%)] p-7 text-center shadow-xl shadow-slate-100 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
            CareRadar
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
            We really do care.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Start the conversation today and move toward a clearer, more
            organised international nurse recruitment journey.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/nurses"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              For Nurses <ArrowRight size={17} />
            </Link>

            <Link
              href="/employers"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
            >
              For Employers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}