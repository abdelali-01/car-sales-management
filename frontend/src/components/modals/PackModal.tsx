'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import TextArea from '../form/input/TextArea';
import Image from 'next/image';
import Loader from '../ui/load/Loader';
import { fetchProducts } from '@/store/products/productHandler';
import { Pack, Product } from '@/store/offers/offerSlice';
import { addPack, updatePack } from '@/store/offers/offersHandler';
import { Product as MainProduct, Attribute } from './ProductModal';

// Function to filter attributes that have options with prices different from the base price
const filterAttributesWithDifferentPrices = (attributes: Attribute[] | undefined, basePrice: number): Attribute[] => {
    console.log('attribute from filter' , attributes)
    if (!attributes || !Array.isArray(attributes)) return [];
    // Show an attribute if AT LEAST ONE of its options has a price different from the base price.
    return attributes.filter(attr =>
        attr.options.some(option => Number(option.price) !== Number(basePrice))
    );
};

interface PackModalProps {
    closeModal: () => void;
    selectedItem?: Pack;
}

export default function PackModal({ closeModal, selectedItem }: PackModalProps) {
    const { products } = useSelector((state: RootState) => state.products);
    const dispatch = useDispatch<AppDispatch>()
    const [pack, setPack] = useState<Pack>(selectedItem || {
        name: '',
        description: '',
        products: [],
        price: 0,
        discount: 0,
        images: []
    });

    // State to track selected attributes for each product
    const [selectedAttributes, setSelectedAttributes] = useState<{ [productId: number]: { [attrName: string]: string } }>({});
    console.log(selectedItem);
    
    // Initialize selected attributes when editing an existing pack
    useEffect(() => {
        if (selectedItem && selectedItem.products) {
            console.log('Initializing attributes for selected pack:', selectedItem);
            const initialAttributes: { [productId: number]: { [attrName: string]: string } } = {};
            selectedItem.products.forEach(product => {
                if (product.attributes) {
                    // Handle both string and object formats for attributes
                    const attrs = typeof product.attributes === 'string' 
                        ? JSON.parse(product.attributes) 
                        : product.attributes;
                    initialAttributes[product.id] = attrs;
                    console.log(`Product ${product.id} attributes:`, attrs);
                }
            });
            setSelectedAttributes(initialAttributes);
        }
    }, [selectedItem]);

    const totalProductsPrice = useMemo(() => {
        return pack.products.reduce((sum, productInPack) => {
            const productData = products?.find(p => p.id === productInPack.id);
            let finalPrice = Number(productInPack.price); // Start with the base price, ensure it's a number

            if (productData?.attributes) {
                const selectedAttrs = selectedAttributes[productInPack.id];
                if (selectedAttrs) {
                    Object.entries(selectedAttrs).forEach(([attrName, attrValue]) => {
                        const attribute = productData.attributes?.find(a => a.name === attrName);
                        const option = attribute?.options.find(o => o.value === attrValue);
                        if (option && option.price > 0) {
                            finalPrice = Number(option.price); // Use variant price, ensure it's a number
                        }
                    });
                }
            }
            return sum + finalPrice;
        }, 0);
    }, [pack.products, selectedAttributes, products]);


    useEffect(() => {
        if (totalProductsPrice > 0 && pack.price > 0) {
            const discount = ((totalProductsPrice - Number(pack.price)) / totalProductsPrice) * 100;
            setPack(prev => ({ ...prev, discount: Math.round(discount) }));
        } else {
            setPack(prev => ({ ...prev, discount: 0 }));
        }
    }, [pack.price, totalProductsPrice]);

    const handleProductToggle = (product: MainProduct) => {
        setPack(prev => {
            const isProductSelected = prev.products.some(p => p.id === product.id);
            if (isProductSelected) {
                // Remove product and its selected attributes
                setSelectedAttributes(prevAttrs => {
                    const newAttrs = { ...prevAttrs };
                    delete newAttrs[product.id];
                    return newAttrs;
                });

                return {
                    ...prev,
                    products: prev.products.filter(p => p.id !== product.id)
                };
            } else {
                // Add product
                const newProduct: Product = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                };
                return {
                    ...prev,
                    products: [...prev.products, newProduct]
                };
            }
        });
    };

    const handleAttributeChange = (productId: number, attrName: string, value: string) => {
        console.log(`Changing attribute for product ${productId}: ${attrName} = ${value}`);
        setSelectedAttributes(prev => {
            const newAttrs = {
                ...prev,
                [productId]: {
                    ...(prev[productId] || {}),
                    [attrName]: value
                }
            };
            console.log('Updated selected attributes:', newAttrs);
            return newAttrs;
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages: string[] = [];
            const processFile = (file: File) => {
                return new Promise<void>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        newImages.push(reader.result as string);
                        resolve();
                    };
                    reader.readAsDataURL(file);
                });
            };

            Promise.all(Array.from(files).map(processFile)).then(() => {
                setPack(prev => ({
                    ...prev,
                    images: [...(prev.images || []), ...newImages]
                }));
            });
        }
    };

    const handleRemoveImage = (index: number) => {
        setPack(prev => ({
            ...prev,
            images: (prev.images || []).filter((_, i) => i !== index)
        }));
    };

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Saving pack with selected attributes:', selectedAttributes);
        const packToSave = {
            ...pack,
            products: pack.products.map(p => ({
                ...p,
                attributes: selectedAttributes[p.id] || {}
            }))
        };
        console.log('Pack to save:', packToSave);

        if (selectedItem && packToSave.id) {
            dispatch(updatePack(packToSave.id, packToSave));
        } else {
            dispatch(addPack(packToSave));
        }
        closeModal();
    };

    useEffect(() => {
        if (!products) dispatch(fetchProducts())
    }, [products, dispatch]);

    if (!products) return <Loader />
    return (
        <form onSubmit={handleSave}>
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
                {selectedItem ? 'Edit Pack' : 'Create New Pack'}
            </h4>

            <div className='max-h-[60vh] overflow-y-auto'>
                <div className='border border-gray-200 dark:border-white/[0.05] rounded-lg p-5 mb-5'>
                    <div className='flex flex-col gap-3'>
                        <Label className='font-semibold text-gray-400'>Pack Images</Label>
                        <div className='flex flex-col gap-3'>
                            <div className='flex gap-3 max-h-[300px] p-2 overflow-x-auto'>
                                {pack?.images?.map((image, index) => (
                                    <div key={index} className='relative group'>
                                        <Image
                                            src={image.startsWith('data:image')
                                                ? image
                                                : `${image}`}
                                            alt={`Pack image ${index + 1}`}
                                            width={100}
                                            height={100}
                                            className="rounded-lg object-cover min-w-[140px] md:min-w-[200px] aspect-square bg-white"
                                            quality={100}
                                            unoptimized
                                        />
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <label className='min-w-[140px] md:min-w-[200px] aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-500 transition-colors'>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        multiple
                                        className="hidden"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
                        <div className='col-span-2'>
                            <Label className='font-semibold text-gray-400'>Pack Name</Label>
                            <Input
                                type="text"
                                value={pack.name}
                                onChange={(e) => setPack(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full"
                            />
                        </div>
                        <div className='col-span-2'>
                            <Label className='font-semibold text-gray-400'>Description</Label>
                            <TextArea
                                value={pack.description}
                                onChange={(value: string) => setPack(prev => ({ ...prev, description: value }))}
                                className="w-full"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="border border-gray-200 dark:border-white/[0.05] my-5"></div>

                    <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <h5 className='font-semibold text-gray-800 dark:text-white'>Products</h5>
                            <span className='text-sm text-gray-500 dark:text-gray-400'>
                                {pack.products.length} products selected
                            </span>
                        </div>

                        <div className='flex items-center gap-4 max-h-[300px] overflow-x-auto p-2'>
                            {products?.map((product: MainProduct) => {
                                const isSelected = pack.products.some(p => p.id === product.id);
                                const filteredAttributes = filterAttributesWithDifferentPrices(product.attributes, Number(product.basePrice));
                                const hasAttributesWithDifferentPrices = filteredAttributes.length > 0;

                                return (
                                    <div
                                        key={product.id}
                                        className={`relative min-w-[160px] group cursor-pointer rounded-lg border transition-all duration-200 ${isSelected
                                            ? 'border-success-500 bg-success-50 dark:bg-success-500/10'
                                            : 'border-gray-200 dark:border-white/[0.05] hover:border-primary-500'
                                            }`}
                                        onClick={() => handleProductToggle(product)}
                                    >
                                        <div className='aspect-square relative'>
                                            <Image
                                                src={product.images?.[0] ? `${product.images[0]}` : '/placeholder.png'}
                                                alt={product.name}
                                                fill
                                                className='object-cover rounded-t-lg'
                                            />
                                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center ${isSelected ? 'bg-success-500/40' : 'bg-black/40'
                                                }`}>
                                                <span className='text-white text-sm font-medium'>
                                                    {isSelected ? 'Remove' : 'Add'}
                                                </span>
                                            </div>
                                            {isSelected && (
                                                <div className='absolute top-2 left-2 bg-success-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
                                                    Selected
                                                </div>
                                            )}
                                            {hasAttributesWithDifferentPrices && (
                                                <div className='absolute top-2 right-2 bg-warning-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
                                                    Variants
                                                </div>
                                            )}
                                        </div>
                                        <div className='p-3'>
                                            <div className='font-medium text-gray-800 dark:text-white truncate'>
                                                {product.name}
                                            </div>
                                            <div className='text-sm text-gray-500 dark:text-gray-400'>
                                                {product.price} DA
                                            </div>
                                            {hasAttributesWithDifferentPrices && (
                                                <div className='text-xs text-warning-600 dark:text-warning-400 mt-1'>
                                                    Has price variants
                                                </div>
                                            )}
                                        </div>
                                        <div className='absolute top-2 right-2'>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected
                                                    ? 'border-success-500 bg-success-500'
                                                    : 'border-gray-300 dark:border-gray-600'
                                                }`}>
                                                {isSelected && (
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Selected Products with Attributes */}
                    {pack.products.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-white/[0.05] my-5 pt-5">
                            {pack.products.map(selectedProduct => {
                                const productData = products?.find(p => p.id === selectedProduct.id);
                                const filteredAttributes = filterAttributesWithDifferentPrices(productData?.attributes, Number(selectedProduct.basePrice));

                                if (filteredAttributes.length === 0) return null;

                                return (
                                    <div key={selectedProduct.id} className="mb-4 p-4 border border-gray-200 dark:border-white/[0.05] rounded-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Image
                                                src={productData?.images?.[0] ? `${productData.images[0]}` : '/placeholder.png'}
                                                alt={selectedProduct.name}
                                                width={50}
                                                height={50}
                                                className="rounded-lg object-cover"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-800 dark:text-white">{selectedProduct.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{selectedProduct.price} DA</div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Select Variants:
                                            </div>
                                            {filteredAttributes.map(attr => (
                                                <div key={attr.name} className="space-y-2">
                                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        {attr.name}
                                                    </Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {attr.options.map(option => (
                                                            <button
                                                                key={option.value}
                                                                type="button"
                                                                onClick={() => handleAttributeChange(selectedProduct.id, attr.name, option.value)}
                                                                className={`px-3 py-1 text-sm rounded-full border transition-colors ${selectedAttributes[selectedProduct.id]?.[attr.name] === option.value
                                                                    ? 'bg-primary text-white border-primary'
                                                                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600'
                                                                    }`}
                                                            >
                                                                {option.value} ({option.price} DA)
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="border-t border-gray-200 dark:border-white/[0.05] my-5"></div>

                    <div className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                            <div>
                                <Label className='font-semibold text-gray-400'>Pack Price</Label>
                                <Input
                                    type="number"
                                    value={pack.price}
                                    onChange={(e) => setPack(prev => ({ ...prev, price: Number(e.target.value) }))}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label className='font-semibold text-gray-400'>Total Products Price</Label>
                                <div className='p-3 bg-gray-50 dark:bg-white/[0.02] rounded-lg'>
                                    <div className='text-lg font-semibold text-gray-800 dark:text-white'>
                                        {totalProductsPrice} DA
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='p-4 bg-gray-50 dark:bg-white/[0.02] rounded-lg'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <div className='text-sm text-gray-500 dark:text-gray-400'>Discount</div>
                                    <div className='text-lg font-semibold text-gray-800 dark:text-white'>
                                        {pack.discount}%
                                    </div>
                                </div>
                                <div className='text-right'>
                                    <div className='text-sm text-gray-500 dark:text-gray-400'>Your Client Save</div>
                                    <div className='text-lg font-semibold text-success-500'>
                                        {totalProductsPrice - Number(pack.price)} DA
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-8">
                <Button size="sm" variant="outline" onClick={closeModal}>
                    Cancel
                </Button>
                <Button type="submit" size="sm">
                    {selectedItem ? 'Save Changes' : 'Create Pack'}
                </Button>
            </div>
        </form>
    );
} 