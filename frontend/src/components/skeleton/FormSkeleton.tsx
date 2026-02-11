'use client';
import React from 'react';
import { SkeletonBox, SkeletonLine, SkeletonCard } from './SkeletonBase';

/* ── Form Field Skeleton ─────────────────────────────────── */

/** Single input field: label + input box */
export const FieldSkeleton = ({ className = '' }: { className?: string }) => (
    <div className={`space-y-2 ${className}`}>
        <SkeletonLine className="h-4 w-24" />
        <SkeletonBox className="h-11 w-full rounded-lg" />
    </div>
);

/** Textarea field: label + tall input */
export const TextareaSkeleton = ({ className = '' }: { className?: string }) => (
    <div className={`space-y-2 ${className}`}>
        <SkeletonLine className="h-4 w-28" />
        <SkeletonBox className="h-28 w-full rounded-lg" />
    </div>
);

/** Select / dropdown field */
export const SelectSkeleton = ({ className = '' }: { className?: string }) => (
    <div className={`space-y-2 ${className}`}>
        <SkeletonLine className="h-4 w-20" />
        <SkeletonBox className="h-11 w-full rounded-lg" />
    </div>
);

/* ── Form Section Skeleton ───────────────────────────────── */

interface FormSectionSkeletonProps {
    /** Number of fields inside the section */
    fields?: number;
    /** Grid columns for fields */
    cols?: number;
    /** Show section title */
    showTitle?: boolean;
    className?: string;
}

/** A card-wrapped form section with a title and field grid */
export const FormSectionSkeleton = ({
    fields = 3,
    cols = 2,
    showTitle = true,
    className = '',
}: FormSectionSkeletonProps) => (
    <SkeletonCard className={className}>
        {showTitle && <SkeletonLine className="h-5 w-36 mb-6" />}
        <div className={`grid grid-cols-1 ${cols > 1 ? `md:grid-cols-${cols}` : ''} gap-5`}>
            {Array.from({ length: fields }).map((_, i) => (
                <FieldSkeleton key={i} />
            ))}
        </div>
    </SkeletonCard>
);

/* ── Full Form Page Skeleton ─────────────────────────────── */

interface FormPageSkeletonProps {
    /** Number of form sections */
    sections?: number;
    /** Layout mode: single column or two-column grid */
    layout?: 'single' | 'two-column';
}

/**
 * Full-page form skeleton with breadcrumb, sections, and action buttons.
 * Use `layout="two-column"` for the offer add/edit style layout.
 */
export const FormPageSkeleton = ({
    sections = 2,
    layout = 'single',
}: FormPageSkeletonProps) => (
    <div className="space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
            <SkeletonLine className="h-5 w-20" />
            <SkeletonLine className="h-5 w-4" />
            <SkeletonLine className="h-5 w-28" />
        </div>

        {layout === 'two-column' ? (
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-5">
                {/* Left Column */}
                <div className="flex flex-col gap-5 col-span-2 lg:col-span-3 h-full">
                    <FormSectionSkeleton fields={5} cols={2} />
                    <FormSectionSkeleton fields={3} cols={1} />
                </div>
                {/* Right Column */}
                <div className="flex flex-col gap-5 col-span-1 lg:col-span-2 h-full">
                    <FormSectionSkeleton fields={2} cols={1} />
                    {/* Images skeleton */}
                    <SkeletonCard className="flex-1">
                        <SkeletonLine className="h-5 w-20 mb-6" />
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <SkeletonBox className="aspect-square rounded-lg" />
                            <SkeletonBox className="aspect-square rounded-lg" />
                        </div>
                        <SkeletonBox className="h-28 w-full rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700" />
                    </SkeletonCard>
                </div>
            </div>
        ) : (
            <div className="space-y-5">
                {Array.from({ length: sections }).map((_, i) => (
                    <FormSectionSkeleton key={i} fields={i === 0 ? 4 : 3} cols={2} />
                ))}
            </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
            <SkeletonBox className="h-10 w-24 rounded-lg" />
            <SkeletonBox className="h-10 w-32 rounded-lg" />
        </div>
    </div>
);

export default FormPageSkeleton;
