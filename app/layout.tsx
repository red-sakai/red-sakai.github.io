import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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

export const metadata: Metadata = {
  title: "Jhered | Portfolio",
  description: "My Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <Script
          src="https://unpkg.com/@google/model-viewer@4/dist/model-viewer.min.js"
          type="module"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
