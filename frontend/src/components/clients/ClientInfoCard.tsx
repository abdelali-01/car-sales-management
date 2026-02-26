import { useState } from 'react';
import { Client } from "@/types/auto-sales";
import { UserCircleIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, CurrencyDollarIcon, BanknotesIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Modal } from '@/components/ui/modal';
import ClientFormModal from '../modals/ClientFormModal';
import { useTranslation } from 'react-i18next';

interface ClientInfoCardProps {
    client: Client | null;
    loading: boolean;
}

export default function ClientInfoCard({ client, loading }: ClientInfoCardProps) {
    const { t } = useTranslation('admin');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (loading) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-6 shadow-sm animate-pulse h-64">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (!client) return null;

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <UserCircleIcon className="w-6 h-6 text-brand-500" />
                    {t('clients.info.title')}
                </h3>
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2 text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title={t('clients.info.edit')}
                >
                    <PencilSquareIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('clients.info.fullName')}</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">{client.name}</p>
                    </div>

                    <div className="flex items-start gap-3">
                        <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('clients.info.phone')}</p>
                            <p className="text-base text-gray-900 dark:text-white">{client.phone}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('clients.info.email')}</p>
                            <p className="text-base text-gray-900 dark:text-white break-all">{client.email || '—'}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('clients.info.address')}</p>
                            <p className="text-base text-gray-900 dark:text-white">{client.address || '—'}</p>
                        </div>
                    </div>
                </div>

            </div>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className='max-w-xl p-6'>
                <ClientFormModal closeModal={() => setIsEditModalOpen(false)} client={client} />
            </Modal>
        </div>
    );
}
