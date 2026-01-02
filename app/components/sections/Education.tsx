import Image from "next/image";
import educationData from "../../data/education.json";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";

export function EducationSection() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();

  return (
    <section
      id="education"
      ref={ref}
      className={
        "scroll-mt-28 rounded-3xl p-6 transition-all duration-700 will-change-transform " +
        (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6") +
        " bg-transparent shadow-none backdrop-blur-0"
      }
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-600">Education</p>
          <h2 className="text-2xl font-semibold sm:text-3xl">Building from classroom to real systems</h2>
          <p className="text-base leading-relaxed text-slate-700 dark:text-slate-200/80">
            Two tracks that shaped how I work: rigorous STEM foundations in high school, and computer engineering with a security lens in college.
          </p>
        </div>

        <div className="w-full space-y-4 text-left">
          {educationData.map((edu) => (
            <article
              key={edu.school}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-lg backdrop-blur-lg transition hover:-translate-y-1.5 hover:shadow-2xl dark:border-white/10 dark:bg-white/10"
            >
              <div className={`absolute inset-y-0 left-0 w-2 bg-gradient-to-b ${edu.accent}`} aria-hidden />

              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-2/3 sm:w-1/2 translate-x-full overflow-hidden transition-transform duration-700 ease-out group-hover:translate-x-0"
                aria-hidden
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: edu.logo ? `url(${edu.logo})` : undefined,
                    backgroundColor: edu.logo ? undefined : "rgba(255,255,255,0.9)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-white via-white/85 to-transparent dark:from-[#0b1220] dark:via-[#0b1220]/85" />
                <div className="relative flex h-full items-center justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/70 bg-white/90 shadow-xl shadow-black/10 backdrop-blur-md transition-transform duration-500 group-hover:scale-105 dark:border-white/20 dark:bg-white/10 dark:shadow-black/40">
                    {edu.logo ? (
                      <Image
                        src={edu.logo}
                        alt={`${edu.school} logo`}
                        width={64}
                        height={64}
                        className="h-16 w-16 object-contain drop-shadow"
                      />
                    ) : (
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-200">
                        Logo
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <p className="text-lg font-semibold leading-tight text-slate-900 dark:text-slate-50">{edu.title}</p>
                    <p className="text-base font-semibold text-blue-600 dark:text-blue-300">{edu.school}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:bg-white/10 dark:text-white/80">
                    {edu.years}
                  </span>
                </div>
                <p className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <span aria-hidden>📍</span>
                  {edu.location}
                </p>
                <p className="text-base leading-relaxed text-slate-700 dark:text-slate-200/80">{edu.blurb}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {edu.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
