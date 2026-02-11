"use client";

import Link from "next/link";
import Image from "next/image";
function cx(...classes: Array<string | undefined>) {
	return classes.filter(Boolean).join(" ");
}

type HeroProps = {
	className?: string;
};

export default function Hero({ className }: HeroProps) {
	return (
		<section className={cx(
			"relative flex items-end md:items-center justify-start w-full min-h-[90vh] overflow-hidden bg-gray-100",
			className
		)}>
			<Image
				src="/hero-image.png"
				alt="Soft de Maison - Linge de lit et linge de bain"
				fill
				priority
				className="object-cover object-top opacity-90"
				sizes="100vw"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
			<div className="relative z-10 w-full px-6 md:px-12 lg:px-16 py-14 md:py-20">
				<div className="max-w-3xl text-white">
					<h1 className="font-serif text-4xl md:text-6xl leading-tight tracking-tight">
						Le confort et l’élégance chez vous
					</h1>
					<p className="mt-4 text-base md:text-lg text-white/90 max-w-2xl">
						Découvrez notre fine collection de Linge de lit & Linge de bain.
					</p>
					<div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
						<Link
							href="/shop?category=linge de lit"
							className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm md:text-base font-medium bg-white text-gray-900 hover:bg-cream-100 transition-colors"
							aria-label="Découvrir Linge de Lit"
						>
							Découvrir Linge de Lit
						</Link>
						<Link
							href="/shop?category=linge de bain"
							className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm md:text-base font-medium bg-transparent border border-white/70 text-white hover:bg-white/10 transition-colors"
							aria-label="Découvrir Linge de Bain"
						>
							Découvrir Linge de Bain
						</Link>
					</div>
				</div>
				<a
					href="#categories"
					className="mt-10 md:mt-16 inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
					aria-label="Aller à la section catégories"
				>
					<span className="h-5 w-5 inline-block border-l border-b rotate-[-45deg]" />
					<span className="text-sm">Faites défiler</span>
				</a>
			</div>
		</section>
	);
}


