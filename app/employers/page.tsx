import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  HeartHandshake,
  SearchCheck,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";

export const metadata: Metadata = {
  title: "For Employers",
  description:
    "CareRadar supports healthcare employers with structured international nurse recruitment, candidate coordination, screening guidance, and ethical hiring support.",
};

const supportAreas = [
  {
    title: "Candidate Coordination",
    description:
      "Support in connecting with nursing candidates who are better prepared for employer conversations.",
    icon: UsersRound,
  },
  {
    title: "Profile Screening",
    description:
      "A structured early-stage review approach to help understand candidate background, readiness, and suitability.",
    icon: SearchCheck,
  },
  {
    title: "Documentation Clarity",
    description:
      "Better coordination around candidate information, documents, and preparation before moving ahead.",
    icon: FileCheck2,
  },
  {
    title: "Ethical Hiring Support",
    description:
      "Recruitment communication built around transparency, realistic expectations, and long-term fit.",
    icon: ShieldCheck,
  },
];

const recruitmentSteps = [
  {
    title: "Share hiring requirement",
    description:
      "Tell CareRadar about your nursing recruitment needs, role expectations, location, and candidate preferences.",
  },
  {
    title: "Understand candidate fit",
    description:
      "Candidate profiles can be reviewed with attention to experience, communication, readiness, and basic suitability.",
  },
  {
    title: "Coordinate next steps",
    description:
      "CareRadar supports the early recruitment flow between candidates and employer-side requirements.",
  },
  {
    title: "Move toward selection",
    description:
      "Suitable candidates can progress toward interviews, documentation, and placement coordination.",
  },
];

const employerTypes = [
  "Hospitals seeking qualified nursing professionals",
  "Clinics requiring dependable healthcare staffing support",
  "Care homes and elderly care providers",
  "Healthcare organisations exploring international recruitment channels",
];

export default function EmployersPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_72%)] px-5 py-12 md:px-8 md:py-16">
        <div className="absolute left-[-120px] top-16 h-72 w-72 rounded-full bg-[#08a99d]/10 blur-3xl" />
        <div className="absolute right-[-120px] top-28 h-72 w-72 rounded-full bg-[#08264a]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center md:text-left">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#08a99d]/20 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#087d76] shadow-sm md:mx-0">
              <Building2 size={14} />
              For Healthcare Employers
            </div>

            <h1 className="mx-auto mt-5 max-w-4xl text-[2.4rem] font-semibold leading-[1.06] tracking-tight text-[#061f3d] sm:text-5xl md:mx-0 md:text-6xl md:leading-[1.04]">
              Recruit international nurses with structure, clarity, and care.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 md:mx-0 md:text-lg md:leading-8">
              CareRadar helps healthcare employers connect with qualified
              nursing candidates through a more organised, ethical, and
              healthcare-focused recruitment pathway.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-[#08a99d]"
              >
                Enquire as Employer <ArrowRight size={17} />
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
                Employer Support
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#061f3d]">
                International hiring requires more than candidate forwarding.
              </h2>

              <div className="mt-6 space-y-4">
                {[
                  "Understand candidate readiness before progressing",
                  "Coordinate recruitment communication more clearly",
                  "Support early-stage profile and document review",
                  "Create a more dependable hiring pathway",
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
                  CareRadar focuses on responsible recruitment support —
                  organised communication, candidate suitability, and a clear
                  pathway for healthcare employers.
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
              Employer Pathway
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              Healthcare hiring needs reliable people and a reliable process.
            </h2>
          </div>

          <div className="space-y-5 text-sm leading-8 text-slate-600 md:text-base">
            <p>
              Recruiting nurses internationally can be complex. Employers need
              more than a list of names. They need candidates who are prepared,
              informed, suitable for the role, and able to move through the
              recruitment journey with clarity.
            </p>

            <p>
              CareRadar supports healthcare employers by creating a more
              organised early-stage recruitment experience. The focus is on
              understanding requirements, coordinating candidate information,
              supporting communication, and helping suitable candidates progress
              through the process.
            </p>

            <p>
              This approach is especially important in healthcare, where hiring
              decisions affect patient care, team stability, service quality, and
              long-term workforce planning.
            </p>
          </div>
        </div>
      </section>

      {/* SUPPORT AREAS */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              Recruitment Support
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              Structured support for healthcare employers.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              CareRadar helps employers approach international nurse recruitment
              with better organisation, communication, and candidate readiness.
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
                Why It Matters
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Strong healthcare teams begin with careful recruitment.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-300 md:text-base">
                Nursing recruitment is not only about filling vacancies. It is
                about bringing suitable professionals into environments where
                patient care, communication, responsibility, and stability
                matter every day.
              </p>

              <Link
                href="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#08a99d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#061f3d]"
              >
                Discuss hiring needs <ArrowRight size={17} />
              </Link>
            </div>

            <div className="border-t border-white/10 p-7 md:border-l md:border-t-0 md:p-10">
              <div className="space-y-6">
                <div>
                  <Stethoscope size={26} className="text-[#10c4b6]" />
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    Nursing-specific understanding
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    The process is focused on nursing and healthcare staffing,
                    not generic recruitment.
                  </p>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <ClipboardCheck size={26} className="text-[#10c4b6]" />
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    Organised early-stage coordination
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Candidate communication, profile readiness, and recruitment
                    steps are handled with structure.
                  </p>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <HeartHandshake size={26} className="text-[#10c4b6]" />
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    Human, responsible communication
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    CareRadar keeps the candidate experience respectful while
                    supporting employer-side recruitment needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMPLOYER TYPES */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-100 bg-white p-7 shadow-xl shadow-slate-100 md:p-10">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
                Who We Support
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-4xl">
                Built for healthcare organisations with nursing hiring needs.
              </h2>
            </div>

            <div className="space-y-4">
              {employerTypes.map((item) => (
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

      {/* PROCESS */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              Recruitment Flow
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              A practical flow from requirement to candidate coordination.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
              CareRadar helps employers create a clearer recruitment path before
              candidates move into deeper selection, interview, or placement
              stages.
            </p>
          </div>

          <div className="space-y-4">
            {recruitmentSteps.map((step, index) => (
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

      {/* CTA */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-100 bg-white p-7 text-center shadow-xl shadow-slate-100 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
            Employer Enquiry
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
            Looking to recruit international nurses?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Share your hiring needs with CareRadar and understand how we can
            support your recruitment pathway.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              Enquire Now <ArrowRight size={17} />
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