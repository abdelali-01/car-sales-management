'use client';
 import Image from "next/image";
 import Link from "next/link";
 import { useDispatch, useSelector } from "react-redux";
 import { RootState, AppDispatch } from "@/store/store";
 import { useEffect } from "react";
 import { fetchProducts } from "@/store/products/productHandler";
 import type { Product } from "@/components/modals/ProductModal";

 export default function Featured() {
     const dispatch = useDispatch<AppDispatch>();
     const { products, loading } = useSelector((s: RootState) => s.products);

     useEffect(() => {
         if (!products) {
             dispatch(fetchProducts());
         }
     }, [products, dispatch]);

     const featured: Product[] = (products || []).filter((p: Product) => p?.featured || p?.show_on_homepage);

     return (
         <section className="w-full px-6 md:px-12 lg:px-16 py-14 md:py-20 bg-[#f8f6f2]">
             <div className="max-w-7xl mx-auto">
                 <header className="mb-8 md:mb-12 flex items-end justify-between gap-4">
                     <div>
                         <h2 className="font-serif text-3xl md:text-4xl text-gray-900">Sélection mise en avant</h2>
                         <div className="mt-2 h-1 w-16 bg-[#c1a36f] rounded-full" />
                         <p className="mt-3 text-gray-700">Packs, best-sellers et nouveautés</p>
                     </div>
                     <Link href="/shop" className="text-[#c1a36f] hover:opacity-80 underline underline-offset-4">
                         Voir tout
                     </Link>
                 </header>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                     {(loading && !products) ? (
                         Array.from({ length: 4 }).map((_, i) => (
                             <div key={i} className="animate-pulse h-64 bg-gray-200 rounded-xl" />
                         ))
                     ) : featured.length > 0 ? (
                         featured.map((p: Product) => (
                             <ProductCard key={p.id} id={String(p.id)} name={p.name} description={p.description} price={p.price} imageSrc={(p.images && p.images[0]) || "/product.png"} />
                         ))
                     ) : (
                         <p className="text-gray-600">Aucun produit en vedette pour le moment.</p>
                     )}
                 </div>
             </div>
         </section>
     );
 }

 function ProductCard({ id, name, description, price, imageSrc }: { id: string; name: string; description: string; price: number; imageSrc: string; }) {
     return (
         <article className="group rounded-xl overflow-hidden bg-white border border-gray-200">
             <div className="relative aspect-[4/5] bg-gray-100">
                 <Image
                     src={imageSrc}
                     alt={name}
                     fill
                     className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                     sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                 />
                 <span className="absolute top-3 left-3 rounded-full bg-white/90 text-gray-900 text-xs font-medium px-3 py-1">En vedette</span>
             </div>
             <div className="p-4 md:p-5">
                 <h3 className="text-gray-900 font-medium">{name}</h3>
                 <p className="mt-1 text-sm text-gray-600 line-clamp-2">{description}</p>
                 <div className="mt-3 flex items-center justify-between">
                     <span className="text-gray-900 font-semibold">{new Intl.NumberFormat('fr-DZ', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(price)}</span>
                     <Link href={`/shop/${id}`} className="text-sm rounded-full border border-[#c1a36f] text-[#c1a36f] px-4 py-1.5 hover:bg-[#c1a36f] hover:text-white transition-colors">
                         Voir
                     </Link>
                 </div>
             </div>
         </article>
     );
 }


