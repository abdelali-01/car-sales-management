'use client';
import React, { useEffect, useState, useMemo } from 'react'
import { Table, TableRow, TableHeader, TableCell, TableBody } from '../ui/table'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import Loader from '../ui/load/Loader';
import Image from 'next/image';
import Badge from '../ui/badge/Badge';
import { TrashIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useDeleteModal } from '@/context/DeleteModalContext';
import { deleteProduct, fetchProducts } from '@/store/products/productHandler';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Product } from '@/app/(admin)/(others-pages)/(tables)/products/add/page';

const ITEMS_PER_PAGE = 7;

export default function ProductsTable() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const products = useSelector((state: RootState) => state.products.products) as Product[] | null;
    const { openModal: openDeleteModal } = useDeleteModal();
    const { t } = useTranslation('admin');

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<'name' | 'price' | 'createdAt'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch])

    // Filtered and sorted products
    const filteredProducts = useMemo(() => {
        if (!products) return [];

        let filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Sort products
        filtered.sort((a, b) => {
            if (sortField === 'price') {
                return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
            }
            if (sortField === 'name') {
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            }
            // Default: sort by createdAt
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return filtered;
    }, [products, searchQuery, sortField, sortOrder]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleSort = (field: 'name' | 'price' | 'createdAt') => {
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
            style: 'currency',
            currency: 'DZD',
            minimumFractionDigits: 0,
        }).format(price).replace('DZD', 'DA');
    };

    if (!products) return <Loader />

    return (
        <div className="space-y-4">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('products.search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50 dark:bg-gray-800/80">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm "
                                >
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('name')}>
                                        {t('sidebar.products')}
                                        {sortField === 'name' && (
                                            <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start"
                                >
                                    {t('products.columns.category')}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm"
                                >
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('price')}>
                                        {t('products.columns.price')}
                                        {sortField === 'price' && (
                                            <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start"
                                >
                                    {t('products.columns.stock')}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm"
                                >
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('createdAt')}>
                                        {t('products.columns.createdAt')}
                                        {sortField === 'createdAt' && (
                                            <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start"
                                >
                                    {t('common.actions')}
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {paginatedProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        {searchQuery ? t('products.noSearchResults') : t('products.noProducts')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedProducts.map(product => (
                                    <TableRow
                                        key={product.id}
                                        className='cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
                                        onClick={() => router.push(`/products/${product.id}`)}
                                    >
                                        <TableCell className="px-4 py-3 min-w-[280px]">
                                            <div className='flex items-center gap-3'>
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                                    {product.images && product.images[0] ? (
                                                        <Image
                                                            src={product.images[0]}
                                                            alt={product.name}
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
                                                <span className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm min-w-[120px]">
                                            {product.category || '—'}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-900 dark:text-white font-medium text-sm min-w-[120px]">
                                            {formatPrice(product.price)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 ">
                                            {typeof product.quantity === 'number' && product.quantity > 0 ? (
                                                <Badge color='success' size="sm">{t('products.inStock')}</Badge>
                                            ) : (
                                                <Badge color='error' size="sm">{t('products.outOfStock')}</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm ">
                                            {formatDate(product.createdAt)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                                <TrashIcon
                                                    className="cursor-pointer w-5 h-5 text-gray-400 hover:text-red-500 transition-colors"
                                                    onClick={() => openDeleteModal(product.id, (id) => dispatch(deleteProduct(Number(id))))}
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
                <div className="flex items-center justify-between px-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {t('common.showing')} {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} {t('common.of')} {filteredProducts.length}
                    </span>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}
