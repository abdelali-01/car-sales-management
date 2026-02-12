'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Table, TableRow, TableHeader, TableCell, TableBody } from '../ui/table';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import Loader from '../ui/load/Loader';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { fetchClients } from '@/store/clients/clientsHandler';

const ITEMS_PER_PAGE = 7;

export default function ClientsTable() {
    const dispatch = useDispatch<AppDispatch>();
    const clients = useSelector((state: RootState) => state.clients.clients);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<'name' | 'totalSpent' | 'createdAt'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        dispatch(fetchClients());
    }, [dispatch]);

    const filteredClients = useMemo(() => {
        if (!clients) return [];

        let filtered = clients.filter(c =>
            c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        filtered = [...filtered].sort((a, b) => {
            if (sortField === 'totalSpent') {
                return sortOrder === 'asc' ? a.totalSpent - b.totalSpent : b.totalSpent - a.totalSpent;
            }
            if (sortField === 'name') {
                return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return filtered;
    }, [clients, searchQuery, sortField, sortOrder]);

    const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
    const paginatedClients = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredClients.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredClients, currentPage]);

    useEffect(() => { setCurrentPage(1); }, [searchQuery]);

    const handleSort = (field: 'name' | 'totalSpent' | 'createdAt') => {
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

    if (!clients) return <Loader />;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-64">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Search by name, phone, email..."
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm" />
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50 dark:bg-gray-800/80">
                            <TableRow>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('name')}>
                                        Name {sortField === 'name' && <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">Phone</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">Email</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('totalSpent')}>
                                        Total Spent {sortField === 'totalSpent' && <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">Remaining</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('createdAt')}>
                                        Date {sortField === 'createdAt' && <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {paginatedClients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        {searchQuery ? 'No clients match your search.' : 'No clients yet.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                    paginatedClients.map(client => (
                            <TableRow key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <TableCell className="px-4 py-3 min-w-[180px]">
                                    <div onClick={() => window.location.href = `/clients/${client.id}`} className="cursor-pointer group">
                                        <span className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-brand-500 transition-colors">{client.name}</span>
                                        {client.address && <p className="text-xs text-gray-500 dark:text-gray-400">{client.address}</p>}
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{client.phone}</TableCell>
                                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{client.email || '—'}</TableCell>
                                <TableCell className="px-4 py-3 text-gray-900 dark:text-white font-medium text-sm">{formatPrice(client.totalSpent)}</TableCell>
                                <TableCell className="px-4 py-3 text-sm">
                                    <span className={client.remainingBalance > 0 ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
                                        {formatPrice(client.remainingBalance)}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{formatDate(client.createdAt)}</TableCell>
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
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredClients.length)} of {filteredClients.length}
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
