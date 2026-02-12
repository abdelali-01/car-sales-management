import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Client } from "@/types/auto-sales";

interface ClientsState {
    clients: Client[] | null;
    totalCount: number;
    loading: boolean;
    error: string | null;
    currentClient: Client | null;
}

const initialState: ClientsState = {
    clients: null,
    totalCount: 0,
    loading: false,
    error: null,
    currentClient: null
};

const clientSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        setClients: (state, action: PayloadAction<{ clients: Client[], total: number }>) => {
            state.clients = action.payload.clients;
            state.totalCount = action.payload.total;
        },
        setCurrentClient: (state, action: PayloadAction<Client | null>) => {
            state.currentClient = action.payload;
        },
        addClient: (state, action: PayloadAction<Client>) => {
            if (state.clients) {
                state.clients.unshift(action.payload);
                state.totalCount += 1;
            } else {
                state.clients = [action.payload];
                state.totalCount = 1;
            }
        },
        updateClientFinancials: (state, action: PayloadAction<{ id: number, totalSpent: number, remainingBalance: number }>) => {
            if (state.clients) {
                const client = state.clients.find(c => c.id === action.payload.id);
                if (client) {
                    client.totalSpent = action.payload.totalSpent;
                    client.remainingBalance = action.payload.remainingBalance;
                }
            }
            if (state.currentClient && state.currentClient.id === action.payload.id) {
                state.currentClient.totalSpent = action.payload.totalSpent;
                state.currentClient.remainingBalance = action.payload.remainingBalance;
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
    setClients,
    setCurrentClient,
    addClient,
    updateClientFinancials,
    setLoading,
    setError
} = clientSlice.actions;

export default clientSlice.reducer;
