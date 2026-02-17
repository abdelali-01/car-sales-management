import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Admin, CreateAdminDto, UpdateAdminDto } from '@/types/auto-sales';
import {
    setAdmins,
    setCurrentAdmin,
    addAdmin,
    updateAdminInList,
    removeAdmin,
    setLoading,
    setError,
} from './adminsSlice';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER || 'http://localhost:5000/api';

// Fetch all admins
export const fetchAdmins = createAsyncThunk(
    'admins/fetchAll',
    async (_, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const response = await axios.get<Admin[]>(`${API_BASE_URL}/admins`, {
                withCredentials: true,
            });
            dispatch(setAdmins(response.data));
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch admins';
            dispatch(setError(errorMessage));
            throw error;
        }
    }
);

// Fetch admin by ID
export const fetchAdminById = createAsyncThunk(
    'admins/fetchById',
    async (id: number, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const response = await axios.get<Admin>(`${API_BASE_URL}/admins/${id}`, {
                withCredentials: true,
            });
            dispatch(setCurrentAdmin(response.data));
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch admin';
            dispatch(setError(errorMessage));
            throw error;
        }
    }
);

// Create admin
export const createAdmin = createAsyncThunk(
    'admins/create',
    async (data: CreateAdminDto, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const response = await axios.post<Admin>(`${API_BASE_URL}/admins`, data, {
                withCredentials: true,
            });
            dispatch(addAdmin(response.data));
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to create admin';
            dispatch(setError(errorMessage));
            throw error;
        }
    }
);

// Update admin
export const updateAdmin = createAsyncThunk(
    'admins/update',
    async ({ id, data }: { id: number; data: UpdateAdminDto }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const response = await axios.patch<Admin>(
                `${API_BASE_URL}/admins/${id}`,
                data,
                { withCredentials: true }
            );
            dispatch(updateAdminInList(response.data));
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update admin';
            dispatch(setError(errorMessage));
            throw error;
        }
    }
);

// Delete admin
export const deleteAdmin = createAsyncThunk(
    'admins/delete',
    async (id: number, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            await axios.delete(`${API_BASE_URL}/admins/${id}`, {
                withCredentials: true,
            });
            dispatch(removeAdmin(id));
            return id;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete admin';
            dispatch(setError(errorMessage));
            throw error;
        }
    }
);
