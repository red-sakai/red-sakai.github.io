"use client";

import { useMemo, useState } from "react";
import projectsData from "@/data/projects.json";
import type { ProjectType, ProjectItem } from "@/types/domain";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { Lightbox } from "@/components/ui/Lightbox";

const typeFilters: Array<{ key: "all" | ProjectType; label: string }> = [
	{ key: "all", label: "All" },
	{ key: "personal", label: "Personal" },
	{ key: "commissioned", label: "Commissioned" },
	{ key: "hackathon", label: "Hackathons" },
];

const stackFilters: Array<{ key: "all" | string; label: string }> = [
	{ key: "all", label: "All" },
	{ key: "python", label: "Python" },
	{ key: "next.js", label: "Next.js" },
	{ key: "react.js", label: "React.js" },
	{ key: "javascript", label: "JavaScript" },
	{ key: "flutter", label: "Flutter" },
	{ key: "mysql", label: "MySQL" },
	{ key: "postgresql", label: "PostgreSQL" },
	{ key: "supabase", label: "Supabase" },
	{ key: "ai integrated", label: "AI Integrated" },
	{ key: "digitalocean", label: "DigitalOcean" },
	{ key: "flask", label: "Flask" },
	{ key: "unity engine", label: "Unity Engine" },
	{ key: "c#", label: "C#" },
];

const filterBase =
	"rounded-md border px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-200";

const filterActive =
	"border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900";

const filterInactive =
	"border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-900 dark:border-white/10 dark:text-slate-400 dark:hover:border-white/25 dark:hover:text-white";

const statusDotClass: Record<NonNullable<ProjectItem["status"]>, string> = {
	"in-progress": "bg-amber-500",
	beta: "bg-blue-500",
	shipped: "bg-emerald-500",
	discontinued: "bg-red-500",
};

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

