'use client';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Facebook, Instagram } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useMetaPixel } from '@/hooks/useMetaPixel';

interface ContactInfoItem {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  link?: string;
  action? : string ;
}

interface SocialLinkItem {
  id: number;
  icon: React.ElementType;
  name: string;
  link: string;
}

export const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
    <g>
      <path d="M29 10.7v4c-2.7 0-5.5-0.7-7.8-2.1v9.6c0 4.2-3.7 7.8-8.2 7.8S4.8 26.3 4.8 22.1s3.7-7.8 8.2-7.8c0.5 0 1 0 1.4 0.1v4.2c-0.5-0.1-1-0.2-1.4-0.2-2 0-3.7 1.5-3.7 3.4s1.6 3.4 3.7 3.4c2 0 3.7-1.5 3.7-3.4V2.2h4.2c0.1 4.6 3.8 8.4 8.2 8.5z" />
    </g>
  </svg>
);
export const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
    <g>
      <path d="M16.10 3C9.09 3 3.16 8.92 3.16 15.93c0 2.75 1.03 5.33 2.89 7.42L3 29l5.75-2.01A13.06 13.06 0 0016.1 28c7.01 0 12.93-5.92 12.93-12.93S23.1 3 16.1 3zm0 24c-2.08 0-4.12-0.55-5.86-1.58l-0.42-0.25-3.42 1.2 1.13-3.3-0.28-0.43A10.74 10.74 0 015.88 15.93c0-5.64 4.59-10.23 10.22-10.23 5.63 0 10.22 4.59 10.22 10.23S21.72 27 16.1 27zm6.07-7.83c-0.14-0.07-0.88-0.43-1.01-0.48-0.14-0.05-0.24-0.07-0.34 0.08-0.1 0.14-0.39 0.48-0.48 0.58-0.09 0.1-0.18 0.11-0.33 0.04-0.14-0.07-0.6-0.22-1.14-0.71-0.42-0.37-0.7-0.82-0.78-0.96-0.08-0.14-0.01-0.21 0.06-0.29 0.07-0.08 0.14-0.18 0.21-0.29s0.09-0.22 0.04-0.36c-0.05-0.14-0.34-0.82-0.46-1.12-0.12-0.3-0.25-0.26-0.34-0.27l-0.29-0.01c-0.1 0-0.23 0.03-0.36 0.16-0.13 0.13-0.48 0.47-0.48 1.14 0 0.67 0.49 1.32 0.56 1.41 0.07 0.09 0.97 1.48 2.37 2.02 0.33 0.11 0.6 0.17 0.8 0.16 0.24-0.01 0.74-0.3 0.85-0.59 0.1-0.29 0.1-0.54 0.07-0.59z" />
    </g>
  </svg>
);

const ContactSection = () => {
  const { t } = useTranslation();
  const { trackContact, trackLead } = useMetaPixel();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const contactInfo: ContactInfoItem[] = [
    {
      id: 1,
      icon: Mail,
      title: t('contact.email.title'),
      description: 'mouhamine2005@gmail.com',
      link: `mailto:mouhamine2005@gmail.com`,
      action: t('contact.email.action')
    },
    {
      id: 2,
      icon: Phone,
      title: t('contact.phone.title'),
      description: '0674041838',
      link: `tel:0674041838`,
      action: t('contact.phone.action')
    },
    {
      id: 4,
      icon: WhatsAppIcon,
      title: 'WhatsApp',
      description: 'Messagez-nous instantanément sur WhatsApp',
      link: 'https://wa.me/213674041838',
      action: 'Discuter sur WhatsApp',
    },
  ];

  const socialLinks: SocialLinkItem[] = [
    {
      id: 1,
      icon: Facebook,
      name: "Facebook",
      link: "https://www.facebook.com/share/1AKSkaiLxi/",
    },
    {
      id: 3,
      icon: Instagram,
      name: "Instagram",
      link: "https://www.instagram.com/soft.linge.dz?igsh=ZmZya3FuNTZxN3lm&utm_source=qr",
    },
    {
      id: 5,
      icon: TikTokIcon,
      name: "TikTok",
      link: "https://www.tiktok.com/@softlinge?_r=1&_t=ZS-9124LWaFr8x",
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setFeedback('');
    try {
      await axios.post(process.env.NEXT_PUBLIC_SERVER+'/api/messages', formData);

      // Track Contact and Lead events
      trackContact();
      trackLead({
        content_name: 'Contact Form Submission',
        value: 0,
        currency: 'DZD'
      });

      setStatus('success');
      setFeedback(t('contact.form.success'));
      setFormData({ name: '', email: '', message: '' });
    } catch (err: unknown) {
      setStatus('error');
      if (
        typeof err === 'object' &&
        err != null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
      ) {
        setFeedback((err as { response: { data: { message: string } } }).response.data.message);
      } else {
        setFeedback(t('contact.form.error'));
      }
      console.log(err);
    }
  };

  useEffect(() => {
    if (status !== 'idle') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setFeedback('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[#c1a36f] mb-16">
          {t('contact.title')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="bg-[#f3efe7] dark:bg-gray-800 p-8 rounded-xl border border-[#efe9df] text-center flex flex-col items-center"
            >
              <item.icon className="w-12 h-12 text-[#c1a36f] dark:text-[#c1a36f] mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
                {item.description}
              </p>
              {item.link && (
                <a
                  href={item.link}
                  className="text-[#c1a36f] dark:text-[#c1a36f] hover:underline font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.action}
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#f3efe7] dark:bg-gray-800 p-8 rounded-xl border border-[#efe9df] max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-[#c1a36f] mb-8 text-center">
            {t('contact.form.title')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                {t('contact.form.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#efe9df] dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c1a36f] dark:focus:ring-[#c1a36f] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                {t('contact.form.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#efe9df] dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c1a36f] dark:focus:ring-[#c1a36f] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                {t('contact.form.message')}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#efe9df] dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c1a36f] dark:focus:ring-[#c1a36f] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-[#c1a36f] text-white py-3 rounded-lg flex items-center justify-center gap-2 font-bold hover:bg-[#ba9550] transition-colors tracking-wide shadow"
            >
              {t('contact.form.submit')}
            </button>
            {feedback && (
              <div className={`text-center mt-4 font-semibold ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{feedback}</div>
            )}
          </form>
        </motion.div>

        {/* Social Media Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-[#f3efe7] dark:bg-gray-700 p-8 rounded-xl border border-[#efe9df] mt-16 max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-8 text-[#c1a36f]">
            {t('contact.social.title')}
          </h2>
          <div className="flex justify-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-white text-[#c1a36f] rounded-full flex items-center justify-center text-2xl hover:bg-[#c1a36f] hover:text-white transition-colors shadow-md"
                aria-label={social.name}
              >
                <social.icon size={32} />
              </a>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default ContactSection; 