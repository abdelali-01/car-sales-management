'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import { CloudArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export interface OfferImageState {
    url: string;
    file?: File;
    id?: number; // Backend ID for existing images
}

interface OfferImagesSectionProps {
    images: OfferImageState[];
    onChange: (images: OfferImageState[]) => void;
}

export default function OfferImagesSection({
    images,
    onChange
}: OfferImagesSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation('admin');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: OfferImageState[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            await new Promise<void>((resolve) => {
                reader.onloadend = () => {
                    newImages.push({
                        url: reader.result as string,
                        file: file
                    });
                    resolve();
                };
                reader.readAsDataURL(file);
            });
        }

        onChange([...images, ...newImages]);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        const updated = images.filter((_, i) => i !== index);
        onChange(updated);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const input = fileInputRef.current;
            if (input) {
                const dt = new DataTransfer();
                for (let i = 0; i < files.length; i++) {
                    dt.items.add(files[i]);
                }
                input.files = dt.files;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {t('offers.columns.image')}s
            </h2>

            {/* Upload Area */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-brand-500 hover:bg-brand-500/5 transition-colors"
            >
                <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                    <span className="text-brand-500 font-medium">Click to upload</span>
                    {' '}or drag and drop
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG or GIF (MAX. 800x400px)
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Uploaded Images ({images.length})
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((image, index) => (
                            <div key={index} className="relative group aspect-square">
                                <Image
                                    src={image.url}
                                    alt={`Offer image ${index + 1}`}
                                    fill
                                    className="object-cover rounded-lg"
                                    unoptimized
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                                {index === 0 && (
                                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-brand-500 text-white text-xs rounded-full">
                                        Main
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
