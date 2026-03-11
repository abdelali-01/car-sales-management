import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Offer, Visitor } from '@/types/auto-sales';
import { AppDispatch } from '@/store/store';
import { addVisitorInterest } from '@/store/visitors/visitorsHandler';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { shareOfferViaWhatsApp, formatPrice } from '@/utils';

interface VisitorOffersSectionProps {
    offers: Offer[];
    allOffers?: Offer[];
    visitor: Visitor;
    visitorId: number;
}

export default function VisitorOffersSection({ offers, allOffers = [], visitor, visitorId }: VisitorOffersSectionProps) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { t } = useTranslation('admin');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'matching' | 'all'>('matching');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 2;

    const handleAddToInterests = async (e: React.MouseEvent, offerId: number) => {
        e.stopPropagation();
        await dispatch(addVisitorInterest(visitorId, offerId));
    };

    const handleWhatsAppShare = (e: React.MouseEvent, offer: Offer) => {
        e.stopPropagation();
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

    const handleCreateOrder = (e: React.MouseEvent, offer: Offer) => {
        e.stopPropagation();
        // Navigate to orders page with pre-filled data
        router.push(`/orders/add?offerId=${offer.id}&visitorId=${visitorId}`);
    };

    const isInInterests = (offerId: number) => {
        return visitor.interests?.some(i => i.offerId === offerId) || false;
    };

    const baseOffers = activeTab === 'matching' ? offers : allOffers;

    const searchResults = baseOffers.filter(offer => {
        if (offer.status !== 'available') return false;

        const searchLower = searchQuery.toLowerCase();
        return (
            offer.brand.toLowerCase().includes(searchLower) ||
            offer.model.toLowerCase().includes(searchLower) ||
            offer.year.toString().includes(searchLower) ||
            offer.location.toLowerCase().includes(searchLower)
        );
    });

    const displayedOffers = searchQuery.trim() !== '' ? searchResults : baseOffers;
    
    // Pagination logic
    const totalPages = Math.ceil(displayedOffers.length / ITEMS_PER_PAGE);
    const paginatedOffers = displayedOffers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset pagination when changing tabs or searching
    React.useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery]);

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-6 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('visitors.details.offersMayLike', 'Offers May Like')}
            </h2>

            {/* Tabs */}
            <div className="flex space-x-2 mb-4">
                <button
                    onClick={() => setActiveTab('matching')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === 'matching'
                            ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                    }`}
                >
                    Matching Offers ({offers.length})
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === 'all'
                            ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                    }`}
                >
                    All Available ({allOffers.length})
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder={t('offers.search', 'Search offers...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {displayedOffers.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('visitors.details.noMatchingOffers', 'No matching offers available')}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {t('visitors.details.tryAdjusting', 'Try adjusting the visitor\'s budget or preferences')}
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {paginatedOffers.map((offer) => (
                            <div
                            key={offer.id}
                            onClick={() => router.push(`/offers/${offer.id}`)}
                            className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer"
                        >
                            {/* Image */}
                            <div className="relative aspect-video bg-gray-100 dark:bg-gray-900">
                                {offer.images && offer.images.length > 0 ? (
                                    <img
                                        src={offer.images[0].imageUrl}
                                        alt={`${offer.brand} ${offer.model}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}

                                {/* Add to Interests Button */}
                                <button
                                    onClick={(e) => handleAddToInterests(e, offer.id)}
                                    disabled={isInInterests(offer.id)}
                                    className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all ${isInInterests(offer.id)
                                        ? 'bg-red-500 text-white cursor-not-allowed'
                                        : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-red-500'
                                        }`}
                                    title={isInInterests(offer.id) ? t('visitors.details.alreadyInInterests', 'Already in interests') : t('visitors.details.addToInterests', 'Add to interests')}
                                >
                                    {isInInterests(offer.id) ? (
                                        <HeartSolidIcon className="w-5 h-5" />
                                    ) : (
                                        <HeartIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                                    {offer.brand} {offer.model}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    {offer.year} • {offer.km.toLocaleString()} km • {offer.location}
                                </p>
                                <p className="text-brand-600 dark:text-brand-400 font-semibold text-sm mb-3">
                                    {formatPrice(offer.price)}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => handleWhatsAppShare(e, offer)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors text-xs font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        {t('common.share', 'Share')}
                                    </button>
                                    <button
                                        onClick={(e) => handleCreateOrder(e, offer)}
                                        disabled={offer.status === 'sold'}
                                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border transition-colors text-xs font-medium ${offer.status === 'sold'
                                            ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
                                            : 'border-brand-500 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20'
                                            }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        {offer.status === 'sold' ? t('visitors.details.sold', 'Sold') : t('visitors.details.order', 'Order')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>

                    {/* Pagination - Pushed to bottom */}
                    <div className="mt-auto pt-6">
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
