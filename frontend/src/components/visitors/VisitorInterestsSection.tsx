import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Visitor } from '@/types/auto-sales';
import { AppDispatch, RootState } from '@/store/store';
import { removeVisitorInterest, updateVisitorInterestPriority, updateVisitorRemarks } from '@/store/visitors/visitorsHandler';
import { TrashIcon, PencilIcon, CheckIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { formatPrice } from '@/utils';
import { useDeleteModal } from '@/context/DeleteModalContext';

interface VisitorInterestsSectionProps {
    visitor: Visitor;
    visitorId: number;
}

// Skeleton Loading Component
function InterestSkeleton() {
    return (
        <div className="flex gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse">
            {/* Up/Down Controls Skeleton */}
            <div className="flex-shrink-0 flex flex-col gap-0.5">
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>

            {/* Image Skeleton */}
            <div className="flex-shrink-0 w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>

            {/* Content Skeleton */}
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="flex gap-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>

            {/* Delete Button Skeleton */}
            <div className="flex-shrink-0">
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
        </div>
    );
}

export default function VisitorInterestsSection({ visitor, visitorId }: VisitorInterestsSectionProps) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { openModal } = useDeleteModal();
    const { loading } = useSelector((state: RootState) => state.visitors);
    const { t } = useTranslation('admin');
    const [remarks, setRemarks] = useState(visitor.remarks || '');
    const [isEditingRemarks, setIsEditingRemarks] = useState(false);

    // Local state for optimistic updates
    const [localInterests, setLocalInterests] = useState(visitor.interests || []);
    const [isUpdating, setIsUpdating] = useState(false);

    // Sync local state with Redux state when visitor changes
    useEffect(() => {
        setLocalInterests(visitor.interests || []);
    }, [visitor.interests]);

    const handleRemoveInterest = (offerId: number, offerName: string) => {
        openModal(offerId, async (id: string | number) => {
            await dispatch(removeVisitorInterest(visitorId, Number(id)));
        });
    };

    const handleSaveRemarks = async () => {
        await dispatch(updateVisitorRemarks(visitorId, remarks));
        setIsEditingRemarks(false);
    };

    const handleMoveUp = async (offerId: number, currentPriority: number) => {
        if (currentPriority <= 1 || isUpdating) return;

        setIsUpdating(true);

        // Optimistic update: swap priorities locally
        const newInterests = localInterests.map(interest => {
            if (interest.offerId === offerId) {
                return { ...interest, priority: currentPriority - 1 };
            }
            if (interest.priority === currentPriority - 1) {
                return { ...interest, priority: currentPriority };
            }
            return interest;
        });

        setLocalInterests(newInterests);

        // Background sync with server
        try {
            await dispatch(updateVisitorInterestPriority(visitorId, offerId, currentPriority - 1));
        } catch (error) {
            // Revert on error
            setLocalInterests(visitor.interests || []);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleMoveDown = async (offerId: number, currentPriority: number, maxPriority: number) => {
        if (currentPriority >= maxPriority || isUpdating) {
            return;
        }

        setIsUpdating(true);

        // Optimistic update: swap priorities locally
        const newInterests = localInterests.map(interest => {
            if (interest.offerId === offerId) {
                return { ...interest, priority: currentPriority + 1 };
            }
            if (interest.priority === currentPriority + 1) {
                return { ...interest, priority: currentPriority };
            }
            return interest;
        });

        setLocalInterests(newInterests);

        // Background sync with server
        try {
            await dispatch(updateVisitorInterestPriority(visitorId, offerId, currentPriority + 1));
        } catch (error) {
            // Revert on error
            setLocalInterests(visitor.interests || []);
        } finally {
            setIsUpdating(false);
        }
    };

    const sortedInterests = [...localInterests].sort((a, b) => a.priority - b.priority);

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('visitors.details.interestsNotes', 'Interests & Notes')}
            </h2>

            {/* Interests List */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('visitors.details.interestedOffers', 'Interested Offers')} ({sortedInterests.length})
                </h3>

                {loading ? (
                    // Skeleton Loading State
                    <div className="space-y-3">
                        <InterestSkeleton />
                        <InterestSkeleton />
                    </div>
                ) : sortedInterests.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                        {t('visitors.details.noInterests', 'No interests added yet')}
                    </p>
                ) : (
                    <div className="space-y-3">
                        {sortedInterests.map((interest, index) => (
                            <div
                                key={interest.id}
                                className={`relative flex gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out group ${isUpdating ? 'opacity-70' : 'opacity-100'
                                    }`}
                                style={{
                                    transform: isUpdating ? 'scale(0.98)' : 'scale(1)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                {/* Up/Down Controls */}
                                <div className="flex-shrink-0 flex flex-col gap-0.5 z-10">
                                    <button
                                        onClick={() => handleMoveUp(interest.offerId, interest.priority)}
                                        disabled={index === 0 || isUpdating}
                                        className={`p-1.5 rounded-md transition-all duration-200 ${index === 0 || isUpdating
                                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                            : 'text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:scale-110'
                                            }`}
                                        title={index === 0 ? t('visitors.details.alreadyTop', 'Already at top') : isUpdating ? t('visitors.details.updating', 'Updating...') : t('visitors.details.moveUp', 'Move up')}
                                    >
                                        <ChevronUpIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleMoveDown(interest.offerId, interest.priority, sortedInterests.length)}
                                        disabled={index === sortedInterests.length - 1 || isUpdating}
                                        className={`p-1.5 rounded-md transition-all duration-200 ${index === sortedInterests.length - 1 || isUpdating
                                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                            : 'text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:scale-110'
                                            }`}
                                        title={index === sortedInterests.length - 1 ? t('visitors.details.alreadyBottom', 'Already at bottom') : isUpdating ? t('visitors.details.updating', 'Updating...') : t('visitors.details.moveDown', 'Move down')}
                                    >
                                        <ChevronDownIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Clickable Card Content */}
                                <div
                                    onClick={() => router.push(`/offers/${interest.offerId}`)}
                                    className="flex-1 flex gap-3 cursor-pointer min-w-0"
                                >
                                    {/* Offer Image */}
                                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                                        {interest.offer?.images && interest.offer.images.length > 0 ? (
                                            <img
                                                src={interest.offer.images[0].imageUrl}
                                                alt={`${interest.offer.brand} ${interest.offer.model}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Offer Details */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                            {interest.offer?.brand} {interest.offer?.model}
                                        </h4>
                                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {interest.offer?.year}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                {interest.offer?.km.toLocaleString()} km
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {interest.offer?.location}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                                                {interest.offer ? formatPrice(interest.offer.price) : '—'}
                                            </p>
                                            {/* Order Button - Bottom Left */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/orders/add?offerId=${interest.offerId}&visitorId=${visitorId}`);
                                                }}
                                                disabled={interest.offer?.status === 'sold'}
                                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors shadow-sm flex items-center gap-1.5 ${interest.offer?.status === 'sold'
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                                    : 'text-white bg-green-600 hover:bg-green-700'
                                                    }`}
                                                title={interest.offer?.status === 'sold' ? t('visitors.details.offerSold', 'Offer Sold') : t('visitors.details.createOrder', 'Create Order')}
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                </svg>
                                                {interest.offer?.status === 'sold' ? t('visitors.details.sold', 'Sold') : t('visitors.details.order', 'Order')}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <div className="flex-shrink-0 z-10">
                                    <button
                                        onClick={() => handleRemoveInterest(
                                            interest.offerId,
                                            `${interest.offer?.brand} ${interest.offer?.model}`
                                        )}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title={t('common.remove', 'Remove')}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Notes Section */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('visitors.details.notes', 'Notes')}
                    </h3>
                    {!isEditingRemarks ? (
                        <button
                            onClick={() => setIsEditingRemarks(true)}
                            className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
                        >
                            <PencilIcon className="w-3.5 h-3.5" />
                            {t('common.edit', 'Edit')}
                        </button>
                    ) : (
                        <button
                            onClick={handleSaveRemarks}
                            className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                        >
                            <CheckIcon className="w-3.5 h-3.5" />
                            {t('common.save', 'Save')}
                        </button>
                    )}
                </div>

                <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    disabled={!isEditingRemarks}
                    placeholder={t('visitors.details.addNotes', 'Add notes about this visitor...')}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                    rows={4}
                />
            </div>
        </div>
    );
}
