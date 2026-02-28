'use client';
import React from 'react';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Badge from '@/components/ui/badge/Badge';
import { useTranslation } from 'react-i18next';

interface OrderStatusSectionProps {
    status: 'pending' | 'confirmed' | 'completed' | 'canceled';
    createdAt?: string;
    onChange: (status: string) => void;
}

export default function OrderStatusSection({
    status,
    createdAt,
    onChange
}: OrderStatusSectionProps) {
    const { t, i18n } = useTranslation('admin');
    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'completed', label: 'Completed' },
        { value: 'canceled', label: 'Canceled' }
    ];

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'pending': return 'warning';
            case 'confirmed': return 'info';
            case 'completed': return 'success';
            case 'canceled': return 'error';
            default: return 'light';
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toLocaleDateString(i18n.language, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order Status
                </h2>
                <Badge color={getStatusColor(status)} size="md">
                    {status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <Label>Update Status</Label>
                    <Select
                        options={statusOptions}
                        defaultValue={status}
                        onChange={onChange}
                    />
                </div>
                <div>
                    <Label>Order Date</Label>
                    <div className="h-11 flex items-center px-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                        {formatDate(createdAt)}
                    </div>
                </div>
            </div>
        </div>
    );
}
