'use client';
import { useState } from 'react';
import Input from '../form/input/InputField';
import { useTranslation } from 'react-i18next';

interface ShopHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterToggle: () => void;
}

export default function ShopHeader({ searchQuery, onSearchChange, onFilterToggle }: ShopHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('shop.title')}</h1>
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-96">
            <Input
              type="text"
              placeholder={t('shop.search')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#efe9df] dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#c1a36f] focus:border-[#c1a36f] placeholder-gray-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={onFilterToggle}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f3efe7] dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-[#efe9df] dark:hover:bg-gray-600 shadow"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {t('shop.filters.title')}
          </button>
        </div>
      </div>
    </div>
  );
} 