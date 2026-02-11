'use client';
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface DeleteModalProps {
    isOpen: boolean;
    itemId: string | number;
    onClose: () => void;
    onClick: () => void;
}

export default function DeleteModal({ isOpen, onClose, onClick }: DeleteModalProps) {
    const { t } = useTranslation('admin');

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-md p-6 sm:p-8"
            showCloseButton={false}
        >
            <div className="text-center">
                {/* Icon */}
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <ExclamationTriangleIcon className="h-7 w-7 text-red-600 dark:text-red-400" />
                </div>

                {/* Title */}
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {t('common.deleteConfirmTitle', 'Confirm Deletion')}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t('common.deleteConfirmMessage', 'Are you sure you want to delete this item? This action cannot be undone.')}
                </p>

                {/* Actions */}
                <div className="mt-6 flex gap-3 justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {t('common.cancel', 'Cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={onClick}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                    >
                        {t('common.delete', 'Delete')}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
