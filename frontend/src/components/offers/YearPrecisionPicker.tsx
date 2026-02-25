'use client';
import React from 'react';

export type DatePrecision = 'year' | 'month' | 'full';

interface YearPrecisionPickerProps {
    year: number;
    month?: number;
    day?: number;
    precision: DatePrecision;
    onPrecisionChange: (precision: DatePrecision) => void;
    onYearChange: (year: number) => void;
    onMonthChange: (month: number | undefined) => void;
    onDayChange: (day: number | undefined) => void;
    error?: string;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1980 + 2 }, (_, i) => currentYear + 1 - i);

export default function YearPrecisionPicker({
    year,
    month,
    day,
    precision,
    onPrecisionChange,
    onYearChange,
    onMonthChange,
    onDayChange,
    error,
}: YearPrecisionPickerProps) {
    const handlePrecisionChange = (p: DatePrecision) => {
        onPrecisionChange(p);
        if (p === 'year') {
            onMonthChange(undefined);
            onDayChange(undefined);
        } else if (p === 'month') {
            onDayChange(undefined);
            if (!month) onMonthChange(new Date().getMonth() + 1);
        } else {
            if (!month) onMonthChange(new Date().getMonth() + 1);
            if (!day) onDayChange(new Date().getDate());
        }
    };

    // Days in selected month/year
    const daysInMonth = React.useMemo(() => {
        if (!month || !year) return 31;
        return new Date(year, month, 0).getDate();
    }, [month, year]);

    const tabs: { key: DatePrecision; label: string }[] = [
        { key: 'year', label: 'Year only' },
        { key: 'month', label: 'Month & Year' },
        { key: 'full', label: 'Full Date' },
    ];

    const inputBase = `w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors
        ${error
            ? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
        }`;

    return (
        <div className="space-y-3">
            {/* Precision Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-900/50">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => handlePrecisionChange(tab.key)}
                        className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap ${precision === tab.key
                                ? 'bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Fields */}
            <div className={`grid gap-3 ${precision === 'year' ? 'grid-cols-1' : precision === 'month' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {/* Day (full only) */}
                {precision === 'full' && (
                    <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Day</label>
                        <select
                            value={day ?? ''}
                            onChange={e => onDayChange(e.target.value ? Number(e.target.value) : undefined)}
                            className={inputBase}
                        >
                            <option value="">—</option>
                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Month (month + full) */}
                {(precision === 'month' || precision === 'full') && (
                    <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Month</label>
                        <select
                            value={month ?? ''}
                            onChange={e => onMonthChange(e.target.value ? Number(e.target.value) : undefined)}
                            className={inputBase}
                        >
                            <option value="">—</option>
                            {MONTHS.map((name, i) => (
                                <option key={i + 1} value={i + 1}>{name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Year (always) */}
                <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Year</label>
                    <select
                        value={year ?? ''}
                        onChange={e => onYearChange(Number(e.target.value))}
                        className={inputBase}
                    >
                        <option value="">Select year</option>
                        {YEARS.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Error */}
            {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}

            {/* Preview */}
            {year > 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                    Display: <span className="font-medium text-gray-600 dark:text-gray-300">
                        {precision === 'full' && day && month
                            ? `${day} ${MONTHS[month - 1]} ${year}`
                            : precision === 'month' && month
                                ? `${MONTHS[month - 1]} ${year}`
                                : `${year}`}
                    </span>
                </p>
            )}
        </div>
    );
}

/** Utility: format an offer's date for display anywhere in the app */
export function formatOfferDate(year: number, month?: number, day?: number): string {
    if (!year) return '—';
    const MONTH_NAMES = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    if (day && month) return `${day} ${MONTH_NAMES[month - 1]} ${year}`;
    if (month) return `${MONTH_NAMES[month - 1]} ${year}`;
    return `${year}`;
}
