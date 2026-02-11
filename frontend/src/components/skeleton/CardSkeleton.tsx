'use client';
import React from 'react';
import { SkeletonBox, SkeletonLine, SkeletonCircle, SkeletonCard } from './SkeletonBase';

/* ── Stat / Metric Card ──────────────────────────────────── */

export const StatCardSkeleton = () => (
    <SkeletonCard>
        <SkeletonCircle className="w-12 h-12 rounded-xl" />
        <div className="mt-5 space-y-2">
            <SkeletonLine className="h-4 w-28" />
            <SkeletonLine className="h-7 w-20" />
        </div>
    </SkeletonCard>
);

/** Grid of stat cards */
export const StatGridSkeleton = ({ count = 4 }: { count?: number }) => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <StatCardSkeleton key={i} />
        ))}
    </div>
);

/* ── Info Card (image + text) ────────────────────────────── */

export const InfoCardSkeleton = () => (
    <SkeletonCard>
        <SkeletonBox className="w-full aspect-video rounded-lg mb-4" />
        <div className="space-y-3">
            <SkeletonLine className="h-5 w-3/4" />
            <SkeletonLine className="h-4 w-1/2" />
            <div className="flex gap-2 pt-2">
                <SkeletonBox className="h-8 w-20 rounded-md" />
                <SkeletonBox className="h-8 w-20 rounded-md" />
            </div>
        </div>
    </SkeletonCard>
);

/** Grid of info cards */
export const InfoCardGridSkeleton = ({ count = 6, cols = 3 }: { count?: number; cols?: number }) => (
    <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-${cols}`}>
        {Array.from({ length: count }).map((_, i) => (
            <InfoCardSkeleton key={i} />
        ))}
    </div>
);

/* ── Detail Card (key-value pairs) ───────────────────────── */

export const DetailCardSkeleton = ({ rows = 4 }: { rows?: number }) => (
    <SkeletonCard>
        <SkeletonLine className="h-5 w-36 mb-6" />
        <div className="space-y-4">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                    <SkeletonLine className="h-4 w-24" />
                    <SkeletonLine className="h-4 w-32" />
                </div>
            ))}
        </div>
    </SkeletonCard>
);

export default StatCardSkeleton;
