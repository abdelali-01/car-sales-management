'use client';
import React from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import TextArea from '@/components/form/input/TextArea';
import YearPrecisionPicker, { DatePrecision } from './YearPrecisionPicker';
import OriginPicker from './OriginPicker';
import { useTranslation } from 'react-i18next';

interface OfferDetailsSectionProps {
    brand: string;
    model: string;
    year: number;
    month?: number;
    day?: number;
    precision: DatePrecision;
    km: number;
    region?: string;
    originCountry?: string;
    description: string;
    onChange: (field: string, value: string | number | undefined) => void;
    errors?: Record<string, string>;
}

export default function OfferDetailsSection({
    brand,
    model,
    year,
    month,
    day,
    precision,
    km,
    region = '',
    originCountry = '',
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

                {/* Year Precision Picker */}
                <div>
                    <Label htmlFor="year">{t('offers.form.year')}</Label>
                    <YearPrecisionPicker
                        year={year}
                        month={month}
                        day={day}
                        precision={precision}
                        onPrecisionChange={(p) => onChange('precision', p)}
                        onYearChange={(y) => onChange('year', y)}
                        onMonthChange={(m) => onChange('month', m)}
                        onDayChange={(d) => onChange('day', d)}
                        error={errors.year}
                    />
                </div>

                {/* Row: KM & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    {/* Origin / Place of Origin */}
                    <div>
                        <Label htmlFor="region">Location</Label>
                        <OriginPicker
                            region={region}
                            originCountry={originCountry}
                            onChange={(data) => {
                                if (data.region !== undefined) onChange('region', data.region);
                                if (data.originCountry !== undefined) onChange('originCountry', data.originCountry);
                            }}
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
