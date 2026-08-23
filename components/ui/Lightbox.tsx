"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export function Lightbox({
  images,
  index,
  alt,
  onClose,
}: {
  images: string[];
  index: number;
  alt: string;
  onClose: () => void;
}) {
  const total = images.length;
  const [current, setCurrent] = useState(() =>
    Math.min(Math.max(index, 0), Math.max(total - 1, 0))
  );

  const showPrev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total]
  );
  const showNext = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, showPrev, showNext]);

  if (typeof document === "undefined") return null;

  const hasMultiple = total > 1;

  const navButtonClass =
    "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/5 font-mono text-lg text-white/70 transition-colors duration-200 hover:border-white/50 hover:bg-white/15 hover:text-white focus-visible:outline-none";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-[4000] flex items-center justify-center bg-slate-950/90 p-6 backdrop-blur-sm animate-[lightbox-in_0.25s_ease-out]"
    >
      <div
        className="relative flex flex-col items-center gap-4"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={images[current]}
          alt={`${alt} (${current + 1}/${total})`}
          width={1600}
          height={1600}
          className="max-h-[78vh] w-auto max-w-[85vw] object-contain"
        />
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
          {hasMultiple ? `${String(current + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")} · ` : ""}
          Click outside the image or press Esc to close
        </p>
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              showPrev();
            }}
            className={`${navButtonClass} left-4 sm:left-8`}
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className={`${navButtonClass} right-4 sm:right-8`}
          >
            <span aria-hidden>→</span>
          </button>
        </>
      )}
    </div>,
    document.body
  );
}
