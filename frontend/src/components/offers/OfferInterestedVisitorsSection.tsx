'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, TrashIcon, PhoneIcon, XMarkIcon, MagnifyingGlassIcon, UserCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { useDeleteModal } from '@/context/DeleteModalContext';
import Badge from '@/components/ui/badge/Badge';
import { Visitor } from '@/types/auto-sales';
import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { addToast } from '@/store/toast/toastSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';

interface OfferInterestedVisitorsSectionProps {
    offerId: number;
}

export default function OfferInterestedVisitorsSection({ offerId }: OfferInterestedVisitorsSectionProps) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { openModal } = useDeleteModal();
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);

    // Add visitors state
    const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
    const [allVisitors, setAllVisitors] = useState<Visitor[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVisitorIds, setSelectedVisitorIds] = useState<number[]>([]);
    const [isAddingVisitors, setIsAddingVisitors] = useState(false);

    useEffect(() => {
        fetchInterestedVisitors();
    }, [offerId]);

    const fetchInterestedVisitors = async () => {
        try {
            setLoading(true);
            const res = await api.get(ENDPOINTS.VISITORS.BY_OFFER(offerId));
            if (res.data.success) {
                setVisitors(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching interested visitors:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllVisitors = async () => {
        try {
            const res = await api.get(ENDPOINTS.VISITORS.BASE);
            if (res.data.success) {
                setAllVisitors(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching all visitors:', error);
        }
    };

    const handleToggleAddSection = () => {
        if (!isAddSectionOpen) {
            fetchAllVisitors();
        }
        setIsAddSectionOpen(!isAddSectionOpen);
        setSearchQuery('');
        setSelectedVisitorIds([]);
    };

    const handleToggleVisitorSelection = (visitorId: number) => {
        setSelectedVisitorIds(prev =>
            prev.includes(visitorId)
                ? prev.filter(id => id !== visitorId)
                : [...prev, visitorId]
        );
    };

    const handleAddSelectedVisitors = async () => {
        if (selectedVisitorIds.length === 0) return;

        setIsAddingVisitors(true);
        try {
            const promises = selectedVisitorIds.map(visitorId =>
                api.post(ENDPOINTS.VISITORS.INTERESTS(visitorId), { offerId })
            );

            await Promise.all(promises);

            dispatch(addToast({
                type: 'success',
                message: `Added ${selectedVisitorIds.length} visitor(s) to interested list`
            }));

            setIsAddSectionOpen(false);
            setSelectedVisitorIds([]);
            setSearchQuery('');
            fetchInterestedVisitors();
        } catch (error) {
            dispatch(addToast({ type: 'error', message: 'Failed to add visitors' }));
        } finally {
            setIsAddingVisitors(false);
        }
    };

    const handleRemoveInterest = (visitorId: number, visitorName: string) => {
        openModal(visitorId, async (id: string | number) => {
            try {
                await api.delete(ENDPOINTS.VISITORS.INTEREST_BY_OFFER(Number(id), offerId));
                dispatch(addToast({ type: 'success', message: 'Visitor interest removed' }));
                fetchInterestedVisitors();
            } catch (error) {
                dispatch(addToast({ type: 'error', message: 'Failed to remove interest' }));
            }
        });
    };

    const handleVisitorClick = (visitorId: number) => {
        router.push(`/visitors/${visitorId}`);
    };

    const handleWhatsApp = (phone: string) => {
        window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
    };

    // Match visitor table status badges
    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new': return <Badge color='info' size="sm">New</Badge>;
            case 'contacted': return <Badge color='warning' size="sm">Contacted</Badge>;
            case 'interested': return <Badge color='primary' size="sm">Interested</Badge>;
            case 'converted': return <Badge color='success' size="sm">Converted</Badge>;
            case 'lost': return <Badge color='error' size="sm">Lost</Badge>;
            default: return <Badge color='light' size="sm">{status}</Badge>;
        }
    };

    // Filter available visitors
    const interestedVisitorIds = visitors.map(v => v.id);
    const availableVisitors = allVisitors.filter(v => !interestedVisitorIds.includes(v.id));

    const filteredVisitors = availableVisitors.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.phone.includes(searchQuery)
    );

    if (loading) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6 h-full">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Interested Visitors
                </h2>
                <div className="space-y-3">
                    {[1, 2].map(i => (
                        <div key={i} className="animate-pulse flex gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6 h-full">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Interested Visitors
                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                        ({visitors.length})
                    </span>
                </h2>
                <button
                    onClick={handleToggleAddSection}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                    {isAddSectionOpen ? (
                        <>
                            <XMarkIcon className="w-4 h-4" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <PlusIcon className="w-4 h-4" />
                            Add Visitor
                        </>
                    )}
                </button>
            </div>

            {/* Add Visitors Expandable Section */}
            {isAddSectionOpen && (
                <div className="mb-5 p-4 border-2 border-brand-200 dark:border-brand-800 bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/10 dark:to-gray-800 rounded-xl space-y-4 shadow-sm">
                    {/* Search Field */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or phone number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Visitors List */}
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                        {filteredVisitors.length === 0 ? (
                            <div className="text-center py-8">
                                <UserCircleIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {searchQuery ? 'No visitors found matching your search' : 'All visitors are already interested in this offer'}
                                </p>
                            </div>
                        ) : (
                            filteredVisitors.map(visitor => {
                                const isSelected = selectedVisitorIds.includes(visitor.id);
                                return (
                                    <label
                                        key={visitor.id}
                                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-sm'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                            }`}
                                    >
                                        {/* Custom Checkbox */}
                                        <div className="relative flex-shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleToggleVisitorSelection(visitor.id)}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                                                ? 'bg-brand-600 border-brand-600'
                                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                                                }`}>
                                                {isSelected && (
                                                    <CheckCircleIconSolid className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                        </div>

                                        {/* User Icon */}
                                        <div className="flex-shrink-0">
                                            <UserCircleIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                        </div>

                                        {/* Visitor Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                    {visitor.name}
                                                </span>
                                                {getStatusBadge(visitor.status)}
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                <PhoneIcon className="w-3 h-3" />
                                                {visitor.phone}
                                            </p>
                                        </div>
                                    </label>
                                );
                            })
                        )}
                    </div>

                    {/* Add Button */}
                    {selectedVisitorIds.length > 0 && (
                        <button
                            onClick={handleAddSelectedVisitors}
                            disabled={isAddingVisitors}
                            className="w-full px-4 py-3 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            {isAddingVisitors ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <CheckCircleIcon className="w-5 h-5" />
                                    Add {selectedVisitorIds.length} Visitor{selectedVisitorIds.length > 1 ? 's' : ''}
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Interested Visitors List */}
            {visitors.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                    <UserCircleIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        No interested visitors yet
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Click "Add Visitor" to start building your interest list
                    </p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                    {visitors.map((visitor) => (
                        <div
                            key={visitor.id}
                            className="flex gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all bg-white dark:bg-gray-800 group"
                        >
                            {/* User Icon */}
                            <div className="flex-shrink-0">
                                <UserCircleIcon className="w-12 h-12 text-brand-500 dark:text-brand-400" />
                            </div>

                            {/* Visitor Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-1 gap-x-2 mb-2">
                                    <button
                                        onClick={() => handleVisitorClick(visitor.id)}
                                        className="text-base font-semibold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate text-left"
                                    >
                                        {visitor.name}
                                    </button>
                                    <div className="flex-shrink-0">
                                        {getStatusBadge(visitor.status)}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1.5">
                                        <PhoneIcon className="w-4 h-4" />
                                        {visitor.phone}
                                    </span>
                                    {(visitor as any).interestPriority && (
                                        <span className="flex items-center gap-1 text-brand-600 dark:text-brand-400 font-medium">
                                            <CheckCircleIconSolid className="w-4 h-4" />
                                            Priority {(visitor as any).interestPriority}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons - Always visible on mobile, hover on desktop */}
                            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleWhatsApp(visitor.phone)}
                                    className="p-2 text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-lg transition-colors border border-green-200 dark:border-green-800"
                                    title="Contact via WhatsApp"
                                >
                                    <span className="sr-only">WhatsApp</span>
                                    <PhoneIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleRemoveInterest(visitor.id, visitor.name)}
                                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors border border-red-200 dark:border-red-800"
                                    title="Remove from interested list"
                                >
                                    <span className="sr-only">Remove</span>
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}