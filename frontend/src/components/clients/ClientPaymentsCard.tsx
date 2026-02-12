import { useState } from 'react';
import { Payment, Order } from "@/types/auto-sales";
import { CreditCardIcon, ArrowDownCircleIcon, CheckCircleIcon, BanknotesIcon, PlusIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { Modal } from '@/components/ui/modal';
import PaymentFormModal from '../modals/PaymentFormModal';
import { useModal } from '@/hooks/useModal';

interface ClientPaymentsCardProps {
    payments: Payment[] | null;
    loading: boolean;
    orders?: Order[] | null;
    clientId?: number;
}

const methodIcons: Record<string, any> = {
    CASH: BanknotesIcon,
    CARD: CreditCardIcon,
    TRANSFER: ArrowDownCircleIcon,
    CHECK: CheckCircleIcon,
};

export default function ClientPaymentsCard({ payments, loading, orders, clientId }: ClientPaymentsCardProps) {
    const { isOpen, openModal, closeModal } = useModal();

    if (loading) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-6 shadow-sm h-full animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    const totalPaid = payments?.reduce((sum, p) => p.status?.toLowerCase() === 'paid' ? sum + Number(p.amount) : sum, 0) || 0;
    const totalPending = payments?.reduce((sum, p) => p.status?.toLowerCase() !== 'paid' ? sum + Number(p.amount) : sum, 0) || 0;

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CreditCardIcon className="w-6 h-6 text-brand-500" />
                    Payment History
                </h3>
                <button
                    onClick={openModal}
                    className="p-1.5 rounded-lg text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-900/30 transition-colors"
                    title="Add Payment"
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
                    <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Total Paid</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{totalPaid.toLocaleString()} DZD</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                    <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 mb-1">Pending/Unpaid</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{totalPending.toLocaleString()} DZD</p>
                </div>
            </div>

            {!payments || payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 py-10 text-center">
                    <CreditCardIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No payment history available.</p>
                </div>
            ) : (
                <div className="relative flex-1">
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                        {payments.map((payment) => (
                            <div
                                key={payment.id}
                                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${payment.status?.toLowerCase() === 'paid'
                                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>
                                        <BanknotesIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {Number(payment.amount).toLocaleString()} DZD
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {format(new Date(payment.createdAt), 'MMM dd, yyyy')} • {payment.method}
                                        </p>
                                    </div>
                                </div>

                                <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${payment.status?.toLowerCase() === 'paid'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    }`}>
                                    {payment.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Modal isOpen={isOpen} onClose={closeModal} className='max-w-[600px] p-6'>
                <PaymentFormModal
                    closeModal={closeModal}
                    clientId={clientId}
                    orders={orders ? orders : undefined}
                />
            </Modal>
        </div>
    );
}
