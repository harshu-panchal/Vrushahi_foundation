import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description:
    "Vrushahi Foundation is a Sangli-based NGO working in education, medical support, elder care, orphan care, women's empowerment and disaster relief across Maharashtra.",
  openGraph: {
    title: site.name,
    description: site.tagline,
    siteName: site.name,
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
