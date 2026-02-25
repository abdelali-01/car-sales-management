'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import Button from '../ui/button/Button';
import Loader from '../ui/load/Loader';
import { fetchFreeDeliveryProducts } from '@/store/delivery/deliveryHandler';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface FreeDeliveryProductsModalProps {
    closeModal: () => void;
}

export default function FreeDeliveryProductsModal({ closeModal }: FreeDeliveryProductsModalProps) {
    const { t } = useTranslation('admin');
    const dispatch = useDispatch<AppDispatch>();
    const { freeProducts, loadingProducts } = useSelector((state: RootState) => state.delivery);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchFreeDeliveryProducts());
    }, [dispatch]);

    const filteredProducts = freeProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h4 className="font-semibold text-gray-800 mb-2 text-xl dark:text-white/90">
                {t('delivery.freeDelivery.productsModal.title')}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t('delivery.freeDelivery.productsModal.description')}
            </p>

            {/* Search Bar */}
            <div className="relative mb-5">
                <input
                    type="text"
                    placeholder={t('delivery.freeDelivery.productsModal.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all dark:text-white/90"
                />
                <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* Products List */}
            <div className="max-h-[50vh] overflow-y-auto">
                {loadingProducts ? (
                    <div className="flex justify-center py-8">
                        <Loader />
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl border border-green-100 dark:border-green-800/30 hover:shadow-md transition-all"
                            >
                                <div className="w-14 h-14 rounded-lg overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0 border border-gray-100 dark:border-gray-700">
                                    {product.images && product.images[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            width={56}
                                            height={56}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                                        {product.name}
                                    </h5>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                            {Number(product.price).toLocaleString()} M
                                        </span>
                                        {product.category && (
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full">
                                                {product.category.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {t('delivery.freeDelivery.productsModal.badge')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchTerm ? t('delivery.freeDelivery.productsModal.noResults') : t('delivery.freeDelivery.productsModal.emptyState')}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {t('delivery.freeDelivery.productsModal.emptyHint')}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('delivery.freeDelivery.productsModal.count_plural', { count: filteredProducts.length })}
                </p>
                <Button size="sm" variant="outline" onClick={closeModal}>
                    {t('common.close')}
                </Button>
            </div>
        </div>
    );
}
