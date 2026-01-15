"use client";

import { useMemo, useState } from "react";
import { NavbarCapsule } from "../components/sections/NavbarCapsule";

type Milestone = {
	year: string;
	title: string;
	description: string;
	tags: string[];
};

type SkillGroup = {
	title: string;
	items: string[];
};

type Focus = {
	title: string;
	body: string;
};

const milestones: Milestone[] = [
	{
		year: "2026",
		title: "Capstone: Smart IoT Security Dashboard",
		description:
			"Built a telemetry pipeline with Next.js, MQTT, and Python services to monitor device health, anomaly scores, and live alerts.",
		tags: ["Next.js", "MQTT", "Python", "Realtime"],
	},
	{
		year: "2025",
		title: "Cyber Range Assistant",
		description:
			"Created guided lab scripts and validation checks to help peers practice network hardening, threat modeling, and blue-team playbooks.",
		tags: ["Security", "Scripting", "Docs"],
	},
	{
		year: "2024",
		title: "Applied Algorithms Track",
		description:
			"Implemented graph search, DP, and greedy strategies for competitive programming problems to sharpen problem-solving speed.",
		tags: ["Algorithms", "Data Structures", "Practice"],
	},
];

const skillGroups: SkillGroup[] = [
	{ title: "Languages", items: ["TypeScript", "Python", "C/C++", "Java"] },
	{ title: "Frameworks", items: ["Next.js", "React", "Node.js", "FastAPI"] },
	{ title: "Security", items: ["OWASP", "Threat Modeling", "Nmap", "Burp Suite"] },
	{ title: "Data & Infra", items: ["PostgreSQL", "Docker", "MQTT", "GitHub Actions"] },
];

const focuses: Focus[] = [
	{
		title: "Security-first mindset",
		body: "I thread in secure defaults early: input validation, least privilege, and observability before launch.",
	},
	{
		title: "Systems thinking",
		body: "I map flows end-to-end, from UI events to database writes, to reduce hidden coupling and surprises.",
	},
	{
		title: "Learning in public",
		body: "I document experiments, wins, and edge cases so future me (and teammates) move faster.",
	},
];

