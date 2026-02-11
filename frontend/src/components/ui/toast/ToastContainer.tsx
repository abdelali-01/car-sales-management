'use client';

import React from 'react';
import Toast from './Toast';
import { Toast as ToastType } from '@/store/toast/toastSlice';

interface ToastContainerProps {
    toasts: ToastType[];
    onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
    // Limit visible toasts to prevent overflow
    const visibleToasts = toasts.slice(-5);

    return (
        <div className="fixed bottom-4 right-4 z-[99999] flex flex-col-reverse gap-3 pointer-events-none">
            {visibleToasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast toast={toast} onDismiss={onDismiss} />
                </div>
            ))}
        </div>
    );
}
