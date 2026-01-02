"use client";

import { useMemo, useState } from "react";
import projectsData from "../../data/projects.json";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";

type ProjectCategory = "web" | "security" | "tools" | "learning" | "emergency" | "game" | "bot";
type ProjectType = "personal" | "commissioned" | "hackathon";

type ProjectLink = {
	label: string;
	href: string;
	type?: "repo" | "demo";
};

type ProjectItem = {
	title: string;
	summary: string;
	category: ProjectCategory;
	projectType: ProjectType;
	stack: string[];
	image?: string;
	highlights?: string[];
	links?: ProjectLink[];
	status?: "in-progress" | "beta" | "shipped" | "discontinued";
	period?: string;
};

const typeFilters: Array<{ key: "all" | ProjectType; label: string }> = [
	{ key: "all", label: "Show All" },
	{ key: "personal", label: "Personal" },
	{ key: "commissioned", label: "Commissioned" },
	{ key: "hackathon", label: "Hackathons" },
];

const stackFilters: Array<{ key: "all" | string; label: string }> = [
	{ key: "all", label: "Show All" },
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

const accentByCategory: Record<ProjectCategory, string> = {
	web: "from-blue-500/80 to-indigo-500/80",
	security: "from-amber-500/80 to-rose-500/80",
	tools: "from-emerald-500/80 to-teal-500/80",
	learning: "from-slate-500/80 to-blue-500/80",
	emergency: "from-red-600/85 via-amber-500/80 to-orange-400/75",
	game: "from-purple-500/80 via-indigo-500/80 to-cyan-400/75",
	bot: "from-teal-500/80 via-emerald-500/80 to-lime-400/75",
};

const statusTone: Record<NonNullable<ProjectItem["status"]>, string> = {
	"in-progress": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-100 dark:border-amber-500/30",
	beta: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-50 dark:border-blue-500/30",
	shipped: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-50 dark:border-emerald-500/30",
	discontinued: "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-100 dark:border-red-500/30",
};

export function ProjectsSection() {
	const [stackFiltersSelected, setStackFiltersSelected] = useState<string[]>([]);
	const [typeFilter, setTypeFilter] = useState<"all" | ProjectType>("all");
	const { ref, visible } = useRevealOnScroll<HTMLElement>();

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
				"scroll-mt-28 space-y-6 transition-all duration-700 will-change-transform " +
				(visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
			}
		>
			<div className="flex flex-col items-center gap-4 text-center">
				<div className="space-y-2">
					<p className="proj-accent text-xs uppercase tracking-[0.3em] text-amber-600">Projects</p>
					<h2 className="proj-heading text-2xl font-semibold text-white sm:text-3xl dark:text-white">Featured work</h2>
					<p className="proj-neutral text-sm text-slate-700 dark:text-slate-200/80">Security-minded builds, study projects, and shipped experiments.</p>
				</div>

				<div className="flex flex-wrap justify-center gap-2">
					{typeFilters.map((item) => (
						<button
							key={item.key}
							type="button"
							onClick={() => setTypeFilter(item.key)}
							className={`proj-filter inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
								typeFilter === item.key
									? "proj-filter-active border-blue-600 bg-blue-600 text-white shadow"
									: "border-slate-300 text-black hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
							}`}
						>
							<span aria-hidden className="text-base leading-none">⏵</span>
							<span>{item.label}</span>
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
								className={`proj-filter inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
									isActive
										? "proj-filter-active border-blue-600 bg-blue-600 text-white shadow"
										: "border-slate-300 text-black hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
								}`}
							>
								<span aria-hidden className="text-base leading-none">⏵</span>
								<span>{item.label}</span>
							</button>
						);
					})}
				</div>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				{filtered.map((project) => (
					<article
						key={project.title}
						className="proj-card relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
					>
						<div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentByCategory[project.category]}`} aria-hidden />

						{project.image && (
							<div className="relative overflow-hidden rounded-xl border border-slate-200/60 bg-slate-100 dark:border-white/10 dark:bg-white/5">
								<div
									className="aspect-video w-full bg-cover bg-center"
									style={{ backgroundImage: `url(${project.image})` }}
									role="img"
									aria-label={`${project.title} preview`}
								/>
							</div>
						)}

						<div className="flex items-start justify-between gap-3">
							<div className="space-y-1">
								<p className="proj-neutral text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-700 dark:text-slate-200/70">
									{project.category}
									{project.period ? ` · ${project.period}` : ""}
								</p>
								<h3 className="proj-neutral text-lg font-semibold leading-snug text-slate-900 dark:text-white">{project.title}</h3>
							</div>
							{project.status && (
								<span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${statusTone[project.status]}`}>
									{project.status.replace("-", " ")}
								</span>
							)}
						</div>

						<p className="proj-neutral text-sm leading-relaxed text-slate-800 dark:text-slate-200/80">{project.summary}</p>

						{Array.isArray(project.highlights) && project.highlights.length > 0 && (
							<ul className="proj-neutral space-y-2 text-sm text-slate-800 dark:text-slate-200/80">
								{project.highlights.map((point) => (
									<li key={point} className="flex gap-2">
										<span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
										<span>{point}</span>
									</li>
								))}
							</ul>
						)}

						<div className="flex flex-wrap gap-2">
							{project.stack.map((tech) => (
								<span
									key={tech}
									className="proj-tag rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white/90"
								>
									{tech}
								</span>
							))}
						</div>

						{project.links && project.links.length > 0 && (
							<div className="flex flex-wrap gap-2 pt-1">
								{project.links.map((link) => (
									<a
										key={`${project.title}-${link.href}-${link.label}`}
										href={link.href}
										className={`proj-neutral proj-link ${link.type === "repo" ? "proj-link-repo" : ""} ${link.type === "demo" ? "proj-link-demo" : ""} inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:-translate-y-[1px] dark:border-white/20 dark:text-white`}
									>
										{link.label}
										<span aria-hidden className="text-slate-500 dark:text-slate-300">→</span>
									</a>
								))}
							</div>
						)}
					</article>
				))}

				{filtered.length === 0 && (
					<article className="proj-card col-span-full flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200/70 bg-white/60 p-6 text-center text-black shadow-none dark:border-white/15 dark:bg-white/5 dark:text-slate-200/80">
						<h3 className="proj-neutral text-lg font-semibold">Projects coming soon</h3>
						<p className="proj-neutral text-sm leading-relaxed">I&apos;m polishing case studies and will ship them shortly.</p>
					</article>
				)}
			</div>
		</section>
	);
}
