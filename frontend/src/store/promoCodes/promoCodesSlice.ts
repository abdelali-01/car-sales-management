import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PromoCode {
    id?: number;
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';  // Maps to backend's PromoType enum
    validFrom: string;  // ISO date string
    validUntil: string;  // ISO date string
    isActive: boolean;
    usageLimit?: number;
    usageCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

interface PromoCodesState {
    promoCodes: PromoCode[] | null;
    loading: boolean;
    error: string | null;
}

const initialState: PromoCodesState = {
    promoCodes: null,
    loading: false,
    error: null
};

const promoCodesSlice = createSlice({
    name: 'promoCodes',
    initialState,
    reducers: {
        setPromoCodes: (state, action: PayloadAction<PromoCode[]>) => {
            state.promoCodes = action.payload;
        },
        addPromoCode: (state, action: PayloadAction<PromoCode>) => {
            if (state.promoCodes) {
                state.promoCodes.push(action.payload);
            } else {
                state.promoCodes = [action.payload];
            }
        },
        updatePromoCode: (state, action: PayloadAction<PromoCode>) => {
            if (state.promoCodes) {
                const index = state.promoCodes.findIndex(code => code.id === action.payload.id);
                if (index !== -1) {
                    state.promoCodes[index] = action.payload;
                }
            }
        },
        deletePromoCode: (state, action: PayloadAction<number>) => {
            if (state.promoCodes) {
                state.promoCodes = state.promoCodes.filter(code => code.id !== action.payload);
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

export const {
    setPromoCodes,
    addPromoCode,
    updatePromoCode,
    deletePromoCode,
    setLoading,
    setError
} = promoCodesSlice.actions;

export default promoCodesSlice.reducer;
