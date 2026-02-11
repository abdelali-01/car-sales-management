'use client';
import Input from '../form/input/InputField';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useTranslation } from 'react-i18next';
import { Category } from '../tables/CategoriesTable';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface Filter {
  category: number[];
  price: {
    min: number;
    max: number;
  };
  sort: 'newest' | 'price-low' | 'price-high' | 'popular';
  inStock: boolean;
}

interface FilterSidebarProps {
  filters: Filter;
  onFilterChange: (filters: Filter) => void;
  isOpen: boolean;
}

export default function FilterSidebar({ filters, onFilterChange, isOpen }: FilterSidebarProps) {
  const { t } = useTranslation();
  const { categories } = useSelector((state: RootState) => state.products);

  // Build hierarchical display of categories
  const getCategoryDisplay = (category: Category): string => {
    if (category.parent) {
      return `${category.parent.name} → ${category.name}`;
    }
    return category.name;
  };

  // Sort categories: root categories first, then children grouped by parent
  const sortedCategories = categories?.slice().sort((a, b) => {
    // Root categories come first
    if (!a.parentId && b.parentId) return -1;
    if (a.parentId && !b.parentId) return 1;

    // Among root categories, sort by name
    if (!a.parentId && !b.parentId) {
      return a.name.localeCompare(b.name);
    }

    // Among children, group by parent then sort by name
    if (a.parentId !== b.parentId) {
      const parentA = categories?.find(c => c.id === a.parentId);
      const parentB = categories?.find(c => c.id === b.parentId);
      return (parentA?.name || '').localeCompare(parentB?.name || '');
    }

    return a.name.localeCompare(b.name);
  });

  return (
    <div className={`lg:w-64 ${isOpen ? 'block' : 'hidden lg:block'}`}>
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg border border-[#efe9df] dark:border-gray-800 p-4 space-y-6">
        {/* Categories */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">{t('shop.filters.categories')}</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sortedCategories?.map((cat) => (
              <label key={cat.id} className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.category.includes(Number(cat.id))}
                  onChange={(e) => {
                    const id = Number(cat.id);
                    const newCategories = e.target.checked
                      ? [...filters.category, id]
                      : filters.category.filter(cid => cid != id);
                    onFilterChange({ ...filters, category: newCategories });
                  }}
                  className="mt-0.5 rounded border-[#efe9df] dark:border-gray-600 text-[#c1a36f] focus:ring-[#c1a36f]"
                />
                <span className={`text-sm transition-colors group-hover:text-[#c1a36f] ${cat.parentId
                    ? 'text-gray-500 dark:text-gray-400 pl-3'
                    : 'text-gray-700 dark:text-gray-300 font-medium'
                  }`}>
                  {cat.parentId && (
                    <ChevronRightIcon className="w-3 h-3 inline mr-1 text-gray-400" />
                  )}
                  {cat.name}
                  {cat.productCount !== undefined && cat.productCount > 0 && (
                    <span className="ml-1 text-xs text-gray-400">({cat.productCount})</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">{t('shop.filters.priceRange')}</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={filters.price.min}
                onChange={(e) => onFilterChange({
                  ...filters,
                  price: { ...filters.price, min: Number(e.target.value) }
                })}
                className="w-full placeholder-gray-500"
                placeholder="Min"
              />
              <span className="text-gray-500">to</span>
              <Input
                type="number"
                value={filters.price.max}
                onChange={(e) => onFilterChange({
                  ...filters,
                  price: { ...filters.price, max: Number(e.target.value) }
                })}
                className="w-full placeholder-gray-500"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Stock Status */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">{t('shop.filters.stockStatus')}</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => onFilterChange({ ...filters, inStock: e.target.checked })}
                className="rounded border-[#efe9df] dark:border-gray-600 text-[#c1a36f] focus:ring-[#c1a36f]"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">{t('shop.filters.inStock')}</span>
            </label>
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => onFilterChange({
            category: [],
            price: { min: 0, max: 1000000 },
            sort: 'newest',
            inStock: false
          })}
          className="w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-300 hover:text-white bg-[#f3efe7] dark:bg-gray-700 hover:bg-[#c1a36f] dark:hover:bg-[#c1a36f] rounded-lg mt-4 shadow"
        >
          {t('shop.filters.clearAll')}
        </button>
      </div>
    </div>
  );
}