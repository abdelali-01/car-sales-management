import { setIsFeching, setUser } from './authSlice';
import { AppDispatch } from '../store';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { addToast } from '../toast/toastSlice';
import { User } from '@/components/auth/SignUpForm';
import { fetchAccounts } from '../accounts/accountHandler';
import api, { getErrorMessage } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export const registerUser = (user: User, clearFrom: () => void) => async (dispatch: AppDispatch) => {
    dispatch(setIsFeching(true));
    try {
        // Uses POST /api/admins to create a new admin
        const res = await api.post(ENDPOINTS.ADMINS.BASE, user);
        if (res.data) {
            dispatch(addToast({ type: 'success', message: 'Your admin is registered successfully' }));
            clearFrom();
        }

    } catch (error: unknown) {
        console.log('Error during registering the user ', error);
        throw error;
    } finally { dispatch(setIsFeching(false)) }
};

export const loggedIn = (user: { email: string, password: string }, router: AppRouterInstance) => async (dispatch: AppDispatch) => {
    dispatch(setIsFeching(true));
    try {
        const res = await api.post(ENDPOINTS.AUTH.LOGIN, user);
        const userLogged = res.data;
        if (userLogged) {
            dispatch(setUser(userLogged));
            router.push('/');
        }
    } catch (error: unknown) {
        console.log('error during the login', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    } finally {
        dispatch(setIsFeching(false));
    }
};

export const checkIfLoggedIn = (pathname: string, router: AppRouterInstance) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.get(ENDPOINTS.AUTH.ME);
        const userLogged = res.data?.user;
        if (userLogged) {
            dispatch(setUser(userLogged));
            // Only redirect to admin if currently on signin page
            if (pathname === '/signin') {
                router.push('/');
            }
        } else {
            // If not logged in and on a protected page, redirect to signin
            if (pathname.startsWith('/')) {
                router.push('/signin');
            }
        }
    } catch (error: unknown) {
        console.log('error during check if logged in', error);
        // If auth check fails and on a protected page, redirect to signin
        if (pathname.startsWith('/')) {
            router.push('/signin');
        }
    }
};

export const getUser = () => async (dispatch: AppDispatch) => {
    try {
        const res = await api.get(ENDPOINTS.AUTH.ME);

        if (res.data.success)
            dispatch(setUser(res.data.user));
    } catch (error: unknown) {
        console.log('error during getting the user', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    }
};

export const updateAccount = (userInfo: User) => async (dispatch: AppDispatch) => {
    try {
        if (!userInfo.id) {
            return dispatch(addToast({ type: 'error', message: 'User ID is required' }));
        }
        // Uses PATCH /api/admins/:id (not in Postman yet, but follows REST convention)
        await api.patch(ENDPOINTS.ADMINS.BY_ID(Number(userInfo.id)), userInfo);

        dispatch(addToast({ type: 'success', message: 'Your Account has been updated successfully' }));
        dispatch(getUser());
        dispatch(fetchAccounts());

    } catch (error: unknown) {
        console.log('error during updating the account', error);
        throw error;
    }
};

export const loggedOut = (router: AppRouterInstance) => async (dispatch: AppDispatch) => {
    try {
        const res = await api.post(ENDPOINTS.AUTH.LOGOUT, {});

        if (res.data.success) {
            dispatch(setUser(null)); // Clear user state
            router.push('/signin');
        }
    } catch (error: unknown) {
        console.log('error during the logout', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    }
};

// Password reset functions - disabled (not implemented in backend yet)
// export const SendEmailReset = ...
// export const sendPasswordReset = ...
export const SendEmailReset = (_email: string, _setState: () => void) => async (_dispatch: AppDispatch) => {
    console.warn('SendEmailReset: Not implemented in backend yet');
};

export const sendPasswordReset = (_password: string, _token: string, _router: AppRouterInstance) => async (_dispatch: AppDispatch) => {
    console.warn('sendPasswordReset: Not implemented in backend yet');
};

// Keep old function name for backward compatibility
export const sendPasswordResset = sendPasswordReset;