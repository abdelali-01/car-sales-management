import { addToast } from "../toast/toastSlice";
import { AppDispatch } from "../store";
import { setOrders, addOrder as addOrderAction, updateOrder as updateOrderAction, removeOrder, setLoading, setError } from "./orderSlice";
import { Order, OrderDocument } from "@/types/auto-sales";
import api, { getErrorMessage } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

// Fetch all orders
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
                orders: res.data.data || [],
                total: res.data.meta?.total || 0
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

// Fetch single order by ID
export const fetchOrderById = (id: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
        const res = await api.get(ENDPOINTS.ORDERS.BY_ID(id));

        if (res.data.success) {
            // We might need to handle this if we want to store currentOrder in state
            // For now, we can update it in the list if it exists
            dispatch(updateOrderAction(res.data.data));
            return res.data.data;
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching order:', error);
        dispatch(setError(message));
        dispatch(addToast({ type: 'error', message }));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Create new order with optional passport image
export const createOrder = (orderData: any, passportFile?: File) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
        let res;
        if (passportFile) {
            // Append all fields to FormData
            const formData = new FormData();

            // Helper to append nested objects
            const appendFormData = (data: any, rootKey?: string) => {
                if (data instanceof File) {
                    formData.append(rootKey || 'file', data);
                } else if (Array.isArray(data)) {
                    data.forEach((value, index) => {
                        appendFormData(value, rootKey ? `${rootKey}[${index}]` : index.toString());
                    });
                } else if (typeof data === 'object' && data !== null) {
                    Object.keys(data).forEach(key => {
                        const value = data[key];
                        const nextKey = rootKey ? `${rootKey}[${key}]` : key;
                        appendFormData(value, nextKey);
                    });
                } else if (data !== undefined && data !== null) {
                    formData.append(rootKey || '', data.toString());
                }
            };

            appendFormData(orderData);

            formData.append('passportImage', passportFile);

            res = await api.post(ENDPOINTS.ORDERS.BASE, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            res = await api.post(ENDPOINTS.ORDERS.BASE, orderData);
        }

        if (res.data.success) {
            const newOrder = res.data.data;
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

// Update existing order
export const updateOrder = (orderId: number, updates: Partial<Order>, passportFile?: File) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
        let res;
        if (passportFile) {
            // Append all fields to FormData
            const formData = new FormData();

            // Helper to append nested objects
            const appendFormData = (data: any, rootKey?: string) => {
                if (data instanceof File) {
                    formData.append(rootKey || 'file', data);
                } else if (Array.isArray(data)) {
                    data.forEach((value, index) => {
                        appendFormData(value, rootKey ? `${rootKey}[${index}]` : index.toString());
                    });
                } else if (typeof data === 'object' && data !== null) {
                    Object.keys(data).forEach(key => {
                        const value = data[key];
                        // Skip unneeded fields like timestamps if they are in updates
                        if (['createdAt', 'updatedAt', 'id'].includes(key)) return;

                        const nextKey = rootKey ? `${rootKey}[${key}]` : key;
                        appendFormData(value, nextKey);
                    });
                } else if (data !== undefined && data !== null) {
                    formData.append(rootKey || '', data.toString());
                }
            };

            appendFormData(updates);
            formData.append('passportImage', passportFile);

            res = await api.patch(ENDPOINTS.ORDERS.BY_ID(orderId), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            res = await api.patch(ENDPOINTS.ORDERS.BY_ID(orderId), updates);
        }

        if (res.data.success) {
            const updatedOrder = res.data.data;
            dispatch(updateOrderAction(updatedOrder));
            dispatch(addToast({ type: 'success', message: 'Order updated successfully' }));
            return updatedOrder;
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error updating order:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Cancel order
export const cancelOrder = (orderId: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
        const res = await api.post(ENDPOINTS.ORDERS.CANCEL(orderId));

        if (res.data.success) {
            const updatedOrder = res.data.data;
            dispatch(updateOrderAction(updatedOrder));
            dispatch(addToast({ type: 'success', message: 'Order canceled successfully' }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error canceling order:', error);
        dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoading(false));
    }
};

// Upload order document
export const uploadOrderDocument = (orderId: number, file: File, name: string, type?: string) => async (dispatch: AppDispatch) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        if (type) formData.append('type', type);
        formData.append('orderId', orderId.toString());

        const res = await api.post(ENDPOINTS.ORDERS.DOCUMENTS(orderId), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (res.data.success) {
            // Since we don't have a specific action for adding documents to an order in store yet,
            // we might want to refetch the order or assume the caller handles UI updates.
            // But ideally, the backend returns the created document. 
            // We can dispatch an update to the order content if we had deep nested updates or just re-fetch.
            // For now, we'll re-fetch the order to be safe and simple.
            await dispatch(fetchOrderById(orderId));
            dispatch(addToast({ type: 'success', message: 'Document uploaded successfully' }));
            return res.data.data;
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error uploading document:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    }
};

// Delete order document
export const deleteOrderDocument = (orderId: number, docId: number) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.delete(ENDPOINTS.ORDERS.DELETE_DOCUMENT(orderId, docId));

        if (res.data.success) {
            await dispatch(fetchOrderById(orderId));
            dispatch(addToast({ type: 'success', message: 'Document deleted successfully' }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error deleting document:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    }
};
