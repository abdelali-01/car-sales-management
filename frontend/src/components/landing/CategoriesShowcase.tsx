'use client';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Example prop type
interface CategoriesShowcaseProps {
    categories: { id: number; name: string; image: string; slug: string }[];
}

export default function CategoriesShowcase({ categories }: CategoriesShowcaseProps) {
    const { i18n } = useTranslation();
    
    const content = {
        title: {
            en: "Shop by Category",
            fr: "Acheter par Catégorie",
            ar: "تسوق حسب الفئة"
        },
        viewAll: {
            en: "View All",
            fr: "Voir Tout",
            ar: "عرض الكل"
        }
    };

    return (
        <section className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-b border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">
                    <LayoutGrid className="w-7 h-7 text-brand-500" />
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                        {content.title[i18n.language as keyof typeof content.title]}
                    </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {/* View All Card */}
                    <Link href="/shop" className="group">
                        <div className="flex flex-col items-center justify-center bg-brand-50 dark:bg-brand-900 rounded-xl shadow p-5 border-2 border-dashed border-brand-300 dark:border-brand-700 hover:scale-105 transition cursor-pointer h-full">
                            <LayoutGrid className="w-10 h-10 text-brand-500 mb-2" />
                            <span className="font-bold text-brand-600 dark:text-brand-300 text-center">
                                {content.viewAll[i18n.language as keyof typeof content.viewAll]}
                            </span>
                        </div>
                    </Link>
                    {categories.slice(0, 11).map(cat => (
                        <Link key={cat.id} href={`/shop?category=${cat.name}`} className="group">
                            <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-xl shadow hover:shadow-lg p-5 transition hover:scale-105 border border-gray-200 dark:border-gray-800 cursor-pointer">
                                <div className="relative w-16 h-16 mb-3">
                                    <Image
                                        src={cat.image ? (`${cat.image}` || '/category.png') : '/cat.png'}
                                        alt={cat.name}
                                        fill
                                        className="object-cover rounded-full border-2 border-brand-100 dark:border-brand-900 group-hover:border-brand-500"
                                        onError={(e) => {
                                            e.currentTarget.src = '/category.png';
                                        }}
                                    />
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white text-center text-base line-clamp-2">{cat.name}</span>
                            </div>
                        </Link>
                    ))}

                </div>
            </div>
        </section>
    );
} 