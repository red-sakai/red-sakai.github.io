"use client";

import { useEffect, useState } from "react";
import experienceData from "../../data/experience.json";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";

type ExperienceCategory = "professional" | "organizational" | "competitive";

type ExperienceItem = {
  title: string;
  blurb: string;
  category: ExperienceCategory;
  company?: string;
  organization?: string;
  competition?: string;
  orgType?: string;
  date?: string;
  placement?: string;
  tags?: string[];
  images?: string[];
  image?: string;
};

const experienceTabs = [
  { key: "organizational" as const, label: "Organizational" },
  { key: "competitive" as const, label: "Competitive" },
  { key: "professional" as const, label: "Professional" },
];

export function ExperienceSection() {
  const [experienceTab, setExperienceTab] = useState<ExperienceCategory>("organizational");
  const { ref, visible } = useRevealOnScroll<HTMLElement>();

  const filtered = (experienceData as ExperienceItem[]).filter((item) => item.category === experienceTab);
  const accentByCategory: Record<ExperienceCategory, string> = {
    professional: "from-emerald-500/80 to-emerald-400/80",
    organizational: "from-blue-500/80 to-indigo-500/80",
    competitive: "from-amber-500/80 to-red-500/80",
  };

  const entityLabel = (item: ExperienceItem) => {
    if (experienceTab === "professional") return item.company ?? "Company TBD";
    if (experienceTab === "organizational") return item.organization ?? "Organization TBD";
    return item.competition ?? "Competition TBD";
  };

  const orgBadgeClass = (orgTypeRaw: string | undefined) => {
    const orgType = (orgTypeRaw || "").toLowerCase();
    if (orgType === "leadership") return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-500/30";
    if (orgType === "membership") return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-200 dark:border-blue-500/30";
    if (orgType === "volunteering") return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-500/30";
    return "bg-slate-100 text-black border-slate-200 dark:bg-white/10 dark:text-white/80 dark:border-white/15";
  };

  const ImageCarousel = ({ images }: { images: string[] }) => {
    const safeImages = images.filter(Boolean);
    const [idx, setIdx] = useState(0);
    const [prevIdx, setPrevIdx] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);

    useEffect(() => {
      if (safeImages.length <= 1) return;
      const id = window.setInterval(() => {
        setIdx((prev) => {
          const next = (prev + 1) % safeImages.length;
          setPrevIdx(prev);
          setDirection(1);
          return next;
        });
      }, 4200);
      return () => window.clearInterval(id);
    }, [safeImages.length]);

    useEffect(() => {
      setIdx(0);
      setPrevIdx(0);
    }, [safeImages.length]);

    const current = safeImages[idx];
    const previous = safeImages[prevIdx];
    const hasMultiple = safeImages.length > 1;

    const inClass = direction === 1
      ? "animate-[carousel-in-right_0.7s_ease-out_forwards]"
      : "animate-[carousel-in-left_0.7s_ease-out_forwards]";
    const outClass = direction === 1
      ? "animate-[carousel-out-left_0.7s_ease-out_forwards]"
      : "animate-[carousel-out-right_0.7s_ease-out_forwards]";

    return (
      <div className="relative overflow-hidden rounded-xl border border-slate-200/70 bg-slate-100 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="relative aspect-video w-full">
          {previous && hasMultiple && previous !== current && (
            <div
              key={`prev-${prevIdx}`}
              className={`absolute inset-0 bg-cover bg-center ${outClass}`}
              style={{ backgroundImage: `url(${previous})` }}
              aria-hidden
            />
          )}

          {current ? (
            <div
              key={`cur-${idx}`}
              className={`absolute inset-0 bg-cover bg-center ${hasMultiple ? inClass : ""}`}
              style={{ backgroundImage: `url(${current})` }}
              role="img"
              aria-label="Experience imagery"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
              Image coming soon
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section
      id="experience"
      ref={ref}
      className={
        "scroll-mt-28 space-y-6 transition-all duration-700 will-change-transform " +
        (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
      }
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Experience</p>
        <h2 className="text-2xl font-semibold sm:text-3xl">Hands-on work</h2>
        <p className="exp-neutral max-w-3xl text-base leading-relaxed text-slate-800 dark:text-slate-200/80">
          A mix of professional builds, organizational leadership, and competitive development settings.
        </p>
        <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 p-1 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-blue-100 dark:bg-white/5 dark:text-white dark:ring-white/10">
          {experienceTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setExperienceTab(tab.key)}
              className={`exp-tab rounded-full px-4 py-2 transition ${
                experienceTab === tab.key
                  ? "bg-blue-600 text-white shadow"
                  : "text-black hover:bg-blue-100 dark:text-white dark:hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {filtered.map((item) => (
          <article
            key={item.title}
            className="exp-card relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
          >
            <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${accentByCategory[experienceTab]}`} aria-hidden />
            <ImageCarousel images={item.images ?? (item.image ? [item.image] : [])} />

            <div className="flex flex-col items-center text-center gap-1">
              <h3 className="exp-neutral text-lg font-semibold leading-snug text-slate-900 dark:text-white">{item.title}</h3>
              <p className="exp-neutral text-xs font-semibold uppercase tracking-[0.16em] text-slate-800 dark:text-slate-300">{entityLabel(item)}</p>
              {experienceTab === "organizational" && item.orgType && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <span className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${orgBadgeClass(item.orgType)}`}>
                    {item.orgType}
                  </span>
                  {item.date && (
                    <span className="exp-neutral inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-900 shadow-sm dark:border-white/15 dark:text-slate-200">
                      {item.date}
                    </span>
                  )}
                </div>
              )}
              {experienceTab === "competitive" && (item.placement || item.date) && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {item.placement && (
                    <span className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-800 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-100">
                      {item.placement}
                    </span>
                  )}
                  {item.date && (
                    <span className="exp-neutral inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-900 shadow-sm dark:border-white/15 dark:text-slate-200">
                      {item.date}
                    </span>
                  )}
                </div>
              )}
            </div>
            <p className="exp-neutral text-sm leading-relaxed text-slate-900 dark:text-slate-200/80 text-center sm:text-left">{item.blurb}</p>

            {Array.isArray(item.tags) && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="exp-tag exp-neutral rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}

        {experienceTab === "professional" && filtered.length === 0 && (
          <article className="exp-card col-span-full flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200/70 bg-white/60 p-6 text-center text-black shadow-none dark:border-white/15 dark:bg-white/5 dark:text-slate-200/80">
            <h3 className="exp-neutral text-lg font-semibold">No professional experience yet</h3>
            <p className="exp-neutral text-sm leading-relaxed">
              I&apos;m currently seeking my first professional opportunity. Open to internships, apprenticeships, and entry-level roles.
            </p>
          </article>
        )}
      </div>
    </section>
  );
}
