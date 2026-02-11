'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Table, TableRow, TableHeader, TableCell, TableBody } from '../ui/table';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import Badge from '../ui/badge/Badge';
import Loader from '../ui/load/Loader';
import { fetchPromoCodes, deletePromoCode } from '@/store/promoCodes/promoCodesHandler';
import { useModal } from '@/hooks/useModal';
import { Modal } from '../ui/modal';
import PromoCodeModal from '../modals/PromoCodeModal';
import { useDeleteModal } from '@/context/DeleteModalContext';

export default function PromoCodesTable() {
    const dispatch = useDispatch<AppDispatch>();
    const { promoCodes, loading } = useSelector((state: RootState) => state.promoCodes);
    const { isOpen, openModal, closeModal, selectedItem } = useModal();
    const { openModal: openDeleteModal } = useDeleteModal();

    useEffect(() => {
        dispatch(fetchPromoCodes());
    }, [dispatch]);

    if (!promoCodes) return <Loader />;
    if (promoCodes.length < 1) return <div className='flex justify-center items-center h-full text-gray-400 dark:text-gray-500'>No promo codes found</div>;

    return (
        <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1000px]">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Code
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Discount
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Valid Period
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Status
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {promoCodes.map((promoCode) => (
                                <TableRow key={promoCode.id} className="hover:bg-gray-200 dark:hover:bg-white/[0.05] transition-all duration-200">
                                    <TableCell className="px-4 py-3 text-gray-500 text-start font-semibold dark:text-gray-400">
                                        {promoCode.code}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Badge color="primary">
                                                {promoCode.type === 'percentage' ? `${promoCode.discount}%` : `${promoCode.discount} DA`}
                                            </Badge>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {promoCode.type === 'percentage' ? 'off' : 'discount'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex flex-col">
                                            <span>From: {new Date(promoCode.validFrom).toLocaleDateString('fr-FR')}</span>
                                            <span>To: {new Date(promoCode.validUntil).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Badge color={promoCode.isActive ? "success" : "error"}>
                                            {promoCode.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openModal(promoCode)}
                                                className="p-1 text-gray-500 hover:text-primary-500 transition-colors"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(promoCode.id, (id) => dispatch(deletePromoCode(Number(id))))}
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
                <Modal isOpen={isOpen} onClose={closeModal} className='max-w-[800px] p-5 lg:p-10'>
                    <PromoCodeModal closeModal={closeModal} selectedItem={selectedItem} />
                </Modal>
            )}
        </div>
    );
} 