'use client';

import React, { useEffect, useState } from 'react';
import { Toast as ToastType } from '@/store/toast/toastSlice';

interface ToastProps {
    toast: ToastType;
    onDismiss: (id: string) => void;
}

const icons = {
    success: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    error: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    warning: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
    info: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
};

const variantStyles = {
    success: {
        container: 'bg-success-50 dark:bg-success-500/15 border-success-200 dark:border-success-500/30',
        icon: 'text-success-500',
        progress: 'bg-success-500'
    },
    error: {
        container: 'bg-error-50 dark:bg-error-500/15 border-error-200 dark:border-error-500/30',
        icon: 'text-error-500',
        progress: 'bg-error-500'
    },
    warning: {
        container: 'bg-warning-50 dark:bg-warning-500/15 border-warning-200 dark:border-warning-500/30',
        icon: 'text-warning-500',
        progress: 'bg-warning-500'
    },
    info: {
        container: 'bg-blue-50 dark:bg-blue-500/15 border-blue-200 dark:border-blue-500/30',
        icon: 'text-blue-500',
        progress: 'bg-blue-500'
    }
};

export default function Toast({ toast, onDismiss }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [progress, setProgress] = useState(100);
    const duration = toast.duration || 4000;
    const styles = variantStyles[toast.type];

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setIsVisible(true));

        if (!toast.persistent) {
            // Progress bar animation
            const startTime = Date.now();
            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
                setProgress(remaining);

                if (remaining <= 0) {
                    clearInterval(interval);
                }
            }, 50);

            // Auto dismiss
            const timer = setTimeout(() => {
                handleDismiss();
            }, duration);

            return () => {
                clearTimeout(timer);
                clearInterval(interval);
            };
        }
    }, [duration, toast.persistent]);

    const handleDismiss = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onDismiss(toast.id);
        }, 300);
    };

    return (
        <div
            className={`
                relative overflow-hidden
                w-80 max-w-[calc(100vw-2rem)]
                border rounded-xl shadow-lg
                transform transition-all duration-300 ease-out
                ${styles.container}
                ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            <div className="flex items-start gap-3 p-4">
                {/* Icon */}
                <div className={`flex-shrink-0 ${styles.icon}`}>
                    {icons[toast.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {toast.message}
                    </p>
                    {toast.description && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {toast.description}
                        </p>
                    )}
                </div>

                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Progress bar */}
            {!toast.persistent && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/50 dark:bg-white/10">
                    <div
                        className={`h-full transition-all duration-100 ease-linear ${styles.progress}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
