"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navText = {
  en: {
    tagline: "we really do care.",
    applyNow: "Apply Now",
    languageEnglish: "English",
    languageGerman: "Deutsch",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Nurses", href: "/nurses" },
      { label: "Employers", href: "/employers" },
      { label: "Process", href: "/process" },
      { label: "Contact", href: "/contact" },
    ],
  },
  de: {
    tagline: "we really do care.",
    applyNow: "Jetzt bewerben",
    languageEnglish: "English",
    languageGerman: "Deutsch",
    links: [
      { label: "Startseite", href: "/" },
      { label: "Über uns", href: "/about" },
      { label: "Für Pflegekräfte", href: "/nurses" },
      { label: "Für Arbeitgeber", href: "/employers" },
      { label: "Prozess", href: "/process" },
      { label: "Kontakt", href: "/contact" },
    ],
  },
};

function getCurrentLocale(pathname: string) {
  if (pathname.startsWith("/de")) return "de";
  return "en";
}

function removeLocaleFromPath(pathname: string) {
  if (pathname === "/en" || pathname === "/de") return "/";
  if (pathname.startsWith("/en/")) return pathname.replace("/en", "");
  if (pathname.startsWith("/de/")) return pathname.replace("/de", "");
  return pathname;
}

function getLocalizedHref(locale: string, href: string) {
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const currentLocale = getCurrentLocale(pathname);
  const currentPathWithoutLocale = removeLocaleFromPath(pathname);
  const text = navText[currentLocale];

  const englishHref = getLocalizedHref("en", currentPathWithoutLocale);
  const germanHref = getLocalizedHref("de", currentPathWithoutLocale);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/85 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:px-8 md:py-3">
        <Link
          href={`/${currentLocale}`}
          onClick={() => setIsOpen(false)}
          className="group flex min-w-0 items-center gap-2.5 md:gap-3"
        >
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm transition group-hover:shadow-md md:h-12 md:w-12">
            <Image
              src="/images/careradar-logo.jpeg"
              alt="CareRadar Logo"
              width={42}
              height={42}
              className="h-9 w-9 rounded-full object-contain md:h-10 md:w-10"
              priority
            />
          </div>

          <div className="min-w-0 leading-none">
            <p className="truncate text-lg font-semibold tracking-tight text-[#061f3d] md:text-xl">
              Care<span className="text-[#08a99d]">Radar</span>
            </p>

            <p className="mt-1.5 text-[9px] font-semibold lowercase tracking-[0.08em] text-slate-400 sm:text-[10px] md:text-[10px] md:tracking-[0.12em]">
              {text.tagline}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-100 bg-white px-2 py-2 shadow-sm md:flex">
          {text.links.map((link) => {
            const localizedHref = getLocalizedHref(currentLocale, link.href);

            const isActive =
              link.href === "/"
                ? currentPathWithoutLocale === "/"
                : currentPathWithoutLocale.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={localizedHref}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#08264a] text-white shadow-sm"
                    : "text-slate-600 hover:bg-[#f7fbff] hover:text-[#08a99d]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center rounded-full border border-slate-100 bg-white p-1 shadow-sm">
            <Link
              href={englishHref}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                currentLocale === "en"
                  ? "bg-[#08264a] text-white"
                  : "text-slate-500 hover:bg-[#f7fbff] hover:text-[#08a99d]"
              }`}
            >
              EN
            </Link>

            <Link
              href={germanHref}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                currentLocale === "de"
                  ? "bg-[#08264a] text-white"
                  : "text-slate-500 hover:bg-[#f7fbff] hover:text-[#08a99d]"
              }`}
            >
              DE
            </Link>
          </div>

          <Link
            href={`/${currentLocale}/contact`}
            className="group inline-flex items-center justify-center rounded-full bg-[#08a99d] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#08a99d]/15 transition hover:bg-[#08264a]"
          >
            {text.applyNow}
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <div className="flex items-center rounded-full border border-slate-100 bg-white p-1 shadow-sm">
            <Link
              href={englishHref}
              onClick={() => setIsOpen(false)}
              aria-label="Switch to English"
              className={`rounded-full px-2.5 py-1.5 text-[10px] font-bold transition ${
                currentLocale === "en"
                  ? "bg-[#08264a] text-white"
                  : "text-slate-500 hover:bg-[#f7fbff] hover:text-[#08a99d]"
              }`}
            >
              EN
            </Link>

            <Link
              href={germanHref}
              onClick={() => setIsOpen(false)}
              aria-label="Switch to German"
              className={`rounded-full px-2.5 py-1.5 text-[10px] font-bold transition ${
                currentLocale === "de"
                  ? "bg-[#08264a] text-white"
                  : "text-slate-500 hover:bg-[#f7fbff] hover:text-[#08a99d]"
              }`}
            >
              DE
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#08264a] shadow-sm"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 shadow-xl shadow-slate-100 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {text.links.map((link) => {
              const localizedHref = getLocalizedHref(currentLocale, link.href);

              const isActive =
                link.href === "/"
                  ? currentPathWithoutLocale === "/"
                  : currentPathWithoutLocale.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={localizedHref}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#08264a] text-white"
                      : "text-slate-700 hover:bg-[#f7fbff] hover:text-[#08a99d]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href={`/${currentLocale}/contact`}
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-2xl bg-[#08a99d] px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#08a99d]/15"
            >
              {text.applyNow}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}