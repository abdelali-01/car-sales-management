'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CustomerInfoSection from '@/components/orders/CustomerInfoSection';
import OrderProductsSection from '@/components/orders/OrderProductsSection';
import ShippingSection from '@/components/orders/ShippingSection';
import OrderStatusSection from '@/components/orders/OrderStatusSection';
import OrderSummary from '@/components/orders/OrderSummary';
import Button from '@/components/ui/button/Button';
import Loader from '@/components/ui/load/Loader';
import { AppDispatch, RootState } from '@/store/store';
import { fetchOrders, updateOrder } from '@/store/orders/orderHandler';
import { fetchWilayas } from '@/store/wilayas/wilayaHandler';
import { fetchProducts } from '@/store/products/productHandler';
import { Order, OrderProduct } from '@/store/orders/orderSlice';
import { City } from '@/store/wilayas/wilayaSlice';
import { useTranslation } from 'react-i18next';

interface ProductOption {
    id: number;
    name: string;
    price: number;
    images: string[];
}

export default function OrderDetailPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const params = useParams();
    const orderId = params?.id ? Number(params.id) : null;
    const { t } = useTranslation('admin');

    const { orders, loading } = useSelector((state: RootState) => state.orders);
    const { wilayas } = useSelector((state: RootState) => state.wilayas);
    const { products: allProducts } = useSelector((state: RootState) => state.products);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderLoaded, setOrderLoaded] = useState(false);
    const [cities, setCities] = useState<City[]>([]);
    const [shippingPrice, setShippingPrice] = useState(0);

    const [formData, setFormData] = useState<{
        name: string;
        phone: string;
        wilaya: string;
        city: string;
        address?: string;
        remarks?: string;
        deliveryType: 'home' | 'desk';
        status: 'pending' | 'confirmed' | 'completed' | 'canceled';
        products: OrderProduct[];
        promoCode?: string;
        discountValue?: number;
        createdAt?: string;
    }>({
        name: '',
        phone: '',
        wilaya: '',
        city: '',
        deliveryType: 'home',
        status: 'pending',
        products: []
    });

    // Fetch data on mount
    useEffect(() => {
        if (!orders) dispatch(fetchOrders());
        if (!wilayas) dispatch(fetchWilayas());
        if (!allProducts) dispatch(fetchProducts());
    }, [dispatch, orders, wilayas, allProducts]);

    // Load order data
    useEffect(() => {
        if (orderId && orders && !orderLoaded) {
            const order = orders.find((o: Order) => o.id === orderId);
            if (order) {
                setFormData({
                    name: order.name,
                    phone: order.phone,
                    wilaya: order.wilaya,
                    city: order.city,
                    address: order.address,
                    remarks: order.remarks,
                    deliveryType: order.deliveryType,
                    status: order.status || 'pending',
                    products: order.products,
                    promoCode: order.promoCode,
                    discountValue: order.discountValue,
                    createdAt: order.createdAt
                });
                setOrderLoaded(true);
            }
        }
    }, [orderId, orders, orderLoaded]);

    // Update cities when wilaya changes
    useEffect(() => {
        if (formData.wilaya && wilayas) {
            const selectedWilaya = wilayas.find(w => w.name === formData.wilaya);
            if (selectedWilaya) {
                setCities(selectedWilaya.cities || []);
                const prices = selectedWilaya.shippingPrices
                    ? { home: selectedWilaya.shippingPrices.home, desk: selectedWilaya.shippingPrices.desk }
                    : { home: 0, desk: 0 };

                setShippingPrice(prices[formData.deliveryType] || 0);
            }
        }
    }, [formData.wilaya, formData.deliveryType, wilayas]);

    const handleFieldChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'wilaya') {
            setFormData(prev => ({ ...prev, city: '' }));
        }
    };

    const handleStatusChange = (status: string) => {
        setFormData(prev => ({
            ...prev,
            status: status as 'pending' | 'confirmed' | 'completed' | 'canceled'
        }));
    };

    const handleQuantityChange = (idx: number, quantity: number) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.map((p, i) => i === idx ? { ...p, quantity } : p)
        }));
    };

    const handleAddProduct = (product: ProductOption) => {
        const newProduct: OrderProduct = {
            id: 0, // Will be assigned on save
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.images?.[0] || '',
            quantity: 1,
            attributes: {}
        };
        setFormData(prev => ({
            ...prev,
            products: [...prev.products, newProduct]
        }));
    };

    const handleRemoveProduct = (idx: number) => {
        if (formData.products.length <= 1) return; // Prevent removing last product
        setFormData(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== idx)
        }));
    };

    const calculateSubtotal = () => {
        return formData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    };

    // Prepare available products for the dropdown
    const availableProducts: ProductOption[] = (allProducts || []).map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        images: p.images || []
    }));

    const handleSave = async () => {
        if (!orderId) return;

        setIsSubmitting(true);
        try {
            const updates = {
                name: formData.name,
                phone: formData.phone,
                wilaya: formData.wilaya,
                city: formData.city,
                deliveryType: formData.deliveryType,
                status: formData.status,
                products: formData.products.map(p => ({
                    productId: p.productId,
                    quantity: p.quantity,
                    attributes: p.attributes || {}
                }))
            };
            await dispatch(updateOrder(orderId, updates));
            router.push('/orders');
        } catch (error) {
            console.error('Failed to update order:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/orders');
    };

    const isEditable = formData.status === 'pending';

    if (loading || !orderLoaded) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <PageBreadcrumb paths={['orders']} pageTitle={`${t('orders.order')} #${orderId}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Main Content - 2 columns */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Order Products */}
                    <OrderProductsSection
                        products={formData.products}
                        editable={isEditable}
                        onQuantityChange={handleQuantityChange}
                        onRemoveProduct={handleRemoveProduct}
                        onAddProduct={handleAddProduct}
                        availableProducts={availableProducts}
                        showAddProduct={isEditable}
                    />

                    {/* Customer Info */}
                    <CustomerInfoSection
                        name={formData.name}
                        phone={formData.phone}
                        remarks={formData.remarks}
                    />

                    {/* Shipping */}
                    <ShippingSection
                        wilaya={formData.wilaya}
                        city={formData.city}
                        address={formData.address}
                        deliveryType={formData.deliveryType}
                        shippingPrice={shippingPrice}
                        wilayas={wilayas}
                        cities={cities}
                        onChange={handleFieldChange}
                    />
                </div>

                {/* Sidebar - 1 column */}
                <div className="space-y-5">
                    {/* Order Status */}
                    <OrderStatusSection
                        status={formData.status}
                        createdAt={formData.createdAt}
                        onChange={handleStatusChange}
                    />

                    {/* Order Summary */}
                    <OrderSummary
                        subtotal={calculateSubtotal()}
                        shippingPrice={shippingPrice}
                        promoCode={formData.promoCode}
                        discountValue={formData.discountValue}
                    />

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? t('orders.saving') : t('orders.saveChanges')}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {t('common.cancel')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
