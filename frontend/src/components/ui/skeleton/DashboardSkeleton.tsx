'use client';
import React from 'react';

// Base skeleton pulse animation
const pulseClass = "animate-pulse bg-gray-200 dark:bg-gray-700/50 rounded";

// Metric Card Skeleton - matches EcommerceMetrics cards
export const MetricCardSkeleton = () => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        {/* Icon placeholder */}
        <div className={`w-12 h-12 rounded-xl ${pulseClass}`} />

        <div className="flex items-end justify-between mt-5">
            <div className="space-y-2 flex-1">
                {/* Label */}
                <div className={`h-4 w-32 ${pulseClass}`} />
                {/* Value */}
                <div className={`h-7 w-24 ${pulseClass}`} />
            </div>
        </div>
    </div>
);

// Grid of 4 metric card skeletons
export const MetricsGridSkeleton = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
    </div>
);

// Chart Skeleton - for StatisticsChart/MonthlySalesChart
export const ChartSkeleton = ({ height = "h-80" }: { height?: string }) => (
    <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 md:p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
                <div className={`h-5 w-36 ${pulseClass}`} />
                <div className={`h-3 w-48 ${pulseClass}`} />
            </div>
            <div className={`h-8 w-24 ${pulseClass}`} />
        </div>
        {/* Chart area */}
        <div className={`${height} ${pulseClass}`} />
    </div>
);

// Table Row Skeleton
const TableRowSkeleton = () => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${pulseClass}`} />
            <div className="space-y-1.5">
                <div className={`h-4 w-28 ${pulseClass}`} />
                <div className={`h-3 w-20 ${pulseClass}`} />
            </div>
        </div>
        <div className={`h-6 w-16 ${pulseClass}`} />
    </div>
);

// Recent Orders Skeleton
export const RecentOrdersSkeleton = () => (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 md:p-6 h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <div className="space-y-2">
                <div className={`h-5 w-32 ${pulseClass}`} />
                <div className={`h-3 w-44 ${pulseClass}`} />
            </div>
            <div className={`h-8 w-20 ${pulseClass}`} />
        </div>

        {/* Table header skeleton */}
        <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-700/50">
            <div className={`h-3 w-20 ${pulseClass}`} />
            <div className={`h-3 w-16 ${pulseClass}`} />
            <div className={`h-3 w-20 ${pulseClass}`} />
            <div className={`h-3 w-16 ${pulseClass}`} />
        </div>

        {/* Table rows */}
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
    </div>
);

// Popular Products Skeleton
export const PopularProductsSkeleton = () => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <div className="space-y-2">
                <div className={`h-5 w-36 ${pulseClass}`} />
                <div className={`h-3 w-48 ${pulseClass}`} />
            </div>
        </div>

        {/* Product items */}
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${pulseClass}`} />
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-md ${pulseClass}`} />
                            <div className="space-y-1.5">
                                <div className={`h-4 w-24 ${pulseClass}`} />
                                <div className={`h-3 w-16 ${pulseClass}`} />
                            </div>
                        </div>
                    </div>
                    <div className="text-right space-y-1.5">
                        <div className={`h-4 w-10 ${pulseClass}`} />
                        <div className={`h-3 w-8 ${pulseClass}`} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Demographic Card Skeleton
export const DemographicSkeleton = () => (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 md:p-6 h-full">
        {/* Header */}
        <div className="space-y-2 mb-6">
            <div className={`h-5 w-32 ${pulseClass}`} />
            <div className={`h-3 w-44 ${pulseClass}`} />
        </div>

        {/* Chart placeholder */}
        <div className={`h-48 w-48 rounded-full mx-auto ${pulseClass}`} />

        {/* Legend items */}
        <div className="mt-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${pulseClass}`} />
                        <div className={`h-3 w-20 ${pulseClass}`} />
                    </div>
                    <div className={`h-3 w-8 ${pulseClass}`} />
                </div>
            ))}
        </div>
    </div>
);

// Full Dashboard Skeleton
export const DashboardSkeleton = () => (
    <div className="space-y-7">
        <MetricsGridSkeleton />

        <div className="grid grid-cols-1 gap-4 md:gap-7 xl:grid-cols-12">
            <div className="xl:col-span-7 h-full">
                <ChartSkeleton height="h-64" />
            </div>
            <div className="xl:col-span-5 h-full">
                <DemographicSkeleton />
            </div>
        </div>

        <ChartSkeleton height="h-80" />

        <div className="grid grid-cols-1 gap-4 md:gap-7 xl:grid-cols-12">
            <div className="xl:col-span-4 h-full">
                <PopularProductsSkeleton />
            </div>
            <div className="xl:col-span-8 h-full">
                <RecentOrdersSkeleton />
            </div>
        </div>
    </div>
);

export default DashboardSkeleton;
