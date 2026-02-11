import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OverviewStats, MonthlySale, ConversionRate, OffersByStatus, RevenueStats, ActivityItem } from "@/types/auto-sales";

interface StatisticsState {
    // Overview stats
    overview: OverviewStats | null;

    // Monthly sales chart
    monthlySales: MonthlySale[];

    // Conversion rate
    conversionRate: ConversionRate | null;

    // Offers by status distribution
    offersByStatus: OffersByStatus | null;

    // Revenue stats
    revenue: RevenueStats | null;

    // Recent activity
    recentActivity: ActivityItem[];

    // Per-section loading states
    loadingOverview: boolean;
    loadingMonthlySales: boolean;
    loadingConversionRate: boolean;
    loadingOffersByStatus: boolean;
    loadingRevenue: boolean;
    loadingRecentActivity: boolean;

    error: string | null;
}

const initialState: StatisticsState = {
    overview: null,
    monthlySales: [],
    conversionRate: null,
    offersByStatus: null,
    revenue: null,
    recentActivity: [],
    loadingOverview: false,
    loadingMonthlySales: false,
    loadingConversionRate: false,
    loadingOffersByStatus: false,
    loadingRevenue: false,
    loadingRecentActivity: false,
    error: null
};

const statisticsSlice = createSlice({
    name: 'statistics',
    initialState,
    reducers: {
        // Overview stats
        setOverviewStats: (state, action: PayloadAction<OverviewStats>) => {
            state.overview = action.payload;
            state.loadingOverview = false;
        },
        setLoadingOverview: (state, action: PayloadAction<boolean>) => {
            state.loadingOverview = action.payload;
        },

        // Monthly sales
        setMonthlySales: (state, action: PayloadAction<MonthlySale[]>) => {
            state.monthlySales = action.payload;
            state.loadingMonthlySales = false;
        },
        setLoadingMonthlySales: (state, action: PayloadAction<boolean>) => {
            state.loadingMonthlySales = action.payload;
        },

        // Conversion rate
        setConversionRate: (state, action: PayloadAction<ConversionRate>) => {
            state.conversionRate = action.payload;
            state.loadingConversionRate = false;
        },
        setLoadingConversionRate: (state, action: PayloadAction<boolean>) => {
            state.loadingConversionRate = action.payload;
        },

        // Offers by status
        setOffersByStatus: (state, action: PayloadAction<OffersByStatus>) => {
            state.offersByStatus = action.payload;
            state.loadingOffersByStatus = false;
        },
        setLoadingOffersByStatus: (state, action: PayloadAction<boolean>) => {
            state.loadingOffersByStatus = action.payload;
        },

        // Revenue stats
        setRevenue: (state, action: PayloadAction<RevenueStats>) => {
            state.revenue = action.payload;
            state.loadingRevenue = false;
        },
        setLoadingRevenue: (state, action: PayloadAction<boolean>) => {
            state.loadingRevenue = action.payload;
        },

        // Recent activity
        setRecentActivity: (state, action: PayloadAction<ActivityItem[]>) => {
            state.recentActivity = action.payload;
            state.loadingRecentActivity = false;
        },
        setLoadingRecentActivity: (state, action: PayloadAction<boolean>) => {
            state.loadingRecentActivity = action.payload;
        },

        // Error
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

export const {
    setOverviewStats,
    setLoadingOverview,
    setMonthlySales,
    setLoadingMonthlySales,
    setConversionRate,
    setLoadingConversionRate,
    setOffersByStatus,
    setLoadingOffersByStatus,
    setRevenue,
    setLoadingRevenue,
    setRecentActivity,
    setLoadingRecentActivity,
    setError
} = statisticsSlice.actions;

export default statisticsSlice.reducer;