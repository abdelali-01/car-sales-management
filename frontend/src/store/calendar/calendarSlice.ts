import { createSlice } from "@reduxjs/toolkit";

interface CalendarItem {
    _id: string;
    title: string;
    startDate: string;
    endDate: string;
    level: string;
}

interface CalendarState {
    items: CalendarItem[];
    loading: boolean;
    error: string | null;
}

const initialState: CalendarState = {
    items: [],
    loading: false,
    error: null
};

const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setItems: (state, action) => {
            state.items = action.payload;
        },
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        updateItem: (state, action) => {
            const index = state.items.findIndex(item => item._id === action.payload._id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload);
        },
        clearError: (state) => {
            state.error = null;
        }
    }
});

export const {
    setLoading,
    setError,
    setItems,
    addItem,
    updateItem,
    removeItem,
    clearError
} = calendarSlice.actions;

export default calendarSlice.reducer;
