import { Admin } from "@/types/auto-sales";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
    user: Admin | null;
    isFetching: boolean
} = {
    user: null,
    isFetching: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsFeching: (state, action) => {
            state.isFetching = action.payload
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isFetching = false
        },
    }
});

export const { setUser, setIsFeching } = authSlice.actions;
export default authSlice.reducer;