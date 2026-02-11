import React, { useState, useMemo } from 'react'
import Button from '../ui/button/Button'
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { useDispatch, useSelector } from 'react-redux';
import TextArea from '../form/input/TextArea';
import { addCategory, updateCategory } from '@/store/products/productHandler';
import { AppDispatch, RootState } from '@/store/store';
import Image from 'next/image';
import { Category } from '../tables/CategoriesTable';
import { ChevronDownIcon, FolderIcon, CheckIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useFormErrors } from '@/hooks/useFormErrors';
import { useTranslation } from 'react-i18next';

interface CategoryModalProps {
    closeModal: () => void;
    selectedItem?: Category;
}

export default function CategoryModal({ closeModal, selectedItem }: CategoryModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { categories } = useSelector((state: RootState) => state.products);
    const { errors, setFieldError, clearFieldError, clearErrors, setApiError } = useFormErrors<Record<string, string>>();
    const { t } = useTranslation('admin');

    const [category, setCategory] = useState<Partial<Category>>(selectedItem || {
        name: '',
        description: '',
        image: '',
        parentId: null
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(selectedItem?.image ? `${selectedItem.image}` : null);
    const [isParentSelectorOpen, setIsParentSelectorOpen] = useState(false);
    const [parentSearch, setParentSearch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get available parent categories (excluding self and descendants when editing)
    const availableParents = useMemo(() => {
        if (!categories) return [];

        // If editing, exclude the category itself
        let result = categories.filter(cat => cat.id !== selectedItem?.id);

        // Also exclude any descendants of this category (to prevent circular references)
        if (selectedItem) {
            const findDescendants = (parentId: number): number[] => {
                const children = categories.filter(cat => cat.parentId === parentId);
                const descendantIds: number[] = children.map(c => c.id);
                children.forEach(child => {
                    descendantIds.push(...findDescendants(child.id));
                });
                return descendantIds;
            };
            const descendantIds = findDescendants(selectedItem.id);
            result = result.filter(cat => !descendantIds.includes(cat.id));
        }

        return result;
    }, [categories, selectedItem]);

    // Build tree structure for parent selector
    const parentTree = useMemo(() => {
        const roots = availableParents.filter(cat => !cat.parentId);

        const getChildren = (parentId: number): Category[] => {
            return availableParents.filter(cat => cat.parentId === parentId);
        };

        // Flatten tree with depth info for display
        const flatten = (cats: Category[], depth: number): { cat: Category; depth: number }[] => {
            const result: { cat: Category; depth: number }[] = [];
            cats.forEach(cat => {
                result.push({ cat, depth });
                result.push(...flatten(getChildren(cat.id), depth + 1));
            });
            return result;
        };

        return flatten(roots, 0);
    }, [availableParents]);

    // Filter parents by search
    const filteredParents = useMemo(() => {
        if (!parentSearch) return parentTree;
        const searchLower = parentSearch.toLowerCase();
        return parentTree.filter(({ cat }) =>
            cat.name.toLowerCase().includes(searchLower)
        );
    }, [parentTree, parentSearch]);

    // Get selected parent info
    const selectedParent = useMemo(() => {
        if (category.parentId === null || category.parentId === undefined) return null;
        return categories?.find(cat => cat.id === category.parentId);
    }, [category.parentId, categories]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategory(prev => ({ ...prev, name: e.target.value }));
        if (errors.name) {
            clearFieldError('name');
        }
    };

    const validateForm = (): boolean => {
        clearErrors();
        let isValid = true;

        if (!category.name?.trim()) {
            setFieldError('name', t('categories.validation.nameRequired'));
            isValid = false;
        }

        return isValid;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', category.name || '');
            formData.append('description', category.description || '');

            // Add parentId - handle both null and number
            if (category.parentId !== undefined && category.parentId !== null) {
                formData.append('parentId', category.parentId.toString());
            }

            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (selectedItem) {
                await dispatch(updateCategory(selectedItem.id!, formData));
            } else {
                await dispatch(addCategory(formData));
            }
            closeModal();
        } catch (error) {
            setApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectParent = (parentId: number | null) => {
        setCategory(prev => ({ ...prev, parentId }));
        setIsParentSelectorOpen(false);
        setParentSearch('');
    };

    return (
        <form onSubmit={handleSave}>
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
                {selectedItem ? t('categories.editCategory') : t('categories.createCategory')}
            </h4>

            <div className='space-y-4'>
                <div>
                    <Label className='font-semibold text-gray-400'>{t('categories.form.name')}</Label>
                    <Input
                        type="text"
                        value={category.name || ''}
                        onChange={handleNameChange}
                        className="w-full"
                        placeholder={t('categories.form.namePlaceholder')}
                        required
                        error={!!errors.name}
                        hint={errors.name}
                    />
                </div>

                {/* Improved Parent Category Selector */}
                <div>
                    <Label className='font-semibold text-gray-400'>{t('categories.form.parentCategory')}</Label>
                    <div className="relative">
                        {/* Selected value display */}
                        <button
                            type="button"
                            onClick={() => setIsParentSelectorOpen(!isParentSelectorOpen)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-left flex items-center justify-between gap-2 hover:border-brand-300 dark:hover:border-gray-600 transition-colors"
                        >
                            {selectedParent ? (
                                <div className="flex items-center gap-2">
                                    <FolderIcon className="w-4 h-4 text-brand-500" />
                                    <span className="text-gray-900 dark:text-white text-sm">{selectedParent.name}</span>
                                    {selectedParent.parent && (
                                        <span className="text-gray-500 text-xs">{t('categories.form.in')} {selectedParent.parent.name}</span>
                                    )}
                                </div>
                            ) : (
                                <span className="text-gray-500 text-sm">{t('categories.form.noParent')}</span>
                            )}
                            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isParentSelectorOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown panel */}
                        {isParentSelectorOpen && (
                            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-72 overflow-hidden">
                                {/* Search input */}
                                <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={t('categories.search')}
                                            value={parentSearch}
                                            onChange={(e) => setParentSearch(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Options list */}
                                <div className="overflow-y-auto max-h-52">
                                    {/* Root option */}
                                    <button
                                        type="button"
                                        onClick={() => selectParent(null)}
                                        className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${category.parentId === null ? 'bg-brand-50 dark:bg-brand-500/10' : ''}`}
                                    >
                                        <div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                                            {category.parentId === null && <CheckIcon className="w-3 h-3 text-brand-500" />}
                                        </div>
                                        <span className="text-gray-900 dark:text-white text-sm font-medium">{t('categories.form.noParent')}</span>
                                    </button>

                                    {/* Category options */}
                                    {filteredParents.length === 0 && parentSearch && (
                                        <div className="px-4 py-3 text-center text-gray-500 text-sm">
                                            {t('categories.noMatch', { search: parentSearch })}
                                        </div>
                                    )}
                                    {filteredParents.map(({ cat, depth }) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => selectParent(cat.id)}
                                            className={`w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${category.parentId === cat.id ? 'bg-brand-50 dark:bg-brand-500/10' : ''}`}
                                            style={{ paddingLeft: `${16 + depth * 20}px` }}
                                        >
                                            <div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                                                {category.parentId === cat.id && <CheckIcon className="w-3 h-3 text-brand-500" />}
                                            </div>
                                            <FolderIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-gray-900 dark:text-white text-sm truncate">{cat.name}</span>
                                                {cat.childrenCount > 0 && (
                                                    <span className="text-xs text-gray-500">{cat.childrenCount} subcategories</span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {t('categories.form.parentHint')}
                    </p>
                </div>

                <div>
                    <Label className='font-semibold text-gray-400'>{t('categories.form.description')}</Label>
                    <TextArea
                        value={category.description || ''}
                        onChange={(value) => setCategory(prev => ({ ...prev, description: value }))}
                        className="w-full p-2 border border-gray-200 dark:border-white/[0.05] rounded-lg"
                        rows={3}
                        placeholder={t('categories.form.descriptionPlaceholder')}
                    />
                </div>

                <div>
                    <Label className='font-semibold text-gray-400'>{t('categories.form.image')}</Label>
                    <div className="flex gap-3">
                        {preview && (
                            <div className="relative group">
                                <Image
                                    width={140}
                                    height={140}
                                    src={preview}
                                    alt="Preview"
                                    className="rounded-lg object-cover min-w-[140px] md:min-w-[200px] aspect-square bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImageFile(null);
                                        setPreview(null);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                        {!preview && (
                            <label className="min-w-[140px] md:min-w-[200px] aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </label>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-8">
                <Button size="sm" variant="outline" onClick={closeModal} type="button" disabled={isSubmitting}>
                    {t('common.cancel')}
                </Button>
                <Button size="sm" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t('categories.saving') : (selectedItem ? t('categories.saveChanges') : t('categories.create'))}
                </Button>
            </div>
        </form>
    )
}