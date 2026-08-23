"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import journalData from "@/data/journal.json";
import type { JournalBlock, JournalEntry } from "@/types/domain";

// ─────────────────────────────────────────────────────────────────
// BOOK LAYOUT TUNING — adjust these if the text sits off the pages
//   aspectRatio : must match the PNG's real width / height ratio
//   spread      : the text area spanning BOTH pages, as percentage
//                 insets of the book box (top/bottom/left/right =
//                 distance from that edge of the image)
//   spineGap    : gap between the left/right text columns (the
//                 book spine). Increase to push text from center.
// ─────────────────────────────────────────────────────────────────
const BOOK = {
  image: "/open-book-transparent.png",
  aspectRatio: "1650 / 1196",
  spread: { top: "15%", bottom: "15%", left: "21%", right: "19.5%" },
  spineGap: "3.5cqw",
};

// Text sizing: clamp(min, scales-with-book-width, max)
const PAGE_FONT = {
  heading: "clamp(1rem, 2.4cqw, 1.5rem)",
  title: "clamp(0.8rem, 1.85cqw, 1.15rem)",
  date: "clamp(0.54rem, 1.15cqw, 0.76rem)",
  body: "clamp(0.66rem, 1.5cqw, 0.9rem)",
  articleBody: "clamp(0.68rem, 1.6cqw, 0.95rem)",
  bodyLineHeight: 1.55,
  articleLineHeight: 1.65,
};
// ─────────────────────────────────────────────────────────────────

