'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface Pixel {
    id: string;
    name: string;
}

interface PixelContextType {
    pixels: Pixel[];
    track: (eventName: string, data?: any) => void;
    pageView: () => void;
    isReady: boolean;
}

const PixelContext = createContext<PixelContextType>({
    pixels: [],
    track: () => {},
    pageView: () => {},
    isReady: false,
});

export const useMetaPixel = () => {
    const context = useContext(PixelContext);
    if (!context) {
        throw new Error('useMetaPixel must be used within PixelProvider');
    }
    return context;
};

interface PixelProviderProps {
    children: React.ReactNode;
}

export default function PixelProvider({ children }: PixelProviderProps) {
    const [pixels, setPixels] = useState<Pixel[]>([]);
    const [isReady, setIsReady] = useState(false);
    const [ReactPixel, setReactPixel] = useState<typeof import('react-facebook-pixel').default | null>(null);

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        // Dynamically import react-facebook-pixel only on client side
        import('react-facebook-pixel').then((module) => {
            setReactPixel(module.default);
        });
    }, []);

    useEffect(() => {
        // Only initialize if ReactPixel is loaded and we're on client side
        if (typeof window === 'undefined' || !ReactPixel) return;

        const initializePixels = async () => {
            try {
                // Fetch pixels from API
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/pixels`);
                const fetchedPixels: Pixel[] = response.data.pixels || [];

                if (fetchedPixels.length > 0) {
                    setPixels(fetchedPixels);

                    // Initialize all pixels
                    fetchedPixels.forEach((pixel, index) => {
                        const options = {
                            autoConfig: true,
                            debug: process.env.NODE_ENV === 'development',
                        };

                        // Initialize the first pixel as primary
                        if (index === 0) {
                            ReactPixel.init(pixel.id, undefined, options);
                        } else {
                            // For additional pixels, we need to track them manually
                            if ((window as any).fbq) {
                                (window as any).fbq('init', pixel.id);
                            }
                        }
                    });

                    setIsReady(true);
                    console.log(`✅ Initialized ${fetchedPixels.length} Meta Pixel(s):`, fetchedPixels.map(p => p.name).join(', '));
                }
            } catch (error) {
                console.error('Error initializing Meta Pixels:', error);
                setIsReady(true); // Set ready anyway to not block the app
            }
        };

        initializePixels();
    }, [ReactPixel]);

    const track = (eventName: string, data?: any) => {
        if (!isReady) {
            console.warn('Meta Pixel not ready yet');
            return;
        }

        try {
            // Track on the primary pixel
            ReactPixel.track(eventName, data);

            // Track on additional pixels
            if (pixels.length > 1 && typeof window !== 'undefined' && (window as any).fbq) {
                pixels.slice(1).forEach((pixel) => {
                    (window as any).fbq('trackSingle', pixel.id, eventName, data);
                });
            }

            console.log(`📊 Tracked "${eventName}" on ${pixels.length} pixel(s)`, data);
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    };

    const pageView = () => {
        if (!isReady) {
            console.warn('Meta Pixel not ready yet');
            return;
        }

        try {
            // Track page view on primary pixel
            ReactPixel.pageView();

            // Track page view on additional pixels
            if (pixels.length > 1 && typeof window !== 'undefined' && (window as any).fbq) {
                pixels.slice(1).forEach((pixel) => {
                    (window as any).fbq('trackSingle', pixel.id, 'PageView');
                });
            }

            console.log(`👁️ Page view tracked on ${pixels.length} pixel(s)`);
        } catch (error) {
            console.error('Error tracking page view:', error);
        }
    };

    return (
        <PixelContext.Provider value={{ pixels, track, pageView, isReady }}>
            {children}
        </PixelContext.Provider>
    );
}
