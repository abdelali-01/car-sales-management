'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Table, TableRow, TableHeader, TableCell, TableBody } from '../ui/table';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import Loader from '../ui/load/Loader';
import Badge from '../ui/badge/Badge';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { fetchPayments } from '@/store/payments/paymentsHandler';
import { useTranslation } from 'react-i18next';

const ITEMS_PER_PAGE = 10;

export default function PaymentsTable() {
    const { t, i18n } = useTranslation('admin');
    const dispatch = useDispatch<AppDispatch>();
    const payments = useSelector((state: RootState) => state.payments.payments);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<'amount' | 'createdAt'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        dispatch(fetchPayments());
    }, [dispatch]);

    const filteredPayments = useMemo(() => {
        if (!payments) return [];

        let filtered = payments.filter(p => {
            const matchesSearch = p.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                String(p.orderId).includes(searchQuery);
            const matchesStatus = !statusFilter || (p.status as string) === statusFilter;
            return matchesSearch && matchesStatus;
        });

        filtered = [...filtered].sort((a, b) => {
            if (sortField === 'amount') {
                return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
            }
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return filtered;
    }, [payments, searchQuery, statusFilter, sortField, sortOrder]);

    const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
    const paginatedPayments = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPayments.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredPayments, currentPage]);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

    const handleSort = (field: 'amount' | 'createdAt') => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString(i18n.language, { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(price) + ' M';
    };

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'PAID': return <Badge color='success' size="sm">Paid</Badge>;
            case 'UNPAID': return <Badge color='error' size="sm">Unpaid</Badge>;
            case 'ADVANCE': return <Badge color='warning' size="sm">Advance</Badge>;
            default: return <Badge color='light' size="sm">{status || '—'}</Badge>;
        }
    };

    const getMethodBadge = (method: string) => {
        switch (method) {
            case 'CASH': return <Badge color='light' size="sm">Cash</Badge>;
            case 'BANK_TRANSFER': return <Badge color='info' size="sm">Bank Transfer</Badge>;
            case 'CHECK': return <Badge color='primary' size="sm">Check</Badge>;
            default: return <Badge color='light' size="sm">{method}</Badge>;
        }
    };

    if (!payments) return <Loader />;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-64">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Search by order ID, notes..."
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="">All Statuses</option>
                    <option value="PAID">Paid</option>
                    <option value="UNPAID">Unpaid</option>
                    <option value="ADVANCE">Advance</option>
                </select>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50 dark:bg-gray-800/80">
                            <TableRow>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">Order ID</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">Client</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('amount')}>
                                        Amount {sortField === 'amount' && <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">Method</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">Status</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('createdAt')}>
                                        Date {sortField === 'createdAt' && <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">Notes</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {paginatedPayments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        {searchQuery || statusFilter ? 'No payments match your search.' : 'No payments yet.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedPayments.map(payment => (
                                    <TableRow key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <TableCell className="px-4 py-3 text-gray-900 dark:text-white text-sm font-medium">#{payment.orderId}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{payment.clientId ? `Client #${payment.clientId}` : '—'}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-900 dark:text-white font-medium text-sm">{formatPrice(payment.amount)}</TableCell>
                                        <TableCell className="px-4 py-3">{getMethodBadge(payment.method)}</TableCell>
                                        <TableCell className="px-4 py-3">{getStatusBadge(payment.status)}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{formatDate(payment.createdAt)}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs max-w-[150px] truncate">{payment.notes || '—'}</TableCell>
                                        <TableCell className="px-4 py-3">—</TableCell>
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
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredPayments.length)} of {filteredPayments.length}
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
