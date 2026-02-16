'use client';
import React, { useMemo } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Offer } from '@/types/auto-sales';

/* ── Filter state shape ─────────────────────────────────── */

export interface OfferFilters {
    brand: string;
    location: string;
    status: string;
    yearMin: number | '';
    yearMax: number | '';
    priceMin: number | '';
    priceMax: number | '';
    kmMin: number | '';
    kmMax: number | '';
    dateMin: string;
    dateMax: string;
}

export const defaultFilters: OfferFilters = {
    brand: '',
    location: '',
    status: '',
    yearMin: '',
    yearMax: '',
    priceMin: '',
    priceMax: '',
    kmMin: '',
    kmMax: '',
    dateMin: '',
    dateMax: '',
};

/** Count how many filters are active */
export function countActiveFilters(filters: OfferFilters): number {
    let count = 0;
    if (filters.brand) count++;
    if (filters.location) count++;
    if (filters.status) count++;
    if (filters.yearMin !== '') count++;
    if (filters.yearMax !== '') count++;
    if (filters.priceMin !== '') count++;
    if (filters.priceMax !== '') count++;
    if (filters.kmMin !== '') count++;
    if (filters.kmMax !== '') count++;
    if (filters.dateMin) count++;
    if (filters.dateMax) count++;
    return count;
}

/** Apply filters to an array of offers */
export function applyFilters(offers: Offer[], filters: OfferFilters): Offer[] {
    return offers.filter(offer => {
        if (filters.brand && offer.brand !== filters.brand) return false;
        if (filters.location && offer.location !== filters.location) return false;
        if (filters.status && offer.status !== filters.status) return false;
        if (filters.yearMin !== '' && offer.year < filters.yearMin) return false;
        if (filters.yearMax !== '' && offer.year > filters.yearMax) return false;
        if (filters.priceMin !== '' && offer.price < filters.priceMin) return false;
        if (filters.priceMax !== '' && offer.price > filters.priceMax) return false;
        if (filters.kmMin !== '' && (offer.km ?? 0) < filters.kmMin) return false;
        if (filters.kmMax !== '' && (offer.km ?? 0) > filters.kmMax) return false;
        if (filters.dateMin && new Date(offer.createdAt) < new Date(filters.dateMin)) return false;
        if (filters.dateMax) {
            const dateMax = new Date(filters.dateMax);
            dateMax.setHours(23, 59, 59, 999); // Include the entire end day
            if (new Date(offer.createdAt) > dateMax) return false;
        }
        return true;
    });
}

/* ── Components ──────────────────────────────────────────── */

/* ── Button component (for the toolbar row) ──────────────── */

interface OffersFilterButtonProps {
    activeCount: number;
    isOpen: boolean;
    onToggle: () => void;
}

export function OffersFilterButton({ activeCount, isOpen, onToggle }: OffersFilterButtonProps) {
    const { t } = useTranslation('admin');
    return (
        <button
            onClick={onToggle}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap ${isOpen || activeCount > 0
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
        >
            <FunnelIcon className="w-4 h-4" />
            {t('offers.filters.button', 'Filters')}
            {activeCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 text-white text-xs font-bold">
                    {activeCount}
                </span>
            )}
        </button>
    );
}

/* ── Expandable panel component ──────────────────────────── */

interface OffersFilterPanelProps {
    filters: OfferFilters;
    onChange: (filters: OfferFilters) => void;
    onReset: () => void;
    offers: Offer[];
    isOpen: boolean;
}

// Shared input class
const inputCls =
    'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder-gray-400';

const selectCls = inputCls;

