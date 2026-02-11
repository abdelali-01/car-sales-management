'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { addPixel, updatePixel } from '@/store/pixels/pixelsHandler';
import { Pixel } from '@/store/pixels/pixelSlice';
import { useTranslation } from 'react-i18next';

interface PixelModalProps {
    closeModal: () => void;
    selectedItem?: Pixel;
}

export default function PixelModal({ closeModal, selectedItem }: PixelModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { t } = useTranslation('admin');

    const [pixel, setPixel] = useState<Pixel>(selectedItem ? {
        ...selectedItem,
    } : {
        id: '',
        name: ''
    });

    const [newId, setNewId] = useState<string>(selectedItem?.id || '');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedItem) {
            // When updating, pass the new ID if it changed
            const updateData: any = { name: pixel.name };
            if (newId !== selectedItem.id) {
                updateData.newId = newId;
            }
            dispatch(updatePixel(selectedItem.id, updateData));
        } else {
            dispatch(addPixel({ id: pixel.id, name: pixel.name }));
        }
        closeModal();
    };

    return (
        <form onSubmit={handleSave}>
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
                {selectedItem ? t('pixels.editPixel') : t('pixels.createPixel')}
            </h4>

            <div className='max-h-[60vh] overflow-y-auto'>
                <div className='border border-gray-200 dark:border-white/[0.05] rounded-lg p-5 mb-5'>
                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('pixels.form.pixelId')}</Label>
                            <Input
                                type="text"
                                value={selectedItem ? newId : pixel.id}
                                onChange={(e) => {
                                    if (selectedItem) {
                                        setNewId(e.target.value);
                                    } else {
                                        setPixel(prev => ({ ...prev, id: e.target.value }));
                                    }
                                }}
                                className="w-full"
                                placeholder={t('pixels.form.pixelIdPlaceholder')}
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {selectedItem
                                    ? t('pixels.form.editHint')
                                    : t('pixels.form.createHint')}
                            </p>
                        </div>
                        <div>
                            <Label className='font-semibold text-gray-400'>{t('pixels.form.pixelName')}</Label>
                            <Input
                                type="text"
                                value={pixel.name}
                                onChange={(e) => setPixel(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full"
                                placeholder={t('pixels.form.pixelNamePlaceholder')}
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {t('pixels.form.nameHint')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-8">
                <Button size="sm" variant="outline" onClick={closeModal} type="button">
                    {t('common.cancel')}
                </Button>
                <Button size="sm" type="submit">
                    {selectedItem ? t('pixels.saveChanges') : t('pixels.createPixel')}
                </Button>
            </div>
        </form>
    );
}
