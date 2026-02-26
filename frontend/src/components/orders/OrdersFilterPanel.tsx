'use client';
import React from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Order } from '@/types/auto-sales';
import { useTranslation } from 'react-i18next';

/* ── Filter state shape ─────────────────────────────────── */

export interface OrderFilters {
    type: string;
    status: string;
    processStatus: string;
    dateFrom: string;
    dateTo: string;
}

export const defaultOrderFilters: OrderFilters = {
    type: '',
    status: '',
    processStatus: '',
    dateFrom: '',
    dateTo: '',
};

/** Count how many filters are active */
export function countActiveOrderFilters(filters: OrderFilters): number {
    let count = 0;
    if (filters.type) count++;
    if (filters.status) count++;
    if (filters.processStatus) count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
}

/** Apply filters to an array of orders */
export function applyOrderFilters(orders: Order[], filters: OrderFilters): Order[] {
    return orders.filter(order => {
        if (filters.type && order.type !== filters.type) return false;
        if (filters.status && order.status !== filters.status) return false;
        if (filters.processStatus && order.processStatus !== filters.processStatus) return false;

        if (filters.dateFrom) {
            const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);
            const fromDate = new Date(filters.dateFrom).setHours(0, 0, 0, 0);
            if (orderDate < fromDate) return false;
        }

        if (filters.dateTo) {
            const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);
            const toDate = new Date(filters.dateTo).setHours(0, 0, 0, 0);
            if (orderDate > toDate) return false;
        }

        return true;
    });
}

/* ── Components ──────────────────────────────────────────── */

/* ── Button component (for the toolbar row) ──────────────── */

interface OrdersFilterButtonProps {
    activeCount: number;
    isOpen: boolean;
    onToggle: () => void;
}

export function OrdersFilterButton({ activeCount, isOpen, onToggle }: OrdersFilterButtonProps) {
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
            {t('orders.filters.button')}
            {activeCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 text-white text-xs font-bold">
                    {activeCount}
                </span>
            )}
        </button>
    );
}

/* ── Expandable panel component ──────────────────────────── */

interface OrdersFilterPanelProps {
    filters: OrderFilters;
    onChange: (filters: OrderFilters) => void;
    onReset: () => void;
    isOpen: boolean;
}

// Shared input class
const inputCls =
    'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder-gray-400';

const selectCls = inputCls;

export default function OrdersFilterPanel({
    filters,
    onChange,
    onReset,
    isOpen,
}: OrdersFilterPanelProps) {
    const { t } = useTranslation('admin');
    const activeCount = countActiveOrderFilters(filters);

    const update = (key: keyof OrderFilters, value: string) => {
        onChange({ ...filters, [key]: value });
    };

    return (
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
        >
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 p-5">
                {/* Filter grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Order Type */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            {t('orders.columns.type')}
                        </label>
                        <select
                            value={filters.type}
                            onChange={e => update('type', e.target.value)}
                            className={selectCls}
                        >
                            <option value="">{t('orders.filters.allTypes')}</option>
                            <option value="inside">{t('orders.filters.inside')}</option>
                            <option value="outside">{t('orders.filters.outside')}</option>
                        </select>
                    </div>

                    {/* Order Status */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            {t('orders.columns.status')}
                        </label>
                        <select
                            value={filters.status}
                            onChange={e => update('status', e.target.value)}
                            className={selectCls}
                        >
                            <option value="">{t('orders.filters.allStatuses')}</option>
                            <option value="pending">{t('orders.filters.pending')}</option>
                            <option value="confirmed">{t('orders.filters.confirmed')}</option>
                            <option value="completed">{t('orders.filters.completed')}</option>
                            <option value="canceled">{t('orders.filters.canceled')}</option>
                        </select>
                    </div>

                    {/* Process Status */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            {t('orders.columns.processStatus')}
                        </label>
                        <select
                            value={filters.processStatus}
                            onChange={e => update('processStatus', e.target.value)}
                            className={selectCls}
                        >
                            <option value="">{t('orders.filters.allProcesses')}</option>
                            <option value="pending">{t('orders.filters.pending')}</option>
                            <option value="transition">{t('orders.filters.transition')}</option>
                            <option value="paper_prepare">{t('orders.filters.paperPrepare')}</option>
                            <option value="in_delivery">{t('orders.filters.inDelivery')}</option>
                            <option value="in_the_port">{t('orders.filters.inThePort')}</option>
                        </select>
                    </div>

                    {/* Date Range */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            {t('filters.dateRange')}
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                placeholder={t('filters.minDate')}
                                value={filters.dateFrom}
                                onChange={e => update('dateFrom', e.target.value)}
                                className={inputCls}
                            />
                            <span className="text-gray-400 text-xs">–</span>
                            <input
                                type="date"
                                placeholder={t('filters.maxDate')}
                                value={filters.dateTo}
                                onChange={e => update('dateTo', e.target.value)}
                                className={inputCls}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {activeCount > 0
                            ? t('filters.activeCount', { count: activeCount })
                            : t('filters.noFilters')}
                    </span>
                    {activeCount > 0 && (
                        <button
                            onClick={onReset}
                            className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                        >
                            <XMarkIcon className="w-4 h-4" />
                            {t('orders.filters.reset')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
