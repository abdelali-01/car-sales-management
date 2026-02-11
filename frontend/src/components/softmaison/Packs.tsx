'use client';
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { fetchPacks } from "@/store/offers/offersHandler";

export default function Packs() {
    const dispatch = useDispatch<AppDispatch>();
    const { packs, loading } = useSelector((s: RootState) => s.offers);

    useEffect(() => {
        if (!packs) {
            dispatch(fetchPacks());
        }
    }, [packs, dispatch]);

    if(!packs || packs.length === 0) return null ;
    return (
        <section className="w-full px-6 md:px-12 lg:px-16 py-14 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 md:mb-12 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl text-gray-900">Packs</h2>
                        <div className="mt-2 h-1 w-14 bg-[#c1a36f] rounded-full" />
                        <p className="mt-3 text-gray-700">Économisez avec nos ensembles</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {(loading && !packs) ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse h-64 bg-gray-200 rounded-xl" />
                        ))
                    ) : packs && packs.length > 0 ? (
                        packs.map((pack) => (
                            <article key={pack.id} className="group rounded-xl overflow-hidden bg-[#fff] border border-[#efe9df]">
                                <div className="relative aspect-[4/5] bg-[#f3efe7]">
                                    <Image
                                        src={(pack.images && pack.images[0]) || "/pack.png"}
                                        alt={pack.name}
                                        fill
                                        className="object-cover object-center"
                                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                    />
                                    {pack.discount ? (
                                        <span className="absolute top-3 left-3 rounded-full bg-[#c1a36f] text-white text-xs font-medium px-3 py-1">-{pack.discount}%</span>
                                    ) : null}
                                </div>
                                <div className="p-4 md:p-5">
                                    <h3 className="text-gray-900 font-medium">{pack.name}</h3>
                                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{pack.description}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-gray-900 font-semibold">{new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(pack.price)}</span>
                                        <Link href={`/shop/pack/${pack.id}`} className="text-sm rounded-full border border-[#c1a36f] text-[#c1a36f] px-4 py-1.5 hover:bg-[#c1a36f] hover:text-white transition-colors">
                                            Voir
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <p className="text-gray-600">Aucun pack disponible pour le moment.</p>
                    )}
                </div>
            </div>
        </section>
    );
}


