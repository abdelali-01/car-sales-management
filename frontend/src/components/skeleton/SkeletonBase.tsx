'use client';
import React from 'react';

/**
 * Base skeleton building blocks.
 * Compose these primitives to create page-specific skeletons.
 */

const pulse = 'animate-pulse bg-gray-200 dark:bg-gray-700/50';

/* ── Primitives ────────────────────────────────────────────── */

interface SkeletonBoxProps {
    className?: string;
}

/** Generic rectangular skeleton block */
export const SkeletonBox = ({ className = '' }: SkeletonBoxProps) => (
    <div className={`${pulse} rounded ${className}`} />
);

/** Circular skeleton (avatars, icons) */
export const SkeletonCircle = ({ className = 'w-10 h-10' }: SkeletonBoxProps) => (
    <div className={`${pulse} rounded-full ${className}`} />
);

/** Single line of text */
export const SkeletonLine = ({ className = 'h-4 w-full' }: SkeletonBoxProps) => (
    <div className={`${pulse} rounded ${className}`} />
);

/** A group of text lines (paragraph placeholder) */
export const SkeletonParagraph = ({ lines = 3, className = '' }: { lines?: number; className?: string }) => (
    <div className={`space-y-2.5 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
            <SkeletonLine
                key={i}
                className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
            />
        ))}
    </div>
);

/* ── Wrapper ───────────────────────────────────────────────── */

/** Standard card wrapper with border, padding, and optional full height */
export const SkeletonCard = ({
    children,
    className = ''
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6 ${className}`}>
        {children}
    </div>
);
