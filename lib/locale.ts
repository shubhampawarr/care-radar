export const locales = ["en", "de"] as const;

export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getSafeLocale(locale: string | undefined): Locale {
  if (!locale) return "en";
  return isValidLocale(locale) ? locale : "en";
}

export function localizedPath(locale: Locale, path: string) {
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}