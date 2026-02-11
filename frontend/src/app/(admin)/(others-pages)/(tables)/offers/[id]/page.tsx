'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProductFormActions from '@/components/products/ProductFormActions';
import OfferDetailsSection from '@/components/offers/OfferDetailsSection';
import OfferPricingSection from '@/components/offers/OfferPricingSection';
import OfferImagesSection, { OfferImageState } from '@/components/offers/OfferImagesSection';
import { AppDispatch, RootState } from '@/store/store';
import { fetchOfferById, updateOffer, uploadOfferImages } from '@/store/offers/offersHandler'; // We rely on updateOffer
import { useFormErrors } from '@/hooks/useFormErrors';
import { useTranslation } from 'react-i18next';
import Loader from '@/components/ui/load/Loader';

export default function EditOfferPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const params = useParams();
    const offerId = params?.id ? Number(params.id) : null;
    const { errors, setApiError, setFieldError, clearFieldError, clearErrors } = useFormErrors<Record<string, string>>();
    const { t } = useTranslation('admin');

    const { currentOffer, loading } = useSelector((state: RootState) => state.offers);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<OfferImageState[]>([]);

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
        status: 'AVAILABLE' as 'AVAILABLE' | 'RESERVED' | 'SOLD'
    });
    const [description, setDescription] = useState('');

    // Fetch Offer
    useEffect(() => {
        if (offerId) {
            dispatch(fetchOfferById(offerId));
        }
    }, [dispatch, offerId]);

    // Populate Form
    useEffect(() => {
        if (currentOffer && currentOffer.id === offerId) {
            setFormData({
                brand: currentOffer.brand,
                model: currentOffer.model,
                year: currentOffer.year,
                km: currentOffer.km,
                price: currentOffer.price,
                location: currentOffer.location,
                ownerName: currentOffer.ownerName,
                ownerPhone: currentOffer.ownerPhone,
                ownerEmail: currentOffer.ownerEmail || '',
                status: currentOffer.status
            });
            // Populate images
            if (currentOffer.images) {
                setImages(currentOffer.images.map(img => ({
                    url: img.imageUrl,
                    id: img.id
                })));
            }
        }
    }, [currentOffer, offerId]);

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
        if (!offerId || !validateForm()) return;

        setIsSubmitting(true);
        try {
            // 1. Update Offer
            await dispatch(updateOffer(offerId, {
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
            }));

            // 2. Upload New Images
            // Filter images that have a File object
            const filesToUpload = images.filter(img => img.file).map(img => img.file!);
            if (filesToUpload.length > 0) {
                await dispatch(uploadOfferImages(offerId, filesToUpload));
            }

            router.push('/offers');
        } catch (error) {
            setApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && !currentOffer) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <PageBreadcrumb paths={['offers']} pageTitle={t('offers.editOffer')} />

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
                    isEditing={true}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