export default function OffersFilterPanel({
    filters,
    onChange,
    onReset,
    offers,
    isOpen,
}: OffersFilterPanelProps) {
    const { t } = useTranslation('admin');
    const activeCount = countActiveFilters(filters);

    /* Derive unique brand & location options from all offers */
    const brandOptions = useMemo(() => {
        const brands = new Set(offers.map(o => o.brand).filter(Boolean));
        return Array.from(brands).sort();
    }, [offers]);

    const locationOptions = useMemo(() => {
        const locations = new Set(offers.map(o => o.location).filter(Boolean));
        return Array.from(locations).sort();
    }, [offers]);

    const update = (key: keyof OfferFilters, value: string | number | '') => {
        onChange({ ...filters, [key]: value });
    };

    const handleNumberChange = (key: keyof OfferFilters, raw: string) => {
        const num = raw === '' ? '' : Number(raw);
        update(key, num);
    };

    const statusOptions = [
        { value: '', label: t('offers.filters.all', 'All') },
        { value: 'available', label: t('offers.available') },
        { value: 'reserved', label: t('offers.reserved') },
        { value: 'sold', label: t('offers.sold') },
    ];

    return (
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
        >
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 p-5">
                {/* Filter grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Brand */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            {t('offers.filters.brand', 'Brand')}
                        </label>
                        <select
                            value={filters.brand}
                            onChange={e => update('brand', e.target.value)}
                            className={selectCls}
                        >
                            <option value="">{t('offers.filters.all', 'All')}</option>
                            {brandOptions.map(b => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            {t('offers.filters.location', 'Location')}
                        </label>
                        <select
                            value={filters.location}
                            onChange={e => update('location', e.target.value)}
                            className={selectCls}
                        >
                            <option value="">{t('offers.filters.all', 'All')}</option>
                            {locationOptions.map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status pills */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            {t('offers.filters.status', 'Status')}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {statusOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => update('status', opt.value)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filters.status === opt.value
                                        ? 'bg-brand-500 text-white'
                                        : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Year range */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            {t('offers.filters.yearRange', 'Year Range')}
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder={t('offers.filters.min', 'Min')}
                                value={filters.yearMin}
                                onChange={e => handleNumberChange('yearMin', e.target.value)}
                                className={inputCls}
                            />
                            <span className="text-gray-400 text-xs">–</span>
                            <input
                                type="number"
                                placeholder={t('offers.filters.max', 'Max')}
                                value={filters.yearMax}
                                onChange={e => handleNumberChange('yearMax', e.target.value)}
                                className={inputCls}
                            />
                        </div>
                    </div>

                    {/* Price range */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            {t('offers.filters.priceRange', 'Price Range')}
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder={t('offers.filters.min', 'Min')}
                                value={filters.priceMin}
                                onChange={e => handleNumberChange('priceMin', e.target.value)}
                                className={inputCls}
                            />
                            <span className="text-gray-400 text-xs">–</span>
                            <input
                                type="number"
                                placeholder={t('offers.filters.max', 'Max')}
                                value={filters.priceMax}
                                onChange={e => handleNumberChange('priceMax', e.target.value)}
                                className={inputCls}
                            />
                        </div>
                    </div>

                    {/* KM range */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            {t('offers.filters.kmRange', 'KM Range')}
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder={t('offers.filters.min', 'Min')}
                                value={filters.kmMin}
                                onChange={e => handleNumberChange('kmMin', e.target.value)}
                                className={inputCls}
                            />
                            <span className="text-gray-400 text-xs">–</span>
                            <input
                                type="number"
                                placeholder={t('offers.filters.max', 'Max')}
                                value={filters.kmMax}
                                onChange={e => handleNumberChange('kmMax', e.target.value)}
                                className={inputCls}
                            />
                        </div>
                    </div>

                    {/* Date range */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            {t('offers.filters.dateRange', 'Date Range')}
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                placeholder={t('offers.filters.minDate', 'Start')}
                                value={filters.dateMin}
                                onChange={e => update('dateMin', e.target.value)}
                                className={inputCls}
                            />
                            <span className="text-gray-400 text-xs">–</span>
                            <input
                                type="date"
                                placeholder={t('offers.filters.maxDate', 'End')}
                                value={filters.dateMax}
                                onChange={e => update('dateMax', e.target.value)}
                                className={inputCls}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {activeCount > 0
                            ? t('offers.filters.activeCount', '{{count}} filter(s) active', { count: activeCount })
                            : t('offers.filters.noFilters', 'No filters applied')}
                    </span>
                    {activeCount > 0 && (
                        <button
                            onClick={onReset}
                            className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                        >
                            <XMarkIcon className="w-4 h-4" />
                            {t('offers.filters.reset', 'Reset Filters')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
