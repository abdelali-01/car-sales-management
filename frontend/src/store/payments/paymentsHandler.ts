import { addToast } from "../toast/toastSlice";
import { AppDispatch } from "../store";
import { setPayments, setOrderPayments, setClientPayments, addPayment as addPaymentAction, setLoading, setError } from "./paymentSlice";
import { Payment } from "@/types/auto-sales";
import api, { getErrorMessage } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

// Fetch all payments with optional filters
export const fetchPayments = (params?: {
    method?: string;
}) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
        const queryParams = new URLSearchParams();
        if (params?.method) queryParams.append('method', params.method);

        const url = queryParams.toString()
            ? `${ENDPOINTS.PAYMENTS.BASE}?${queryParams.toString()}`
            : ENDPOINTS.PAYMENTS.BASE;

        const res = await api.get(url);

        if (res.data.success) {
            dispatch(setPayments({
                payments: res.data.data || [],
                total: res.data.meta.total || 0
            }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching payments:', error);
        dispatch(setError(message));
        dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoading(false));
    }
};

// Create new payment
export const createPayment = (paymentData: Omit<Payment, 'id' | 'createdAt'>) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
        const res = await api.post(ENDPOINTS.PAYMENTS.BASE, paymentData);

        if (res.data.success) {
            const newPayment = res.data.data;
            dispatch(addPaymentAction(newPayment));
            dispatch(addToast({ type: 'success', message: 'Payment created successfully' }));
            return newPayment;
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error creating payment:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Mark payment as paid

// Fetch payments for a specific order
export const fetchOrderPayments = (orderId: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
        const res = await api.get(ENDPOINTS.PAYMENTS.BY_ORDER(orderId));

        if (res.data.success) {
            dispatch(setOrderPayments(res.data.data || []));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching order payments:', error);
        dispatch(setError(message));
        dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoading(false));
    }
};

// Fetch payments for a specific client
export const fetchClientPayments = (clientId: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
        const res = await api.get(ENDPOINTS.PAYMENTS.BY_CLIENT(clientId));

        if (res.data.success) {
            dispatch(setClientPayments(res.data.data || []));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching client payments:', error);
        dispatch(setError(message));
        dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoading(false));
    }
};
