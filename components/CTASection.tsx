import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-white px-5 py-16 md:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#062243] via-[#08315d] to-[#08a99d] px-6 py-10 text-center text-white shadow-2xl shadow-slate-200 md:px-12 md:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-100">
          Start Your Journey
        </p>

        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
          Whether you are a nurse or an employer, CareRadar guides the next step.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-100 md:text-base">
          Speak with our team to understand eligibility, hiring needs,
          documentation, and the recruitment pathway.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#08264a] transition hover:bg-slate-100"
          >
            Contact CareRadar <ArrowRight size={16} />
          </Link>

          <Link
            href="/process"
            className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View Process
          </Link>
        </div>
      </div>
    </section>
  );
}