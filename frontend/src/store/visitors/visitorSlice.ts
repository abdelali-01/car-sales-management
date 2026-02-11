import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Visitor } from "@/types/auto-sales";

interface VisitorsState {
    visitors: Visitor[] | null;
    totalCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: VisitorsState = {
    visitors: null,
    totalCount: 0,
    loading: false,
    error: null
};

const visitorSlice = createSlice({
    name: 'visitors',
    initialState,
    reducers: {
        setVisitors: (state, action: PayloadAction<{ visitors: Visitor[], total: number }>) => {
            state.visitors = action.payload.visitors;
            state.totalCount = action.payload.total;
        },
        addVisitor: (state, action: PayloadAction<Visitor>) => {
            if (state.visitors) {
                state.visitors.unshift(action.payload);
                state.totalCount += 1;
            } else {
                state.visitors = [action.payload];
                state.totalCount = 1;
            }
        },
        updateVisitorStatus: (state, action: PayloadAction<{ id: number, status: string }>) => {
            if (state.visitors) {
                const visitor = state.visitors.find(v => v.id === action.payload.id);
                if (visitor) {
                    visitor.status = action.payload.status as any;
                }
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
    setVisitors,
    addVisitor,
    updateVisitorStatus,
    setLoading,
    setError
} = visitorSlice.actions;

export default visitorSlice.reducer;
