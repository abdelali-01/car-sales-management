import { configureStore } from "@reduxjs/toolkit"
import authReducer from './auth/authSlice'
import toastReducer from './toast/toastSlice';
import accountReducer from './accounts/accountsSlice';
import offersReducer from './offers/offerSlice';
import visitorsReducer from './visitors/visitorSlice';
import ordersReducer from './orders/orderSlice';
import clientsReducer from './clients/clientSlice';
import paymentsReducer from './payments/paymentSlice';
import statisticsReducer from './statistics/statisticsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        toast: toastReducer,
        accounts: accountReducer,
        offers: offersReducer,
        visitors: visitorsReducer,
        orders: ordersReducer,
        clients: clientsReducer,
        payments: paymentsReducer,
        statistics: statisticsReducer,
    }
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;