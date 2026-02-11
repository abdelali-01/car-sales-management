import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Payment } from "@/types/auto-sales";

interface PaymentsState {
    payments: Payment[] | null;
    orderPayments: Payment[] | null;      // Payments for a specific order
    clientPayments: Payment[] | null;     // Payments for a specific client
    totalCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: PaymentsState = {
    payments: null,
    orderPayments: null,
    clientPayments: null,
    totalCount: 0,
    loading: false,
    error: null
};

const paymentSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        setPayments: (state, action: PayloadAction<{ payments: Payment[], total: number }>) => {
            state.payments = action.payload.payments;
            state.totalCount = action.payload.total;
        },
        setOrderPayments: (state, action: PayloadAction<Payment[]>) => {
            state.orderPayments = action.payload;
        },
        setClientPayments: (state, action: PayloadAction<Payment[]>) => {
            state.clientPayments = action.payload;
        },
        addPayment: (state, action: PayloadAction<Payment>) => {
            if (state.payments) {
                state.payments.unshift(action.payload);
                state.totalCount += 1;
            } else {
                state.payments = [action.payload];
                state.totalCount = 1;
            }
        },
        updatePaymentStatus: (state, action: PayloadAction<{ id: number, status: string }>) => {
            if (state.payments) {
                const payment = state.payments.find(p => p.id === action.payload.id);
                if (payment) {
                    payment.status = action.payload.status as any;
                }
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

export const {
    setPayments,
    setOrderPayments,
    setClientPayments,
    addPayment,
    updatePaymentStatus,
    setLoading,
    setError
} = paymentSlice.actions;

export default paymentSlice.reducer;
