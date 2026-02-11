'use client';
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import AccountsTable from '@/components/tables/AccountsTable'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function AccountPage() {
  const router = useRouter();
  const { t } = useTranslation('admin');

  const handleAddAdmin = () => {
    router.push('/accounts/add');
  };

  return (
    <div className='space-y-5'>
      <PageBreadcrumb pageTitle={t('sidebar.admins')} />

      {/* Main Card */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('admins.title')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {t('admins.description')}
            </p>
          </div>

          <button
            onClick={handleAddAdmin}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors text-sm font-medium"
          >
            <PlusIcon className="w-4 h-4" />
            {t('admins.add')}
          </button>
        </div>

        {/* Accounts Table */}
        <AccountsTable />
      </div>
    </div>
  )
}
