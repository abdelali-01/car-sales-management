"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { DemographicSkeleton } from "../ui/skeleton/DashboardSkeleton";
import { useTranslation } from "react-i18next";

export default function DemographicCard() {
  const { order_status_distribution, total_orders, loadingOrdersByStatus } = useSelector((state: RootState) => state.statistics);
  const { t } = useTranslation('admin');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'canceled':
        return 'bg-red-500';
      case 'confirmed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`orders.status.${status}`, status);
  };

  const calculatePercentage = (count: number) => {
    if (total_orders === 0) return 0;
    return Math.round((count / total_orders) * 100);
  };

  // Show skeleton while loading
  if (loadingOrdersByStatus) {
    return <DemographicSkeleton />;
  }

  const statusEntries = Object.entries(order_status_distribution || {});

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 h-full">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t('dashboard.orderStatus.title')}
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {t('dashboard.orderStatus.description')}
          </p>
        </div>
      </div>

      <div className="space-y-5 mt-6">
        {statusEntries.length > 0 ? (
          statusEntries.map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                <div>
                  <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                    {getStatusLabel(status)}
                  </p>
                  <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                    {count} {t('sidebar.orders')}
                  </span>
                </div>
              </div>

              <div className="flex w-full max-w-[140px] items-center gap-3">
                <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                  <div
                    className={`absolute left-0 top-0 flex h-full items-center justify-center rounded-sm ${getStatusColor(status)} text-xs font-medium text-white`}
                    style={{ width: `${calculatePercentage(count)}%` }}
                  ></div>
                </div>
                <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {calculatePercentage(count)}%
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t('dashboard.orderStatus.noData')}
          </div>
        )}
      </div>

      {total_orders > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.metrics.totalOrders')}</span>
            <span className="font-semibold text-gray-800 dark:text-white/90">{total_orders}</span>
          </div>
        </div>
      )}
    </div>
  );
}
