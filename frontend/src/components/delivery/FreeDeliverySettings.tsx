'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useModal } from '@/hooks/useModal';
import { Modal } from '../ui/modal';
import GlobalFreeDeliveryModal from '../modals/GlobalFreeDeliveryModal';
import FreeDeliveryProductsModal from '../modals/FreeDeliveryProductsModal';
import FreeDeliveryWilayasModal from '../modals/FreeDeliveryWilayasModal';
import {
    fetchDeliverySettings,
    fetchFreeDeliveryProducts,
    fetchFreeDeliveryWilayas
} from '@/store/delivery/deliveryHandler';
import { useTranslation } from 'react-i18next';

export default function FreeDeliverySettings() {
    const dispatch = useDispatch<AppDispatch>();
    const { settings, freeProducts, freeWilayas, loadingSettings, loadingProducts, loadingWilayas } = useSelector(
        (state: RootState) => state.delivery
    );
    const { t } = useTranslation('admin');

    // Modal hooks for each card
    const globalModal = useModal();
    const productsModal = useModal();
    const wilayasModal = useModal();

    useEffect(() => {
        dispatch(fetchDeliverySettings());
        dispatch(fetchFreeDeliveryProducts());
        dispatch(fetchFreeDeliveryWilayas());
    }, [dispatch]);

    // Card skeleton for loading state
    const CardSkeleton = () => (
        <div className="animate-pulse">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
    );

    return (
        <div className="mb-6">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t('delivery.freeDelivery.title')}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('delivery.freeDelivery.description')}</p>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Global Free Delivery Card */}
                <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                    {/* Gradient accent */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                    {loadingSettings ? (
                        <CardSkeleton />
                    ) : (
                        <>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex items-center gap-2">
                                    {settings?.globalFreeDelivery && (
                                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 rounded-full">
                                            {t('delivery.freeDelivery.active')}
                                        </span>
                                    )}
                                    {settings?.isThresholdActive && (
                                        <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full">
                                            {t('delivery.freeDelivery.threshold')}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{t('delivery.freeDelivery.globalSettings')}</h3>

                            {settings?.isThresholdActive ? (
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    {settings.freeDeliveryThreshold.toLocaleString()} DA
                                </p>
                            ) : (
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    {t('delivery.freeDelivery.off')}
                                </p>
                            )}

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                {settings?.globalFreeDelivery
                                    ? t('delivery.freeDelivery.allOrdersFree')
                                    : settings?.isThresholdActive
                                        ? t('delivery.freeDelivery.freeOverAmount', { amount: settings.freeDeliveryThreshold.toLocaleString() })
                                        : t('delivery.freeDelivery.noGlobalActive')}
                            </p>

                            <button
                                onClick={() => globalModal.openModal(settings)}
                                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                            >
                                {t('delivery.freeDelivery.manageSettings')}
                            </button>
                        </>
                    )}
                </div>

                {/* Free Delivery Products Card */}
                <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300">
                    {/* Gradient accent */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>

                    {loadingProducts ? (
                        <CardSkeleton />
                    ) : (
                        <>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2.5 bg-green-50 dark:bg-green-500/10 rounded-xl">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                {freeProducts.length > 0 && (
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 rounded-full">
                                        {t('delivery.freeDelivery.productsCount', { count: freeProducts.length })}
                                    </span>
                                )}
                            </div>

                            <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{t('delivery.freeDelivery.freeDeliveryProducts')}</h3>

                            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                                {freeProducts.length}
                            </p>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                {freeProducts.length > 0
                                    ? t('delivery.freeDelivery.productsEnabledDescription')
                                    : t('delivery.freeDelivery.noProductsEnabled')}
                            </p>

                            <button
                                onClick={() => productsModal.openModal(null)}
                                className="w-full py-2.5 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                            >
                                {t('delivery.freeDelivery.viewProducts')}
                            </button>
                        </>
                    )}
                </div>

                {/* Free Delivery Wilayas Card */}
                <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-5 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
                    {/* Gradient accent */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>

                    {loadingWilayas ? (
                        <CardSkeleton />
                    ) : (
                        <>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2.5 bg-purple-50 dark:bg-purple-500/10 rounded-xl">
                                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                {freeWilayas.length > 0 && (
                                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 rounded-full">
                                        {t('delivery.freeDelivery.wilayasCount', { count: freeWilayas.length })}
                                    </span>
                                )}
                            </div>

                            <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{t('delivery.freeDelivery.freeDeliveryWilayas')}</h3>

                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                {freeWilayas.length}
                            </p>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                {freeWilayas.length > 0
                                    ? t('delivery.freeDelivery.wilayasEnabledDescription')
                                    : t('delivery.freeDelivery.noWilayasEnabled')}
                            </p>

                            <button
                                onClick={() => wilayasModal.openModal(null)}
                                className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                            >
                                {t('delivery.freeDelivery.viewWilayas')}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            {globalModal.isOpen && settings && (
                <Modal isOpen={globalModal.isOpen} onClose={globalModal.closeModal} className="max-w-[600px] p-6 lg:p-8">
                    <GlobalFreeDeliveryModal closeModal={globalModal.closeModal} settings={settings} />
                </Modal>
            )}

            {productsModal.isOpen && (
                <Modal isOpen={productsModal.isOpen} onClose={productsModal.closeModal} className="max-w-[800px] p-6 lg:p-8">
                    <FreeDeliveryProductsModal closeModal={productsModal.closeModal} />
                </Modal>
            )}

            {wilayasModal.isOpen && (
                <Modal isOpen={wilayasModal.isOpen} onClose={wilayasModal.closeModal} className="max-w-[800px] p-6 lg:p-8">
                    <FreeDeliveryWilayasModal closeModal={wilayasModal.closeModal} />
                </Modal>
            )}
        </div>
    );
}
