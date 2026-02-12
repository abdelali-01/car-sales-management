import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Visitor } from '@/types/auto-sales';
import { AppDispatch } from '@/store/store';
import { updateVisitorStatus } from '@/store/visitors/visitorsHandler';
import Badge from '../ui/badge/Badge';
import { PhoneIcon, EnvelopeIcon, CurrencyDollarIcon, CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { getWhatsAppLink, getCallLink, formatPrice } from '@/utils';

interface VisitorInfoSectionProps {
    visitor: Visitor;
    visitorId: number;
}

export default function VisitorInfoSection({ visitor, visitorId }: VisitorInfoSectionProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [isEditingStatus, setIsEditingStatus] = useState(false);

    const statusOptions = [
        { value: 'new', label: 'New', color: 'info' },
        { value: 'contacted', label: 'Contacted', color: 'warning' },
        { value: 'interested', label: 'Interested', color: 'primary' },
        { value: 'converted', label: 'Converted', color: 'success' },
        { value: 'lost', label: 'Lost', color: 'error' },
    ];

    const handleStatusChange = async (newStatus: string) => {
        await dispatch(updateVisitorStatus(visitorId, newStatus));
        setIsEditingStatus(false);
    };

    const getStatusBadge = (status: string) => {
        const statusOption = statusOptions.find(opt => opt.value === status);
        if (!statusOption) return <Badge color='light'>{status}</Badge>;

        return <Badge color={statusOption.color as any}>{statusOption.label}</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-6">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {visitor.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Visitor Information
                    </p>
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                    {isEditingStatus ? (
                        <div className="absolute right-0 top-0 z-10 mt-1 w-40 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                            {statusOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleStatusChange(option.value)}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                                >
                                    <Badge color={option.color as any}>{option.label}</Badge>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditingStatus(true)}
                            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                        >
                            {getStatusBadge(visitor.status)}
                            <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                    )}

                    {/* Backdrop to close dropdown */}
                    {isEditingStatus && (
                        <div
                            className="fixed inset-0 z-0"
                            onClick={() => setIsEditingStatus(false)}
                        />
                    )}
                </div>
            </div>

            {/* Contact Actions */}
            <div className="flex gap-3 mb-6">
                <a
                    href={getWhatsAppLink(visitor.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors text-sm font-medium"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    WhatsApp
                </a>
                <a
                    href={getCallLink(visitor.phone)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                    <PhoneIcon className="w-5 h-5" />
                    Call
                </a>
            </div>

            {/* Visitor Details */}
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Phone</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{visitor.phone}</p>
                    </div>
                </div>

                {visitor.email && (
                    <div className="flex items-start gap-3">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Email</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{visitor.email}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Car Interest</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {visitor.carBrand} {visitor.carModel}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Budget</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatPrice(visitor.budget)}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Created</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(visitor.createdAt)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
