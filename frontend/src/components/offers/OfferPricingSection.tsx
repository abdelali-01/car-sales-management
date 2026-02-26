'use client';
import React from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { useTranslation } from 'react-i18next';

interface OfferPricingSectionProps {
    price: number;
    status: string;
    ownerName: string;
    ownerPhone: string;
    ownerEmail?: string;
    onChange: (field: string, value: string | number) => void;
    errors?: Record<string, string>;
}

export default function OfferPricingSection({
    price,
    status,
    ownerName,
    ownerPhone,
    ownerEmail,
    onChange,
    errors = {}
}: OfferPricingSectionProps) {
    const { t } = useTranslation('admin');

    const statusOptions = [
        { label: t('offers.available'), value: 'AVAILABLE' },
        { label: t('offers.reserved'), value: 'RESERVED' },
        { label: t('offers.sold'), value: 'SOLD' }
    ];

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {t('offers.form.pricingContact', 'Pricing & Contact')}
            </h2>

            <div className="space-y-5">
                {/* Price & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <Label htmlFor="price">{t('offers.form.price')}</Label>
                        <Input
                            id="price"
                            type="number"
                            placeholder="0"
                            value={price || ''}
                            onChange={(e) => onChange('price', Number(e.target.value))}
                            error={!!errors.price}
                            hint={errors.price}
                        />
                    </div>
                    <div>
                        <Label htmlFor="status">{t('offers.form.status')}</Label>
                        <Select
                            options={statusOptions}
                            defaultValue={status}
                            onChange={(val) => onChange('status', val)}
                        />
                    </div>
                </div>

                {/* Owner Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="md:col-span-2">
                        <Label htmlFor="ownerName">{t('offers.form.ownerName')}</Label>
                        <Input
                            id="ownerName"
                            type="text"
                            placeholder={t('offers.form.fullNamePlaceholder', 'Full Name')}
                            value={ownerName || ''}
                            onChange={(e) => onChange('ownerName', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="ownerPhone">{t('offers.form.ownerPhone')}</Label>
                        <Input
                            id="ownerPhone"
                            type="text"
                            placeholder={t('offers.form.phonePlaceholder', '05...')}
                            value={ownerPhone || ''}
                            onChange={(e) => onChange('ownerPhone', e.target.value)}
                            error={!!errors.ownerPhone}
                            hint={errors.ownerPhone}
                        />
                    </div>
                    <div>
                        <Label htmlFor="ownerEmail">{t('offers.form.ownerEmail', 'Owner Email')}</Label>
                        <Input
                            id="ownerEmail"
                            type="email"
                            placeholder="email@example.com"
                            value={ownerEmail || ''}
                            onChange={(e) => onChange('ownerEmail', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
