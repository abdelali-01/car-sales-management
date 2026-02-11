"use client";

import { AppDispatch, RootState } from "@/store/store";
import { fecthTrodatStockTable } from "@/store/trodat-register/trodatRegisterHandler";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Badge from "../ui/badge/Badge";

export default function MonthlyTarget() {
  const { stockTable, statistic } = useSelector((state: RootState) => state.trodatRegister);
  const dispatch = useDispatch<AppDispatch>();
  const [items, setItems] = useState<T[] | null>(null);

  useEffect(() => {
    if (stockTable) {
      const models = [...stockTable.table].sort((a, b) => {
        const getPriority = (item) => {
          if (item.quantity <= 10) return 0;
          if (item.quantity <= 30) return 1;
          return 2;
        };

        return getPriority(a) - getPriority(b);
      });

      setItems(models);

    } else {
      dispatch(fecthTrodatStockTable());
    }
  }, [stockTable, dispatch]);


  if (!statistic) return null;

  const trodatSells = statistic.trodatSells;
  const total = statistic.total;
  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Tampons Overview
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Your Tampon stock overview
            </p>
          </div>
        </div>
        <div className="relative ">
          <div className="overflow-y-auto max-h-[180px]">
            {items && items.map((item, i) => (
              <div key={i} className="rounded-md my-3  p-3 border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">
                  {item.model}
                </h3>
                <Badge color={item.quantity <= 10 ? 'error' : item.quantity > 10 && item.quantity <= 30 ? 'warning' : 'success'}>
                  {item.quantity}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-5 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
            You sold {trodatSells.current} tompons this month. It’s {trodatSells.isUp ? "higher" : "lower"} than last month. {trodatSells.isUp ? "Keep up the good work!" : "Let’s aim higher next month!"}
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-18 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Total Sell`s
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {trodatSells.current}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {trodatSells.isUp ? <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                fill="#039855"
              /> : <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z"
                fill="#D92D20"
              />}
            </svg>
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Income 
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {total.current} DA
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {total.isUp ? <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                fill="#039855"
              /> : <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z"
                fill="#D92D20"
              />}
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
}
