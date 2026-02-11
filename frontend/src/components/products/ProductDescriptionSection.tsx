'use client';
import React from 'react';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import { Category } from '@/components/tables/CategoriesTable';

interface ProductDescriptionSectionProps {
    name: string;
    categoryId: number;
    description: string;
    categories: Category[] | null;
    onChange: (field: string, value: string | number) => void;
    errors?: Record<string, string>;
}

export default function ProductDescriptionSection({
    name,
    categoryId,
    description,
    categories,
    onChange,
    errors = {}
}: ProductDescriptionSectionProps) {
    const categoryOptions = categories?.map(cat => ({
        label: cat.name,
        value: String(cat.id)
    })) || [];

    console.log(errors, 'errors')

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Products Description
            </h2>

            <div className="space-y-5">
                {/* Row 1: Name & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                            id="productName"
                            type="text"
                            placeholder="Enter product name"
                            value={name}
                            onChange={(e) => onChange('name', e.target.value)}
                            error={!!errors.name}
                            hint={errors.name}
                        />
                    </div>
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                            options={categoryOptions}
                            defaultValue={String(categoryId)}
                            onChange={(val) => onChange('category_id', Number(val))}
                            placeholder="Select a category"
                            className={errors.category_id ? 'border-error-500' : ''}
                        />
                        {errors.category_id && (
                            <p className="mt-1 text-sm text-error-500">{errors.category_id}</p>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <Label htmlFor="description">Description</Label>
                    <TextArea
                        placeholder="Enter product description..."
                        value={description}
                        onChange={(val) => onChange('description', val)}
                        rows={5}
                    />
                </div>
            </div>
        </div>
    );
}
