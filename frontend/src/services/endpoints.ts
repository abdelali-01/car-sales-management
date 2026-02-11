/**
 * API Endpoints - Centralized URL constants matching Bensaoud AUTO API
 */

export const ENDPOINTS = {
    // Auth Module
    AUTH: {
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        ME: '/api/auth/me',
    },

    // Admins Module
    ADMINS: {
        BASE: '/api/admins',
        BY_ID: (id: number) => `/api/admins/${id}`,
    },

    // Offers Module (Car Listings)
    OFFERS: {
        BASE: '/api/offers',                                    // GET (list, ?page&limit&status&brand), POST (create)
        BY_ID: (id: number) => `/api/offers/${id}`,             // GET, PATCH, DELETE
        IMAGES: (id: number) => `/api/offers/${id}/images`,     // POST (formdata: images[])
    },

    // Visitors Module (Leads)
    VISITORS: {
        BASE: '/api/visitors',                                  // GET (?page&limit&status), POST
        STATUS: (id: number) => `/api/visitors/${id}/status`,   // PATCH ({ status })
    },

    // Orders Module (Deals)
    ORDERS: {
        BASE: '/api/orders',                                    // GET (?status), POST
        CONFIRM: (id: number) => `/api/orders/${id}/confirm`,   // POST
        COMPLETE: (id: number) => `/api/orders/${id}/complete`, // POST
        CANCEL: (id: number) => `/api/orders/${id}/cancel`,     // POST
    },

    // Clients Module
    CLIENTS: {
        BASE: '/api/clients',                                   // GET (?name), POST
        FINANCIALS: (id: number) => `/api/clients/${id}/financials`, // PATCH
    },

    // Payments Module
    PAYMENTS: {
        BASE: '/api/payments',                                  // GET (?status&method), POST
        MARK_PAID: (id: number) => `/api/payments/${id}/mark-paid`, // POST
        BY_ORDER: (orderId: number) => `/api/payments/order/${orderId}`, // GET
        BY_CLIENT: (clientId: number) => `/api/payments/client/${clientId}`, // GET
    },

    // Statistics Module
    STATISTICS: {
        OVERVIEW: '/api/statistics/overview',
        MONTHLY_SALES: '/api/statistics/monthly-sales',         // GET (?year)
        CONVERSION_RATE: '/api/statistics/conversion-rate',
        OFFERS_BY_STATUS: '/api/statistics/offers-by-status',
        REVENUE: '/api/statistics/revenue',
        RECENT_ACTIVITY: '/api/statistics/recent-activity',     // GET (?limit)
    },
} as const;

export default ENDPOINTS;
