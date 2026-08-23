"use client";

import type { CSSProperties } from "react";
import { useMemo } from "react";
import type { SiteTheme } from "@/lib/theme";
import { mulberry32 } from "@/lib/rand";

type FlareStar = {
  id: number;
  x: number;
  y: number;
  dur: number;
  delay: number;
};

type NightSky = {
  far: string;
  mid: string;
  near: string;
  nebula: string;
  band: string;
  flares: FlareStar[];
};

type MoteSpec = {
  id: number;
  left: string;
  top: string;
  size: number;
  dur: number;
  delay: number;
  sway: string;
};

type CloudSpec = {
  id: number;
  top: string;
  scale: number;
  dur: number;
  delay: number;
  opacity: number;
  reverse?: boolean;
};

type MeteorSpec = {
  id: number;
  top: string;
  left: string;
  len: number;
  dur: number;
  delay: number;
  angle: number;
  dx: string;
  dy: string;
};

type RainDrop = {
  id: number;
  left: string;
  top: string;
  width: number;
  len: number;
  dur: number;
  delay: number;
  drift: string;
  rot: string;
  opacity: number;
};

const STAR_TINTS = ["255,255,255", "214,232,255", "255,238,210", "199,224,255"];

function buildGradients(
  rng: () => number,
  count: number,
  minSize: number,
  maxSize: number,
  minAlpha: number,
  maxAlpha: number
): string {
  const list: string[] = [];
  for (let i = 0; i < count; i++) {
    const size = minSize + rng() * (maxSize - minSize);
    const soft = size * 2.4;
    const x = rng() * 100;
    const y = rng() * 100;
    const alpha = minAlpha + rng() * (maxAlpha - minAlpha);
    const tint = STAR_TINTS[Math.floor(rng() * STAR_TINTS.length)];
    list.push(
      `radial-gradient(${size.toFixed(2)}px ${size.toFixed(2)}px at ${x.toFixed(2)}% ${y.toFixed(2)}%, rgba(${tint},${alpha.toFixed(2)}) 0, rgba(${tint},0) ${soft.toFixed(2)}px)`
    );
  }
  return list.join(", ");
}

function buildNight(): NightSky {
  const farRng = mulberry32(90210);
  const midRng = mulberry32(424242);
  const nearRng = mulberry32(1337);
  const flareRng = mulberry32(777);

  return {
    far: buildGradients(farRng, 100, 0.4, 1.1, 0.4, 0.85),
    mid: buildGradients(midRng, 60, 0.9, 1.8, 0.65, 1),
    near: buildGradients(nearRng, 20, 1.6, 2.7, 0.85, 1),
    nebula: [
      "radial-gradient(52rem 30rem at 78% 10%, rgba(99,102,241,0.11), transparent 68%)",
      "radial-gradient(44rem 26rem at 16% 32%, rgba(56,189,248,0.08), transparent 66%)",
      "radial-gradient(40rem 24rem at 55% 62%, rgba(168,85,247,0.06), transparent 64%)",
      "radial-gradient(130% 95% at 50% 40%, transparent 56%, rgba(2,6,23,0.55) 100%)",
    ].join(", "),
    band:
      "linear-gradient(112deg, transparent 38%, rgba(148,163,184,0.05) 47%, rgba(226,232,240,0.09) 52%, rgba(148,163,184,0.05) 57%, transparent 67%)",
    flares: Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: 6 + flareRng() * 88,
      y: 5 + flareRng() * 58,
      dur: 2.8 + flareRng() * 2.6,
      delay: flareRng() * 3,
    })),
  };
}

