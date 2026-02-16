import React, { useState, useEffect } from 'react';
import { UserCircleIcon, PhoneIcon, CheckCircleIcon, MagnifyingGlassIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { Client, Visitor } from '@/types/auto-sales';
import Badge from '../ui/badge/Badge';

interface CustomerSelectorProps {
    mode: 'client' | 'visitor';
    clients?: Client[] | null;
    visitors?: Visitor[] | null;
    selectedId: number;
    onSelect: (id: number) => void;
}

export default function CustomerSelector({ mode, clients, visitors, selectedId, onSelect }: CustomerSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<Client | Visitor | undefined>(undefined);

    // Update selected item reference when ID or Data changes
    useEffect(() => {
        if (mode === 'client' && clients) {
            setSelectedItem(clients.find(c => c.id === selectedId));
        } else if (mode === 'visitor' && visitors) {
            setSelectedItem(visitors.find(v => v.id === selectedId));
        }
    }, [selectedId, mode, clients, visitors]);

    // Close dropdown when clicking outside (simplified for now, can be improved with useRef)

    // Filter Logic
    const getFilteredItems = () => {
        const query = searchQuery.toLowerCase();
        if (mode === 'client') {
            return clients?.filter(c =>
                c.name.toLowerCase().includes(query) ||
                c.phone.includes(query)
            ) || [];
        } else {
            return visitors?.filter(v =>
                v.name.toLowerCase().includes(query) ||
                v.phone.includes(query)
            ) || [];
        }
    };

    const filteredItems = getFilteredItems();

    // Helper for Badge (reused from reference)
    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new': return <Badge color='info' size="sm">New</Badge>;
            case 'contacted': return <Badge color='warning' size="sm">Contacted</Badge>;
            case 'interested': return <Badge color='primary' size="sm">Interested</Badge>;
            case 'converted': return <Badge color='success' size="sm">Converted</Badge>;
            case 'lost': return <Badge color='error' size="sm">Lost</Badge>;
            default: return <Badge color='light' size="sm">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-3">
            {/* 1. SELECTION CARD (Or Placeholder button) */}
            {!selectedItem ? (
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-500 dark:text-gray-400 group"
                >
                    <span className="flex items-center gap-3">
                        <UserCircleIcon className="w-6 h-6 text-gray-400 group-hover:text-brand-500 transition-colors" />
                        <span className="font-medium group-hover:text-gray-700 dark:group-hover:text-gray-300">
                            {isOpen ? 'Close Selection' : `Select ${mode === 'client' ? 'Client' : 'Visitor'}`}
                        </span>
                    </span>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            ) : (
                // SELECTED ITEM CARD (Matching the provided UI style)
                <div className="relative p-4 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/10 dark:bg-brand-900/10 shadow-sm group">
                    <div className="flex gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <UserCircleIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-base font-bold text-gray-900 dark:text-white truncate pr-2">
                                    {selectedItem.name}
                                </h4>
                                {getStatusBadge((selectedItem as any).status || 'Active')}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1.5">
                                    <PhoneIcon className="w-4 h-4" />
                                    {selectedItem.phone}
                                </span>
                                {(selectedItem as any).priority && (
                                    <span className="flex items-center gap-1 text-brand-600 dark:text-brand-400 font-medium">
                                        <CheckCircleIconSolid className="w-4 h-4" />
                                        Priority {(selectedItem as any).priority}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions (Change / Remove) */}
                        <div className="flex flex-col gap-2 justify-center pl-2 border-l border-gray-200 dark:border-gray-700">
                            <button type="button" onClick={() => setIsOpen(!isOpen)}
                                className="p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 rounded-lg transition-colors" title="Change">
                                <MagnifyingGlassIcon className="w-5 h-5" />
                            </button>
                            <button type="button" onClick={() => onSelect(0)}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 rounded-lg transition-colors" title="Remove">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. DROPDOWN LIST (Refined) */}
            {isOpen && (
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    {/* Search */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or phone number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                            autoFocus
                        />
                    </div>

                    {/* List */}
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-sm text-gray-500">No {mode}s found.</p>
                            </div>
                        ) : (
                            filteredItems.filter(item => item.id !== selectedId).map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => { onSelect(item.id); setIsOpen(false); }}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all text-left group"
                                >
                                    <div className="flex-shrink-0">
                                        <UserCircleIcon className="w-10 h-10 text-gray-300 group-hover:text-brand-400 transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900 dark:text-white truncate">{item.name}</span>
                                            {getStatusBadge((item as any).status || 'Active')}
                                        </div>
                                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                            <span className="flex items-center gap-1"><PhoneIcon className="w-3 h-3" /> {item.phone}</span>
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
