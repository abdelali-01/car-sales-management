'use client';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ClientsTable from '@/components/tables/ClientsTable';
import ClientFormModal from '@/components/modals/ClientFormModal';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export default function ClientsPage() {
    const { t } = useTranslation('admin');
    const { closeModal, openModal, isOpen } = useModal();

    return (
        <div className='space-y-5'>
            <PageBreadcrumb pageTitle={t('clients.page.title')} />

            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('clients.title')}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('clients.page.manageText')}</p>
                    </div>
                    <button onClick={openModal}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors text-sm font-medium">
                        <PlusIcon className="w-4 h-4" /> {t('clients.page.addClient')}
                    </button>
                </div>
                <ClientsTable />
            </div>

            {isOpen && (
                <Modal isOpen={isOpen} onClose={closeModal} className='max-w-[600px] p-5 lg:p-10'>
                    <ClientFormModal closeModal={closeModal} />
                </Modal>
            )}
        </div>
    );
}
