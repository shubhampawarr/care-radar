import type { Metadata } from "next";
import ContactPageClient from "@/components/ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact CareRadar for international nurse recruitment enquiries, nurse applications, and healthcare employer hiring support.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}