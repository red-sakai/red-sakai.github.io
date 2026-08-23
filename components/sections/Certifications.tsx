"use client";

import Image from "next/image";
import { useState } from "react";
import certificationsData from "@/data/certifications.json";
import type { Certification } from "@/types/domain";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { Lightbox } from "@/components/ui/Lightbox";

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

export function CertificationsSection() {
	const { ref, visible } = useRevealOnScroll<HTMLElement>();
	const certifications = certificationsData as Certification[];
	const [lightbox, setLightbox] = useState<{ images: string[]; index: number; alt: string } | null>(null);

	const openImage = (cert: Certification, kind: "badge" | "certificate") => {
		const src = kind === "badge" ? cert.image : cert.certificateImage;
		if (!src) return;
		const alt =
			(kind === "badge" ? cert.imageAlt : cert.certificateAlt) ?? `${cert.title} ${kind}`;
		setLightbox({ images: [src], index: 0, alt });
	};

	return (
		<section
			id="certifications"
			ref={ref}
			className={
				"scroll-mt-28 space-y-8 transition-all duration-700 will-change-transform " +
				(visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
			}
		>
			<div className="flex flex-col items-center gap-3 text-center">
				<p className="text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-500">Certifications</p>
				<h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Proof of practice</h2>
				<p className="mx-auto max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300/90">
					Credentials that back up the security-first, build-fast mindset. Each one represents hands-on labs, graded assessments, and scenario work.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{certifications.map((cert, index) => (
					<article
						key={cert.title}
						className="group relative flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 transition-colors duration-300 hover:border-slate-400/70 sm:p-6 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
					>
						<div className="flex items-start justify-between gap-3">
							<div
								role={cert.image ? "button" : undefined}
								tabIndex={cert.image ? 0 : undefined}
								aria-label={cert.image ? `View ${cert.title} badge fullscreen` : undefined}
								onClick={cert.image ? () => openImage(cert, "badge") : undefined}
								onKeyDown={
									cert.image
										? (event) => {
											if (event.key === "Enter" || event.key === " ") {
												event.preventDefault();
												openImage(cert, "badge");
											}
										}
										: undefined
								}
								className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white p-1.5 transition-colors duration-300 focus-visible:outline-none group-hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.04] dark:group-hover:border-white/20 ${
									cert.image ? "cursor-zoom-in" : ""
								}`}
							>
								{cert.image ? (
									<Image
										src={cert.image}
										alt={cert.imageAlt || `${cert.title} badge`}
										width={48}
										height={48}
										className="h-full w-full object-contain"
									/>
								) : (
									<span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
										N/A
									</span>
								)}
							</div>
							<span className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
								{String(index + 1).padStart(2, "0")} · {cert.date}
							</span>
						</div>

						<div className="flex flex-col gap-1">
							<p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
								{cert.issuer}
							</p>
							<h3 className="text-lg font-semibold leading-snug tracking-tight">{cert.title}</h3>
						</div>

						<p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300/90">{cert.description}</p>

						{cert.certificateImage && (
							<div
								role="button"
								tabIndex={0}
								aria-label={cert.certificateAlt || `View ${cert.title} certificate fullscreen`}
								onClick={() => openImage(cert, "certificate")}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										openImage(cert, "certificate");
									}
								}}
								className="cursor-zoom-in overflow-hidden rounded-md border border-slate-200/80 bg-slate-50 focus-visible:outline-none dark:border-white/10 dark:bg-white/[0.04]"
							>
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

						<div className="mt-auto flex flex-col gap-4 pt-1">
							{Array.isArray(cert.tags) && cert.tags.length > 0 && <TagRow tags={cert.tags} />}

							{cert.credentialUrl && (
								<a
									href={cert.credentialUrl}
									target="_blank"
									rel="noreferrer"
									className="group/link inline-flex w-fit items-center gap-1.5 border-t border-slate-100 pt-3 font-mono text-xs font-medium uppercase tracking-[0.12em] text-slate-600 transition-colors hover:text-blue-700 dark:border-white/5 dark:text-slate-300 dark:hover:text-blue-300"
								>
									View credential
									<span aria-hidden className="transition-transform duration-300 group-hover/link:translate-x-0.5">→</span>
								</a>
							)}
						</div>
					</article>
				))}
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
