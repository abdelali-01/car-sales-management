'use client';
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { useEffect } from "react";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { handleFetchCalendarItems } from "@/store/calendar/calendarHandler";
import { fetchAllDashboardStats } from "@/store/statistics/statisticsHandler";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import PopularCars from "@/components/ecommerce/PopularCars";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  // const { popular_products, loadingProducts } = useSelector((state: RootState) => state.statistics);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('admin');

  useEffect(() => {
    // Fetch all stats in parallel for best performance
    dispatch(fetchAllDashboardStats());
    dispatch(handleFetchCalendarItems());
  }, [dispatch]);

  if (!user) return null;

  return (
    <div className="space-y-7">
      {/* Main Metrics - shows skeleton while loading */}
      <EcommerceMetrics />

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 md:gap-7 xl:grid-cols-12">
        <div className="xl:col-span-7 h-full">
          <StatisticsChart />
        </div>

        <div className="xl:col-span-5 h-full">
          <DemographicCard />
        </div>
      </div>

      {/* Monthly Sales Chart */}
      <div className="grid grid-cols-1 gap-4 md:gap-7">
        <MonthlySalesChart />
      </div>

      {/* Popular Products and Recent Orders */}

      {/* Popular Products (Cars) and Recent Orders */}
      <div className="grid grid-cols-1 gap-4 md:gap-7 xl:grid-cols-12">
        <div className="xl:col-span-4 h-full">
          <PopularCars />
        </div>

        <div className="xl:col-span-8 h-full">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}

