'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchPacks } from '@/store/offers/offersHandler';
import { useTranslation } from 'react-i18next';

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export default function Packs() {
    const dispatch = useDispatch<AppDispatch>();
    const { packs } = useSelector((state: RootState) => state.offers);
    const { i18n } = useTranslation();

    const content = {
        title: {
            en: "Special Packs",
            fr: "Packs Spéciaux",
            ar: "حزم خاصة"
        },
        description: {
            en: "Exclusive bundles and packages for the best value",
            fr: "Ensembles et packages exclusifs pour la meilleure valeur",
            ar: "حزم وحزم حصرية لأفضل قيمة"
        },
        products: {
            en: "Products",
            fr: "Produits",
            ar: "المنتجات"
        },
        save: {
            en: "Save",
            fr: "Économisez",
            ar: "وفر"
        },
        viewPack: {
            en: "View Pack",
            fr: "Voir le Pack",
            ar: "عرض الحزمة"
        }
    };

    useEffect(() => {
        dispatch(fetchPacks());
    }, [dispatch]);

    const calculateTotalOriginalPrice = (products: Product[]) => {
        return products.reduce((total, product) => total + (product.price * product.quantity), 0);
    };

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {content.title[i18n.language as keyof typeof content.title]}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {content.description[i18n.language as keyof typeof content.description]}
                    </p>
                </div>

                <div className="flex flex-col gap-10 w-full">
                    {packs?.map((pack) => (
                        <div
                            key={pack.id}
                            className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full min-h-[340px] border border-gray-100 dark:border-gray-800"
                        >
                            {/* Pack Image */}
                            <div className="relative w-full md:w-1/3 h-64 md:h-auto flex-shrink-0">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_SERVER}/${pack.images[0]}` || '/pack.png'}
                                    alt={pack.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        e.currentTarget.src = '/pack.png';
                                    }}
                                />
                                {pack.discount > 0 && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                                        -{pack.discount}%
                                    </div>
                                )}
                                <div className="absolute bottom-4 left-4 bg-brand-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    {pack.products.length} {content.products[i18n.language as keyof typeof content.products]}
                                </div>
                            </div>
                            {/* Pack Info */}
                            <div className="flex-1 flex flex-col justify-between p-8 gap-4">
                                <div>
                                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
                                        {pack.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
                                        {pack.description}
                                    </p>
                                    {/* Products in Pack */}
                                    <div className="flex flex-wrap gap-4 mb-4">
                                        {pack.products.map((product) => (
                                            <div key={product.id} className="flex flex-col items-center bg-gray-50 dark:bg-gray-900 rounded-xl p-3 min-w-[90px] max-w-[120px] shadow border border-gray-100 dark:border-gray-800">
                                                <div className="relative w-14 h-14 mb-2">
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_SERVER}/${product.image}` || '/product.png'}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover rounded-lg"
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/product.png';
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-900 dark:text-white text-center truncate w-full">{product.name}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-300">{product.price} DA</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Price and Actions */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex flex-col md:flex-row items-center gap-4">
                                        <span className="text-3xl font-extrabold text-brand-500">{pack.price} DA</span>
                                        {pack.discount > 0 && (
                                            <span className="text-lg text-gray-500 line-through">{calculateTotalOriginalPrice(pack.products)} DA</span>
                                        )}
                                        {pack.discount > 0 && (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold ml-2">{content.save[i18n.language as keyof typeof content.save]} {calculateTotalOriginalPrice(pack.products) - pack.price} DA</span>
                                        )}
                                    </div>
                                    <Link
                                        href={`/shop/pack/${pack.id}`}
                                        className="bg-brand-500 text-white px-8 py-3 rounded-xl hover:bg-brand-700 transition-colors text-lg font-semibold shadow-lg text-center"
                                    >
                                        {content.viewPack[i18n.language as keyof typeof content.viewPack]}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 