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
export type OrderType = 'inside' | 'outside';
export type ProcessStatus = 'pending' | 'transition' | 'paper_prepare' | 'in_delivery' | 'in_the_port';

export type AdminRole = 'admin' | 'super_admin';


// === Entities ===

export interface OfferImage {
    id: number;
    offerId: number;
    imageUrl: string;
    publicId: string;
    createdAt?: string;
}

export interface OrderedCar {
    id: number;
    brand: string;
    model: string;
    year: number;
    color: string;
    vin?: string;
    description?: string;
    orderId: number;
    createdAt: string;
    updatedAt: string;
}

export interface OrderDocument {

    id: number;
    name: string;
    url: string;
    type?: string;
    orderId: number;
    createdAt: string;
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
    remarks: string;
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
    offerId?: number;
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
    type: OrderType;
    processStatus: ProcessStatus;
    deliveryCompany?: string;
    containerId?: string;
    passportImage?: string;
    documents?: OrderDocument[];
    createdAt: string;
    updatedAt: string;
    // Nested/populated fields (optional, for display)
    offer?: Offer;
    orderedCar?: OrderedCar;
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

// === Admin Types ===

export interface Admin {
    id: number;
    name: string;
    email: string;
    role: AdminRole;
    createdAt: string;
}

export interface CreateAdminDto {
    name: string;
    email: string;
    password: string;
    role?: AdminRole;
}

export interface UpdateAdminDto {
    name?: string;
    email?: string;
    password?: string;
    role?: AdminRole;
}
