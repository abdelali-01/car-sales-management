'use client';
import React from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import TextArea from '@/components/form/input/TextArea';
import { useTranslation } from 'react-i18next';

interface OfferDetailsSectionProps {
    brand: string;
    model: string;
    year: number;
    km: number;
    location: string;
    description: string;
    onChange: (field: string, value: string | number) => void;
    errors?: Record<string, string>;
}

export default function OfferDetailsSection({
    brand,
    model,
    year,
    km,
    location,
    description,
    onChange,
    errors = {}
}: OfferDetailsSectionProps) {
    const { t } = useTranslation('admin');

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Car Details
            </h2>

            <div className="space-y-5">
                {/* Row 1: Brand & Model */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <Label htmlFor="brand">{t('offers.form.brand')}</Label>
                        <Input
                            id="brand"
                            type="text"
                            placeholder="e.g. Toyota"
                            value={brand}
                            onChange={(e) => onChange('brand', e.target.value)}
                            error={!!errors.brand}
                            hint={errors.brand}
                        />
                    </div>
                    <div>
                        <Label htmlFor="model">{t('offers.form.model')}</Label>
                        <Input
                            id="model"
                            type="text"
                            placeholder="e.g. Corolla"
                            value={model}
                            onChange={(e) => onChange('model', e.target.value)}
                            error={!!errors.model}
                            hint={errors.model}
                        />
                    </div>
                </div>

                {/* Row 2: Year, KM, Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <Label htmlFor="year">{t('offers.form.year')}</Label>
                        <Input
                            id="year"
                            type="number"
                            placeholder="2024"
                            value={year || ''}
                            onChange={(e) => onChange('year', Number(e.target.value))}
                            error={!!errors.year}
                            hint={errors.year}
                        />
                    </div>
                    <div>
                        <Label htmlFor="km">{t('offers.form.km')}</Label>
                        <Input
                            id="km"
                            type="number"
                            placeholder="0"
                            value={km || ''}
                            onChange={(e) => onChange('km', Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="location">{t('offers.form.location')}</Label>
                        <Input
                            id="location"
                            type="text"
                            placeholder="e.g. Algiers"
                            value={location}
                            onChange={(e) => onChange('location', e.target.value)}
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <Label htmlFor="description">{t('offers.form.description')}</Label>
                    <TextArea
                        placeholder="Enter car description..."
                        value={description}
                        onChange={(val) => onChange('description', val)}
                        rows={5}
                    />
                </div>
            </div>
        </div>
    );
}
