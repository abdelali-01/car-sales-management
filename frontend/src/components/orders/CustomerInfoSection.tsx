'use client';
import React from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';

interface CustomerInfoSectionProps {
    name: string;
    phone: string;
    remarks?: string;
    editable?: boolean;
    onChange?: (field: string, value: string) => void;
}

export default function CustomerInfoSection({
    name,
    phone,
    remarks,
    editable = false,
    onChange
}: CustomerInfoSectionProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Customer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <Label>Customer Name</Label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => onChange?.('name', e.target.value)}
                        disabled={!editable}
                    />
                </div>
                <div>
                    <Label>Phone Number</Label>
                    <Input
                        type="text"
                        value={phone}
                        onChange={(e) => onChange?.('phone', e.target.value)}
                        disabled={!editable}
                    />
                </div>
                {remarks && (
                    <div className="md:col-span-2">
                        <Label>Remarks</Label>
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                            {remarks}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
