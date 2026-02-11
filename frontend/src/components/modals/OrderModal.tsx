import React, { useState, useEffect } from 'react'
import Button from '../ui/button/Button'
import Image from 'next/image';
import Input from '../form/input/InputField';
import Select from '../form/Select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchWilayas } from '@/store/wilayas/wilayaHandler';
import { updateOrder } from '@/store/orders/orderHandler';
import { Order } from '@/store/orders/orderSlice';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Attribute } from './ProductModal';

interface OrderProduct {
    id: number;
    productId: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    attributes: Record<string, string>;
    product_attr?: Record<string, Record<string, number>>;
}

interface WilayaData {
    name: string;
    cities: string;
    shipping_prices: string;
}

interface OrderDetails {
    id: number;
    name: string;
    phone: string;
    wilaya: string;
    city: string;
    delivery_type: 'home' | 'desk';
    order_status: 'pending' | 'confirmed' | 'completed' | 'canceled';
    remarks?: string;
    products: OrderProduct[];
    discountValue?: number;
    promoCode?: string;
}

// Extend Order type to include is_pack and pack
interface PackInfo {
    id: number;
    name: string;
    image: string;
    price: number;
    discount?: number;
    description?: string;
    quantity: number;
    products: unknown[];
}

interface OrderWithPack extends Order {
    is_pack?: boolean;
    pack?: PackInfo;
}

