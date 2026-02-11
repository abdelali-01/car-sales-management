import React, { useState, useEffect } from 'react';
import ProductOrderForm from '@/components/shop/OrderForm';
import Image from 'next/image';
import { Product } from '../modals/ProductModal';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { checkCode } from '@/store/offers/offersHandler';
import { PromoCode } from '@/store/promoCodes/promoCodesSlice';
import { useTranslation } from 'react-i18next';
import { useMetaPixel } from '@/hooks/useMetaPixel';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

const ProductPage = ({ product }: { product: Product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [promoCode, setPromoCode] = useState("");
    const [discountCode, setDiscountCode] = useState<PromoCode | null>(null);
    const [feedback, setFeedback] = useState('');
    const { t, i18n } = useTranslation();
    const { trackViewContent } = useMetaPixel();
    console.log(discountCode);

    // Track product view when component mounts
    useEffect(() => {
        if (product && product.id) {
            trackViewContent({
                content_name: product.name,
                content_ids: [product.id.toString()],
                content_type: 'product',
                value: product.price,
                currency: 'DZD'
            });
        }
    }, [product.id]);

    const content = {
        promoApplied: {
            en: "Promo code applied!",
            fr: "Code promo appliqué !",
            ar: "تم تطبيق رمز الخصم!"
        },
        invalidPromo: {
            en: "Invalid or expired promo code.",
            fr: "Code promo invalide ou expiré.",
            ar: "رمز الخصم غير صالح أو منتهي الصلاحية."
        },
    }

    const dispatch = useDispatch<AppDispatch>()
    const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPromoCode(e.target.value);
    };

    const applyPromoCode = async (e) => {
        e.preventDefault();
        // TODO: Implement promo code validation logic here
        const res = await dispatch(checkCode(promoCode));

        if (res?.discount) {
            setDiscountCode({ ...res, code: promoCode });
            setFeedback(content.promoApplied[i18n.language]);
        } else {
            setFeedback(content.invalidPromo[i18n.language]);
        }
        setPromoCode('');
    };

    const getImageSrc = (img: string) => {
        if (!img) return '/product.png';
        if (img.startsWith('data:image') || img.startsWith('http')) return img;
        return `${process.env.NEXT_PUBLIC_SERVER}/${img}`;
    };

    // Calculate discount percent
    const discountPercent = product.prevPrice && product.prevPrice > product.price
        ? Math.round(((product.prevPrice - product.price) / product.prevPrice) * 100)
        : 0;

    const [price, setPrice] = useState(product.price);

    // WhatsApp message with product details
    const whatsappMessage = `Bonjour, je suis intéressé par ce produit:\n${product.name}\nPrix: ${price} DA`;

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row  gap-12">
                {/* Product Images and Slider */}
                <div className='w-full lg:flex-1'>
                    <div className="relative w-full rounded-2xl flex flex-col gap-4">
                        <div className='relative w-full h-full'>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative h-full w-full"
                                >
                                    {/* Content */}
                                    <div className="relative flex ">
                                        <Image
                                            src={getImageSrc(product.images[currentImageIndex]) || '/product.png'}
                                            alt={product.name}
                                            className='object-cover rounded-lg w-full'
                                            width={100}
                                            height={100}
                                            unoptimized
                                            quality={100}
                                            onError={(e) => {
                                                e.currentTarget.src = '/product.png';
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                            {/* Navigation Buttons */}
                            <button
                                onClick={() => { setCurrentImageIndex((prev => (prev === 0 ? product.images.length - 1 : prev - 1))) }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => { setCurrentImageIndex((prev => (prev === product.images.length - 1 ? 0 : prev + 1))) }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                        {/* Slide Indicators */}
                        <div className="flex gap-2">
                            {product.images.map((image, index) => {
                                return (
                                    <Image
                                        key={index}
                                        src={getImageSrc(image) || '/product.png'}
                                        alt={product.name}
                                        onClick={() => {
                                            setCurrentImageIndex(index);
                                        }}
                                        width={26}
                                        height={26}
                                        quality={100}
                                        unoptimized
                                        className={`w-26 h-26 object-cover rounded-xl transition-colors ${index === currentImageIndex ? 'border border-brand-500' : 'opacity-60'}`}
                                        onError={(e) => {
                                            e.currentTarget.src = '/product.png';
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </div>

                    {/* Promo Code Section */}
                    <form onSubmit={applyPromoCode} className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="promoCode">
                            {t('promoCode.title')}
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    id="promoCode"
                                    name="promoCode"
                                    value={promoCode}
                                    onChange={handlePromoCodeChange}
                                    placeholder={t('promoCode.placeholder')}
                                    required
                                />
                            </div>
                            <Button disabled={!promoCode.trim()}>
                                {t('promoCode.apply')}
                            </Button>
                        </div>
                        {feedback && (
                            <div className={`mt-2 text-sm ${discountCode ? 'text-green-600' : 'text-red-500'}`}>{feedback}</div>
                        )}
                    </form>

                </div>

                {/* Product Information and Order Form */}
                <div className="w-full lg:w-1/2 lg:self-start">
                    <div className="rounded-lg mb-3">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl font-semibold text-brand-600 dark:text-brand-400">{price} DA</span>
                            {product.prevPrice && product.prevPrice > product.price && (
                                <span className="text-lg text-gray-500 line-through">{product.prevPrice} DA</span>
                            )}
                            {discountPercent > 0 && (
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">-{discountPercent}%</span>
                            )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-6">{product.description}</p>
                    </div>

                    <ProductOrderForm
                        products={[{ ...product, productId: product.id, quantity: 1 }]}
                        productId={product.id}
                        productPrice={product.price}
                        attributes={product.attributes}
                        discount={discountCode}
                        setPrice={setPrice}
                    />
                </div>
            </div>

            {product.presentation && <div className='p-6 border border-gray-200 dark:border-gray-700 rounded-2xl my-10 dark:text-white'>
                <div dangerouslySetInnerHTML={{ __html: product.presentation }} />
            </div>}

            {/* WhatsApp Floating Button */}
            <WhatsAppButton
                message={whatsappMessage}
                position="bottom-right"
                showText={true}
                buttonText="Commander sur WhatsApp"
            />
        </div>
    );
};

export default ProductPage;
