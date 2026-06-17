"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Nurses", href: "/nurses" },
  { label: "Employers", href: "/employers" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/careradar-logo.jpeg"
            alt="CareRadar Logo"
            width={54}
            height={54}
            className="h-12 w-12 rounded-full object-contain"
            priority
          />
          <div className="leading-none">
            <p className="text-xl font-semibold tracking-tight text-[#08264a]">
              Care<span className="text-[#08a99d]">Radar</span>
            </p>
            <p className="mt-1 text-[11px] tracking-[0.25em] text-slate-500">
              WE REALLY DO CARE
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-[#08a99d]"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/contact"
            className="rounded-full bg-[#08264a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#08a99d]"
          >
            Apply Now
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-[#08264a] md:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#08a99d]"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-2xl bg-[#08264a] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}