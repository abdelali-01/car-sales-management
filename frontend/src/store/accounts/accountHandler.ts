import { addToast } from "../toast/toastSlice";
import { AppDispatch } from "../store";
import { setAccounts } from "./accountsSlice";
import api, { getErrorMessage } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

export const fetchAccounts = () => async (dispatch: AppDispatch) => {
    try {
        // Uses GET /api/admins
        const res = await api.get(ENDPOINTS.ADMINS.BASE);

        if (res.data) {
            // The backend may return { data: [...] } or { admins: [...] } or an array directly
            const admins = res.data.data || res.data.admins || res.data;
            dispatch(setAccounts(Array.isArray(admins) ? admins : []));
        }
    } catch (error: unknown) {
        console.log('error during fetching the accounts', error);
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    }
}

export const deleteAccounts = (id: string) => async (dispatch: AppDispatch) => {
    try {
        // Uses DELETE /api/admins/:id
        await api.delete(ENDPOINTS.ADMINS.BY_ID(Number(id)));
        dispatch(addToast({ type: 'success', message: 'Account has been deleted.' }));

        dispatch(fetchAccounts());

    } catch (error: unknown) {
        console.log('error deleting account', error)
        dispatch(addToast({ type: 'error', message: getErrorMessage(error) }));
    }
}