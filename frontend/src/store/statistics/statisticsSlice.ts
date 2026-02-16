import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OverviewStats, MonthlySale, ConversionRate, OffersByStatus, RevenueStats, ActivityItem } from "@/types/auto-sales";

export interface MonthlySalesData {
    month: number;
    count: number;
    revenue: number;
    profit: number;
}

export interface PopularCar {
    name: string;
    brand: string;
    model: string;
    count: number;
}

interface StatisticsState {
    // Overview stats
    overview_stats: any;

    // Monthly sales chart
    monthly_sales_chart: number[]; // Array of revenues
    monthly_profit_chart: number[]; // Array of profits
    monthly_orders_chart: number[]; // Array of order counts

    // Conversion rate
    conversion_rate: any;

    // Offers by status distribution
    offers_by_status: any[];

    // Order status distribution
    order_status_distribution: Record<string, number>;

    // Revenue stats
    revenue_stats: any;

    // Recent activity / orders
    recent_orders: any[];

    // Popular cars
    popular_cars: PopularCar[];

    // Computed for ease of use in Dashboard
    monthly_income: number;
    monthly_profit: number;
    monthly_orders: number;
    total_products: number;
    pending_orders: number;
    total_orders: number;

    // Per-section loading states
    loadingOverview: boolean;
    loadingMonthlySales: boolean;
    loadingConversionRate: boolean;
    loadingOffersByStatus: boolean;
    loadingOrdersByStatus: boolean; // New loader
    loadingRevenue: boolean;
    loadingRecentActivity: boolean;
    loadingCharts: boolean;
    loadingProducts: boolean; // Reused for popular cars
    loadingOrders: boolean; // Reused for recent orders

    error: string | null;
}

const initialState: StatisticsState = {
    overview_stats: null,
    monthly_sales_chart: [],
    monthly_profit_chart: [],
    monthly_orders_chart: [],
    conversion_rate: null,
    offers_by_status: [],
    order_status_distribution: {},
    revenue_stats: null,
    recent_orders: [],
    popular_cars: [],

    monthly_income: 0,
    monthly_profit: 0,
    monthly_orders: 0,
    total_products: 0,
    pending_orders: 0,
    total_orders: 0,

    loadingOverview: false,
    loadingMonthlySales: false,
    loadingConversionRate: false,
    loadingOffersByStatus: false,
    loadingOrdersByStatus: false,
    loadingRevenue: false,
    loadingRecentActivity: false,
    loadingCharts: false,
    loadingProducts: false,
    loadingOrders: false,

    error: null,
};

const statisticsSlice = createSlice({
    name: 'statistics',
    initialState,
    reducers: {
        // Overview stats
        setOverviewStats: (state, action: PayloadAction<any>) => {
            state.overview_stats = action.payload;
            // Extract computed values from the nested structure
            state.total_products = action.payload.offers?.available || 0;
            state.pending_orders = action.payload.orders?.pending || 0;
            state.total_orders = action.payload.orders?.total || 0;
            state.loadingOverview = false;
        },
        setLoadingOverview: (state, action: PayloadAction<boolean>) => {
            state.loadingOverview = action.payload;
        },

        // Monthly sales
        setMonthlySales: (state, action: PayloadAction<MonthlySalesData[]>) => {
            // Extract chart data (revenues, profits, and order counts)
            state.monthly_sales_chart = action.payload.map(d => d.revenue);
            state.monthly_profit_chart = action.payload.map(d => d.profit);
            state.monthly_orders_chart = action.payload.map(d => d.count);

            // Get current month stats (assuming last element is December, we need current month actual)
            // Or usually we display the data for the *current* month.
            // Let's find the entry for the current month.
            const currentMonthIndex = new Date().getMonth(); // 0-11
            const currentMonthData = action.payload.find(d => d.month === currentMonthIndex + 1);

            if (currentMonthData) {
                state.monthly_income = currentMonthData.revenue;
                state.monthly_profit = currentMonthData.profit;
                state.monthly_orders = currentMonthData.count;
            } else {
                state.monthly_income = 0;
                state.monthly_profit = 0;
                state.monthly_orders = 0;
            }
            state.loadingMonthlySales = false;
            state.loadingCharts = false;
        },
        setLoadingMonthlySales: (state, action: PayloadAction<boolean>) => {
            state.loadingMonthlySales = action.payload;
            state.loadingCharts = action.payload; // Also update general charts loader
        },

        // Conversion rate
        setConversionRate: (state, action: PayloadAction<ConversionRate>) => {
            state.conversion_rate = action.payload;
            state.loadingConversionRate = false;
        },
        setLoadingConversionRate: (state, action: PayloadAction<boolean>) => {
            state.loadingConversionRate = action.payload;
        },

        // Offers by status
        setOffersByStatus: (state, action: PayloadAction<any[]>) => {
            state.offers_by_status = action.payload;
            state.loadingOffersByStatus = false;
        },
        setLoadingOffersByStatus: (state, action: PayloadAction<boolean>) => {
            state.loadingOffersByStatus = action.payload;
        },

        // Order status distribution
        setOrderStatusDistribution: (state, action: PayloadAction<Record<string, number>>) => {
            state.order_status_distribution = action.payload;
            // Calculate total orders
            state.total_orders = Object.values(action.payload).reduce((acc, count) => acc + count, 0);
            state.loadingOrdersByStatus = false;
        },
        setLoadingOrdersByStatus: (state, action: PayloadAction<boolean>) => {
            state.loadingOrdersByStatus = action.payload;
        },

        // Revenue stats
        setRevenue: (state, action: PayloadAction<RevenueStats>) => {
            state.revenue_stats = action.payload;
            state.loadingRevenue = false;
        },
        setLoadingRevenue: (state, action: PayloadAction<boolean>) => {
            state.loadingRevenue = action.payload;
        },

        // Recent activity / orders
        setRecentActivity: (state, action: PayloadAction<ActivityItem[]>) => {
            state.recent_orders = action.payload;
            state.loadingRecentActivity = false;
        },
        setLoadingRecentActivity: (state, action: PayloadAction<boolean>) => {
            state.loadingRecentActivity = action.payload;
        },

        // Popular cars
        setPopularCars: (state, action: PayloadAction<PopularCar[]>) => {
            state.popular_cars = action.payload;
            state.loadingProducts = false;
        },
        setLoadingPopularCars: (state, action: PayloadAction<boolean>) => {
            state.loadingProducts = action.payload; // Reuse product loader for cars
        },

        // Error
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

export const {
    setOverviewStats, setLoadingOverview,
    setMonthlySales, setLoadingMonthlySales,
    setConversionRate, setLoadingConversionRate,
    setOffersByStatus, setLoadingOffersByStatus,
    setOrderStatusDistribution, setLoadingOrdersByStatus,
    setRevenue, setLoadingRevenue,
    setRecentActivity, setLoadingRecentActivity,
    setPopularCars, setLoadingPopularCars,
    setError
} = statisticsSlice.actions;

export default statisticsSlice.reducer;