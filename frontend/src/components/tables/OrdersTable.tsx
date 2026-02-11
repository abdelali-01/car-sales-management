'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Table, TableRow, TableHeader, TableCell, TableBody } from '../ui/table';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import Loader from '../ui/load/Loader';
import Badge from '../ui/badge/Badge';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { fetchOrders, confirmOrder, completeOrder, cancelOrder } from '@/store/orders/orderHandler';

const ITEMS_PER_PAGE = 7;

export default function OrdersTable() {
    const dispatch = useDispatch<AppDispatch>();
    const orders = useSelector((state: RootState) => state.orders.orders);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<'clientName' | 'agreedPrice' | 'createdAt'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const filteredOrders = useMemo(() => {
        if (!orders) return [];

        let filtered = orders.filter(o => {
            const matchesSearch =
                o.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.clientPhone?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = !statusFilter || o.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

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
    }, [orders, searchQuery, statusFilter, sortField, sortOrder]);

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const paginatedOrders = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredOrders, currentPage]);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

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
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'DZD', minimumFractionDigits: 0 }).format(price).replace('DZD', 'DA');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING': return <Badge color='warning' size="sm">Pending</Badge>;
            case 'CONFIRMED': return <Badge color='info' size="sm">Confirmed</Badge>;
            case 'COMPLETED': return <Badge color='success' size="sm">Completed</Badge>;
            case 'CANCELLED': return <Badge color='error' size="sm">Cancelled</Badge>;
            default: return <Badge color='light' size="sm">{status}</Badge>;
        }
    };

    if (!orders) return <Loader />;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-64">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Search by client name, phone..."
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50 dark:bg-gray-800/80">
                            <TableRow>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('clientName')}>
                                        Client {sortField === 'clientName' && <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">Phone</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">Offer</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('agreedPrice')}>
                                        Agreed Price {sortField === 'agreedPrice' && <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">Deposit</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">Status</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('createdAt')}>
                                        Date {sortField === 'createdAt' && <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {paginatedOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        {searchQuery || statusFilter ? 'No orders match your search.' : 'No orders yet.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedOrders.map(order => (
                                    <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <TableCell className="px-4 py-3 min-w-[160px]">
                                            <span className="font-medium text-gray-900 dark:text-white text-sm">{order.clientName}</span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{order.clientPhone}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                                            {order.offer ? `${order.offer.brand} ${order.offer.model}` : `#${order.offerId}`}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-900 dark:text-white font-medium text-sm">
                                            {formatPrice(order.agreedPrice)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                                            {formatPrice(order.deposit)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">{getStatusBadge(order.status)}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{formatDate(order.createdAt)}</TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex items-center gap-1.5" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                                {order.status === 'PENDING' && (
                                                    <>
                                                        <button onClick={() => dispatch(confirmOrder(order.id))}
                                                            title="Confirm"
                                                            className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                                            <ClockIcon className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => dispatch(cancelOrder(order.id))}
                                                            title="Cancel"
                                                            className="p-1.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                            <XCircleIcon className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === 'CONFIRMED' && (
                                                    <>
                                                        <button onClick={() => dispatch(completeOrder(order.id))}
                                                            title="Complete"
                                                            className="p-1.5 rounded-md text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                                                            <CheckCircleIcon className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => dispatch(cancelOrder(order.id))}
                                                            title="Cancel"
                                                            className="p-1.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                            <XCircleIcon className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {(order.status === 'COMPLETED' || order.status === 'CANCELLED') && (
                                                    <span className="text-xs text-gray-400">No actions</span>
                                                )}
                                            </div>
                                        </TableCell>
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
