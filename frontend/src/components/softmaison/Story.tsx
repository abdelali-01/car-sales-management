import Image from "next/image";

export default function Story() {
	return (
		<section className="relative w-full px-6 md:px-12 lg:px-16 py-16 md:py-24 bg-white overflow-hidden">
			<div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
				<div>
					<h2 className="font-serif text-3xl md:text-4xl text-gray-900">Une touche de douceur dans chaque fibre.</h2>
					<div className="mt-5 space-y-4 text-gray-700 leading-relaxed">
						<p>Nos textiles sont sélectionnés avec soin pour offrir confort, tenue et douceur durables. Des matières premium, des finitions délicates et une attention particulière aux détails.</p>
						<p>Nous collaborons avec des ateliers maîtrisant un savoir-faire raffiné, alliant esthétique et fonctionnalité pour sublimer votre intérieur.</p>
						<p>Une démarche respectueuse guide nos choix, privilégiant des matériaux durables et des procédés responsables lorsque cela est possible.</p>
					</div>
					<ul className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-800">
						<li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Douceur</li>
						<li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Confort</li>
						<li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Élégance</li>
						<li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Éco-responsable</li>
					</ul>
				</div>
				<div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100">
					<Image src="/story.jpg" alt="Textiles de maison" fill className="object-cover" />
				</div>
			</div>
		</section>
	);
}


