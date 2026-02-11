'use client';
import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { TrashIcon, PencilIcon, MagnifyingGlassIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, FolderIcon } from '@heroicons/react/24/outline';
import { useModal } from '@/hooks/useModal';
import CategoryModal from '../modals/CategoryModal';
import { Modal } from '../ui/modal';
import { Table, TableRow, TableHeader, TableCell, TableBody } from '../ui/table';
import { AppDispatch, RootState } from '@/store/store';
import Badge from '../ui/badge/Badge';
import Loader from '../ui/load/Loader';
import { useDeleteModal } from '@/context/DeleteModalContext';
import { deleteCategory, fetchProductsAndCategories } from '@/store/products/productHandler';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export interface Category {
    id: number;
    name: string;
    image: string;
    description: string;
    // Hierarchy fields
    parentId: number | null;
    parent?: { id: number; name: string } | null;
    childrenCount: number;
    productCount: number;
    children?: Category[];
    createdAt?: string;
    updatedAt?: string;
}


export default function CategoriesTable() {
    const dispatch = useDispatch<AppDispatch>();
    const { openModal, closeModal, isOpen } = useModal();
    const { openModal: openDeleteModal } = useDeleteModal();
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const { categories, loading } = useSelector((state: RootState) => state.products);
    const { t } = useTranslation('admin');

    // Search and expand state
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

    // Fetch categories on mount
    useEffect(() => {
        if (!categories) {
            dispatch(fetchProductsAndCategories());
        }
    }, [dispatch, categories]);

    // Build tree structure from flat categories array
    const categoryTree = useMemo(() => {
        if (!categories) return [];

        // Get root categories
        const roots = categories.filter(cat => !cat.parentId);

        // Build a map for quick lookup
        const categoryMap = new Map<number, Category>();
        categories.forEach(cat => categoryMap.set(cat.id, cat));

        // Get children for a category
        const getChildren = (parentId: number): Category[] => {
            return categories.filter(cat => cat.parentId === parentId);
        };

        // Attach children to each category
        const buildTree = (cats: Category[]): Category[] => {
            return cats.map(cat => ({
                ...cat,
                children: getChildren(cat.id)
            }));
        };

        return buildTree(roots);
    }, [categories]);

    // Filter tree based on search
    const filteredTree = useMemo(() => {
        if (!searchQuery) return categoryTree;

        const searchLower = searchQuery.toLowerCase();

        // Check if category or any of its descendants match search
        const categoryMatches = (cat: Category): boolean => {
            if (cat.name.toLowerCase().includes(searchLower)) return true;
            if (cat.description?.toLowerCase().includes(searchLower)) return true;
            const children = categories?.filter(c => c.parentId === cat.id) || [];
            return children.some(child => categoryMatches(child));
        };

        return categoryTree.filter(cat => categoryMatches(cat));
    }, [categoryTree, searchQuery, categories]);

    // Flatten tree (only showing expanded items)
    const flattenedCategories = useMemo(() => {
        const result: { category: Category; level: number }[] = [];

        const flatten = (cats: Category[], level: number) => {
            cats.forEach(cat => {
                result.push({ category: cat, level });
                const children = categories?.filter(c => c.parentId === cat.id) || [];
                if (children.length > 0 && expandedCategories.has(cat.id)) {
                    flatten(children, level + 1);
                }
            });
        };

        flatten(filteredTree, 0);
        return result;
    }, [filteredTree, expandedCategories, categories]);

    const toggleExpand = (categoryId: number) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }
            return next;
        });
    };

    const expandAll = () => {
        const allWithChildren = categories?.filter(c => c.childrenCount > 0).map(c => c.id) || [];
        setExpandedCategories(new Set(allWithChildren));
    };

    const collapseAll = () => {
        setExpandedCategories(new Set());
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        openModal();
    };

    const handleDeleteConfirm = (category: Category) => {
        // Note: Category has childrenCount subcategories that will also be deleted
        openDeleteModal(category.id, (id) => dispatch(deleteCategory(id as number)));
    };

    if (!categories) return <Loader />;

    return (
        <>
            <div className="space-y-4">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('categories.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                        />
                    </div>

                    {/* Expand/Collapse buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={expandAll}
                            className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
                        >
                            <ChevronDownIcon className="w-4 h-4" />
                            {t('categories.expandAll')}
                        </button>
                        <button
                            onClick={collapseAll}
                            className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
                        >
                            <ChevronUpIcon className="w-4 h-4" />
                            {t('categories.collapseAll')}
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50 dark:bg-gray-800/80">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm"
                                    >
                                        {t('categories.columns.category')}
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-center"
                                    >
                                        {t('categories.columns.subcategories')}
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-center"
                                    >
                                        {t('sidebar.products')}
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 text-sm text-start"
                                    >
                                        {t('common.actions')}
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {flattenedCategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                            {searchQuery ? t('categories.noSearchResults') : t('categories.noCategories')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    flattenedCategories.map(({ category, level }) => {
                                        const hasChildren = (categories?.filter(c => c.parentId === category.id).length || 0) > 0;
                                        const isExpanded = expandedCategories.has(category.id);

                                        return (
                                            <TableRow
                                                key={category.id}
                                                className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${level > 0 ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''}`}
                                            >
                                                <TableCell className="px-4 py-3 min-w-[300px]">
                                                    <div
                                                        className="flex items-center gap-3"
                                                        style={{ paddingLeft: `${level * 24}px` }}
                                                    >
                                                        {/* Expand/Collapse button */}
                                                        <button
                                                            onClick={() => hasChildren && toggleExpand(category.id)}
                                                            className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${hasChildren
                                                                ? 'hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-gray-500'
                                                                : 'text-transparent cursor-default'
                                                                }`}
                                                        >
                                                            {hasChildren && (
                                                                isExpanded
                                                                    ? <ChevronDownIcon className="w-4 h-4" />
                                                                    : <ChevronRightIcon className="w-4 h-4" />
                                                            )}
                                                        </button>

                                                        {/* Category image */}
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                                            {category.image ? (
                                                                <Image
                                                                    src={category.image}
                                                                    alt={category.name}
                                                                    className="w-full h-full object-cover"
                                                                    width={40}
                                                                    height={40}
                                                                    unoptimized
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <FolderIcon className="w-5 h-5 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Category info */}
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                                                                {category.name}
                                                            </span>
                                                            {category.description && (
                                                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                                                    {category.description}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-sm text-center">
                                                    {category.childrenCount > 0 ? (
                                                        <Badge color="info" size="sm">
                                                            {category.childrenCount}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-sm text-center">
                                                    {category.productCount > 0 ? (
                                                        <Badge color="success" size="sm">
                                                            {category.productCount}
                                                        </Badge>
                                                    ) : (
                                                        <Badge color="error" size="sm">0</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(category)}
                                                            className="p-1.5 text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
                                                        >
                                                            <PencilIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteConfirm(category)}
                                                            className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

            </div>

            {isOpen && (
                <Modal isOpen={isOpen} onClose={closeModal} className='max-w-[600px] p-5 lg:p-10'>
                    <CategoryModal
                        closeModal={() => {
                            closeModal();
                            setSelectedCategory(null);
                        }}
                        selectedItem={selectedCategory as Category}
                    />
                </Modal>
            )}
        </>
    )
}