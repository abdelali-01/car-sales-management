'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProductFormActions from '@/components/products/ProductFormActions';
import OfferDetailsSection from '@/components/offers/OfferDetailsSection';
import OfferPricingStatusSection from '@/components/offers/OfferPricingStatusSection';
import OfferContactSection from '@/components/offers/OfferContactSection';
import OfferImagesSection, { OfferImageState } from '@/components/offers/OfferImagesSection';
import { AppDispatch } from '@/store/store';
import { createOffer, uploadOfferImages } from '@/store/offers/offersHandler';
import { useFormErrors } from '@/hooks/useFormErrors';
import { useTranslation } from 'react-i18next';
import { DatePrecision } from '@/components/offers/YearPrecisionPicker';

export default function AddOfferPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { errors, setApiError, setFieldError, clearFieldError, clearErrors } = useFormErrors<Record<string, string>>();
    const { t } = useTranslation('admin');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<OfferImageState[]>([]);

    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        month: undefined as number | undefined,
        day: undefined as number | undefined,
        km: 0,
        price: 0,
        location: '',
        region: '',
        originCountry: '',
        ownerName: '',
        ownerPhone: '',
        deliveryCompany: '',
        profit: 0,
        status: 'available' as 'available' | 'reserved' | 'sold',
    });
    const [datePrecision, setDatePrecision] = useState<DatePrecision>('year');

    const [description, setDescription] = useState('');

    const handleFieldChange = (field: string, value: string | number | undefined) => {
        if (field === 'description') {
            setDescription(value as string);
        } else if (field === 'precision') {
            setDatePrecision(value as DatePrecision);
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
            const newOffer = await dispatch(createOffer({
                brand: formData.brand,
                model: formData.model,
                year: formData.year,
                month: formData.month,
                day: formData.day,
                km: formData.km,
                price: formData.price,
                location: formData.location,
                region: formData.region || undefined,
                originCountry: formData.originCountry || undefined,
                ownerName: formData.ownerName,
                ownerPhone: formData.ownerPhone,
                status: formData.status,
                remarks: description,
            }));

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

            {/* 2-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Left Column */}
                <div className="flex flex-col gap-5 col-span-1 lg:col-span-3 h-full">
                    {/* Car Details */}
                    <OfferDetailsSection
                        brand={formData.brand}
                        model={formData.model}
                        year={formData.year}
                        month={formData.month}
                        day={formData.day}
                        precision={datePrecision}
                        km={formData.km}
                        location={formData.location}
                        region={formData.region}
                        originCountry={formData.originCountry}
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
                isEditing={false}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
