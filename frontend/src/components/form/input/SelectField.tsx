import React, { FC, ReactNode } from "react";

interface SelectFieldProps {
  id?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  children: ReactNode;
}

const SelectField: FC<SelectFieldProps> = ({
  id,
  name,
  value,
  onChange,
  className = "",
  required = false,
  disabled = false,
  hint,
  children,
}) => {
  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={inputClasses}
        required={required}
        disabled={disabled}
      >
        {children}
      </select>
      {hint && (
        <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
};

export default SelectField; 