'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProductDescriptionSection from '@/components/products/ProductDescriptionSection';
import PricingSection from '@/components/products/PricingSection';
import ProductAttributesSection from '@/components/products/ProductAttributesSection';
import ProductImagesSection from '@/components/products/ProductImagesSection';
import ProductFormActions from '@/components/products/ProductFormActions';
import { AppDispatch, RootState } from '@/store/store';
import { addProduct, updateProduct, fetchProductsAndCategories } from '@/store/products/productHandler';
import { Product, Attribute } from '../add/page';
import Loader from '@/components/ui/load/Loader';
import { useFormErrors } from '@/hooks/useFormErrors';
import { useTranslation } from 'react-i18next';

export default function EditProductPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const params = useParams();
    const productId = params?.id ? Number(params.id) : null;
    const { errors, setApiError, setFieldError, clearFieldError, clearErrors } = useFormErrors<Record<string, string>>();
    const { t } = useTranslation('admin');

    const { categories, products, loading } = useSelector((state: RootState) => state.products);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [productLoaded, setProductLoaded] = useState(false);
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
    console.log('product state', product)

    // Fetch categories and products on mount
    useEffect(() => {
        if (!products || !categories) {
            dispatch(fetchProductsAndCategories());
        }
    }, [dispatch, products, categories]);

    // Load product data when editing
    useEffect(() => {
        if (productId && products && !productLoaded) {
            const existingProduct = products.find((p: Product) => p.id === productId);
            if (existingProduct) {
                setProduct({
                    ...existingProduct,
                    category_id: existingProduct.category_id || 0,
                    prevPrice: existingProduct.prevPrice || 0,
                    showOnHomepage: existingProduct.showOnHomepage,
                    freeDelivery: existingProduct.freeDelivery,
                    attributes: existingProduct.attributes || []
                });
                setProductLoaded(true);
            }
        }
    }, [productId, products, productLoaded]);

    // Set default category when categories load (only for new products)
    useEffect(() => {
        if (categories && categories.length > 0 && product.category_id === 0 && !productId) {
            setProduct(prev => ({ ...prev, category_id: categories[0].id }));
        }
    }, [categories, product.category_id, productId]);

    const handleFieldChange = (field: string, value: string | number | boolean) => {
        setProduct(prev => ({ ...prev, [field]: value }));
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
            if (productId) {
                // Update existing product
                await dispatch(updateProduct(productId, product));
            } else {
                // Create new product
                await dispatch(addProduct(product));
            }
            router.push('/products');
        } catch (error) {
            setApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loader while fetching product data
    if (productId && loading && !productLoaded) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader />
            </div>
        );
    }

    const pageTitle = productId ? t('products.editProduct') : t('products.addProduct');

    return (
        <div className="space-y-5">
            <PageBreadcrumb paths={['products']} pageTitle={pageTitle} />

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
                    showOnHomepage={product.showOnHomepage}
                    freeDelivery={product.freeDelivery}
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
                    isEditing={!!productId}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
