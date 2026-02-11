'use client';
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { addToCart } from "@/store/slices/cartSlice";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState, useEffect } from 'react';
import { Product } from "../modals/ProductModal";
import ProductCard from "../shop/ProductCard";
// import { StarIcon } from '@heroicons/react/20/solid'; // Removed as no longer used
// import { HeartIcon } from '@heroicons/react/24/outline'; // Removed as no longer used
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';


const getImageSrc = (img: string) => {
  if (!img) return '/images/placeholder.png';
  if (img.startsWith('data:image') || img.startsWith('http')) return img;
  return `${img}`;
};

const FeaturedProducts = () => {
  const { t } = useTranslation();
  // const dispatch = useAppDispatch(); // Temporarily commented out
  const { products } = useSelector((state: RootState) => state.products); // Temporarily commented out
  const [currentSlide, setCurrentSlide] = useState(0);
  const [productsPerSlide, setProductsPerSlide] = useState(3);
  const featuredProducts = products?.filter((p: any) => p.show_on_homepage) || [];
  const totalSlides = Math.ceil(featuredProducts.length / productsPerSlide);

  useEffect(() => {
    // Responsive: 1 per slide on mobile, 3 on desktop
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setProductsPerSlide(1);
      } else {
        setProductsPerSlide(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const getCurrentProducts = () => {
    const start = currentSlide * productsPerSlide;
    return featuredProducts.slice(start, start + productsPerSlide);
  };

  const handleAddToCart = (product: Product) => {
    // dispatch(addToCart({ ...product, quantity: 1 })); // Temporarily commented out
    console.log("Add to cart clicked for:", product.name);
  };


  if(!featuredProducts) return null
  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {t('home.featured.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products, chosen for their quality and value
          </p>
          <Link
            href="/shop"
            className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            {t('home.featured.viewAll')}
          </Link>
        </div>

        <div className="relative">
          <div className="w-full h-full overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentSlide}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className={`grid gap-6 ${productsPerSlide === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}
              >
                {getCurrentProducts().map((product: any) => (
                  <div
                    key={product.id}
                  >
                    <ProductCard product={product}/>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          {totalSlides > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-0  md:-left-12 top-1/2 -translate-y-1/2 bg-brand-500 text-white p-2 rounded-full shadow-lg hover:bg-brand-700 transition-colors z-10">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextSlide} className="absolute right-0  md:-right-12 top-1/2 -translate-y-1/2 bg-brand-500 text-white p-2 rounded-full shadow-lg hover:bg-brand-700 transition-colors z-10">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts; 