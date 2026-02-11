'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Table, TableRow, TableHeader, TableCell, TableBody } from '../ui/table';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import Loader from '../ui/load/Loader';
import { fetchPixels, deletePixel } from '@/store/pixels/pixelsHandler';
import { useModal } from '@/hooks/useModal';
import { Modal } from '../ui/modal';
import PixelModal from '../modals/PixelModal';
import { useDeleteModal } from '@/context/DeleteModalContext';
import { useTranslation } from 'react-i18next';

export default function PixelsTable() {
    const dispatch = useDispatch<AppDispatch>();
    const { pixels } = useSelector((state: RootState) => state.pixels);
    const { isOpen, openModal, closeModal, selectedItem } = useModal();
    const { openModal: openDeleteModal } = useDeleteModal();
    const { t } = useTranslation('admin');

    useEffect(() => {
        dispatch(fetchPixels());
    }, [dispatch]);

    if (!pixels) return <Loader />;
    if (pixels.length < 1) return <div className='flex justify-center items-center h-full text-gray-400 dark:text-gray-500'>{t('pixels.noPixels')}</div>;

    return (
        <div className="max-w-full overflow-x-auto">
            <div className="min-w-[800px]">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    {t('pixels.columns.pixelId')}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    {t('pixels.columns.name')}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    {t('pixels.columns.createdAt')}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    {t('common.actions')}
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {pixels.map((pixel) => (
                                <TableRow key={pixel.id} className="hover:bg-gray-200 dark:hover:bg-white/[0.05] transition-all duration-200">
                                    <TableCell className="px-4 py-3 text-gray-500 text-start font-semibold dark:text-gray-400">
                                        {pixel.id}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {pixel.name}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {pixel.created_at ? new Date(pixel.created_at).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : '-'}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openModal(pixel)}
                                                className="p-1 text-gray-500 hover:text-primary-500 transition-colors"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(pixel.id, (id) => dispatch(deletePixel(id as string)))}
                                                className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {isOpen && selectedItem && (
                <Modal isOpen={isOpen} onClose={closeModal} className='max-w-[600px] p-5 lg:p-10'>
                    <PixelModal closeModal={closeModal} selectedItem={selectedItem} />
                </Modal>
            )}
        </div>
    );
}
