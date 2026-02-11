import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Offer } from "@/types/auto-sales";

interface OffersState {
    offers: Offer[] | null;
    currentOffer: Offer | null;
    totalCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: OffersState = {
    offers: null,
    currentOffer: null,
    totalCount: 0,
    loading: false,
    error: null
};

const offerSlice = createSlice({
    name: 'offers',
    initialState,
    reducers: {
        setOffers: (state, action: PayloadAction<{ offers: Offer[], total: number }>) => {
            state.offers = action.payload.offers;
            state.totalCount = action.payload.total;
        },
        setCurrentOffer: (state, action: PayloadAction<Offer | null>) => {
            state.currentOffer = action.payload;
        },
        addOffer: (state, action: PayloadAction<Offer>) => {
            if (state.offers) {
                state.offers.unshift(action.payload);
                state.totalCount += 1;
            } else {
                state.offers = [action.payload];
                state.totalCount = 1;
            }
        },
        updateOffer: (state, action: PayloadAction<Offer>) => {
            if (state.offers) {
                const index = state.offers.findIndex(o => o.id === action.payload.id);
                if (index !== -1) {
                    state.offers[index] = action.payload;
                }
            }
            if (state.currentOffer?.id === action.payload.id) {
                state.currentOffer = action.payload;
            }
        },
        removeOffer: (state, action: PayloadAction<number>) => {
            if (state.offers) {
                state.offers = state.offers.filter(o => o.id !== action.payload);
                state.totalCount = Math.max(0, state.totalCount - 1);
            }
            if (state.currentOffer?.id === action.payload) {
                state.currentOffer = null;
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
    setOffers,
    setCurrentOffer,
    addOffer,
    updateOffer,
    removeOffer,
    setLoading,
    setError
} = offerSlice.actions;

export default offerSlice.reducer; 