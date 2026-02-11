import { createSlice } from "@reduxjs/toolkit";

export interface City {
    id: number;
    communeNameAscii: string;
    wilayaId: number;
    shippingPrices?: {
        home: number;
        desk: number;
    };
    hasDesk?: boolean;
}

export interface shippingPrices {
    home: number;
    desk: number;
}

export interface Wilaya {
    id: number;
    name: string;
    code: string;
    shippingPrices: shippingPrices;
    isActive: boolean;  // Changed from is_active
    freeDelivery?: boolean;  // Free delivery flag for this wilaya
    cities?: City[];
}

const wilayaSlice = createSlice({
    name: 'wilayas',
    initialState: {
        wilayas: null as Wilaya[] | null,
        loading: false as boolean,
        error: null
    },
    reducers: {
        setWilayas: (state, action) => {
            state.wilayas = [...action.payload].sort((a: Wilaya, b: Wilaya) => a.id - b.id);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setWilayas, setLoading, setError } = wilayaSlice.actions;
export default wilayaSlice.reducer;
