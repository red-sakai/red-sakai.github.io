"use client";

import type { ReactNode } from "react";

const PIXELATE_FILTER_ID = "pixelate-svg-filter";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function PixelatedWrapper({ children, className }: Props) {
  return (
    <div
      className={`pixelated-wrapper${className ? ` ${className}` : ""}`}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
        WebkitFontSmoothing: "none",
        MozOsxFontSmoothing: "auto",
        fontSmooth: "never",
        filter: `url(#${PIXELATE_FILTER_ID})`,
      }}
    >
      <svg
        aria-hidden
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          <filter id={PIXELATE_FILTER_ID} x="0" y="0" width="100%" height="100%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blur" />
            <feColorMatrix
              in="blur"
              type="saturate"
              values="1.4"
              result="boost"
            />
            <feComponentTransfer in="boost">
              <feFuncR type="linear" slope="1.05" intercept="-0.025" />
              <feFuncG type="linear" slope="1.05" intercept="-0.025" />
              <feFuncB type="linear" slope="1.05" intercept="-0.025" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* Scanline overlay */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9999,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(128, 128, 128, 0.03) 3px, rgba(128, 128, 128, 0.03) 4px)",
        }}
      />

      {/* Pixel grid overlay */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9998,
          backgroundImage:
            "linear-gradient(rgba(128, 128, 128, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(128, 128, 128, 0.04) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />

      <div
        className="pixelated-content"
        style={{
          position: "relative",
          zIndex: 1,
          padding: 8,
        }}
      >
        {children}
      </div>
    </div>
  );
}
