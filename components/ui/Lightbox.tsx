"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type LightboxProps = {
	src: string;
	alt: string;
	caption?: string;
	onClose: () => void;
};

export function Lightbox({ src, alt, caption, onClose }: LightboxProps) {
	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);

	return createPortal(
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8"
			role="dialog"
			aria-modal="true"
			aria-label={alt}
			onClick={onClose}
		>
			<button
				type="button"
				onClick={onClose}
				className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
				aria-label="Close"
			>
				×
			</button>
			<figure
				className="max-h-full max-w-4xl overflow-hidden rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.6)]"
				onClick={(event) => event.stopPropagation()}
			>
				<Image
					src={src}
					alt={alt}
					width={1600}
					height={1067}
					className="max-h-[85vh] w-auto object-contain"
				/>
				{caption && (
					<figcaption className="bg-slate-900 px-4 py-2 text-center text-sm text-slate-300">
						{caption} — click anywhere to close
					</figcaption>
				)}
			</figure>
		</div>,
		document.body
	);
}
