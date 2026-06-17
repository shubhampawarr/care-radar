import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "For Nurses", href: "/nurses" },
  { label: "For Employers", href: "/employers" },
  { label: "Recruitment Process", href: "/process" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-[#061f3d] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.3fr_0.8fr_1fr] md:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/careradar-logo.jpeg"
              alt="CareRadar Logo"
              width={58}
              height={58}
              className="h-14 w-14 rounded-full bg-white object-contain"
            />
            <div>
              <p className="text-2xl font-semibold">
                Care<span className="text-[#10c4b6]">Radar</span>
              </p>
              <p className="mt-1 text-xs tracking-[0.25em] text-slate-300">
                WE REALLY DO CARE
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
            CareRadar supports qualified nurses and healthcare employers through
            a structured, transparent, and care-led international recruitment
            journey.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#10c4b6]">
            Quick Links
          </h3>

          <div className="mt-5 flex flex-col gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-300 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#10c4b6]">
            Contact
          </h3>

          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <p className="flex gap-3">
              <Phone size={18} className="mt-0.5 text-[#10c4b6]" />
              <span>Phone / WhatsApp details to be added</span>
            </p>

            <p className="flex gap-3">
              <Mail size={18} className="mt-0.5 text-[#10c4b6]" />
              <span>Email address to be added</span>
            </p>

            <p className="flex gap-3">
              <MapPin size={18} className="mt-0.5 text-[#10c4b6]" />
              <span>Office address to be added</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} CareRadar. All rights reserved.
      </div>
    </footer>
  );
}