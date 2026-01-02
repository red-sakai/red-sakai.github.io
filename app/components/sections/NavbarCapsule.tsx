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

  useEffect(() => {
    const update = () => setCurrentHash(window.location.hash || "");
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
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

  const knobPositionClass = isDark ? "translate-x-[40px]" : "translate-x-0";

  return (
    <nav aria-label="Primary" className={className}>
      <div className="relative inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-2 py-1.5 shadow-sm backdrop-blur-md">
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
                  (isActive ? "text-white" : "text-foreground/70 hover:text-white")
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
          className="relative inline-flex h-9 w-20 items-center overflow-hidden rounded-full border border-black/10 px-2 text-sm font-medium shadow-sm transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #1f2937, #0b1325)"
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
    </nav>
  );
}
