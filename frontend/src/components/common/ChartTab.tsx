import React from "react";

type ChartTabProps = {
  selected: "daily" | "weekly" |"monthly" | "all";
  onSelect: (value: "daily"| "weekly" | "monthly" | "all") => void;
};

const ChartTab: React.FC<ChartTabProps> = ({ selected, onSelect }) => {
  const getButtonClass = (option: "daily"| "weekly" | "monthly" | "all") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => onSelect("daily")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "daily"
        )}`}
      >
        Daily
      </button>

      <button
        onClick={() => onSelect("weekly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "weekly"
        )}`}
      >
        Weekly
      </button>
      <button
        onClick={() => onSelect("monthly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "monthly"
        )}`}
      >
        Monthly
      </button>
      <button
        onClick={() => onSelect("all")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "all"
        )}`}
      >
        All
      </button>
    </div>
  );
};

export default ChartTab;
