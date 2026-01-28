"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { CertificationsSection } from "./components/sections/Certifications";
import { EducationSection } from "./components/sections/Education";
import { ExperienceSection } from "./components/sections/Experience";
import { Footer } from "./components/sections/Footer";
import { Hero } from "./components/sections/Hero";
import { ProjectsSection } from "./components/sections/Projects";

function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const chunk = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  const int = Number.parseInt(chunk, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  const chunk = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  const int = Number.parseInt(chunk, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixHex(start: string, end: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(start);
  const [r2, g2, b2] = hexToRgb(end);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isDark = theme === "dark";
  const audioPlayedRef = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [isDark]);

  useEffect(() => {
    if (audioPlayedRef.current) return;
    audioPlayedRef.current = true;
    const audio = new Audio("/audio/windows_startup.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => {});
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Education", href: "/#education" },
    { label: "Experience", href: "/#experience" },
    { label: "Projects", href: "/#projects" },
    { label: "Certifications", href: "/#certifications" },
    { label: "Contact", href: "/#footer" },
  ];

  const [showPrompt, setShowPrompt] = useState(true);

  const [bgColor, setBgColor] = useState(isDark ? "#0b1220" : "#ffffff");
  const didMountRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const previousBgColorRef = useRef(bgColor);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) setShowPrompt(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Skip transitional sequence on the first render.
    if (!didMountRef.current) {
      didMountRef.current = true;
      return undefined;
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    const from = previousBgColorRef.current;
    const to = isDark ? "#0b1220" : "#ffffff";
    const duration = 550;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setBgColor(mixHex(from, to, t));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        previousBgColorRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isDark]);

  const gradientMask = `linear-gradient(90deg, ${bgColor} 0%, ${hexToRgba(bgColor, 0.92)} 45%, ${hexToRgba(bgColor, 0)} 75%)`;
  const foreground = isDark ? "#f8fafc" : "#0f172a";

  const [starField, setStarField] = useState<string>("");

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (!isDark) {
        setStarField("");
        return;
      }

      const stars = Array.from({ length: 42 }).map(() => {
        const size = (Math.random() * 0.8 + 0.3).toFixed(2);
        const blur = (Math.random() * 1.8 + 0.4).toFixed(2);
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const opacity = (0.45 + Math.random() * 0.45).toFixed(2);

        return `radial-gradient(${size}px ${size}px at ${x.toFixed(2)}% ${y.toFixed(2)}%, rgba(255,255,255,${opacity}) 0, rgba(255,255,255,0) ${blur}px)`;
      });

      setStarField(stars.join(", "));
    });

    return () => cancelAnimationFrame(raf);
  }, [isDark]);

  const starLayerStyle: CSSProperties | undefined = isDark && starField
    ? {
        backgroundImage: starField,
        backgroundSize: "100% 100%",
        mixBlendMode: "screen" as CSSProperties["mixBlendMode"],
        opacity: 0.85,
        animation: "starTwinkle 9s ease-in-out infinite alternate",
      }
    : undefined;

  return (
    <main
      className={
        "relative isolate min-h-screen w-full overflow-hidden " +
        (isDark ? "bg-[#0b1220] text-white" : "bg-white text-[#0f172a]")
      }
      style={{
        backgroundColor: bgColor,
        color: foreground,
        transition: "color 400ms ease",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{ background: gradientMask }}
      />

      {isDark && starLayerStyle?.backgroundImage && (
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={starLayerStyle}
        />
      )}

      <div className="relative z-10 flex min-h-screen flex-col">
        <Hero navItems={navItems} theme={theme} onThemeToggle={setTheme} />

        <div className="relative z-10 bg-transparent px-6 pb-16 pt-4 sm:px-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col space-y-16 lg:px-6">
            <EducationSection />

            <ExperienceSection />

            <ProjectsSection />

            <CertificationsSection />
          </div>
        </div>
      </div>

      <Footer />

      {showPrompt && (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-8 z-[2500] flex justify-center"
          aria-hidden
        >
          <div
            className="flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em]"
            style={{
              color: isDark ? "rgba(255,255,255,0.78)" : "rgba(15,23,42,0.7)",
              background: "transparent",
              boxShadow: "none",
              borderRadius: 0,
              border: "none",
              animation: "floatPulse 3.8s ease-in-out infinite",
            }}
          >
            <a href="#about" className="pointer-events-auto text-current">
              <span>Learn More</span>
              <span style={{ letterSpacing: "0.1em", fontSize: "0.9rem" }} aria-hidden>
                ↓
              </span>
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
