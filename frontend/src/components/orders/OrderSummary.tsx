'use client';
import React from 'react';

interface OrderSummaryProps {
    subtotal: number;
    shippingPrice: number;
    promoCode?: string;
    discountValue?: number;
}

export default function OrderSummary({
    subtotal,
    shippingPrice,
    promoCode,
    discountValue
}: OrderSummaryProps) {
    const total = subtotal + shippingPrice - (discountValue || 0);
    const formatPrice = (price: number) => `${price.toLocaleString()} M`;

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Order Summary
            </h2>

            <div className="space-y-3">
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>{formatPrice(shippingPrice)}</span>
                </div>
                {promoCode && (
                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                        <span>Promo Code</span>
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-sm">
                            {promoCode}
                        </span>
                    </div>
                )}
                {discountValue && discountValue > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                        <span>Discount</span>
                        <span>-{formatPrice(discountValue)}</span>
                    </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-white text-lg">
                            Total
                        </span>
                        <span className="text-2xl font-bold text-brand-500">
                            {formatPrice(total)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
