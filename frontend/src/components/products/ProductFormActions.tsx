'use client';
import React from 'react';
import Button from '@/components/ui/button/Button';
import { useRouter } from 'next/navigation';

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
                Cancel
            </Button>
            <Button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting
                    ? 'Saving...'
                    : isEditing
                        ? 'Update Product'
                        : 'Publish Product'
                }
            </Button>
        </div>
    );
}
