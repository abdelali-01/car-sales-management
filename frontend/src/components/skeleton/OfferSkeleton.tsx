'use client';
import React from 'react';
import {
    SkeletonBox,
    SkeletonLine,
    SkeletonCard,
} from './SkeletonBase';
import { FieldSkeleton, TextareaSkeleton } from './FormSkeleton';

/* ── Offer Form Skeleton (Add / Edit pages) ──────────────── */

/**
 * Matches the two-column layout of the Offer Add/Edit pages:
 *  - Left:  Car Details + Contact & Delivery
 *  - Right: Pricing & Status + Images
 */
export const OfferFormSkeleton = () => (
    <div className="space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
            <SkeletonLine className="h-6 w-24" />
            <SkeletonLine className="h-6 w-4" />
            <SkeletonLine className="h-6 w-20" />
            <SkeletonLine className="h-6 w-4" />
            <SkeletonLine className="h-6 w-28" />
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-5">
            {/* Left Column */}
            <div className="flex flex-col gap-5 col-span-2 lg:col-span-3 h-full">
                {/* Car Details Section */}
                <SkeletonCard>
                    <SkeletonLine className="h-5 w-28 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FieldSkeleton />
                        <FieldSkeleton />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                        <FieldSkeleton />
                        <FieldSkeleton />
                        <FieldSkeleton />
                    </div>
                    <div className="mt-5">
                        <TextareaSkeleton />
                    </div>
                </SkeletonCard>

                {/* Contact & Delivery Section */}
                <SkeletonCard className="h-full">
                    <SkeletonLine className="h-5 w-48 mb-6" />
                    <div className="space-y-5">
                        <FieldSkeleton />
                        <FieldSkeleton />
                        <FieldSkeleton />
                    </div>
                </SkeletonCard>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-5 col-span-1 lg:col-span-2 h-full">
                {/* Pricing & Status Section */}
                <SkeletonCard>
                    <SkeletonLine className="h-5 w-32 mb-6" />
                    <div className="space-y-5">
                        <FieldSkeleton />
                        <FieldSkeleton />
                    </div>
                </SkeletonCard>

                {/* Images Section */}
                <SkeletonCard className="flex-1 flex flex-col">
                    <SkeletonLine className="h-5 w-20 mb-6" />
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <SkeletonBox className="aspect-square rounded-lg" />
                        <SkeletonBox className="aspect-square rounded-lg" />
                        <SkeletonBox className="aspect-square rounded-lg" />
                        <SkeletonBox className="aspect-square rounded-lg" />
                    </div>
                    <div className="flex-1 flex items-center">
                        <SkeletonBox className="w-full h-28 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700" />
                    </div>
                </SkeletonCard>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
            <SkeletonBox className="h-10 w-24 rounded-lg" />
            <SkeletonBox className="h-10 w-36 rounded-lg" />
        </div>
    </div>
);

/* ── Offer List Skeleton (table page) ────────────────────── */

const OfferTableRowSkeleton = () => (
    <tr className="border-b border-gray-50 dark:border-gray-700/50">
        {/* Image */}
        <td className="px-5 py-4">
            <SkeletonBox className="h-12 w-16 rounded-md" />
        </td>
        {/* Brand + Model */}
        <td className="px-5 py-4">
            <div className="space-y-1.5">
                <SkeletonLine className="h-4 w-24" />
                <SkeletonLine className="h-3 w-16" />
            </div>
        </td>
        {/* Year */}
        <td className="px-5 py-4">
            <SkeletonLine className="h-4 w-12" />
        </td>
        {/* Price */}
        <td className="px-5 py-4">
            <SkeletonLine className="h-4 w-20" />
        </td>
        {/* Location */}
        <td className="px-5 py-4">
            <SkeletonLine className="h-4 w-16" />
        </td>
        {/* Status */}
        <td className="px-5 py-4">
            <SkeletonBox className="h-6 w-20 rounded-full" />
        </td>
        {/* Actions */}
        <td className="px-5 py-4">
            <div className="flex gap-2 justify-end">
                <SkeletonBox className="h-8 w-8 rounded-lg" />
                <SkeletonBox className="h-8 w-8 rounded-lg" />
            </div>
        </td>
    </tr>
);

export const OfferListSkeleton = ({ rows = 7 }: { rows?: number }) => (
    <div>
        {/* Search bar */}
        <div className="mb-5">
            <SkeletonBox className="h-10 w-64 rounded-lg" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                        {['Image', 'Car', 'Year', 'Price', 'Location', 'Status', ''].map((_, i) => (
                            <th key={i} className="px-5 py-3 text-left">
                                <SkeletonLine className={`h-3 ${i === 6 ? 'w-12 ml-auto' : 'w-16'}`} />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <OfferTableRowSkeleton key={i} />
                    ))}
                </tbody>
            </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
            <SkeletonLine className="h-4 w-36" />
            <div className="flex gap-1.5">
                <SkeletonBox className="h-8 w-8 rounded-lg" />
                <SkeletonBox className="h-8 w-8 rounded-lg" />
                <SkeletonBox className="h-8 w-8 rounded-lg" />
            </div>
        </div>
    </div>
);

export default OfferFormSkeleton;
