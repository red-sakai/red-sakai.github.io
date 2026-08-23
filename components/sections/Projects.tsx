"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
	const [stackMenuOpen, setStackMenuOpen] = useState(false);
	const stackMenuRef = useRef<HTMLDivElement>(null);
	const [lightbox, setLightbox] = useState<{ images: string[]; index: number; alt: string } | null>(null);
	const { ref, visible } = useRevealOnScroll<HTMLElement>();

	useEffect(() => {
		if (!stackMenuOpen) return;
		const onPointerDown = (event: MouseEvent) => {
			if (stackMenuRef.current && !stackMenuRef.current.contains(event.target as Node)) {
				setStackMenuOpen(false);
			}
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setStackMenuOpen(false);
		};
		document.addEventListener("mousedown", onPointerDown);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onPointerDown);
			document.removeEventListener("keydown", onKey);
		};
	}, [stackMenuOpen]);

	const toggleStackFilter = (key: string) => {
		setStackFiltersSelected((prev) =>
			prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
		);
	};

	const stackLabel = (key: string) =>
		stackFilters.find((f) => f.key === key)?.label ?? key;

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

				<div className="flex flex-wrap items-center justify-center gap-3 pt-1">
					<div className="inline-flex rounded-md border border-slate-200 p-1 dark:border-white/10">
						{typeFilters.map((item) => (
							<button
								key={item.key}
								type="button"
								onClick={() => setTypeFilter(item.key)}
								className={`rounded-[5px] px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-200 ${
									typeFilter === item.key
										? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
										: "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
								}`}
							>
								{item.label}
							</button>
						))}
					</div>

					<div className="relative" ref={stackMenuRef} data-lenis-prevent>
						<button
							type="button"
							aria-haspopup="listbox"
							aria-expanded={stackMenuOpen}
							onClick={() => setStackMenuOpen((open) => !open)}
							className={`${filterBase} inline-flex items-center gap-2 ${
								stackFiltersSelected.length > 0 ? filterActive : filterInactive
							} ${stackMenuOpen ? "border-slate-400 dark:border-white/30" : ""}`}
						>
							Tech stack
							{stackFiltersSelected.length > 0 && (
								<span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white/25 px-1 text-[10px] leading-none dark:bg-slate-900/20">
									{stackFiltersSelected.length}
								</span>
							)}
							<span
								aria-hidden
								className={`text-[10px] transition-transform duration-200 ${stackMenuOpen ? "rotate-180" : ""}`}
							>
								▼
							</span>
						</button>

						{stackMenuOpen && (
							<div className="absolute left-1/2 z-20 mt-2 w-60 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/40">
								<div className="flex items-center justify-between gap-2 px-2 pb-2 pt-1">
									<span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
										Filter by stack
									</span>
									{stackFiltersSelected.length > 0 && (
										<button
											type="button"
											onClick={() => setStackFiltersSelected([])}
											className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-blue-700 dark:text-slate-400 dark:decoration-white/25 dark:hover:text-blue-300"
										>
											Clear
										</button>
									)}
								</div>
								<div className="terminal-scrollbar max-h-64 overscroll-contain overflow-y-auto">
									{stackFilters
										.filter((item) => item.key !== "all")
										.map((item) => {
											const isActive = stackFiltersSelected.includes(item.key);
											return (
												<button
													key={item.key}
													type="button"
													aria-pressed={isActive}
													onClick={() => toggleStackFilter(item.key)}
													className={`flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
														isActive
															? "text-slate-900 dark:text-white"
															: "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
													}`}
												>
													{item.label}
													<span
														aria-hidden
														className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border ${
															isActive
																? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
																: "border-slate-300 dark:border-white/25"
														}`}
													>
														{isActive && (
															<svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.8">
																<path d="M1.5 5.5l2.5 2.5L8.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
															</svg>
														)}
													</span>
												</button>
											);
										})}
								</div>
							</div>
						)}
					</div>
				</div>

				{stackFiltersSelected.length > 0 && (
					<div className="flex flex-wrap items-center justify-center gap-2">
						{stackFiltersSelected.map((key) => (
							<button
								key={key}
								type="button"
								aria-label={`Remove ${stackLabel(key)} filter`}
								onClick={() => toggleStackFilter(key)}
								className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-600 transition-colors hover:border-red-400 hover:text-red-600 dark:border-white/20 dark:text-slate-300 dark:hover:border-red-400/70 dark:hover:text-red-400"
							>
								{stackLabel(key)}
								<span aria-hidden>×</span>
							</button>
						))}
					</div>
				)}

				<p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
					{filtered.length} {filtered.length === 1 ? "project" : "projects"}
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{filtered.map((project, index) => (
					<article
						key={`${project.category}-${project.title}-${index}`}
						className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors duration-300 hover:border-slate-400/70 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
					>
						{project.image && (
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
								className="group/preview relative cursor-zoom-in overflow-hidden border-b border-slate-100 bg-slate-50 focus-visible:outline-none dark:border-white/5 dark:bg-white/[0.04]"
							>
								<div
									className="aspect-video w-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
									style={{ backgroundImage: `url(${project.image})` }}
									role="img"
									aria-label={`${project.title} preview`}
								/>
								<span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 text-sm font-semibold text-white opacity-0 transition group-hover/preview:bg-black/40 group-hover/preview:opacity-100">
									Click to enlarge
								</span>
							</div>
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
