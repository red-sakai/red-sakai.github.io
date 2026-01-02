"use client";

import { useMemo, useState } from "react";
import { NavbarCapsule } from "./components/sections/NavbarCapsule";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isDark = theme === "dark";

  const modelSrc = useMemo(
    () => (isDark ? "/3d-models/low_poly_moon.glb" : "/3d-models/low_poly_sun.glb"),
    [isDark]
  );

  const surfaceBg = isDark ? "#0b1220" : "white";
  const gradientMask = isDark
    ? "linear-gradient(90deg, #0b1220 0%, rgba(11,18,32,0.92) 45%, rgba(11,18,32,0) 75%)"
    : "linear-gradient(90deg, white 0%, rgba(255,255,255,0.92) 45%, rgba(255,255,255,0) 75%)";

  return (
    <main
      className={
        "relative isolate min-h-screen w-full overflow-hidden " +
        (isDark ? "bg-[#0b1220] text-white" : "bg-white text-[#0f172a]")
      }
    >
      {/* @ts-expect-error Custom element is declared globally */}
      <model-viewer
        src={modelSrc}
        alt="Low poly sun in motion"
        camera-controls
        auto-rotate
        disable-tap
        interaction-prompt="none"
        exposure="1"
        shadow-intensity="0"
        className="absolute inset-0 block h-full w-full"
        style={{
          background: surfaceBg,
          objectFit: "cover",
          transform: "translateX(12vw)",
          transformOrigin: "center",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{ background: gradientMask }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex w-full justify-center px-6 py-6 sm:px-10">
          <NavbarCapsule theme={theme} onThemeToggle={setTheme} />
        </div>

        <div className="flex flex-1 flex-col gap-10 px-6 pb-12 sm:px-10 lg:flex-row lg:items-center lg:gap-16">
          <section className="flex-1 max-w-3xl space-y-4 lg:space-y-6 lg:pl-8 xl:pl-12">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-600/90">Hi, I&apos;m</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Jhered Miguel Republica
            </h1>
            <p className="text-lg text-[#334155] sm:text-xl leading-relaxed">
              A computer engineering student building secure, reliable software. I love blending clean interfaces with resilient backends, exploring how design, systems, and cybersecurity intersect to create products people trust.
            </p>
          </section>

          <div className="relative flex-1 min-h-[60vh] lg:min-h-[75vh]">
            <div className="absolute inset-0" aria-hidden />
          </div>
        </div>
      </div>
    </main>
  );
}
