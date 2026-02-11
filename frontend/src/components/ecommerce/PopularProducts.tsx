"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState } from "react";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import Image from "next/image";

export default function PopularProducts() {
  const [isOpen, setIsOpen] = useState(false);
  const { popular_products } = useSelector((state: RootState) => state.statistics);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Popular Products
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Top selling products this month
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

      <div className="space-y-4 mt-6">
        {popular_products && popular_products.length > 0 ? (
          popular_products.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {product.image ? (
                      <Image
                        width={40}
                        height={40}
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No img</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                      {product.name}
                    </p>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {product.price} DA
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                  {product.total_sold}
                </p>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  Sold
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No popular products data available
          </div>
        )}
      </div>
    </div>
  );
} 