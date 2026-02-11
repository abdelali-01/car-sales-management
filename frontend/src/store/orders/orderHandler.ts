import { addToast } from "../toast/toastSlice";
import { AppDispatch } from "../store";
import { setOrders, addOrder as addOrderAction, updateOrderStatus, setLoading, setError } from "./orderSlice";
import { Order } from "@/types/auto-sales";
import api, { getErrorMessage } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

// Fetch all orders with optional status filter
export const fetchOrders = (params?: {
    status?: string;
}) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);

        const url = queryParams.toString()
            ? `${ENDPOINTS.ORDERS.BASE}?${queryParams.toString()}`
            : ENDPOINTS.ORDERS.BASE;

        const res = await api.get(url);

        if (res.data.success) {
            dispatch(setOrders({
                orders: res.data.orders || [],
                total: res.data.total || 0
            }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching orders:', error);
        dispatch(setError(message));
        dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoading(false));
    }
};

// Create new order
export const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
        const res = await api.post(ENDPOINTS.ORDERS.BASE, orderData);

        if (res.data.success) {
            const newOrder = res.data.order;
            dispatch(addOrderAction(newOrder));
            dispatch(addToast({ type: 'success', message: 'Order created successfully' }));
            return newOrder;
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error creating order:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Confirm order (PENDING → CONFIRMED)
export const confirmOrder = (orderId: number) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.post(ENDPOINTS.ORDERS.CONFIRM(orderId), {});

        if (res.data.success) {
            const { status, updatedAt } = res.data.order;
            dispatch(updateOrderStatus({ id: orderId, status, updatedAt }));
            dispatch(addToast({ type: 'success', message: 'Order confirmed successfully' }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error confirming order:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    }
};

// Complete order (CONFIRMED → COMPLETED)
export const completeOrder = (orderId: number) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.post(ENDPOINTS.ORDERS.COMPLETE(orderId), {});

        if (res.data.success) {
            const { status, updatedAt } = res.data.order;
            dispatch(updateOrderStatus({ id: orderId, status, updatedAt }));
            dispatch(addToast({ type: 'success', message: 'Order completed successfully' }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error completing order:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    }
};

// Cancel order (PENDING/CONFIRMED → CANCELED)
export const cancelOrder = (orderId: number) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.post(ENDPOINTS.ORDERS.CANCEL(orderId), {});

        if (res.data.success) {
            const { status, updatedAt } = res.data.order;
            dispatch(updateOrderStatus({ id: orderId, status, updatedAt }));
            dispatch(addToast({ type: 'success', message: 'Order canceled successfully' }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error canceling order:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    }
};
