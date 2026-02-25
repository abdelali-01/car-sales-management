'use client';
import React from 'react';
import "flag-icons/css/flag-icons.min.css";

export interface OriginData {
    region: string;
    originCountry: string;
}

const REGIONS = [
    { key: 'europe', label: 'Europe', flagClass: 'fi-eu' },
    { key: 'middle_east', label: 'Middle East', flagClass: 'fi-arab' },
    { key: 'china', label: 'China', flagClass: 'fi-cn' },
    { key: 'algeria', label: 'Algeria', flagClass: 'fi-dz' },
];

/** Format for display */
export function formatOrigin(region: string, originCountry?: string): React.ReactNode {
    if (!region) return null;
    const reg = REGIONS.find(r => r.key === region);
    if (!reg) return region;

    return (
        <span className="flex items-center gap-1.5 inline-flex">
            <span className={`fi ${reg.flagClass}`} />
            <span>{reg.label}</span>
            {originCountry && (
                <>
                    <span className="text-gray-400 mx-0.5">/</span>
                    <span>{originCountry}</span>
                </>
            )}
        </span>
    );
}

interface OriginPickerProps {
    region: string;
    originCountry: string;
    onChange: (data: Partial<OriginData>) => void;
}

const inputBase = `w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white 
    dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 
    focus:ring-brand-500 transition-colors`;

export default function OriginPicker({ region, originCountry, onChange }: OriginPickerProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                {/* Region — 4 fixed options */}
                <div className="flex-1 relative">
                    {region && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                            <span className={`fi ${REGIONS.find(r => r.key === region)?.flagClass} text-lg rounded-[2px] shadow-sm`} />
                        </div>
                    )}
                    <select
                        value={region}
                        onChange={e => onChange({ region: e.target.value })}
                        className={`${inputBase} appearance-none cursor-pointer ${region ? 'pl-11' : ''}`}
                    >
                        <option value="">— Region</option>
                        {REGIONS.map(r => (
                            <option key={r.key} value={r.key}>
                                {r.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Divider */}
                <span className="text-gray-400 dark:text-gray-500 font-semibold text-lg select-none shrink-0">/</span>

                {/* Country — free text */}
                <div className="flex-1">
                    <input
                        type="text"
                        value={originCountry}
                        onChange={e => onChange({ originCountry: e.target.value })}
                        placeholder="e.g. France"
                        className={inputBase}
                    />
                </div>
            </div>

            {/* Live preview */}
            {region && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                    Display:{' '}
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                        {formatOrigin(region, originCountry)}
                    </span>
                </p>
            )}
        </div>
    );
}
