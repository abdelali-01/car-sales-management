'use client';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Target,
  Eye,
  Heart,
  Shield,
  Leaf,
  Award,
  Users,
  Globe,
  Star,
  Zap,
  CheckCircle,
  Truck,
  ThumbsUp
} from 'lucide-react';
import Link from 'next/link';

interface AboutSectionItem {
  id: number;
  title: {
    en: string;
    fr: string;
    ar: string;
  };
  description: {
    en: string;
    fr: string;
    ar: string;
  };
  icon: React.ComponentType<{ className?: string }>;
  points: {
    en: string[];
    fr: string[];
    ar: string[];
  };
  color: string;
  bgColor: string;
}

const AboutSection = () => {
  const { t, i18n } = useTranslation();

  const aboutContent: AboutSectionItem[] = [
    {
      id: 1,
      title: {
        en: "Our Mission",
        fr: "Notre mission",
        ar: "مهمتنا"
      },
      description: {
        en: "To provide reliable, high-quality products that enhance everyday life and deliver great value to our customers.",
        fr: "Fournir des produits fiables et de haute qualité qui améliorent la vie quotidienne et offrent une réelle valeur à nos clients.",
        ar: "تقديم منتجات موثوقة وعالية الجودة تعزز الحياة اليومية وتوفر قيمة حقيقية لعملائنا."
      },
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      points: {
        en: [
          "Trusted product selection",
          "Focus on customer satisfaction",
          "Fair and transparent service"
        ],
        fr: [
          "Sélection de produits fiables",
          "Satisfaction client au cœur de nos priorités",
          "Service équitable et transparent"
        ],
        ar: [
          "اختيار منتجات موثوقة",
          "التركيز على رضا العملاء",
          "خدمة عادلة وشفافة"
        ]
      }
    },
    {
      id: 2,
      title: {
        en: "Our Vision",
        fr: "Notre vision",
        ar: "رؤيتنا"
      },
      description: {
        en: "To become a go-to destination for quality products and dependable service, building long-term relationships with our customers.",
        fr: "Devenir une destination incontournable pour des produits de qualité et un service fiable, en construisant des relations durables avec nos clients.",
        ar: "أن نكون وجهتك الأولى للمنتجات عالية الجودة والخدمة الموثوقة، من خلال بناء علاقات طويلة الأمد مع عملائنا."
      },
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      points: {
        en: [
          "Customer-first approach",
          "Consistent product excellence",
          "Growth through trust and service"
        ],
        fr: [
          "Approche axée sur le client",
          "Excellence constante des produits",
          "Croissance grâce à la confiance et au service"
        ],
        ar: [
          "نهج يركز على العميل",
          "تميز دائم في المنتجات",
          "النمو من خلال الثقة والخدمة"
        ]
      }
    },
    {
      id: 3,
      title: {
        en: "Our Values",
        fr: "Nos valeurs",
        ar: "قيمنا"
      },
      description: {
        en: "We believe in integrity, quality, and respect — values that drive every part of our business.",
        fr: "Nous croyons en l'intégrité, la qualité et le respect — des valeurs qui guident chaque aspect de notre activité.",
        ar: "نؤمن بالنزاهة والجودة والاحترام — وهي القيم التي تقود كل جانب من جوانب عملنا."
      },
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      points: {
        en: [
          "Honest business practices",
          "Commitment to quality",
          "Respect for our customers and team"
        ],
        fr: [
          "Pratiques commerciales honnêtes",
          "Engagement envers la qualité",
          "Respect des clients et de l'équipe"
        ],
        ar: [
          "ممارسات تجارية نزيهة",
          "الالتزام بالجودة",
          "الاحترام لعملائنا وفريقنا"
        ]
      }
    }
  ];
  

  const storeDescription: Record<string, string> = {
    en: "We are dedicated to offering high-quality products sourced from trusted partners, ensuring a reliable and satisfying shopping experience. Our goal is to combine quality, value, and customer care to meet your everyday needs.",
    fr: "Nous nous engageons à offrir des produits de haute qualité issus de partenaires de confiance, pour garantir une expérience d'achat fiable et satisfaisante. Notre objectif est d’allier qualité, valeur et service client pour répondre à vos besoins quotidiens.",
    ar: "نحن ملتزمون بتقديم منتجات عالية الجودة من مصادر موثوقة، لضمان تجربة تسوق موثوقة ومرضية. هدفنا هو الجمع بين الجودة والقيمة والاهتمام بالعميل لتلبية احتياجاتك اليومية."
  };
  

  const features = [
    {
      icon: Shield,
      title: { en: "Trusted Quality", fr: "Qualité Fiable", ar: "جودة موثوقة" },
      description: {
        en: "We select only the best products and partners.",
        fr: "Nous sélectionnons uniquement les meilleurs produits et partenaires.",
        ar: "نختار أفضل المنتجات وأفضل الشركاء فقط."
      }
    },
    {
      icon: Truck,
      title: { en: "Fast Delivery", fr: "Livraison Rapide", ar: "توصيل سريع" },
      description: {
        en: "Get your orders on time, every time.",
        fr: "Recevez vos commandes à temps, à chaque fois.",
        ar: "احصل على طلباتك في الوقت المحدد في كل مرة."
      }
    },
    {
      icon: ThumbsUp,
      title: { en: "Customer Satisfaction", fr: "Satisfaction Client", ar: "رضا العملاء" },
      description: {
        en: "Your satisfaction is our top priority.",
        fr: "Votre satisfaction est notre priorité.",
        ar: "رضاك هو أولويتنا القصوى."
      }
    },
    {
      icon: Users,
      title: { en: "Community Support", fr: "Soutien Communautaire", ar: "دعم المجتمع" },
      description: {
        en: "We support local businesses and value connections.",
        fr: "Nous soutenons les entreprises locales et valorisons les liens humains.",
        ar: "ندعم المشاريع المحلية ونقدّر العلاقات الإنسانية."
      }
    }
  ];
  

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            {t('about.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Store Identity Card */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-8 md:p-12 rounded-3xl shadow-2xl mb-20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-4xl md:text-5xl font-extrabold">
                Store name
              </h2>
            </div>
            <p className="text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
              {storeDescription[i18n.language as keyof typeof storeDescription]}
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {feature.title[i18n.language as keyof typeof feature.title]}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description[i18n.language as keyof typeof feature.description]}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="space-y-16">
          {aboutContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
            >
              {/* Icon Section */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className={`w-48 h-48 ${item.bgColor} rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <item.icon className={`w-24 h-24 ${item.color} relative z-10`} />
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full opacity-30"></div>
                </motion.div>
              </div>

              {/* Content Section */}
              <div className="w-full lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Zap className={`w-8 h-8 ${item.color}`} />
                    {item.title[i18n.language as keyof typeof item.title]}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
                    {item.description[i18n.language as keyof typeof item.description]}
                  </p>
                  {item.points && (
                    <ul className="space-y-4">
                      {Array.isArray(item.points[i18n.language  as keyof typeof item.points]) && item.points[i18n.language as keyof typeof item.points].map((point, pointIndex) => (
                        <motion.li
                          key={pointIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.5 + pointIndex * 0.1 }}
                          className="flex items-center gap-3 text-gray-600 dark:text-gray-400 group"
                        >
                          <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-lg">{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 md:p-12 rounded-3xl text-white">
            <Globe className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {i18n.language === 'en' ? 'Discover the Magic of Natural Honey' :
                i18n.language === 'fr' ? 'Découvrez la Magie du Miel Naturel' :
                  'اكتشف سحر العسل الطبيعي'}
            </h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              {i18n.language === 'en' ? 'Join thousands of satisfied customers who trust Bioasis for their daily dose of natural goodness.' :
                i18n.language === 'fr' ? 'Rejoignez des milliers de clients satisfaits qui font confiance à Bioasis pour leur dose quotidienne de bienfaits naturels.' :
                  'انضم إلى آلاف العملاء الراضين الذين يثقون بـ Bioasis للحصول على جرعتهم اليومية من الخير الطبيعي.'}
            </p>
            <Link href={'/shop'}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-amber-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                {i18n.language === 'en' ? 'Explore Our Products' :
                  i18n.language === 'fr' ? 'Explorer Nos Produits' :
                    'استكشف منتجاتنا'}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection; 