'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { fetchProducts } from '@/store/products/productHandler';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import { useCartSidebar } from '@/context/CartSidebarContext';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { openCart } = useCartSidebar();
  const items = useSelector((state: RootState) => state.cart.items);
  const cartItemsCount = items.reduce((total, item) => total + item.cartQuantity, 0);
  const { i18n, t } = useTranslation();

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.shop'), href: '/shop' },
    // { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-800/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src={'/logo.png'} width={120} height={60} alt='Soft de Maison logo' className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-900 dark:text-gray-100 hover:text-[#c1a36f] dark:hover:text-[#c1a36f] transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}

          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Desktop Language and Theme Switchers */}
            {/* <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <select
                  onChange={(e) => changeLanguage(e.target.value)}
                  value={i18n.language}
                  className="bg-transparent text-gray-700 dark:text-gray-300  py-2 pl-8 pr-4 rounded-md appearance-none focus:outline-none focus:ring-0"
                >
                  <option value="en" className='text-gray-700'>EN</option>
                  <option value="fr" className='text-gray-700'>FR</option>
                  <option value="ar" className='text-gray-700'>AR</option>
                </select>
                <GlobeAltIcon className="h-5 w-5 absolute left-2 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-300" />
              </div>
              <ThemeToggleButton />
            </div> */}

            <button
              type="button"
              onClick={openCart}
              className="relative text-gray-900 dark:text-gray-100 hover:text-[#c1a36f] dark:hover:text-[#c1a36f] transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute  -top-2 -right-2 bg-brand-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-900 dark:text-gray-100 hover:text-[#c1a36f] dark:hover:text-[#c1a36f] transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>


        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 dark:border-gray-800/20 backdrop-blur-md bg-white/90 dark:bg-gray-900/90">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-[#c1a36f] transition-colors"
                >
                  {item.name}
                </Link>
              ))}

              {/* Language and Theme Switchers for Mobile */}
              {/* <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <GlobeAltIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    <select
                      onChange={(e) => changeLanguage(e.target.value)}
                      value={i18n.language}
                      className="bg-transparent text-gray-700 dark:text-gray-300 py-1 rounded-md appearance-none focus:outline-none focus:ring-0 text-sm"
                    >
                      <option value="en" className='text-gray-700'>English</option>
                      <option value="fr" className='text-gray-700'>Français</option>
                      <option value="ar" className='text-gray-700'>العربية</option>
                    </select>
                  </div>
                  <ThemeToggleButton />
                </div>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
