'use client';
import React from 'react';
import Button from '@/components/ui/button/Button';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface ProductFormActionsProps {
    isSubmitting: boolean;
    isEditing: boolean;
    onSubmit: () => void;
}

export default function ProductFormActions({
    isSubmitting,
    isEditing,
    onSubmit
}: ProductFormActionsProps) {
    const router = useRouter();
    const { t } = useTranslation('admin');

    const handleCancel = () => {
        router.push('/offers');
    };

    return (
        <div className="flex items-center justify-end gap-3">
            <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
            >
                {t('common.cancel', 'Cancel')}
            </Button>
            <Button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting
                    ? t('common.saving', 'Saving...')
                    : isEditing
                        ? t('offers.form.updateOffer', 'Update Offer')
                        : t('offers.form.publishOffer', 'Publish Offer')
                }
            </Button>
        </div>
    );
}
