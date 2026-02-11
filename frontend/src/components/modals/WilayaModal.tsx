'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Switch from '../form/switch/Switch';
import { updateWilaya } from '@/store/wilayas/wilayaHandler';
import { Wilaya } from '@/store/wilayas/wilayaSlice';
import { useTranslation } from 'react-i18next';

interface WilayaModalProps {
    closeModal: () => void;
    selectedItem: Wilaya;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface WilayaWithLegacy extends Wilaya {
    shipping_prices?: string | { home: number; desk: number };
    is_active?: boolean;
    free_delivery?: boolean;
}

export default function WilayaModal({ closeModal, selectedItem }: WilayaModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation('admin');

    // Helper to get initial prices from either format
    const getInitialPrices = () => {
        const item = selectedItem as WilayaWithLegacy;
        // New format
        if (item.shippingPrices !== undefined) {
            return { home: item.shippingPrices.home, desk: item.shippingPrices.desk };
        }
        // Old format
        if (item.shipping_prices) {
            if (typeof item.shipping_prices === 'string') {
                try {
                    return JSON.parse(item.shipping_prices);
                } catch {
                    return { home: 0, desk: 0 };
                }
            }
            return item.shipping_prices;
        }
        return { home: 0, desk: 0 };
    };

    // Helper to get initial active status
    const getInitialActive = () => {
        const item = selectedItem as WilayaWithLegacy;
        if (item.isActive !== undefined) return item.isActive;
        if (item.is_active !== undefined) return item.is_active;
        return true;
    };

    const [wilaya, setWilaya] = useState({
        shippingPrices: {
            home: getInitialPrices().home,
            desk: getInitialPrices().desk,
        },
        isActive: getInitialActive(),
        freeDelivery: (selectedItem as WilayaWithLegacy).freeDelivery ?? (selectedItem as WilayaWithLegacy).free_delivery ?? false
    });



    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateWilaya(selectedItem.id, wilaya));
        closeModal();
    };

    return (
        <form onSubmit={handleSave}>
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
                {t('wilayas.updatePrices', { name: selectedItem.name })}
            </h4>

            <div className='max-h-[60vh] overflow-y-auto'>
                <div className='border border-gray-200 dark:border-white/[0.05] rounded-lg p-5 mb-5'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('wilayas.homePrice')}</Label>
                            <Input
                                type="number"
                                value={wilaya.shippingPrices.home}
                                onChange={(e) => setWilaya(prev => ({
                                    ...prev,
                                    shippingPrices: {
                                        ...prev.shippingPrices,
                                        home: Number(e.target.value)
                                    }
                                }))}
                                className="w-full"
                                placeholder="e.g., 1200"
                                required
                            />
                        </div>
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('wilayas.deskPrice')}</Label>
                            <Input
                                type="number"
                                value={wilaya.shippingPrices.desk}
                                onChange={(e) => setWilaya(prev => ({
                                    ...prev,
                                    shippingPrices: {
                                        ...prev.shippingPrices,
                                        desk: Number(e.target.value)
                                    }
                                }))}
                                className="w-full"
                                placeholder="e.g., 800"
                                required
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-lg">
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('common.status')}</div>
                                    <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                        {wilaya.isActive ? t('common.active') : t('common.inactive')}
                                    </div>
                                </div>
                                <Switch
                                    defaultChecked={wilaya.isActive}
                                    onChange={() => setWilaya(prev => ({ ...prev, isActive: !prev.isActive }))}
                                />
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg border border-green-100 dark:border-green-800/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800 dark:text-white">{t('wilayas.freeDelivery')}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('wilayas.freeDeliveryDescription')}
                                        </div>
                                    </div>
                                </div>
                                <Switch
                                    defaultChecked={wilaya.freeDelivery}
                                    onChange={() => setWilaya(prev => ({ ...prev, freeDelivery: !prev.freeDelivery }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-8">
                <Button size="sm" variant="outline" onClick={closeModal}>
                    {t('common.cancel')}
                </Button>
                <Button size="sm">
                    {t('common.saveChanges')}
                </Button>
            </div>
        </form>
    );
}