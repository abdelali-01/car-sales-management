'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import VisitorInfoSection from '@/components/visitors/VisitorInfoSection';
import VisitorInterestsSection from '@/components/visitors/VisitorInterestsSection';
import VisitorOffersSection from '@/components/visitors/VisitorOffersSection';
import { AppDispatch, RootState } from '@/store/store';
import { fetchVisitorById } from '@/store/visitors/visitorsHandler';
import { fetchOffers } from '@/store/offers/offersHandler';
import { VisitorDetailSkeleton } from '@/components/skeleton/VisitorSkeleton';
import { Offer } from '@/types/auto-sales';

export default function VisitorDetailPage() {
    const params = useParams();
    const visitorId = Number(params.id);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { t } = useTranslation('admin');

    const { currentVisitor, loading } = useSelector((state: RootState) => state.visitors);
    const { offers } = useSelector((state: RootState) => state.offers);
    const [recommendedOffers, setRecommendedOffers] = useState<Offer[]>([]);

    useEffect(() => {
        if (visitorId) {
            dispatch(fetchVisitorById(visitorId));
            dispatch(fetchOffers());
        }
    }, [dispatch, visitorId]);

    useEffect(() => {
        if (currentVisitor && offers) {
            // Filter recommended offers
            const interestOfferIds = currentVisitor.interests?.map(i => i.offerId) || [];

            const filtered = offers.filter(offer => {
                // Only available offers
                if (offer.status !== 'available') return false;

                // Exclude offers already in interests
                if (interestOfferIds.includes(offer.id)) return false;

                // Budget match (±40%)
                const budgetMin = currentVisitor.budget * 0.6;
                const budgetMax = currentVisitor.budget * 1.4;
                if (offer.price < budgetMin || offer.price > budgetMax) return false;

                return true;
            });

            // Sort by price proximity to budget
            filtered.sort((a, b) => {
                const diffA = Math.abs(a.price - currentVisitor.budget);
                const diffB = Math.abs(b.price - currentVisitor.budget);
                return diffA - diffB;
            });

            setRecommendedOffers(filtered.slice(0, 6)); // Limit to 6 offers
        }
    }, [currentVisitor, offers]);

    if (loading || !currentVisitor) {
        return <VisitorDetailSkeleton />;
    }

    return (
        <div className="space-y-5">
            <PageBreadcrumb paths={[{ name: t('visitors.title', { defaultValue: 'Visitors' }), url: '/visitors' }]} pageTitle={currentVisitor.name} />

            {/* 3-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left Column - 2 sections */}
                <div className="lg:col-span-2 flex flex-col gap-5 h-full">
                    {/* Visitor Information */}
                    <div className="flex-none">
                        <VisitorInfoSection visitor={currentVisitor} visitorId={visitorId} />
                    </div>

                    {/* Interests & Notes */}
                    <div className="flex-1">
                        <VisitorInterestsSection
                            visitor={currentVisitor}
                            visitorId={visitorId}
                        />
                    </div>
                </div>

                {/* Right Column - Offers */}
                <div className="lg:col-span-1 h-full">
                    <VisitorOffersSection
                        offers={recommendedOffers}
                        allOffers={offers || []}
                        visitor={currentVisitor}
                        visitorId={visitorId}
                    />
                </div>
            </div>
        </div>
    );
}
