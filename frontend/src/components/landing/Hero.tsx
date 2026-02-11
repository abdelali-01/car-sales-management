'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Gift, Zap, ShoppingBag, Smile } from "lucide-react";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useTranslation } from 'react-i18next';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface StoreSlide {
  id: number;
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  description: {
    en: string;
    fr: string;
    ar: string;
  };
  image: string;
  isStoreSlide: true;
}

interface Pack {
  id?: number;
  name: string;
  description: string;
  products: Product[];
  price: number;
  discount: number;
  images: string[];
  isStoreSlide: false;
}

type Slide = StoreSlide | Pack;

const storeSlides: StoreSlide[] = [
  {
    id: 1,
    name: {
      en: "Welcome to Our Store",
      fr: "Bienvenue dans Notre Magasin",
      ar: "مرحباً بك في متجرنا"
    },
    description: {
      en: "Discover amazing products at great prices",
      fr: "Découvrez des produits incroyables à des prix imbattables",
      ar: "اكتشف منتجات رائعة بأسعار مميزة"
    },
    image: "/images/store/1.jpg",
    isStoreSlide: true
  },
  {
    id: 2,
    name: {
      en: "Shop from Home",
      fr: "Faites vos achats depuis chez vous",
      ar: "تسوق في متجرنا من بيتك"
    },
    description: {
      en: "Enjoy the best shopping experience right from your home",
      fr: "Profitez de la meilleure expérience d'achat depuis chez vous",
      ar: "نقدم لك افضل تجربة للتسوق عندنا من بيتك"
    },
    image: "/images/store/2.jpg",
    isStoreSlide: true
  }
];

export default function Hero() {
  const { packs } = useSelector((state: RootState) => state.offers);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const {t, i18n} = useTranslation();

  const content = {
    bundleOffer: {
      en: "Bundle Offer",
      fr: "Offre Groupée",
      ar: "عرض الحزمة"
    },
    save: {
      en: "Save",
      fr: "Économisez",
      ar: "وفر"
    },
    shopThisPack: {
      en: "Shop This Pack",
      fr: "Acheter ce Pack",
      ar: "اشتر هذه الحزمة"
    }
  };

  // Convert packs to include isStoreSlide property and fix type compatibility
  const typedPacks: Pack[] = packs?.map(pack => ({
    ...pack,
    products: pack.products.map(product => ({
      ...product,
      image: (product as Product).image || '/images/placeholder.png' // Handle missing image property
    })),
    isStoreSlide: false
  })) || [];

  const allSlides: Slide[] = [...storeSlides, ...typedPacks];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % allSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [allSlides.length, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % allSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + allSlides.length) % allSlides.length);
    setIsAutoPlaying(false);
  };

  const currentSlideData = allSlides[currentSlide];

  const calculateTotalOriginalPrice = (products: Product[]) => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  return (
    <>
    {/* Announcement Bar (optional) */}
    {/* <div className="w-full bg-brand-500 text-white text-center py-2 font-semibold tracking-wide">Free shipping on orders over 5000 DA!</div> */}
    <div className="relative w-full h-[600px] overflow-hidden mb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-full w-full"
        >
          {/* Background */}
          <div className="absolute inset-0">
            {currentSlideData.isStoreSlide ? (
              <Image
                src={currentSlideData.image}
                alt={currentSlideData.name.en}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <Image
                src={currentSlideData.images?.[0] ? `${process.env.NEXT_PUBLIC_SERVER}/${currentSlideData.images[0]}` : "/images/store/1.webp"}
                alt={currentSlideData.name}
                fill
                className="object-cover blur-sm scale-110"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center justify-center px-8">
            {currentSlideData.isStoreSlide ? (
              <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
                  {currentSlideData.name[i18n.language]}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow">
                  {currentSlideData.description[i18n.language]}
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-brand-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-brand-600 transition-colors"
                >
                 {t('home.hero.cta')}
                </Link>
              </div>
            ) : (
              <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10 bg-white/10 dark:bg-gray-900/60 rounded-2xl shadow-xl p-4 md:p-14 backdrop-blur-md border border-white/10">
                {/* Pack Info */}
                <div className="flex-1 flex flex-col items-start justify-center gap-3 md:gap-4 w-full md:w-auto">
                  <span className="inline-flex items-center gap-2 bg-brand-500/90 text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold mb-1 md:mb-2 shadow">
                    <Gift className="w-4 h-4 md:w-5 md:h-5" /> {content.bundleOffer[i18n.language as keyof typeof content.bundleOffer]}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-1 md:mb-2 drop-shadow-lg">
                    {currentSlideData.name}
                  </h2>
                  <p className="text-sm md:text-lg text-gray-200 mb-2 md:mb-4 max-w-md">
                    {currentSlideData.description}
                  </p>
                  <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4 flex-wrap">
                    <span className="text-lg md:text-2xl font-bold text-brand-300 bg-white/20 px-3 md:px-4 py-1.5 md:py-2 rounded-xl shadow">
                      {currentSlideData.price} DA
                    </span>
                    {currentSlideData.discount > 0 && (
                      <span className="text-base md:text-lg line-through text-gray-300">
                        {calculateTotalOriginalPrice(currentSlideData.products).toLocaleString()} DA
                      </span>
                    )}
                    {currentSlideData.discount > 0 && (
                      <span className="bg-red-500 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold">
                        {content.save[i18n.language as keyof typeof content.save]} {currentSlideData.discount}%
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/shop/pack/${currentSlideData.id}`}
                    className="inline-block bg-brand-500 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold text-base md:text-lg shadow-lg hover:bg-brand-600 transition-colors w-full md:w-auto text-center"
                  >
                    {content.shopThisPack[i18n.language as keyof typeof content.shopThisPack]}
                  </Link>
                </div>
                {/* Pack Products */}
                <div className="flex-1 w-full flex justify-center">
                  <div className="flex flex-col gap-2 md:gap-4 items-center min-w-[120px] w-full">
                    {currentSlideData.products.map((product) => (
                      <div key={product.id} className="flex flex-row items-center bg-white/80 dark:bg-gray-800/80 rounded-xl p-2 md:p-3 shadow border border-gray-100 dark:border-gray-800 min-w-0 w-full max-w-xs md:max-w-[220px] gap-2 md:gap-3">
                        <div className="relative w-10 h-10 md:w-14 md:h-14 flex-shrink-0">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_SERVER}/${product.image}`}
                            alt={product.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white text-left truncate">{product.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-300">{product.price} DA</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full shadow-lg hover:bg-brand-500 hover:scale-110 transition-all z-10"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full shadow-lg hover:bg-brand-500 hover:scale-110 transition-all z-10"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {allSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setIsAutoPlaying(false);
            }}
            className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-200 ${index === currentSlide ? 'bg-brand-500 scale-125 shadow-lg' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
    </>
  );
} 