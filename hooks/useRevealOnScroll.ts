"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Header bits ([data-reveal]) rise first, then the section's cards stagger in. Plays once.
export function useRevealOnScroll<T extends Element>() {
  const ref = useRef<T | null>(null);

  useGSAP(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const header = node.querySelectorAll("[data-reveal]");
    const cards = node.querySelectorAll("article");
    const tl = gsap.timeline({
      defaults: { ease: "power3.out", clearProps: "transform,opacity,visibility" },
      scrollTrigger: { trigger: node, start: "top 85%", once: true },
    });

    if (!header.length && !cards.length) {
      tl.from(node, { y: 32, autoAlpha: 0, duration: 0.9 });
      return;
    }
    if (header.length) tl.from(header, { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.08 });
    if (cards.length) tl.from(cards, { y: 36, autoAlpha: 0, duration: 0.8, stagger: 0.09 }, header.length ? "-=0.45" : 0);
  }, { scope: ref });

  return { ref } as const;
}
