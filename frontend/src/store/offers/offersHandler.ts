import { addToast } from "../toast/toastSlice";
import { AppDispatch } from "../store";
import { setOffers, setCurrentOffer, addOffer as addOfferAction, updateOffer as updateOfferAction, removeOffer, setLoading, setError } from "./offerSlice";
import { Offer } from "@/types/auto-sales";
import api, { getErrorMessage } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

// Fetch all offers with optional filters
export const fetchOffers = (params?: {
    page?: number;
    limit?: number;
    status?: string;
    brand?: string;
}) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.brand) queryParams.append('brand', params.brand);
        queryParams.append('limit', '10000');

        const url = queryParams.toString()
            ? `${ENDPOINTS.OFFERS.BASE}?${queryParams.toString()}`
            : ENDPOINTS.OFFERS.BASE;

        const res = await api.get(url);

        if (res.data.success) {
            dispatch(setOffers({
                offers: res.data.data || [],
                total: res.data.meta?.total || 0
            }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching offers:', error);
        dispatch(setError(message));
        dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoading(false));
    }
};

// Fetch single offer by ID
export const fetchOfferById = (id: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
        const res = await api.get(ENDPOINTS.OFFERS.BY_ID(id));

        if (res.data.success) {
            dispatch(setCurrentOffer(res.data.data));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching offer:', error);
        dispatch(setError(message));
        dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoading(false));
    }
};

// Create new offer
export const createOffer = (offerData: Omit<Offer, 'id' | 'createdAt' | 'images'>) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
        const res = await api.post(ENDPOINTS.OFFERS.BASE, offerData);

        if (res.data.success) {
            const newOffer = res.data.data;
            dispatch(addOfferAction(newOffer));
            dispatch(addToast({ type: 'success', message: 'Offer created successfully' }));
            return newOffer; // Return for potential image upload
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error creating offer:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Upload images for an offer
export const uploadOfferImages = (offerId: number, files: File[]) => async (dispatch: AppDispatch) => {
    try {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        const res = await api.post(ENDPOINTS.OFFERS.IMAGES(offerId), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (res.data.success) {
            const updatedOffer = res.data.data;
            dispatch(updateOfferAction(updatedOffer));
            dispatch(addToast({ type: 'success', message: 'Images uploaded successfully' }));
            return updatedOffer;
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error uploading images:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    }
};

// Update existing offer
export const updateOffer = (offerId: number, updates: Partial<Omit<Offer, 'id' | 'createdAt'>> & { deletedImageIds?: number[] }) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
        const res = await api.patch(ENDPOINTS.OFFERS.BY_ID(offerId), updates);

        if (res.data.success) {
            const updatedOffer = res.data.data;
            dispatch(updateOfferAction(updatedOffer));
            dispatch(addToast({ type: 'success', message: 'Offer updated successfully' }));
            return updatedOffer;
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error updating offer:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Delete offer
export const deleteOffer = (offerId: number) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.delete(ENDPOINTS.OFFERS.BY_ID(offerId));

        if (res.data.success) {
            dispatch(removeOffer(offerId));
            dispatch(addToast({ type: 'success', message: 'Offer deleted successfully' }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error deleting offer:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    }
};

