'use client';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import OrdersTable from '@/components/tables/OrdersTable';

export default function OrdersPage() {
  return (
    <div className='space-y-5'>
      <PageBreadcrumb pageTitle='Orders Management' />

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Orders</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">View and manage car sale orders</p>
          </div>
        </div>
        <OrdersTable />
      </div>
    </div>
  );
}