export default function OrderModal({ closeModal, order }: { closeModal: () => void, order: OrderWithPack }) {
    const dispatch = useDispatch<AppDispatch>();
    const { wilayas } = useSelector((state: RootState) => state.wilayas);
    const allProducts = useSelector((state: RootState) => state.products.products);

    console.log(order)

    // Function to calculate correct price based on attributes
    const calculateProductPrice = (productId: number, attributes: Record<string, string> | unknown[], basePrice: number) => {
        const product = allProducts?.find(p => p.id === productId);
        if (!product || !product.attributes) return basePrice;

        // If product has attributes, find the highest price among all options
        let highestPrice = basePrice;
        
        product.attributes.forEach(attr => {
            attr.options.forEach(option => {
                if (option.price > highestPrice) {
                    highestPrice = option.price;
                }
            });
        });
        
        return highestPrice;
    };


    // Sync formData with order
    const [formData, setFormData] = useState<OrderDetails>({
        id: order.id ?? 0,
        name: order.name ?? '',
        phone: order.phone ?? '',
        wilaya: order.wilaya ?? '',
        city: order.city ?? '',
        delivery_type: (order.delivery_type ?? order.delivery_type) || 'home',
        order_status: (order.order_status ?? order.order_status) || 'pending',
        remarks: order.remarks ?? '',
        products: (order.products || []).map((p) => ({
            ...p,
            productId: typeof p.productId === 'number' ? p.productId : p.id,
            quantity: typeof p.quantity === 'number' ? p.quantity : 1,
            attributes: p.attributes && typeof p.attributes === 'object' && !Array.isArray(p.attributes)
                ? p.attributes
                : {},
        })),
        discountValue: order.discountValue,
        promoCode: order.promoCode ?? '', // always string
    });

    const [cities, setCities] = useState<string[]>([]);
    const [shippingPrices, setShippingPrices] = useState<{ home: number; desk: number }>({ home: 0, desk: 0 });

    useEffect(() => {
        dispatch(fetchWilayas());
    }, [dispatch]);

    useEffect(() => {
        if (formData.wilaya && wilayas) {
            const selectedWilaya = wilayas.find(w => w.name === formData.wilaya) as WilayaData | undefined;
            if (selectedWilaya) {
                setCities(typeof selectedWilaya.cities === 'string' ? JSON.parse(selectedWilaya.cities) : selectedWilaya.cities);
                setShippingPrices(typeof selectedWilaya.shipping_prices === "string" ? JSON.parse(selectedWilaya.shipping_prices) : selectedWilaya.shipping_prices);
            }
        }
    }, [formData.wilaya, wilayas]);

    // Recalculate prices when allProducts are loaded
    useEffect(() => {
        if (allProducts && allProducts.length > 0) {
            const productsWithCorrectPrices = formData.products.map((p) => {
                const calculatedPrice = calculateProductPrice(
                    p.productId,
                    p.attributes,
                    p.price
                );
                
                return {
                    ...p,
                    price: calculatedPrice,
                };
            });

            setFormData(prev => ({
                ...prev,
                products: productsWithCorrectPrices,
            }));
        }
    }, [allProducts]);

    // Update order field
    const handleChange = <K extends keyof OrderDetails>(field: K, value: OrderDetails[K]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Remove product from order
    const handleRemoveProduct = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== idx)
        }));
    };

    // Update product attribute in order with price calculation
    const handleProductAttrChange = (prodIdx: number, attr: string, value: string) => {
        const product = allProducts?.find(p => p.id === formData.products[prodIdx].productId);
        if (!product || !product.attributes) return;

        const attribute = product.attributes.find(a => a.name === attr);
        if (!attribute) return;

        const option = attribute.options.find(o => o.value === value);
        if (!option) return;

        const newPrice = option.price > 0 ? option.price : product.price || 0;

        setFormData(prev => ({
            ...prev,
            products: prev.products.map((p, i) => i === prodIdx ? {
                ...p,
                attributes: { ...p.attributes, [attr]: value },
                price: newPrice
            } : p)
        }));
    };

    // Update product quantity in order
    const handleProductQtyChange = (prodIdx: number, qty: number) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.map((p, i) => i === prodIdx ? { ...p, quantity: qty } : p)
        }));
    };

    const handleSave = () => {
        const updatedOrder = {
            name: formData.name,
            phone: formData.phone,
            wilaya: formData.wilaya,
            city: formData.city,
            delivery_type: formData.delivery_type,
            order_status: formData.order_status,
            discountValue: formData.discountValue,
            promoCode: formData.promoCode || undefined,
            products: formData.products.map((p) => ({
                productId: p.productId,
                quantity: p.quantity,
                attributes: p.attributes || {},
                name: p.name,
                price: p.price,
                id: p.id,
                image: p.image
            }))
        };
        // Debug log
        console.log('Order update payload:', updatedOrder.products);
        dispatch(updateOrder(Number(order.id), updatedOrder));
        closeModal();
    }

    return (
        <div className="max-w-5xl mx-auto w-full">
            <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
                Order Details
            </h4>
            <div>
                <div className='border max-h-[65vh] overflow-y-auto border-gray-200 dark:border-white/[0.05] rounded-lg p-5'>
                    {/* Pack Info for is_pack */}
                    {order.is_pack && order.pack ? (
                        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                <Image
                                    src={`${order.pack.image}`}
                                    alt={order.pack.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-gray-900 dark:text-white">{order.pack.name}</div>
                                <div className="text-lg font-semibold text-brand-500">{order.pack.price} DA</div>
                            </div>
                        </div>
                    ): null}
                    {/* Products Info */}
                    {formData.products && formData.products.map((prod, idx) => {
                        const product = allProducts?.find(p => p.id === prod.productId);
                        return (
                        <div key={prod.id + '-' + idx} className={`flex flex-col sm:flex-row items-start gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-white/[0.05] ${order.is_pack ? 'bg-gray-50 dark:bg-gray-900 rounded-lg p-2 shadow-sm' : ''}`} style={order.is_pack ? { minHeight: 60, fontSize: '0.95em' } : {}}>
                            <div className='w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800'>
                                {prod.image && (
                                    <Image
                                        src={`${prod.image}`}
                                        alt={prod.name}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div className='flex-1 w-full'>
                                <div className="flex items-center justify-between">
                                    <h3 className='text-base font-semibold text-gray-800 dark:text-white mb-2'>{prod.name}</h3>
                                </div>
                                <div className='grid grid-cols-2 gap-2'>
                                    <div>
                                        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Price</span>
                                        <Input
                                            type="text"
                                            value={prod.price + ' DA'}
                                            className="w-full mt-1"
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Quantity</span>
                                        {order.is_pack ? (
                                            <Input
                                                type="number"
                                                value={prod.quantity || 1}
                                                className="w-full mt-1"
                                                disabled
                                            />
                                        ) : (
                                            <Input
                                                type="number"
                                                value={prod.quantity || 1}
                                                onChange={e => handleProductQtyChange(idx, Math.max(1, Number(e.target.value) || 1))}
                                                className="w-full mt-1"
                                                min={"1"}
                                            />
                                        )}
                                    </div>
                                </div>
                                {/* New Attributes Structure */}
                                {product?.attributes && product.attributes.length > 0 && (
                                    <div className="mt-2">
                                        <span className='text-xs font-medium text-gray-700 dark:text-gray-300'>Attributes:</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {product.attributes.map((attr, attrIdx) => (
                                                <div key={attrIdx} className="mr-2">
                                                    <span className="capitalize text-xs font-semibold dark:text-white">{attr.name}:</span>
                                                    {attr.options.map((option, optIdx) => (
                                                        <button
                                                            key={optIdx}
                                                            type="button"
                                                            onClick={() => handleProductAttrChange(idx, attr.name, option.value)}
                                                            disabled={Number(option.stock) === 0 || (!order.is_pack && prod.attributes?.[attr.name] === option.value)}
                                                            className={`ml-2 px-2 py-0.5 rounded-md border text-xs dark:text-white ${prod.attributes?.[attr.name] === option.value ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-900'} ${Number(option.stock) === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {option.value} ({option.price} DA)
                                                        </button>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Legacy product_attr support */}
                                {!product?.attributes && prod?.product_attr && typeof prod.product_attr === 'object' && prod.product_attr !== null && Object.keys(prod.product_attr).length > 0 && (
                                    <div className="mt-2">
                                        <span className='text-xs font-medium text-gray-700 dark:text-gray-300'>Attributes:</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {Object.entries(prod.product_attr).map(([attrName, options]) => (
                                                <div key={attrName} className="mr-2">
                                                    <span className="capitalize text-xs font-semibold dark:text-white">{attrName}:</span>
                                                    {options && typeof options === 'object' && !Array.isArray(options) && options !== null && Object.entries(options as Record<string, number>).map(([option, stock]) => (
                                                        <button
                                                            key={option}
                                                            type="button"
                                                            onClick={() => handleProductAttrChange(idx, attrName, option)}
                                                            disabled={Number(stock) === 0 || !order.is_pack && prod.attributes?.[attrName] === option}
                                                            className={`ml-2 px-2 py-0.5 rounded-md border text-xs dark:text-white ${prod.attributes?.[attrName] === option ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-900'} ${Number(stock) === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )})}

                    {/* Client Info */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6'>
                        <div>
                            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Client Name</span>
                            <Input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full mt-1"
                                disabled
                            />
                        </div>
                        <div>
                            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Client Number</span>
                            <Input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="w-full mt-1"
                                disabled
                            />
                        </div>
                        <div>
                            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Wilaya</span>
                            <Select
                                defaultValue={formData.wilaya}
                                onChange={(value) => {
                                    handleChange('wilaya', value);
                                    handleChange('city', '');
                                }}
                                className="w-full mt-1"
                                options={wilayas?.map(w => ({
                                    value: w.name,
                                    label: w.name
                                })) || []}
                            />
                        </div>
                        <div>
                            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>City</span>
                            <Select
                                defaultValue={formData.city}
                                onChange={(value) => handleChange('city', value)}
                                className="w-full mt-1"
                                options={cities.map(({nom}) => ({
                                    value: nom,
                                    label: nom
                                }))}
                            />
                        </div>
                                        {/* Remarks */}
<div className='col-span-1 sm:col-span-2'>
  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Remarks</span>
  <textarea
    value={formData.remarks || ''}
    onChange={(e) => handleChange('remarks', e.target.value)}
    className="w-full mt-1 resize-y rounded-md border-gray-200 dark:bg-gray-800 dark:border-white/[0.05] p-2"
    rows={3}
    disabled // remove this if you want the admin to be able to edit remarks
  />
</div>
                        <div>
                            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Shipping method</span>
                            <Select
                                defaultValue={formData.delivery_type}
                                onChange={(value) => handleChange('delivery_type', value as 'home' | 'desk')}
                                className="w-full mt-1"
                                options={[
                                    { value: 'home', label: 'To home' },
                                    { value: 'desk', label: 'Desktop' },
                                ]}
                            />
                        </div>
                        <div>
                            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Shipping price</span>
                            <Input
                                type="text"
                                value={`${shippingPrices[(formData.delivery_type as keyof typeof shippingPrices)] || 0} DA`}
                                className="w-full mt-1"
                                disabled
                            />
                        </div>
                        <div className='col-span-1 sm:col-span-2'>
                            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Status</span>
                            <Select
                                defaultValue={formData.order_status}
                                onChange={(value) => handleChange('order_status', value as 'pending' | 'confirmed' | 'completed' | 'canceled')}
                                className="w-full mt-1"
                                options={[
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'confirmed', label: 'Confirmed' },
                                    { value: 'completed', label: 'Completed' },
                                    { value: 'canceled', label: 'Canceled' }
                                ]}
                            />
                        </div>
                    </div>
                    {/* Total */}
                    <div className='bg-gray-50 dark:bg-white/[0.02] rounded-lg p-4'>
                        <div className='space-y-2'>
                            <div className='flex justify-between items-center text-gray-600 dark:text-gray-300'>
                                <span>Subtotal</span>
                                <span>
                                    {order.is_pack && order.pack ? `${order.pack.price} DA` : formData.products.reduce((sum, prod) => sum + (prod.price * (prod.quantity || 1)), 0) + ' DA'}
                                </span>
                            </div>
                            <div className='flex justify-between items-center text-gray-600 dark:text-gray-300'>
                                <span>Shipping</span>
                                <span>{shippingPrices[(formData.delivery_type as keyof typeof shippingPrices)] || 0} DA</span>
                            </div>
                            {formData.promoCode && (
                                <div className='flex justify-between items-center text-gray-600 dark:text-gray-300'>
                                    <span>Promo Code</span>
                                    <span>{formData.promoCode}</span>
                                </div>
                            )}
                            {formData.discountValue && Number(formData.discountValue) > 0 && (
                                <div className='flex justify-between items-center text-green-600 font-semibold'>
                                    <span>Discount</span>
                                    <span>-{formData.discountValue} DA</span>
                                </div>
                            )}
                            <div className='border-t border-gray-200 dark:border-white/[0.05] pt-2 mt-2'>
                                <div className='flex justify-between items-center'>
                                    <span className='font-medium text-gray-800 dark:text-white'>Total</span>
                                    <span className='text-xl font-bold text-brand-400'>
                                        {order.is_pack && order.pack ? `${Number(order.pack.price) + (shippingPrices[(formData.delivery_type as keyof typeof shippingPrices)] || 0) - (formData.discountValue || 0)} DA` :
                                            formData.products.reduce((sum, prod) => sum + (prod.price * (prod.quantity || 1)), 0) + Number(shippingPrices[(formData.delivery_type as keyof typeof shippingPrices)] || 0) - Number(formData.discountValue || 0) + ' DA'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-4">
                <Button size="sm" variant="outline" onClick={closeModal}>
                    Close
                </Button>
                <Button size="sm" onClick={handleSave}>
                    Save Changes
                </Button>
            </div>
        </div>
    )
}

