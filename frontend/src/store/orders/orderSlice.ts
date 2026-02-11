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
    setLoading,
    setError
} = orderSlice.actions;

export default orderSlice.reducer;