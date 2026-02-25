'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Select from '../form/Select';
import Switch from '../form/switch/Switch';
import { createPromoCode, updatePromoCode } from '@/store/promoCodes/promoCodesHandler';
import { PromoCode } from '@/store/promoCodes/promoCodesSlice';
import DatePicker from '../form/date-picker';

interface PromoCodeModalProps {
    closeModal: () => void;
    selectedItem?: PromoCode;
}

export default function PromoCodeModal({ closeModal, selectedItem }: PromoCodeModalProps) {
    const dispatch = useDispatch<AppDispatch>();

    const [promoCode, setPromoCode] = useState<PromoCode>(selectedItem ? {
        ...selectedItem,
        validFrom: selectedItem.validFrom,
        validUntil: selectedItem.validUntil,
    } : {
        code: '',
        discount: 0,
        type: 'percentage',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: true
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedItem) {
            dispatch(updatePromoCode(promoCode.id!, promoCode));
        } else {
            dispatch(createPromoCode(promoCode));
        }
        closeModal();
    };

    return (
        <form onSubmit={handleSave}>
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
                {selectedItem ? 'Edit Promo Code' : 'Create New Promo Code'}
            </h4>

            <div className='max-h-[60vh] overflow-y-auto'>
                <div className='border border-gray-200 dark:border-white/[0.05] rounded-lg p-5 mb-5'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className='col-span-1 md:col-span-2'>
                            <Label className='font-semibold text-gray-400'>Promo Code</Label>
                            <Input
                                type="text"
                                value={promoCode.code}
                                onChange={(e) => setPromoCode(prev => ({ ...prev, code: e.target.value }))}
                                className="w-full"
                                placeholder="e.g., SUMMER2024"
                                required
                            />
                        </div>
                        <div>
                            <Label className='font-semibold text-gray-400'>Discount Type</Label>
                            <Select
                                defaultValue={promoCode.type}
                                onChange={(value) => setPromoCode(prev => ({ ...prev, type: value as 'percentage' | 'fixed' }))}
                                className="w-full"
                                options={[
                                    { label: 'Percentage (%)', value: 'percentage' },
                                    { label: 'Fixed Amount (M)', value: 'fixed' }
                                ]}
                            />
                        </div>
                        <div>
                            <Label className='font-semibold text-gray-400'>Discount Value</Label>
                            <Input
                                type="number"
                                value={promoCode.discount}
                                onChange={(e) => setPromoCode(prev => ({ ...prev, discount: Number(e.target.value) }))}
                                className="w-full"
                                placeholder={promoCode.type === 'percentage' ? 'e.g., 20' : 'e.g., 1000'}
                                required
                            />
                        </div>
                        <div>
                            <DatePicker
                                id="validFrom"
                                label="Valid From"
                                placeholder="Select start date"
                                defaultDate={selectedItem && promoCode.validFrom}
                                onChange={(dates, currentDateString) => {
                                    setPromoCode(prev => ({
                                        ...prev,
                                        validFrom: currentDateString
                                    }));
                                }}
                            />
                        </div>
                        <div>
                            <DatePicker
                                id="validUntil"
                                label="Valid Until"
                                placeholder="Select end date"
                                defaultDate={selectedItem && promoCode.validUntil}
                                onChange={(dates, currentDateString) => {
                                    setPromoCode(prev => ({
                                        ...prev,
                                        validUntil: currentDateString
                                    }));
                                }}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-lg">
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                                    <div className="text-lg font-semibold text-gray-800 dark:text-white">
                                        {promoCode.isActive ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                                <Switch defaultChecked={promoCode.isActive} onChange={() => setPromoCode((prev) => ({ ...prev, isActive: !prev.isActive }))} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-8">
                <Button size="sm" variant="outline" onClick={closeModal}>
                    Cancel
                </Button>
                <Button size="sm">
                    {selectedItem ? 'Save Changes' : 'Create Promo Code'}
                </Button>
            </div>
        </form>
    );
} 