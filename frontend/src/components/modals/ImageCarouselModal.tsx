import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Zoom } from 'swiper/modules';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

interface ImageCarouselModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: { url: string; alt?: string }[];
    initialSlide?: number;
}

export default function ImageCarouselModal({
    isOpen,
    onClose,
    images,
    initialSlide = 0
}: ImageCarouselModalProps) {
    // Handle escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-[10000] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close gallery"
            >
                <XMarkIcon className="w-10 h-10" />
            </button>

            {/* Carousel Container */}
            <div
                className="w-full h-full max-w-7xl mx-auto px-4 py-8 flex items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <Swiper
                    modules={[Navigation, Pagination, Keyboard, Zoom]}
                    spaceBetween={30}
                    slidesPerView={1}
                    initialSlide={initialSlide}
                    navigation
                    pagination={{ clickable: true }}
                    keyboard={{ enabled: true }}
                    zoom
                    className="w-full h-full rounded-lg"
                    style={{
                        '--swiper-navigation-color': '#fff',
                        '--swiper-pagination-color': '#fff',
                    } as React.CSSProperties}
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={index} className="flex items-center justify-center bg-transparent">
                            <div className="swiper-zoom-container w-full h-full flex items-center justify-center">
                                <div className="relative w-full h-full max-h-[85vh]">
                                    <Image
                                        src={img.url}
                                        alt={img.alt || `Image ${index + 1}`}
                                        fill
                                        className="object-contain" // Use contain to see full image without cropping
                                        unoptimized // Handle external or local dev URLs
                                        priority={index === initialSlide}
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
