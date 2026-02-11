import { AppDispatch } from '../store';
import axios, { AxiosError } from 'axios';
import {
    setLoading,
    setError,
    setItems,
    addItem,
    updateItem,
    removeItem
} from './calendarSlice';

interface CalendarItemData {
    title: string;
    startDate: string;
    endDate: string;
    level: string;
}

interface ErrorResponse {
    message: string;
}

const server = process.env.NEXT_PUBLIC_SERVER;

export const handleFetchCalendarItems = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${server}/api/calendar`, {
            withCredentials: true
        });
        console.log(response);
        dispatch(setItems(response.data));
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        dispatch(setError(axiosError.response?.data?.message || 'Failed to fetch calendar items'));
    } finally {
        dispatch(setLoading(false));
    }
};

export const handleCreateCalendarItem = (itemData: CalendarItemData) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.post(`${server}/api/calendar`, itemData, {
            withCredentials: true
        });
        dispatch(addItem(response.data));
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        dispatch(setError(axiosError.response?.data?.message || 'Failed to create calendar item'));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

export const handleUpdateCalendarItem = (id: string, itemData: Partial<CalendarItemData>) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.put(`${server}/api/calendar/${id}`, itemData, {
            withCredentials: true
        });
        dispatch(updateItem(response.data));
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        dispatch(setError(axiosError.response?.data?.message || 'Failed to update calendar item'));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};

export const handleDeleteCalendarItem = (id: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true));
        await axios.delete(`${server}/api/calendar/${id}`, {
            withCredentials: true
        });
        dispatch(removeItem(id));
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        dispatch(setError(axiosError.response?.data?.message || 'Failed to delete calendar item'));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
};
