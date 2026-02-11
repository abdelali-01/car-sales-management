import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ContactCta() {
  const { t } = useTranslation();

  return (
    <section className="py-16">
      <div className="container mx-auto px-0 flex flex-col items-center">
        <div className="w-full rounded-none md:rounded-3xl bg-gradient-to-br from-brand-100/90 via-blue-100/80 to-blue-200/80 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 shadow-2xl p-10 flex flex-col items-center text-center gap-6 border border-gray-100 dark:border-gray-800">
          <Mail className="w-12 h-12 text-brand-500 mb-2" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            {t('home.contactCta.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-lg">
            {t('home.contactCta.description')}
          </p>
          <Link
            href="/contact"
            className="inline-block bg-brand-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-brand-700 transition-colors mt-4"
          >
            {t('home.contactCta.button')}
          </Link>
        </div>
      </div>
    </section>
  );
} 