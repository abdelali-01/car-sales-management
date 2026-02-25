import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, ChevronDownIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Offer } from '@/types/auto-sales';
import Image from 'next/image';

interface VehicleSelectorProps {
    offers?: Offer[] | null;
    selectedId: number;
    onSelect: (id: number) => void;
    disabled?: boolean;
}

export default function VehicleSelector({ offers, selectedId, onSelect, disabled = false }: VehicleSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOffer, setSelectedOffer] = useState<Offer | undefined>(undefined);

    // Update selected item reference when ID or Data changes
    useEffect(() => {
        if (offers) {
            setSelectedOffer(offers.find(o => o.id === selectedId));
        }
    }, [selectedId, offers]);

    // Filter Logic
    const filteredOffers = offers?.filter(o =>
        (o.status === 'available' || o.id === selectedId) && // Show available or currently selected
        (o.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.year.toString().includes(searchQuery))
    ) || [];

    const toggleOpen = () => {
        if (!disabled) setIsOpen(!isOpen);
    };

    return (
        <div className="space-y-3 relative">
            {/* 1. SELECTION CARD (Or Trigger) */}
            {!selectedOffer ? (
                <button
                    type="button"
                    onClick={toggleOpen}
                    disabled={disabled}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-500 dark:text-gray-400 group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <span className="flex items-center gap-3">
                        {/* Placeholder Icon */}
                        <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <CalendarIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="font-medium group-hover:text-gray-700 dark:group-hover:text-gray-300">
                            {isOpen ? 'Close Selection' : 'Select a vehicle from inventory...'}
                        </span>
                    </span>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            ) : (
                // SELECTED VEHICLE CARD
                <div className="relative p-4 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/10 dark:bg-brand-900/10 shadow-sm group">
                    <div className="flex gap-4">
                        {/* Image */}
                        <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 relative border border-gray-200 dark:border-gray-700">
                            {selectedOffer.images?.[0] ? (
                                <Image src={selectedOffer.images[0].imageUrl} alt={selectedOffer.brand} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-1">
                                {selectedOffer.brand} {selectedOffer.model}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <span>{selectedOffer.year}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                <span>{selectedOffer.km.toLocaleString()} km</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                <span className="text-brand-600 dark:text-brand-400 font-semibold">
                                    {selectedOffer.price.toLocaleString()} M
                                </span>
                            </div>
                        </div>

                        {/* Actions (Change / Remove) */}
                        {!disabled && (
                            <div className="flex flex-col gap-2 justify-center pl-2 border-l border-gray-200 dark:border-gray-700">
                                <button type="button" onClick={toggleOpen}
                                    className="p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 rounded-lg transition-colors" title="Change">
                                    <MagnifyingGlassIcon className="w-5 h-5" />
                                </button>
                                <button type="button" onClick={() => onSelect(0)}
                                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 rounded-lg transition-colors" title="Remove">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 2. DROPDOWN LIST */}
            {isOpen && !disabled && (
                <div className="absolute z-10 top-full left-0 right-0 mt-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    {/* Search */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by brand, model, or year..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                            autoFocus
                        />
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {filteredOffers.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-500">No vehicles found matching your search.</p>
                            </div>
                        ) : (
                            filteredOffers.filter(offer => offer.id !== selectedId).map(offer => (
                                <button
                                    key={offer.id}
                                    type="button"
                                    onClick={() => { onSelect(offer.id); setIsOpen(false); }}
                                    className="w-full flex gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all text-left group"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-20 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0 relative">
                                        {offer.images?.[0] ? (
                                            <Image src={offer.images[0].imageUrl} alt={offer.brand} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex justify-between items-start">
                                            <h5 className="font-semibold text-gray-900 dark:text-white truncate">
                                                {offer.brand} {offer.model}
                                            </h5>
                                            <span className="text-brand-600 dark:text-brand-400 text-sm font-bold">
                                                {offer.price.toLocaleString()} M
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                            <span>{offer.year}</span>
                                            <span>•</span>
                                            <span>{offer.km.toLocaleString()} km</span>
                                            <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600 text-[10px] ml-auto">
                                                {offer.location}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
