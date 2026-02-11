'use client';
import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import CategoryModal from '@/components/modals/CategoryModal';
import CategoriesTable from '@/components/tables/CategoriesTable';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import { useTranslation } from 'react-i18next';

export default function CategoriesPage() {
    const { closeModal, openModal, isOpen } = useModal();
    const { t } = useTranslation('admin');

    return (
        <div className='space-y-5'>
            <PageBreadcrumb pageTitle={t('categories.title')} />

            <ComponentCard title={t('categories.list')} cta={{
                content: t('categories.addCategory'), onClick: () => {
                    openModal()
                }
            }}>
                <CategoriesTable />
            </ComponentCard>

            {isOpen && (
                <Modal isOpen={isOpen} onClose={closeModal} className='max-w-[600px] p-5 lg:p-10'>
                    <CategoryModal closeModal={closeModal} />
                </Modal>
            )}
        </div>
    )
}
