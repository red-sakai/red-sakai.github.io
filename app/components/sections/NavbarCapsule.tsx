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
};

const defaultItems: NavbarCapsuleItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
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
      </div>
    </nav>
  );
}
