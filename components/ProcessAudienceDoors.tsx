"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PhotoPanel from "@/components/PhotoPanel";
import type { SiteImageKey } from "@/lib/site-images";

export type ProcessAudience = "candidate" | "employer";

type DoorCopy = {
  label: string;
  subtitle: string;
  cta: string;
};

type ProcessAudienceDoorsProps = {
  eyebrow: string;
  title: string;
  description: string;
  hint: string;
  candidate: DoorCopy;
  employer: DoorCopy;
  onSelect: (audience: ProcessAudience) => void;
};

const slideEase = [0.22, 1, 0.36, 1] as const;

type SlidingDoorProps = {
  side: "left" | "right";
  imageKey: SiteImageKey;
  label: string;
  subtitle: string;
  cta: string;
  accent: string;
  accentDark: string;
  isHovered: boolean;
  isOpening: boolean;
  isOtherOpening: boolean;
  disabled: boolean;
  onHover: (hovered: boolean) => void;
  onSelect: () => void;
};

function SlidingDoor({
  side,
  imageKey,
  label,
  subtitle,
  cta,
  accent,
  accentDark,
  isHovered,
  isOpening,
  isOtherOpening,
  disabled,
  onHover,
  onSelect,
}: SlidingDoorProps) {
  const peekOffset = side === "left" ? "-4%" : "4%";
  const openOffset = side === "left" ? "-100%" : "100%";

  let x: string | number = 0;
  if (isOpening) {
    x = openOffset;
  } else if (isHovered && !disabled && !isOtherOpening) {
    x = peekOffset;
  }

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      aria-label={cta}
      disabled={disabled}
      initial={false}
      animate={{ x }}
      transition={{
        duration: isOpening ? 0.9 : 0.45,
        ease: slideEase,
      }}
      className={`group absolute top-0 z-10 h-full w-1/2 overflow-hidden border-none p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
        side === "left" ? "left-0" : "right-0"
      } ${disabled ? "cursor-default" : "cursor-pointer"}`}
    >
      <PhotoPanel
        imageKey={imageKey}
        className="absolute inset-0"
        overlay="dark"
        sizes="50vw"
        priority
      />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(155deg, ${accent}cc 0%, ${accentDark}ee 55%, #061f3de6 100%)`,
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.12)_0%,transparent_40%)]" />

      {/* door panels */}
      <div
        className={`pointer-events-none absolute top-16 bottom-32 w-[38%] rounded-sm border border-white/15 ${
          side === "left" ? "left-8" : "right-8"
        }`}
      />
      <div
        className={`pointer-events-none absolute top-24 bottom-40 w-[28%] rounded-sm border border-white/10 ${
          side === "left" ? "left-14" : "right-14"
        }`}
      />

      {/* centre seam handle */}
      <div
        className={`absolute top-1/2 z-20 h-16 w-2 -translate-y-1/2 rounded-full bg-white/90 shadow-[0_0_20px_rgba(0,0,0,0.25)] ${
          side === "left" ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
        }`}
      />

      <div
        className={`relative z-10 flex h-full flex-col justify-end p-6 text-left text-white sm:p-10 md:p-12 ${
          side === "left" ? "items-start" : "items-start"
        }`}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75 sm:text-xs">
          {label}
        </p>
        <h2 className="mt-2 max-w-xs text-xl font-semibold leading-tight tracking-tight sm:text-2xl md:text-3xl">
          {subtitle}
        </h2>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90">
          {cta}
          <ArrowRight
            size={16}
            className={`transition ${side === "left" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"}`}
          />
        </span>
      </div>

      {/* inner edge shadow at the seam */}
      <div
        className={`pointer-events-none absolute top-0 h-full w-8 ${
          side === "left"
            ? "right-0 bg-gradient-to-l from-black/25 to-transparent"
            : "left-0 bg-gradient-to-r from-black/25 to-transparent"
        }`}
      />
    </motion.button>
  );
}

export default function ProcessAudienceDoors({
  eyebrow,
  title,
  description,
  hint,
  candidate,
  employer,
  onSelect,
}: ProcessAudienceDoorsProps) {
  const [opening, setOpening] = useState<ProcessAudience | null>(null);
  const [hovered, setHovered] = useState<ProcessAudience | null>(null);

  function handleSelect(next: ProcessAudience) {
    if (opening) return;
    setOpening(next);
    window.setTimeout(() => onSelect(next), 920);
  }

  const isLocked = opening !== null;

  return (
    <section className="relative min-h-[calc(100svh-4.5rem)] w-full overflow-hidden bg-[#061f3d]">
      {/* revealed hallway behind the doors */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0a2a4a_0%,#061f3d_50%,#040f22_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40" />
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

      {/* centre headline — sits above doors visually */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: isLocked ? 0 : 1,
          y: isLocked ? -12 : 0,
        }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute inset-x-0 top-[12%] z-20 mx-auto max-w-2xl px-6 text-center sm:top-[14%]"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5eead4] sm:text-xs">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-[1.85rem] font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-300/90 md:text-base">
          {description}
        </p>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {hint}
        </p>
      </motion.div>

      <SlidingDoor
        side="left"
        imageKey="nurseCandidate"
        label={candidate.label}
        subtitle={candidate.subtitle}
        cta={candidate.cta}
        accent="#08a99d"
        accentDark="#087d76"
        isHovered={hovered === "candidate"}
        isOpening={opening === "candidate"}
        isOtherOpening={opening === "employer"}
        disabled={isLocked}
        onHover={(value) => setHovered(value ? "candidate" : null)}
        onSelect={() => handleSelect("candidate")}
      />

      <SlidingDoor
        side="right"
        imageKey="hospitalEmployer"
        label={employer.label}
        subtitle={employer.subtitle}
        cta={employer.cta}
        accent="#1a4a7a"
        accentDark="#08264a"
        isHovered={hovered === "employer"}
        isOpening={opening === "employer"}
        isOtherOpening={opening === "candidate"}
        disabled={isLocked}
        onHover={(value) => setHovered(value ? "employer" : null)}
        onSelect={() => handleSelect("employer")}
      />

      {/* soft glow at the seam when doors peek */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-64 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"
        animate={{ opacity: hovered && !isLocked ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />
    </section>
  );
}
