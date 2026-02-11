"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ChartSkeleton } from "../ui/skeleton/DashboardSkeleton";
import { useTranslation } from "react-i18next";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const { monthly_sales_chart, loadingCharts } = useSelector((state: RootState) => state.statistics);
  const { t } = useTranslation('admin');

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: { fontSize: "0px" },
      },
    },
  };

  // Show skeleton while loading
  if (loadingCharts) {
    return <ChartSkeleton height="h-[310px]" />;
  }

  if (!monthly_sales_chart || monthly_sales_chart.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 h-full flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">{t('dashboard.charts.noData')}</p>
      </div>
    );
  }

  // Create mock order count data for demonstration
  const mockOrderCounts = monthly_sales_chart.map(income =>
    income > 0 ? Math.floor(income / 100) + Math.floor(Math.random() * 10) : 0
  );

  const series = [
    { name: t('dashboard.charts.income'), data: monthly_sales_chart },
    { name: t('sidebar.orders'), data: mockOrderCounts },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 h-full">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t('dashboard.charts.monthlyStats')}
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {t('dashboard.charts.description')}
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
