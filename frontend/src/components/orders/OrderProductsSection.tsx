'use client';
import React from 'react';
import Image from 'next/image';
import { MinusIcon, PlusIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

interface OrderProductItem {
    id: number;
    productId: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    attributes?: Record<string, string>;
}

interface ProductOption {
    id: number;
    name: string;
    price: number;
    images: string[];
}

interface OrderProductsSectionProps {
    products: OrderProductItem[];
    editable?: boolean;
    onQuantityChange?: (idx: number, quantity: number) => void;
    onRemoveProduct?: (idx: number) => void;
    onAddProduct?: (product: ProductOption) => void;
    availableProducts?: ProductOption[];
    showAddProduct?: boolean;
}

export default function OrderProductsSection({
    products,
    editable = false,
    onQuantityChange,
    onRemoveProduct,
    onAddProduct,
    availableProducts = [],
    showAddProduct = false
}: OrderProductsSectionProps) {
    const formatPrice = (price: number) => `DA ${price.toLocaleString()}`;
    const [isAddingProduct, setIsAddingProduct] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredProducts = availableProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !products.some(op => op.productId === p.id)
    );

    const handleSelectProduct = (product: ProductOption) => {
        onAddProduct?.(product);
        setIsAddingProduct(false);
        setSearchQuery('');
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 p-5 lg:p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order Items
                </h2>
                {showAddProduct && editable && (
                    <button
                        type="button"
                        onClick={() => setIsAddingProduct(!isAddingProduct)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg 
                            bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400
                            hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
                    >
                        <PlusCircleIcon className="w-4 h-4" />
                        Add Product
                    </button>
                )}
            </div>

            {/* Add Product Dropdown */}
            {isAddingProduct && (
                <div className="mb-4 p-4 rounded-lg border-2 border-dashed border-brand-300 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-900/10">
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                placeholder:text-gray-400"
                            autoFocus
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                                {searchQuery ? 'No products found' : 'Start typing to search products'}
                            </div>
                        ) : (
                            filteredProducts.slice(0, 10).map(product => (
                                <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => handleSelectProduct(product)}
                                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                                >
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                                        {product.images?.[0] ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                No img
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 dark:text-white truncate">
                                            {product.name}
                                        </p>
                                        <p className="text-sm text-brand-500">
                                            {formatPrice(product.price)}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setIsAddingProduct(false);
                            setSearchQuery('');
                        }}
                        className="mt-3 w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            )}

            <div className="space-y-4">
                {products.map((product, idx) => (
                    <div
                        key={`${product.productId}-${idx}`}
                        className="group flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 relative"
                    >
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                    No image
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                                {product.name}
                            </h3>
                            <p className="text-brand-500 font-semibold mt-1">
                                {formatPrice(product.price)}
                            </p>

                            {/* Attributes */}
                            {product.attributes && Object.keys(product.attributes).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {Object.entries(product.attributes).map(([key, value]) => (
                                        <span
                                            key={key}
                                            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300"
                                        >
                                            {key}: {value}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                            {editable ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => onQuantityChange?.(idx, Math.max(1, product.quantity - 1))}
                                        className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <MinusIcon className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                                        {product.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onQuantityChange?.(idx, product.quantity + 1)}
                                        className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <span className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                                    ×{product.quantity}
                                </span>
                            )}
                        </div>

                        {/* Item Total */}
                        <div className="text-right min-w-[80px]">
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {formatPrice(product.price * product.quantity)}
                            </span>
                        </div>

                        {/* Remove Button */}
                        {editable && products.length > 1 && (
                            <button
                                type="button"
                                onClick={() => onRemoveProduct?.(idx)}
                                className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 
                                    text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 
                                    hover:bg-red-200 dark:hover:bg-red-900/50 transition-all shadow-sm"
                                title="Remove product"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Minimum products warning */}
            {editable && products.length === 1 && (
                <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                    Order must have at least one product
                </p>
            )}
        </div>
    );
}
