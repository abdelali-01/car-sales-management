'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Switch from '../form/switch/Switch';

interface AddWilayaModalProps {
    closeModal: () => void;
    onSuccess: () => void;
}

import { useTranslation } from 'react-i18next';

export default function AddWilayaModal({ closeModal, onSuccess }: AddWilayaModalProps) {
    const { t } = useTranslation('admin');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        nameAscii: '',
        nameArabic: '',
        shippingPrices: {
            home: 0,
            desk: 0,
        },
        isActive: true,
        freeDelivery: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER}/api/wilayas`,
                formData,
                { withCredentials: true }
            );
            onSuccess();
            closeModal();
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to create wilaya');
            } else {
                setError('Failed to create wilaya');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
                {t('wilayas.addTitle')}
            </h4>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className='max-h-[60vh] overflow-y-auto'>
                <div className='border border-gray-200 dark:border-white/[0.05] rounded-lg p-5 mb-5'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Wilaya Code */}
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('wilayas.codeLabel')}</Label>
                            <Input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                className="w-full"
                                placeholder="e.g., 16"
                                maxLength={2}
                                required
                            />
                            <span className="text-xs text-gray-400">{t('wilayas.codeHint')}</span>
                        </div>

                        {/* Empty cell for alignment */}
                        <div></div>

                        {/* Name ASCII */}
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('wilayas.nameAsciiLabel')}</Label>
                            <Input
                                type="text"
                                value={formData.nameAscii}
                                onChange={(e) => setFormData(prev => ({ ...prev, nameAscii: e.target.value }))}
                                className="w-full"
                                placeholder="e.g., Alger"
                                required
                            />
                        </div>

                        {/* Name Arabic */}
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('wilayas.nameArabicLabel')}</Label>
                            <Input
                                type="text"
                                value={formData.nameArabic}
                                onChange={(e) => setFormData(prev => ({ ...prev, nameArabic: e.target.value }))}
                                className="w-full"
                                placeholder="e.g., الجزائر"
                                dir="rtl"
                                required
                            />
                        </div>

                        {/* Home Delivery Price */}
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('wilayas.homePrice')}</Label>
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
                                placeholder="e.g., 1200"
                            />
                        </div>

                        {/* Desk Delivery Price */}
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('wilayas.deskPrice')}</Label>
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
                                placeholder="e.g., 800"
                            />
                        </div>

                        {/* Status Toggle */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-lg">
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('common.status')}</div>
                                    <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                        {formData.isActive ? t('common.active') : t('common.inactive')}
                                    </div>
                                </div>
                                <Switch
                                    defaultChecked={formData.isActive}
                                    onChange={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                />
                            </div>
                        </div>

                        {/* Free Delivery Toggle */}
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
                                    defaultChecked={formData.freeDelivery}
                                    onChange={() => setFormData(prev => ({ ...prev, freeDelivery: !prev.freeDelivery }))}
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
                    {loading ? t('common.creating') : t('common.create') + ' ' + t('sidebar.wilayas', { count: 1 }).slice(0, -1)}
                </Button>
            </div>
        </form>
    );
}
