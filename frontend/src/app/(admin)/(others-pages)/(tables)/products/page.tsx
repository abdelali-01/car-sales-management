'use client';
import { useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import ProductsTable from '@/components/tables/ProductsTable';
import { ArrowDownTrayIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { useTranslation } from 'react-i18next';

export default function ProductsPage() {
    const router = useRouter();
    const [isExporting, setIsExporting] = useState(false);
    const { t } = useTranslation('admin');

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await api.get(ENDPOINTS.PRODUCTS.EXPORT, {
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to export products:', error);
            alert('Failed to export products. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleAddProduct = () => {
        router.push('/products/add');
    };

    return (
        <div className='space-y-5'>
            <PageBreadcrumb pageTitle={t('products.title')} />

            {/* Main Card */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t('products.list')}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {t('products.description')}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isExporting ? t('products.exporting') : t('products.export')}
                            <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleAddProduct}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors text-sm font-medium"
                        >
                            <PlusIcon className="w-4 h-4" />
                            {t('products.addProduct')}
                        </button>
                    </div>
                </div>

                {/* Products Table */}
                <ProductsTable />
            </div>
        </div>
    )
}
