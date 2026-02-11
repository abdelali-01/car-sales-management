'use client'
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { removeFromCart, updateQuantity, clearCart } from '@/store/cart/cartSlice';
import { useCartSidebar } from '@/context/CartSidebarContext';
import Image from 'next/image';
import Button from '../button/Button';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';

const getImageSrc = (img: string) => {
  if (!img) return '/images/placeholder.png';
  if (img.startsWith('data:image') || img.startsWith('http')) return img;
  return `${img}`;
};

const CartSidebar: React.FC = () => {
  const { isOpen, closeCart } = useCartSidebar();
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  const pathname = usePathname();

  useEffect(()=>{
    closeCart();
  },[pathname]);

  const content = {
    title: {
      en: "Your Cart",
      fr: "Votre Panier",
      ar: "سلة التسوق"
    },
    empty: {
      en: "Your cart is empty.",
      fr: "Votre panier est vide.",
      ar: "سلة التسوق فارغة."
    },
    total: {
      en: "Total:",
      fr: "Total :",
      ar: "المجموع:"
    },
    checkout: {
      en: "Checkout",
      fr: "Commander",
      ar: "إتمام الطلب"
    },
    clearCart: {
      en: "Clear Cart",
      fr: "Vider le Panier",
      ar: "مسح السلة"
    }
  };

  console.log("Cart Sidebar Rendered" , cart);
  const total = cart && cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />
      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-99999 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: '100%', maxWidth: 400 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">{content.title[i18n.language as keyof typeof content.title]}</h2>
          <button onClick={closeCart} className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-2xl">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-16">{content.empty[i18n.language as keyof typeof content.empty]}</div>
          ) : (
            cart.map((item, idx) => (
              <div key={item.id + JSON.stringify(item.attributes) + idx} className="flex gap-4 items-center border-b pb-4 last:border-b-0">
                <div className="w-20 h-20 relative flex-shrink-0">
                  <Image src={getImageSrc(item.images[0])} alt={item.name} fill className="object-cover rounded-lg" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">{item.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{item.price} DA</div>
                  <div className="flex items-center gap-2 mt-2 dark:text-white">
                    <button onClick={() => dispatch(updateQuantity({ id: item.id, cartQuantity: Math.max(1, item.cartQuantity - 1), attributes: item.attributes }))} className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">-</button>
                    <span>{item.cartQuantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ id: item.id, cartQuantity: item.cartQuantity + 1, attributes: item.attributes }))} className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">+</button>
                  </div>
                </div>
                <button onClick={() => dispatch(removeFromCart({ id: item.id, attributes: item.attributes }))} className="text-red-500 hover:text-red-700 text-lg ml-2">&times;</button>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg dark:text-white">{content.total[i18n.language as keyof typeof content.total]}</span>
            <span className="font-bold text-xl text-brand-500">{total} DA</span>
          </div>
          <Link href={'/checkout'}>
            <Button className="w-full mb-2" disabled={cart.length === 0}>{content.checkout[i18n.language as keyof typeof content.checkout]}</Button>
          </Link>
          <Button className="w-full" variant="outline" onClick={() => dispatch(clearCart())} disabled={cart.length === 0}>{content.clearCart[i18n.language as keyof typeof content.clearCart]}</Button>
        </div>
      </aside>
    </>
  );
};

export default CartSidebar; 