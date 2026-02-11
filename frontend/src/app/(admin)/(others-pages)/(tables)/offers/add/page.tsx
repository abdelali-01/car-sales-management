'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProductFormActions from '@/components/products/ProductFormActions';
import OfferDetailsSection from '@/components/offers/OfferDetailsSection';
import OfferPricingSection from '@/components/offers/OfferPricingSection';
import OfferImagesSection, { OfferImageState } from '@/components/offers/OfferImagesSection';
import { AppDispatch } from '@/store/store';
import { createOffer, uploadOfferImages } from '@/store/offers/offersHandler';
import { useFormErrors } from '@/hooks/useFormErrors';
import { useTranslation } from 'react-i18next';
import { addToast } from '@/store/toast/toastSlice';

export default function AddOfferPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { errors, setApiError, setFieldError, clearFieldError, clearErrors } = useFormErrors<Record<string, string>>();
    const { t } = useTranslation('admin');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<OfferImageState[]>([]);

    // Form state matching Offer interface (minus id, createdAt, images)
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        km: 0,
        price: 0,
        location: '',
        ownerName: '',
        ownerPhone: '',
        ownerEmail: '',
        status: 'AVAILABLE' as 'AVAILABLE' | 'RESERVED' | 'SOLD',
        description: '' // Assuming description maps to remarks or extra field if supported, else ignoring?
        // Wait, Offer interface doesn't have description. It has 'location', 'ownerName', etc.
        // I will use 'location' as generic string.
        // Offer interface: brand, model, year, km, price, location, ownerName, ownerPhone, ownerEmail, status.
        // No 'description' field in Offer interface logic I saw earlier.
        // Reviewing types/auto-sales.ts...
        // interface Offer { id, brand, model, year, km, price, location, ownerName, ownerPhone, ownerEmail?, status, images?, createdAt }
        // So no description. I'll remove description or use it if I update the backend.
        // For now I'll ignore description or map it to something else? 
        // I won't send description to backend if it doesn't accept it.
    });

    // We'll remove description from state to avoid confusion, or keep it but not send it?
    // I'll keep it in UI state but not send it to creatingOffer if not supported.
    const [description, setDescription] = useState('');

    const handleFieldChange = (field: string, value: string | number) => {
        if (field === 'description') {
            setDescription(value as string);
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
            if (errors[field]) {
                clearFieldError(field);
            }
        }
    };

    const handleImagesChange = (newImages: OfferImageState[]) => {
        setImages(newImages);
    };

    const validateForm = (): boolean => {
        clearErrors();
        let isValid = true;

        if (!formData.brand.trim()) {
            setFieldError('brand', t('offers.validation.brandRequired'));
            isValid = false;
        }
        if (!formData.model.trim()) {
            setFieldError('model', t('offers.validation.modelRequired'));
            isValid = false;
        }
        if (!formData.year) {
            setFieldError('year', t('offers.validation.yearRequired'));
            isValid = false;
        }
        if (formData.price <= 0) {
            setFieldError('price', t('offers.validation.priceRequired'));
            isValid = false;
        }
        if (!formData.ownerPhone.trim()) {
            setFieldError('ownerPhone', t('offers.validation.phoneRequired'));
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            // 1. Create Offer
            const newOffer = await dispatch(createOffer({
                brand: formData.brand,
                model: formData.model,
                year: formData.year,
                km: formData.km,
                price: formData.price,
                location: formData.location,
                ownerName: formData.ownerName,
                ownerPhone: formData.ownerPhone,
                ownerEmail: formData.ownerEmail,
                status: formData.status,
                // ownerEmail: ... (if we had it)
            }));

            // 2. Upload Images
            const filesToUpload = images.filter(img => img.file).map(img => img.file!);
            if (filesToUpload.length > 0 && newOffer) {
                await dispatch(uploadOfferImages(newOffer.id, filesToUpload));
            }

            router.push('/offers');
        } catch (error) {
            setApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            <PageBreadcrumb paths={['offers']} pageTitle={t('offers.addOffer')} />

            <div className="space-y-5">
                {/* Offer Details */}
                <OfferDetailsSection
                    brand={formData.brand}
                    model={formData.model}
                    year={formData.year}
                    km={formData.km}
                    location={formData.location}
                    description={description}
                    onChange={handleFieldChange}
                    errors={errors}
                />

                {/* Pricing & Contact */}
                <OfferPricingSection
                    price={formData.price}
                    status={formData.status}
                    ownerName={formData.ownerName}
                    ownerPhone={formData.ownerPhone}
                    ownerEmail={formData.ownerEmail}
                    onChange={handleFieldChange}
                    errors={errors}
                />

                {/* Images */}
                <OfferImagesSection
                    images={images}
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
