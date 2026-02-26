'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import { AppDispatch, RootState } from '@/store/store';
import { fetchOrderById, updateOrder, uploadOrderDocument, deleteOrderDocument } from '@/store/orders/ordersHandler';
import OrderForm from '@/components/orders/OrderForm';
import { useTranslation } from 'react-i18next';
import Loader from '@/components/ui/load/Loader';
import { TrashIcon, DocumentArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline'; // Adjust import
import Badge from '@/components/ui/badge/Badge';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export default function EditOrderPage() {
    const params = useParams();
    const id = Number(params.id);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { t } = useTranslation('admin');

    // We assume fetchOrderById places the order in state.orders.orders list 
    // or we fetch it and store locally if not using global state efficiently for single item details page pattern
    // Usually it's better to select from store.
    const order = useSelector((state: RootState) => state.orders.orders?.find(o => o.id === id));
    const loading = useSelector((state: RootState) => state.orders.loading);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingDoc, setIsUploadingDoc] = useState(false);

    useEffect(() => {
        if (!order) {
            dispatch(fetchOrderById(id));
        }
    }, [dispatch, id, order]);

    const handleUpdate = async (data: any, passportFile?: File) => {
        setIsSubmitting(true);
        try {
            // Update fields
            await dispatch(updateOrder(id, data, passportFile));


            router.push('/orders');
        } catch (error) {
            console.error('Failed to update order:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const onUploadDocument = async (file: File, name: string) => {
        setIsUploadingDoc(true);
        try {
            await dispatch(uploadOrderDocument(id, file, name, 'general'));
        } catch (error) {
            console.error('Failed to upload doc:', error);
        } finally {
            setIsUploadingDoc(false);
        }
    };

    const handleDeleteDoc = async (docId: number) => {
        if (confirm('Are you sure you want to delete this document?')) {
            await dispatch(deleteOrderDocument(id, docId));
            dispatch(fetchOrderById(id));
        }
    };

    if (loading && !order) return <Loader />;
    if (!order) return <div className="p-8 text-center">{t('orders.noOrders')}</div>;

    return (
        <div className="space-y-8">
            <PageBreadcrumb paths={[t('orders.title')]} pageTitle={t('orders.page.editTitle')} />

            <OrderForm
                initialData={order}
                onSubmit={handleUpdate}
                isSubmitting={isSubmitting}
                isEditing={true}
                onDeleteDocument={handleDeleteDoc}
                onUploadDocument={onUploadDocument}
            />
        </div>
    );
}
