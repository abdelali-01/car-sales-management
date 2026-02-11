'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProductDescriptionSection from '@/components/products/ProductDescriptionSection';
import PricingSection from '@/components/products/PricingSection';
import ProductAttributesSection from '@/components/products/ProductAttributesSection';
import ProductImagesSection from '@/components/products/ProductImagesSection';
import ProductFormActions from '@/components/products/ProductFormActions';
import { AppDispatch, RootState } from '@/store/store';
import { addProduct, fetchProductsAndCategories } from '@/store/products/productHandler';
import { useFormErrors } from '@/hooks/useFormErrors';
import { useTranslation } from 'react-i18next';

interface AttributeOption {
    value: string;
    price: number;
    stock: number;
}
export interface Attribute {
    name: string;
    options: AttributeOption[];
}

export interface Product {
    id?: number;
    name: string;
    category?: string;
    category_id: number;  // Changed from category_id
    description: string;
    presentation?: string;
    price: number;
    prevPrice?: number;
    quantity: number;
    images: string[];
    showOnHomepage: boolean;  // Changed from show_on_homepage
    freeDelivery: boolean;  // Free delivery flag for this product
    attributes?: Attribute[];
    featured?: boolean;
    inStock?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export default function AddProductPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { categories } = useSelector((state: RootState) => state.products);
    const { errors, setApiError, setFieldError, clearFieldError, clearErrors } = useFormErrors<Record<string, string>>();
    const { t } = useTranslation('admin');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [product, setProduct] = useState<Product>({
        name: '',
        category_id: 0,
        description: '',
        price: 0,
        prevPrice: 0,
        quantity: 0,
        images: [],
        showOnHomepage: false,
        freeDelivery: false,
        attributes: []
    });

    // Fetch categories on mount
    useEffect(() => {
        if (!categories) {
            dispatch(fetchProductsAndCategories());
        }
    }, [dispatch, categories]);

    // Set default category when categories load
    useEffect(() => {
        if (categories && categories.length > 0 && product.category_id === 0) {
            setProduct(prev => ({ ...prev, category_id: categories[0].id }));
        }
    }, [categories, product.category_id]);

    const handleFieldChange = (field: string, value: string | number | boolean) => {
        setProduct(prev => ({ ...prev, [field]: value }));
        // Clear field error when user changes the value
        if (errors[field]) {
            clearFieldError(field);
        }
    };

    const handleAttributesChange = (attributes: Attribute[]) => {
        setProduct(prev => ({ ...prev, attributes }));
    };

    const handleImagesChange = (images: string[]) => {
        setProduct(prev => ({ ...prev, images }));
    };

    const validateForm = (): boolean => {
        clearErrors();
        let isValid = true;

        if (!product.name.trim()) {
            setFieldError('name', t('products.validation.nameRequired'));
            isValid = false;
        }
        if (product.category_id === 0) {
            setFieldError('category_id', t('products.validation.categoryRequired'));
            isValid = false;
        }
        if (product.price <= 0) {
            setFieldError('price', t('products.validation.priceRequired'));
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await dispatch(addProduct(product));
            router.push('/products');
        } catch (error) {
            setApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            <PageBreadcrumb paths={['products']} pageTitle={t('products.addProduct')} />

            <div className="space-y-5">
                {/* Products Description */}
                <ProductDescriptionSection
                    name={product.name}
                    categoryId={product.category_id}
                    description={product.description}
                    categories={categories}
                    onChange={handleFieldChange}
                    errors={errors}
                />

                {/* Pricing & Availability */}
                <PricingSection
                    price={product.price}
                    prevPrice={product.prevPrice || 0}
                    quantity={product.quantity}
                    showOnHomepage={product.showOnHomepage || false}
                    freeDelivery={product.freeDelivery || false}
                    onChange={handleFieldChange}
                    errors={errors}
                />

                {/* Product Attributes */}
                <ProductAttributesSection
                    attributes={product.attributes || []}
                    onChange={handleAttributesChange}
                />

                {/* Product Images */}
                <ProductImagesSection
                    images={product.images}
                    onChange={handleImagesChange}
                />

                {/* Form Actions */}
                <ProductFormActions
                    isSubmitting={isSubmitting}
                    isEditing={false}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
