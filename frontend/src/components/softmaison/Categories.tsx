'use client';
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "@/store/store";
import { fetchRootCategories } from "@/store/products/productHandler";
import { Category } from "../tables/CategoriesTable";

export default function Categories() {
	const dispatch = useDispatch<AppDispatch>();
	const { categories, loading } = useSelector((state: RootState) => state.products);

	// Filter to get only root categories (no parent)
	const rootCategories = categories?.filter((cat: Category) => !cat.parentId);

	useEffect(() => {
		if (!categories) {
			// Fetch root categories only for storefront
			dispatch(fetchRootCategories());
		}
	}, [dispatch, categories]);

	// Loading state
	if (loading) {
		return (
			<section id="categories" className="w-full px-6 md:px-12 lg:px-16 py-14 md:py-20 bg-white">
				<div className="max-w-7xl mx-auto">
					<header className="mb-8 md:mb-12">
						<h2 className="font-serif text-3xl md:text-4xl text-gray-900">Collections principales</h2>
						<p className="mt-2 text-gray-600">Explorez nos collections</p>
					</header>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="rounded-xl overflow-hidden bg-gray-200 animate-pulse min-h-[280px]" />
						))}
					</div>
				</div>
			</section>
		);
	}

	// Empty state
	if (!rootCategories || rootCategories.length === 0) {
		return (
			<section id="categories" className="w-full px-6 md:px-12 lg:px-16 py-14 md:py-20 bg-white">
				<div className="max-w-7xl mx-auto">
					<header className="mb-8 md:mb-12 text-center">
						<h2 className="font-serif text-3xl md:text-4xl text-gray-900">Collections principales</h2>
						<p className="mt-2 text-gray-600">Aucune collection disponible pour le moment</p>
					</header>
				</div>
			</section>
		);
	}

	return (
		<section id="categories" className="w-full px-6 md:px-12 lg:px-16 py-14 md:py-20 bg-white">
			<div className="max-w-7xl mx-auto">
				<header className="mb-8 md:mb-12">
					<h2 className="font-serif text-3xl md:text-4xl text-gray-900">Collections principales</h2>
					<p className="mt-2 text-gray-600">Explorez nos {rootCategories.length} collection{rootCategories.length > 1 ? 's' : ''}</p>
				</header>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
					{rootCategories.map((category: Category) => (
						<CategoryCard
							key={category.id}
							title={category.name}
							description={category.description}
							linkHref={`/shop?category=${category.id}`}
							imageSrc={category.image || "/placeholder-category.jpg"}
							childrenCount={category.childrenCount}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

type CategoryCardProps = {
	title: string;
	description: string;
	linkHref: string;
	imageSrc: string;
	childrenCount?: number;
};

function CategoryCard({ title, description, linkHref, imageSrc, childrenCount }: CategoryCardProps) {
	return (
		<article className="group relative rounded-xl overflow-hidden bg-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
			<div className="absolute inset-0">
				<Image
					src={imageSrc}
					alt={title}
					fill
					className="object-cover object-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
					sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-500" />
			</div>
			<div className="relative p-5 md:p-6 lg:p-8 text-white min-h-[280px] flex flex-col justify-end">
				<div className="transform transition-transform duration-500 group-hover:translate-y-[-8px]">
					<h3 className="font-serif text-xl md:text-2xl lg:text-3xl mb-2 drop-shadow-lg">{title}</h3>
					<p className="text-white/90 text-xs md:text-sm lg:text-base line-clamp-2 mb-2 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
						{description}
					</p>
					{childrenCount !== undefined && childrenCount > 0 && (
						<p className="text-white/70 text-xs mb-2">
							{childrenCount} sous-catégorie{childrenCount > 1 ? 's' : ''}
						</p>
					)}
				</div>
				<div className="mt-2">
					<Link
						href={linkHref}
						className="inline-flex items-center gap-2 rounded-full bg-white text-gray-900 px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-medium hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
					>
						Découvrir
						<span className="inline-block w-2.5 h-2.5 md:w-3 md:h-3 border-r-2 border-b-2 border-current rotate-[-45deg] transition-transform duration-300 group-hover:translate-x-1" />
					</Link>
				</div>
			</div>
			<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
		</article>
	);
}
