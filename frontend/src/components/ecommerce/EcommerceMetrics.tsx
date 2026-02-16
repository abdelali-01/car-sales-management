"use client";
import React from "react";
import { BoxIconLine } from "@/icons";
import { BanknotesIcon, CubeIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MetricCardSkeleton } from "../ui/skeleton/DashboardSkeleton";
import { useTranslation } from "react-i18next";

export const EcommerceMetrics = () => {
  const {
    monthly_income,
    monthly_profit,
    monthly_orders,
    total_products,
    pending_orders,
    total_orders,
    loadingOverview,
    loadingMonthlySales
  } = useSelector((state: RootState) => state.statistics);

  // Show skeleton for cards that need overview data
  const isOverviewLoading = loadingOverview;
  // Show skeleton for cards that need income data
  const isIncomeLoading = loadingMonthlySales;
  const { t } = useTranslation('admin');

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* Monthly Income */}
      {isIncomeLoading ? (
        <MetricCardSkeleton />
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BanknotesIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('dashboard.metrics.monthlyProfit', 'Monthly Profit')}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {monthly_profit.toLocaleString()} DA
              </h4>
            </div>
          </div>
        </div>
      )}

      {/* This Month's Orders */}
      {isOverviewLoading ? (
        <MetricCardSkeleton />
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('dashboard.metrics.monthlyOrders')}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {total_orders} {t('sidebar.orders')}
              </h4>
            </div>
          </div>
        </div>
      )}

      {/* Total Products */}
      {isOverviewLoading ? (
        <MetricCardSkeleton />
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <CubeIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('dashboard.metrics.availableCars', 'Available Cars')}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {total_products} {t('sidebar.offers')}
              </h4>
            </div>
          </div>
        </div>
      )}

      {/* Pending Orders */}
      {isOverviewLoading ? (
        <MetricCardSkeleton />
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <ClockIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('dashboard.metrics.pendingOrders')}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {pending_orders} {t('sidebar.orders')}
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
