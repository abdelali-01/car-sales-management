'use client';
import { useState } from 'react';
import Image from 'next/image';
import Button from "@/components/ui/button/Button";
import { services } from '../../../public/data';

export default function Services() {
  const [activeService, setActiveService] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  const nextService = () => {
    setActiveService((prev) => (prev + 1) % services.length);
    setActiveImage(0);
  };

  const prevService = () => {
    setActiveService((prev) => (prev - 1 + services.length) % services.length);
    setActiveImage(0);
  };

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % services[activeService].images.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + services[activeService].images.length) % services[activeService].images.length);
  };

  return (
    <div className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Our Services
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Professional services tailored to your needs
          </p>
        </div>

        <div className="mt-12">
          <div className="relative">
            {/* Service Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {services.map((service, index) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setActiveService(index);
                    setActiveImage(0);
                  }}
                  className={`px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                    activeService === index
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {service.title}
                </button>
              ))}
            </div>

            {/* Service Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Image Carousel */}
              <div className="relative w-full max-w-xl mx-auto">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={services[activeService].images[activeImage]}
                    alt={services[activeService].title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Image Navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {services[activeService].images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-2 h-2 rounded-full ${
                        activeImage === index ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Image Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full hover:bg-white dark:hover:bg-gray-800"
                >
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full hover:bg-white dark:hover:bg-gray-800"
                >
                  <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Service Details */}
              <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {services[activeService].title}
                </h3>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  {services[activeService].description}
                </p>
                <ul className="mt-6 space-y-3">
                  {services[activeService].features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                      <svg className="w-5 h-5 text-brand-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button variant="primary" size="md">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>

            {/* Service Navigation Arrows */}
            <button
              onClick={prevService}
              className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextService}
              className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 