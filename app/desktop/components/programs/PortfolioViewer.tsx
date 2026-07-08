"use client";

import { useEffect, useState } from "react";
import { EducationSection } from "@/app/components/sections/Education";
import { ExperienceSection } from "@/app/components/sections/Experience";
import { ProjectsSection } from "@/app/components/sections/Projects";
import { CertificationsSection } from "@/app/components/sections/Certifications";
import { Footer } from "@/app/components/sections/Footer";
import PixelatedWrapper from "./PixelatedWrapper";

export default function PortfolioViewer() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <PixelatedWrapper>
      <main
        className={`portfolio-viewer${isDark ? " dark portfolio-viewer-dark" : ""}`}
        style={{
          minHeight: "100%",
          color: isDark ? "#f8fafc" : "#0f172a",
          backgroundColor: isDark ? "#0b1220" : "#ffffff",
          fontFamily: "var(--font-pixel), 'Courier New', monospace",
          fontSize: 11,
          lineHeight: 1.6,
        }}
      >
        {/* Theme toggle */}
        <div className="flex justify-end px-6 pt-4">
          <button
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            className="rounded-full border p-2 text-xs transition hover:scale-110"
            style={{
              borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(15,23,42,0.15)",
              background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.05)",
            }}
            aria-label="Toggle theme"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Hero */}
        <header className="flex flex-col items-center px-4 pb-6 pt-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Hi, I&apos;m</p>
          <h1
            className="mt-2 text-xl font-semibold leading-tight"
            style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
          >
            Jhered Miguel Republica
          </h1>
          <p
            className="mt-3 max-w-xl text-xs leading-relaxed"
            style={{ color: isDark ? "#f8fafc" : "#000000" }}
          >
            A Computer Engineering student with a strong interest in software
            development and cybersecurity. I enjoy building practical,
            user-focused applications using modern web technologies, while
            continuously sharpening my problem-solving and algorithmic skills.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <a
              href="/JHERED_MIGUEL_REPUBLICA.pdf"
              download="JHERED_MIGUEL_REPUBLICA.pdf"
              className="inline-flex items-center gap-1 rounded border border-amber-500 bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm"
            >
              View CV
            </a>
            <a
              href="mailto:jheredmiguelrepublica14@gmail.com"
              className="inline-flex items-center gap-1 rounded border border-slate-500/40 px-3 py-1.5 text-xs font-bold text-current"
            >
              Collaborate
            </a>
          </div>
        </header>

        {/* Sections */}
        <div className="px-4 pb-8 pt-2">
          <div className="mx-auto flex w-full max-w-6xl flex-col space-y-8">
            <EducationSection />
            <ExperienceSection />
            <ProjectsSection />
            <CertificationsSection />
          </div>
        </div>

        <Footer />
      </main>
    </PixelatedWrapper>
  );
}
