"use client";

import type { CSSProperties, Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import { NavbarCapsule } from "./NavbarCapsule";

type NavItem = { label: string; href: string };

type HeroProps = {
  navItems: NavItem[];
  theme: "light" | "dark";
  onThemeToggle: Dispatch<SetStateAction<"light" | "dark">>;
};

export function Hero({ navItems, theme, onThemeToggle }: HeroProps) {
  const isDark = theme === "dark";

  const baseModelClass =
    "absolute inset-0 block h-full w-full transition-transform transition-opacity duration-[2000ms] ease-out";

  const ON_SCREEN = "translate-x-[0vw] translate-y-0 opacity-100";
  const OFF_NORTHEAST = "translate-x-[180vw] -translate-y-[140vh] opacity-0 pointer-events-none";
  const OFF_SOUTHWEST = "-translate-x-[180vw] translate-y-[140vh] opacity-0 pointer-events-none";

  const [sunAnim, setSunAnim] = useState(ON_SCREEN);
  const [moonAnim, setMoonAnim] = useState(OFF_SOUTHWEST);

  const sunRef = useRef<HTMLElement | null>(null);
  const moonRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isDark) {
      requestAnimationFrame(() => {
        setSunAnim(ON_SCREEN);
        setMoonAnim(OFF_SOUTHWEST);
        requestAnimationFrame(() => {
          setSunAnim(OFF_NORTHEAST);
          setMoonAnim(ON_SCREEN);
        });
      });
    } else {
      requestAnimationFrame(() => {
        setMoonAnim(ON_SCREEN);
        setSunAnim(OFF_NORTHEAST);
        requestAnimationFrame(() => {
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

  const surfaceBg = "transparent";

  const baseModelSurfaceStyle: CSSProperties & {
    "--progress-bar-color"?: string;
    "--progress-bar-height"?: string;
    "--progress-mask"?: string;
  } = {
    background: surfaceBg,
    objectFit: "cover",
    cursor: "grab",
    "--progress-bar-color": "transparent",
    "--progress-bar-height": "0px",
    "--progress-mask": "none",
  };

  const sunGlowStyle: CSSProperties = isDark
    ? {
        filter: "drop-shadow(0 0 36px rgba(255, 198, 120, 0.95)) drop-shadow(0 0 96px rgba(255, 170, 70, 0.55))",
      }
    : {
        filter: "drop-shadow(0 0 28px rgba(255, 200, 120, 0.9)) drop-shadow(0 0 72px rgba(255, 190, 120, 0.45))",
      };

  const moonGlowStyle: CSSProperties = isDark
    ? {
        filter: "drop-shadow(0 0 28px rgba(185, 210, 255, 0.95)) drop-shadow(0 0 80px rgba(140, 175, 255, 0.55))",
      }
    : {
        filter: "drop-shadow(0 0 18px rgba(175, 195, 230, 0.9)) drop-shadow(0 0 44px rgba(160, 185, 225, 0.4))",
      };

  return (
    <>
      <div className="pointer-events-none fixed left-0 right-0 top-4 z-[3000] flex w-full justify-center px-4 sm:px-10">
        <div
          className="pointer-events-auto rounded-full border px-2 py-1 shadow-lg shadow-black/5 backdrop-blur-xl dark:shadow-black/30"
          style={{
            background: isDark ? "rgba(11, 18, 32, 0.78)" : "rgba(255, 255, 255, 0.94)",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        >
          <NavbarCapsule items={navItems} theme={theme} onThemeToggle={onThemeToggle} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-10 px-6 pb-12 pt-28 sm:px-10 sm:pt-32 lg:flex-row lg:items-center lg:gap-16 lg:pl-24 lg:pt-36 xl:pl-36">
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
              href="/JHERED_MIGUEL_REPUBLICA.pdf"
              download="JHERED_MIGUEL_REPUBLICA.pdf"
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
              disable-zoom
              auto-rotate
              interaction-prompt="none"
              exposure="1"
              shadow-intensity="0"
              className={`${baseModelClass} ${sunAnim}`}
              style={{
                ...baseModelSurfaceStyle,
                ...sunGlowStyle,
              }}
            />

            {/* @ts-expect-error Custom element is declared globally */}
            <model-viewer
              ref={moonRef}
              src="/3d-models/low_poly_moon.glb"
              alt="Low poly moon in motion"
              camera-controls
              disable-zoom
              auto-rotate
              interaction-prompt="none"
              exposure="1"
              shadow-intensity="0"
              className={`${baseModelClass} ${moonAnim}`}
              style={{
                ...baseModelSurfaceStyle,
                ...moonGlowStyle,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
