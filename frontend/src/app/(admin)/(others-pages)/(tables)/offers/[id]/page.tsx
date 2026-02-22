'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProductFormActions from '@/components/products/ProductFormActions';
import OfferDetailsSection from '@/components/offers/OfferDetailsSection';
import OfferPricingStatusSection from '@/components/offers/OfferPricingStatusSection';
import OfferContactSection from '@/components/offers/OfferContactSection';
import OfferImagesSection, { OfferImageState } from '@/components/offers/OfferImagesSection';
import OfferInterestedVisitorsSection from '@/components/offers/OfferInterestedVisitorsSection';
import { AppDispatch, RootState } from '@/store/store';
import { fetchOfferById, updateOffer, uploadOfferImages } from '@/store/offers/offersHandler';
import { useFormErrors } from '@/hooks/useFormErrors';
import { useTranslation } from 'react-i18next';
import { OfferFormSkeleton } from '@/components/skeleton';

export default function EditOfferPage() {
    const params = useParams();
    const offerId = Number(params.id);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
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
        deliveryCompany: '',
        profit: 0,
        status: 'available' as 'available' | 'reserved' | 'sold'
    });
    const [description, setDescription] = useState('');

    useEffect(() => {
        dispatch(fetchOfferById(offerId));
    }, [dispatch, offerId]);

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
                deliveryCompany: '',
                profit: 0,
                status: currentOffer.status as 'available' | 'reserved' | 'sold'
            });
            // Populate images
            if (currentOffer.images && currentOffer.images.length > 0) {
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
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            // Calculate deleted image IDs
            const currentImageIds = images.filter(img => img.id !== undefined).map(img => img.id);
            const initialImageIds = currentOffer?.images?.map(img => img.id) || [];
            const deletedImageIds = initialImageIds.filter(id => !currentImageIds.includes(id));

            await dispatch(updateOffer(offerId, {
                brand: formData.brand,
                model: formData.model,
                year: formData.year,
                km: formData.km,
                price: formData.price,
                location: formData.location,
                ownerName: formData.ownerName,
                ownerPhone: formData.ownerPhone,
                status: formData.status,
                deletedImageIds: deletedImageIds,
                remarks: description,
            }));

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

    if (loading || !currentOffer) {
        return <OfferFormSkeleton />;
    }

    return (
        <div className="space-y-5">
            <PageBreadcrumb paths={['offers']} pageTitle={t('offers.editOffer')} />

            {/* 2-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Left Column */}
                <div className="flex flex-col gap-5 col-span-1 lg:col-span-3 h-full">
                    {/* Car Details */}
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

                    {/* Contact & Delivery Company */}
                    <OfferContactSection
                        ownerName={formData.ownerName}
                        ownerPhone={formData.ownerPhone}
                        deliveryCompany={formData.deliveryCompany}
                        onChange={handleFieldChange}
                        errors={errors}
                    />

                    {/* Interested Visitors */}
                    <OfferInterestedVisitorsSection offerId={offerId} />
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-5 col-span-1 lg:col-span-2 h-full">
                    {/* Pricing & Status */}
                    <OfferPricingStatusSection
                        price={formData.price}
                        status={formData.status}
                        profit={formData.profit}
                        onChange={handleFieldChange}
                        errors={errors}
                    />

                    {/* Images - Grows to fill remaining space */}
                    <div className="flex-1 h-full">
                        <OfferImagesSection
                            images={images}
                            onChange={handleImagesChange}
                        />
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <ProductFormActions
                isSubmitting={isSubmitting}
                isEditing={true}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
