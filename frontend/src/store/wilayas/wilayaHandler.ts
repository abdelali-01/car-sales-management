import { addToast } from "../toast/toastSlice";
import { AppDispatch } from "../store";
import { setWilayas, setLoading, Wilaya } from "./wilayaSlice";
import api, { getErrorMessage } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

// Fetch all wilayas
export const fetchWilayas = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
        const res = await api.get(ENDPOINTS.WILAYAS.BASE);
        if (res.data.success) {
            dispatch(setWilayas(res.data.wilayas));
        }
    } catch (error) {
        console.error('Error fetching wilayas:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    } finally {
        dispatch(setLoading(false));
    }
};

// Fetch cities for a specific wilaya
export const fetchCities = async (wilayaId: number) => {
    try {
        const res = await api.get(ENDPOINTS.WILAYAS.CITIES(wilayaId));
        if (res.data.success) {
            return res.data.cities;
        }
        return [];
    } catch (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
};

// Update wilaya shipping prices
export const updateWilayaShipping = (wilayaId: number, shippingData: { shippingPrices?: { home?: number; desk?: number } }) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.put(ENDPOINTS.WILAYAS.BY_ID(wilayaId), shippingData);

        if (res.data.success) {
            dispatch(addToast({ type: 'success', message: 'Shipping prices updated successfully' }));
            dispatch(fetchWilayas());
        }
    } catch (error) {
        console.error('Error updating wilaya shipping:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    }
};

// Legacy function for backward compatibility
export const updateWilaya = (wilayaId: number, wilaya: Partial<Wilaya>) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.put(ENDPOINTS.WILAYAS.BY_ID(wilayaId), wilaya);

        if (res.data.success) {
            dispatch(addToast({ type: 'success', message: 'Wilaya has been updated successfully' }));
            dispatch(fetchWilayas());
        }
    } catch (error) {
        console.error('Error updating wilaya:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    }
};

// Update city shipping prices and hasDesk status
export const updateCity = (cityId: number, cityData: {
    shippingPrices: { home: number; desk: number };
    hasDesk: boolean;
}) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.put(`/api/wilayas/cities/${cityId}`, cityData);

        if (res.data.success) {
            dispatch(addToast({ type: 'success', message: 'City updated successfully' }));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating city:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
        return false;
    }
};

// Delete a wilaya and all its cities
export const deleteWilaya = async (wilayaId: number) => {
    try {
        const res = await api.delete(ENDPOINTS.WILAYAS.BY_ID(wilayaId));
        return res.data.success;
    } catch (error) {
        console.error('Error deleting wilaya:', error);
        throw error;
    }
};

// Delete a city
export const deleteCity = async (cityId: number) => {
    try {
        const res = await api.delete(`/api/wilayas/cities/${cityId}`);
        return res.data.success;
    } catch (error) {
        console.error('Error deleting city:', error);
        throw error;
    }
};
