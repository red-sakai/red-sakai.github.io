"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type NavbarCapsuleItem = {
  label: string;
  href: string;
};

type NavbarCapsuleProps = {
  items?: NavbarCapsuleItem[];
  className?: string;
  theme?: "light" | "dark";
  onThemeToggle?: (next: "light" | "dark") => void;
};

const defaultItems: NavbarCapsuleItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

function normalizePathname(pathname: string): string {
  try {
    return new URL(pathname, "http://localhost").pathname;
  } catch {
    return pathname;
  }
}

function parseHref(href: string): { pathname: string; hash: string } {
  try {
    const url = new URL(href, "http://localhost");
    return {
      pathname: url.pathname,
      hash: url.hash,
    };
  } catch {
    const [pathPart, hashPart] = href.split("#");
    return {
      pathname: normalizePathname(pathPart || "/"),
      hash: hashPart ? `#${hashPart}` : "",
    };
  }
}

export function NavbarCapsule({
  items = defaultItems,
  className,
  theme = "light",
  onThemeToggle,
}: NavbarCapsuleProps) {
  const pathname = usePathname();
  const currentPath = normalizePathname(pathname);
  const isDark = theme === "dark";
  const [currentHash, setCurrentHash] = useState<string>("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [indicator, setIndicator] = useState<{
    x: number;
    w: number;
    insetLeft: number;
    insetTop: number;
    height: number;
    ready: boolean;
  }>({ x: 0, w: 0, insetLeft: 0, insetTop: 0, height: 0, ready: false });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => setCurrentHash(window.location.hash || "");
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  useEffect(() => {
    // Close mobile menu on route/hash change or when switching sections
    setIsMobileMenuOpen(false);
  }, [currentPath, currentHash]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const parsedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      parsed: parseHref(item.href),
    }));
  }, [items]);

  const activeIndex = useMemo(() => {
    const idx = parsedItems.findIndex((item) => {
      const samePath = item.parsed.pathname === currentPath;
      const sameHash = item.parsed.hash ? item.parsed.hash === currentHash : currentHash === "";
      return samePath && sameHash;
    });
    return idx;
  }, [currentHash, currentPath, parsedItems]);

  const moveIndicatorToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    const el = itemRefs.current[index];
    if (!container || !el) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const styles = window.getComputedStyle(container);
    const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
    const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
    const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;

    const x = elRect.left - containerRect.left - paddingLeft;
    const w = elRect.width;
    const height = containerRect.height - paddingTop - paddingBottom;

    setIndicator({ x, w, insetLeft: paddingLeft, insetTop: paddingTop, height, ready: true });
  }, []);

  useLayoutEffect(() => {
    const idx = activeIndex >= 0 ? activeIndex : 0;
    if (parsedItems.length > 0) moveIndicatorToIndex(idx);
  }, [activeIndex, moveIndicatorToIndex, parsedItems.length]);

  useEffect(() => {
    const onResize = () => {
      const idx = hoverIndex ?? (activeIndex >= 0 ? activeIndex : 0);
      if (parsedItems.length > 0) moveIndicatorToIndex(idx);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex, hoverIndex, moveIndicatorToIndex, parsedItems.length]);

  const knobPositionClass = isDark ? "translate-x-[36px]" : "translate-x-0";

  return (
    <nav aria-label="Primary" className={`${className ?? ""} relative`}>
      {/* Desktop navigation */}
      <div
        className={
          "relative hidden items-center gap-2 rounded-full px-2 py-1.5 shadow-sm backdrop-blur-md transition-colors sm:inline-flex " +
          (isDark
            ? "border-white/15 bg-white/10 text-white"
            : "border-black/10 bg-white/80 text-[#0f172a]")
        }
      >
        <div
          ref={containerRef}
          className="relative flex items-center gap-1 rounded-full px-1"
          onPointerLeave={() => {
            setHoverIndex(null);
            const idx = activeIndex >= 0 ? activeIndex : 0;
            if (parsedItems.length > 0) moveIndicatorToIndex(idx);
          }}
        >
          <div
            aria-hidden="true"
            className={
              "pointer-events-none absolute rounded-full bg-blue-600 transition-[transform,width,opacity] duration-300 ease-out " +
              (indicator.ready ? "opacity-100" : "opacity-0")
            }
            style={{
              left: indicator.insetLeft,
              top: indicator.insetTop,
              height: indicator.height,
              width: indicator.w,
              transform: `translateX(${indicator.x}px)`,
            }}
          />

          {parsedItems.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                onPointerEnter={() => {
                  setHoverIndex(index);
                  moveIndicatorToIndex(index);
                }}
                className={
                  "relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 " +
                  (isActive
                    ? "text-white"
                    : isDark
                    ? "text-white/70 hover:text-white"
                    : "text-[#0f172a]/70 hover:text-[#0f172a]")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <span className="hidden h-6 w-px bg-foreground/10 sm:block" aria-hidden />

        <button
          type="button"
          aria-label={isDark ? "Activate light mode" : "Activate dark mode"}
          aria-pressed={isDark}
          onClick={() => onThemeToggle?.(isDark ? "light" : "dark")}
          className={
            "relative inline-flex h-9 w-20 items-center overflow-hidden rounded-full px-2 text-sm font-medium shadow-sm transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 " +
            (isDark ? "border border-white/20" : "border border-black/10")
          }
          style={{
            background: isDark
              ? "linear-gradient(135deg, #111827, #0b1220)"
              : "linear-gradient(135deg, #f5f5f5, #dcdcdc)",
          }}
        >
          <span className="relative z-10 flex flex-1 items-center justify-center text-[#d97706] dark:text-white/70">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={isDark ? "opacity-50" : "opacity-100"}>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.66-7.66-1.41 1.41M7.75 16.25l-1.41 1.41m0-13.66 1.41 1.41m9.5 9.5 1.41 1.41" />
            </svg>
          </span>
          <span className="relative z-10 flex flex-1 items-center justify-center text-[#334155] dark:text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={isDark ? "opacity-100" : "opacity-70"}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </span>

          <span
            aria-hidden
            className={`absolute inset-y-1 left-1 w-9 rounded-full shadow-lg transition-transform duration-300 ease-out ${knobPositionClass}`}
            style={{
              background: isDark
                ? "linear-gradient(135deg, #4b5563, #111827)"
                : "linear-gradient(135deg, #fbbf24, #f59e0b)",
            }}
          />
        </button>
      </div>

      {/* Mobile navigation */}
      <div className="flex items-center gap-3 sm:hidden">
        <button
          type="button"
          aria-label={isDark ? "Activate light mode" : "Activate dark mode"}
          aria-pressed={isDark}
          onClick={() => onThemeToggle?.(isDark ? "light" : "dark")}
          className={
            "relative inline-flex h-10 w-20 items-center overflow-hidden rounded-full px-2 text-sm font-medium shadow-sm transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 " +
            (isDark ? "border border-white/20" : "border border-black/10")
          }
          style={{
            background: isDark
              ? "linear-gradient(135deg, #111827, #0b1220)"
              : "linear-gradient(135deg, #f5f5f5, #dcdcdc)",
          }}
        >
          <span className="relative z-10 flex flex-1 items-center justify-center text-[#d97706] dark:text-white/70">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={isDark ? "opacity-50" : "opacity-100"}>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.66-7.66-1.41 1.41M7.75 16.25l-1.41 1.41m0-13.66 1.41 1.41m9.5 9.5 1.41 1.41" />
            </svg>
          </span>
          <span className="relative z-10 flex flex-1 items-center justify-center text-[#334155] dark:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={isDark ? "opacity-100" : "opacity-70"}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </span>

          <span
            aria-hidden
            className={`absolute inset-y-1 left-1 w-9 rounded-full shadow-lg transition-transform duration-300 ease-out ${knobPositionClass}`}
            style={{
              background: isDark
                ? "linear-gradient(135deg, #4b5563, #111827)"
                : "linear-gradient(135deg, #fbbf24, #f59e0b)",
            }}
          />
        </button>

        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          className={
            "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 " +
            (isDark ? "border-white/25 bg-white/10 text-white" : "border-slate-300 bg-white text-[#0f172a]")
          }
        >
          <span aria-hidden className="flex flex-col gap-1.5">
            <span
              className={
                "block h-0.5 w-5 rounded-full transition-transform duration-200 " +
                (isMobileMenuOpen ? "translate-y-[6px] rotate-45" : "") +
                (isDark ? " bg-white" : " bg-slate-700")
              }
            />
            <span
              className={
                "block h-0.5 w-5 rounded-full transition-opacity duration-200 " +
                (isMobileMenuOpen ? "opacity-0" : "opacity-100") +
                (isDark ? " bg-white" : " bg-slate-700")
              }
            />
            <span
              className={
                "block h-0.5 w-5 rounded-full transition-transform duration-200 " +
                (isMobileMenuOpen ? "-translate-y-[6px] -rotate-45" : "") +
                (isDark ? " bg-white" : " bg-slate-700")
              }
            />
          </span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className={
            "absolute left-0 right-0 top-full z-20 mt-3 origin-top scale-100 rounded-3xl border p-3 shadow-2xl backdrop-blur-md transition-all duration-200 " +
            (isDark
              ? "border-white/10 bg-[#0b1220]/90 text-white"
              : "border-slate-200 bg-white/95 text-[#0f172a]")
          }
        >
          <div className="flex flex-col divide-y divide-white/5 text-sm font-medium">
            {parsedItems.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  className={
                    "flex items-center justify-between px-2 py-3 transition-colors " +
                    (isActive
                      ? isDark
                        ? "text-white"
                        : "text-[#0f172a]"
                      : isDark
                      ? "text-white/70 hover:text-white"
                      : "text-[#0f172a]/70 hover:text-[#0f172a]")
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="text-xs uppercase tracking-[0.2em] text-blue-400">Now</span>}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
