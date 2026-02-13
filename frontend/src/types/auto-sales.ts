/**
 * Bensaoud AUTO — Shared TypeScript Types
 * Centralized type definitions for all auto-sales domain entities
 */

// === Enums ===

export type OfferStatus = 'available' | 'reserved' | 'sold';

export type VisitorStatus = 'new' | 'contacted' | 'interested' | 'converted' | 'lost';

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'canceled';

export type PaymentStatus = 'unpaid' | 'advance' | 'paid';

export type PaymentMethod = 'cash' | 'transfer' | 'cheque';

// === Entities ===

export interface OfferImage {
    id: number;
    offerId: number;
    imageUrl: string;
    publicId: string;
    createdAt?: string;
}

export interface Offer {
    id: number;
    brand: string;
    model: string;
    year: number;
    km: number;
    price: number;
    location: string;
    ownerName: string;
    ownerPhone: string;
    ownerEmail?: string;
    status: OfferStatus;
    images?: OfferImage[];
    createdAt: string;
}

export interface VisitorInterestOffer {
    id: number;
    visitorId: number;
    offerId: number;
    priority: number;
    createdAt: string;
    offer?: Offer;
}

export interface Visitor {
    id: number;
    name: string;
    phone: string;
    email?: string;
    carBrand: string;
    carModel: string;
    budget: number;
    remarks?: string;
    status: VisitorStatus;
    createdAt: string;
    interests?: VisitorInterestOffer[];
}

export interface Order {
    id: number;
    offerId: number;
    visitorId?: number;
    clientId?: number;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    agreedPrice: number;
    deposit: number;
    profit?: number;
    remarks?: string;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    // Nested/populated fields (optional, for display)
    offer?: Offer;
    visitor?: Visitor;
}

export interface Client {
    id: number;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    totalSpent: number;
    remainingBalance: number;
    notes?: string;
    createdAt: string;
}

export interface Payment {
    id: number;
    orderId: number;
    clientId?: number;
    amount: number;
    method: PaymentMethod;
    status?: PaymentStatus;
    notes?: string;
    createdAt: string;
    // Nested/populated fields (optional, for display)
    order?: Order;
    client?: Client;
}

// === API Response Wrappers ===

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

// === Statistics Types ===

export interface OverviewStats {
    totalOffers: number;
    activeOffers: number;
    totalVisitors: number;
    totalOrders: number;
    totalClients: number;
    totalRevenue: number;
}

export interface MonthlySale {
    month: string;
    count: number;
    revenue: number;
}

export interface ConversionRate {
    totalVisitors: number;
    convertedVisitors: number;
    rate: number;
}

export interface OffersByStatus {
    available: number;
    reserved: number;
    sold: number;
}

export interface RevenueStats {
    totalRevenue: number;
    totalProfit: number;
    avgOrderValue: number;
}

export interface ActivityItem {
    id: number;
    type: 'offer' | 'visitor' | 'order' | 'payment';
    description: string;
    timestamp: string;
}
