'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ClientInfoCard from '@/components/clients/ClientInfoCard';
import ClientOrdersList from '@/components/clients/ClientOrdersList';
import ClientPaymentsCard from '@/components/clients/ClientPaymentsCard';
import { fetchClient } from '@/store/clients/clientsHandler';
import { fetchOrders } from '@/store/orders/orderHandler';
import { fetchClientPayments } from '@/store/payments/paymentsHandler';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';

export default function ClientDetailsPage() {
    const params = useParams();
    const id = Number(params.id);
    const dispatch = useDispatch<AppDispatch>();

    const { currentClient, loading: clientLoading } = useSelector((state: RootState) => state.clients);
    // Note: orders state usually contains a list 'orders'. When fetching for a specific client, we might overwrite the main list.
    // If we want to avoid that, we should use a separate state or just accept it's a detail view.
    // Given the architecture, filtering the global list is acceptable for now.
    const { orders, loading: ordersLoading } = useSelector((state: RootState) => state.orders);
    const { clientPayments, loading: paymentsLoading } = useSelector((state: RootState) => state.payments);

    useEffect(() => {
        if (id) {
            dispatch(fetchClient(id));
            dispatch(fetchOrders({ clientId: id }));
            dispatch(fetchClientPayments(id));
        }
    }, [dispatch, id]);

    return (
        <div className="space-y-6">
            <PageBreadcrumb
                paths={["clients"]} pageTitle={currentClient ? currentClient.name : 'Client Details'}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Info & Orders */}
                <div className="lg:col-span-2 space-y-6">
                    <ClientInfoCard client={currentClient} loading={clientLoading} />
                    <ClientOrdersList orders={orders} loading={ordersLoading} />
                </div>

                {/* Right Column: Payments */}
                <div className="lg:col-span-1 h-full min-h-[500px]">
                    <ClientPaymentsCard
                        payments={clientPayments}
                        loading={paymentsLoading}
                        orders={orders}
                        clientId={currentClient?.id}
                    />
                </div>
            </div>
        </div>
    );
}