function buildDayMotes(): MoteSpec[] {
  const rng = mulberry32(2024);
  return Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${(5 + rng() * 90).toFixed(2)}%`,
    top: `${(rng() * 95).toFixed(2)}%`,
    size: Math.round(3 + rng() * 3),
    dur: 11 + rng() * 9,
    delay: rng() * 12,
    sway: `${Math.round(rng() * 44 - 22)}px`,
  }));
}

function buildRain(): RainDrop[] {
  const rng = mulberry32(60606);
  return Array.from({ length: 110 }, (_, i) => ({
    id: i,
    left: `${(-2 + rng() * 104).toFixed(2)}%`,
    top: `${(rng() * 88).toFixed(2)}%`,
    width: rng() > 0.78 ? 3 : 2,
    len: Math.round(72 + rng() * 82),
    dur: 0.65 + rng() * 0.6,
    delay: -(rng() * 1.4),
    drift: `${(-(3 + rng() * 6)).toFixed(1)}vw`,
    rot: `${(-(7 + rng() * 6)).toFixed(1)}deg`,
    opacity: 0.4 + rng() * 0.35,
  }));
}

const CLOUDS: CloudSpec[] = [
  { id: 0, top: "5%", scale: 1.35, dur: 120, delay: -30, opacity: 0.9 },
  { id: 1, top: "14%", scale: 0.8, dur: 150, delay: -90, opacity: 0.6, reverse: true },
  { id: 2, top: "22%", scale: 1, dur: 105, delay: -50, opacity: 0.75 },
  { id: 3, top: "31%", scale: 0.62, dur: 165, delay: -120, opacity: 0.45 },
  { id: 4, top: "39%", scale: 0.95, dur: 130, delay: -70, opacity: 0.65, reverse: true },
  { id: 5, top: "47%", scale: 0.7, dur: 145, delay: -20, opacity: 0.5 },
  { id: 6, top: "55%", scale: 1.05, dur: 110, delay: -95, opacity: 0.7 },
  { id: 7, top: "62%", scale: 0.75, dur: 155, delay: -45, opacity: 0.55, reverse: true },
  { id: 8, top: "70%", scale: 0.9, dur: 125, delay: -10, opacity: 0.68 },
  { id: 9, top: "77%", scale: 1.25, dur: 140, delay: -110, opacity: 0.72, reverse: true },
  { id: 10, top: "84%", scale: 0.65, dur: 115, delay: -60, opacity: 0.5 },
  { id: 11, top: "91%", scale: 1.1, dur: 135, delay: -80, opacity: 0.62 },
];

const FG_CLOUDS: CloudSpec[] = [
  { id: 100, top: "16%", scale: 1.8, dur: 90, delay: -35, opacity: 0.48 },
  { id: 101, top: "34%", scale: 2.2, dur: 125, delay: -80, opacity: 0.4, reverse: true },
  { id: 102, top: "52%", scale: 1.9, dur: 100, delay: -15, opacity: 0.46 },
  { id: 103, top: "66%", scale: 1.6, dur: 135, delay: -95, opacity: 0.42, reverse: true },
  { id: 104, top: "78%", scale: 2, dur: 110, delay: -50, opacity: 0.44 },
  { id: 105, top: "90%", scale: 1.7, dur: 145, delay: -25, opacity: 0.4 },
];

const METEORS: MeteorSpec[] = [
  { id: 0, top: "6vh", left: "58%", len: 170, dur: 5.5, delay: -0.3, angle: -34, dx: "-36vw", dy: "24vw" },
  { id: 1, top: "16vh", left: "28%", len: 120, dur: 8.5, delay: -1.1, angle: -30, dx: "-28vw", dy: "16vw" },
  { id: 2, top: "24vh", left: "72%", len: 145, dur: 7, delay: -5.2, angle: -44, dx: "-26vw", dy: "25vw" },
  { id: 3, top: "10vh", left: "42%", len: 200, dur: 10, delay: -7.8, angle: -32, dx: "-40vw", dy: "25vw" },
];

export function SkyBackdrop({ theme }: { theme: SiteTheme }) {
  const isDark = theme === "dark";
  const isLight = theme === "light";
  const isRain = theme === "rain";
  const night = useMemo(() => buildNight(), []);
  const motes = useMemo(() => buildDayMotes(), []);
  const rainDrops = useMemo(() => buildRain(), []);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            opacity: isDark ? 1 : 0,
            visibility: isDark ? "visible" : "hidden",
            transition: "opacity 700ms ease, visibility 700ms",
          }}
        >
        <div className="absolute inset-0" style={{ background: night.nebula }} />
        <div className="absolute inset-0" style={{ background: night.band }} />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: night.far,
            backgroundSize: "100% 100%",
            animation: "star-twinkle-a 7s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: night.mid,
            backgroundSize: "100% 100%",
            animation: "star-twinkle-b 5s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: night.near,
            backgroundSize: "100% 100%",
            animation: "star-twinkle-c 3.4s ease-in-out infinite alternate",
          }}
        />

        {night.flares.map((f) => (
          <span
            key={f.id}
            className="star-flare"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              animationDuration: `${f.dur}s`,
              animationDelay: `${f.delay}s`,
            }}
          >
            <span className="star-flare-core" />
          </span>
        ))}

        {METEORS.map((m) => (
          <span
            key={m.id}
            className="sky-meteor"
            style={
              {
                top: m.top,
                left: m.left,
                width: m.len,
                animationDuration: `${m.dur}s`,
                animationDelay: `${m.delay}s`,
                "--ma": `${m.angle}deg`,
                "--mdx": m.dx,
                "--mdy": m.dy,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div
        className="sky-day absolute inset-0"
        style={{
          opacity: isLight ? 1 : 0,
          visibility: isLight ? "visible" : "hidden",
          transition: "opacity 700ms ease, visibility 700ms",
        }}
      >
        <div className="sky-glow-day" />
        <div className="sky-rays" />

        {CLOUDS.map((c) => (
          <span
            key={c.id}
            className="sky-cloud"
            style={
              {
                top: c.top,
                opacity: c.opacity,
                animationDuration: `${c.dur}s`,
                animationDelay: `${c.delay}s`,
                "--cs": c.scale,
              } as CSSProperties
            }
          />
        ))}

        {motes.map((m) => (
          <span
            key={m.id}
            className="sky-mote"
            style={
              {
                left: m.left,
                top: m.top,
                width: m.size,
                height: m.size,
                animationDuration: `${m.dur}s`,
                animationDelay: `${m.delay}s`,
                "--sway": m.sway,
              } as CSSProperties
            }
          />
        ))}
      </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
        style={{
          opacity: isLight ? 1 : 0,
          visibility: isLight ? "visible" : "hidden",
          transition: "opacity 700ms ease, visibility 700ms",
        }}
      >
        {FG_CLOUDS.map((c) => (
          <span
            key={c.id}
            className="sky-cloud sky-cloud--fg"
            style={
              {
                top: c.top,
                opacity: c.opacity,
                animationDuration: `${c.dur}s`,
                animationDelay: `${c.delay}s`,
                animationDirection: c.reverse ? "reverse" : undefined,
                "--cs": c.scale,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[15] overflow-hidden"
        style={{
          opacity: isRain ? 1 : 0,
          visibility: isRain ? "visible" : "hidden",
          transition: "opacity 700ms ease, visibility 700ms",
        }}
      >
        <div className="sky-lightning" style={{ "--ldur": "11s", animationDelay: "-2s" } as CSSProperties} />
        <div
          className="sky-lightning"
          style={{ "--ldur": "17s", animationDelay: "-9s", transform: "scaleX(-1)" } as CSSProperties}
        />

        {CLOUDS.map((c) => (
          <span
            key={c.id}
            className="sky-cloud sky-cloud--storm"
            style={
              {
                top: c.top,
                opacity: c.opacity * 0.75,
                animationDuration: `${c.dur}s`,
                animationDelay: `${c.delay}s`,
                animationDirection: c.reverse ? "reverse" : undefined,
                "--cs": c.scale,
              } as CSSProperties
            }
          />
        ))}

        {rainDrops.map((d) => (
          <span
            key={d.id}
            className="sky-rain-drop"
            style={
              {
                left: d.left,
                top: d.top,
                width: d.width,
                height: d.len,
                opacity: d.opacity,
                animationDuration: `${d.dur.toFixed(2)}s`,
                animationDelay: `${d.delay.toFixed(2)}s`,
                "--rdx": d.drift,
                "--ra": d.rot,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </>
  );
}
