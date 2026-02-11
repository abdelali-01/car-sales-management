'use client';
import { Modal } from '@/components/ui/modal';
import { CheckCircle, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderSuccessModal = ({ isOpen, onClose }: OrderSuccessModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md mx-4">
      <div className="p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('orderSuccess.title')}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('orderSuccess.message')}
        </p>

        {/* Order Status Steps */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center">
              <Package className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">{t('orderSuccess.orderConfirmed')}</span>
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Truck className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{t('orderSuccess.preparingDelivery')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {t('orderSuccess.continueShopping')}
          </button>
          
          <Link
            href="/"
            className="block w-full text-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-2 transition-colors"
          >
            {t('orderSuccess.backToHome')}
          </Link>
        </div>
      </div>
    </Modal>
  );
};

export default OrderSuccessModal; 