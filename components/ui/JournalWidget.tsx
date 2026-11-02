"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import journalData from "@/data/journal.json";
import type { JournalBlock, JournalEntry } from "@/types/domain";

// ─────────────────────────────────────────────────────────────────
// BOOK LAYOUT TUNING — adjust these if the text sits off the pages
//   aspectRatio : must match the image's real width / height ratio
//   spread      : the text area spanning BOTH pages, as percentage
//                 insets of the book box (top/bottom/left/right =
//                 distance from that edge of the image)
//   spineGap    : gap between the left/right text columns (the
//                 book spine). Increase to push text from center.
// ─────────────────────────────────────────────────────────────────
const BOOK = {
  image: "/open-book.webp",
  aspectRatio: "1650 / 1196",
  spread: { top: "15%", bottom: "15%", left: "21%", right: "19.5%" },
  spineGap: "3.5cqw",
};

// Text sizing: clamp(min, scales-with-book-width, max)
const PAGE_FONT = {
  heading: "clamp(1rem, 2.4cqw, 1.5rem)",
  subheading: "clamp(0.78rem, 1.75cqw, 1.08rem)",
  title: "clamp(0.8rem, 1.85cqw, 1.15rem)",
  date: "clamp(0.54rem, 1.15cqw, 0.76rem)",
  body: "clamp(0.66rem, 1.5cqw, 0.9rem)",
  code: "clamp(0.56rem, 1.25cqw, 0.8rem)",
  articleBody: "clamp(0.68rem, 1.6cqw, 0.95rem)",
  bodyLineHeight: 1.55,
  articleLineHeight: 1.65,
};
// ─────────────────────────────────────────────────────────────────

type Kind = NonNullable<JournalEntry["kind"]>;
type Filter = "all" | Kind;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "diary", label: "Diary" },
  { key: "writeup", label: "Write-ups" },
];

const KIND_LABEL: Record<Kind, string> = { diary: "Diary", writeup: "Write-up" };

const kindOf = (entry: JournalEntry): Kind => entry.kind ?? "diary";

