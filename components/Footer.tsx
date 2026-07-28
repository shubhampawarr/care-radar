"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const footerText = {
  en: {
    tagline: "we really do care.",
    description:
      "CareRadar supports nurses and healthcare employers through a structured, transparent, and care-led international recruitment journey.",
    explore: "Explore",
    contact: "Contact",
    phone: "Phone / WhatsApp",
    generalEmail: "General Email",
    rights: "All rights reserved.",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Process", href: "/process" },
      { label: "Contact", href: "/contact" },
      { label: "Legal", href: "/impressum" },
      { label: "Privacy Policy", href: "/datenschutz" },
    ],
    bottomLinks: [
      { label: "Legal", href: "/impressum" },
      { label: "Privacy Policy", href: "/datenschutz" },
    ],
  },
  de: {
    tagline: "we really do care.",
    description:
      "CareRadar begleitet Pflegekräfte und Arbeitgeber im Gesundheitswesen durch einen strukturierten, transparenten und fürsorglichen internationalen Rekrutierungsprozess.",
    explore: "Entdecken",
    contact: "Kontakt",
    phone: "Telefon / WhatsApp",
    generalEmail: "Allgemeine E-Mail",
    rights: "Alle Rechte vorbehalten.",
    links: [
      { label: "Startseite", href: "/" },
      { label: "Über uns", href: "/about" },
      { label: "Prozess", href: "/process" },
      { label: "Kontakt", href: "/contact" },
      { label: "Impressum", href: "/impressum" },
      { label: "Datenschutzerklärung", href: "/datenschutz" },
    ],
    bottomLinks: [
      { label: "Impressum", href: "/impressum" },
      { label: "Datenschutzerklärung", href: "/datenschutz" },
    ],
  },
} as const;

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
    <footer className="w-full bg-[#061f3d] text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 md:grid-cols-[1.15fr_0.75fr_1fr] md:gap-8 md:py-9 lg:px-10">
        <div>
          <Link
            href={`/${currentLocale}`}
            className="inline-flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
              <Image
                src="/images/careradar-logo.jpeg"
                alt="CareRadar Logo"
                width={32}
                height={32}
                className="h-7 w-7 rounded-full object-contain"
              />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">
                Care<span className="text-[#10c4b6]">Radar</span>
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {text.tagline}
              </p>
            </div>
          </Link>
          <p className="mt-3 max-w-sm text-xs leading-5 text-slate-400">
            {text.description}
          </p>
        </div>

        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#10c4b6]">
            {text.explore}
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {text.links.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={getLocalizedHref(currentLocale, link.href)}
                className="text-xs text-slate-300 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#10c4b6]">
            {text.contact}
          </h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-xs font-semibold text-white">Akshat Gupta</p>
              <a
                href="mailto:akshat.gupta@careradar.de"
                className="mt-0.5 block break-all text-[11px] text-slate-400 transition hover:text-white"
              >
                akshat.gupta@careradar.de
              </a>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-xs font-semibold text-white">Ron Rüdiger</p>
              <a
                href="mailto:ron.ruediger@careradar.de"
                className="mt-0.5 block break-all text-[11px] text-slate-400 transition hover:text-white"
              >
                ron.ruediger@careradar.de
              </a>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-xs font-semibold text-white">{text.phone}</p>
              <a
                href="tel:+4917631457123"
                className="mt-0.5 block text-[11px] text-slate-400 transition hover:text-white"
              >
                +49 176 31457123
              </a>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-xs font-semibold text-white">
                {text.generalEmail}
              </p>
              <a
                href="mailto:info@careradar.de"
                className="mt-0.5 block break-all text-[11px] text-slate-400 transition hover:text-white"
              >
                info@careradar.de
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-3 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>
            © {new Date().getFullYear()} CareRadar. {text.rights}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {text.bottomLinks.map((link) => (
              <Link
                key={`${link.label}-${link.href}`}
                href={getLocalizedHref(currentLocale, link.href)}
                className="transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
