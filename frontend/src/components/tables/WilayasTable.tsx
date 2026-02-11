'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Table, TableRow, TableHeader, TableCell, TableBody } from '../ui/table';
import { PencilIcon, ChevronDownIcon, ChevronRightIcon, HomeIcon, BuildingStorefrontIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import Badge from '../ui/badge/Badge';
import Loader from '../ui/load/Loader';
import Button from '../ui/button/Button';
import { fetchWilayas, fetchCities, deleteWilaya, deleteCity } from '@/store/wilayas/wilayaHandler';
import { useModal } from '@/hooks/useModal';
import { Modal } from '../ui/modal';
import WilayaModal from '../modals/WilayaModal';
import CityModal from '../modals/CityModal';
import AddWilayaModal from '../modals/AddWilayaModal';
import AddCityModal from '../modals/AddCityModal';
import { Wilaya, City } from '@/store/wilayas/wilayaSlice';
import { useTranslation } from 'react-i18next';

interface WilayaWithShipping extends Wilaya {
    // Support both old format (shipping_prices) and new format (shippingPrices)
    // Note: shippingPrices is now on Wilaya interface, but we add legacy formats
    shipping_prices?: string | { home: number; desk: number };
    // Legacy flat properties for backward compatibility
    homePrice?: number;
    deskPrice?: number;
}

export default function WilayasTable() {
    const dispatch = useDispatch<AppDispatch>();
    const { wilayas, loading } = useSelector((state: RootState) => state.wilayas);
    const { isOpen, openModal, closeModal, selectedItem } = useModal();
    const { isOpen: isCityModalOpen, openModal: openCityModal, closeModal: closeCityModal, selectedItem: selectedCity } = useModal();
    const { isOpen: isAddWilayaOpen, openModal: openAddWilaya, closeModal: closeAddWilaya } = useModal();
    const { isOpen: isAddCityOpen, openModal: openAddCity, closeModal: closeAddCity, selectedItem: selectedWilayaForCity } = useModal();
    const [expandedWilaya, setExpandedWilaya] = useState<number | null>(null);
    const [citiesMap, setCitiesMap] = useState<Record<number, City[]>>({});
    const [loadingCities, setLoadingCities] = useState<number | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'wilaya' | 'city', id: number, name: string } | null>(null);
    const [deleting, setDeleting] = useState(false);
    const { t } = useTranslation('admin');

    useEffect(() => {
        dispatch(fetchWilayas());
    }, [dispatch]);

    // Helper to get shipping prices from either format
    const getShippingPrices = (wilaya: WilayaWithShipping) => {
        // New format: direct properties
        if (wilaya.homePrice !== undefined && wilaya.deskPrice !== undefined) {
            return { home: wilaya.homePrice, desk: wilaya.deskPrice };
        }
        // New API format: shippingPrices object
        if (wilaya.shippingPrices) {
            return wilaya.shippingPrices;
        }
        // Old format: shipping_prices (string or object)
        if (wilaya.shipping_prices) {
            if (typeof wilaya.shipping_prices === 'string') {
                try {
                    return JSON.parse(wilaya.shipping_prices);
                } catch {
                    return { home: 0, desk: 0 };
                }
            }
            return wilaya.shipping_prices;
        }
        return { home: 0, desk: 0 };
    };

    // Check if wilaya is active (support both formats)
    const isWilayaActive = (wilaya: WilayaWithShipping) => {
        if (wilaya.isActive !== undefined) return wilaya.isActive;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((wilaya as any).is_active !== undefined) return (wilaya as any).is_active;
        return true;
    };

    const handleExpandWilaya = async (wilayaId: number) => {
        if (expandedWilaya === wilayaId) {
            setExpandedWilaya(null);
            return;
        }

        setExpandedWilaya(wilayaId);

        // Fetch cities if not already loaded
        if (!citiesMap[wilayaId]) {
            setLoadingCities(wilayaId);
            const cities = await fetchCities(wilayaId);
            setCitiesMap(prev => ({ ...prev, [wilayaId]: cities }));
            setLoadingCities(null);
        }
    };

    const handleCityUpdate = async () => {
        // Refresh cities for the expanded wilaya
        if (expandedWilaya) {
            setLoadingCities(expandedWilaya);
            const cities = await fetchCities(expandedWilaya);
            setCitiesMap(prev => ({ ...prev, [expandedWilaya]: cities }));
            setLoadingCities(null);
        }
    };

    const handleWilayaAdded = () => {
        dispatch(fetchWilayas());
    };

    const handleCityAdded = async () => {
        if (expandedWilaya) {
            setLoadingCities(expandedWilaya);
            const cities = await fetchCities(expandedWilaya);
            setCitiesMap(prev => ({ ...prev, [expandedWilaya]: cities }));
            setLoadingCities(null);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm) return;
        setDeleting(true);
        try {
            if (deleteConfirm.type === 'wilaya') {
                await deleteWilaya(deleteConfirm.id);
                dispatch(fetchWilayas());
            } else {
                await deleteCity(deleteConfirm.id);
                if (expandedWilaya) {
                    const cities = await fetchCities(expandedWilaya);
                    setCitiesMap(prev => ({ ...prev, [expandedWilaya]: cities }));
                }
            }
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setDeleting(false);
            setDeleteConfirm(null);
        }
    };

    if (loading) return <Loader />;
    if (!wilayas || wilayas.length < 1) return (
        <div className="text-center py-10">
            <div className='flex flex-col items-center justify-center gap-4 text-gray-400 dark:text-gray-500'>
                <p>{t('wilayas.noWilayas')}</p>
                <Button size="sm" onClick={() => openAddWilaya(null)}>
                    <PlusIcon className="w-4 h-4 mr-1" />
                    {t('wilayas.addFirst')}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="max-w-full overflow-x-auto">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t('wilayas.count', { count: wilayas.length })}
                </div>
                <Button size="sm" onClick={() => openAddWilaya(null)}>
                    <PlusIcon className="w-4 h-4 mr-1" />
                    {t('wilayas.add')}
                </Button>
            </div>

            <div className="min-w-[1000px]">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-12"
                                >
                                    {/* Expand column */}
                                    <span className="sr-only">Expand</span>
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    {t('wilayas.headers.number')}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    {t('wilayas.headers.name')}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    {t('wilayas.headers.homeDelivery')}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    {t('wilayas.headers.deskDelivery')}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    {t('common.status')}
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    {t('common.actions')}
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {wilayas.map((wilaya: Wilaya) => {
                                const prices = getShippingPrices(wilaya as WilayaWithShipping);
                                const isActive = isWilayaActive(wilaya as WilayaWithShipping);
                                const isExpanded = expandedWilaya === wilaya.id;
                                const cities = citiesMap[wilaya.id] || [];

                                return (
                                    <React.Fragment key={wilaya.id}>
                                        <TableRow className="hover:bg-gray-200 dark:hover:bg-white/[0.05] transition-all duration-200">
                                            <TableCell className="px-4 py-3 text-gray-500 text-start dark:text-gray-400 w-12">
                                                <button
                                                    onClick={() => handleExpandWilaya(wilaya.id)}
                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-white/[0.1] rounded transition-colors"
                                                >
                                                    {isExpanded ? (
                                                        <ChevronDownIcon className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronRightIcon className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start font-semibold dark:text-gray-400">
                                                {wilaya.code || wilaya.id}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start font-semibold dark:text-gray-400">
                                                {wilaya.name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {prices?.home || 0} DA
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {prices?.desk || 0} DA
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <Badge color={isActive ? "success" : "error"}>
                                                    {isActive ? t('common.available') : t('common.unavailable')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openModal(wilaya)}
                                                        className="p-1 text-gray-500 hover:text-primary-500 transition-colors"
                                                        title={t('wilayas.edit')}
                                                    >
                                                        <PencilIcon className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm({ type: 'wilaya', id: wilaya.id, name: wilaya.name })}
                                                        className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                                                        title={t('wilayas.delete')}
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                        {/* Cities Sub-Table */}
                                        {isExpanded && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="p-0">
                                                    <div className="bg-gray-50 dark:bg-white/[0.02] p-4 border-t border-gray-100 dark:border-white/[0.05]">
                                                        {loadingCities === wilaya.id ? (
                                                            <div className="flex justify-center py-4">
                                                                <Loader />
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                                        {t('cities.citiesCount', { count: cities.length })}
                                                                    </h4>
                                                                    <button
                                                                        onClick={() => openAddCity({ id: wilaya.id, name: wilaya.name })}
                                                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
                                                                    >
                                                                        <PlusIcon className="w-3 h-3" />
                                                                        {t('cities.add')}
                                                                    </button>
                                                                </div>
                                                                {cities.length > 0 ? (
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                                        {cities.map((city: City) => (
                                                                            <div
                                                                                key={city.id}
                                                                                className="group relative flex flex-col gap-2 p-3 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-200 hover:shadow-md"
                                                                            >
                                                                                {/* City Name & Actions */}
                                                                                <div className="flex items-start justify-between gap-2">
                                                                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex-1">
                                                                                        {city.communeNameAscii}
                                                                                    </span>
                                                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                        <button
                                                                                            onClick={() => openCityModal(city)}
                                                                                            className="p-1 text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                                                                            title={t('cities.edit')}
                                                                                        >
                                                                                            <PencilIcon className="w-4 h-4" />
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => setDeleteConfirm({ type: 'city', id: city.id, name: city.communeNameAscii })}
                                                                                            className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                                                                            title={t('cities.delete')}
                                                                                        >
                                                                                            <TrashIcon className="w-4 h-4" />
                                                                                        </button>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Shipping Prices */}
                                                                                <div className="flex flex-col gap-1.5">
                                                                                    <div className="flex items-center gap-2 text-xs">
                                                                                        <HomeIcon className="w-3.5 h-3.5 text-blue-500" />
                                                                                        <span className="text-gray-500 dark:text-gray-400">{t('cities.home')}</span>
                                                                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                                                            {city.shippingPrices?.home || 0} DA
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2 text-xs">
                                                                                        <BuildingStorefrontIcon className="w-3.5 h-3.5 text-green-500" />
                                                                                        <span className="text-gray-500 dark:text-gray-400">{t('cities.desk')}</span>
                                                                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                                                            {city.shippingPrices?.desk || 0} DA
                                                                                        </span>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Has Desk Badge */}
                                                                                <div className="mt-1">
                                                                                    <Badge
                                                                                        color={city.hasDesk ? "success" : "warning"}
                                                                                        className="text-xs"
                                                                                    >
                                                                                        {city.hasDesk ? t('cities.hasDesk') : t('cities.noDesk')}
                                                                                    </Badge>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                                                        {t('cities.noCities')}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Edit Wilaya Modal */}
            {isOpen && selectedItem && (
                <Modal isOpen={isOpen} onClose={closeModal} className='max-w-[800px] p-5 lg:p-10'>
                    <WilayaModal closeModal={closeModal} selectedItem={selectedItem} />
                </Modal>
            )}

            {/* Edit City Modal */}
            {isCityModalOpen && selectedCity && (
                <Modal isOpen={isCityModalOpen} onClose={closeCityModal} className='max-w-[800px] p-5 lg:p-10'>
                    <CityModal closeModal={closeCityModal} selectedCity={selectedCity} onSuccess={handleCityUpdate} />
                </Modal>
            )}

            {/* Add Wilaya Modal */}
            {isAddWilayaOpen && (
                <Modal isOpen={isAddWilayaOpen} onClose={closeAddWilaya} className='max-w-[800px] p-5 lg:p-10'>
                    <AddWilayaModal closeModal={closeAddWilaya} onSuccess={handleWilayaAdded} />
                </Modal>
            )}

            {/* Add City Modal */}
            {isAddCityOpen && selectedWilayaForCity && (
                <Modal isOpen={isAddCityOpen} onClose={closeAddCity} className='max-w-[800px] p-5 lg:p-10'>
                    <AddCityModal
                        closeModal={closeAddCity}
                        onSuccess={handleCityAdded}
                        wilayaId={selectedWilayaForCity.id}
                        wilayaName={selectedWilayaForCity.name}
                    />
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <Modal
                    isOpen={!!deleteConfirm}
                    onClose={() => setDeleteConfirm(null)}
                    className='max-w-[400px] p-5'
                >
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                            <TrashIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            {t('common.deleteConfirmation.title', { type: deleteConfirm.type === 'wilaya' ? t('wilayas.headers.name') : t('cities.title') })}
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            {t('common.deleteConfirmation.message', { name: deleteConfirm.name })}
                            {deleteConfirm.type === 'wilaya' && (
                                <span className="block mt-1 text-red-500 text-sm">
                                    {t('wilayas.deleteWarning')}
                                </span>
                            )}
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeleteConfirm(null)}
                                disabled={deleting}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                size="sm"
                                className="bg-red-500 hover:bg-red-600"
                                onClick={handleDeleteConfirm}
                                disabled={deleting}
                            >
                                {deleting ? t('common.deleting') : t('common.delete')}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
