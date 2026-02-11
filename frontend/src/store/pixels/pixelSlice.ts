import { createSlice } from "@reduxjs/toolkit";

export interface Pixel {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
}

const pixelSlice = createSlice({
    name: 'pixels',
    initialState: {
        pixels: null as Pixel[] | null,
        loading: false as boolean,
        error: null
    },
    reducers: {
        setPixels: (state, action) => {
            state.pixels = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setPixels, setLoading, setError } = pixelSlice.actions;
export default pixelSlice.reducer;
