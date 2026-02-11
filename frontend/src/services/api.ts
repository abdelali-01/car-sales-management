import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Centralized API client for all backend requests.
 * Provides consistent error handling and request configuration.
 */

// Get base URL from environment
const BASE_URL = process.env.NEXT_PUBLIC_SERVER || 'http://localhost:5000';

// Create axios instance with defaults
export const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Always send cookies for session auth
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Request interceptor for logging and request modification
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Log requests in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
    (response: AxiosResponse) => {
        // Handle 200 OK but success: false (application error)
        if (response.data && response.data.success === false) {
            // Create a pseudo-AxiosError to pass to catch blocks
            const error = new AxiosError(
                response.data.message || 'Operation failed',
                '200',
                response.config,
                response.request,
                response
            );
            return Promise.reject(error);
        }
        return response;
    },
    (error: AxiosError) => {
        // Handle common error cases
        if (error.response) {
            const status = error.response.status;

            // Log errors in development
            if (process.env.NODE_ENV === 'development') {
                console.error(`[API Error] ${status}:`, error.response.data);
            }

            // Handle 401 Unauthorized - session expired
            if (status === 401) {
                // Could dispatch logout action or redirect here
                // For now, just pass through
            }
        }

        return Promise.reject(error);
    }
);

// ============================================
// Error Response Types (matching backend pattern)
// ============================================

/**
 * Single validation error for a specific field
 */
export interface ValidationError {
    field: string;
    message: string;
}

/**
 * Standard API error response structure from backend
 */
export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: ValidationError[];  // Array of field-level validation errors
    field?: string;              // Single field that caused error (e.g., for unique constraint)
}

// ============================================
// Error Extraction Utilities
// ============================================

/**
 * Extract the main error message from any error type
 */
export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as ApiErrorResponse | undefined;
        return data?.message || error.message || 'Something went wrong';
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

/**
 * Extract field-level validation errors from API response
 * Returns a map of fieldName -> errorMessage
 */
export const getFieldErrors = (error: unknown): Record<string, string> => {
    const fieldErrors: Record<string, string> = {};

    if (!axios.isAxiosError(error)) {
        return fieldErrors;
    }

    const data = error.response?.data as ApiErrorResponse | undefined;
    if (!data) {
        return fieldErrors;
    }

    // Handle array of validation errors
    if (data.errors && Array.isArray(data.errors)) {
        data.errors.forEach((err) => {
            if (err.field && err.message) {
                fieldErrors[err.field] = err.message;
            }
        });
    }

    // Handle single field error (e.g., unique constraint violation)
    if (data.field && data.message) {
        fieldErrors[data.field] = data.message;
    }

    return fieldErrors;
};

/**
 * Check if error is a validation error (400 status with field errors)
 */
export const isValidationError = (error: unknown): boolean => {
    if (!axios.isAxiosError(error)) {
        return false;
    }

    const status = error.response?.status;
    const data = error.response?.data as ApiErrorResponse | undefined;

    // Check standard 400 or if we have explict field errors even with 200
    return (status === 400 || status === 200) && !!(data?.errors?.length || data?.field);
};

/**
 * Get HTTP status code from error
 */
export const getErrorStatus = (error: unknown): number | undefined => {
    if (axios.isAxiosError(error)) {
        return error.response?.status;
    }
    return undefined;
};

/**
 * Check if error is an authentication error (401)
 */
export const isAuthError = (error: unknown): boolean => {
    return getErrorStatus(error) === 401;
};

/**
 * Check if error is a forbidden error (403)
 */
export const isForbiddenError = (error: unknown): boolean => {
    return getErrorStatus(error) === 403;
};

/**
 * Check if error is a not found error (404)
 */
export const isNotFoundError = (error: unknown): boolean => {
    return getErrorStatus(error) === 404;
};

/**
 * Check if error is a conflict error (409) - e.g., duplicate record
 */
export const isConflictError = (error: unknown): boolean => {
    return getErrorStatus(error) === 409;
};

export default api;
