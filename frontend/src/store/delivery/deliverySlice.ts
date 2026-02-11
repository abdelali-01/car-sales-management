import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface DeliverySettings {
    globalFreeDelivery: boolean;
    freeDeliveryThreshold: number;
    isThresholdActive: boolean;
    updatedAt?: string;
}

export interface FreeDeliveryProduct {
    id: number;
    name: string;
    price: string;
    images: string[];
    category: {
        id: number;
        name: string;
    };
}

export interface FreeDeliveryWilaya {
    id: number;
    code: string;
    name: string;
    nameArabic: string;
}

interface DeliveryState {
    settings: DeliverySettings | null;
    freeProducts: FreeDeliveryProduct[];
    freeWilayas: FreeDeliveryWilaya[];
    loadingSettings: boolean;
    loadingProducts: boolean;
    loadingWilayas: boolean;
    error: string | null;
}

const initialState: DeliveryState = {
    settings: null,
    freeProducts: [],
    freeWilayas: [],
    loadingSettings: false,
    loadingProducts: false,
    loadingWilayas: false,
    error: null,
};

const deliverySlice = createSlice({
    name: 'delivery',
    initialState,
    reducers: {
        setDeliverySettings: (state, action: PayloadAction<DeliverySettings>) => {
            state.settings = action.payload;
        },
        setFreeProducts: (state, action: PayloadAction<FreeDeliveryProduct[]>) => {
            state.freeProducts = action.payload;
        },
        setFreeWilayas: (state, action: PayloadAction<FreeDeliveryWilaya[]>) => {
            state.freeWilayas = action.payload;
        },
        setLoadingSettings: (state, action: PayloadAction<boolean>) => {
            state.loadingSettings = action.payload;
        },
        setLoadingProducts: (state, action: PayloadAction<boolean>) => {
            state.loadingProducts = action.payload;
        },
        setLoadingWilayas: (state, action: PayloadAction<boolean>) => {
            state.loadingWilayas = action.payload;
        },
        setDeliveryError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setDeliverySettings,
    setFreeProducts,
    setFreeWilayas,
    setLoadingSettings,
    setLoadingProducts,
    setLoadingWilayas,
    setDeliveryError,
} = deliverySlice.actions;

export default deliverySlice.reducer;
