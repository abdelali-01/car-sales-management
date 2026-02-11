'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Table, TableRow, TableHeader, TableCell, TableBody } from '../ui/table';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import Loader from '../ui/load/Loader';
import Badge from '../ui/badge/Badge';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { fetchVisitors, updateVisitorStatus } from '@/store/visitors/visitorsHandler';

const ITEMS_PER_PAGE = 7;

export default function VisitorsTable() {
    const dispatch = useDispatch<AppDispatch>();
    const visitors = useSelector((state: RootState) => state.visitors.visitors);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<'name' | 'budget' | 'createdAt'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        dispatch(fetchVisitors());
    }, [dispatch]);

    const filteredVisitors = useMemo(() => {
        if (!visitors) return [];

        let filtered = visitors.filter(v => {
            const matchesSearch =
                v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.carBrand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.carModel?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = !statusFilter || v.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        filtered = [...filtered].sort((a, b) => {
            if (sortField === 'budget') {
                return sortOrder === 'asc' ? (a.budget || 0) - (b.budget || 0) : (b.budget || 0) - (a.budget || 0);
            }
            if (sortField === 'name') {
                return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return filtered;
    }, [visitors, searchQuery, statusFilter, sortField, sortOrder]);

    const totalPages = Math.ceil(filteredVisitors.length / ITEMS_PER_PAGE);
    const paginatedVisitors = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredVisitors.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredVisitors, currentPage]);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

    const handleSort = (field: 'name' | 'budget' | 'createdAt') => {
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

    const formatPrice = (price?: number) => {
        if (!price) return '—';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'DZD', minimumFractionDigits: 0 }).format(price).replace('DZD', 'DA');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'NEW': return <Badge color='info' size="sm">New</Badge>;
            case 'CONTACTED': return <Badge color='warning' size="sm">Contacted</Badge>;
            case 'INTERESTED': return <Badge color='primary' size="sm">Interested</Badge>;
            case 'CONVERTED': return <Badge color='success' size="sm">Converted</Badge>;
            case 'LOST': return <Badge color='error' size="sm">Lost</Badge>;
            default: return <Badge color='light' size="sm">{status}</Badge>;
        }
    };

    const handleStatusChange = (visitorId: number, newStatus: string) => {
        dispatch(updateVisitorStatus(visitorId, newStatus));
    };

    if (!visitors) return <Loader />;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-64">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, phone, car..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                    <option value="">All Statuses</option>
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="INTERESTED">Interested</option>
                    <option value="CONVERTED">Converted</option>
                    <option value="LOST">Lost</option>
                </select>
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
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">Phone</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">Car Interest</TableCell>
                                <TableCell isHeader className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-brand-500" onClick={() => handleSort('budget')}>
                                        Budget {sortField === 'budget' && <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </TableCell>
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
                            {paginatedVisitors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        {searchQuery || statusFilter ? 'No visitors match your search.' : 'No visitors yet.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedVisitors.map(visitor => (
                                    <TableRow key={visitor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <TableCell className="px-4 py-3 min-w-[180px]">
                                            <div>
                                                <span className="font-medium text-gray-900 dark:text-white text-sm">{visitor.name}</span>
                                                {visitor.email && <p className="text-xs text-gray-500 dark:text-gray-400">{visitor.email}</p>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{visitor.phone}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                                            {visitor.carBrand && visitor.carModel ? `${visitor.carBrand} ${visitor.carModel}` : visitor.carBrand || '—'}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-900 dark:text-white font-medium text-sm">
                                            {formatPrice(visitor.budget)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">{getStatusBadge(visitor.status)}</TableCell>
                                        <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{formatDate(visitor.createdAt)}</TableCell>
                                        <TableCell className="px-4 py-3">
                                            <select
                                                value={visitor.status}
                                                onChange={(e) => handleStatusChange(visitor.id, e.target.value)}
                                                className="px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <option value="NEW">New</option>
                                                <option value="CONTACTED">Contacted</option>
                                                <option value="INTERESTED">Interested</option>
                                                <option value="CONVERTED">Converted</option>
                                                <option value="LOST">Lost</option>
                                            </select>
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
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredVisitors.length)} of {filteredVisitors.length}
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
