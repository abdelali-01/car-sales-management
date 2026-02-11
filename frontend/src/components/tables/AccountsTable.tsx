'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/store/store';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import { fetchAccounts } from '@/store/accounts/accountHandler';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Badge from '../ui/badge/Badge';
import Loader from '../ui/load/Loader';
import { User } from '@/app/(admin)/(others-pages)/(tables)/accounts/add/page';
import { useTranslation } from 'react-i18next';

const ITEMS_PER_PAGE = 7;

// Role configuration with colors (using available Badge colors)
const ROLE_CONFIG = {
    'super': { label: 'Super Admin', color: 'info' as const },
    'sub-super': { label: 'Admin', color: 'primary' as const },
    'manager': { label: 'Order Manager', color: 'light' as const }
};

export default function AccountsTable() {
    const { t, i18n } = useTranslation('admin');
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { accounts } = useSelector((state: RootState) => state.accounts);
    const { user: currentUser } = useSelector((state: RootState) => state.auth);

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<'username' | 'role' | 'createdAt'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        dispatch(fetchAccounts());
    }, [dispatch]);

    // Filtered and sorted accounts
    const filteredAccounts = useMemo(() => {
        if (!accounts) return [];

        let filtered = accounts.filter((account: User) =>
            account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.phone?.includes(searchQuery)
        );

        // Sort accounts
        filtered.sort((a: User, b: User) => {
            if (sortField === 'username') {
                return sortOrder === 'asc'
                    ? a.username.localeCompare(b.username)
                    : b.username.localeCompare(a.username);
            }
            if (sortField === 'role') {
                return sortOrder === 'asc'
                    ? (a.role || '').localeCompare(b.role || '')
                    : (b.role || '').localeCompare(a.role || '');
            }
            // Default: sort by createdAt
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return filtered;
    }, [accounts, searchQuery, sortField, sortOrder]);

    // Pagination
    const totalPages = Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE);
    const paginatedAccounts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAccounts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredAccounts, currentPage]);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleSort = (field: 'username' | 'role' | 'createdAt') => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString(i18n.language, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getRoleBadge = (role?: string) => {
        const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] || { color: 'gray' as const };
        const label = role ? t(`admins.roles.${role}`, { defaultValue: role }) : role;
        return <Badge color={config.color} size="sm">{label}</Badge>;
    };

    const handleRowClick = (account: User) => {
        router.push(`/accounts/${account.id}`);
    };

    if (!accounts) return <Loader />;

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-64">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('admins.searchPlaceholder')}
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
                                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm"
                                >
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-brand-500"
                                        onClick={() => handleSort('username')}
                                    >
                                        {t('admins.headers.username')}
                                        {sortField === 'username' && (
                                            <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start"
                                >
                                    {t('admins.headers.email')}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start"
                                >
                                    {t('admins.headers.phone')}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm"
                                >
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-brand-500"
                                        onClick={() => handleSort('role')}
                                    >
                                        {t('admins.headers.role')}
                                        {sortField === 'role' && (
                                            <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm"
                                >
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-brand-500"
                                        onClick={() => handleSort('createdAt')}
                                    >
                                        {t('admins.headers.created')}
                                        {sortField === 'createdAt' && (
                                            <span className="text-brand-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {paginatedAccounts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        {searchQuery ? t('admins.noResults') : t('admins.noAccounts')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedAccounts.map((account: User) => {
                                    const isCurrentUser = currentUser?.id == account.id;
                                    return (
                                        <TableRow
                                            key={account.id}
                                            className={`cursor-pointer transition-colors ${isCurrentUser
                                                ? 'bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/30 ring-1 ring-brand-200 dark:ring-brand-800'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                }`}
                                            onClick={() => handleRowClick(account)}
                                        >
                                            <TableCell className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm ${isCurrentUser
                                                        ? 'bg-gradient-to-br from-green-400 to-green-600 ring-2 ring-green-300 dark:ring-green-700'
                                                        : 'bg-gradient-to-br from-brand-400 to-brand-600'
                                                        }`}>
                                                        {account.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                                                            {account.username}
                                                        </span>
                                                        {isCurrentUser && (
                                                            <Badge color="success" size="sm">{t('admins.you')}</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                                                {account.email}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                                                {account.phone || '—'}
                                            </TableCell>
                                            <TableCell className="px-4 py-3">
                                                {getRoleBadge(account.role)}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
                                                {formatDate(account.createdAt)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {t('common.showing')} {((currentPage - 1) * ITEMS_PER_PAGE) + 1} {t('common.to')} {Math.min(currentPage * ITEMS_PER_PAGE, filteredAccounts.length)} {t('common.of')} {filteredAccounts.length}
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
    );
}
