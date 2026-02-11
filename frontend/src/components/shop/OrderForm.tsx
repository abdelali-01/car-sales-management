"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchWilayas } from "@/store/wilayas/wilayaHandler";
import { PromoCode } from "@/store/promoCodes/promoCodesSlice";
import { createOrder } from "@/store/orders/orderHandler";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import SelectField from '../form/input/SelectField';
import Button from '../ui/button/Button';
import { Wilaya } from '@/store/wilayas/wilayaSlice';
import { usePathname } from "next/navigation";
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { removeFromCart, addToCart } from "@/store/cart/cartSlice";
import OrderSuccessModal from './OrderSuccessModal';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Attribute } from "../modals/ProductModal";
import { useMetaPixel } from '@/hooks/useMetaPixel';

interface OrderFormProps {
  products?: {
    productId: number;
    quantity: number;
    attributes?: { [key: string]: string };
    availableAttributes?: Attribute;
    price?: number;
    name?: string;
    images?: string[];
  }[];
  // For backward compatibility, allow single product props
  productId?: number;
  productPrice?: number;
  setProductPrice?: (price: number) => void;
  attributes?: Attribute;
  discount?: PromoCode | null;
  isPack?: boolean;
  packId?: number;
}

interface CartProduct {
  productId: number;
  quantity: number;
  attributes?: { [key: string]: string };
  price: number;
  name?: string;
  availableAttributes?: Attribute[];
  images?: string[];
}

const getInitialFormData = (isCheckout: boolean, initialProducts: CartProduct[], products: CartProduct[]) => ({
  name: "",
  phone: "",
  wilaya: "",
  city: "",
  address: "",
  remarks: "",
  delivery_type: "home",
  promoCode: "",
  discountValue: 0,
  products: isCheckout ? initialProducts : products,
});

