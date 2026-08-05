import type { Metadata } from "next";
import M1Scene from "@/components/journey/scenes/M1Scene";
import MilestoneCopy, {
  M1_COPY,
  TIMELINE_CAVEAT,
} from "@/components/journey/MilestoneCopy";

export const metadata: Metadata = {
  title: "E4 · M1 — Needs assessment and mandate",
  robots: { index: false, follow: false },
};

export default function E4M1Page() {
  return (
    <main className="bg-[#FBF9F4]">
      <section className="mx-auto max-w-2xl px-5 pb-16 pt-24 md:px-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          E4 prototype · milestone 1 · style frame
        </p>
        <p className="mt-4 text-sm leading-7 text-slate-600">{TIMELINE_CAVEAT}</p>
      </section>

      {/* The scene enters from below on scroll. */}
      <div className="h-[70vh]" aria-hidden="true" />

      <section className="mx-auto max-w-5xl px-4 md:px-8">
        <M1Scene />
      </section>

      <section className="pb-24 pt-12">
        <MilestoneCopy content={M1_COPY} />
      </section>

      {/* Room to scroll the scene out and back in, to check the exit crumple. */}
      <div className="h-[130vh]" aria-hidden="true" />
    </main>
  );
}
