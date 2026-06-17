import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseMedical,
  Building2,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  HeartHandshake,
  Languages,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import CTASection from "@/components/CTASection";

const audienceCards = [
  {
    title: "For Nurses",
    description:
      "Guidance for qualified nurses exploring overseas healthcare opportunities with structured support.",
    icon: Stethoscope,
    href: "/nurses",
  },
  {
    title: "For Employers",
    description:
      "Recruitment support for hospitals, clinics, care homes, and healthcare organisations.",
    icon: Building2,
    href: "/employers",
  },
  {
    title: "Our Process",
    description:
      "A clear pathway covering registration, screening, documentation, interviews, and placement.",
    icon: ClipboardCheck,
    href: "/process",
  },
];

const strengths = [
  {
    title: "Ethical Recruitment",
    description:
      "A responsible recruitment approach focused on transparency, candidate care, and employer confidence.",
    icon: ShieldCheck,
  },
  {
    title: "Healthcare Focused",
    description:
      "Built specifically around nursing and healthcare staffing, not generic manpower placement.",
    icon: BriefcaseMedical,
  },
  {
    title: "End-to-End Guidance",
    description:
      "Support across profile review, document preparation, interview readiness, and placement coordination.",
    icon: FileCheck2,
  },
  {
    title: "International Pathway",
    description:
      "Helping candidates and employers navigate cross-border healthcare recruitment requirements.",
    icon: Globe2,
  },
];

const processSteps = [
  "Candidate registration",
  "Profile screening",
  "Document guidance",
  "Interview preparation",
  "Employer matching",
  "Placement support",
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,#d9fffb_0,#ffffff_34%,#f7fbff_100%)] px-5 py-12 md:px-8 md:py-20">
        <div className="absolute left-0 top-28 h-64 w-64 rounded-full bg-[#08a99d]/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#08264a]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center md:text-left">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#087d76] shadow-sm md:mx-0">
              <HeartHandshake size={15} />
              International Nurse Recruitment
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#061f3d] md:text-6xl md:leading-[1.05]">
              Connecting skilled nurses with trusted healthcare opportunities.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 md:mx-0 md:text-lg">
              CareRadar helps qualified nurses explore international healthcare
              careers while supporting employers with reliable, ethical, and
              structured recruitment solutions.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-[#08a99d]"
              >
                Apply as a Nurse <ArrowRight size={17} />
              </Link>

              <Link
                href="/employers"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:border-[#08a99d] hover:text-[#08a99d]"
              >
                Hire Nurses
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 rounded-3xl border border-slate-100 bg-white/80 p-3 shadow-xl shadow-slate-100 backdrop-blur">
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-xl font-semibold text-[#08264a]">Care</p>
                <p className="mt-1 text-xs text-slate-500">candidate first</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-xl font-semibold text-[#08264a]">Trust</p>
                <p className="mt-1 text-xs text-slate-500">clear process</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-xl font-semibold text-[#08264a]">Reach</p>
                <p className="mt-1 text-xs text-slate-500">global pathway</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="mx-auto max-w-md rounded-[2.5rem] border border-white bg-white p-5 shadow-2xl shadow-slate-200 md:max-w-lg">
              <div className="rounded-[2rem] bg-gradient-to-br from-[#f2fffd] to-[#edf5ff] p-6">
                <div className="flex justify-center">
                  <Image
                    src="/images/careradar-logo.jpeg"
                    alt="CareRadar Logo"
                    width={260}
                    height={260}
                    className="h-56 w-56 rounded-full object-contain md:h-72 md:w-72"
                    priority
                  />
                </div>

                <div className="mt-6 rounded-3xl bg-white p-5 shadow-lg shadow-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d]">
                      <BadgeCheck size={22} />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-[#08264a]">
                        We really do care.
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        A recruitment experience designed around clarity,
                        dignity, and dependable support for nurses and
                        healthcare employers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 left-1/2 w-[88%] -translate-x-1/2 rounded-full bg-[#08a99d]/20 py-6 blur-2xl" />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              Who We Help
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              One platform for nurses and healthcare employers.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              CareRadar brings structure to international nurse recruitment by
              supporting both sides of the hiring journey.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {audienceCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group rounded-[2rem] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100 transition hover:-translate-y-1 hover:border-[#08a99d]/30 hover:shadow-xl"
                >
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#08a99d]/10 text-[#08a99d]">
                    <Icon size={25} />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-[#08264a]">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {card.description}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#08a99d]">
                    Learn more
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f7fbff] px-5 py-16 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#08a99d]">
              Why CareRadar
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#061f3d] md:text-5xl">
              Recruitment built around care, clarity, and compliance.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              International healthcare recruitment can feel complex. CareRadar
              keeps the journey organised with a human, transparent, and
              healthcare-focused approach.
            </p>

            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#08264a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
            >
              About CareRadar <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {strengths.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[1.7rem] border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#08264a] text-white">
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

      <section className="bg-white px-5 py-16 md:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.2rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-100 md:p-8">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div className="rounded-[1.8rem] bg-gradient-to-br from-[#062243] to-[#08a99d] p-8 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-100">
                The Journey
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                A clear recruitment pathway from first enquiry to placement.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-100">
                The process is designed to reduce confusion and keep every
                candidate and employer informed at each stage.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {processSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-[#f8fbff] p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#08a99d] shadow-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <p className="text-sm font-semibold text-[#08264a]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7fbff] px-5 py-16 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-7 shadow-lg shadow-slate-100">
            <Users className="text-[#08a99d]" size={30} />
            <h3 className="mt-5 text-xl font-semibold text-[#08264a]">
              Candidate Support
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Helping nurses understand eligibility, prepare profiles, and move
              through the international hiring pathway with confidence.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-7 shadow-lg shadow-slate-100">
            <Languages className="text-[#08a99d]" size={30} />
            <h3 className="mt-5 text-xl font-semibold text-[#08264a]">
              Preparation Guidance
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Support for communication, interview readiness, and important
              preparation steps before employer interaction.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-7 shadow-lg shadow-slate-100">
            <FileCheck2 className="text-[#08a99d]" size={30} />
            <h3 className="mt-5 text-xl font-semibold text-[#08264a]">
              Documentation Clarity
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Helping candidates and employers understand the paperwork and
              coordination needed for a smoother recruitment experience.
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}