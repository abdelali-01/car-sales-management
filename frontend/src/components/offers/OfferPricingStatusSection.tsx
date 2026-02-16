'use client';
import React from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { useTranslation } from 'react-i18next';

interface OfferPricingStatusSectionProps {
    price: number;
    status: string;
    profit?: number;
    onChange: (field: string, value: string | number) => void;
    errors?: Record<string, string>;
}

export default function OfferPricingStatusSection({
    price,
    status: initialStatus,
    profit,
    onChange,
    errors = {}
}: OfferPricingStatusSectionProps) {
    const { t } = useTranslation('admin');
    const [status, setStatus] = React.useState(initialStatus);

    React.useEffect(() => {
        setStatus(initialStatus);
    }, [initialStatus]);

    const statusOptions = [
        { label: t('offers.available'), value: 'available' },
        { label: t('offers.reserved'), value: 'reserved' },
        { label: t('offers.sold'), value: 'sold' }
    ];

    const handleStatusChange = (value: string) => {
        setStatus(value); // Update local state
        onChange('status', value); // Update parent state
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Pricing & Status
            </h2>

            <div className="space-y-5">
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
                        key={status} // Force re-render when status changes
                        options={statusOptions}
                        defaultValue={status}
                        onChange={handleStatusChange}
                    />
                </div>
            </div>
        </div>
    );
}