const ProductOrderForm = ({ products, productId, productPrice, setProductPrice, attributes, discount, isPack, packId, setPrice }: OrderFormProps) => {

  const { wilayas } = useSelector((state: RootState) => state.wilayas);
  const allProducts = useSelector((state: RootState) => state.products.products);
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { trackPurchase } = useMetaPixel();

  // Detect mode
  const isCheckout = pathname === '/checkout';

  // Build products array for form state
  let initialProducts: CartProduct[] = [];
  if (isCheckout && products && products.length > 0) {
    // Get full product info for each cart item
    initialProducts = products.map(item => {
      const prod = allProducts?.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        attributes: item.attributes || {},
        price: prod?.price || 0,
        name: prod?.name,
        availableAttributes: prod?.attributes || [],
        images: prod?.images || [],
      };
    });
  } else if (productId) {
    initialProducts = [{
      productId,
      quantity: 1,
      attributes: {},
      price: productPrice || 0,
      name: allProducts?.find(p => p.id === productId)?.name,
      availableAttributes: attributes || [],
      images: allProducts?.find(p => p.id === productId)?.images || [],
    }];
  }

  const [formData, setFormData] = useState(getInitialFormData(isCheckout, initialProducts, products || []));

  const [cities, setCities] = useState<string[]>([]);
  const [shippingPrices, setShippingPrices] = useState<{ home: number; desk: number }>({ home: 0, desk: 0 });
  console.log("cities ", cities);
  console.log('prices ', shippingPrices);

  const [error, setError] = useState("");
  const [isLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [attributeError, setAttributeError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const selectedWilayaData: Wilaya | undefined = wilayas?.find(w => w.name === formData.wilaya);
  const shippingPrice = selectedWilayaData ? shippingPrices[formData.delivery_type] || 0 : 0;

  // Calculate originalTotalPrice and discountedPrice
  let originalTotalPrice = 0;
  if (isPack) {
    originalTotalPrice = Number(productPrice) + shippingPrice;
  } else {
    originalTotalPrice = formData.products.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 1), 0) + shippingPrice;
  }
  let discountedPrice = originalTotalPrice;

  if (discount) {
    if (discount.type === 'percentage') {
      discountedPrice = originalTotalPrice * (1 - discount.discount / 100);
    } else if (discount.type === 'fixed') {
      discountedPrice = originalTotalPrice - discount.discount;
    }
  }

  const totalPrice = discountedPrice;


  useEffect(() => {
    dispatch(fetchWilayas());
  }, [dispatch]);

  useEffect(() => {
    if (formData.wilaya && selectedWilayaData) {
      setCities(typeof selectedWilayaData.cities === 'string' ? JSON.parse(selectedWilayaData.cities) : selectedWilayaData.cities);
      setShippingPrices(typeof selectedWilayaData.shipping_prices === "string" ? JSON.parse(selectedWilayaData.shipping_prices) : selectedWilayaData.shipping_prices);
    } else {
      setCities([]);
      setShippingPrices({ home: 0, desk: 0 });
    }
  }, [formData.wilaya, selectedWilayaData]);

  const validatePhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, "");
    if (cleaned.startsWith("+213")) {
      return /^\+213[0-9]{9}$/.test(cleaned);
    }
    if (cleaned.startsWith("0")) {
      return /^0[0-9]{9}$/.test(cleaned);
    }
    return false;
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, "");
    if (cleaned.startsWith("+213")) {
      const number = cleaned.slice(4);
      return `+213 ${number.slice(0, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7)}`;
    }
    if (cleaned.startsWith("0")) {
      const number = cleaned.slice(1);
      return `0${number.slice(0, 1)} ${number.slice(1, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7)}`;
    }
    return phone;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleaned = value.replace(/[\s\-\(\)]/g, "");
      if (cleaned.startsWith("+213") && cleaned.length <= 13) {
        setFormData((prev) => ({ ...prev, phone: value }));
        setPhoneError("");
        return;
      }
      if (cleaned.startsWith("0") && cleaned.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: value }));
        setPhoneError("");
        return;
      }
      if (validatePhoneNumber(cleaned)) {
        setFormData((prev) => ({ ...prev, phone: formatPhoneNumber(cleaned) }));
        setPhoneError("");
      } else {
        setFormData((prev) => ({ ...prev, phone: value }));
        setPhoneError("يرجى إدخال رقم هاتف صحيح ");
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "quantity" ? Math.max(1, parseInt(value, 10) || 1) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAttributeError("");
    // Validate all products: if any product has attributes, ensure all are selected
    for (const p of formData.products) {
      if (p.availableAttributes && Array.isArray(p.availableAttributes) && p.availableAttributes.length > 0) {
        const missing = p.availableAttributes.filter(attr => {
          if (!p.attributes) return true;
          if (!(attr.name in p.attributes)) return true;
          const val = p.attributes[attr.name];
          if (typeof val !== 'string') return true;
          if (val.trim().length === 0) return true;
          return false;
        });
        if (missing.length > 0) {
          setAttributeError(t('orderForm.attributesError'));
          return;
        }
      }
    }

    const cleanedPhone = formData.phone.replace(/[\s\-\(\)]/g, "");

    if (!validatePhoneNumber(cleanedPhone)) {
      setPhoneError(t('orderForm.phoneError'));
      return;
    }

    let payload: {
      name: string;
      phone: string;
      wilaya: string;
      city: string;
      address: string;
      remarks: string;
      delivery_type: string;
      promoCode: string | null;
      discountValue: number;
      isPack?: boolean;
      products: Array<{
        productId: number;
        quantity: number;
        attributes: Attribute;
        name?: string;
        price: number;
        image: string | null;
      }>;
    };

    if (isPack) {
      // For pack orders, send a 'packs' array
      payload = {
        name: formData.name,
        phone: formData.phone,
        wilaya: formData.wilaya,
        city: formData.city,
        address: formData.address,
        remarks: formData.remarks,
        delivery_type: formData.delivery_type,
        promoCode: discount?.code || null,
        discountValue: discount ? discount.discount : 0,
        isPack: true,
        products: [
          {
            packId: packId,
            quantity: formData.products[0]?.quantity || 1,
            products: formData.products.map((p) => ({
              productId: p.productId,
              quantity: 1, // always 1 per product in pack
              attributes: p.attributes || {},
              name: p.name,
              price: p.price,
              image: p.images && p.images[0] ? p.images[0] : null,
            })),
          },
        ],
      };
    } else {
      // For normal orders, send 'products' as before
      payload = {
        name: formData.name,
        phone: formData.phone,
        wilaya: formData.wilaya,
        city: formData.city,
        address: formData.address,
        remarks: formData.remarks,
        delivery_type: formData.delivery_type,
        promoCode: discount?.code || null,
        discountValue: discount ? discount.discount : 0,
        products: formData.products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
          attributes: p.attributes || {},
          name: p.name,
          price: p.price,
          image: p.images && p.images[0] ? p.images[0] : null,
        })),
      };
    }

    try {
      await dispatch(createOrder(payload));

      // Track Purchase event
      const totalValue = formData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      const finalValue = totalValue - (discount?.discount || 0);

      trackPurchase({
        content_ids: formData.products.map(p => p.productId.toString()),
        contents: formData.products.map(p => ({
          id: p.productId.toString(),
          quantity: p.quantity
        })),
        value: finalValue,
        currency: 'DZD',
        num_items: formData.products.reduce((sum, p) => sum + p.quantity, 0)
      });

      setShowSuccessModal(true);
      setFormData(getInitialFormData(isCheckout, initialProducts, products || []));
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newSelectedWilaya = wilayas?.find(w => w.name === value);
    setFormData((prev) => ({
      ...prev,
      wilaya: value,
      city: newSelectedWilaya ? newSelectedWilaya.cities[0] || "" : "",
    }));
  };

  const handleQuantityChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((product) => ({
        ...product,
        quantity: Math.max(1, value),
      })),
    }));
  };

  const incrementQuantity = () => handleQuantityChange(formData.products[0].quantity + 1);
  const decrementQuantity = () => handleQuantityChange(formData.products[0].quantity - 1);

  const handleAttributeChange = (attrName: string, value: string) => {
    const product = allProducts?.find(p => p.id === productId);
    if (!product || !product.attributes) return;

    const attribute = product.attributes.find(a => a.name === attrName);
    if (!attribute) return;

    const option = attribute.options.find(o => o.value === value);
    if (!option) return;

    const updatedAttributes = {
      ...formData.products[0].attributes,
      [attrName]: value
    };

    // ✅ Get prices for all selected attribute values
    const selectedOptionPrices = Object.entries(updatedAttributes)
      .map(([name, val]) => {
        const attr = product.attributes?.find(a => a.name === name);
        const opt = attr?.options.find(o => o.value === val);
        return opt?.price || 0;
      });

    const maxPrice = Math.max(...selectedOptionPrices);


    setFormData(prev => ({
      ...prev,
      products: prev.products.map((p, i) => {
        setPrice(maxPrice)

        return (i === 0
          ? {
            ...p,
            attributes: {
              ...p.attributes,
              [attrName]: value,
            },
            price: maxPrice,
          }
          : p)
      }),
    }));

    if (setProductPrice) {
      setProductPrice(newPrice);
    }
    setAttributeError("");
  };

  // Handlers for multi-product
  const handleProductQtyChange = (idx: number, qty: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map((p, i) => i === idx ? { ...p, quantity: Math.max(1, qty) } : p)
    }));
  };


  const handleProductAttrChange = (idx: number, attr: string, value: string) => {
    const product = allProducts?.find(p => p.id === formData.products[idx].productId);
    if (!product || !product.attributes) return;

    const originalProductPrice = allProducts?.find(p => p.id === formData.products[idx].productId)?.price || 0;

    const attribute = product.attributes.find(a => a.name === attr);
    if (!attribute) return;

    const option = attribute.options.find(o => o.value === value);
    if (!option) return;

    // Get updated attributes for this product
    const updatedAttributes = {
      ...formData.products[idx].attributes,
      [attr]: value
    };

    // Collect selected option prices
    const selectedOptionPrices = Object.entries(updatedAttributes).map(([name, val]) => {
      const attrObj = product.attributes?.find(a => a.name === name);
      const option = attrObj?.options.find(o => o.value === val);
      return option?.price || 0;
    });

    // Get the highest price from selected options
    const maxPrice = Math.max(...selectedOptionPrices);

    setFormData(prev => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === idx
          ? {
            ...p,
            attributes: {
              ...p.attributes,
              [attr]: value,
            },
            price: maxPrice
          }
          : p
      ),
    }));
  };

  const handleRemoveProduct = (idx: number) => {
    const prod = formData.products[idx];
    dispatch(removeFromCart({ id: prod.productId, attributes: prod.attributes }));
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== idx)
    }));
  };

  return (
    <section id="order" className="relative overflow-hidden">
      <div className="relative z-10">
        <div className="space-y-6 rounded-3xl p-2">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Quantity Selector */}
            {pathname != '/checkout' &&
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold dark:text-white text-gray-900 ">{t('product.quantity')}</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">{t('product.selectQuantity')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={decrementQuantity}
                    disabled={!formData.products[0] || formData.products[0].quantity <= 1}
                    className="w-10 h-10 rounded-full dark:text-white border-2 border-gray-200 flex items-center justify-center text-xl font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold dark:text-white text-gray-900 w-8 text-center">
                    {formData.products[0]?.quantity ?? 1}
                  </span>
                  <button
                    type="button"
                    onClick={incrementQuantity}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-xl font-medium dark:text-white text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>}


            {(isPack || isCheckout) &&
              <div className="space-y-6">
                {formData.products?.map((prod, idx) => {
                  return (
                    <div key={prod.productId + '-' + idx} className="relative flex flex-col sm:flex-row items-center gap-4 border-b pb-4 mb-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow group">
                      {isCheckout && <button type="button" onClick={() => handleRemoveProduct(idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 bg-white dark:bg-gray-900 rounded-full p-1 shadow z-10">
                        <XMarkIcon className="w-5 h-5" />
                      </button>}
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden shadow">
                        {prod?.images[0] && <Image src={`${prod?.images[0]}` || '/product.png'} alt={prod.name || ''} fill className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/product.png';
                          }}
                        />}
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex flex-col mb-2">
                          <span className="font-semibold text-lg text-gray-800 dark:text-white truncate">{prod.name || `Product #${prod.productId}`}</span>
                          <span className="text-lg font-bold text-brand-500">{prod.price} DA x {prod.quantity}</span>
                        </div>
                        {isCheckout && <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-700 dark:text-gray-200">Quantity:</span>
                          <button type="button" onClick={() => handleProductQtyChange(idx, prod.quantity - 1)} disabled={prod.quantity <= 1} className="px-3 py-1 border rounded-full text-lg font-bold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">-</button>
                          <span className="text-lg font-semibold text-gray-900 dark:text-white w-8 text-center">{prod.quantity}</span>
                          <button type="button" onClick={() => handleProductQtyChange(idx, prod.quantity + 1)} className="px-3 py-1 border rounded-full text-lg font-bold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">+</button>
                        </div>}
                        {prod.availableAttributes && prod.availableAttributes.length > 0 && (
                          <div className="flex flex-col gap-3 mb-2">
                            {prod.availableAttributes.map((attr, attrIdx) => {
                              const originalProduct = products.find(p => p.productId === prod.productId);
                              const isAttrAlreadySelected = Object.hasOwn(originalProduct?.attributes || {}, attr.name);

                              return (
                                <div key={`${attr.name}-${attrIdx}`}>
                                  <span className="block capitalize text-sm font-semibold text-gray-700 dark:text-white mb-1">
                                    {attr.name}:
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {attr.options.map(option => (
                                      <button
                                        key={`${attr.name}-${option.value}`}
                                        type="button"
                                        onClick={() => handleProductAttrChange(idx, attr.name, option.value)}
                                        disabled={(Number(option.stock) === 0) || isAttrAlreadySelected}
                                        className={`px-3 py-1 rounded-full border text-sm font-medium
                                      ${prod.attributes?.[attr.name] === option.value
                                            ? 'bg-brand-500 text-white border-brand-500'
                                            : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'}
                                      ${(Number(option.stock) === 0) || isAttrAlreadySelected ? 'opacity-50 cursor-not-allowed' : 'hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900'}
                                    `}
                                        style={{ textTransform: 'capitalize' }}
                                      >
                                        {option.value}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        <div className="text-right text-brand-500 font-bold mt-2">Total: {prod.price * prod.quantity} DA</div>
                      </div>
                    </div>
                  )
                })}
              </div>}

            {/* Product Attributes Selection */}
            {attributes && attributes.length > 0 && (
              <div className="space-y-4 flex items-start gap-8 flex-wrap">
                {attributes.map(attr => (
                  <div key={attr.name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {attr.name} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {attr.options.map(option => {
                        const isSelected =
                          formData.products[0]?.attributes?.[attr.name] === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleAttributeChange(attr.name, option.value)}
                            disabled={option.stock === 0}
                            className={`px-4 py-2 rounded-lg border-2 transition-all
                  ${isSelected
                                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900 dark:text-brand-200'
                                : option.stock === 0
                                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-brand-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-brand-400'
                              }
                          `}
                          >
                            <span className="capitalize">{option.value}</span>
                            {option.stock === 0 && (
                              <span className="ml-2 text-xs text-red-500">(Out of Stock)</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}


            {attributeError && (
              <div className="text-red-500 text-sm mt-2">
                {attributeError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('orderForm.name')}
                  required
                />
              </div>

              <div>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('orderForm.phone')}
                  className={`${phoneError ? "border-red-500" : ""
                    } `}
                  required
                />
                {phoneError && (
                  <p className="text-red-500 text-sm mt-2">{phoneError}</p>
                )}
              </div>
              <div className="col-span-1">
                <SelectField
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleWilayaChange}
                  required
                  disabled={wilayas?.length === 0}
                >
                  <option value="">{t('orderForm.wilaya')}</option>
                  {wilayas?.map((wilaya) => (
                    <option key={wilaya.id} value={wilaya.name} disabled={wilaya.is_active == "0"}>
                      {wilaya.name}{wilaya.is_active == '0' && <span> ({t('orderForm.not_avai')})</span>}
                    </option>
                  ))}
                </SelectField>
              </div>

              <div className="col-span-1">
                <SelectField
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={!selectedWilayaData}
                >
                  <option value="">{t('orderForm.city')}</option>
                  {cities?.map(({ nom }) => (
                    <option key={nom} value={nom}>
                      {nom}
                    </option>
                  ))}
                </SelectField>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={t('orderForm.address')}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-gray-700 mb-2">
                {t('product.delivery.title')}
              </label>
              <div className="flex gap-4">

                {!formData.wilaya && (
                  <div className="text-gray-500 text-sm">
                    {t('product.delivery.selectWilaya')}
                  </div>
                )}

                {selectedWilayaData && shippingPrices?.desk > 0 && (
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="delivery_type"
                      value="desk"
                      checked={formData.delivery_type === "desk"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${formData.delivery_type === "desk"
                          ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900 dark:text-brand-200'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-brand-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-brand-400'}
                    `}
                    >
                      <div className="font-semibold mb-1">
                        {t('product.delivery.desk')}
                      </div>
                      <div className="text-gray-500 text-sm dark:text-gray-400">
                        {selectedWilayaData
                          ? `${shippingPrices?.desk || 0} دج`
                          : t('product.delivery.selectWilaya')}
                      </div>
                    </div>
                  </label>
                )}

                {selectedWilayaData && shippingPrices?.home > 0 && (
                  <label className="flex-1">
                    <input
                      type="radio"
                      name="delivery_type"
                      value="home"
                      checked={formData.delivery_type === "home"}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${formData.delivery_type === "home"
                          ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-900 dark:text-brand-200'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-brand-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-brand-400'}
                    `}
                    >
                      <div className="font-semibold mb-1">
                        {t('product.delivery.home')}
                      </div>
                      <div className="text-gray-500 text-sm dark:text-gray-400">
                        {selectedWilayaData
                          ? `${shippingPrices?.home || 0} دج`
                          : t('product.delivery.selectWilaya')}
                      </div>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <TextArea
                value={formData.remarks}
                onChange={(value) => setFormData((prev) => ({ ...prev, remarks: value }))}
                placeholder={t('orderForm.remarks')}
              />
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex justify-between items-center text-gray-700 mb-2">
                <span>{isPack ? t('checkout.packPrice') : t('checkout.productPrice')}:</span>
                <span>{isPack ? productPrice : formData.products.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 1), 0)} DA</span>
              </div>
              <div className="flex justify-between items-center text-gray-700 mb-2">
                <span>{t('product.shipping')}:</span>
                <span>
                  {selectedWilayaData
                    ? `${shippingPrices[formData.delivery_type as keyof typeof selectedWilayaData.shipping_prices] || 0} DA`
                    : t('orderForm.wilaya')}
                </span>
              </div>

              {discount && (
                <div className="flex justify-between items-center text-green-600 font-semibold mb-2">
                  <span>{t('checkout.discount')} ({discount.type === 'percentage' ? `${discount.discount}%` : `${discount.discount} DA`}):</span>
                  <span>-{Math.round(originalTotalPrice - discountedPrice)} DA</span>
                </div>
              )}

              <div className="flex justify-between items-center text-xl font-bold text-gray-800 pt-2 border-t border-blue-200">
                <span>{t('product.total')}:</span>
                <div className="flex flex-col">
                  <span> {totalPrice} DA</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-center font-bold mb-4">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="md"
              variant="primary"
              className="w-full text-lg font-semibold relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  {t('orderForm.processing')}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {t('product.orderNow')}
                </span>
              )}
            </Button>
            {!isCheckout && !isPack && (
              <button
                type="button"
                onClick={() => {
                  const prod = formData.products[0];
                  if (!prod) return;
                  dispatch(addToCart({
                    id: prod.productId,
                    name: prod.name || '',
                    price: prod.price,
                    prevPrice: undefined,
                    images: prod.images || [],
                    quantity: prod.quantity,
                    cartQuantity: prod.quantity,
                    attributes: prod.attributes || {},
                  }));
                }}
                className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors mt-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {t('product.addToCart')}
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          if (isCheckout) {
            dispatch({ type: 'cart/clearCart' });
          }
        }}
      />
    </section>
  );
};

export default ProductOrderForm;
