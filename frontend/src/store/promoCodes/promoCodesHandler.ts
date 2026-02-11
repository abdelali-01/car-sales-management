import { addToast } from "../toast/toastSlice";
import { AppDispatch } from "../store";
import { setPromoCodes, addPromoCode as addPromoCodeAction, updatePromoCode as updatePromoCodeAction, deletePromoCode as deletePromoCodeAction, setLoading, PromoCode } from "./promoCodesSlice";
import api, { getErrorMessage } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

// Fetch all promo codes
export const fetchPromoCodes = () => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await api.get(ENDPOINTS.PROMO_CODES.BASE);
        if (res.data.success) {
            dispatch(setPromoCodes(res.data.promoCodes));
        }
    } catch (error) {
        console.error('Error fetching promo codes:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    } finally {
        dispatch(setLoading(false));
    }
};

// Create new promo code
export const createPromoCode = (promoCode: Omit<PromoCode, 'id'>) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.post(ENDPOINTS.PROMO_CODES.BASE, promoCode);
        if (res.data.success) {
            dispatch(addPromoCodeAction(res.data.promoCode));
            dispatch(addToast({ type: 'success', message: 'Promo code created successfully' }));
        }
    } catch (error) {
        console.error('Error creating promo code:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    }
};

// Update promo code
export const updatePromoCode = (id: number, updates: Partial<PromoCode>) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.put(ENDPOINTS.PROMO_CODES.BY_ID(id), updates);
        if (res.data.success) {
            dispatch(updatePromoCodeAction(res.data.promoCode));
            dispatch(addToast({ type: 'success', message: 'Promo code updated successfully' }));
        }
    } catch (error) {
        console.error('Error updating promo code:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    }
};

// Delete promo code
export const deletePromoCode = (id: number) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.delete(ENDPOINTS.PROMO_CODES.BY_ID(id));
        if (res.data.success) {
            dispatch(deletePromoCodeAction(id));
            dispatch(addToast({ type: 'success', message: 'Promo code deleted successfully' }));
        }
    } catch (error) {
        console.error('Error deleting promo code:', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    }
};

// Validate promo code for checkout
export const validatePromoCode = async (code: string): Promise<{ valid: boolean; promoCode?: PromoCode; message?: string; discount?: number; type?: string }> => {
    try {
        const res = await api.get(ENDPOINTS.PROMO_CODES.VALIDATE(code));
        if (res.data.success) {
            return {
                valid: true,
                discount: res.data.discount,
                type: res.data.type
            };
        }
        return {
            valid: false,
            message: res.data.message || 'Invalid promo code'
        };
    } catch (error) {
        console.error('Error validating promo code:', error);
        return {
            valid: false,
            message: getErrorMessage(error)
        };
    }
};
