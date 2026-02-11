'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Switch from '../form/switch/Switch';
import { updateCity } from '@/store/wilayas/wilayaHandler';
import { City } from '@/store/wilayas/wilayaSlice';
import { useTranslation } from 'react-i18next';

interface CityModalProps {
    closeModal: () => void;
    selectedCity: City;
    onSuccess?: () => void;
}

export default function CityModal({ closeModal, selectedCity, onSuccess }: CityModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation('admin');

    const [city, setCity] = useState({
        homePrice: selectedCity.shippingPrices?.home || 0,
        deskPrice: selectedCity.shippingPrices?.desk || 0,
        hasDesk: selectedCity.hasDesk || false
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const success = await dispatch(updateCity(selectedCity.id, {
            shippingPrices: {
                home: city.homePrice,
                desk: city.deskPrice
            },
            hasDesk: city.hasDesk
        }));

        if (success) {
            onSuccess?.();
            closeModal();
        }
    };

    return (
        <form onSubmit={handleSave}>
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
                {t('cities.updatePrices', { name: selectedCity.communeNameAscii })}
            </h4>

            <div className='max-h-[60vh] overflow-y-auto'>
                <div className='border border-gray-200 dark:border-white/[0.05] rounded-lg p-5 mb-5'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('cities.homePrice')}</Label>
                            <Input
                                type="number"
                                value={city.homePrice}
                                onChange={(e) => setCity(prev => ({
                                    ...prev,
                                    homePrice: Number(e.target.value)
                                }))}
                                className="w-full"
                                placeholder="e.g., 500"
                                required
                            />
                        </div>
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('cities.deskPrice')}</Label>
                            <Input
                                type="number"
                                value={city.deskPrice}
                                onChange={(e) => setCity(prev => ({
                                    ...prev,
                                    deskPrice: Number(e.target.value)
                                }))}
                                className="w-full"
                                placeholder="e.g., 300"
                                required
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-lg">
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('cities.hasDeskLabel')}</div>
                                    <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                        {city.hasDesk ? t('common.available') : t('common.unavailable')}
                                    </div>
                                </div>
                                <Switch
                                    defaultChecked={city.hasDesk}
                                    onChange={() => setCity(prev => ({ ...prev, hasDesk: !prev.hasDesk }))}
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
