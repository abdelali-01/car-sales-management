'use client';
import Image from 'next/image';
import Button from "@/components/ui/button/Button";
import { ShoppingCart } from 'lucide-react';
import { Product } from '../modals/ProductModal';
import ProductCard from './ProductCard';
import { useTranslation } from 'react-i18next';

interface ProductGridProps {
  products: Product[];
  sort: string;
  onSortChange: (sort: string) => void;
}


export default function ProductGrid({ products, sort, onSortChange }: ProductGridProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-1">
      {/* Sort Options */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-700 dark:text-gray-300">
          {products.length} {t('shop.productsFound', { count: products.length })}
        </p>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-1 rounded border border-[#efe9df] dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-[#c1a36f]"
        >
          <option value="newest">{t('shop.sort.newest')}</option>
          <option value="price-low">{t('shop.sort.priceLow')}</option>
          <option value="price-high">{t('shop.sort.priceHigh')}</option>
          <option value="popular">{t('shop.sort.popular')}</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id}><ProductCard product={product} /></div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{t('shop.noProducts')}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('shop.tryAdjusting')}
          </p>
        </div>
      )}
    </div>
  );
} 