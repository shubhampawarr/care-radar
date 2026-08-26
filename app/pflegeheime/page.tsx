import { redirect } from "next/navigation";

/**
 * Follows the existing unprefixed-route pattern (see app/employers/page.tsx),
 * but lands on /de rather than /en: the page exists only in German and is
 * addressed to operators in the German market, so sending them to an English
 * segment would be the wrong default for this one route.
 */
export default function PflegeheimeRedirect() {
  redirect("/de/pflegeheime");
}