export default function AboutPage() {
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const isDark = theme === "dark";

	const accent = useMemo(() => (isDark ? "from-cyan-400 to-blue-500" : "from-amber-400 to-orange-500"), [isDark]);
	const cardBg = isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200";
	const subtleText = isDark ? "text-slate-200/80" : "text-slate-700";

	return (
		<main
			className={`relative min-h-screen overflow-hidden ${isDark ? "bg-[#0b1220] text-slate-50" : "bg-white text-slate-900"}`}
		>
			<div
				className="pointer-events-none absolute inset-0 opacity-80"
				aria-hidden
				style={{
					background:
						"radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.12), transparent 30%), radial-gradient(circle at 80% 10%, rgba(248, 180, 0, 0.12), transparent 32%), radial-gradient(circle at 70% 70%, rgba(15, 23, 42, 0.2), transparent 40%)",
					filter: "blur(10px)",
				}}
			/>

			<div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-16 pt-8 sm:px-10 lg:px-14">
				<div className="flex w-full justify-center">
					<NavbarCapsule theme={theme} onThemeToggle={setTheme} />
				</div>

				<header className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
					<div className="space-y-5">
						<p className="text-sm uppercase tracking-[0.35em] text-amber-500">Education</p>
						<h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
							Studying Computer Engineering with a security focus.
						</h1>
						<p className={`text-lg leading-relaxed sm:text-xl ${subtleText}`}>
							Coursework spans circuits, networks, operating systems, and algorithms. I pair those foundations with security labs, web projects, and telemetry experiments to understand how systems behave in the real world.
						</p>
						<div className="flex flex-wrap gap-3">
							{[
								"Computer Engineering",
								"Cybersecurity",
								"Systems Thinking",
								"Learning",
							].map((pill) => (
								<span
									key={pill}
									className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
										isDark ? "border-white/15 bg-white/5" : "border-slate-200 bg-slate-50"
									}`}
								>
									<span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden />
									{pill}
								</span>
							))}
						</div>

						<div className="flex flex-wrap gap-4 pt-2 text-sm sm:text-base">
							{[{ label: "Current focus", value: "Threat modeling + telemetry" }, { label: "Degree", value: "BS Computer Engineering" }, { label: "Location", value: "Philippines (UTC+8)" }].map((item) => (
								<div
									key={item.label}
									className={`rounded-2xl border px-4 py-3 ${cardBg}`}
								>
									<p className="text-xs uppercase tracking-[0.25em] text-amber-500">{item.label}</p>
									<p className="font-medium">{item.value}</p>
								</div>
							))}
						</div>
					</div>

					<div className={`relative overflow-hidden rounded-3xl border ${cardBg}`}>
						<div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/0" aria-hidden />
						<div className="grid grid-cols-2 gap-4 p-6 sm:p-8">
							{[{ label: "Projects shipped", value: "12" }, { label: "Security labs", value: "18" }, { label: "Algorithms solved", value: "220+" }, { label: "Tech writeups", value: "15" }].map((stat) => (
								<div key={stat.label} className="rounded-2xl bg-black/5 p-4 text-center dark:bg-white/5">
									<p className="text-3xl font-semibold text-amber-500 sm:text-4xl">{stat.value}</p>
									<p className={`text-sm ${subtleText}`}>{stat.label}</p>
								</div>
							))}
						</div>

						<div className="border-t border-white/10 bg-gradient-to-r px-6 py-4 sm:px-8" style={{ background: isDark ? "linear-gradient(90deg, rgba(14,165,233,0.12), rgba(15,23,42,0.3))" : "linear-gradient(90deg, rgba(251,191,36,0.14), rgba(255,255,255,0.85))" }}>
							<p className="text-sm font-semibold text-amber-500">Mindset</p>
							<p className={`text-sm leading-relaxed ${subtleText}`}>
								I design with observability, graceful degradation, and rollback plans so new features do not sacrifice stability.
							</p>
						</div>
					</div>
				</header>

				<section className="space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-semibold sm:text-3xl">Education highlights</h2>
						<div className={`h-1 w-24 rounded-full bg-gradient-to-r ${accent}`} aria-hidden />
					</div>
					<div className="grid gap-4 lg:grid-cols-3">
						{milestones.map((item) => (
							<article
								key={item.title}
								className={`flex flex-col gap-3 rounded-2xl border p-5 ${cardBg}`}
							>
								<span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500">{item.year}</span>
								<h3 className="text-lg font-semibold">{item.title}</h3>
								<p className={`text-sm leading-relaxed ${subtleText}`}>{item.description}</p>
								<div className="flex flex-wrap gap-2 pt-1">
									{item.tags.map((tag) => (
										<span
											key={tag}
											className={`rounded-full px-3 py-1 text-xs font-semibold ${
												isDark ? "bg-white/10 text-white" : "bg-slate-200 text-slate-900"
											}`}
										>
											{tag}
										</span>
									))}
								</div>
							</article>
						))}
					</div>
				</section>

				<section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
					<div className="space-y-5">
						<div className="flex items-center justify-between">
							<h2 className="text-2xl font-semibold sm:text-3xl">Skills and tools</h2>
							<div className={`h-1 w-24 rounded-full bg-gradient-to-r ${accent}`} aria-hidden />
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							{skillGroups.map((group) => (
								<div
									key={group.title}
									className={`flex flex-col gap-2 rounded-2xl border p-5 ${cardBg}`}
								>
									<p className="text-sm font-semibold text-amber-500">{group.title}</p>
									<ul className="space-y-1 text-sm font-medium">
										{group.items.map((skill) => (
											<li key={skill} className={subtleText}>
												{skill}
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>

					<div className={`flex flex-col gap-4 rounded-3xl border p-6 ${cardBg}`}>
						<p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-500">Focus</p>
						<div className="space-y-4">
							{focuses.map((focus) => (
								<div key={focus.title} className="space-y-2 rounded-2xl bg-black/5 p-4 dark:bg-white/5">
									<h3 className="text-lg font-semibold">{focus.title}</h3>
									<p className={`text-sm leading-relaxed ${subtleText}`}>{focus.body}</p>
								</div>
							))}
						</div>
						<div className="rounded-2xl border border-dashed border-amber-500/60 bg-amber-500/10 p-5 text-sm font-medium text-amber-800 dark:text-amber-200">
							Currently building small defensive scripts to automate log triage and alert routing.
						</div>
					</div>
				</section>

				<section className={`rounded-3xl border p-6 sm:p-8 ${cardBg}`}>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-2">
							<p className="text-sm uppercase tracking-[0.25em] text-amber-500">Next steps</p>
							<h2 className="text-2xl font-semibold sm:text-3xl">Let&apos;s build something resilient</h2>
							<p className={`text-sm leading-relaxed ${subtleText}`}>
								Whether you need a secure prototype, a reliability review, or a teammate who documents as they go, I would love to help.
							</p>
						</div>
						<div className="flex flex-wrap gap-3">
							<a
								href="mailto:jhered@example.com"
								className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.01]"
							>
								Start a conversation
							</a>
							<a
								href="/JHERED_MIGUEL_REPUBLICA.pdf"
								download="JHERED_MIGUEL_REPUBLICA.pdf"
								className={`inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition hover:-translate-y-[1px] ${
									isDark ? "border-white/20 bg-white/10" : "border-slate-300 bg-white"
								}`}
							>
								View CV
							</a>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}

