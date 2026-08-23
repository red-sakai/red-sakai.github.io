"use client";

import { useEffect, useMemo, useState } from "react";
import experienceData from "@/data/experience.json";
import type { ExperienceCategory, ExperienceItem, OrgGroup } from "@/types/domain";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { Lightbox } from "@/components/ui/Lightbox";

const experienceTabs = [
  { key: "organizational" as const, label: "Organizational" },
  { key: "competitive" as const, label: "Competitive" },
  { key: "professional" as const, label: "Professional" },
];

const cardClass =
  "group relative flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 transition-colors duration-300 hover:border-slate-400/70 sm:p-6 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20";

const kickerClass =
  "font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500";

function TagRow({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
      {tags.map((tag, idx) => (
        <span key={tag} className="inline-flex items-center gap-2">
          {tag}
          {idx < tags.length - 1 && (
            <span aria-hidden className="text-slate-300 dark:text-white/20">/</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function ExperienceSection() {
  const [experienceTab, setExperienceTab] = useState<ExperienceCategory>("organizational");
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number; alt: string } | null>(null);
  const { ref, visible } = useRevealOnScroll<HTMLElement>();

  const items = experienceData as ExperienceItem[];
  const filtered = items.filter((item) => item.category === experienceTab);

  const orgGroups = useMemo(() => {
    const orgItems = items.filter((item) => item.category === "organizational");
    const map = new Map<string, OrgGroup>();
    for (const item of orgItems) {
      const key = item.organization ?? "Other";
      if (map.has(key)) {
        const group = map.get(key)!;
        group.positions.push({ title: item.title, date: item.date, blurb: item.blurb });
        if (item.tags) group.tags.push(...item.tags);
      } else {
        map.set(key, {
          organization: key,
          orgType: item.orgType ?? "",
          positions: [{ title: item.title, date: item.date, blurb: item.blurb }],
          tags: [...(item.tags ?? [])],
          images: [...(item.images ?? (item.image ? [item.image] : []))],
        });
      }
    }
    return Array.from(map.values());
  }, [items]);

  const entityLabel = (item: ExperienceItem) => {
    if (experienceTab === "professional") return item.company ?? "Company TBD";
    if (experienceTab === "organizational") return item.organization ?? "Organization TBD";
    return item.competition ?? "Competition TBD";
  };

  const ImageCarousel = ({ images, alt }: { images: string[]; alt: string }) => {
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

    const openFullscreen = () => {
      if (current) setLightbox({ images: safeImages, index: idx, alt });
    };

    const inClass = direction === 1
      ? "animate-[carousel-in-right_0.7s_ease-out_forwards]"
      : "animate-[carousel-in-left_0.7s_ease-out_forwards]";
    const outClass = direction === 1
      ? "animate-[carousel-out-left_0.7s_ease-out_forwards]"
      : "animate-[carousel-out-right_0.7s_ease-out_forwards]";

    return (
      <div className="relative overflow-hidden rounded-md border border-slate-200/80 bg-slate-50 transition-colors duration-300 group-hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.04] dark:group-hover:border-white/15">
        <div
          role={current ? "button" : undefined}
          tabIndex={current ? 0 : undefined}
          aria-label={current ? `View ${alt} image fullscreen` : undefined}
          onClick={current ? openFullscreen : undefined}
          onKeyDown={
            current
              ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openFullscreen();
                  }
                }
              : undefined
          }
          className={`relative aspect-video w-full focus-visible:outline-none ${current ? "cursor-zoom-in" : ""}`}
        >
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
              aria-label={`${alt} imagery`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Image coming soon
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOrganizationalCards = () =>
    orgGroups.map((group) => (
      <article key={group.organization} className={cardClass}>
        <ImageCarousel images={group.images} alt={group.organization} />

        {group.orgType && (
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
            {group.orgType}
          </p>
        )}

        <h3 className="text-lg font-semibold leading-snug tracking-tight">{group.organization}</h3>

        <ul className="-my-1 flex flex-col divide-y divide-slate-100 dark:divide-white/5">
          {group.positions.map((pos) => (
            <li key={pos.title} className="flex flex-col gap-1 py-3 first:pt-1 last:pb-1">
              <span className="text-sm font-semibold leading-snug">{pos.title}</span>
              {pos.date && (
                <span className="font-mono text-[11px] tracking-wide text-slate-400 dark:text-slate-500">
                  {pos.date}
                </span>
              )}
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{pos.blurb}</p>
            </li>
          ))}
        </ul>

        {group.tags.length > 0 && <TagRow tags={[...new Set(group.tags)]} />}
      </article>
    ));

  const renderDefaultCards = () =>
    filtered.map((item, index) => (
      <article key={item.title} className={cardClass}>
        <ImageCarousel images={item.images ?? (item.image ? [item.image] : [])} alt={item.title} />

        <p className={kickerClass}>
          {String(index + 1).padStart(2, "0")} · {entityLabel(item)}
        </p>

        <h3 className="text-lg font-semibold leading-snug tracking-tight">{item.title}</h3>

        {item.date && (
          <p className="font-mono text-[11px] tracking-wide text-slate-400 dark:text-slate-500">
            {item.date}
          </p>
        )}

        {experienceTab === "professional" && item.orgType && (
          <span className="w-fit font-mono text-[11px] uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
            {item.orgType}
          </span>
        )}
        {experienceTab === "competitive" && item.placement && (
          <span className="w-fit font-mono text-[11px] uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
            {item.placement}
          </span>
        )}

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300/90">{item.blurb}</p>

        {Array.isArray(item.tags) && item.tags.length > 0 && <TagRow tags={item.tags} />}
      </article>
    ));

  return (
    <section
      id="experience"
      ref={ref}
      className={
        "scroll-mt-28 space-y-8 transition-all duration-700 will-change-transform " +
        (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
      }
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-500">Experience</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Hands-on work</h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300/90">
            A mix of professional builds, organizational leadership, and competitive development settings.
          </p>
        </div>
        <div className="inline-flex rounded-md border border-slate-200 p-1 dark:border-white/10">
          {experienceTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setExperienceTab(tab.key)}
              className={`rounded-[5px] px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-200 ${
                experienceTab === tab.key
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {experienceTab === "organizational"
          ? renderOrganizationalCards()
          : renderDefaultCards()}
      </div>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
