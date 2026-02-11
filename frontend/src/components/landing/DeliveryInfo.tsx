import { Truck, Smile, HandCoins } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DeliveryInfo = () => {
  const { i18n } = useTranslation();

  const features = [
    {
      icon: <Truck className="w-8 h-8 text-brand-500" />,
      title: {
        en: "Fast & Reliable Delivery",
        fr: "Livraison Rapide et Fiable",
        ar: "توصيل سريع وموثوق"
      },
      desc: {
        en: "We deliver to all Algerian cities",
        fr: "Nous livrons dans toutes les villes algériennes",
        ar: "نحن نوصّل إلى جميع المدن الجزائرية"
      },
      bg: 'bg-brand-50 dark:bg-brand-900',
    },
    {
      icon: <Smile className="w-8 h-8 text-green-500" />,
      title: {
        en: "10,000+ Happy Customers",
        fr: "10,000+ Clients Satisfaits",
        ar: "10,000+ عميل سعيد"
      },
      desc: {
        en: "Trusted by thousands of Algerians. Your satisfaction is our priority.",
        fr: "Fait confiance par des milliers d'Algériens. Votre satisfaction est notre priorité.",
        ar: "موثوق به من قبل آلاف الجزائريين. رضاك هو أولويتنا."
      },
      bg: 'bg-green-50 dark:bg-green-900',
    },
    {
      icon: <HandCoins className="w-8 h-8 text-yellow-500" />,
      title: {
        en: "Cash on Delivery",
        fr: "Paiement à la Livraison",
        ar: "الدفع عند الاستلام"
      },
      desc: {
        en: "Pay only after you receive and check your product. No risk, no worries.",
        fr: "Payez seulement après avoir reçu et vérifié votre produit. Aucun risque, aucun souci.",
        ar: "ادفع فقط بعد استلام وفحص منتجك. لا مخاطر، لا قلق."
      },
      bg: 'bg-yellow-50 dark:bg-yellow-900',
    },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center bg-gray-200 dark:bg-gray-900/80 rounded-2xl shadow-lg p-8 transition hover:scale-105 hover:shadow-xl border border-gray-200 dark:border-gray-800"
            >
              <div className={`mb-4 p-4 rounded-full ${f.bg} shadow-sm`}>{f.icon}</div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{f.title[i18n.language as keyof typeof f.title]}</h4>
              <p className="text-gray-600 dark:text-gray-300 text-base">{f.desc[i18n.language as keyof typeof f.desc]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeliveryInfo; 