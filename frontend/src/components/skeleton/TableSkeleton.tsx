'use client';
import React from 'react';
import { SkeletonBox, SkeletonLine } from './SkeletonBase';

/* ── Table Skeleton ──────────────────────────────────────── */

interface TableSkeletonProps {
    /** Number of visible columns */
    columns?: number;
    /** Number of body rows */
    rows?: number;
    /** Show a search bar above the table */
    showSearch?: boolean;
    /** Show action buttons in the header */
    showActions?: boolean;
    /** Show pagination below the table */
    showPagination?: boolean;
    /** Show checkbox column */
    showCheckbox?: boolean;
    /** Show image column (e.g. product / offer tables) */
    showImage?: boolean;
}

export const TableSkeleton = ({
    columns = 5,
    rows = 7,
    showSearch = true,
    showActions = true,
    showPagination = true,
    showCheckbox = false,
    showImage = false,
}: TableSkeletonProps) => {
    const totalCols = columns + (showCheckbox ? 1 : 0) + (showImage ? 1 : 0);

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50">
            {/* Toolbar: Search + Actions */}
            {(showSearch || showActions) && (
                <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-gray-100 dark:border-gray-700">
                    {showSearch && (
                        <SkeletonBox className="h-10 w-64 rounded-lg" />
                    )}
                    {showActions && (
                        <div className="flex gap-2">
                            <SkeletonBox className="h-10 w-28 rounded-lg" />
                            <SkeletonBox className="h-10 w-10 rounded-lg" />
                        </div>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Head */}
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                            {Array.from({ length: totalCols }).map((_, i) => (
                                <th key={i} className="px-5 py-3">
                                    <SkeletonLine className={`h-3 ${i === 0 && showCheckbox ? 'w-5' : 'w-20'}`} />
                                </th>
                            ))}
                            {/* Actions column */}
                            <th className="px-5 py-3">
                                <SkeletonLine className="h-3 w-12 ml-auto" />
                            </th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {Array.from({ length: rows }).map((_, rowIdx) => (
                            <tr
                                key={rowIdx}
                                className="border-b border-gray-50 dark:border-gray-700/50"
                            >
                                {Array.from({ length: totalCols }).map((_, colIdx) => (
                                    <td key={colIdx} className="px-5 py-4">
                                        {colIdx === 0 && showCheckbox ? (
                                            <SkeletonBox className="h-4 w-4 rounded" />
                                        ) : colIdx === (showCheckbox ? 1 : 0) && showImage ? (
                                            <SkeletonBox className="h-10 w-10 rounded-lg" />
                                        ) : (
                                            <SkeletonLine className={`h-4 w-${colIdx % 2 === 0 ? '24' : '16'}`} />
                                        )}
                                    </td>
                                ))}
                                {/* Row actions */}
                                <td className="px-5 py-4">
                                    <div className="flex gap-2 justify-end">
                                        <SkeletonBox className="h-8 w-8 rounded-lg" />
                                        <SkeletonBox className="h-8 w-8 rounded-lg" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {showPagination && (
                <div className="flex items-center justify-between p-5 border-t border-gray-100 dark:border-gray-700">
                    <SkeletonLine className="h-4 w-32" />
                    <div className="flex gap-1.5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <SkeletonBox key={i} className="h-8 w-8 rounded-lg" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableSkeleton;
