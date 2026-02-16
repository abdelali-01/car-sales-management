import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Admin } from '@/types/auto-sales';

interface AdminsState {
    admins: Admin[];
    currentAdmin: Admin | null;
    loading: boolean;
    error: string | null;
}

const initialState: AdminsState = {
    admins: [],
    currentAdmin: null,
    loading: false,
    error: null,
};

const adminsSlice = createSlice({
    name: 'admins',
    initialState,
    reducers: {
        setAdmins: (state, action: PayloadAction<Admin[]>) => {
            state.admins = action.payload;
            state.loading = false;
            state.error = null;
        },
        setCurrentAdmin: (state, action: PayloadAction<Admin | null>) => {
            state.currentAdmin = action.payload;
            state.loading = false;
            state.error = null;
        },
        addAdmin: (state, action: PayloadAction<Admin>) => {
            state.admins.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        updateAdminInList: (state, action: PayloadAction<Admin>) => {
            const index = state.admins.findIndex(a => a.id === action.payload.id);
            if (index !== -1) {
                state.admins[index] = action.payload;
            }
            state.loading = false;
            state.error = null;
        },
        removeAdmin: (state, action: PayloadAction<number>) => {
            state.admins = state.admins.filter(a => a.id !== action.payload);
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setAdmins,
    setCurrentAdmin,
    addAdmin,
    updateAdminInList,
    removeAdmin,
    setLoading,
    setError,
    clearError,
} = adminsSlice.actions;

export default adminsSlice.reducer;
