import Image from "next/image";
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
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

const trustPoints = [
  "Guidance for qualified nurses exploring international opportunities",
  "Recruitment support for hospitals, clinics, and healthcare organisations",
  "Structured process covering screening, preparation, and coordination",
  "Care-led communication for candidates and employers",
];

const pathways = [
  {
    title: "Nurses looking for international opportunities",
    description:
      "CareRadar helps nurses understand the overseas recruitment journey with support around eligibility, profile preparation, documentation, interview readiness, and employer coordination.",
    icon: Stethoscope,
    href: "/nurses",
    cta: "Explore nurse pathway",
  },
  {
    title: "Healthcare employers looking to recruit nurses",
    description:
      "We support healthcare organisations with a more focused recruitment process by helping identify suitable nursing candidates and coordinating the early stages of international hiring.",
    icon: Building2,
    href: "/employers",
    cta: "Explore employer support",
  },
];

const processSteps = [
  {
    title: "Initial enquiry and registration",
    description:
      "The first step is understanding whether the visitor is a nurse or employer and what support they need.",
  },
  {
    title: "Profile review and eligibility understanding",
    description:
      "CareRadar reviews the basic situation so the next steps are realistic, not vague or confusing.",
  },
  {
    title: "Document and interview preparation guidance",
    description:
      "The candidate journey is strengthened through clearer preparation before employer interaction.",
  },
  {
    title: "Employer matching and recruitment coordination",
    description:
      "Suitable candidates and employers are connected through a more organised recruitment pathway.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_78%)] px-5 py-10 md:px-8 md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e6eef7_1px,transparent_1px),linear-gradient(to_bottom,#e6eef7_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.22]" />
        <div className="absolute left-[-130px] top-20 h-72 w-72 rounded-full bg-[#08a99d]/10 blur-3xl" />
        <div className="absolute right-[-130px] top-28 h-80 w-80 rounded-full bg-[#08264a]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.06fr_0.94fr]">
          <div className="text-center md:text-left">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#08a99d]/20 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#087d76] shadow-sm backdrop-blur md:mx-0">
              <HeartHandshake size={14} />
              International Nurse Recruitment
            </div>

            <h1 className="mx-auto mt-5 max-w-4xl text-[2.35rem] font-semibold leading-[1.06] tracking-tight text-[#061f3d] sm:text-5xl md:mx-0 md:text-6xl md:leading-[1.04]">
              Helping nurses and healthcare employers move forward with care.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 md:mx-0 md:text-lg md:leading-8">
              CareRadar supports qualified nurses exploring international
              healthcare careers and helps employers connect with nursing talent
              through a structured, transparent, and human recruitment process.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-[#08a99d]"
              >
                Apply as a Nurse <ArrowRight size={17} />
              </Link>

              <Link
                href="/employers"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] shadow-sm transition hover:border-[#08a99d] hover:text-[#08a99d]"
              >
                Hire Nurses
              </Link>
            </div>

            <div className="mx-auto mt-8 max-w-2xl rounded-[1.4rem] border border-slate-100 bg-white/90 p-5 text-left shadow-lg shadow-slate-100 backdrop-blur md:mx-0">
              <div className="mb-4 h-px w-full bg-gradient-to-r from-[#08a99d] via-slate-100 to-transparent" />
              <p className="text-sm leading-7 text-slate-600">
                The recruitment journey can feel complex for both sides. Nurses
                need clarity about requirements, documents, interviews, and
                realistic opportunities. Employers need reliable candidates,
                proper screening, and clear coordination. CareRadar sits between
                both with a care-first approach.
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm md:max-w-md">
            <div className="absolute -inset-3 rounded-[2.4rem] bg-gradient-to-br from-[#08a99d]/15 via-white to-[#08264a]/10 blur-xl" />
            <div className="relative rounded-[2rem] border border-white bg-white p-4 shadow-2xl shadow-slate-200">
              <div className="rounded-[1.5rem] border border-slate-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_52%,#eafffb_100%)] px-5 py-7 text-center">
                <Image
                  src="/images/careradar-logo.jpeg"
                  alt="CareRadar Logo"
                  width={190}
                  height={190}
                  className="mx-auto h-36 w-36 rounded-full object-contain md:h-44 md:w-44"
                  priority
                />

                <div className="mx-auto mt-5 h-px w-28 bg-gradient-to-r from-transparent via-[#08a99d] to-transparent" />

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#08a99d]">
                  CareRadar Promise
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#061f3d]">
                  We really do care.
                </h2>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-600">
                  A recruitment experience built on dignity, guidance, and
                  dependable support.
                </p>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  {["Care", "Clarity", "Trust"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm"
                    >
                      <p className="text-xs font-semibold text-[#08264a]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST POINTS */}
      <section className="bg-white px-5 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl rounded-[1.6rem] border border-slate-100 bg-white p-4 shadow-lg shadow-slate-100 md:p-5">
          <div className="grid gap-3 md:grid-cols-4">
            {trustPoints.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-2xl bg-[#f8fbff] p-4"
              >
                <CheckCircle2
                  size={18}
                  className="mt-1 shrink-0 text-[#08a99d]"
                />
                <p className="text-sm leading-6 text-slate-600">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-white px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              What CareRadar Does
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              A focused recruitment bridge for nurses and healthcare providers.
            </h2>
          </div>

          <div className="space-y-5 text-sm leading-8 text-slate-600 md:text-base">
            <p>
              CareRadar is built for international nurse recruitment. The goal
              is not just to collect applications or pass profiles forward, but
              to make the journey clearer for nurses and more dependable for
              healthcare employers.
            </p>

            <p>
              For nurses, this means guidance before important steps such as
              profile screening, documentation, interview preparation, and
              employer conversations. For employers, this means a recruitment
              partner that understands the need for responsible communication,
              candidate suitability, and organised coordination.
            </p>

            <p>
              The brand stands on a simple belief: recruitment should feel
              professional, structured, and human. That is why CareRadar’s
              promise is direct — we really do care.
            </p>
          </div>
        </div>
      </section>

      {/* PATHWAYS */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              Two Pathways
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              Clear support for both sides of recruitment.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              CareRadar guides each visitor toward the right pathway — whether
              they are a nurse exploring opportunities or a healthcare employer
              looking to hire.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {pathways.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  href={item.href}
                  key={item.title}
                  className="group relative overflow-hidden rounded-[1.8rem] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100 transition hover:-translate-y-1 hover:border-[#08a99d]/30 hover:shadow-xl md:p-8"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#08a99d] to-[#08264a]" />
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-[#08a99d]/5" />

                  <div className="relative flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d] ring-1 ring-[#08a99d]/10">
                      <Icon size={24} />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-[#08264a] md:text-2xl">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {item.description}
                      </p>

                      <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#08a99d]/10 px-4 py-2 text-sm font-semibold text-[#087d76]">
                        {item.cta}
                        <ArrowRight
                          size={16}
                          className="transition group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* DARK CALM SECTION */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#061f3d] shadow-2xl shadow-slate-200">
          <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative p-7 text-white md:p-10">
              <div className="absolute left-0 top-0 h-full w-1 bg-[#08a99d]" />

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#10c4b6]">
                Why It Matters
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                International healthcare recruitment needs more than speed.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-300 md:text-base">
                For nurses, moving abroad can shape an entire career and family
                future. For employers, every hiring decision affects patient
                care, team stability, and service quality. CareRadar focuses on
                careful matching, structured guidance, and responsible
                communication.
              </p>

              <Link
                href="/process"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#08a99d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#061f3d]"
              >
                View recruitment process <ArrowRight size={17} />
              </Link>
            </div>

            <div className="border-t border-white/10 p-7 md:border-l md:border-t-0 md:p-10">
              <div className="space-y-6">
                <div>
                  <ShieldCheck size={26} className="text-[#10c4b6]" />
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    Ethical recruitment mindset
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    We position the process around honest expectations,
                    candidate dignity, and dependable employer coordination.
                  </p>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <Globe2 size={26} className="text-[#10c4b6]" />
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    International pathway clarity
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Nurses receive clearer direction on the journey ahead, while
                    employers receive better organised recruitment support.
                  </p>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <FileCheck2 size={26} className="text-[#10c4b6]" />
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    Preparation before placement
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    The focus is on readiness — profile, documents,
                    communication, interview preparation, and suitable matching.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS SNAPSHOT */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              Process Snapshot
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              Simple enough to understand. Structured enough to trust.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
              The full recruitment process can vary depending on country,
              employer requirements, documentation, and candidate readiness. But
              the CareRadar journey always begins with clarity.
            </p>
          </div>

          <div className="space-y-4">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-4 rounded-[1.4rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:border-[#08a99d]/25 hover:shadow-lg hover:shadow-slate-100"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#08264a] text-sm font-semibold text-white">
                  {index + 1}
                </div>

                <div>
                  <h3 className="font-semibold text-[#08264a]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_45%,#eafffb_100%)] p-7 text-center shadow-xl shadow-slate-100 md:p-12">
          <div className="mx-auto mb-5 h-px max-w-md bg-gradient-to-r from-transparent via-[#08a99d] to-transparent" />

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
            Start Your Journey
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
            Speak with CareRadar about your next step.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Whether you are a nurse exploring international opportunities or a
            healthcare employer looking for recruitment support, CareRadar can
            help you understand the right pathway.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              Contact CareRadar <ArrowRight size={17} />
            </Link>

            <Link
              href="/nurses"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
            >
              Explore nurse pathway
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}