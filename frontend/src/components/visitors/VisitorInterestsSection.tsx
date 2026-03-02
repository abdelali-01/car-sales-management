import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Visitor, Offer } from '@/types/auto-sales';
import { AppDispatch, RootState } from '@/store/store';
import { removeVisitorInterest, updateVisitorInterestPriority, updateVisitorRemarks } from '@/store/visitors/visitorsHandler';
import { TrashIcon, PencilIcon, CheckIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { formatPrice, shareOfferViaWhatsApp } from '@/utils';
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

    const handleWhatsAppShare = (e: React.MouseEvent, offer: Offer | undefined) => {
        e.stopPropagation();
        if (!offer) return;
        const link = shareOfferViaWhatsApp(visitor.phone, {
            brand: offer.brand,
            model: offer.model,
            year: offer.year,
            km: offer.km,
            remarks: offer.remarks,
            price: offer.price,
            location: offer.location,
            imageUrl: offer.images?.[0]?.imageUrl,
            offerUrl: `${window.location.origin}/offers/${offer.id}`
        });
        window.open(link, '_blank');
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
                                            <div className="flex items-center gap-2">
                                                {/* WhatsApp Share Button */}
                                                <button
                                                    onClick={(e) => handleWhatsAppShare(e, interest.offer)}
                                                    className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors shadow-sm flex items-center gap-1.5 text-white bg-green-500 hover:bg-green-600"
                                                    title={t('common.share', 'Share')}
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                    </svg>
                                                </button>
                                                {/* Order Button - Bottom Left */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/orders/add?offerId=${interest.offerId}&visitorId=${visitorId}`);
                                                    }}
                                                    disabled={interest.offer?.status === 'sold'}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors shadow-sm flex items-center gap-1.5 ${interest.offer?.status === 'sold'
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                                                        : 'text-white bg-brand-600 hover:bg-brand-700'
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
