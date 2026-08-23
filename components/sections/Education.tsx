import Image from "next/image";
import educationData from "@/data/education.json";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

function TagRow({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
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

export function EducationSection() {
  const { ref } = useRevealOnScroll<HTMLElement>();

  return (
    <section
      id="education"
      ref={ref}
      className="scroll-mt-28 space-y-8 will-change-transform"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-500">Education</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Building from classroom to real systems</h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300/90">
            Two tracks that shaped how I work: rigorous STEM foundations in high school, and computer engineering with a security lens in college.
          </p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 text-left">
        {educationData.map((edu, index) => (
          <article
            key={edu.school}
            className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-6 transition-colors duration-300 hover:border-slate-400/70 sm:p-7 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
          >
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-full translate-x-full overflow-hidden transition-transform duration-700 ease-out group-hover:translate-x-0 sm:w-1/2"
              aria-hidden
            >
              <div className="absolute inset-0 bg-gradient-to-l from-white via-white/90 to-transparent dark:from-[#0b1220] dark:via-[#0b1220]/90" />
              <div className="relative flex h-full items-center justify-end pr-10 sm:justify-center sm:pr-6">
                {edu.logo ? (
                  <Image
                    src={edu.logo}
                    alt=""
                    width={768}
                    height={768}
                    className="h-[85%] w-auto max-w-[70%] object-contain transition-transform duration-500 group-hover:scale-105 sm:max-w-[55%]"
                  />
                ) : (
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    Logo
                  </span>
                )}
              </div>
            </div>

            <div className="relative flex min-w-0 flex-1 flex-col gap-2.5">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                {String(index + 1).padStart(2, "0")} · {edu.years}
              </p>

              <h3 className="text-lg font-semibold leading-snug tracking-tight">{edu.title}</h3>

              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">{edu.school}</p>

              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                {edu.location}
              </p>

              <p className="max-w-2xl pt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300/90">
                {edu.blurb}
              </p>

              <div className="pt-2">
                <TagRow tags={edu.tags} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
