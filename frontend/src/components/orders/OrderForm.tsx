import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useTranslation } from 'react-i18next';
import { fetchOffers } from '@/store/offers/offersHandler';
import { fetchClients } from '@/store/clients/clientsHandler';
import { fetchVisitors } from '@/store/visitors/visitorsHandler';
import { Order, Offer } from '@/types/auto-sales';
import Input from '../ui/input/Input';
import Select from '../ui/select/Select';
import Button from '../ui/button/Button';
import CustomerSelector from './CustomerSelector';
import VehicleSelector from './VehicleSelector';
import { useRouter, useSearchParams } from 'next/navigation';
import { XMarkIcon, DocumentArrowUpIcon, UserIcon, UserGroupIcon, UserPlusIcon, TruckIcon, PhoneIcon, IdentificationIcon, DocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface OrderFormProps {
    initialData?: Partial<Order>;
    onSubmit: (data: any, passportFile?: File, newDocuments?: File[]) => Promise<void>;
    isSubmitting: boolean;
    isEditing?: boolean;
    onDeleteDocument?: (docId: number) => Promise<void>;
    onUploadDocument?: (file: File, name: string) => Promise<void>;
}

export default function OrderForm({ initialData, onSubmit, isSubmitting, isEditing = false, onDeleteDocument, onUploadDocument }: OrderFormProps) {
    const { t } = useTranslation('admin');
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    // Data Sources
    const offers = useSelector((state: RootState) => state.offers.offers);
    const clients = useSelector((state: RootState) => state.clients.clients);
    const visitors = useSelector((state: RootState) => state.visitors.visitors);

    // Modes
    const initialOrderSource = initialData?.orderedCar ? 'custom' : 'inventory';
    const [orderSource, setOrderSource] = useState<'inventory' | 'custom'>(initialOrderSource);

    const initialCustomerMode = initialData?.clientId ? 'client' : initialData?.visitorId ? 'visitor' : 'custom';
    const [customerMode, setCustomerMode] = useState<'client' | 'visitor' | 'custom'>(initialCustomerMode);

    // Form State
    const [formData, setFormData] = useState({
        offerId: initialData?.offerId || 0,
        visitorId: initialData?.visitorId || 0,
        clientId: initialData?.clientId || 0,
        clientName: initialData?.clientName || '',
        clientPhone: initialData?.clientPhone || '',
        clientEmail: initialData?.clientEmail || '',
        agreedPrice: initialData?.agreedPrice || 0,
        deposit: initialData?.deposit || 0,
        remarks: initialData?.remarks || '',
        status: initialData?.status || 'pending',
        type: initialData?.type || 'inside',
        processStatus: initialData?.processStatus || 'pending',
        deliveryCompany: initialData?.deliveryCompany || '',
        containerId: initialData?.containerId || '',
        passportImage: initialData?.passportImage || '',
    });

    // Custom Car Details
    const [customCar, setCustomCar] = useState({
        brand: initialData?.orderedCar?.brand || '',
        model: initialData?.orderedCar?.model || '',
        year: initialData?.orderedCar?.year || new Date().getFullYear(),
        color: initialData?.orderedCar?.color || '',
        vin: initialData?.orderedCar?.vin || '',
        description: initialData?.orderedCar?.description || '',
    });

    const [passportFile, setPassportFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.passportImage || null);
    const [newDocuments, setNewDocuments] = useState<File[]>([]);

    // Fetch Data on Mount
    useEffect(() => {
        if (!offers) dispatch(fetchOffers());
        if (!clients) dispatch(fetchClients());
        if (!visitors) dispatch(fetchVisitors());
    }, [dispatch, offers, clients, visitors]);

    // Auto-fill from URL Params
    const searchParams = useSearchParams();
    const paramOfferId = searchParams.get('offerId');
    const paramVisitorId = searchParams.get('visitorId');

    useEffect(() => {
        if (!isEditing && (paramOfferId || paramVisitorId)) {
            setFormData(prev => {
                const updated = { ...prev };

                // Pre-select Offer
                if (paramOfferId) {
                    updated.offerId = Number(paramOfferId);
                }

                // Pre-select Visitor
                if (paramVisitorId) {
                    updated.visitorId = Number(paramVisitorId);
                    const visitor = visitors?.find(v => v.id === Number(paramVisitorId));
                    if (visitor) {
                        setCustomerMode('visitor');
                        updated.visitorId = visitor.id;
                        updated.clientName = visitor.name;
                        updated.clientPhone = visitor.phone;
                        updated.clientEmail = visitor.email || '';
                    }
                }
                return updated;
            });
        }
    }, [paramOfferId, paramVisitorId, isEditing, visitors]);

    // Handlers
    const handleChange = (field: string, value: any) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value };

            // Auto-fill deposit for Outside orders (Adding mode only)
            if (!isEditing) {
                if (field === 'type' && value === 'outside') {
                    // When switching to outside, set deposit to current agreed price
                    updated.deposit = updated.agreedPrice;
                }
                if (field === 'agreedPrice' && updated.type === 'outside') {
                    // Keep deposit synced with price for outside orders
                    updated.deposit = value;
                }
            }

            return updated;
        });

        // Auto-fill customer details
        if (field === 'clientId') {
            const client = clients?.find(c => c.id === Number(value));
            if (client) {
                setFormData(prev => ({
                    ...prev,
                    clientId: client.id,
                    clientName: client.name,
                    clientPhone: client.phone,
                    clientEmail: client.email || ''
                }));
            }
        }
        if (field === 'visitorId') {
            const visitor = visitors?.find(v => v.id === Number(value));
            if (visitor) {
                setFormData(prev => ({
                    ...prev,
                    visitorId: visitor.id,
                    clientName: visitor.name,
                    clientPhone: visitor.phone,
                    clientEmail: visitor.email || ''
                }));
            }
        }
    };

    const handleCustomCarChange = (field: string, value: any) => {
        setCustomCar(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPassportFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemovePassport = () => {
        setPassportFile(null);
        setPreviewUrl(null);
        handleChange('passportImage', '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: any = { ...formData };

        // Clean up based on mode
        if (orderSource === 'custom') {
            delete payload.offerId;
            payload.orderedCar = customCar;
        } else {
            if (payload.offerId === 0) {
                alert('Please select an offer');
                return;
            }
        }

        if (customerMode === 'client') {
            payload.visitorId = undefined;
            if (payload.clientId === 0) { alert('Please select a client'); return; }
        } else if (customerMode === 'visitor') {
            payload.clientId = undefined;
            if (payload.visitorId === 0) { alert('Please select a visitor'); return; }
        } else {
            payload.clientId = undefined;
            payload.visitorId = undefined;
        }

        onSubmit(payload, passportFile || undefined, newDocuments);
    };

    const handleCancel = () => {
        router.push('/orders');
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">

            {/* LEFT COLUMN (2/3 width on large screens) */}
            <div className="xl:col-span-2 flex flex-col gap-6">

                {/* 1. CAR DETAILS / OFFER SELECTION */}
                <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 shadow-sm relative overflow-visible flex-none">
                    <div className="flex justify-between items-start mb-5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            Car Details
                        </h3>
                        {/* Source Toggle */}
                        {!isEditing && (
                            <div className="flex bg-gray-100 dark:bg-gray-700/50 rounded-lg p-0.5">
                                <button type="button" onClick={() => setOrderSource('inventory')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${orderSource === 'inventory' ? 'bg-white dark:bg-gray-600 shadow-sm text-brand-600 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
                                    Inventory
                                </button>
                                <button type="button" onClick={() => setOrderSource('custom')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${orderSource === 'custom' ? 'bg-white dark:bg-gray-600 shadow-sm text-brand-600 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
                                    Custom Request
                                </button>
                            </div>
                        )}
                    </div>

                    {orderSource === 'inventory' ? (
                        <div className="space-y-4">
                            <VehicleSelector
                                offers={offers}
                                selectedId={formData.offerId}
                                onSelect={(id) => handleChange('offerId', id)}
                                disabled={isEditing}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Brand" value={customCar.brand} onChange={e => handleCustomCarChange('brand', e.target.value)} required={orderSource === 'custom'} />
                            <Input label="Model" value={customCar.model} onChange={e => handleCustomCarChange('model', e.target.value)} required={orderSource === 'custom'} />
                            <Input label="Year" type="number" value={customCar.year} onChange={e => handleCustomCarChange('year', Number(e.target.value))} required={orderSource === 'custom'} />
                            <Input label="Color" value={customCar.color} onChange={e => handleCustomCarChange('color', e.target.value)} required={orderSource === 'custom'} />
                            <Input label="VIN" value={customCar.vin} onChange={e => handleCustomCarChange('vin', e.target.value)} />
                            <Input label="Description" value={customCar.description} onChange={e => handleCustomCarChange('description', e.target.value)} />
                        </div>
                    )}
                </div>

                {/* 2. CUSTOMER & PRICING */}
                <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 shadow-sm flex-none">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Customer Section */}
                        {/* Customer Section */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer</h3>
                                {/* Customer Mode Toggle */}
                                {!isEditing && (
                                    <div className="flex bg-gray-100 dark:bg-gray-700/50 rounded-lg p-0.5">
                                        <button type="button" onClick={() => { setCustomerMode('client'); setFormData(prev => ({ ...prev, clientId: 0, clientName: '', clientPhone: '' })); }}
                                            className={`p-1.5 rounded-md transition-all ${customerMode === 'client' ? 'bg-white dark:bg-gray-600 shadow text-brand-600 dark:text-white' : 'text-gray-400 hover:text-gray-600'}`} title="Existing Client">
                                            <UserGroupIcon className="w-5 h-5" />
                                        </button>
                                        <button type="button" onClick={() => { setCustomerMode('visitor'); setFormData(prev => ({ ...prev, visitorId: 0, clientName: '', clientPhone: '' })); }}
                                            className={`p-1.5 rounded-md transition-all ${customerMode === 'visitor' ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600'}`} title="Visitor">
                                            <UserIcon className="w-5 h-5" />
                                        </button>
                                        <button type="button" onClick={() => { setCustomerMode('custom'); setFormData(prev => ({ ...prev, clientId: 0, visitorId: 0, clientName: '', clientPhone: '' })); }}
                                            className={`p-1.5 rounded-md transition-all ${customerMode === 'custom' ? 'bg-white dark:bg-gray-600 shadow text-green-600 dark:text-green-400' : 'text-gray-400 hover:text-gray-600'}`} title="New Customer">
                                            <UserPlusIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                                {isEditing && (
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${customerMode === 'client' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' :
                                        customerMode === 'visitor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                        }`}>
                                        {customerMode === 'client' ? 'Client' : customerMode === 'visitor' ? 'Visitor' : 'Custom Customer'}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                {!isEditing ? (
                                    <>
                                        {customerMode === 'client' && (
                                            <CustomerSelector
                                                mode="client"
                                                clients={clients}
                                                selectedId={formData.clientId}
                                                onSelect={(id) => handleChange('clientId', id)}
                                            />
                                        )}

                                        {customerMode === 'visitor' && (
                                            <CustomerSelector
                                                mode="visitor"
                                                visitors={visitors}
                                                selectedId={formData.visitorId}
                                                onSelect={(id) => handleChange('visitorId', id)}
                                            />
                                        )}

                                        {customerMode === 'custom' && (
                                            <div className="grid grid-cols-1 gap-4">
                                                <Input label="Full Name" value={formData.clientName} onChange={e => handleChange('clientName', e.target.value)} required />
                                                <Input label="Phone Number" value={formData.clientPhone} onChange={e => handleChange('clientPhone', e.target.value)} required />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                                                <div className="text-gray-900 dark:text-white font-medium">{formData.clientName || 'N/A'}</div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone Number</label>
                                                <div className="text-gray-900 dark:text-white font-medium">{formData.clientPhone || 'N/A'}</div>
                                            </div>
                                            {formData.clientEmail && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
                                                    <div className="text-gray-900 dark:text-white font-medium">{formData.clientEmail}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pricing Section (Right of Customer) */}
                        <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-6 md:pt-0 md:pl-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pricing</h3>
                            <div className="space-y-4">
                                <Input
                                    label="Agreed Price (DA)"
                                    type="number"
                                    value={formData.agreedPrice}
                                    onChange={e => handleChange('agreedPrice', Number(e.target.value))}
                                    required
                                    className="text-lg font-medium"
                                />
                                <Input
                                    label="Deposit (DA)"
                                    type="number"
                                    value={formData.deposit}
                                    onChange={e => handleChange('deposit', Number(e.target.value))}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. LOGISTICS (Flex Grow) */}
                <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 shadow-sm flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-5 flex-none">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Logistics & Status</h3>
                        {!isEditing ? (
                            <div className="flex bg-gray-100 dark:bg-gray-700/50 rounded-lg p-0.5">
                                <button type="button" onClick={() => handleChange('type', 'inside')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${formData.type === 'inside' ? 'bg-white shadow text-brand-600' : 'text-gray-500'}`}>
                                    Inside
                                </button>
                                <button type="button" onClick={() => handleChange('type', 'outside')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${formData.type === 'outside' ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}>
                                    Outside
                                </button>
                            </div>
                        ) : (
                            <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider ${formData.type === 'inside' ? 'bg-brand-50 text-brand-700 border border-brand-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                                {formData.type}
                            </span>
                        )}
                    </div>

                    <div className="mb-6">
                        <Select
                            label="Order Status"
                            value={formData.status}
                            onChange={e => handleChange('status', e.target.value)}
                            options={[
                                { value: 'pending', label: 'Pending' },
                                { value: 'confirmed', label: 'Confirmed' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'canceled', label: 'Canceled' }
                            ]}
                        />
                    </div>

                    {formData.type === 'outside' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-500/20 flex-none">
                            <Select label="Process Status" value={formData.processStatus} onChange={e => handleChange('processStatus', e.target.value)}
                                options={[
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'transition', label: 'Transition' },
                                    { value: 'paper_prepare', label: 'Paper Prepare' },
                                    { value: 'in_delivery', label: 'In Delivery' },
                                    { value: 'in_the_port', label: 'In The Port' }
                                ]}
                            />
                            <Input label="Delivery Company" value={formData.deliveryCompany} onChange={e => handleChange('deliveryCompany', e.target.value)} icon={<TruckIcon className="w-4 h-4" />} />
                            <Input label="Container ID" value={formData.containerId} onChange={e => handleChange('containerId', e.target.value)} />
                        </div>
                    )}
                </div>

            </div>

            {/* RIGHT COLUMN (1/3 width) */}
            <div className="flex flex-col gap-6">

                {/* 4. PASSPORT IMAGE (Natural Height) */}
                <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 shadow-sm flex-none">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Passport</h3>

                    {!previewUrl ? (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                            <DocumentArrowUpIcon className="w-8 h-8 text-gray-400 group-hover:text-brand-500 transition-colors mb-2" />
                            <span className="text-sm text-gray-500 font-medium group-hover:text-brand-600">Upload Image</span>
                            <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                    ) : (
                        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center group">
                            <Image src={previewUrl} alt="Passport" fill className="object-cover" unoptimized />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                            <button
                                type="button"
                                onClick={handleRemovePassport}
                                className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-black/70 text-gray-600 dark:text-gray-300 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
                                title="Remove Image"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* 5. DOCUMENTS (Flex Grow to fill space) */}
                <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50 shadow-sm flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents</h3>

                    {/* List Existing Documents (Edit Mode) */}
                    {isEditing && initialData?.documents && initialData.documents.length > 0 && (
                        <div className="space-y-3 mb-4">
                            {initialData.documents.map((doc: any) => (
                                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                                            <DocumentIcon className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-gray-900 dark:text-white">{doc.name}</p>
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-500 hover:underline">View</a>
                                        </div>
                                    </div>
                                    {onDeleteDocument && (
                                        <button
                                            type="button"
                                            onClick={() => onDeleteDocument(doc.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* List New Documents (Create Mode) */}
                    {!isEditing && newDocuments.length > 0 && (
                        <div className="space-y-3 mb-4">
                            {newDocuments.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                                            <DocumentArrowUpIcon className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-gray-900 dark:text-white">{file.name}</p>
                                            <span className="text-xs text-gray-400">Ready to upload</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setNewDocuments(prev => prev.filter((_, i) => i !== index))}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Area */}
                    <div className="mt-auto">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <DocumentArrowUpIcon className="w-8 h-8 text-gray-400 group-hover:text-brand-500 transition-colors mb-2" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF, IMAGE (max. 10MB)</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) {
                                        const files = Array.from(e.target.files);
                                        if (isEditing && onUploadDocument) {
                                            // Handle immediate upload for edit mode
                                            files.forEach(file => onUploadDocument(file, file.name));
                                        } else {
                                            // Handle local state for create mode
                                            setNewDocuments(prev => [...prev, ...files]);
                                        }
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>

            </div>

            {/* ACTIONS (Right Aligned Footer) */}
            <div className="xl:col-span-3 flex justify-end gap-3 mt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Processing...' : isEditing ? 'Update Order' : 'Create Order'}
                </Button>
            </div>
        </form>
    );
}
