import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  HeartHandshake,
  MessageCircle,
  SearchCheck,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Recruitment Process",
  description:
    "Understand the CareRadar recruitment process for nurses and healthcare employers, from enquiry and screening to preparation, coordination, and placement support.",
};

const processSteps = [
  {
    title: "Initial Enquiry",
    description:
      "The journey begins when a nurse or healthcare employer shares their interest, requirement, or recruitment need with CareRadar.",
    icon: MessageCircle,
  },
  {
    title: "Profile & Requirement Review",
    description:
      "CareRadar reviews the nurse profile or employer requirement to understand the current situation, expectations, and possible next steps.",
    icon: SearchCheck,
  },
  {
    title: "Eligibility & Readiness Guidance",
    description:
      "Nurses receive clearer direction on profile readiness, experience, documents, communication, and preparation before moving forward.",
    icon: BadgeCheck,
  },
  {
    title: "Documentation Support",
    description:
      "The process includes guidance around important candidate information and documents needed during international recruitment coordination.",
    icon: FileCheck2,
  },
  {
    title: "Interview Preparation",
    description:
      "Candidates are guided to present themselves clearly and professionally before employer conversations or interview stages.",
    icon: ClipboardCheck,
  },
  {
    title: "Employer Coordination",
    description:
      "Suitable candidate profiles and employer requirements are coordinated through a structured and responsible recruitment pathway.",
    icon: Building2,
  },
];

const nursePath = [
  "Share your nursing background and career interest",
  "Understand your eligibility and preparation stage",
  "Prepare your profile, documents, and communication",
  "Move toward suitable employer opportunities",
];

const employerPath = [
  "Share your hiring requirement and role expectations",
  "Understand the candidate coordination process",
  "Review suitable nursing profiles with better context",
  "Move toward interview and selection coordination",
];

const heroPoints = [
  "Clear first enquiry",
  "Profile and requirement understanding",
  "Preparation before employer conversations",
  "Responsible recruitment coordination",
];