const entries = journalData as JournalEntry[];

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function JournalWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"toc" | "entry">("toc");
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const tocTrackRef = useRef<HTMLDivElement | null>(null);
  const entryTrackRef = useRef<HTMLDivElement | null>(null);

  const updateNav = useCallback(() => {
    const el = view === "toc" ? tocTrackRef.current : entryTrackRef.current;
    if (!el) {
      setCanPrev(false);
      setCanNext(false);
      return;
    }
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(max - el.scrollLeft > 4);
  }, [view]);

  const page = useCallback(
    (dir: number) => {
      const el = view === "toc" ? tocTrackRef.current : entryTrackRef.current;
      if (!el) return;
      let gap = Number.parseFloat(window.getComputedStyle(el).columnGap);
      if (!Number.isFinite(gap)) gap = 0;
      el.scrollBy({ left: dir * (el.clientWidth + gap), behavior: "smooth" });
    },
    [view]
  );

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") page(1);
      if (event.key === "ArrowLeft") page(-1);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, page]);

  useEffect(() => {
    const el = view === "toc" ? tocTrackRef.current : entryTrackRef.current;
    if (el) el.scrollTo({ left: 0 });
    const raf = window.requestAnimationFrame(updateNav);
    return () => window.cancelAnimationFrame(raf);
  }, [view, activeIndex, open, updateNav]);

  if (typeof document === "undefined") return null;

  const activeEntry = entries[activeIndex];
  const blocks: JournalBlock[] = activeEntry
    ? (activeEntry.content ?? [{ type: "text", text: activeEntry.entry ?? "" }])
    : [];

  const openEntry = (index: number) => {
    setActiveIndex(index);
    setView("entry");
  };

  return (
    <>
      <div className="group fixed bottom-5 right-5 z-[2600] sm:bottom-8 sm:right-8">
        <span
          aria-hidden
          className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-600 opacity-0 shadow-sm transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100 dark:border-white/15 dark:bg-[#0f172a] dark:text-slate-300"
        >
          My Journal
        </span>
        <button
          type="button"
          onClick={() => {
            setView("toc");
            setOpen(true);
          }}
          aria-label="Open my journal"
          aria-expanded={open}
          className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-2xl transition-transform duration-300 ease-out hover:scale-110 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 sm:h-24 sm:w-24"
        >
          <span
            aria-hidden
            className="flex h-full w-full items-center justify-center animate-[journal-pulse_3.6s_ease-in-out_infinite] group-hover:[animation-play-state:paused]"
          >
            <Image
              src="/aranyaka.png"
              alt=""
              width={128}
              height={128}
              priority={false}
              className="h-full w-full object-contain animate-[journal-sway_4.5s_ease-in-out_infinite] transition-[filter] duration-300 group-hover:[animation-play-state:paused] group-hover:brightness-110 group-hover:drop-shadow-[0_0_14px_rgba(217,119,6,0.65)]"
            />
          </span>
        </button>
      </div>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="My journal"
            onClick={() => setOpen(false)}
            data-lenis-prevent
            className="fixed inset-0 z-[3600] flex flex-col items-center justify-center gap-2 bg-slate-950/85 p-4 backdrop-blur-sm animate-[lightbox-in_0.25s_ease-out] sm:p-6"
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="relative w-[min(97vw,100rem,calc((100dvh-6rem)*1.3796))] animate-[journal-in_0.35s_ease-out]"
            >
              {view === "entry" && (
                <button
                  type="button"
                  onClick={() => setView("toc")}
                  aria-label="Back to table of contents"
                  className="absolute -left-2 -top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-amber-200/40 bg-stone-900/90 text-lg text-amber-100 shadow-lg transition-transform duration-200 hover:scale-110 focus-visible:outline-none sm:-left-4 sm:-top-4"
                >
                  <span aria-hidden>←</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close journal"
                className="absolute -right-2 -top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-amber-200/40 bg-stone-900/90 text-lg text-amber-100 shadow-lg transition-transform duration-200 hover:scale-110 focus-visible:outline-none sm:-right-4 sm:-top-4"
              >
                <span aria-hidden>×</span>
              </button>

              <div
                className="relative"
                style={{
                  aspectRatio: BOOK.aspectRatio,
                  containerType: "inline-size",
                }}
              >
                <Image
                  src={BOOK.image}
                  alt=""
                  fill
                  sizes="(max-width: 1650px) 97vw, 1600px"
                  priority
                  className="object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
                />

                {view === "toc" ? (
                  <div
                    className="absolute"
                    style={{
                      top: BOOK.spread.top,
                      bottom: BOOK.spread.bottom,
                      left: BOOK.spread.left,
                      right: BOOK.spread.right,
                    }}
                  >
                    <div
                      ref={tocTrackRef}
                      data-lenis-prevent
                      onScroll={updateNav}
                      className="book-pages h-full overflow-x-auto overflow-y-hidden"
                      style={{
                        columnCount: 2,
                        columnGap: BOOK.spineGap,
                        columnFill: "auto",
                      }}
                    >
                      <header className="mb-[2.4cqw] break-inside-avoid">
                        <p
                          style={{ fontSize: PAGE_FONT.date }}
                          className="font-mono uppercase tracking-[0.3em] text-amber-800/80"
                        >
                          Aranyaka · personal log
                        </p>
                        <h2
                          style={{ fontSize: PAGE_FONT.heading }}
                          className="mt-0.5 font-semibold tracking-tight text-stone-800"
                        >
                          Table of Contents
                        </h2>
                      </header>

                      {entries.length === 0 ? (
                        <p
                          style={{ fontSize: PAGE_FONT.body }}
                          className="italic text-stone-500"
                        >
                          No entries yet. The pages are waiting.
                        </p>
                      ) : (
                        <ol className="space-y-[2cqw]">
                          {entries.map((entry, index) => (
                            <li
                              key={`${entry.date}-${index}`}
                              className="break-inside-avoid"
                            >
                              <button
                                type="button"
                                onClick={() => openEntry(index)}
                                className="w-full cursor-pointer text-left transition-colors duration-200 focus-visible:outline-none"
                              >
                                <span
                                  style={{ fontSize: PAGE_FONT.date }}
                                  className="font-mono text-amber-700/90"
                                >
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                <h3
                                  style={{ fontSize: PAGE_FONT.title }}
                                  className="mt-0.5 font-semibold leading-snug tracking-tight text-stone-800 decoration-amber-700/60 underline-offset-4 transition-colors duration-200 hover:text-amber-800 hover:underline"
                                >
                                  {entry.title}
                                </h3>
                                <p
                                  style={{ fontSize: PAGE_FONT.date }}
                                  className="mt-0.5 font-mono uppercase tracking-[0.12em] text-stone-500"
                                >
                                  {formatDate(entry.date)}
                                  {entry.mood ? ` · ${entry.mood}` : ""}
                                </p>
                              </button>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className="absolute"
                    style={{
                      top: BOOK.spread.top,
                      bottom: BOOK.spread.bottom,
                      left: BOOK.spread.left,
                      right: BOOK.spread.right,
                    }}
                  >
                    <div
                      ref={entryTrackRef}
                      data-lenis-prevent
                      onScroll={updateNav}
                      className="book-pages h-full overflow-x-auto overflow-y-hidden"
                      style={{
                        columnCount: 2,
                        columnGap: BOOK.spineGap,
                        columnFill: "auto",
                      }}
                    >
                      <header className="mb-[2cqw] break-inside-avoid">
                        <p
                          style={{ fontSize: PAGE_FONT.date }}
                          className="font-mono uppercase tracking-[0.18em] text-amber-800/90"
                        >
                          {formatDate(activeEntry.date)}
                          {activeEntry.mood ? ` · ${activeEntry.mood}` : ""}
                        </p>
                        <h2
                          style={{ fontSize: PAGE_FONT.heading }}
                          className="mt-1 font-semibold leading-tight tracking-tight text-stone-800"
                        >
                          {activeEntry.title}
                        </h2>
                        <div
                          aria-hidden
                          className="mt-[1.6cqw] h-px w-[45%] bg-stone-400/60"
                        />
                      </header>

                      {blocks.map((block, index) =>
                        block.type === "image" ? (
                          <figure
                            key={index}
                            className="mb-[1.8cqw] break-inside-avoid"
                          >
                            <Image
                              src={block.src}
                              alt={block.alt ?? ""}
                              width={block.width ?? 1920}
                              height={block.height ?? 1080}
                              sizes="400px"
                              className="h-auto w-full rounded-[0.6cqw] border border-stone-400/50 object-cover shadow-sm"
                            />
                            {block.caption && (
                              <figcaption
                                style={{ fontSize: PAGE_FONT.date }}
                                className="mt-[0.6cqw] text-center font-mono uppercase tracking-[0.14em] text-stone-500"
                              >
                                {block.caption}
                              </figcaption>
                            )}
                          </figure>
                        ) : (
                          <p
                            key={index}
                            style={{
                              fontSize: PAGE_FONT.articleBody,
                              lineHeight: PAGE_FONT.articleLineHeight,
                            }}
                            className="mb-[1.6cqw] text-stone-700"
                          >
                            {block.text}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div className="absolute inset-y-0 -left-3 z-20 flex items-center sm:-left-6">
                  <button
                    type="button"
                    onClick={() => page(-1)}
                    disabled={!canPrev}
                    aria-label="Previous page"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-amber-200/40 bg-stone-900/90 text-xl text-amber-100 shadow-lg backdrop-blur-sm transition-transform duration-200 hover:scale-110 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-25"
                  >
                    <span aria-hidden>‹</span>
                  </button>
                </div>
                <div className="absolute inset-y-0 -right-3 z-20 flex items-center sm:-right-6">
                  <button
                    type="button"
                    onClick={() => page(1)}
                    disabled={!canNext}
                    aria-label="Next page"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-amber-200/40 bg-stone-900/90 text-xl text-amber-100 shadow-lg backdrop-blur-sm transition-transform duration-200 hover:scale-110 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-25"
                  >
                    <span aria-hidden>›</span>
                  </button>
                </div>
              </div>

              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-white/60">
                {view === "toc"
                  ? "Select an entry to start reading · press Esc to close the book"
                  : "Use ‹ › or arrow keys to flip pages · Esc to close the book"}
              </p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
