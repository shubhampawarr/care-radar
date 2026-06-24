"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

const footerText = {
  en: {
    tagline: "We really do care",
    description:
      "CareRadar supports nurses and healthcare employers through a structured, transparent, and care-led international recruitment journey.",
    explore: "Explore",
    contact: "Contact",
    phone: "Phone / WhatsApp",
    toBeAdded: "To be added",
    rights: "All rights reserved.",
    links: [
      { label: "About", href: "/about" },
      { label: "Nurses", href: "/nurses" },
      { label: "Employers", href: "/employers" },
      { label: "Process", href: "/process" },
      { label: "Contact", href: "/contact" },
    ],
    bottomLinks: [
      { label: "About", href: "/about" },
      { label: "Process", href: "/process" },
      { label: "Contact", href: "/contact" },
    ],
  },
  de: {
    tagline: "We really do care",
    description:
      "CareRadar begleitet Pflegekräfte und Arbeitgeber im Gesundheitswesen durch einen strukturierten, transparenten und fürsorglichen internationalen Rekrutierungsprozess.",
    explore: "Entdecken",
    contact: "Kontakt",
    phone: "Telefon / WhatsApp",
    toBeAdded: "Wird ergänzt",
    rights: "Alle Rechte vorbehalten.",
    links: [
      { label: "Über uns", href: "/about" },
      { label: "Für Pflegekräfte", href: "/nurses" },
      { label: "Für Arbeitgeber", href: "/employers" },
      { label: "Prozess", href: "/process" },
      { label: "Kontakt", href: "/contact" },
    ],
    bottomLinks: [
      { label: "Über uns", href: "/about" },
      { label: "Prozess", href: "/process" },
      { label: "Kontakt", href: "/contact" },
    ],
  },
};

function getCurrentLocale(pathname: string) {
  if (pathname.startsWith("/de")) return "de";
  return "en";
}

function getLocalizedHref(locale: string, href: string) {
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

export default function Footer() {
  const pathname = usePathname();
  const currentLocale = getCurrentLocale(pathname);
  const text = footerText[currentLocale];

  return (
    <footer className="bg-white px-4 pb-4 md:px-8 md:pb-5">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.5rem] bg-[#061f3d] text-white shadow-xl shadow-slate-200 md:rounded-[2rem]">
        <div className="grid gap-7 px-5 py-7 md:grid-cols-[1.2fr_0.8fr_1fr] md:gap-10 md:px-10 md:py-12">
          <div>
            <Link
              href={`/${currentLocale}`}
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white md:h-14 md:w-14">
                <Image
                  src="/images/careradar-logo.jpeg"
                  alt="CareRadar Logo"
                  width={46}
                  height={46}
                  className="h-9 w-9 rounded-full object-contain md:h-11 md:w-11"
                />
              </div>

              <div>
                <p className="text-xl font-semibold tracking-tight md:text-2xl">
                  Care<span className="text-[#10c4b6]">Radar</span>
                </p>
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-400 md:text-[10px]">
                  {text.tagline}
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300 md:mt-6 md:leading-7">
              {text.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#10c4b6]">
              {text.explore}
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-2 md:flex md:flex-col md:gap-3">
              {text.links.map((link) => (
                <Link
                  key={link.href}
                  href={getLocalizedHref(currentLocale, link.href)}
                  className="group inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:text-white md:bg-transparent md:px-0 md:py-0"
                >
                  <span>{link.label}</span>
                  <ArrowRight
                    size={14}
                    className="hidden opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100 md:block"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#10c4b6]">
              {text.contact}
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4">
                <p className="font-semibold text-white">Akshat Gupta</p>
                <a
                  href="mailto:akshat.gupta@careradar.de"
                  className="mt-1 inline-block break-all text-xs text-slate-400 transition hover:text-white md:text-sm"
                >
                  akshat.gupta@careradar.de
                </a>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4">
                <p className="font-semibold text-white">Ron Rüdiger</p>
                <a
                  href="mailto:ron.ruediger@careradar.de"
                  className="mt-1 inline-block break-all text-xs text-slate-400 transition hover:text-white md:text-sm"
                >
                  ron.ruediger@careradar.de
                </a>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4">
                <p className="font-semibold text-white">{text.phone}</p>
                <p className="mt-1 text-xs text-slate-400 md:text-sm">
                  {text.toBeAdded}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-4 md:px-10 md:py-5">
          <div className="flex flex-col gap-2 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} CareRadar. {text.rights}
            </p>

            <div className="flex gap-4">
              {text.bottomLinks.map((link) => (
                <Link
                  key={link.href}
                  href={getLocalizedHref(currentLocale, link.href)}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}