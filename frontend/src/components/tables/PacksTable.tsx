'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Table, TableRow, TableHeader, TableCell, TableBody } from '../ui/table';
import Image from 'next/image';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useModal } from '@/hooks/useModal';
import { Modal } from '../ui/modal';
import PackModal from '../modals/PackModal';
import Badge from '../ui/badge/Badge';
import { useDeleteModal } from '@/context/DeleteModalContext';
import Loader from '../ui/load/Loader';
import { deletePack, fetchPacks } from '@/store/offers/offersHandler';
import { fetchProducts } from '@/store/products/productHandler';

export default function PacksTable() {
    const dispatch = useDispatch<AppDispatch>();
    const { packs } = useSelector((state: RootState) => state.offers);
    const { isOpen, openModal, closeModal, selectedItem } = useModal();
    const {openModal : openDeleteModal} = useDeleteModal();

    useEffect(() => {
        dispatch(fetchPacks());
        dispatch(fetchProducts());
    }, [dispatch])

    if (!packs) return <Loader/>
    if(packs.length < 1) return <div className='flex justify-center items-center h-full text-gray-400 dark:text-gray-500'>No packs found</div>
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
                                    Pack
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Products
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    Price
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
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {packs.map((pack) => (
                                <TableRow key={pack.id} className="hover:bg-gray-200 dark:hover:bg-white/[0.05] transition-all duration-200">
                                    <TableCell className="px-4 py-3 text-gray-500 text-start font-semibold dark:text-gray-400">
                                        <div className='flex items-center gap-2'>
                                            {pack.images[0] && (
                                                <Image
                                                    src={`${pack.images[0]}`}
                                                    alt={pack.name}
                                                    className="w-10 h-10 rounded-md object-cover"
                                                    width={40}
                                                    height={40}
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium">{pack.name}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex flex-wrap gap-1">
                                            {pack.products.map((product) => (
                                                <Badge key={product.id} color="primary">
                                                    {product.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {pack.price} DA
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Badge color="success">{pack.discount}%</Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openModal(pack)}
                                                className="p-1 text-gray-500 hover:text-primary-500 transition-colors"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Here you would typically make an API call to delete the pack
                                                    console.log("Deleting pack:", pack.id);
                                                }}
                                                className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                                            >
                                                <TrashIcon className="w-5 h-5" onClick={()=> openDeleteModal(pack.id , (id)=>dispatch(deletePack(Number(id))))}/>
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
                    <PackModal closeModal={closeModal} selectedItem={selectedItem} />
                </Modal>
            )}
        </div>
    );
} 