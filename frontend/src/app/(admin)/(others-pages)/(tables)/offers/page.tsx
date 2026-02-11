'use client';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import OffersTable from '@/components/tables/OffersTable';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function OffersPage() {
    const router = useRouter();
    const { t } = useTranslation('admin');

    return (
        <div className='space-y-5'>
            <PageBreadcrumb paths={['offers']} pageTitle={t('offers.title')} />

            {/* Main Card */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t('offers.list')}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {t('offers.description')}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/offers/add')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors text-sm font-medium"
                        >
                            <PlusIcon className="w-4 h-4" />
                            {t('offers.addOffer')}
                        </button>
                    </div>
                </div>

                {/* Offers Table */}
                <OffersTable />
            </div>
        </div>
    )
}