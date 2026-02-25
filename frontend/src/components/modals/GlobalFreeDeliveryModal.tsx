'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import Button from '../ui/button/Button';
import Label from '../form/Label';
import Switch from '../form/switch/Switch';
import Input from '../form/input/InputField';
import { updateDeliverySettings } from '@/store/delivery/deliveryHandler';
import { DeliverySettings } from '@/store/delivery/deliverySlice';
import { useTranslation } from "react-i18next";

interface GlobalFreeDeliveryModalProps {
    closeModal: () => void;
    settings: DeliverySettings;
}

export default function GlobalFreeDeliveryModal({ closeModal, settings }: GlobalFreeDeliveryModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation('admin');
    const [formData, setFormData] = useState({
        globalFreeDelivery: settings.globalFreeDelivery,
        isThresholdActive: settings.isThresholdActive,
        freeDeliveryThreshold: settings.freeDeliveryThreshold,
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const success = await dispatch(updateDeliverySettings(formData));
        setSaving(false);
        if (success) {
            closeModal();
        }
    };

    return (
        <form onSubmit={handleSave}>
            <h4 className="font-semibold text-gray-800 mb-2 text-xl dark:text-white/90">
                {t('delivery.freeDelivery.globalModal.title')}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t('delivery.freeDelivery.globalModal.description')}
            </p>

            <div className='max-h-[60vh] overflow-y-auto space-y-5'>
                {/* Global Free Delivery Toggle */}
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800 dark:text-white">{t('delivery.freeDelivery.globalModal.globalToggle.title')}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('delivery.freeDelivery.globalModal.globalToggle.description')}
                                </div>
                            </div>
                        </div>
                        <Switch
                            defaultChecked={formData.globalFreeDelivery}
                            onChange={() => setFormData(prev => ({ ...prev, globalFreeDelivery: !prev.globalFreeDelivery }))}
                        />
                    </div>
                    {formData.globalFreeDelivery && (
                        <div className="mt-4 p-3 bg-blue-100/50 dark:bg-blue-800/20 rounded-lg">
                            <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                {t('delivery.freeDelivery.globalModal.globalToggle.warning')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Threshold Settings */}
                <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800 dark:text-white">{t('delivery.freeDelivery.globalModal.thresholdToggle.title')}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('delivery.freeDelivery.globalModal.thresholdToggle.description')}
                                </div>
                            </div>
                        </div>
                        <Switch
                            defaultChecked={formData.isThresholdActive}
                            onChange={() => setFormData(prev => ({ ...prev, isThresholdActive: !prev.isThresholdActive }))}
                        />
                    </div>

                    {formData.isThresholdActive && (
                        <div className="mt-4">
                            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {t('delivery.freeDelivery.globalModal.thresholdInput.label')}
                            </Label>
                            <div className="relative mt-2">
                                <Input
                                    type="number"
                                    value={formData.freeDeliveryThreshold}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        freeDeliveryThreshold: Number(e.target.value)
                                    }))}
                                    className="w-full pl-12"
                                    placeholder="e.g., 5000"
                                    min="0"
                                    required
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                    M
                                </span>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                {t('delivery.freeDelivery.globalModal.thresholdInput.hint', { amount: formData.freeDeliveryThreshold })}
                            </p>
                        </div>
                    )}
                </div>

                {/* Priority Info */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2 text-sm">{t('delivery.freeDelivery.globalModal.priority.title')}</h5>
                    <ol className="text-xs text-gray-500 dark:text-gray-400 space-y-1 list-decimal list-inside">
                        <li><span className="font-medium">{t('delivery.freeDelivery.globalModal.priority.product')}</span> – {t('delivery.freeDelivery.globalModal.priority.productDesc')}</li>
                        <li><span className="font-medium">{t('delivery.freeDelivery.globalModal.priority.wilaya')}</span> – {t('delivery.freeDelivery.globalModal.priority.wilayaDesc')}</li>
                        <li><span className="font-medium">{t('delivery.freeDelivery.globalModal.priority.threshold')}</span> – {t('delivery.freeDelivery.globalModal.priority.thresholdDesc')}</li>
                        <li><span className="font-medium">{t('delivery.freeDelivery.globalModal.priority.global')}</span> – {t('delivery.freeDelivery.globalModal.priority.globalDesc')}</li>
                    </ol>
                </div>
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button size="sm" variant="outline" onClick={closeModal} disabled={saving}>
                    {t('common.cancel')}
                </Button>
                <Button size="sm" disabled={saving}>
                    {saving ? t('common.saving') : t('pixels.saveChanges')}
                </Button>
            </div>
        </form>
    );
}
