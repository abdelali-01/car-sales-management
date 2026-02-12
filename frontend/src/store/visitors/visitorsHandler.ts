import { addToast } from "../toast/toastSlice";
import { AppDispatch } from "../store";
import {
    setVisitors,
    addVisitor as addVisitorAction,
    updateVisitorStatus as updateVisitorStatusAction,
    setCurrentVisitor,
    updateVisitorRemarks as updateVisitorRemarksAction,
    addInterestToVisitor,
    removeInterestFromVisitor,
    updateInterestPriority as updateInterestPriorityAction,
    setLoading,
    setError
} from "./visitorSlice";
import { Visitor, VisitorInterestOffer } from "@/types/auto-sales";
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
                visitors: res.data.data || [],
                total: res.data.meta.total || 0
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

// Fetch single visitor by ID with interests
export const fetchVisitorById = (visitorId: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
        const res = await api.get(ENDPOINTS.VISITORS.BY_ID(visitorId));

        if (res.data.success) {
            const visitor = res.data.data;

            // Fetch visitor's interests
            const interestsRes = await api.get(ENDPOINTS.VISITORS.INTERESTS(visitorId));
            if (interestsRes.data.success) {
                visitor.interests = interestsRes.data.data || [];
            }

            dispatch(setCurrentVisitor(visitor));
            return visitor;
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching visitor:', error);
        dispatch(setError(message));
        dispatch(addToast({ type: 'error', message }));
        throw error;
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
            const newVisitor = res.data.data;
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

// Update visitor remarks
export const updateVisitorRemarks = (visitorId: number, remarks: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.patch(ENDPOINTS.VISITORS.BY_ID(visitorId), { remarks });

        if (res.data.success) {
            dispatch(updateVisitorRemarksAction({ id: visitorId, remarks }));
            dispatch(addToast({ type: 'success', message: 'Notes updated successfully' }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error updating visitor remarks:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    }
};

// Add interest to visitor
export const addVisitorInterest = (visitorId: number, offerId: number, priority?: number) => async (dispatch: AppDispatch) => {
    try {
        const payload: any = { offerId };
        if (priority) payload.priority = priority;

        const res = await api.post(ENDPOINTS.VISITORS.INTERESTS(visitorId), payload);

        if (res.data.success) {
            // Refetch visitor data to get complete offer information
            await dispatch(fetchVisitorById(visitorId));
            dispatch(addToast({ type: 'success', message: 'Offer added to interests' }));
            return res.data.data;
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error adding interest:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    }
};

// Remove interest from visitor
export const removeVisitorInterest = (visitorId: number, offerId: number) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.delete(ENDPOINTS.VISITORS.INTEREST_BY_OFFER(visitorId, offerId));

        if (res.data.success) {
            dispatch(removeInterestFromVisitor(offerId));
            dispatch(addToast({ type: 'success', message: 'Interest removed' }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error removing interest:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    }
};

// Update interest priority
export const updateVisitorInterestPriority = (visitorId: number, offerId: number, priority: number) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.patch(ENDPOINTS.VISITORS.INTEREST_BY_OFFER(visitorId, offerId), { priority });

        if (res.data.success) {
            dispatch(updateInterestPriorityAction({ offerId, priority }));
            dispatch(addToast({ type: 'success', message: 'Priority updated' }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error updating priority:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    }
};

// Delete visitor
export const deleteVisitor = (visitorId: number) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.delete(ENDPOINTS.VISITORS.BY_ID(visitorId));

        if (res.data.success) {
            dispatch(addToast({ type: 'success', message: 'Visitor deleted successfully' }));
            // Refetch visitors to update the list
            dispatch(fetchVisitors());
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error deleting visitor:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    }
};
