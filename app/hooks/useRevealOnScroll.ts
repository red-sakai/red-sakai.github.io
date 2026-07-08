"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

export function useRevealOnScroll<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  const revealedRef = useRef(false);
  const lenis = useLenis();

  useEffect(() => {
    const node = ref.current;
    if (!node || revealedRef.current) return;

    const checkVisibility = () => {
      if (!node || revealedRef.current) return;
      const rect = node.getBoundingClientRect();
      const threshold = window.innerHeight * 0.85;
      if (rect.top < threshold) {
        revealedRef.current = true;
        setVisible(true);
      }
    };

    checkVisibility();

    if (lenis) {
      lenis.on("scroll", checkVisibility);
    }

    return () => {
      if (lenis) {
        lenis.off("scroll", checkVisibility);
      }
    };
  }, [lenis]);

  return { ref, visible } as const;
}
