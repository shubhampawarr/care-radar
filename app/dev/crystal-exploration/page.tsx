import type { Metadata } from "next";
import ExplorationClient from "@/components/journey/exploration/ExplorationClient";

export const metadata: Metadata = {
  title: "Crystal system · exploration",
  robots: { index: false, follow: false },
};

/**
 * Design exploration only. Isolated under /dev so nothing here is reachable
 * from the site navigation and none of the existing routes are affected.
 */
export default function CrystalExplorationPage() {
  return <ExplorationClient />;
}
