import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Visitor, VisitorInterestOffer } from "@/types/auto-sales";

interface VisitorsState {
    visitors: Visitor[] | null;
    currentVisitor: Visitor | null;
    totalCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: VisitorsState = {
    visitors: null,
    currentVisitor: null,
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
            if (state.currentVisitor && state.currentVisitor.id === action.payload.id) {
                state.currentVisitor.status = action.payload.status as any;
            }
        },
        setCurrentVisitor: (state, action: PayloadAction<Visitor | null>) => {
            state.currentVisitor = action.payload;
        },
        updateVisitorRemarks: (state, action: PayloadAction<{ id: number, remarks: string }>) => {
            if (state.currentVisitor && state.currentVisitor.id === action.payload.id) {
                state.currentVisitor.remarks = action.payload.remarks;
            }
        },
        updateVisitor: (state, action: PayloadAction<Visitor>) => {
            if (state.currentVisitor && state.currentVisitor.id === action.payload.id) {
                state.currentVisitor = { ...state.currentVisitor, ...action.payload };
            }
            if (state.visitors) {
                const idx = state.visitors.findIndex(v => v.id === action.payload.id);
                if (idx !== -1) {
                    state.visitors[idx] = { ...state.visitors[idx], ...action.payload };
                }
            }
        },
        addInterestToVisitor: (state, action: PayloadAction<VisitorInterestOffer>) => {
            if (state.currentVisitor) {
                if (!state.currentVisitor.interests) {
                    state.currentVisitor.interests = [];
                }
                state.currentVisitor.interests.push(action.payload);
            }
        },
        removeInterestFromVisitor: (state, action: PayloadAction<number>) => {
            if (state.currentVisitor && state.currentVisitor.interests) {
                state.currentVisitor.interests = state.currentVisitor.interests.filter(
                    interest => interest.offerId !== action.payload
                );
            }
        },
        updateInterestPriority: (state, action: PayloadAction<{ offerId: number, priority: number }>) => {
            if (state.currentVisitor && state.currentVisitor.interests) {
                const movingInterest = state.currentVisitor.interests.find(i => i.offerId === action.payload.offerId);

                if (movingInterest) {
                    const oldPriority = movingInterest.priority;
                    const newPriority = action.payload.priority;

                    // Find the interest at the target priority (the one being displaced)
                    const targetInterest = state.currentVisitor.interests.find(i => i.priority === newPriority);

                    // Swap priorities
                    movingInterest.priority = newPriority;
                    if (targetInterest) {
                        targetInterest.priority = oldPriority;
                    }
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
    setCurrentVisitor,
    updateVisitorRemarks,
    updateVisitor,
    addInterestToVisitor,
    removeInterestFromVisitor,
    updateInterestPriority,
    setLoading,
    setError
} = visitorSlice.actions;

export default visitorSlice.reducer;
