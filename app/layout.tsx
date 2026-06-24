import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "CareRadar | International Nurse Recruitment",
    template: "%s | CareRadar",
  },
  description:
    "CareRadar helps qualified nurses explore international healthcare opportunities and supports employers with ethical nurse recruitment solutions.",
  icons: {
    icon: "/images/careradar-logo.jpeg",
    shortcut: "/images/careradar-logo.jpeg",
    apple: "/images/careradar-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}