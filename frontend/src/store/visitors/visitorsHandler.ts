import { addToast } from "../toast/toastSlice";
import { AppDispatch } from "../store";
import { setVisitors, addVisitor as addVisitorAction, updateVisitorStatus as updateVisitorStatusAction, setLoading, setError } from "./visitorSlice";
import { Visitor } from "@/types/auto-sales";
import api, { getErrorMessage } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

// Fetch all visitors with optional filters
export const fetchVisitors = (params?: {
    page?: number;
    limit?: number;
    status?: string;
}) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);

        const url = queryParams.toString()
            ? `${ENDPOINTS.VISITORS.BASE}?${queryParams.toString()}`
            : ENDPOINTS.VISITORS.BASE;

        const res = await api.get(url);

        if (res.data.success) {
            dispatch(setVisitors({
                visitors: res.data.visitors || [],
                total: res.data.total || 0
            }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching visitors:', error);
        dispatch(setError(message));
        dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoading(false));
    }
};

// Create new visitor
export const createVisitor = (visitorData: Omit<Visitor, 'id' | 'createdAt' | 'status'>) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
        const res = await api.post(ENDPOINTS.VISITORS.BASE, visitorData);

        if (res.data.success) {
            const newVisitor = res.data.visitor;
            dispatch(addVisitorAction(newVisitor));
            dispatch(addToast({ type: 'success', message: 'Visitor created successfully' }));
            return newVisitor;
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error creating visitor:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Update visitor status
export const updateVisitorStatus = (visitorId: number, status: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.patch(ENDPOINTS.VISITORS.STATUS(visitorId), { status });

        if (res.data.success) {
            dispatch(updateVisitorStatusAction({ id: visitorId, status }));
            dispatch(addToast({ type: 'success', message: 'Visitor status updated successfully' }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error updating visitor status:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    }
};
