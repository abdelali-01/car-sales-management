'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { createClient, updateClient } from '@/store/clients/clientsHandler';
import { Client } from '@/types/auto-sales';
import { useTranslation } from 'react-i18next';

interface ClientFormModalProps {
    closeModal: () => void;
    client?: Client | null;
}

export default function ClientFormModal({ closeModal, client }: ClientFormModalProps) {
    const { t } = useTranslation('admin');
    const dispatch = useDispatch<AppDispatch>();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
    });

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name || '',
                phone: client.phone || '',
                email: client.email || '',
                address: client.address || '',
                notes: client.notes || '',
            });
        }
    }, [client]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (client) {
                await dispatch(updateClient(client.id, formData));
            } else {
                await dispatch(createClient(formData as any));
            }
            closeModal();
        } catch (error) {
            console.error('Error saving client:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {client ? t('clients.form.editTitle') : t('clients.form.addTitle')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('clients.form.nameLabel')}</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('clients.form.phoneLabel')}</label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('clients.form.emailLabel')}</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('clients.form.addressLabel')}</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('clients.form.notesLabel')}</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={closeModal}
                        className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition-colors">
                        {t('clients.form.cancel')}
                    </button>
                    <button type="submit" disabled={isSubmitting}
                        className="px-4 py-2.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {client ? t('clients.form.save') : t('clients.form.add')}
                    </button>
                </div>
            </form>
        </div>
    );
}
