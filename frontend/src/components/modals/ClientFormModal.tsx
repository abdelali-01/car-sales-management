'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { createClient } from '@/store/clients/clientsHandler';

interface ClientFormModalProps {
    closeModal: () => void;
}

export default function ClientFormModal({ closeModal }: ClientFormModalProps) {
    const dispatch = useDispatch<AppDispatch>();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await dispatch(createClient(formData as any));
            closeModal();
        } catch (error) {
            console.error('Error creating client:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Add New Client</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={closeModal}
                        className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting}
                        className="px-4 py-2.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Saving...' : 'Add Client'}
                    </button>
                </div>
            </form>
        </div>
    );
}
