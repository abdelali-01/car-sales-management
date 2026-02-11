'use client';

import ToastContainer from '@/components/ui/toast/ToastContainer';
import { removeToast } from '@/store/toast/toastSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';

export default function ToastProvider() {
    const { toasts } = useSelector((state: RootState) => state.toast);
    const dispatch = useDispatch<AppDispatch>();

    const handleDismiss = (id: string) => {
        dispatch(removeToast(id));
    };

    return <ToastContainer toasts={toasts} onDismiss={handleDismiss} />;
}
