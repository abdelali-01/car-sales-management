'use client';
import React, { useState } from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface AttributeOption {
    value: string;
    price: number;
    stock: number;
}

interface Attribute {
    name: string;
    options: AttributeOption[];
}

interface ProductAttributesSectionProps {
    attributes: Attribute[];
    onChange: (attributes: Attribute[]) => void;
}

export default function ProductAttributesSection({
    attributes,
    onChange
}: ProductAttributesSectionProps) {
    const [newAttributeName, setNewAttributeName] = useState('');
    const [editingAttribute, setEditingAttribute] = useState<number | null>(null);
    const [newOption, setNewOption] = useState<AttributeOption>({ value: '', price: 0, stock: 0 });

    const handleAddAttribute = () => {
        if (!newAttributeName.trim()) return;

        const newAttribute: Attribute = {
            name: newAttributeName.trim(),
            options: []
        };

        onChange([...attributes, newAttribute]);
        setNewAttributeName('');
        setEditingAttribute(attributes.length); // Open the new attribute for editing
    };

    const handleRemoveAttribute = (index: number) => {
        const updated = attributes.filter((_, i) => i !== index);
        onChange(updated);
        if (editingAttribute === index) setEditingAttribute(null);
    };

    const handleAddOption = (attrIndex: number) => {
        if (!newOption.value.trim()) return;

        const updated = [...attributes];
        updated[attrIndex].options.push({ ...newOption });
        onChange(updated);
        setNewOption({ value: '', price: 0, stock: 0 });
    };

    const handleRemoveOption = (attrIndex: number, optIndex: number) => {
        const updated = [...attributes];
        updated[attrIndex].options = updated[attrIndex].options.filter((_, i) => i !== optIndex);
        onChange(updated);
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Product Attributes
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Add variants like size, color, etc.
                    </p>
                </div>
            </div>

            {/* Add New Attribute */}
            <div className="flex gap-3 mb-6">
                <div className="flex-1" onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleAddAttribute()}>
                    <Input
                        type="text"
                        placeholder="Attribute name (e.g., Color, Size)"
                        value={newAttributeName}
                        onChange={(e) => setNewAttributeName(e.target.value)}
                    />
                </div>
                <Button
                    type="button"
                    onClick={handleAddAttribute}
                    disabled={!newAttributeName.trim()}
                    className="shrink-0"
                >
                    <PlusIcon className="w-5 h-5 mr-1" />
                    Add Attribute
                </Button>
            </div>

            {/* Attributes List */}
            <div className="space-y-4">
                {attributes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                        No attributes yet. Add one to create product variants.
                    </div>
                ) : (
                    attributes.map((attr, attrIndex) => (
                        <div
                            key={attrIndex}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                        >
                            {/* Attribute Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/80">
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {attr.name}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        ({attr.options.length} options)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingAttribute(editingAttribute === attrIndex ? null : attrIndex)}
                                        className="text-sm text-brand-500 hover:text-brand-600"
                                    >
                                        {editingAttribute === attrIndex ? 'Done' : 'Edit'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAttribute(attrIndex)}
                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="p-4">
                                {/* Option Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {attr.options.map((opt, optIndex) => (
                                        <div
                                            key={optIndex}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                                        >
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {opt.value}
                                            </span>
                                            {opt.price > 0 && (
                                                <span className="text-green-600 dark:text-green-400">
                                                    +{opt.price} M
                                                </span>
                                            )}
                                            <span className="text-gray-500">
                                                ({opt.stock} in stock)
                                            </span>
                                            {editingAttribute === attrIndex && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveOption(attrIndex, optIndex)}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Add Option Form (when editing) */}
                                {editingAttribute === attrIndex && (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div>
                                            <Label className="text-xs">Option Value</Label>
                                            <Input
                                                type="text"
                                                placeholder="e.g., Red, XL"
                                                value={newOption.value}
                                                onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Price Adjustment (M)</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={newOption.price}
                                                onChange={(e) => setNewOption({ ...newOption, price: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Stock</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={newOption.stock}
                                                onChange={(e) => setNewOption({ ...newOption, stock: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <Button
                                                type="button"
                                                onClick={() => handleAddOption(attrIndex)}
                                                disabled={!newOption.value.trim()}
                                                size="sm"
                                                className="w-full"
                                            >
                                                Add Option
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