export function ProjectsSection() {
	const [stackFiltersSelected, setStackFiltersSelected] = useState<string[]>([]);
	const [typeFilter, setTypeFilter] = useState<"all" | ProjectType>("all");
	const [lightbox, setLightbox] = useState<{ images: string[]; index: number; alt: string } | null>(null);
	const { ref, visible } = useRevealOnScroll<HTMLElement>();
	const [lightbox, setLightbox] = useState<ProjectItem | null>(null);

	const openPreview = (project: ProjectItem) => {
		if (project.image) {
			setLightbox({ images: [project.image], index: 0, alt: `${project.title} preview` });
		}
	};

	const projects = useMemo(() => projectsData as ProjectItem[], []);
	const filtered = useMemo(() => {
		return projects.filter((item) => {
			const matchesStack = stackFiltersSelected.length === 0
				? true
				: stackFiltersSelected.every((needle) =>
					item.stack.some((tech) => tech.toLowerCase() === needle)
				);
			const matchesType = typeFilter === "all" ? true : item.projectType === typeFilter;
			return matchesStack && matchesType;
		});
	}, [projects, stackFiltersSelected, typeFilter]);

	return (
		<section
			id="projects"
			ref={ref}
			className={
				"scroll-mt-28 space-y-8 transition-all duration-700 will-change-transform " +
				(visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
			}
		>
			<div className="flex flex-col items-center gap-4 text-center">
				<div className="space-y-2">
					<p className="text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-500">Projects</p>
					<h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Featured work</h2>
					<p className="mx-auto max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300/90">
						Security-minded builds, study projects, and shipped experiments.
					</p>
				</div>

				<div className="flex flex-wrap justify-center gap-2 pt-1">
					{typeFilters.map((item) => (
						<button
							key={item.key}
							type="button"
							onClick={() => setTypeFilter(item.key)}
							className={`${filterBase} ${typeFilter === item.key ? filterActive : filterInactive}`}
						>
							{item.label}
						</button>
					))}
				</div>

				<div className="flex flex-wrap justify-center gap-2">
					{stackFilters.map((item) => {
						const isShowAll = item.key === "all";
						const isActive = isShowAll ? stackFiltersSelected.length === 0 : stackFiltersSelected.includes(item.key);
						return (
							<button
								key={item.key}
								type="button"
								onClick={() => {
									if (isShowAll) {
										setStackFiltersSelected([]);
										return;
									}
									setStackFiltersSelected((prev) => {
										if (prev.includes(item.key)) return prev.filter((k) => k !== item.key);
										return [...prev, item.key];
									});
								}}
								className={`${filterBase} ${isActive ? filterActive : filterInactive}`}
							>
								{item.label}
							</button>
						);
					})}
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{filtered.map((project) => (
					<article
						key={project.title}
						className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors duration-300 hover:border-slate-400/70 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
					>
						{project.image && (
<<<<<<< HEAD
							<div
								role="button"
								tabIndex={0}
								aria-label={`View ${project.title} preview fullscreen`}
								onClick={() => openPreview(project)}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										openPreview(project);
									}
								}}
								className="cursor-zoom-in overflow-hidden border-b border-slate-100 bg-slate-50 focus-visible:outline-none dark:border-white/5 dark:bg-white/[0.04]"
							>
								<div
									className="aspect-video w-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
=======
							<button
								type="button"
								onClick={() => setLightbox(project)}
								className="group relative block w-full overflow-hidden rounded-xl border border-slate-200/60 bg-slate-100 dark:border-white/10 dark:bg-white/5"
								aria-label={`Enlarge ${project.title} preview`}
							>
								<div
									className="aspect-video w-full bg-cover bg-center transition duration-300 group-hover:scale-[1.02]"
>>>>>>> d4e91d235450c9afff59410ccce368b10da8c92d
									style={{ backgroundImage: `url(${project.image})` }}
									role="img"
									aria-label={`${project.title} preview`}
								/>
								<span className="absolute inset-0 flex items-center justify-center bg-black/0 text-sm font-semibold text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
									Click to enlarge
								</span>
							</button>
						)}

						<div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
							<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
								<span className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
									{project.category}
									{project.period ? ` · ${project.period}` : ""}
								</span>
								{project.status && (
									<span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
										<span aria-hidden className={`h-1.5 w-1.5 rounded-full ${statusDotClass[project.status]}`} />
										{project.status.replace("-", " ")}
									</span>
								)}
							</div>

							<h3 className="text-lg font-semibold leading-snug tracking-tight">{project.title}</h3>

							<p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300/90">{project.summary}</p>

							{Array.isArray(project.highlights) && project.highlights.length > 0 && (
								<ul className="flex flex-col gap-2 border-l border-slate-200 pl-4 dark:border-white/10">
									{project.highlights.map((point) => (
										<li key={point} className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
											{point}
										</li>
									))}
								</ul>
							)}

							<div className="mt-auto flex flex-col gap-3 pt-2">
								<TagRow tags={project.stack} />

								{project.links && project.links.length > 0 && (
									<div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-3 dark:border-white/5">
										{project.links.map((link) => (
											<a
												key={`${project.title}-${link.href}-${link.label}`}
												href={link.href}
												className="group/link inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.12em] text-slate-600 transition-colors hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-300"
											>
												{link.label}
												<span aria-hidden className="transition-transform duration-300 group-hover/link:translate-x-0.5">→</span>
											</a>
										))}
									</div>
								)}
							</div>
						</div>
					</article>
				))}

				{filtered.length === 0 && (
					<article className="col-span-full flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-white/15">
						<h3 className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
							No matching projects
						</h3>
						<p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
							Try clearing a filter — new case studies are being polished and will ship shortly.
						</p>
					</article>
				)}
			</div>

<<<<<<< HEAD
			{lightbox && (
				<Lightbox
					images={lightbox.images}
					index={lightbox.index}
					alt={lightbox.alt}
=======
			{lightbox?.image && (
				<Lightbox
					src={lightbox.image}
					alt={`${lightbox.title} preview`}
					caption={lightbox.title}
>>>>>>> d4e91d235450c9afff59410ccce368b10da8c92d
					onClose={() => setLightbox(null)}
				/>
			)}
		</section>
	);
}
