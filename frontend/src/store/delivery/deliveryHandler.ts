import { addToast } from "../toast/toastSlice";
import { AppDispatch } from "../store";
import {
    setDeliverySettings,
    setFreeProducts,
    setFreeWilayas,
    setLoadingSettings,
    setLoadingProducts,
    setLoadingWilayas,
    DeliverySettings,
} from "./deliverySlice";
import api, { getErrorMessage } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

// Fetch delivery settings
export const fetchDeliverySettings = () => async (dispatch: AppDispatch) => {
    dispatch(setLoadingSettings(true));

    try {
        const res = await api.get(ENDPOINTS.DELIVERY.SETTINGS);
        if (res.data.success) {
            dispatch(setDeliverySettings(res.data.settings));
        }
    } catch (error) {
        console.error('Error fetching delivery settings:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    } finally {
        dispatch(setLoadingSettings(false));
    }
};

// Update delivery settings
export const updateDeliverySettings = (settings: Partial<DeliverySettings>) => async (dispatch: AppDispatch) => {
    dispatch(setLoadingSettings(true));

    try {
        const res = await api.put(ENDPOINTS.DELIVERY.SETTINGS, settings);
        if (res.data.success) {
            dispatch(setDeliverySettings(res.data.settings));
            dispatch(addToast({ type: 'success', message: 'Delivery settings updated successfully' }));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating delivery settings:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
        return false;
    } finally {
        dispatch(setLoadingSettings(false));
    }
};

// Fetch free delivery products
export const fetchFreeDeliveryProducts = () => async (dispatch: AppDispatch) => {
    dispatch(setLoadingProducts(true));

    try {
        const res = await api.get(ENDPOINTS.DELIVERY.FREE_PRODUCTS);
        if (res.data.success) {
            dispatch(setFreeProducts(res.data.products));
        }
    } catch (error) {
        console.error('Error fetching free delivery products:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    } finally {
        dispatch(setLoadingProducts(false));
    }
};

// Fetch free delivery wilayas
export const fetchFreeDeliveryWilayas = () => async (dispatch: AppDispatch) => {
    dispatch(setLoadingWilayas(true));

    try {
        const res = await api.get(ENDPOINTS.DELIVERY.FREE_WILAYAS);
        if (res.data.success) {
            dispatch(setFreeWilayas(res.data.wilayas));
        }
    } catch (error) {
        console.error('Error fetching free delivery wilayas:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    } finally {
        dispatch(setLoadingWilayas(false));
    }
};
