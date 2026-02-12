import { addToast } from "../toast/toastSlice";
import { AppDispatch } from "../store";
import { setClients, setCurrentClient, addClient as addClientAction, updateClientFinancials as updateClientFinancialsAction, setLoading, setError } from "./clientSlice";
import { Client } from "@/types/auto-sales";
import api, { getErrorMessage } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

// Fetch single client
export const fetchClient = (id: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
        const res = await api.get(ENDPOINTS.CLIENTS.BY_ID(id));

        if (res.data.success) {
            dispatch(setCurrentClient(res.data.data));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching client:', error);
        dispatch(setError(message));
        dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoading(false));
    }
};

// Fetch all clients with optional name filter
export const fetchClients = (params?: {
    name?: string;
}) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
        const queryParams = new URLSearchParams();
        if (params?.name) queryParams.append('name', params.name);

        const url = queryParams.toString()
            ? `${ENDPOINTS.CLIENTS.BASE}?${queryParams.toString()}`
            : ENDPOINTS.CLIENTS.BASE;

        const res = await api.get(url);

        if (res.data.success) {
            dispatch(setClients({
                clients: res.data.data || [],
                total: res.data.meta.total || 0
            }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching clients:', error);
        dispatch(setError(message));
        dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoading(false));
    }
};

// Update client details
export const updateClient = (id: number, clientData: Partial<Client>) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
        const res = await api.patch(ENDPOINTS.CLIENTS.BY_ID(id), clientData);

        if (res.data.success) {
            const updatedClient = res.data.data;
            dispatch(setCurrentClient(updatedClient)); // Update current client view
            // We should also update the list if it's there, but for now currentClient is key
            dispatch(addToast({ type: 'success', message: 'Client updated successfully' }));
            return updatedClient;
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error updating client:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Create new client
export const createClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'totalSpent' | 'remainingBalance'>) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));

    try {
        const res = await api.post(ENDPOINTS.CLIENTS.BASE, clientData);

        if (res.data.success) {
            const newClient = res.data.data;
            dispatch(addClientAction(newClient));
            dispatch(addToast({ type: 'success', message: 'Client created successfully' }));
            return newClient;
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error creating client:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

// Update client financials
export const updateClientFinancials = (clientId: number, data: { totalSpent?: number, remainingBalance?: number }) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.patch(ENDPOINTS.CLIENTS.FINANCIALS(clientId), data);

        if (res.data.success) {
            const updated = res.data.client;
            dispatch(updateClientFinancialsAction({
                id: clientId,
                totalSpent: updated.totalSpent,
                remainingBalance: updated.remainingBalance
            }));
            dispatch(addToast({ type: 'success', message: 'Client financials updated successfully' }));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error updating client financials:', error);
        dispatch(addToast({ type: 'error', message }));
        throw error;
    }
};
