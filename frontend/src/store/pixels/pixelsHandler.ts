import { addToast } from "../toast/toastSlice";
import { AppDispatch } from "../store";
import { setPixels, setLoading, Pixel } from "./pixelSlice";
import api, { getErrorMessage } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

// Fetch all pixels
export const fetchPixels = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
        const res = await api.get(ENDPOINTS.PIXELS.BASE);
        if (res.data.success) {
            dispatch(setPixels(res.data.pixels));
        }
    } catch (error) {
        console.error('Error fetching pixels:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    } finally {
        dispatch(setLoading(false));
    }
};

// Add new pixel
export const addPixel = (pixel: Omit<Pixel, 'id'>) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.post(ENDPOINTS.PIXELS.BASE, pixel);

        if (res.data.success) {
            dispatch(addToast({ type: 'success', message: 'Pixel has been added successfully' }));
            dispatch(fetchPixels());
        }
    } catch (error) {
        console.error('Error adding pixel:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    }
};

// Update pixel
export const updatePixel = (pixelId: number, pixel: Partial<Pixel>) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.put(ENDPOINTS.PIXELS.BY_ID(pixelId), pixel);

        if (res.data.success) {
            dispatch(addToast({ type: 'success', message: 'Pixel has been updated successfully' }));
            dispatch(fetchPixels());
        }
    } catch (error) {
        console.error('Error updating pixel:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    }
};

// Delete pixel
export const deletePixel = (pixelId: number) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.delete(ENDPOINTS.PIXELS.BY_ID(pixelId));

        if (res.data.success) {
            dispatch(addToast({ type: 'success', message: 'Pixel has been deleted successfully' }));
            dispatch(fetchPixels());
        }
    } catch (error) {
        console.error('Error deleting pixel:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    }
};
