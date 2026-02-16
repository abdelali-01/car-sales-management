import { addToast } from "../toast/toastSlice";
import { AppDispatch } from "../store";
import {
    setOverviewStats, setLoadingOverview,
    setMonthlySales, setLoadingMonthlySales,
    setConversionRate, setLoadingConversionRate,
    setOffersByStatus, setLoadingOffersByStatus,
    setOrderStatusDistribution, setLoadingOrdersByStatus,
    setRevenue, setLoadingRevenue,
    setRecentActivity, setLoadingRecentActivity,
    setPopularCars, setLoadingPopularCars,
    setError
} from "./statisticsSlice";
import api, { getErrorMessage } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";

// Fetch overview stats
export const fetchOverviewStats = () => async (dispatch: AppDispatch) => {
    dispatch(setLoadingOverview(true));
    dispatch(setError(null));

    try {
        const res = await api.get(ENDPOINTS.STATISTICS.OVERVIEW);

        if (res.data.success) {
            dispatch(setOverviewStats(res.data.data));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching overview stats:', error);
        dispatch(setError(message));
        dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoadingOverview(false));
    }
};

// Fetch monthly sales chart
export const fetchMonthlySales = (year?: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoadingMonthlySales(true));

    try {
        const url = year
            ? `${ENDPOINTS.STATISTICS.MONTHLY_SALES}?year=${year}`
            : ENDPOINTS.STATISTICS.MONTHLY_SALES;

        const res = await api.get(url);

        if (res.data.success) {
            // Backend returns { year: number, data: MonthlySalesData[] }
            dispatch(setMonthlySales(res.data.data.data || []));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching monthly sales:', error);
        dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoadingMonthlySales(false));
    }
};

// Fetch conversion rate
export const fetchConversionRate = () => async (dispatch: AppDispatch) => {
    dispatch(setLoadingConversionRate(true));

    try {
        const res = await api.get(ENDPOINTS.STATISTICS.CONVERSION_RATE);

        if (res.data.success) {
            dispatch(setConversionRate(res.data.data));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching conversion rate:', error);
        dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoadingConversionRate(false));
    }
};

// Fetch offers by status
export const fetchOffersByStatus = () => async (dispatch: AppDispatch) => {
    dispatch(setLoadingOffersByStatus(true));

    try {
        const res = await api.get(ENDPOINTS.STATISTICS.OFFERS_BY_STATUS);

        if (res.data.success) {
            dispatch(setOffersByStatus(res.data.data));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching offers by status:', error);
        // dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoadingOffersByStatus(false));
    }
};

// Fetch orders by status
export const fetchOrdersByStatus = () => async (dispatch: AppDispatch) => {
    dispatch(setLoadingOrdersByStatus(true));

    try {
        const res = await api.get(ENDPOINTS.STATISTICS.ORDERS_BY_STATUS);

        if (res.data.success) {
            dispatch(setOrderStatusDistribution(res.data.data));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching orders by status:', error);
    } finally {
        dispatch(setLoadingOrdersByStatus(false));
    }
};

// Fetch popular cars
export const fetchPopularCars = (limit: number = 5) => async (dispatch: AppDispatch) => {
    dispatch(setLoadingPopularCars(true));

    try {
        const res = await api.get(`${ENDPOINTS.STATISTICS.POPULAR_CARS}?limit=${limit}`);

        if (res.data.success) {
            dispatch(setPopularCars(res.data.data));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching popular cars:', error);
    } finally {
        dispatch(setLoadingPopularCars(false));
    }
};

// Fetch revenue stats
export const fetchRevenueStats = () => async (dispatch: AppDispatch) => {
    dispatch(setLoadingRevenue(true));

    try {
        const res = await api.get(ENDPOINTS.STATISTICS.REVENUE);

        if (res.data.success) {
            dispatch(setRevenue(res.data.data));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching revenue stats:', error);
        dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoadingRevenue(false));
    }
};

// Fetch recent activity
export const fetchRecentActivity = (limit?: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoadingRecentActivity(true));

    try {
        const url = limit
            ? `${ENDPOINTS.STATISTICS.RECENT_ACTIVITY}?limit=${limit}`
            : ENDPOINTS.STATISTICS.RECENT_ACTIVITY;

        const res = await api.get(url);

        if (res.data.success) {
            // Backend returns { recentOrders, recentVisitors, recentPayments }
            // We only need recentOrders for the RecentOrders component
            dispatch(setRecentActivity(res.data.data.recentOrders || []));
        }
    } catch (error) {
        const message = getErrorMessage(error);
        console.error('Error fetching recent activity:', error);
        dispatch(addToast({ type: 'error', message }));
    } finally {
        dispatch(setLoadingRecentActivity(false));
    }
};

// Fetch all dashboard stats in parallel
export const fetchAllDashboardStats = () => async (dispatch: AppDispatch) => {
    try {
        await Promise.all([
            dispatch(fetchOverviewStats()),
            dispatch(fetchMonthlySales()),
            dispatch(fetchConversionRate()),
            dispatch(fetchOffersByStatus()),
            dispatch(fetchOrdersByStatus()),
            dispatch(fetchRevenueStats()),
            dispatch(fetchRecentActivity(5)),
            dispatch(fetchPopularCars(5))
        ]);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
    }
};