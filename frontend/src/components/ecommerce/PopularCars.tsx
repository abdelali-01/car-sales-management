"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { PopularProductsSkeleton } from "@/components/ui/skeleton/DashboardSkeleton";
import { useTranslation } from "react-i18next";

export default function PopularCars() {
    const { popular_cars, loadingProducts } = useSelector((state: RootState) => state.statistics);
    const { t } = useTranslation('admin');

    // Show skeleton while loading
    // We reused 'loadingProducts' for popular cars in the slice
    if (loadingProducts) {
        return <PopularProductsSkeleton />;
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        {t('dashboard.popularCars.title', 'Popular Cars')}
                    </h3>
                    <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                        {t('dashboard.popularCars.subtitle', 'Top selling models')}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {popular_cars && popular_cars.length > 0 ? (
                    popular_cars.map((car, index) => (
                        <div key={`${car.brand}-${car.model}`} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        #{index + 1}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                                            {car.name}
                                        </p>
                                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                            {car.brand} {car.model}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                                    {car.count}
                                </p>
                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                    {t('dashboard.sold')}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {t('dashboard.popularCars.noData', 'No popular cars data available')}
                    </div>
                )}
            </div>
        </div>
    );
}
