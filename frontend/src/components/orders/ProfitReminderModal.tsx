'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchOrders, updateOrder } from '@/store/orders/orderHandler';
import { XMarkIcon, CheckCircleIcon, CurrencyDollarIcon, UserIcon, TruckIcon } from '@heroicons/react/24/outline';
import { Order } from '@/types/auto-sales';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Input from '../ui/input/Input';

export default function ProfitReminderModal() {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation('admin');
    const { orders } = useSelector((state: RootState) => state.orders);
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [profit, setProfit] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Fetch orders on mount if not already fetched
    useEffect(() => {
        if (!orders) {
            dispatch(fetchOrders());
        }
    }, [dispatch, orders]);

    // Filter relevant orders: Completed AND Profit is null
    const pendingProfitOrders = useMemo(() => {
        if (!orders) return [];
        return orders.filter(
            (o) => o.status === 'completed' && (o.profit === null || o.profit === undefined)
        );
    }, [orders]);

    // Control modal visibility
    useEffect(() => {
        if (pendingProfitOrders.length > 0) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [pendingProfitOrders.length]);

    const currentOrder = pendingProfitOrders[currentStep];

    const handleSave = async () => {
        if (!currentOrder || !profit) return;

        setLoading(true);
        try {
            const profitValue = parseFloat(profit);
            await dispatch(updateOrder(currentOrder.id, { profit: profitValue }));
            // Move to next step or close if done
            // Note: The order will be removed from pendingProfitOrders automatically once updated in store
            setProfit('');
            // If it's the last one, modal will close via useEffect
            if (currentStep >= pendingProfitOrders.length - 1) {
                setCurrentStep(0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        setProfit('');
        if (currentStep < pendingProfitOrders.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Cycle back to start or just close temporarily? 
            // Let's cycle for now or just close if user wants to ignore
            setIsOpen(false);
        }
    };

    if (!isOpen || !currentOrder) return null;

    return (
        <div className="fixed inset-0 z-9999999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <CurrencyDollarIcon className="w-5 h-5 text-brand-500" />
                            {t('orders.profitReminder.title', 'Missing Profit Information')}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {t('orders.profitReminder.subtitle', 'Please enter the profit for completed orders.')}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                            {currentStep + 1} / {pendingProfitOrders.length}
                        </span>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">

                    {/* Order Summary Card */}
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 mb-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* Car Image/Icon */}
                            <div className="w-full sm:w-32 h-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm relative overflow-hidden border border-gray-200 dark:border-gray-700">
                                {currentOrder.offer?.images && currentOrder.offer.images.length > 0 ? (
                                    <Image
                                        src={currentOrder.offer.images[0].imageUrl}
                                        alt="Car"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl font-bold text-gray-300 dark:text-gray-600">W</span>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 space-y-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                        {currentOrder.offer
                                            ? `${currentOrder.offer.brand} ${currentOrder.offer.model}`
                                            : currentOrder.orderedCar
                                                ? `${currentOrder.orderedCar.brand} ${currentOrder.orderedCar.model}`
                                                : t('common.unknownCar')}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium uppercase tracking-wide">
                                            {currentOrder.status}
                                        </span>
                                        <span>•</span>
                                        <span className="font-medium">
                                            {new Date(currentOrder.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">{t('orders.client', 'Client')}</span>
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <UserIcon className="w-4 h-4 text-gray-400" />
                                            {currentOrder.clientName}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">{t('orders.amount', 'Amount')}</span>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'DZD' }).format(currentOrder.agreedPrice).replace('DZD', 'DA')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profit Input */}
                    <div className="space-y-4">
                        <Input
                            label={t('orders.enterProfit', 'Net Profit Amount (DA)')}
                            type="number"
                            name="profit"
                            placeholder="0.00"
                            value={profit}
                            onChange={(e) => setProfit(e.target.value)}
                            min={0}
                            autoFocus
                            icon={<span className="text-gray-500 text-sm font-semibold">DA</span>}
                            className="py-3 text-lg"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('orders.profitHelp', 'Enter the final profit made from this completed order.')}
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                    <button
                        onClick={handleSkip}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        {t('common.skip', 'Skip for now')}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!profit || loading}
                        className="flex items-center gap-2 px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <CheckCircleIcon className="w-4 h-4" />
                        )}
                        {t('common.saveNext', 'Save & Next')}
                    </button>
                </div>
            </div>
        </div>
    );
}
