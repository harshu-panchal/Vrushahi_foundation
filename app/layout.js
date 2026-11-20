import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/content/read";

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

export async function generateMetadata() {
  const settings = await getSettings();
  const title = settings.tagline
    ? `${settings.name} — ${settings.tagline}`
    : settings.name;

  return {
    metadataBase: new URL(settings.url),
    title: {
      default: title,
      template: `%s — ${settings.name}`,
    },
    description: settings.seo?.description,
    openGraph: {
      title: settings.name,
      description: settings.seo?.ogDescription || settings.tagline,
      siteName: settings.name,
      locale: "en_IN",
      type: "website",
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
