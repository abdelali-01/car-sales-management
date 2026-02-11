import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    description?: string;
    duration?: number; // in milliseconds, default 4000
    persistent?: boolean; // if true, won't auto-dismiss
}

interface ToastState {
    toasts: Toast[];
}

const initialState: ToastState = {
    toasts: []
};

let toastIdCounter = 0;

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
            const id = `toast-${Date.now()}-${toastIdCounter++}`;
            state.toasts.push({
                id,
                duration: 4000,
                ...action.payload
            });
        },
        removeToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
        },
        clearToasts: (state) => {
            state.toasts = [];
        }
    }
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;
