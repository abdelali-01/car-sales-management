'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import Button from '../ui/button/Button';
import Loader from '../ui/load/Loader';
import { fetchFreeDeliveryWilayas } from '@/store/delivery/deliveryHandler';
import { useTranslation } from 'react-i18next';

interface FreeDeliveryWilayasModalProps {
    closeModal: () => void;
}

export default function FreeDeliveryWilayasModal({ closeModal }: FreeDeliveryWilayasModalProps) {
    const { t } = useTranslation('admin');
    const dispatch = useDispatch<AppDispatch>();
    const { freeWilayas, loadingWilayas } = useSelector((state: RootState) => state.delivery);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchFreeDeliveryWilayas());
    }, [dispatch]);

    const filteredWilayas = freeWilayas.filter(wilaya =>
        wilaya.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wilaya.nameArabic.includes(searchTerm) ||
        wilaya.code.includes(searchTerm)
    );

    return (
        <div>
            <h4 className="font-semibold text-gray-800 mb-2 text-xl dark:text-white/90">
                {t('delivery.freeDelivery.wilayasModal.title')}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t('delivery.freeDelivery.wilayasModal.description')}
            </p>

            {/* Search Bar */}
            <div className="relative mb-5">
                <input
                    type="text"
                    placeholder={t('delivery.freeDelivery.wilayasModal.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:text-white/90"
                />
                <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* Wilayas List */}
            <div className="max-h-[50vh] overflow-y-auto">
                {loadingWilayas ? (
                    <div className="flex justify-center py-8">
                        <Loader />
                    </div>
                ) : filteredWilayas.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredWilayas.map((wilaya) => (
                            <div
                                key={wilaya.id}
                                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-xl border border-purple-100 dark:border-purple-800/30 hover:shadow-md transition-all"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/20">
                                    {wilaya.code}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-gray-800 dark:text-white text-sm">
                                        {wilaya.name}
                                    </h5>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic">
                                        {wilaya.nameArabic}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {t('delivery.freeDelivery.wilayasModal.badge')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchTerm ? t('delivery.freeDelivery.wilayasModal.noResults') : t('delivery.freeDelivery.wilayasModal.emptyState')}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {t('delivery.freeDelivery.wilayasModal.emptyHint')}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('delivery.freeDelivery.wilayasModal.count_plural', { count: filteredWilayas.length })}
                </p>
                <Button size="sm" variant="outline" onClick={closeModal}>
                    {t('common.close')}
                </Button>
            </div>
        </div>
    );
}
