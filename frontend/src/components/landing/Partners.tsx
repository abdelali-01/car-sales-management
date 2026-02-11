'use client';
import Image from 'next/image';

const partners = [
  {
    name: 'Partner 1',
    logo: '/partners/partner1.png',
  },
  {
    name: 'Partner 2',
    logo: '/partners/partner2.png',
  },
  {
    name: 'Partner 3',
    logo: '/partners/partner3.png',
  },
  {
    name: 'Partner 4',
    logo: '/partners/partner4.png',
  },
  {
    name: 'Partner 5',
    logo: '/partners/partner5.png',
  },
];

export default function Partners() {
  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Trusted by Industry Leaders
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            We&apos;re proud to work with these amazing companies
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative w-32 h-12">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain filter dark:invert"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 