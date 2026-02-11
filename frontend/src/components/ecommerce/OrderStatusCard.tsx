"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState } from "react";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function OrderStatusCard() {
  const [isOpen, setIsOpen] = useState(false);
  const { order_status_distribution, total_orders } = useSelector((state: RootState) => state.statistics);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

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
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'canceled':
        return 'Canceled';
      case 'confirmed':
        return 'Confirmed';
      default:
        return status;
    }
  };

  const calculatePercentage = (count: number) => {
    if (total_orders === 0) return 0;
    return Math.round((count / total_orders) * 100);
  };

  const statusEntries = Object.entries(order_status_distribution || {});

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Order Status Distribution
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Overview of order statuses
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Export Data
            </DropdownItem>
          </Dropdown>
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
                    {count} Orders
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
            No order data available
          </div>
        )}
      </div>

      {total_orders > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Orders</span>
            <span className="font-semibold text-gray-800 dark:text-white/90">{total_orders}</span>
          </div>
        </div>
      )}
    </div>
  );
} 