export default function ProcessPage() {
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
              <ClipboardCheck size={14} />
              Recruitment Process
            </div>

            <h1 className="mx-auto mt-5 max-w-4xl text-[2.35rem] font-semibold leading-[1.06] tracking-tight text-[#061f3d] sm:text-5xl md:mx-0 md:text-6xl md:leading-[1.04]">
              A clear recruitment journey from first enquiry to coordination.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 md:mx-0 md:text-lg md:leading-8">
              CareRadar keeps international nurse recruitment organised by
              helping nurses and employers understand what happens next at every
              stage.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-[#08a99d]"
              >
                Start Enquiry <ArrowRight size={17} />
              </Link>

              <Link
                href="/nurses"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] shadow-sm transition hover:border-[#08a99d] hover:text-[#08a99d]"
              >
                For Nurses
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
                  Process Promise
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#061f3d]">
                  Simple enough to understand. Structured enough to trust.
                </h2>

                <div className="mt-6 space-y-4">
                  {heroPoints.map((item) => (
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
                    The exact pathway may vary by country, employer requirement,
                    and candidate readiness, but the goal remains the same:
                    clarity before progress.
                  </p>
                </div>
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
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              A guided process for nurses and employers.
            </h2>
          </div>

          <div className="rounded-[1.7rem] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100 md:p-8">
            <div className="mb-5 h-px w-full bg-gradient-to-r from-[#08a99d] via-slate-100 to-transparent" />

            <div className="space-y-5 text-sm leading-8 text-slate-600 md:text-base">
              <p>
                International nurse recruitment involves multiple moving parts:
                candidate readiness, documents, communication, employer
                expectations, interview stages, and coordination. Without a
                clear process, both candidates and employers can feel uncertain.
              </p>

              <p>
                CareRadar creates a more organised pathway by helping both sides
                understand the next step. Nurses receive guidance before
                important recruitment stages, while employers receive more
                structured candidate coordination.
              </p>

              <p>
                The process is not built around rushing applications. It is
                built around understanding, preparation, and responsible
                movement toward suitable opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FULL PROCESS */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              Step By Step
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              The CareRadar recruitment flow.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              Each stage is designed to reduce confusion and help nurses and
              employers move forward with better preparation.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="group relative overflow-hidden rounded-[1.6rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#08a99d]/25 hover:shadow-lg hover:shadow-slate-100"
                >
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#08a99d]/5" />

                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
                      <Icon size={22} />
                    </div>

                    <span className="text-sm font-semibold text-slate-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="relative mt-5 text-lg font-semibold text-[#08264a]">
                    {step.title}
                  </h3>

                  <p className="relative mt-3 text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DARK SECTION */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#061f3d] shadow-2xl shadow-slate-200">
          <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative p-7 text-white md:p-10">
              <div className="absolute left-0 top-0 h-full w-1 bg-[#08a99d]" />

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#10c4b6]">
                Built Around Clarity
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Good recruitment starts before the interview.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-300 md:text-base">
                CareRadar focuses on the early stages that shape recruitment
                quality: understanding, preparation, documentation, and
                communication. These steps help candidates and employers move
                forward more confidently.
              </p>

              <Link
                href="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#08a99d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#061f3d]"
              >
                Begin the process <ArrowRight size={17} />
              </Link>
            </div>

            <div className="border-t border-white/10 p-7 md:border-l md:border-t-0 md:p-10">
              <div className="space-y-6">
                <div>
                  <HeartHandshake size={26} className="text-[#10c4b6]" />
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    Candidate care
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Nurses receive guidance that respects the seriousness of
                    international career decisions.
                  </p>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <Building2 size={26} className="text-[#10c4b6]" />
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    Employer confidence
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Healthcare employers receive a more structured recruitment
                    flow instead of disorganised candidate forwarding.
                  </p>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <ShieldCheck size={26} className="text-[#10c4b6]" />
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    Responsible movement
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    The process prioritises realistic communication and
                    suitability over rushed promises.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TWO PATHWAYS */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              Two Sides Of The Journey
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              The process adapts to who you are.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              Nurses and employers enter the process from different starting
              points, but both need clarity, preparation, and coordination.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <Link
              href="/nurses"
              className="group relative overflow-hidden rounded-[1.8rem] border border-slate-100 bg-white p-7 shadow-lg shadow-slate-100 transition hover:-translate-y-1 hover:border-[#08a99d]/30 hover:shadow-xl md:p-8"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#08a99d] to-[#08264a]" />
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-[#08a99d]/5" />

              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
                <Stethoscope size={24} />
              </div>

              <h3 className="relative mt-5 text-2xl font-semibold tracking-tight text-[#061f3d]">
                Nurse pathway
              </h3>

              <div className="relative mt-6 space-y-4">
                {nursePath.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-1 shrink-0 text-[#08a99d]"
                    />
                    <p className="text-sm leading-7 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>

              <div className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-[#08a99d]/10 px-4 py-2 text-sm font-semibold text-[#087d76]">
                View nurse page
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </Link>

            <Link
              href="/employers"
              className="group relative overflow-hidden rounded-[1.8rem] border border-slate-100 bg-white p-7 shadow-lg shadow-slate-100 transition hover:-translate-y-1 hover:border-[#08a99d]/30 hover:shadow-xl md:p-8"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#08a99d] to-[#08264a]" />
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-[#08a99d]/5" />

              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
                <Building2 size={24} />
              </div>

              <h3 className="relative mt-5 text-2xl font-semibold tracking-tight text-[#061f3d]">
                Employer pathway
              </h3>

              <div className="relative mt-6 space-y-4">
                {employerPath.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-1 shrink-0 text-[#08a99d]"
                    />
                    <p className="text-sm leading-7 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>

              <div className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-[#08a99d]/10 px-4 py-2 text-sm font-semibold text-[#087d76]">
                View employer page
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_45%,#eafffb_100%)] p-7 text-center shadow-xl shadow-slate-100 md:p-12">
          <div className="mx-auto mb-5 h-px max-w-md bg-gradient-to-r from-transparent via-[#08a99d] to-transparent" />

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
            Start The Process
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
            Begin with one clear conversation.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Whether you are a nurse or a healthcare employer, CareRadar can help
            you understand the right first step before moving forward.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              Contact CareRadar <ArrowRight size={17} />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
            >
              About CareRadar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}