import { useMetaPixel as usePixelContext } from '@/lib/PixelProvider';

/**
 * Hook to easily track Meta Pixel events across all registered pixels
 *
 * @example
 * ```tsx
 * const { track, pageView } = useMetaPixel();
 *
 * // Track AddToCart event
 * track('AddToCart', {
 *   content_name: 'Product Name',
 *   content_ids: ['123'],
 *   content_type: 'product',
 *   value: 29.99,
 *   currency: 'DZD'
 * });
 *
 * // Track page view
 * pageView();
 * ```
 */
export const useMetaPixel = () => {
    const { track, pageView, isReady, pixels } = usePixelContext();

    /**
     * Standard Facebook Pixel Events Helper Methods
     */
    const trackViewContent = (data: {
        content_name?: string;
        content_ids?: string[];
        content_type?: string;
        value?: number;
        currency?: string;
    }) => {
        track('ViewContent', data);
    };

    const trackAddToCart = (data: {
        content_name?: string;
        content_ids?: string[];
        content_type?: string;
        value?: number;
        currency?: string;
    }) => {
        track('AddToCart', data);
    };

    const trackInitiateCheckout = (data: {
        content_ids?: string[];
        contents?: any[];
        num_items?: number;
        value?: number;
        currency?: string;
    }) => {
        track('InitiateCheckout', data);
    };

    const trackPurchase = (data: {
        content_ids?: string[];
        contents?: any[];
        value: number;
        currency: string;
        num_items?: number;
    }) => {
        track('Purchase', data);
    };

    const trackSearch = (data: {
        search_string?: string;
        content_ids?: string[];
        contents?: any[];
    }) => {
        track('Search', data);
    };

    const trackAddToWishlist = (data: {
        content_name?: string;
        content_ids?: string[];
        content_type?: string;
        value?: number;
        currency?: string;
    }) => {
        track('AddToWishlist', data);
    };

    const trackContact = () => {
        track('Contact');
    };

    const trackLead = (data?: any) => {
        track('Lead', data);
    };

    return {
        // Core methods
        track,
        pageView,
        isReady,
        pixels,

        // Helper methods for common events
        trackViewContent,
        trackAddToCart,
        trackInitiateCheckout,
        trackPurchase,
        trackSearch,
        trackAddToWishlist,
        trackContact,
        trackLead,
    };
};
