'use client';

import Link from 'next/link'
import React from 'react'
import { Facebook, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { TikTokIcon, WhatsAppIcon } from '@/components/contact/ContactSection';

const socialLinks = [
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
    id: 4,
    icon: TikTokIcon,
    name: "LinkedIn",
    link: "https://www.tiktok.com/@softlinge?_r=1&_t=ZS-9124LWaFr8x",
  },
  {
    id: 5,
    icon: WhatsAppIcon,
    name: "WhatsApp",
    link: "https://wa.me/213674041838",
  },
];

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              <Image src={'/logo.JPG'} width={60} height={60} alt='Bensaoud Auto' />
            </Link>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-6">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              // Check if it's a Lucide icon (has size prop) or custom SVG (needs width/height)
              const isLucideIcon = social.id === 1 || social.id === 3;

              return (
                <a
                  key={social.id}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  {isLucideIcon ? (
                    <Icon size={24} />
                  ) : (
                    <Icon width={24} height={24} />
                  )}
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 w-full">
            <p className="text-base text-gray-400 text-center">
              {t('footer.rights', { year: currentYear })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
