"use client";

import type { JSX } from "react";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";

export function Footer() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();

  return (
    <footer
      id="footer"
      ref={ref}
      className={
        "relative z-10 mt-6 scroll-mt-28 border-t border-slate-200/70 bg-white/80 backdrop-blur-md transition-all duration-700 will-change-transform dark:border-white/10 dark:bg-[#0b1220]/80 " +
        (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
      }
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10 lg:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Contact</p>
            <h2 className="text-2xl font-semibold sm:text-3xl text-slate-700 dark:text-slate-100">Let&apos;s collaborate</h2>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200/80">
              Need a resilient prototype, a security-minded review, or a teammate who documents as they build? I would love to help.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-3">
              <IconLink
                href="mailto:jheredmiguelrepublica14@gmail.com"
                label="Email"
                icon={(className) => (
                  <svg className={className} viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor" fill="none" aria-hidden>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m4 6 8 7 8-7" />
                  </svg>
                )}
              />
              <IconLink
                href="https://github.com/red-sakai"
                label="GitHub"
                newTab
                icon={(className) => (
                  <svg className={className} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" aria-hidden>
                    <path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18 3.77a5.07 5.07 0 0 0-.09-3.77S16.73-.35 13 2a13.38 13.38 0 0 0-4 0C5.27-.35 4.09.08 4.09.08A5.07 5.07 0 0 0 4 3.77 5.44 5.44 0 0 0 2.5 7.52c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 15.13V19" />
                  </svg>
                )}
              />
              <IconLink
                href="https://www.linkedin.com/in/jrepublica/"
                label="LinkedIn"
                newTab
                icon={(className) => (
                  <svg className={className} viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor" fill="none" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="2.2" />
                    <path d="M8 17v-6" />
                    <circle cx="8" cy="8" r="1" />
                    <path d="M12 17v-3.5a2.5 2.5 0 0 1 5 0V17" />
                  </svg>
                )}
              />
            </div>

            <div className="flex flex-col gap-2 text-slate-700 dark:text-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Location</span>
                <span>Manila, PH</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Email</span>
                <span className="text-slate-800 dark:text-slate-100">jheredmiguelrepublica14@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-200/70 pt-6 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
          <span>Always open to collaborate on secure builds, prototypes, and teaching.</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">(c) {new Date().getFullYear()} Jhered Miguel Republica</span>
        </div>
      </div>
    </footer>
  );
}

type IconLinkProps = {
  href: string;
  label: string;
  newTab?: boolean;
  icon: (className: string) => JSX.Element;
};

function IconLink({ href, label, newTab = false, icon }: IconLinkProps) {
  return (
    <a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noreferrer" : undefined}
      className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:-translate-y-[2px] hover:border-amber-400 hover:text-amber-600 dark:border-white/15 dark:bg-[#0f172a] dark:text-white dark:hover:border-amber-400"
      aria-label={label}
    >
      {icon("h-5 w-5")}
      <span className="sr-only">{label}</span>
    </a>
  );
}
