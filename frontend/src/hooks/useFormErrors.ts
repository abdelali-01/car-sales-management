'use client';

import { useState, useCallback } from 'react';
import { getFieldErrors, getErrorMessage, isValidationError } from '@/services/api';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/toast/toastSlice';
import { AppDispatch } from '@/store/store';

/**
 * Hook for managing form errors from API responses.
 * 
 * Features:
 * - Extracts field-level validation errors from API responses
 * - Shows general errors via toast notifications
 * - Provides utilities to clear errors when fields change
 * 
 * @example
 * ```tsx
 * const { errors, setApiError, clearFieldError, clearErrors } = useFormErrors();
 * 
 * const handleSubmit = async () => {
 *   clearErrors();
 *   try {
 *     await api.post('/products', formData);
 *   } catch (error) {
 *     setApiError(error);
 *   }
 * };
 * 
 * <InputField
 *   error={!!errors.name}
 *   hint={errors.name}
 *   onChange={(e) => { setName(e.target.value); clearFieldError('name'); }}
 * />
 * ```
 */
export function useFormErrors<T extends Record<string, string> = Record<string, string>>() {
    const [errors, setErrors] = useState<T>({} as T);
    const dispatch = useDispatch<AppDispatch>();

    /**
     * Set error from API response.
     * If validation errors exist, populates field errors.
     * Otherwise, shows error in toast.
     */
    const setApiError = useCallback((error: unknown, showToastForValidation = false) => {
        if (isValidationError(error)) {
            // Extract field-level errors
            const fieldErrors = getFieldErrors(error) as T;
            setErrors(fieldErrors);

            // Scroll to top so user can see the errors
            if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // Optionally show toast for validation errors
            if (showToastForValidation) {
                const errorCount = Object.keys(fieldErrors).length;
                dispatch(addToast({
                    type: 'error',
                    message: 'Validation failed',
                    description: `${errorCount} field${errorCount > 1 ? 's have' : ' has'} errors`
                }));
            }
        } else {
            // Show general error in toast
            dispatch(addToast({
                type: 'error',
                message: getErrorMessage(error)
            }));
        }
    }, [dispatch]);

    /**
     * Set a specific field error manually
     */
    const setFieldError = useCallback((field: keyof T, message: string) => {
        setErrors(prev => ({ ...prev, [field]: message }));
    }, []);

    /**
     * Clear error for a specific field
     */
    const clearFieldError = useCallback((field: keyof T) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    /**
     * Clear all errors
     */
    const clearErrors = useCallback(() => {
        setErrors({} as T);
    }, []);

    /**
     * Check if any errors exist
     */
    const hasErrors = Object.keys(errors).length > 0;

    /**
     * Get error for a specific field (returns undefined if no error)
     */
    const getFieldError = useCallback((field: keyof T): string | undefined => {
        return errors[field];
    }, [errors]);

    return {
        errors,
        setApiError,
        setFieldError,
        clearFieldError,
        clearErrors,
        hasErrors,
        getFieldError
    };
}

export default useFormErrors;
