'use client';
import React from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { useTranslation } from 'react-i18next';

interface OfferContactSectionProps {
    ownerName: string;
    ownerPhone: string;
    deliveryCompany?: string;
    onChange: (field: string, value: string) => void;
    errors?: Record<string, string>;
}

export default function OfferContactSection({
    ownerName,
    ownerPhone,
    deliveryCompany,
    onChange,
    errors = {}
}: OfferContactSectionProps) {
    const { t } = useTranslation('admin');

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6 h-full">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Contact & Delivery Company
            </h2>

            <div className="space-y-5">
                <div>
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input
                        id="ownerName"
                        type="text"
                        placeholder="Full Name"
                        value={ownerName || ''}
                        onChange={(e) => onChange('ownerName', e.target.value)}
                    />
                </div>

                <div>
                    <Label htmlFor="ownerPhone">Owner Phone</Label>
                    <Input
                        id="ownerPhone"
                        type="text"
                        placeholder="0550..."
                        value={ownerPhone || ''}
                        onChange={(e) => onChange('ownerPhone', e.target.value)}
                        error={!!errors.ownerPhone}
                        hint={errors.ownerPhone}
                    />
                </div>

                <div>
                    <Label htmlFor="deliveryCompany">Delivery Company</Label>
                    <Input
                        id="deliveryCompany"
                        type="text"
                        placeholder="Company name (optional)"
                        value={deliveryCompany || ''}
                        onChange={(e) => onChange('deliveryCompany', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
