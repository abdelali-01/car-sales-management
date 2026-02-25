import { Order } from '@/types/auto-sales';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { createPayment } from '@/store/payments/paymentsHandler';

interface PaymentFormModalProps {
    closeModal: () => void;
    clientId?: number;
    orders?: Order[];
}

export default function PaymentFormModal({ closeModal, clientId, orders }: PaymentFormModalProps) {
    const dispatch = useDispatch<AppDispatch>();

    // Toggle: 'order' | 'free'
    const [paymentType, setPaymentType] = useState<'order' | 'free'>('order');

    const [formData, setFormData] = useState({
        orderId: '',
        clientId: clientId ? String(clientId) : '',
        amount: 0,
        method: 'cash',
        notes: '',
    });

    useEffect(() => {
        if (clientId) {
            setFormData(prev => ({ ...prev, clientId: String(clientId) }));
        }
    }, [clientId]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['amount', 'orderId', 'clientId'].includes(name) ? (value === '' ? '' : value) : value,
        }));
    };

    const handleTypeToggle = (type: 'order' | 'free') => {
        setPaymentType(type);
        // Clear orderId when switching to free
        if (type === 'free') {
            setFormData(prev => ({ ...prev, orderId: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload: any = {
                clientId: formData.clientId ? Number(formData.clientId) : undefined,
                amount: Number(formData.amount),
                method: formData.method,
                notes: formData.notes,
            };

            // Only include orderId for order-type payments
            if (paymentType === 'order' && formData.orderId) {
                payload.orderId = Number(formData.orderId);
            }

            await dispatch(createPayment(payload));
            closeModal();
        } catch (error) {
            console.error('Error creating payment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">Record Payment</h2>

            {/* Payment Type Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800 mb-5">
                <button
                    type="button"
                    onClick={() => handleTypeToggle('order')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${paymentType === 'order'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    Order Payment
                </button>
                <button
                    type="button"
                    onClick={() => handleTypeToggle('free')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${paymentType === 'free'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    Free / Custom
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Order selector — only shown for Order Payment type */}
                {paymentType === 'order' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Order <span className="text-red-500">*</span>
                        </label>
                        {orders && orders.length > 0 ? (
                            <select
                                name="orderId"
                                required
                                value={formData.orderId}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="">Select Order</option>
                                {orders.map(order => (
                                    <option key={order.id} value={order.id}>
                                        Order #{order.id} — {order.offer ? `${order.offer.brand} ${order.offer.model}` : 'Unknown Car'} ({Number(order.agreedPrice).toLocaleString()} DZD)
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="number"
                                name="orderId"
                                required
                                value={formData.orderId}
                                onChange={handleChange}
                                placeholder="Order ID"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        )}
                    </div>
                )}

                {/* Free payment description */}
                {paymentType === 'free' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2 border border-dashed border-gray-200 dark:border-gray-700">
                        This payment will be recorded without being linked to a specific order.
                    </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Amount (DA) <span className="text-red-500">*</span>
                        </label>
                        <input type="number" name="amount" required value={formData.amount} onChange={handleChange} min={0}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Method <span className="text-red-500">*</span>
                        </label>
                        <select name="method" value={formData.method} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                            <option value="cash">Cash</option>
                            <option value="transfer">Bank Transfer</option>
                            <option value="cheque">Check</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2}
                        placeholder={paymentType === 'free' ? 'Describe the purpose of this payment…' : ''}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={closeModal}
                        className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting}
                        className="px-4 py-2.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Saving...' : 'Record Payment'}
                    </button>
                </div>
            </form>
        </div>
    );
}
