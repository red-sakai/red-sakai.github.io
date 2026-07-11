"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Phase = "splash" | "bios";

const LINES = [
  "Main Processor : 486DX2-66",
  "Video Adapter  : ASCII Graphics Adapter",
  "",
  "",
  "Detecting Primary Master ... ZEZIN-HD 20GB",
  "Detecting Primary Slave  ... None",
  "Detecting Secondary Master ... CD-ROM Drive",
  "Detecting Secondary Slave  ... None",
];

type BiosBootScreenProps = {
  onFinish: () => void;
};

export function BiosBootScreen({ onFinish }: BiosBootScreenProps) {
  const [phase, setPhase] = useState<Phase>("splash");
  const [revealedLines, setRevealedLines] = useState(0);
  const [memoryCount, setMemoryCount] = useState<number | null>(null);
  const [memoryDone, setMemoryDone] = useState(false);
  const mountedRef = useRef(true);
  const timersRef = useRef<(ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>)[]>([]);
  const onFinishRef = useRef(onFinish);

  onFinishRef.current = onFinish;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current.forEach((id) => clearInterval(id as unknown as number));
    timersRef.current = [];
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return clearAllTimers;
  }, [clearAllTimers]);

  // ── Phase 1: Splash ──
  useEffect(() => {
    if (phase !== "splash") return;

    const handleTrigger = () => {
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = 800;
        gain.gain.value = 0.1;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.stop(ctx.currentTime + 0.05);
      } catch {
        /* Web Audio not available */
      }
      setPhase("bios");
    };

    window.addEventListener("keydown", handleTrigger);
    window.addEventListener("pointerdown", handleTrigger);
    return () => {
      window.removeEventListener("keydown", handleTrigger);
      window.removeEventListener("pointerdown", handleTrigger);
    };
  }, [phase]);

  // ── Phase 2: BIOS ticker ──
  useEffect(() => {
    if (phase !== "bios") return;

    clearAllTimers();

    const pushTimeout = (ms: number, fn: () => void) => {
      const id = setTimeout(fn, ms);
      timersRef.current.push(id);
      return id;
    };

    const pushInterval = (ms: number, fn: () => void) => {
      const id = setInterval(fn, ms);
      timersRef.current.push(id);
      return id;
    };

    // Line 0: immediate
    setRevealedLines(1);

    // Line 1: +200ms
    pushTimeout(200, () => setRevealedLines(2));

    // Line 2: Memory Test — starts at +200ms with counter
    pushTimeout(200, () => {
      setRevealedLines(3);
      setMemoryCount(0);
      setMemoryDone(false);

      let count = 0;
      const increment = 512;

      const ci = pushInterval(16, () => {
        if (!mountedRef.current) {
          clearInterval(ci);
          return;
        }
        count += increment;
        if (count >= 16384) {
          setMemoryCount(16384);
          setMemoryDone(true);
          clearInterval(ci);

          // Line 3 (blank spacer): +300ms pause
          pushTimeout(300, () => setRevealedLines(4));

          // Lines 4–7: detecting drives
          pushTimeout(300 + 500, () => setRevealedLines(5));
          pushTimeout(300 + 500 + 300, () => setRevealedLines(6));
          pushTimeout(300 + 500 + 300 + 400, () => setRevealedLines(7));
          pushTimeout(300 + 500 + 300 + 400 + 200, () => {
            setRevealedLines(8);
            // Boot complete — finish after a brief pause
            pushTimeout(800, () => {
              if (mountedRef.current) {
                onFinishRef.current();
              }
            });
          });
        } else {
          setMemoryCount(count);
        }
      });
    });

    return clearAllTimers;
  }, [phase, clearAllTimers]);

  const renderLineContent = (index: number) => {
    if (index === 2) {
      const value = memoryDone
        ? "16384K OK"
        : memoryCount !== null
          ? `${memoryCount}K`
          : "";
      return `Memory Test     : ${value}`;
    }
    return LINES[index];
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-black">
      <style>{`
        @keyframes blink-fade {
          0%, 40% { opacity: 1; }
          70% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-blink-fade {
          animation: blink-fade 1.2s ease-in-out infinite;
        }
      `}</style>
      {phase === "splash" ? (
        <div className="flex min-h-dvh w-full items-center justify-center bg-black">
          <p className="animate-blink-fade font-['Courier_New','Courier','Consolas',monospace] font-bold text-[clamp(0.6rem,2.5vw,1.25rem)] tracking-[0.45em] text-gray-200 select-none">
            PRESS ANY KEY...
          </p>
        </div>
      ) : (
        <div className="flex min-h-dvh w-full items-center justify-center bg-[#000a0a] p-4 sm:p-6">
          <div className="flex w-full max-w-3xl items-center justify-center">
            <div className="w-full font-['var(--font-jetbrains-mono)'] text-[clamp(0.55rem,1.8vw,0.95rem)] leading-relaxed text-gray-300">
              {/* ── Header ── */}
              <div className="flex items-start justify-between gap-3">
                <div className="text-[clamp(0.4rem,1.2vw,0.65rem)] uppercase tracking-[0.12em] leading-snug">
                  <div className="text-white/90">
                    Award Modular BIOS v4.51PG, An Energy Star Ally
                  </div>
                  <div className="mt-0.5 text-white/50">
                    Copyright (C) 1984-98, JheredOS 98 Inc.
                  </div>
                </div>

                {/* Mechanical wolf/fox + gears logo */}
                <svg
                  viewBox="0 0 80 80"
                  className="h-14 w-14 shrink-0 sm:h-18 sm:w-18 md:h-20 md:w-20"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <circle cx="20" cy="20" r="8" strokeWidth="1.2" />
                  <circle cx="20" cy="20" r="3" fill="white" stroke="none" />
                  <line x1="12" y1="20" x2="28" y2="20" strokeWidth="1.2" />
                  <line x1="20" y1="12" x2="20" y2="28" strokeWidth="1.2" />
                  <circle cx="60" cy="20" r="8" strokeWidth="1.2" />
                  <circle cx="60" cy="20" r="3" fill="white" stroke="none" />
                  <line x1="52" y1="20" x2="68" y2="20" strokeWidth="1.2" />
                  <line x1="60" y1="12" x2="60" y2="28" strokeWidth="1.2" />
                  <path d="M40 55c-7 0-13.5-4.5-13.5-11s6.5-11 13.5-11 13.5 4.5 13.5 11-6.5 11-13.5 11z" />
                  <path d="M28 33l-4-8 6 4z" />
                  <path d="M52 33l4-8-6 4z" />
                  <circle cx="35" cy="43" r="2" fill="white" stroke="none" />
                  <circle cx="45" cy="43" r="2" fill="white" stroke="none" />
                  <path d="M38 49 Q40 51 42 49" strokeWidth="1.2" />
                  <path d="M32 36l-4-10 7 4z" />
                  <path d="M48 36l4-10-7 4z" />
                </svg>
              </div>

              <hr className="my-3 border-t border-white/60 sm:my-4" />

              {/* ── Ticker ── */}
              <div className="space-y-0.5 whitespace-pre-wrap">
                {LINES.map((_, i) => (
                  <div
                    key={i}
                    className={`transition-opacity duration-150 ${
                      i < revealedLines ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {renderLineContent(i)}
                  </div>
                ))}
              </div>

              {/* ── Blinking cursor ── */}
              <div className="mt-1">
                <span className="animate-pulse text-lg">█</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
