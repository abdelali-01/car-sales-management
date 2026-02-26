'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import VisitorsTable from '@/components/tables/VisitorsTable';
import VisitorFormModal from '@/components/modals/VisitorFormModal';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function VisitorsPage() {
    const { closeModal, openModal, isOpen } = useModal();
    const { t } = useTranslation('admin');


    return (
        <div className='space-y-5'>
            <PageBreadcrumb pageTitle={t('visitors.title', 'Visitors Management')} />

            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('visitors.subtitle', 'Visitor Leads')}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('visitors.description', 'Track and manage potential buyers')}</p>
                    </div>
                    <button onClick={openModal}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors text-sm font-medium">
                        <PlusIcon className="w-4 h-4" /> {t('visitors.addVisitor', 'Add Visitor')}
                    </button>
                </div>
                <VisitorsTable />
            </div>

            {isOpen && (
                <Modal isOpen={isOpen} onClose={closeModal} className='max-w-[600px] p-5 lg:p-10'>
                    <VisitorFormModal closeModal={closeModal} />
                </Modal>
            )}
        </div>
    );
}
