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
  useSyncExternalStore,
} from "react";

export type NavbarCapsuleItem = {
  label: string;
  href: string;
};

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type NavbarCapsuleProps = {
  items?: NavbarCapsuleItem[];
  className?: string;
};

const THEME_STORAGE_KEY = "theme";
const THEME_EVENT = "themechange";

function getDocumentTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function setDocumentTheme(nextTheme: "light" | "dark") {
  document.documentElement.dataset.theme = nextTheme;
  window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  window.dispatchEvent(new Event(THEME_EVENT));
}

function subscribeTheme(onStoreChange: () => void) {
  const onTheme = () => onStoreChange();
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) onStoreChange();
  };

  window.addEventListener(THEME_EVENT, onTheme);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, onTheme);
    window.removeEventListener("storage", onStorage);
  };
}

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

export function NavbarCapsule({ items = defaultItems, className }: NavbarCapsuleProps) {
  const pathname = usePathname();
  const currentPath = normalizePathname(pathname);
  const [currentHash, setCurrentHash] = useState<string>("");
  const theme = useSyncExternalStore(subscribeTheme, getDocumentTheme, () => "light");
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

  useLayoutEffect(() => {
    // Initialize the theme from storage/system preference.
    // No setState here: the UI reads from the document via useSyncExternalStore.
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const systemPrefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;

    const initial: "light" | "dark" = stored === "dark" || stored === "light"
      ? (stored as "light" | "dark")
      : systemPrefersDark
        ? "dark"
        : "light";

    if (!document.documentElement.dataset.theme) {
      setDocumentTheme(initial);
    } else {
      // Ensure a re-render if something else set it before mount.
      window.dispatchEvent(new Event(THEME_EVENT));
    }
  }, []);

  const themeTransitionTimeoutRef = useRef<number | null>(null);
  const bgStageTimeoutRef = useRef<number | null>(null);

  const toggleTheme = useCallback(() => {
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const nextTheme = theme === "dark" ? "light" : "dark";

    const phaseMs = 2500;

    if (prefersReducedMotion) {
      setDocumentTheme(nextTheme);
      return;
    }

    // Enable slow transitions only during the toggle window.
    document.documentElement.dataset.themeTransition = "1";
    document.documentElement.dataset.bgStage = "to-gray";

    if (themeTransitionTimeoutRef.current != null) {
      window.clearTimeout(themeTransitionTimeoutRef.current);
    }

    if (bgStageTimeoutRef.current != null) {
      window.clearTimeout(bgStageTimeoutRef.current);
    }

    // Stage 1: current -> gray
    bgStageTimeoutRef.current = window.setTimeout(() => {
      // Stage 2: gray -> target
      setDocumentTheme(nextTheme);
      document.documentElement.dataset.bgStage = "to-target";
      bgStageTimeoutRef.current = null;
    }, phaseMs);

    themeTransitionTimeoutRef.current = window.setTimeout(() => {
      delete document.documentElement.dataset.themeTransition;
      delete document.documentElement.dataset.bgStage;
      themeTransitionTimeoutRef.current = null;
    }, phaseMs * 2 + 150);
  }, [theme]);

  useEffect(() => {
    return () => {
      if (themeTransitionTimeoutRef.current != null) {
        window.clearTimeout(themeTransitionTimeoutRef.current);
      }
      if (bgStageTimeoutRef.current != null) {
        window.clearTimeout(bgStageTimeoutRef.current);
      }
    };
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

  return (
    <nav aria-label="Primary" className={className}>
      <div
        ref={containerRef}
        className="relative inline-flex items-center gap-1 rounded-full border border-foreground/15 bg-background/55 p-1 shadow-sm backdrop-blur-md"
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

        <button
          type="button"
          onClick={toggleTheme}
          role="switch"
          aria-checked={theme === "dark"}
          aria-label="Toggle theme"
          className="relative z-10 ml-1 inline-flex h-10 w-24 items-center rounded-full border border-foreground/15 bg-background/55 p-1 shadow-sm backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
          style={{
            boxShadow:
              "inset 0 2px 6px color-mix(in oklab, var(--foreground) 14%, transparent), inset 0 -2px 6px color-mix(in oklab, var(--background) 30%, transparent)",
          }}
        >
          <span
            aria-hidden="true"
            className={
              "absolute left-1 top-1 h-8 w-8 rounded-full border border-foreground/15 bg-background shadow-sm transition-transform duration-300 ease-out " +
              (theme === "dark" ? "translate-x-14" : "translate-x-0")
            }
            style={{
              boxShadow:
                "0 6px 18px color-mix(in oklab, var(--foreground) 18%, transparent), inset 0 1px 0 color-mix(in oklab, var(--background) 45%, transparent)",
            }}
          />

          <span
            aria-hidden="true"
            className={
              "relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 " +
              (theme === "light" ? "text-foreground" : "text-foreground/45")
            }
          >
            <SunIcon className="h-5 w-5" />
          </span>
          <span
            aria-hidden="true"
            className={
              "relative z-10 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 " +
              (theme === "dark" ? "text-foreground" : "text-foreground/45")
            }
          >
            <MoonIcon className="h-5 w-5" />
          </span>
        </button>
      </div>
    </nav>
  );
}
