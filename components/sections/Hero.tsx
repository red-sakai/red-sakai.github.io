"use client";

import type { CSSProperties, Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import type { SiteTheme } from "@/lib/theme";
import { NavbarCapsule } from "./NavbarCapsule";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type NavItem = { label: string; href: string };

type HeroProps = {
  navItems: NavItem[];
  theme: SiteTheme;
  onThemeToggle: Dispatch<SetStateAction<SiteTheme>>;
};

export function Hero({ navItems, theme, onThemeToggle }: HeroProps) {
  const isDark = theme !== "light";

  const baseModelClass =
    "absolute inset-0 block h-full w-full transition-transform transition-opacity duration-[2000ms] ease-out";

  const ON_SCREEN = "translate-x-[0vw] translate-y-0 opacity-100";
  const OFF_NORTHEAST = "translate-x-[180vw] -translate-y-[140vh] opacity-0 pointer-events-none";
  const OFF_SOUTHWEST = "-translate-x-[180vw] translate-y-[140vh] opacity-0 pointer-events-none";
  const OFF_NORTHWEST = "-translate-x-[180vw] -translate-y-[140vh] opacity-0 pointer-events-none";

  const [sunAnim, setSunAnim] = useState(ON_SCREEN);
  const [moonAnim, setMoonAnim] = useState(OFF_SOUTHWEST);
  const [cloudAnim, setCloudAnim] = useState(OFF_NORTHWEST);

  const sunRef = useRef<HTMLElement | null>(null);
  const moonRef = useRef<HTMLElement | null>(null);
  const cloudRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const modelsRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const intro = gsap.utils.toArray<HTMLElement>("[data-hero-intro]");
    gsap.set(intro, { visibility: "visible" });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const title = SplitText.create("[data-hero-title]", { type: "words", mask: "words" });
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from("[data-hero-eyebrow]", { y: 12, autoAlpha: 0, duration: 0.5 })
      .from(title.words, { yPercent: 110, duration: 0.9, stagger: 0.07 }, "-=0.25")
      .from("[data-hero-copy]", { y: 18, autoAlpha: 0, duration: 0.8 }, "-=0.55")
      .from("[data-hero-cta] > a", { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.08, clearProps: "all" }, "-=0.5")
      .from(modelsRef.current, { autoAlpha: 0, scale: 0.9, duration: 1.4 }, 0.15);

    // The sky object drifts slower than the page as the hero scrolls out.
    gsap.to(modelsRef.current, {
      yPercent: -16,
      ease: "none",
      scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
    });
  }, { scope: heroRef });

  useEffect(() => {
    requestAnimationFrame(() => {
      if (theme === "dark") {
        setCloudAnim(OFF_NORTHWEST);
        setSunAnim(ON_SCREEN);
        setMoonAnim(OFF_SOUTHWEST);
        requestAnimationFrame(() => {
          setSunAnim(OFF_NORTHEAST);
          setMoonAnim(ON_SCREEN);
        });
      } else if (theme === "rain") {
        setSunAnim(OFF_NORTHEAST);
        setMoonAnim(OFF_SOUTHWEST);
        setCloudAnim(OFF_NORTHWEST);
        requestAnimationFrame(() => {
          setCloudAnim(ON_SCREEN);
        });
      } else {
        setMoonAnim(ON_SCREEN);
        setSunAnim(OFF_NORTHEAST);
        setCloudAnim(OFF_NORTHWEST);
        requestAnimationFrame(() => {
          setMoonAnim(OFF_SOUTHWEST);
          setSunAnim(ON_SCREEN);
        });
      }
    });
  }, [theme]);

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
    const cleanupCloud = attachPause(cloudRef.current);

    return () => {
      cleanupSun?.();
      cleanupMoon?.();
      cleanupCloud?.();
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

  // Glow is a static gradient painted behind the canvas; a CSS drop-shadow filter on an
  // auto-rotating model re-blurs the whole canvas every frame.
  const glow = (rgb: string, strength: number): CSSProperties => ({
    background: `radial-gradient(closest-side, rgba(${rgb}, ${strength}) 0%, rgba(${rgb}, ${strength * 0.4}) 45%, rgba(${rgb}, 0) 75%)`,
  });

  const sunGlowStyle = glow("255, 190, 100", isDark ? 0.65 : 0.6);
  const moonGlowStyle = glow("160, 190, 255", isDark ? 0.45 : 0.3);
  const cloudGlowStyle = theme === "rain" ? glow("120, 165, 255", 0.4) : {};

  return (
    <>
      <div className="pointer-events-none fixed left-0 right-0 top-4 z-[3000] flex w-full justify-center px-4 sm:px-10">
        <NavbarCapsule items={navItems} theme={theme} onThemeToggle={onThemeToggle} />
      </div>

      <div ref={heroRef} className="flex flex-1 flex-col gap-10 px-6 pb-12 pt-28 sm:px-10 sm:pt-32 lg:flex-row lg:items-center lg:gap-16 lg:pl-24 lg:pt-36 xl:pl-36">
        <section data-hero-intro className="flex-1 max-w-3xl space-y-4 lg:space-y-6 lg:pl-16 xl:pl-24">
          <p data-hero-eyebrow className="font-mono text-sm text-amber-700 dark:text-amber-500">Hi, I&apos;m</p>
          <h1 data-hero-title className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Jhered Miguel Republica
          </h1>
          <p
            data-hero-copy
            className="max-w-[62ch] text-lg sm:text-xl leading-relaxed dark:text-slate-100"
            style={{ color: theme === "light" ? "#000000" : "#f8fafc" }}
          >
            A Computer Engineering student with a strong interest in software development and cybersecurity. I enjoy building practical, user-focused applications using modern web technologies, while continuously sharpening my problem-solving and algorithmic skills. I’m passionate about learning, experimenting, and turning ideas into secure, efficient solutions.
          </p>

          <div data-hero-cta className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="/JHERED_MIGUEL_REPUBLICA.pdf"
              download="JHERED_MIGUEL_REPUBLICA.pdf"
              className="inline-flex items-center gap-2 rounded-md border border-amber-500 bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-amber-400 hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
            >
              Download CV
            </a>
            <a
              href="mailto:jheredmiguelrepublica14@gmail.com"
              className="inline-flex items-center gap-2 rounded-md border border-slate-500/40 px-5 py-3 text-sm font-semibold text-current transition-colors hover:border-slate-500/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
            >
              Email me
            </a>
          </div>
        </section>

        <div className="relative flex-1 min-h-[60vh] lg:min-h-[75vh]">
          <div ref={modelsRef} data-hero-intro className="absolute inset-0 pointer-events-auto">
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
            {/* @ts-expect-error Custom element is declared globally */}
            <model-viewer
              ref={cloudRef}
              src="/3d-models/cloud_lightning.glb"
              alt="Thunderstorm cloud with lightning"
              camera-controls
              disable-zoom
              auto-rotate
              interaction-prompt="none"
              exposure="1"
              shadow-intensity="0"
              className={`${baseModelClass} ${cloudAnim}`}
              style={{
                ...baseModelSurfaceStyle,
                ...cloudGlowStyle,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
