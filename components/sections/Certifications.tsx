"use client";

import Image from "next/image";
import certificationsData from "../../data/certifications.json";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";

type Certification = {
	title: string;
	issuer: string;
	date: string;
	description: string;
	credentialUrl?: string;
	tags?: string[];
	image?: string;
	imageAlt?: string;
	certificateImage?: string;
	certificateAlt?: string;
};

export function CertificationsSection() {
	const { ref, visible } = useRevealOnScroll<HTMLElement>();
	const certifications = certificationsData as Certification[];

	return (
		<section
			id="certifications"
			ref={ref}
			className={
				"scroll-mt-28 space-y-6 transition-all duration-700 will-change-transform " +
				(visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
			}
		>
			<div className="flex flex-col items-center gap-3 text-center">
				<p className="cert-accent text-xs uppercase tracking-[0.3em] text-amber-600">Certifications</p>
				<h2 className="cert-neutral text-2xl font-semibold sm:text-3xl">Proof of practice</h2>
				<p className="cert-neutral max-w-3xl text-base leading-relaxed text-slate-800 dark:text-slate-200/80">
					Credentials that back up the security-first, build-fast mindset. Each one represents hands-on labs, graded assessments, and scenario work.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{certifications.map((cert) => (
					<article
						key={cert.title}
						className="cert-card relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
					>
						<div className="pointer-events-none absolute inset-x-10 top-0 h-1.5 rounded-b-full bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400" aria-hidden />

						{cert.image ? (
							<div className="mx-auto h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/10">
								<Image
									src={cert.image}
									alt={cert.imageAlt || `${cert.title} badge`}
									width={64}
									height={64}
									className="h-full w-full object-contain"
								/>
							</div>
						) : (
							<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:border-white/20 dark:text-white/70">
								Badge
							</div>
						)}

						<div className="flex flex-col items-center gap-1">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">{cert.issuer}</p>
							<h3 className="cert-neutral text-lg font-semibold text-slate-900 dark:text-white">{cert.title}</h3>
							<span className="cert-neutral rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm dark:bg-white/10 dark:text-white/85">
								{cert.date}
							</span>
						</div>

						<p className="cert-neutral text-sm leading-relaxed text-slate-700 dark:text-slate-200/80">{cert.description}</p>

						{cert.certificateImage && (
							<div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm dark:border-white/10 dark:bg-white/5">
								<Image
									src={cert.certificateImage}
									alt={cert.certificateAlt || `${cert.title} certificate`}
									width={1200}
									height={800}
									className="h-full w-full object-cover"
									priority={false}
								/>
							</div>
						)}

						{Array.isArray(cert.tags) && cert.tags.length > 0 && (
							<div className="flex flex-wrap items-center justify-center gap-2 pt-1">
								{cert.tags.map((tag) => (
									<span
										key={tag}
										className="cert-tag rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-900 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white/90"
									>
										{tag}
									</span>
								))}
							</div>
						)}

						{cert.credentialUrl && (
							<div className="flex justify-center pt-1">
								<a
									href={cert.credentialUrl}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center justify-center rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-md transition hover:translate-y-[-1px] hover:bg-amber-400"
								>
									View credential
								</a>
							</div>
						)}
					</article>
				))}
			</div>
		</section>
	);
}
