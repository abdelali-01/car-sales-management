'use client';
import React, { useEffect, useState, useMemo } from 'react'
import { Table, TableRow, TableHeader, TableCell, TableBody } from '../ui/table'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { OfferListSkeleton } from '@/components/skeleton';
import Image from 'next/image';
import Badge from '../ui/badge/Badge';
import { TrashIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useDeleteModal } from '@/context/DeleteModalContext';
import { fetchOffers, deleteOffer } from '@/store/offers/offersHandler';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Offer } from '@/types/auto-sales';
import OffersFilterPanel, { OffersFilterButton, OfferFilters, defaultFilters, applyFilters, countActiveFilters } from '@/components/offers/OffersFilterPanel';
import { formatOrigin } from '@/components/offers/OriginPicker';

const ITEMS_PER_PAGE = 10;

export default function OffersTable() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const offers = useSelector((state: RootState) => state.offers.offers) as Offer[] | null;
    const { openModal: openDeleteModal } = useDeleteModal();
    const { t } = useTranslation('admin');

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<'brand' | 'price' | 'year' | 'createdAt'>('createdAt');
    const [filters, setFilters] = useState<OfferFilters>(defaultFilters);
    const [showFilters, setShowFilters] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        dispatch(fetchOffers());
    }, [dispatch])

    // Filtered and sorted offers
    const filteredOffers = useMemo(() => {
        if (!offers) return [];

        // 1. Apply deep filters
        let filtered = applyFilters(offers, filters);

        // 2. Apply text search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(offer =>
                `${offer.brand} ${offer.model}`.toLowerCase().includes(q) ||
                offer.location?.toLowerCase().includes(q) ||
                offer.ownerName?.toLowerCase().includes(q)
            );
        }

        // 3. Sort offers
        filtered.sort((a, b) => {
            if (sortField === 'price') {
                return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
            }
            if (sortField === 'year') {
                return sortOrder === 'asc' ? a.year - b.year : b.year - a.year;
            }
            if (sortField === 'brand') {
                return sortOrder === 'asc'
                    ? `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`)
                    : `${b.brand} ${b.model}`.localeCompare(`${a.brand} ${a.model}`);
            }
            // Default: sort by createdAt
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return filtered;
    }, [offers, searchQuery, filters, sortField, sortOrder]);

    // Pagination
    const totalPages = Math.ceil(filteredOffers.length / ITEMS_PER_PAGE);
    const paginatedOffers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredOffers.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredOffers, currentPage]);

    // Reset to page 1 when search or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters]);

    const handleResetFilters = () => {
        setFilters(defaultFilters);
    };

    const handleSort = (field: 'brand' | 'price' | 'year' | 'createdAt') => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
        }).format(price) + ' ' + t('common.currency', 'M');
    };

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'available':
                return <Badge color='success' size="sm">{t('offers.available')}</Badge>;
            case 'reserved':
                return <Badge color='warning' size="sm">{t('offers.reserved')}</Badge>;
            case 'sold':
                return <Badge color='error' size="sm">{t('offers.sold')}</Badge>;
            default:
                return <Badge color='light' size="sm">{status}</Badge>;
        }
    };

    if (!offers) return <OfferListSkeleton />

    return (
        <div className="space-y-4">
            {/* Toolbar: Search (left) + Filter button (right) */}
            <div className="flex items-center justify-between gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('offers.search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                    />
                </div>

                {/* Filter toggle button (right) */}
                <OffersFilterButton
                    activeCount={countActiveFilters(filters)}
                    isOpen={showFilters}
                    onToggle={() => setShowFilters(prev => !prev)}
                />
            </div>

            {/* Expandable filter panel (full-width, between toolbar and table) */}
            <OffersFilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
                offers={offers || []}
                isOpen={showFilters}
            />

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50 dark:bg-gray-800/80">
                            <TableRow>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('brand')}>
                                        {t('offers.columns.car')}
                                        {sortField === 'brand' && (
                                            <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('year')}>
                                        {t('offers.columns.year')}
                                        {sortField === 'year' && (
                                            <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">
                                    {t('offers.columns.km')}
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('price')}>
                                        {t('offers.columns.price')}
                                        {sortField === 'price' && (
                                            <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">
                                    {t('offers.columns.location')}
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">
                                    {t('offers.columns.status')}
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('createdAt')}>
                                        {t('offers.columns.date')}
                                        {sortField === 'createdAt' && (
                                            <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">
                                    {t('common.actions')}
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {paginatedOffers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        {searchQuery ? t('offers.noSearchResults') : t('offers.noOffers')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedOffers.map(offer => (
                                    <TableRow
                                        key={offer.id}
                                        className='cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
                                        onClick={() => router.push(`/offers/${offer.id}`)}
                                    >
                                        <TableCell className="px-4 py-3 min-w-[240px]">
                                            <div className='flex items-center gap-3'>
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                                    {offer.images && offer.images[0] ? (
                                                        <Image
                                                            src={offer.images[0].imageUrl}
                                                            alt={`${offer.brand} ${offer.model}`}
                                                            className="w-full h-full object-cover"
                                                            width={40}
                                                            height={40}
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                                            {t('dashboard.noImg')}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-900 dark:text-white text-sm block">
                                                        {offer.brand} {offer.model}
                                                    </span>
                                                    {offer.ownerName && (
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {offer.ownerName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                                            {offer.year}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                                            {offer.km ? `${offer.km.toLocaleString()} km` : '—'}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-900 dark:text-white font-medium text-sm">
                                            {formatPrice(offer.price)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                                            <span dir='ltr'>{formatOrigin(offer.region || '', offer.originCountry || '') || offer.location || '—'}</span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            {getStatusBadge(offer.status)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                                            {formatDate(offer.createdAt)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                                <TrashIcon
                                                    className="cursor-pointer w-5 h-5 text-gray-400 hover:text-red-500 transition-colors"
                                                    onClick={() => openDeleteModal(offer.id, (id) => dispatch(deleteOffer(Number(id))))}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-4 mt-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {t('common.showing')} {Math.min(((currentPage - 1) * ITEMS_PER_PAGE) + 1, filteredOffers.length)} {t('common.to')} {Math.min(currentPage * ITEMS_PER_PAGE, filteredOffers.length)} {t('common.of')} {filteredOffers.length} {t('common.items')}
                    </span>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rtl:rotate-180"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </button>

                        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage === 1) {
                                pageNum = i + 1;
                            } else if (currentPage === totalPages) {
                                pageNum = totalPages - 2 + i;
                            } else {
                                pageNum = currentPage - 1 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                        ? 'bg-brand-500 text-white'
                                        : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rtl:rotate-180"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
