import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export default function Input({ label, error, icon, className = '', ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    className={`w-full ${icon ? 'pl-10' : 'px-4'} py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                    focus:ring-2 focus:ring-brand-500 focus:outline-none transition-shadow
                    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'}
                    ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
