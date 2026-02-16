import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "@/types/auto-sales";

interface OrdersState {
    orders: Order[] | null;
    totalCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: OrdersState = {
    orders: null,
    totalCount: 0,
    loading: false,
    error: null
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrders: (state, action: PayloadAction<{ orders: Order[], total: number }>) => {
            state.orders = action.payload.orders;
            state.totalCount = action.payload.total;
        },
        addOrder: (state, action: PayloadAction<Order>) => {
            if (state.orders) {
                state.orders.unshift(action.payload);
                state.totalCount += 1;
            } else {
                state.orders = [action.payload];
                state.totalCount = 1;
            }
        },
        updateOrderStatus: (state, action: PayloadAction<{ id: number, status: string, updatedAt: string }>) => {
            if (state.orders) {
                const order = state.orders.find(o => o.id === action.payload.id);
                if (order) {
                    order.status = action.payload.status as any;
                    order.updatedAt = action.payload.updatedAt;
                }
            }
        },
        updateOrder: (state, action: PayloadAction<Order>) => {
            if (state.orders) {
                const index = state.orders.findIndex(o => o.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                } else {
                    // Start: Update to add if not found
                    state.orders.push(action.payload);
                    state.totalCount += 1;
                    // End: Update
                }
            } else {
                // Initialize if null
                state.orders = [action.payload];
                state.totalCount = 1;
            }
        },
        removeOrder: (state, action: PayloadAction<number>) => {
            if (state.orders) {
                state.orders = state.orders.filter(o => o.id !== action.payload);
                state.totalCount -= 1;
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
    setOrders,
    addOrder,
    updateOrderStatus,
    updateOrder,
    removeOrder,
    setLoading,

    setError
} = orderSlice.actions;

export default orderSlice.reducer;