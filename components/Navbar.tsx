"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/85 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="group flex items-center gap-3"
        >
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm transition group-hover:shadow-md">
            <Image
              src="/images/careradar-logo.jpeg"
              alt="CareRadar Logo"
              width={42}
              height={42}
              className="h-10 w-10 rounded-full object-contain"
              priority
            />
          </div>

          <div className="leading-none">
            <p className="text-xl font-semibold tracking-tight text-[#061f3d]">
              Care<span className="text-[#08a99d]">Radar</span>
            </p>
            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              We really do care
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-100 bg-white px-2 py-2 shadow-sm md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
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
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center rounded-full bg-[#08a99d] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#08a99d]/15 transition hover:bg-[#08264a]"
          >
            Apply Now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#08264a] shadow-sm md:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 shadow-xl shadow-slate-100 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
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
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="mt-2 rounded-2xl bg-[#08a99d] px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#08a99d]/15"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}