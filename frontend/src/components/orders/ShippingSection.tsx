'use client';
import React from 'react';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { Wilaya, City } from '@/store/wilayas/wilayaSlice';

interface ShippingSectionProps {
    wilaya: string;
    city: string;
    address?: string;
    deliveryType: 'home' | 'desk';
    shippingPrice: number;
    wilayas: Wilaya[] | null;
    cities: City[];
    onChange: (field: string, value: string) => void;
}

export default function ShippingSection({
    wilaya,
    city,
    address,
    deliveryType,
    shippingPrice,
    wilayas,
    cities,
    onChange
}: ShippingSectionProps) {
    const wilayaOptions = wilayas?.map(w => ({
        value: w.name,
        label: w.name
    })) || [];

    const cityOptions = cities.map(c => ({
        value: c.communeNameAscii || '',
        label: c.communeNameAscii || ''
    }));

    const deliveryOptions = [
        { value: 'home', label: 'Home Delivery' },
        { value: 'desk', label: 'Desk Pickup' }
    ];

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Shipping Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <Label>Wilaya</Label>
                    <Select
                        options={wilayaOptions}
                        defaultValue={wilaya}
                        onChange={(val) => onChange('wilaya', val)}
                        placeholder="Select wilaya"
                    />
                </div>
                <div>
                    <Label>City</Label>
                    <Select
                        options={cityOptions}
                        defaultValue={city}
                        onChange={(val) => onChange('city', val)}
                        placeholder="Select city"
                        disabled={cities.length === 0}
                    />
                </div>
                {address && (
                    <div className="md:col-span-2">
                        <Label>Address</Label>
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                            {address}
                        </div>
                    </div>
                )}
                <div>
                    <Label>Delivery Type</Label>
                    <Select
                        options={deliveryOptions}
                        defaultValue={deliveryType}
                        onChange={(val) => onChange('deliveryType', val)}
                    />
                </div>
                <div>
                    <Label>Shipping Price</Label>
                    <div className="h-11 flex items-center px-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium">
                        DA {shippingPrice.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
}
