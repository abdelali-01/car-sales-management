'use client';
import React from 'react';
import {
    SkeletonBox,
    SkeletonLine,
    SkeletonCard,
} from './SkeletonBase';

/* ── Visitor List Skeleton (table page) ────────────────────── */

const VisitorTableRowSkeleton = () => (
    <tr className="border-b border-gray-50 dark:border-gray-700/50">
        {/* Name */}
        <td className="px-4 py-3">
            <SkeletonLine className="h-4 w-32" />
        </td>
        {/* Phone */}
        <td className="px-4 py-3">
            <SkeletonLine className="h-4 w-28" />
        </td>
        {/* Car Interest */}
        <td className="px-4 py-3">
            <SkeletonLine className="h-4 w-36" />
        </td>
        {/* Budget */}
        <td className="px-4 py-3">
            <SkeletonLine className="h-4 w-24" />
        </td>
        {/* Status */}
        <td className="px-4 py-3">
            <SkeletonBox className="h-6 w-20 rounded-full" />
        </td>
        {/* Date */}
        <td className="px-4 py-3">
            <SkeletonLine className="h-4 w-20" />
        </td>
        {/* Actions */}
        <td className="px-4 py-3">
            <div className="flex justify-end">
                <SkeletonBox className="h-8 w-8 rounded-lg" />
            </div>
        </td>
    </tr>
);

export const VisitorListSkeleton = ({ rows = 7 }: { rows?: number }) => (
    <div className="space-y-4">
        {/* Search bar and filter */}
        <div className="flex items-center justify-between gap-3">
            <SkeletonBox className="h-10 w-64 rounded-lg" />
            <SkeletonBox className="h-10 w-32 rounded-lg" />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800/80">
                        <tr>
                            {['Name', 'Phone', 'Car Interest', 'Budget', 'Status', 'Date', ''].map((_, i) => (
                                <th key={i} className="px-4 py-3 text-left">
                                    <SkeletonLine className={`h-3 ${i === 6 ? 'w-12 ml-auto' : 'w-16'}`} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {Array.from({ length: rows }).map((_, i) => (
                            <VisitorTableRowSkeleton key={i} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-2">
            <SkeletonLine className="h-4 w-36" />
            <div className="flex gap-1">
                <SkeletonBox className="h-9 w-9 rounded-lg" />
                <SkeletonBox className="h-9 w-9 rounded-lg" />
                <SkeletonBox className="h-9 w-9 rounded-lg" />
                <SkeletonBox className="h-9 w-9 rounded-lg" />
            </div>
        </div>
    </div>
);

/* ── Visitor Detail Page Skeleton ────────────────────── */

export const VisitorDetailSkeleton = () => (
    <div className="space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
            <SkeletonLine className="h-6 w-24" />
            <SkeletonLine className="h-6 w-4" />
            <SkeletonLine className="h-6 w-32" />
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left Column - 2 sections */}
            <div className="lg:col-span-2 space-y-5">
                {/* Visitor Information Card */}
                <SkeletonCard>
                    <div className="flex items-start justify-between mb-6">
                        <div className="space-y-2">
                            <SkeletonLine className="h-6 w-40" />
                            <SkeletonLine className="h-4 w-32" />
                        </div>
                        <SkeletonBox className="h-6 w-24 rounded-full" />
                    </div>

                    {/* Contact Actions */}
                    <div className="flex gap-3 mb-6">
                        <SkeletonBox className="flex-1 h-10 rounded-lg" />
                        <SkeletonBox className="flex-1 h-10 rounded-lg" />
                    </div>

                    {/* Visitor Details */}
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-start gap-3">
                                <SkeletonBox className="w-5 h-5 rounded" />
                                <div className="flex-1 space-y-1">
                                    <SkeletonLine className="h-3 w-16" />
                                    <SkeletonLine className="h-4 w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                </SkeletonCard>

                {/* Interests & Notes Card */}
                <SkeletonCard>
                    <SkeletonLine className="h-5 w-32 mb-4" />

                    {/* Interests */}
                    <div className="mb-6">
                        <SkeletonLine className="h-4 w-40 mb-3" />
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div className="flex-shrink-0 flex flex-col gap-0.5">
                                        <SkeletonBox className="w-9 h-9 rounded-md" />
                                        <SkeletonBox className="w-9 h-9 rounded-md" />
                                    </div>
                                    <SkeletonBox className="flex-shrink-0 w-20 h-20 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <SkeletonLine className="h-4 w-3/4" />
                                        <div className="flex gap-2">
                                            <SkeletonLine className="h-3 w-16" />
                                            <SkeletonLine className="h-3 w-20" />
                                            <SkeletonLine className="h-3 w-16" />
                                        </div>
                                        <SkeletonLine className="h-4 w-24" />
                                    </div>
                                    <SkeletonBox className="flex-shrink-0 w-9 h-9 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <SkeletonLine className="h-4 w-16" />
                            <SkeletonLine className="h-4 w-12" />
                        </div>
                        <SkeletonBox className="h-24 w-full rounded-lg" />
                    </div>
                </SkeletonCard>
            </div>

            {/* Right Column - Offers */}
            <div className="lg:col-span-1">
                <SkeletonCard>
                    <SkeletonLine className="h-5 w-32 mb-4" />
                    <SkeletonLine className="h-4 w-48 mb-6" />

                    {/* Offer Cards */}
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                <SkeletonBox className="w-full h-32 rounded-lg mb-3" />
                                <SkeletonLine className="h-4 w-3/4 mb-2" />
                                <div className="flex gap-2 mb-2">
                                    <SkeletonLine className="h-3 w-16" />
                                    <SkeletonLine className="h-3 w-20" />
                                </div>
                                <SkeletonLine className="h-4 w-24 mb-3" />
                                <div className="flex gap-2">
                                    <SkeletonBox className="flex-1 h-8 rounded-lg" />
                                    <SkeletonBox className="flex-1 h-8 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </SkeletonCard>
            </div>
        </div>
    </div>
);

export default VisitorListSkeleton;
