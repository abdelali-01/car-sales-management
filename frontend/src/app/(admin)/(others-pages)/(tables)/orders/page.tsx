'use client';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import OrdersTable from '@/components/tables/OrdersTable';
import { useTranslation } from 'react-i18next';

export default function OrdersPage() {
  const { t } = useTranslation('admin');
  return (
    <div className='space-y-5'>
      <PageBreadcrumb pageTitle={t('orders.page.title')} />

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('orders.title')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('orders.page.manageText')}</p>
          </div>
          <button
            onClick={() => window.location.href = '/orders/add'} // utilizing native navigation for simplicity or useRouter if available
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium"
          >
            {t('orders.page.addOrder')}
          </button>
        </div>

        <OrdersTable />
      </div>
    </div>
  );
}
