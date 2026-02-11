'use client';
import { useState } from 'react';
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { i18n } = useTranslation();
  const videoId = "C2lSy04yZno"; // Your YouTube video ID

  const content = {
    title: {
      en: "See Our Store in Action",
      fr: "Découvrez Notre Magasin en Action",
      ar: "شاهد متجرنا في العمل"
    },
    description: {
      en: "Take a virtual tour of our store and discover what makes us special",
      fr: "Faites une visite virtuelle de notre magasin et découvrez ce qui nous rend spéciaux",
      ar: "قم بجولة افتراضية في متجرنا واكتشف ما يجعلنا مميزين"
    },
    learnMore: {
      en: "Learn More About Us",
      fr: "En Savoir Plus Sur Nous",
      ar: "اعرف المزيد عنا"
    }
  };

  return (
    <div className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {content.title[i18n.language as keyof typeof content.title]}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {content.description[i18n.language as keyof typeof content.description]}
          </p>
        </div>

        <div className="mt-12">
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800" style={{ paddingTop: '56.25%' }}>
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title="Store Tour"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full">
                  <Image
                    src="/video-thumbnail.jpg"
                    alt="Video thumbnail"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group"
                  >
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/90 transition-all hover:bg-white">
                      <div className="absolute inset-0 rounded-full bg-brand-500 opacity-20 blur-xl transition-all group-hover:opacity-30" />
                      <svg
                        className="h-8 w-8 text-brand-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href={'/about'}><Button variant="outline" size="md">
              {content.learnMore[i18n.language as keyof typeof content.learnMore]}
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 