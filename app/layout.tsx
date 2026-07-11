import type { Metadata } from "next";
import { Sora, JetBrains_Mono, Press_Start_2P } from "next/font/google";
import Script from "next/script";
import { LenisProvider } from "@/components/providers/LenisProvider";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const siteUrl = "https://jhered.me";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jhered Miguel Republica | Portfolio",
    template: "%s | Jhered Miguel Republica",
  },
  description:
    "Jhered Miguel Republica portfolio featuring projects, experience, certifications, and contact details.",
  keywords: [
    "Jhered",
    "Jhered Republica",
    "Jhered Miguel Republica",
    "portfolio",
    "software engineer",
    "web developer",
    "projects",
    "experience",
    "certifications",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jhered Miguel Republica | Portfolio",
    description:
      "Jhered Miguel Republica portfolio featuring projects, experience, certifications, and contact details.",
    url: siteUrl,
    siteName: "Jhered Miguel Republica",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jhered Miguel Republica | Portfolio",
    description:
      "Jhered Miguel Republica portfolio featuring projects, experience, certifications, and contact details.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${jetBrainsMono.variable} ${pressStart2P.variable} antialiased`}
      >
        <Script
          src="https://unpkg.com/@google/model-viewer@4/dist/model-viewer.min.js"
          type="module"
          strategy="afterInteractive"
        />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
