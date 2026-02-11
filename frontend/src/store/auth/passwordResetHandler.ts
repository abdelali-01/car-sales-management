import axios from "axios";
import { addToast } from "../toast/toastSlice";
import { AppDispatch } from "../store";

const server = process.env.NEXT_PUBLIC_SERVER;

// Request password reset
export const requestPasswordReset = (email: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.post(`${server}/api/auth/forgot-password`, { email });

        if (res.data) {
            dispatch(addToast({ type: 'success', message: 'Password reset link has been sent to your email.' }));
        }

        return { success: true };
    } catch (error: any) {
        console.log('Error requesting password reset:', error);
        dispatch(addToast({ type: 'error', message: error.response?.data?.message || error.message }));
        return { success: false };
    }
};

// Verify reset token
export const verifyResetToken = (token: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.get(`${server}/api/auth/reset-password/${token}`);

        if (res.data) {
            return { success: true, email: res.data.email };
        }

        return { success: false };
    } catch (error: any) {
        console.log('Error verifying reset token:', error);
        dispatch(addToast({ type: 'error', message: error.response?.data?.message || 'Invalid or expired reset token' }));
        return { success: false };
    }
};

// Reset password with token
export const resetPassword = (token: string, password: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await axios.post(`${server}/api/auth/reset-password/${token}`, { password });

        if (res.data) {
            dispatch(addToast({ type: 'success', message: 'Password reset successfully. You can now log in with your new password.' }));
        }

        return { success: true };
    } catch (error: any) {
        console.log('Error resetting password:', error);
        dispatch(addToast({ type: 'error', message: error.response?.data?.message || error.message }));
        return { success: false };
    }
};