'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Switch from '../form/switch/Switch';

interface AddCityModalProps {
    closeModal: () => void;
    onSuccess: () => void;
    wilayaId: number;
    wilayaName: string;
}

import { useTranslation } from 'react-i18next';

export default function AddCityModal({ closeModal, onSuccess, wilayaId, wilayaName }: AddCityModalProps) {
    const { t } = useTranslation('admin');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        communeNameAscii: '',
        communeNameArabic: '',
        dairaNameAscii: '',
        dairaNameArabic: '',
        hasDesk: false,
        shippingPrices: {
            home: 0,
            desk: 0,
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER}/api/wilayas/${wilayaId}/cities`,
                formData,
                { withCredentials: true }
            );
            onSuccess();
            closeModal();
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to create city');
            } else {
                setError('Failed to create city');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h4 className="font-semibold text-gray-800 mb-2 text-title-sm dark:text-white/90">
                {t('cities.addTitle')}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t('cities.addingTo', { name: wilayaName })}
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className='max-h-[60vh] overflow-y-auto'>
                <div className='border border-gray-200 dark:border-white/[0.05] rounded-lg p-5 mb-5'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Commune Name ASCII */}
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('cities.nameAsciiLabel')}</Label>
                            <Input
                                type="text"
                                value={formData.communeNameAscii}
                                onChange={(e) => setFormData(prev => ({ ...prev, communeNameAscii: e.target.value }))}
                                className="w-full"
                                placeholder="e.g., Bab El Oued"
                                required
                            />
                        </div>

                        {/* Commune Name Arabic */}
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('cities.nameArabicLabel')}</Label>
                            <Input
                                type="text"
                                value={formData.communeNameArabic}
                                onChange={(e) => setFormData(prev => ({ ...prev, communeNameArabic: e.target.value }))}
                                className="w-full"
                                placeholder="e.g., باب الوادي"
                                dir="rtl"
                                required
                            />
                        </div>

                        {/* Daira Name ASCII */}
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('cities.dairaAsciiLabel')}</Label>
                            <Input
                                type="text"
                                value={formData.dairaNameAscii}
                                onChange={(e) => setFormData(prev => ({ ...prev, dairaNameAscii: e.target.value }))}
                                className="w-full"
                                placeholder="e.g., Bab El Oued"
                            />
                            <span className="text-xs text-gray-400">{t('cities.dairaHint')}</span>
                        </div>

                        {/* Daira Name Arabic */}
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('cities.dairaArabicLabel')}</Label>
                            <Input
                                type="text"
                                value={formData.dairaNameArabic}
                                onChange={(e) => setFormData(prev => ({ ...prev, dairaNameArabic: e.target.value }))}
                                className="w-full"
                                placeholder="e.g., باب الوادي"
                                dir="rtl"
                            />
                            <span className="text-xs text-gray-400">{t('cities.dairaHint')}</span>
                        </div>

                        {/* Custom Home Delivery Price */}
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('cities.customHomePrice')}</Label>
                            <Input
                                type="number"
                                value={formData.shippingPrices.home}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    shippingPrices: {
                                        ...prev.shippingPrices,
                                        home: Number(e.target.value)
                                    }
                                }))}
                                className="w-full"
                                placeholder="0 = use wilaya price"
                            />
                            <span className="text-xs text-gray-400">{t('cities.customPriceHint')}</span>
                        </div>

                        {/* Custom Desk Delivery Price */}
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('cities.customDeskPrice')}</Label>
                            <Input
                                type="number"
                                value={formData.shippingPrices.desk}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    shippingPrices: {
                                        ...prev.shippingPrices,
                                        desk: Number(e.target.value)
                                    }
                                }))}
                                className="w-full"
                                placeholder="0 = use wilaya price"
                            />
                            <span className="text-xs text-gray-400">{t('cities.customPriceHint')}</span>
                        </div>

                        {/* Has Desk Toggle */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800 dark:text-white">{t('cities.hasDeskPickup')}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('cities.hasDeskDescription')}
                                        </div>
                                    </div>
                                </div>
                                <Switch
                                    defaultChecked={formData.hasDesk}
                                    onChange={() => setFormData(prev => ({ ...prev, hasDesk: !prev.hasDesk }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-8">
                <Button size="sm" variant="outline" onClick={closeModal} disabled={loading}>
                    {t('common.cancel')}
                </Button>
                <Button size="sm" disabled={loading}>
                    {loading ? t('common.creating') : t('cities.addTitle')}
                </Button>
            </div>
        </form>
    );
}
