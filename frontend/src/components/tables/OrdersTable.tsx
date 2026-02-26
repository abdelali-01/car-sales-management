'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Table, TableRow, TableHeader, TableCell, TableBody } from '../ui/table';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import Loader from '../ui/load/Loader';
import Badge from '../ui/badge/Badge';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { fetchOrders, confirmOrder, completeOrder, cancelOrder } from '@/store/orders/orderHandler';
import OrdersFilterPanel, { OrdersFilterButton, OrderFilters, defaultOrderFilters, applyOrderFilters, countActiveOrderFilters } from '@/components/orders/OrdersFilterPanel';

const ITEMS_PER_PAGE = 10;

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function OrdersTable() {
    const { t } = useTranslation('admin');
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const orders = useSelector((state: RootState) => state.orders.orders);

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<OrderFilters>(defaultOrderFilters);
    const [showFilters, setShowFilters] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<'clientName' | 'agreedPrice' | 'createdAt'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const filteredOrders = useMemo(() => {
        if (!orders) return [];

        // 1. Apply deep filters from panel
        let filtered = applyOrderFilters(orders, filters);

        // 2. Apply text search (Client Name, Phone, Car Brand, Car Model)
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(o => {
                const clientMatch =
                    o.clientName?.toLowerCase().includes(q) ||
                    o.clientPhone?.toLowerCase().includes(q);

                const offerCarMatch = o.offer
                    ? `${o.offer.brand} ${o.offer.model}`.toLowerCase().includes(q)
                    : false;

                const orderedCarMatch = o.orderedCar
                    ? `${o.orderedCar.brand} ${o.orderedCar.model}`.toLowerCase().includes(q)
                    : false;

                const customMatch = o.offerId === null && !o.orderedCar && 'custom'.includes(q); // Fallback

                return clientMatch || offerCarMatch || orderedCarMatch || customMatch;
            });
        }

        filtered = [...filtered].sort((a, b) => {
            if (sortField === 'agreedPrice') {
                return sortOrder === 'asc' ? a.agreedPrice - b.agreedPrice : b.agreedPrice - a.agreedPrice;
            }
            if (sortField === 'clientName') {
                return sortOrder === 'asc' ? a.clientName.localeCompare(b.clientName) : b.clientName.localeCompare(a.clientName);
            }
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return filtered;
    }, [orders, searchQuery, filters, sortField, sortOrder]);

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const paginatedOrders = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredOrders, currentPage]);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, filters]);

    const handleResetFilters = () => {
        setFilters(defaultOrderFilters);
    };

    const handleSort = (field: 'clientName' | 'agreedPrice' | 'createdAt') => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(price) + ' M';
    };

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return <Badge color='warning' size="sm">{t('orders.status.pending')}</Badge>;
            case 'confirmed': return <Badge color='info' size="sm">{t('orders.status.confirmed')}</Badge>;
            case 'completed': return <Badge color='success' size="sm">{t('orders.status.completed')}</Badge>;
            case 'canceled': return <Badge color='error' size="sm">{t('orders.status.canceled')}</Badge>;
            default: return <Badge color='light' size="sm">{status}</Badge>;
        }
    };


    if (!orders) return <Loader />;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div className="relative w-full sm:w-64">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder={t('orders.search')}
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm" />
                </div>

                <OrdersFilterButton
                    activeCount={countActiveOrderFilters(filters)}
                    isOpen={showFilters}
                    onToggle={() => setShowFilters(prev => !prev)}
                />
            </div>

            <OrdersFilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
                isOpen={showFilters}
            />


            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50 dark:bg-gray-800/80">
                            <TableRow>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">{t('orders.columns.carOffer')}</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('clientName')}>
                                        {t('orders.columns.customer')} {sortField === 'clientName' && <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">{t('orders.columns.type')}</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">{t('orders.columns.phone')}</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('agreedPrice')}>
                                        {t('orders.columns.agreedPrice')} {sortField === 'agreedPrice' && <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">{t('orders.columns.deposit')}</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">{t('orders.columns.processStatus')}</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">{t('orders.columns.status')}</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('createdAt')}>
                                        {t('orders.columns.date')} {sortField === 'createdAt' && <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {paginatedOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        {searchQuery || showFilters ? t('orders.noSearchResults') : t('orders.noOrders')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedOrders.map(order => (
                                    <TableRow
                                        key={order.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/orders/${order.id}`)}
                                    >
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                                            <div className="flex items-center gap-3">
                                                {order.offer?.images?.[0] ? (
                                                    <img
                                                        src={order.offer.images[0].imageUrl}
                                                        alt={order.offer.brand}
                                                        className="w-10 h-10 rounded-md object-cover border border-gray-200 dark:border-gray-700"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                                        W
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {order.offer
                                                            ? `${order.offer.brand} ${order.offer.model}`
                                                            : order.orderedCar
                                                                ? `${order.orderedCar.brand} ${order.orderedCar.model}`
                                                                : t('orders.type.outside')}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {order.offer
                                                            ? order.offer.year
                                                            : order.orderedCar
                                                                ? order.orderedCar.year
                                                                : `#${order.id}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 min-w-[120px]">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 dark:text-white text-sm">{order.clientName}</span>
                                                {order.clientId ? (
                                                    <Badge color="success" size="sm" className="w-fit mt-0.5 text-[10px] px-1.5 py-0.5">{t('orders.form.existingClient')}</Badge>
                                                ) : (
                                                    <Badge color="light" size="sm" className="w-fit mt-0.5 text-[10px] px-1.5 py-0.5">{t('orders.form.visitor')}</Badge>
                                                )}
                                            </div>
                                        </TableCell>


                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                                            <Badge color={order.type === 'inside' ? 'info' : 'warning'} size="sm">
                                                {order.type === 'inside' ? t('orders.type.inside') : order.type === 'outside' ? t('orders.type.outside') : '—'}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{order.clientPhone}</TableCell>

                                        <TableCell className="px-4 py-3 text-gray-900 dark:text-white font-medium text-sm">
                                            {formatPrice(order.agreedPrice)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                                            {formatPrice(order.deposit)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <Badge color="light" size="sm">
                                                {order.processStatus ? t(`orders.processStatus.${order.processStatus}`) : t('orders.processStatus.pending')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">{getStatusBadge(order.status)}</TableCell>

                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{formatDate(order.createdAt)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>


            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length}
                    </span>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 3) pageNum = i + 1;
                            else if (currentPage === 1) pageNum = i + 1;
                            else if (currentPage === totalPages) pageNum = totalPages - 2 + i;
                            else pageNum = currentPage - 1 + i;
                            return (
                                <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum ? 'bg-brand-500 text-white' : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
