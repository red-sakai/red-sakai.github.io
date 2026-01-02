"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { NavbarCapsule } from "./components/sections/NavbarCapsule";

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

  const baseModelClass =
    "absolute inset-0 block h-full w-full transition-transform transition-opacity duration-[2000ms] ease-out";

  const ON_SCREEN = "translate-x-[0vw] translate-y-0 opacity-100";
  const OFF_NORTHEAST = "translate-x-[180vw] -translate-y-[140vh] opacity-0 pointer-events-none";
  const OFF_SOUTHWEST = "-translate-x-[180vw] translate-y-[140vh] opacity-0 pointer-events-none";

  const [sunAnim, setSunAnim] = useState(ON_SCREEN);
  const [moonAnim, setMoonAnim] = useState(OFF_SOUTHWEST);
  const [showPrompt, setShowPrompt] = useState(true);

  const [bgColor, setBgColor] = useState(isDark ? "#0b1220" : "#ffffff");
  const didMountRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const previousBgColorRef = useRef(bgColor);
  const sunRef = useRef<HTMLElement | null>(null);
  const moonRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isDark) {
      requestAnimationFrame(() => {
        // Stage: keep sun centered, park moon offscreen to the southwest (diagonal in).
        setSunAnim(ON_SCREEN);
        setMoonAnim(OFF_SOUTHWEST);
        requestAnimationFrame(() => {
          // Animate: sun exits toward the arrow direction (northeast), moon glides in along the diagonal.
          setSunAnim(OFF_NORTHEAST);
          setMoonAnim(ON_SCREEN);
        });
      });
    } else {
      requestAnimationFrame(() => {
        // Stage: keep moon centered, park sun offscreen to the northeast.
        setMoonAnim(ON_SCREEN);
        setSunAnim(OFF_NORTHEAST);
        requestAnimationFrame(() => {
          // Animate: moon exits toward the southwest, sun glides in along the arrow line.
          setMoonAnim(OFF_SOUTHWEST);
          setSunAnim(ON_SCREEN);
        });
      });
    }
  }, [isDark]);

  useEffect(() => {
    const attachPause = (el: (HTMLElement & { autoRotate?: boolean }) | null) => {
      if (!el) return () => {};

      const handleStart = () => {
        el.autoRotate = false;
      };

      const handleEnd = () => {
        el.autoRotate = true;
      };

      el.addEventListener("pointerdown", handleStart);
      el.addEventListener("pointerup", handleEnd);
      el.addEventListener("pointerleave", handleEnd);
      el.addEventListener("touchstart", handleStart);
      el.addEventListener("touchend", handleEnd);

      return () => {
        el.removeEventListener("pointerdown", handleStart);
        el.removeEventListener("pointerup", handleEnd);
        el.removeEventListener("pointerleave", handleEnd);
        el.removeEventListener("touchstart", handleStart);
        el.removeEventListener("touchend", handleEnd);
      };
    };

    const cleanupSun = attachPause(sunRef.current);
    const cleanupMoon = attachPause(moonRef.current);

    return () => {
      cleanupSun?.();
      cleanupMoon?.();
    };
  }, []);

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

  const surfaceBg = "transparent";
  const gradientMask = `linear-gradient(90deg, ${bgColor} 0%, ${hexToRgba(
    bgColor,
    0.92
  )} 45%, ${hexToRgba(bgColor, 0)} 75%)`;
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

  const sunGlowStyle = isDark
    ? {
        filter: "drop-shadow(0 0 36px rgba(255, 198, 120, 0.95)) drop-shadow(0 0 96px rgba(255, 170, 70, 0.55))",
      }
    : {
        filter: "drop-shadow(0 0 28px rgba(255, 200, 120, 0.9)) drop-shadow(0 0 72px rgba(255, 190, 120, 0.45))",
      };

  const moonGlowStyle = isDark
    ? {
        filter: "drop-shadow(0 0 28px rgba(185, 210, 255, 0.95)) drop-shadow(0 0 80px rgba(140, 175, 255, 0.55))",
      }
    : {
        filter: "drop-shadow(0 0 18px rgba(175, 195, 230, 0.9)) drop-shadow(0 0 44px rgba(160, 185, 225, 0.4))",
      };

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
        <div className="flex w-full justify-center px-6 py-6 sm:px-10">
          <NavbarCapsule theme={theme} onThemeToggle={setTheme} />
        </div>

        <div className="flex flex-1 flex-col gap-10 px-6 pb-12 sm:px-10 lg:flex-row lg:items-center lg:gap-16 lg:pl-24 xl:pl-36">
          <section className="flex-1 max-w-3xl space-y-4 lg:space-y-6 lg:pl-16 xl:pl-24">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-600/90">Hi, I&apos;m</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Jhered Miguel Republica
            </h1>
            <p
              className="text-lg sm:text-xl leading-relaxed text-justify dark:text-slate-100"
              style={{ color: isDark ? "#f8fafc" : "#000000" }}
            >
              A Computer Engineering student with a strong interest in software development and cybersecurity. I enjoy building practical, user-focused applications using modern web technologies, while continuously sharpening my problem-solving and algorithmic skills. I’m passionate about learning, experimenting, and turning ideas into secure, efficient solutions.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/REPUBLICA-CV.pdf"
                download="REPUBLICA-CV.pdf"
                className="inline-flex items-center gap-2 rounded-full border border-amber-500 bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-md backdrop-blur-sm transition hover:-translate-y-[1px] hover:bg-amber-400 hover:border-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
              >
                View Curriculum Vitae
              </a>
              <a
                href="mailto:jhered@example.com"
                className="inline-flex items-center gap-2 rounded-full border border-slate-500/40 px-5 py-3 text-sm font-semibold text-current backdrop-blur-sm transition hover:-translate-y-[1px] hover:border-slate-500/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
              >
                Let&apos;s Collaborate
              </a>
            </div>
          </section>

          <div className="relative flex-1 min-h-[60vh] lg:min-h-[75vh]">
            <div className="absolute inset-0 translate-x-[0vw] sm:translate-x-[0vw] lg:translate-x-[0vw] pointer-events-auto">
              {/* @ts-expect-error Custom element is declared globally */}
              <model-viewer
                ref={sunRef}
                src="/3d-models/low_poly_sun.glb"
                alt="Low poly sun in motion"
                camera-controls
                auto-rotate
                interaction-prompt="none"
                exposure="1"
                shadow-intensity="0"
                className={`${baseModelClass} ${sunAnim}`}
                style={{
                  background: surfaceBg,
                  objectFit: "cover",
                  cursor: "grab",
                  ...sunGlowStyle,
                }}
              />

              {/* @ts-expect-error Custom element is declared globally */}
              <model-viewer
                ref={moonRef}
                src="/3d-models/low_poly_moon.glb"
                alt="Low poly moon in motion"
                camera-controls
                auto-rotate
                interaction-prompt="none"
                exposure="1"
                shadow-intensity="0"
                className={`${baseModelClass} ${moonAnim}`}
                style={{
                  background: surfaceBg,
                  objectFit: "cover",
                  cursor: "grab",
                  ...moonGlowStyle,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {showPrompt && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
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
            <span>Learn More</span>
            <span style={{ letterSpacing: "0.1em", fontSize: "0.9rem" }} aria-hidden>
              ↓
            </span>
          </div>
        </div>
      )}
    </main>
  );
}
