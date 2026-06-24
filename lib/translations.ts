import type { Locale } from "./locale";

export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      nurses: "Nurses",
      employers: "Employers",
      process: "Process",
      contact: "Contact",
    },
    common: {
      contact: "Contact CareRadar",
      viewProcess: "View Process",
      forNurses: "For Nurses",
      forEmployers: "For Employers",
      applyNow: "Apply Now",
    },
  },
  de: {
    nav: {
      home: "Startseite",
      about: "Über uns",
      nurses: "Für Pflegekräfte",
      employers: "Für Arbeitgeber",
      process: "Prozess",
      contact: "Kontakt",
    },
    common: {
      contact: "CareRadar kontaktieren",
      viewProcess: "Prozess ansehen",
      forNurses: "Für Pflegekräfte",
      forEmployers: "Für Arbeitgeber",
      applyNow: "Jetzt bewerben",
    },
  },
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}