import { useState } from 'react';
import { Payment, Order } from "@/types/auto-sales";
import { CreditCardIcon, ArrowDownCircleIcon, CheckCircleIcon, BanknotesIcon, PlusIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { Modal } from '@/components/ui/modal';
import PaymentFormModal from '../modals/PaymentFormModal';
import { useModal } from '@/hooks/useModal';
import { updateClientFinancials } from '@/store/clients/clientsHandler';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { PencilSquareIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ClientPaymentsCardProps {
    payments: Payment[] | null;
    loading: boolean;
    orders?: Order[] | null;
    clientId?: number;
    totalSpent?: number;
}

const methodIcons: Record<string, any> = {
    CASH: BanknotesIcon,
    CARD: CreditCardIcon,
    TRANSFER: ArrowDownCircleIcon,
    CHECK: CheckCircleIcon,
};

export default function ClientPaymentsCard({ payments, loading, orders, clientId, totalSpent = 0 }: ClientPaymentsCardProps) {
    const { isOpen, openModal, closeModal } = useModal();
    const dispatch = useDispatch<AppDispatch>();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(totalSpent);
    const [isSaving, setIsSaving] = useState(false);

    const handleStartEdit = () => {
        setEditValue(totalSpent);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditValue(totalSpent);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    const handleSaveEdit = async () => {
        if (!clientId) return;

        setIsSaving(true);
        try {
            // Recalculate remaining balance based on new totalSpent
            // We don't need to pass remainingBalance explicitly if the backend handles it, 
            // but the current implementation of updateClientFinancials reducer expects both.
            // However, the backend updateFinancials endpoint accepts partials.
            // Let's check logic: The plan said "Call updateClientFinancials with new totalSpent and recalculated remainingBalance".
            // Ideally backend should calculate remaining balance. But let's follow the plan and current reducer logic.
            const totalPaid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
            const newRemainingBalance = editValue - totalPaid;

            await dispatch(updateClientFinancials(clientId, {
                totalSpent: editValue,
                remainingBalance: newRemainingBalance
            }));
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update financials", error);
        } finally {
            setIsSaving(false);
        }
    };

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

    const totalPaid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    const remainingBalance = totalSpent - totalPaid;

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

            <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Financial Overview</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center h-8">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent</span>
                            {isEditing ? (
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={editValue}
                                            onChange={(e) => setEditValue(Number(e.target.value))}
                                            onKeyDown={handleKeyDown}
                                            className="w-32 px-3 py-1.5 text-sm font-bold text-gray-900 bg-white border border-brand-500 rounded-lg shadow-sm dark:bg-gray-800 dark:border-brand-400 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            autoFocus
                                            placeholder="0.00"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">M</span>
                                    </div>
                                    <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                                        <button
                                            onClick={handleSaveEdit}
                                            disabled={isSaving}
                                            className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors border-r border-gray-200 dark:border-gray-700"
                                            title="Save (Enter)"
                                        >
                                            <CheckIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            disabled={isSaving}
                                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                            title="Cancel (Esc)"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{totalSpent.toLocaleString()} M</span>
                                    <button
                                        onClick={handleStartEdit}
                                        className="p-1 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                                        title="Edit Total Spent"
                                    >
                                        <PencilSquareIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Total Paid</span>
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">{totalPaid.toLocaleString()} M</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Remaining Balance</span>
                            <span className="text-base font-bold text-red-600 dark:text-red-400">{remainingBalance.toLocaleString()} M</span>
                        </div>
                    </div>
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
                                    <div className={`p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400`}>
                                        <BanknotesIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {Number(payment.amount).toLocaleString()} M
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {format(new Date(payment.createdAt), 'MMM dd, yyyy')} • {payment.method}
                                        </p>
                                    </div>
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
