"use client";

import { useRef, useCallback, useEffect } from "react";

type SoundName = "startup" | "click" | "error" | "open" | "close";

export function useDesktopSounds() {
  const ctxRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

  useEffect(() => {
    const stored = localStorage.getItem("desktop-sounds");
    if (stored !== null) enabledRef.current = stored === "true";
  }, []);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }, []);

  const playNote = useCallback(
    (freq: number, duration: number, type: OscillatorType = "square", vol = 0.08) => {
      if (!enabledRef.current) return;
      try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {}
    },
    [getCtx],
  );

  const play = useCallback(
    (name: SoundName) => {
      if (!enabledRef.current) return;
      switch (name) {
        case "startup":
          playNote(523.25, 0.12, "square", 0.06);
          setTimeout(() => playNote(659.25, 0.12, "square", 0.06), 100);
          setTimeout(() => playNote(783.99, 0.12, "square", 0.06), 200);
          setTimeout(() => playNote(1046.5, 0.25, "square", 0.06), 300);
          break;
        case "click":
          playNote(800, 0.04, "square", 0.03);
          break;
        case "error":
          playNote(200, 0.15, "sawtooth", 0.08);
          setTimeout(() => playNote(180, 0.2, "sawtooth", 0.08), 150);
          break;
        case "open":
          playNote(440, 0.06, "square", 0.04);
          setTimeout(() => playNote(660, 0.08, "square", 0.04), 60);
          break;
        case "close":
          playNote(660, 0.06, "square", 0.04);
          setTimeout(() => playNote(330, 0.1, "square", 0.04), 60);
          break;
      }
    },
    [playNote],
  );

  const toggle = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    localStorage.setItem("desktop-sounds", String(enabledRef.current));
    return enabledRef.current;
  }, []);

  const isEnabled = useCallback(() => enabledRef.current, []);

  return { play, toggle, isEnabled };
}
