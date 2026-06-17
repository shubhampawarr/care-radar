import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  HeartHandshake,
  Languages,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

export const metadata: Metadata = {
  title: "For Nurses",
  description:
    "CareRadar helps qualified nurses explore international healthcare opportunities with guidance on eligibility, documentation, interview preparation, and recruitment coordination.",
};

const supportAreas = [
  {
    title: "Eligibility Understanding",
    description:
      "Get clearer direction on basic requirements, experience expectations, and the early steps needed before applying.",
    icon: BadgeCheck,
  },
  {
    title: "Profile Preparation",
    description:
      "Prepare a stronger professional profile so employers can understand your nursing background properly.",
    icon: ClipboardCheck,
  },
  {
    title: "Document Guidance",
    description:
      "Understand the documents commonly needed during international nurse recruitment and employer coordination.",
    icon: FileCheck2,
  },
  {
    title: "Interview Readiness",
    description:
      "Receive guidance on communication, confidence, and preparation before speaking with healthcare employers.",
    icon: MessageCircle,
  },
];

const journeySteps = [
  {
    title: "Share your interest",
    description:
      "Tell CareRadar about your nursing background, experience, preferred direction, and current preparation stage.",
  },
  {
    title: "Understand your pathway",
    description:
      "We help you understand what your next steps may look like depending on your profile and target opportunities.",
  },
  {
    title: "Prepare your profile",
    description:
      "You receive guidance around documents, presentation, communication, and employer readiness.",
  },
  {
    title: "Move toward opportunities",
    description:
      "Suitable profiles can be coordinated further with healthcare employers through a structured recruitment process.",
  },
];

const idealFor = [
  "Registered or qualified nurses exploring overseas healthcare opportunities",
  "Nurses who need clarity about documents, interviews, and preparation",
  "Candidates who want a structured recruitment journey rather than vague promises",
  "Nurses looking for responsible guidance before employer conversations",
];

export default function NursesPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_72%)] px-5 py-12 md:px-8 md:py-16">
        <div className="absolute left-[-120px] top-16 h-72 w-72 rounded-full bg-[#08a99d]/10 blur-3xl" />
        <div className="absolute right-[-120px] top-28 h-72 w-72 rounded-full bg-[#08264a]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center md:text-left">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#08a99d]/20 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#087d76] shadow-sm md:mx-0">
              <Stethoscope size={14} />
              For Nurses
            </div>

            <h1 className="mx-auto mt-5 max-w-4xl text-[2.4rem] font-semibold leading-[1.06] tracking-tight text-[#061f3d] sm:text-5xl md:mx-0 md:text-6xl md:leading-[1.04]">
              Your international nursing journey starts with the right guidance.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 md:mx-0 md:text-lg md:leading-8">
              CareRadar helps qualified nurses understand overseas recruitment
              pathways with support around eligibility, profile preparation,
              documentation, interviews, and employer coordination.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-[#08a99d]"
              >
                Apply Now <ArrowRight size={17} />
              </Link>

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
                What You Get
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#061f3d]">
                A clearer, calmer way to move forward.
              </h2>

              <div className="mt-6 space-y-4">
                {[
                  "Understand where you currently stand",
                  "Prepare your nursing profile professionally",
                  "Know which documents may be important",
                  "Approach employer conversations with confidence",
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
                  CareRadar does not treat your application like a number. The
                  aim is to help you understand the route, prepare properly, and
                  move with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-white px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              Nurse Pathway
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              Moving abroad as a nurse should not feel confusing.
            </h2>
          </div>

          <div className="space-y-5 text-sm leading-8 text-slate-600 md:text-base">
            <p>
              International nurse recruitment involves more than simply sending
              a resume. Nurses often need to understand their eligibility,
              clinical experience, documents, communication standards, interview
              expectations, and employer requirements before moving forward.
            </p>

            <p>
              CareRadar helps make this journey more organised. The focus is to
              guide you through the early recruitment stages with realistic
              communication, proper preparation, and a clear understanding of
              what comes next.
            </p>

            <p>
              Whether you are just exploring opportunities or already preparing
              your documents, CareRadar helps you take the next step with more
              confidence and less confusion.
            </p>
          </div>
        </div>
      </section>

      {/* SUPPORT AREAS */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              How We Support You
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              Practical support before important decisions.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              CareRadar focuses on the preparation and clarity nurses need
              before moving through international recruitment opportunities.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {supportAreas.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm"
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

      {/* DARK SECTION */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#061f3d]">
          <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
            <div className="p-7 text-white md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#10c4b6]">
                Why Nurses Choose Guidance
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                A better-prepared nurse creates a stronger opportunity.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-300 md:text-base">
                Employers do not only look at qualifications. They also look at
                communication, readiness, documentation, attitude, and fit.
                CareRadar helps nurses prepare with these realities in mind.
              </p>

              <Link
                href="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#08a99d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#061f3d]"
              >
                Start your enquiry <ArrowRight size={17} />
              </Link>
            </div>

            <div className="border-t border-white/10 p-7 md:border-l md:border-t-0 md:p-10">
              <div className="space-y-6">
                <div>
                  <Languages size={26} className="text-[#10c4b6]" />
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    Communication readiness
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Guidance to help you present yourself clearly and
                    professionally during employer interactions.
                  </p>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <ShieldCheck size={26} className="text-[#10c4b6]" />
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    Realistic expectations
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Clearer communication around process stages, preparation
                    needs, and practical next steps.
                  </p>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <Globe2 size={26} className="text-[#10c4b6]" />
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    International opportunity pathway
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Support designed for nurses who want to explore healthcare
                    careers outside their home country.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              Your Journey
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              From first enquiry to employer coordination.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
              Every candidate journey can be different, but the early path
              should always be clear. CareRadar helps you understand where you
              are and what needs to happen next.
            </p>
          </div>

          <div className="space-y-4">
            {journeySteps.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-4 rounded-[1.3rem] border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#08264a] text-sm font-semibold text-white">
                  {index + 1}
                </div>

                <div>
                  <h3 className="font-semibold text-[#08264a]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IDEAL FOR */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-100 bg-white p-7 shadow-xl shadow-slate-100 md:p-10">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
                Is This For You?
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-4xl">
                CareRadar is suitable for nurses who want clarity before action.
              </h2>
            </div>

            <div className="space-y-4">
              {idealFor.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-1 shrink-0 text-[#08a99d]"
                  />
                  <p className="text-sm leading-7 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-100 bg-white p-7 text-center shadow-xl shadow-slate-100 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
            Apply As A Nurse
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
            Ready to understand your international nursing pathway?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Share your details with CareRadar and take the first step toward a
            clearer, better-prepared recruitment journey.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              Apply Now <ArrowRight size={17} />
            </Link>

            <Link
              href="/process"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
            >
              View process
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}