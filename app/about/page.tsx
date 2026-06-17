import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about CareRadar, an international nurse recruitment company built around care, clarity, ethical guidance, and healthcare-focused recruitment support.",
};

const values = [
  {
    title: "Care First",
    description:
      "Every nurse and employer interaction should feel respectful, patient, and properly guided.",
    icon: HeartHandshake,
  },
  {
    title: "Clarity Before Promises",
    description:
      "CareRadar focuses on realistic guidance, clear next steps, and responsible communication.",
    icon: Compass,
  },
  {
    title: "Ethical Recruitment",
    description:
      "The process is built around dignity, transparency, and long-term suitability.",
    icon: ShieldCheck,
  },
  {
    title: "Healthcare Focus",
    description:
      "CareRadar is designed specifically for nursing and healthcare recruitment pathways.",
    icon: BadgeCheck,
  },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_72%)] px-5 py-12 md:px-8 md:py-16">
        <div className="absolute left-[-120px] top-16 h-72 w-72 rounded-full bg-[#08a99d]/10 blur-3xl" />
        <div className="absolute right-[-120px] top-28 h-72 w-72 rounded-full bg-[#08264a]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1fr_0.9fr]">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              About CareRadar
            </p>

            <h1 className="mx-auto mt-4 max-w-4xl text-[2.4rem] font-semibold leading-[1.06] tracking-tight text-[#061f3d] sm:text-5xl md:mx-0 md:text-6xl md:leading-[1.04]">
              A recruitment company built around care, clarity, and trust.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-slate-600 md:mx-0 md:text-lg md:leading-8">
              CareRadar supports qualified nurses and healthcare employers
              through a structured international recruitment journey. The focus
              is simple: guide people clearly, communicate responsibly, and keep
              care at the centre of every step.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <Link
                href="/nurses"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-[#08a99d]"
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

          <div className="mx-auto w-full max-w-sm md:max-w-md">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-100">
              <div className="rounded-[1.5rem] bg-[#f8fbff] px-5 py-7 text-center">
                <Image
                  src="/images/careradar-logo.jpeg"
                  alt="CareRadar Logo"
                  width={190}
                  height={190}
                  className="mx-auto h-40 w-40 rounded-full object-contain md:h-48 md:w-48"
                  priority
                />

                <div className="mx-auto mt-5 h-px w-28 bg-gradient-to-r from-transparent via-[#08a99d] to-transparent" />

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#08a99d]">
                  Brand Promise
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#061f3d]">
                  We really do care.
                </h2>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-600">
                  A simple promise behind every candidate conversation and every
                  employer requirement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="bg-white px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              Our Story
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              Recruitment should feel organised, honest, and human.
            </h2>
          </div>

          <div className="space-y-5 text-sm leading-8 text-slate-600 md:text-base">
            <p>
              International healthcare recruitment can be overwhelming. Nurses
              often need guidance on eligibility, documentation, interviews,
              country-specific expectations, and the practical steps involved in
              moving forward. Employers need dependable candidates, clear
              communication, and a recruitment process they can trust.
            </p>

            <p>
              CareRadar was created to sit between both sides with structure and
              care. The name reflects direction — helping nurses and employers
              understand where they are, what comes next, and how to move
              through the journey with more confidence.
            </p>

            <p>
              The company does not position recruitment as a rushed transaction.
              It positions recruitment as a guided pathway. That is why the
              tagline matters: <span className="font-semibold text-[#08264a]">we really do care.</span>
            </p>
          </div>
        </div>
      </section>

      {/* DARK PURPOSE SECTION */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#061f3d]">
          <div className="grid md:grid-cols-3">
            <div className="p-7 text-white md:col-span-1 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#10c4b6]">
                Purpose
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                A clearer pathway for international nurse recruitment.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-300">
                CareRadar exists to make the process more understandable for
                nurses and more dependable for employers.
              </p>
            </div>

            <div className="border-t border-white/10 p-7 md:col-span-2 md:border-l md:border-t-0 md:p-10">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <Stethoscope size={28} className="text-[#10c4b6]" />
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    For nurses
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    CareRadar helps nurses understand the international
                    recruitment journey before they make important career
                    decisions. This includes profile readiness, documentation
                    understanding, interview preparation, and employer
                    coordination.
                  </p>
                </div>

                <div>
                  <Users size={28} className="text-[#10c4b6]" />
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    For employers
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    CareRadar supports healthcare organisations looking for
                    nursing talent by bringing structure to early recruitment
                    stages, candidate communication, and suitability-based
                    coordination.
                  </p>
                </div>
              </div>

              <div className="mt-8 h-px bg-white/10" />

              <p className="mt-8 text-sm leading-7 text-slate-300 md:text-base">
                The result is a more balanced recruitment experience — one that
                respects the nurse’s journey while also understanding the
                employer’s responsibility to patient care and service quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION VISION */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          <div className="rounded-[1.7rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              Mission
            </p>

            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#061f3d]">
              To guide nurses with clarity and care.
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              CareRadar’s mission is to support qualified nurses as they explore
              international opportunities with better preparation, clearer
              expectations, and dependable guidance.
            </p>
          </div>

          <div className="rounded-[1.7rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              Vision
            </p>

            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#061f3d]">
              To become a trusted healthcare recruitment bridge.
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              The long-term vision is to support healthcare systems with
              suitable nursing talent while helping candidates access meaningful
              international career pathways.
            </p>
          </div>

          <div className="rounded-[1.7rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              Promise
            </p>

            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#061f3d]">
              To communicate clearly from start to finish.
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              CareRadar believes that recruitment should never feel vague.
              Every candidate and employer should understand the next step and
              the reason behind it.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-white px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              Values
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              The principles behind every recruitment journey.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
              CareRadar’s values are designed to create trust, not pressure.
              The focus is long-term suitability over quick promises.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d]">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-[#08264a]">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f7fbff] px-5 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-100 bg-white p-7 text-center shadow-xl shadow-slate-100 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
            Work With CareRadar
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
            A recruitment conversation should begin with clarity.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Whether you are a nurse or a healthcare employer, CareRadar can help
            you understand the right pathway before moving forward.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              Contact CareRadar <ArrowRight size={17} />
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