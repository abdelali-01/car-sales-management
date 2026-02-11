'use client';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PixelModal from '@/components/modals/PixelModal';
import PixelsTable from '@/components/tables/PixelsTable';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import { useTranslation } from 'react-i18next';

export default function Pixels() {
    const { closeModal, openModal, isOpen } = useModal();
    const { t } = useTranslation('admin');

    return (
        <div className='space-y-5'>
            <PageBreadcrumb pageTitle={t('pixels.title')} />

            <ComponentCard title={t('pixels.trackingPixels')} cta={{
                content: t('pixels.addPixel'), onClick: () => {
                    openModal()
                }
            }}>
                <PixelsTable />
            </ComponentCard>

            {isOpen && (
                <Modal isOpen={isOpen} onClose={closeModal} className='max-w-[600px] p-5 lg:p-10'>
                    <PixelModal closeModal={closeModal} />
                </Modal>
            )}
        </div>
    )
}
