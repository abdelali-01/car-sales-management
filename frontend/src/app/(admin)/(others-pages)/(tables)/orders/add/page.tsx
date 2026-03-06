'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb'; // Adjust import if needed
import OrderForm from '@/components/orders/OrderForm';
import { AppDispatch } from '@/store/store';
import { createOrder, uploadOrderDocument } from '@/store/orders/ordersHandler';
import { useTranslation } from 'react-i18next';

export default function AddOrderPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { t } = useTranslation('admin');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: any, passportFile?: File, newDocuments?: File[]) => {
        setIsSubmitting(true);
        try {
            const newOrder = await dispatch(createOrder(data, passportFile));

            if (newOrder && newDocuments && newDocuments.length > 0) {
                // Upload documents in parallel
                await Promise.all(newDocuments.map(file =>
                    dispatch(uploadOrderDocument(newOrder.id, file, file.name, 'general'))
                ));
            }

            router.push('/orders');
        } catch (error) {
            console.error('Failed to create order:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            <PageBreadcrumb paths={[{ name: t('orders.title'), url: '/orders' }]} pageTitle={t('orders.page.addTitle')} />

            <OrderForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
