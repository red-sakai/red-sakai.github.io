"use client";

import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import type { SiteTheme } from "@/lib/theme";
import { mulberry32 } from "@/lib/rand";

function bladePath(seed: number, maxPeak: number, step: number): string {
  const rng = mulberry32(seed);
  let d = "M0 60";
  for (let x = 0; x < 1200; x += step) {
    const peak = 14 + rng() * maxPeak;
    const tipX = x + step * (0.3 + rng() * 0.4);
    const bend = tipX + (rng() * 8 - 4);
    d += ` Q${bend.toFixed(1)} ${(60 - peak * 1.3).toFixed(1)} ${tipX.toFixed(1)} ${(60 - peak).toFixed(1)}`;
    d += ` Q${(tipX + 3).toFixed(1)} ${(60 - peak * 0.5).toFixed(1)} ${(x + step).toFixed(0)} 60`;
  }
  return `${d} L1200 60 Z`;
}

export function Footer({ theme = "light" }: { theme?: SiteTheme }) {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();
  const backBlades = useMemo(() => bladePath(2025, 40, 17), []);
  const frontBlades = useMemo(() => bladePath(7777, 26, 13), []);
  const lampOn = theme !== "light";
  const rainFlickerClass = theme === "rain" ? "lamp-flicker" : "";

  const [prevTheme, setPrevTheme] = useState(theme);
  const [phase, setPhase] = useState<"steady" | "ignite" | "extinguish">("steady");

  if (prevTheme !== theme) {
    setPrevTheme(theme);
    const wasOn = prevTheme !== "light";
    const isOn = theme !== "light";
    setPhase(wasOn === isOn ? "steady" : isOn ? "ignite" : "extinguish");
  }

  useEffect(() => {
    if (phase === "steady") return undefined;
    const timer = window.setTimeout(() => setPhase("steady"), phase === "ignite" ? 1100 : 950);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const phaseClass =
    phase === "ignite" ? "lamp-ignite" : phase === "extinguish" ? "lamp-extinguish" : "";
  const glowStyle = {
    opacity: lampOn ? 1 : 0,
    transition: "opacity 700ms ease",
  } as const;

  return (
    <footer
      id="footer"
      ref={ref}
      className={
        "relative z-10 mt-6 scroll-mt-28 transition-all duration-700 will-change-transform " +
        (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-4 top-[-224px] z-20 hidden md:left-10 md:block lg:left-16"
      >
        <svg width="120" height="258" viewBox="0 0 120 258">
          <defs>
            <linearGradient id="lampMetal" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#4a5058" />
              <stop offset="0.55" stopColor="#171b21" />
              <stop offset="1" stopColor="#333a44" />
            </linearGradient>
            <radialGradient id="lampHalo" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="rgba(255,222,150,0.42)" />
              <stop offset="0.5" stopColor="rgba(255,202,100,0.15)" />
              <stop offset="0.82" stopColor="rgba(255,200,90,0)" />
              <stop offset="1" stopColor="rgba(255,200,90,0)" />
            </radialGradient>
            <linearGradient id="lampCone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(255,214,130,0.2)" />
              <stop offset="1" stopColor="rgba(255,214,130,0.02)" />
            </linearGradient>
            <linearGradient id="glassLit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff7d6" />
              <stop offset="1" stopColor="#ffc863" />
            </linearGradient>
            <linearGradient id="glassDim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#49525f" />
              <stop offset="1" stopColor="#242a35" />
            </linearGradient>
          </defs>

          <g style={glowStyle} className={phaseClass}>
            <g className={rainFlickerClass}>
              <polygon points="48,134 72,134 106,256 14,256" fill="url(#lampCone)" />
              <circle cx="60" cy="112" r="54" fill="url(#lampHalo)" />
            </g>
          </g>

          <rect x="42" y="250" width="36" height="8" rx="3" fill="url(#lampMetal)" />
          <rect x="50" y="243" width="20" height="9" rx="2" fill="url(#lampMetal)" />
          <rect x="56" y="140" width="8" height="105" fill="url(#lampMetal)" />
          <rect x="53" y="164" width="14" height="4" rx="2" fill="url(#lampMetal)" />
          <rect x="53" y="224" width="14" height="4" rx="2" fill="url(#lampMetal)" />
          <rect x="48" y="132" width="24" height="5" rx="2" fill="url(#lampMetal)" />
          <rect x="44" y="100" width="3.5" height="33" fill="url(#lampMetal)" />
          <rect x="72.5" y="100" width="3.5" height="33" fill="url(#lampMetal)" />
          <path d="M45 100 L75 100 L70 133 L50 133 Z" fill="url(#glassDim)" />
          <path d="M38 96 Q60 56 82 96 Z" fill="url(#lampMetal)" />
          <rect x="40" y="94" width="40" height="6" rx="2" fill="url(#lampMetal)" />
          <circle cx="60" cy="58" r="4.5" fill="url(#lampMetal)" />

          <g style={glowStyle} className={phaseClass}>
            <g className={rainFlickerClass}>
              <path d="M45 100 L75 100 L70 133 L50 133 Z" fill="url(#glassLit)" />
              <circle cx="60" cy="116" r="6" fill="#fffbe6" opacity="0.95" />
            </g>
          </g>
        </svg>
      </div>

      <div
        aria-hidden
        className="footer-bench top-[-56px] left-[135px] hidden md:left-[172px] md:block lg:left-[212px] z-20"
      >
        <svg width="140" height="90" viewBox="0 0 140 90">
          <ellipse cx="70" cy="86" rx="58" ry="4" fill="rgba(0,0,0,0.18)" />
          <rect x="20" y="52" width="7" height="34" rx="2" fill="#23272e" />
          <rect x="113" y="52" width="7" height="34" rx="2" fill="#23272e" />
          <rect x="16" y="10" width="6" height="36" rx="2" fill="#23272e" />
          <rect x="118" y="10" width="6" height="36" rx="2" fill="#23272e" />
          <rect x="14" y="12" width="112" height="5.5" rx="2.5" fill="var(--bench-wood)" />
          <rect x="14" y="21" width="112" height="5.5" rx="2.5" fill="var(--bench-wood-dark)" />
          <rect x="14" y="30" width="112" height="5.5" rx="2.5" fill="var(--bench-wood)" />
          <rect x="12" y="38" width="116" height="6.5" rx="3" fill="var(--bench-wood)" />
          <rect x="12" y="47" width="116" height="6.5" rx="3" fill="var(--bench-wood-dark)" />
        </svg>
      </div>

      <div className="footer-grass" aria-hidden>
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path d={backBlades} fill="var(--grass-back)" />
          <path d={frontBlades} fill="var(--grass-front)" />
        </svg>
      </div>

      <div className="footer-ground">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10 lg:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-lime-300">Contact</p>
              <h2 className="text-2xl font-semibold sm:text-3xl text-amber-50">Let&apos;s collaborate</h2>
              <p className="text-sm leading-relaxed text-amber-100/85">
                Need a resilient prototype, a security-minded review, or a teammate who documents as they build? I would love to help.
              </p>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <div className="flex flex-wrap items-center gap-3">
                <IconLink
                  href="mailto:jheredmiguelrepublica14@gmail.com"
                  label="Email"
                  icon={(className) => (
                    <svg className={className} viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor" fill="none" aria-hidden>
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m4 6 8 7 8-7" />
                    </svg>
                  )}
                />
                <IconLink
                  href="https://github.com/red-sakai"
                  label="GitHub"
                  newTab
                  icon={(className) => (
                    <svg className={className} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" aria-hidden>
                      <path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18 3.77a5.07 5.07 0 0 0-.09-3.77S16.73-.35 13 2a13.38 13.38 0 0 0-4 0C5.27-.35 4.09.08 4.09.08A5.07 5.07 0 0 0 4 3.77 5.44 5.44 0 0 0 2.5 7.52c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 15.13V19" />
                    </svg>
                  )}
                />
                <IconLink
                  href="https://www.linkedin.com/in/jrepublica/"
                  label="LinkedIn"
                  newTab
                  icon={(className) => (
                    <svg className={className} viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor" fill="none" aria-hidden>
                      <rect x="3" y="3" width="18" height="18" rx="2.2" />
                      <path d="M8 17v-6" />
                      <circle cx="8" cy="8" r="1" />
                      <path d="M12 17v-3.5a2.5 2.5 0 0 1 5 0V17" />
                    </svg>
                  )}
                />
              </div>

              <div className="flex flex-col gap-2 text-amber-50/90">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">Location</span>
                  <span>Manila, PH</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">Email</span>
                  <span className="text-amber-50">jheredmiguelrepublica14@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-white/15 pt-6 text-sm text-amber-100/80">
            <span>Always open to collaborate on secure builds, prototypes, and teaching.</span>
            <span className="text-xs text-amber-100/55">(c) {new Date().getFullYear()} Jhered Miguel Republica</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

type IconLinkProps = {
  href: string;
  label: string;
  newTab?: boolean;
  icon: (className: string) => JSX.Element;
};

function IconLink({ href, label, newTab = false, icon }: IconLinkProps) {
  return (
    <a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noreferrer" : undefined}
      className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-amber-50 shadow-sm backdrop-blur-sm transition hover:-translate-y-[2px] hover:border-lime-300 hover:text-lime-200"
      aria-label={label}
    >
      {icon("h-5 w-5")}
      <span className="sr-only">{label}</span>
    </a>
  );
}
