'use client';
import React from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Switch from '@/components/form/switch/Switch';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface PricingSectionProps {
    price: number;
    prevPrice: number;
    quantity: number;
    showOnHomepage: boolean;
    freeDelivery: boolean;
    onChange: (field: string, value: number | boolean) => void;
    errors?: Record<string, string>;
}

export default function PricingSection({
    price,
    prevPrice,
    quantity,
    showOnHomepage,
    freeDelivery,
    onChange,
    errors = {}
}: PricingSectionProps) {
    const handleQuantityChange = (delta: number) => {
        const newQuantity = Math.max(0, quantity + delta);
        onChange('quantity', newQuantity);
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Pricing & Availability
            </h2>

            <div className="space-y-5">
                {/* Row 1: Price & Previous Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <Label htmlFor="price">Price (M)</Label>
                        <Input
                            id="price"
                            type="number"
                            placeholder="0"
                            value={price}
                            onChange={(e) => onChange('price', Number(e.target.value))}
                            error={!!errors.price}
                            hint={errors.price}
                        />
                    </div>
                    <div>
                        <Label htmlFor="prevPrice">Previous Price (M)</Label>
                        <Input
                            id="prevPrice"
                            type="number"
                            placeholder="0"
                            value={prevPrice}
                            onChange={(e) => onChange('prevPrice', Number(e.target.value))}
                        />
                        <p className="text-xs text-gray-500 mt-1">For showing discounts</p>
                    </div>
                </div>

                {/* Row 2: Quantity & Show on Homepage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <Label>Stock Quantity</Label>
                        <div className="flex items-center gap-3 mt-1">
                            <button
                                type="button"
                                onClick={() => handleQuantityChange(-1)}
                                className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <MinusIcon className="w-5 h-5" />
                            </button>
                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => onChange('quantity', Math.max(0, Number(e.target.value)))}
                                className="text-center w-24"
                            />
                            <button
                                type="button"
                                onClick={() => handleQuantityChange(1)}
                                className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <PlusIcon className="w-5 h-5" />
                            </button>
                            <span className={`ml-3 text-sm font-medium ${quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {quantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 pt-6">
                        <div className="flex items-center gap-4">
                            <Switch
                                defaultChecked={showOnHomepage}
                                onChange={(checked) => onChange('showOnHomepage', checked)}
                            />
                            <div>
                                <Label className="mb-0">Show on Homepage</Label>
                                <p className="text-xs text-gray-500">Feature this product on the store homepage</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg border border-green-100 dark:border-green-800/30">
                            <Switch
                                defaultChecked={freeDelivery}
                                onChange={(checked) => onChange('freeDelivery', checked)}
                            />
                            <div>
                                <Label className="mb-0 text-green-700 dark:text-green-400">Free Delivery</Label>
                                <p className="text-xs text-gray-500">This product ships free</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
