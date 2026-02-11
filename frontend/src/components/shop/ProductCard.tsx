import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Button from '../ui/button/Button';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/cart/cartSlice';
import { useCartSidebar } from '@/context/CartSidebarContext';
import { Product } from '../modals/ProductModal';
import { useTranslation } from 'react-i18next';
import { useMetaPixel } from '@/hooks/useMetaPixel';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const { trackAddToCart } = useMetaPixel();
  const isOutOfStock = product.quantity === 0;


  const discountPercent = product.prevPrice && product.prevPrice > product.price
    ? Math.round(((product.prevPrice - product.price) / product.prevPrice) * 100)
    : 0;

  const dispatch = useDispatch();
  const { openCart } = useCartSidebar();

  const handleAddToCart = () => {
    // Track AddToCart event
    trackAddToCart({
      content_name: product.name,
      content_ids: [product.id?.toString() || ''],
      content_type: 'product',
      value: product.price,
      currency: 'DZD'
    });

    dispatch(addToCart({
      ...product,
      quantity: typeof product.quantity === 'number' ? product.quantity : 1,
      cartQuantity: 1,
      // attributes: ... if needed
    }));
    openCart();
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl border border-[#efe9df] dark:border-gray-800 overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[4/5] w-full bg-[#f3efe7]">
        <Image
          src={`${product.images?.[0]}` || '/product.png'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/product.png';
          }}
        />
        {discountPercent > 0 && (
          <div className="absolute top-4 right-4 bg-[#c1a36f] text-white px-3 py-1 rounded-full text-sm font-medium shadow">
            -{discountPercent}%
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/80 text-white px-4 py-1 rounded-full text-xs font-medium shadow">
            {t('product.outOfStock')}
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-2 mb-4">
          <div className="text-xl font-semibold text-[#c1a36f]">{product.price} DA</div>
          {product.prevPrice && product.prevPrice > product.price && (
            <div className="text-base text-gray-500 line-through">{product.prevPrice} DA</div>
          )}
        </div>
        <div className="flex gap-2 mt-auto">
          <Link href={!isOutOfStock ? `/shop/${product.id}` : '#'} className="flex-1">
            <Button
              className='w-full'
              disabled={isOutOfStock}
            >
              {t('product.orderNow')}
            </Button>
          </Link>
          <Button
            variant='light'
            className="flex items-center justify-center shadow border border-[#c1a36f] text-[#c1a36f] hover:bg-[#c1a36f] hover:text-white"
            aria-label={t('product.addToCart')}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