const slugOf = (entry: JournalEntry) =>
  `${entry.date}-${entry.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Newest first, so the latest diary page or write-up is on top.
const entries = [...(journalData as JournalEntry[])].sort((a, b) => b.date.localeCompare(a.date));

const HASH_PREFIX = "#journal/";

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Renders inline `code` and [label](https://…) inside a line of text.
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const at = match.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push(
      match[1] !== undefined ? (
        <code key={at} className="rounded-[0.3cqw] bg-stone-800/10 px-[0.35cqw] font-mono text-[0.9em] text-stone-800">
          {match[1]}
        </code>
      ) : (
        <a
          key={at}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-800 underline decoration-amber-700/50 underline-offset-2 hover:decoration-amber-800"
        >
          {match[2]}
        </a>
      )
    );
    last = at + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Block({ block }: { block: JournalBlock }) {
  const body = { fontSize: PAGE_FONT.articleBody, lineHeight: PAGE_FONT.articleLineHeight };

  switch (block.type) {
    case "image":
      return (
        <figure className="mb-[1.8cqw] break-inside-avoid">
          <Image
            src={block.src}
            alt={block.alt ?? ""}
            width={block.width ?? 1920}
            height={block.height ?? 1080}
            sizes="400px"
            className="h-auto w-full rounded-[0.6cqw] border border-stone-400/50 object-cover"
          />
          {block.caption && (
            <figcaption style={{ fontSize: PAGE_FONT.date }} className="mt-[0.6cqw] text-center text-stone-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "heading":
      return (
        <h3
          style={{ fontSize: PAGE_FONT.subheading, breakAfter: "avoid" }}
          className="mb-[0.8cqw] mt-[2cqw] font-semibold leading-snug tracking-tight text-stone-800"
        >
          {block.text}
        </h3>
      );
    case "quote":
      return (
        <blockquote style={body} className="mb-[1.6cqw] border-l-2 border-amber-700/50 pl-[1.2cqw] italic text-stone-600">
          {inline(block.text)}
          {block.cite && <footer className="mt-[0.4cqw] not-italic text-stone-500">— {block.cite}</footer>}
        </blockquote>
      );
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List
          style={body}
          className={`mb-[1.6cqw] space-y-[0.4cqw] pl-[1.8cqw] text-stone-700 ${block.ordered ? "list-decimal" : "list-disc"} marker:text-amber-800/70`}
        >
          {block.items.map((item, index) => (
            <li key={index}>{inline(item)}</li>
          ))}
        </List>
      );
    }
    case "code":
      return (
        <figure className="mb-[1.6cqw]">
          {block.lang && (
            <figcaption style={{ fontSize: PAGE_FONT.date }} className="mb-[0.3cqw] font-mono text-stone-500">
              {block.lang}
            </figcaption>
          )}
          <pre
            style={{ fontSize: PAGE_FONT.code, lineHeight: 1.5 }}
            className="whitespace-pre-wrap break-words rounded-[0.5cqw] bg-stone-800 p-[1.1cqw] font-mono text-amber-50"
          >
            <code>{block.code}</code>
          </pre>
        </figure>
      );
    default:
      return (
        <p style={body} className="mb-[1.6cqw] text-stone-700">
          {inline(block.text)}
        </p>
      );
  }
}

export function JournalWidget() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [spread, setSpread] = useState({ index: 0, count: 1, canPrev: false, canNext: false });
  const trackRef = useRef<HTMLDivElement | null>(null);

  const activeEntry = entries.find((entry) => slugOf(entry) === activeSlug);
  const view = activeEntry ? "entry" : "toc";
  const visibleEntries = filter === "all" ? entries : entries.filter((entry) => kindOf(entry) === filter);

  const showEntry = useCallback((slug: string | null) => {
    setActiveSlug(slug);
    // Each entry gets a shareable URL; the TOC and a closed book have none.
    const url = slug ? `${HASH_PREFIX}${slug}` : window.location.pathname + window.location.search;
    window.history.replaceState(window.history.state, "", url);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    showEntry(null);
  }, [showEntry]);

  const updateNav = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const gap = Number.parseFloat(window.getComputedStyle(el).columnGap) || 0;
    const step = el.clientWidth + gap;
    const max = el.scrollWidth - el.clientWidth;
    const canNext = max - el.scrollLeft > 4;
    // An odd column count leaves a half-filled last spread, so round up (minus pixel-rounding slack).
    const count = Math.max(1, Math.ceil((el.scrollWidth + gap) / step - 0.05));
    setSpread({
      index: canNext ? Math.round(el.scrollLeft / step) : count - 1,
      count,
      canPrev: el.scrollLeft > 4,
      canNext,
    });
  }, []);

  const page = useCallback((dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const gap = Number.parseFloat(window.getComputedStyle(el).columnGap) || 0;
    const target = Math.min(Math.max(el.scrollLeft + dir * (el.clientWidth + gap), 0), el.scrollWidth - el.clientWidth);
    if (Math.abs(target - el.scrollLeft) < 2) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.scrollLeft = target;
      return;
    }
    // Ink fades out toward the spine, the next spread fades in from the other side.
    gsap.killTweensOf(el);
    gsap
      .timeline()
      .to(el, { autoAlpha: 0, x: -dir * 18, duration: 0.16, ease: "power2.in" })
      .add(() => {
        el.scrollLeft = target;
      })
      .fromTo(el, { x: dir * 18 }, { autoAlpha: 1, x: 0, duration: 0.3, ease: "power2.out", clearProps: "transform,opacity,visibility" });
  }, []);

  // Open straight to an entry when the page is loaded with #journal/<slug>.
  useEffect(() => {
    const openFromHash = () => {
      const { hash } = window.location;
      if (!hash.startsWith(HASH_PREFIX)) return;
      const slug = decodeURIComponent(hash.slice(HASH_PREFIX.length));
      if (!entries.some((entry) => slugOf(entry) === slug)) return;
      setActiveSlug(slug);
      setOpen(true);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") page(1);
      if (event.key === "ArrowLeft") page(-1);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, page, close]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    el.scrollLeft = 0;
    // Re-measure whenever the pages change size (window resize, zoom, late layout).
    const observer = new ResizeObserver(updateNav);
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeSlug, filter, open, updateNav]);

  const blocks: JournalBlock[] = activeEntry
    ? (activeEntry.content ?? [{ type: "text", text: activeEntry.entry ?? "" }])
    : [];

  const navButton =
    "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-amber-200/40 bg-stone-900/90 text-xl text-amber-100 shadow-lg transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 disabled:pointer-events-none disabled:opacity-25";
  const cornerButton =
    "absolute -top-2 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-amber-200/40 bg-stone-900/90 text-lg text-amber-100 shadow-lg transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 sm:-top-4";

  return (
    <>
      <div className="group fixed bottom-5 right-5 z-[2600] sm:bottom-8 sm:right-8">
        <span
          aria-hidden
          className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100 dark:border-white/15 dark:bg-[#0f172a] dark:text-slate-200"
        >
          Journal
        </span>
        <button
          type="button"
          onClick={() => {
            showEntry(null);
            setOpen(true);
          }}
          aria-label="Open my journal"
          aria-expanded={open}
          className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-2xl transition-transform duration-300 ease-out hover:-rotate-3 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 sm:h-24 sm:w-24"
        >
          <Image
            src="/aranyaka.png"
            alt=""
            width={128}
            height={128}
            className="h-full w-full object-contain transition-[filter] duration-300 group-hover:brightness-110"
          />
        </button>
      </div>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeEntry ? activeEntry.title : "My journal"}
            onClick={close}
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
                  onClick={() => showEntry(null)}
                  aria-label="Back to table of contents"
                  className={`${cornerButton} -left-2 sm:-left-4`}
                >
                  <span aria-hidden>←</span>
                </button>
              )}
              <button type="button" onClick={close} aria-label="Close journal" className={`${cornerButton} -right-2 sm:-right-4`}>
                <span aria-hidden>×</span>
              </button>

              <div className="relative" style={{ aspectRatio: BOOK.aspectRatio, containerType: "inline-size" }}>
                <Image
                  src={BOOK.image}
                  alt=""
                  fill
                  sizes="(max-width: 1650px) 97vw, 1600px"
                  priority
                  className="object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
                />

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
                    ref={trackRef}
                    data-lenis-prevent
                    onScroll={updateNav}
                    className="book-pages h-full overflow-x-auto overflow-y-hidden"
                    style={{ columnCount: 2, columnGap: BOOK.spineGap, columnFill: "auto" }}
                  >
                    {view === "toc" ? (
                      <>
                        <header className="mb-[2cqw] break-inside-avoid">
                          <h2 style={{ fontSize: PAGE_FONT.heading }} className="font-semibold tracking-tight text-stone-800">
                            Table of Contents
                          </h2>
                          <div role="tablist" aria-label="Filter entries" className="mt-[0.8cqw] flex gap-[1.4cqw]">
                            {FILTERS.map((item) => (
                              <button
                                key={item.key}
                                type="button"
                                role="tab"
                                aria-selected={filter === item.key}
                                onClick={() => setFilter(item.key)}
                                style={{ fontSize: PAGE_FONT.date }}
                                className={`cursor-pointer border-b pb-[0.2cqw] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-700 ${
                                  filter === item.key
                                    ? "border-amber-800 font-semibold text-amber-900"
                                    : "border-transparent text-stone-500 hover:text-stone-800"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </header>

                        {visibleEntries.length === 0 ? (
                          <p style={{ fontSize: PAGE_FONT.body }} className="italic text-stone-500">
                            {filter === "writeup" ? "No write-ups yet." : "No entries yet."}
                          </p>
                        ) : (
                          <ol className="space-y-[1.8cqw]">
                            {visibleEntries.map((entry) => (
                              <li key={slugOf(entry)} className="break-inside-avoid">
                                <button
                                  type="button"
                                  onClick={() => showEntry(slugOf(entry))}
                                  className="group/entry w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-700"
                                >
                                  <p style={{ fontSize: PAGE_FONT.date }} className="text-stone-500">
                                    <span className="font-medium text-amber-800">{KIND_LABEL[kindOf(entry)]}</span>
                                    {" · "}
                                    {formatDate(entry.date)}
                                  </p>
                                  <h3
                                    style={{ fontSize: PAGE_FONT.title }}
                                    className="mt-0.5 font-semibold leading-snug tracking-tight text-stone-800 decoration-amber-700/60 underline-offset-4 transition-colors duration-200 group-hover/entry:text-amber-800 group-hover/entry:underline"
                                  >
                                    {entry.title}
                                  </h3>
                                  {entry.tags && entry.tags.length > 0 && (
                                    <p style={{ fontSize: PAGE_FONT.date }} className="mt-0.5 font-mono text-stone-500">
                                      {entry.tags.join(" / ")}
                                    </p>
                                  )}
                                </button>
                              </li>
                            ))}
                          </ol>
                        )}
                      </>
                    ) : (
                      activeEntry && (
                        <>
                          <header className="mb-[2cqw] break-inside-avoid">
                            <p style={{ fontSize: PAGE_FONT.date }} className="text-stone-500">
                              <span className="font-medium text-amber-800">{KIND_LABEL[kindOf(activeEntry)]}</span>
                              {" · "}
                              {formatDate(activeEntry.date)}
                              {activeEntry.mood ? ` · ${activeEntry.mood}` : ""}
                            </p>
                            <h2
                              style={{ fontSize: PAGE_FONT.heading }}
                              className="mt-1 font-semibold leading-tight tracking-tight text-stone-800"
                            >
                              {activeEntry.title}
                            </h2>
                            {activeEntry.tags && activeEntry.tags.length > 0 && (
                              <p style={{ fontSize: PAGE_FONT.date }} className="mt-[0.5cqw] font-mono text-stone-500">
                                {activeEntry.tags.join(" / ")}
                              </p>
                            )}
                            <div aria-hidden className="mt-[1.6cqw] h-px w-[45%] bg-stone-400/60" />
                          </header>

                          {blocks.map((block, index) => (
                            <Block key={index} block={block} />
                          ))}
                        </>
                      )
                    )}
                  </div>
                </div>

                <div className="absolute inset-y-0 -left-3 z-20 flex items-center sm:-left-6">
                  <button
                    type="button"
                    onClick={() => page(-1)}
                    disabled={!spread.canPrev}
                    aria-label="Previous page"
                    className={navButton}
                  >
                    <span aria-hidden>‹</span>
                  </button>
                </div>
                <div className="absolute inset-y-0 -right-3 z-20 flex items-center sm:-right-6">
                  <button
                    type="button"
                    onClick={() => page(1)}
                    disabled={!spread.canNext}
                    aria-label="Next page"
                    className={navButton}
                  >
                    <span aria-hidden>›</span>
                  </button>
                </div>
              </div>

              <p className="mt-3 text-center text-xs text-white/60" aria-live="polite">
                {spread.count > 1 && `Pages ${spread.index * 2 + 1}–${spread.index * 2 + 2} of ${spread.count * 2} · `}
                {view === "toc" ? "Pick an entry to read · Esc to close" : "‹ › or arrow keys to turn pages · Esc to close"}
              </p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
