'use client';
import { useState } from 'react';
import Button  from "@/components/ui/button/Button";

export default function Subscription() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribing email:', email);
  };

  return (
    <div className="relative py-16 overflow-hidden bg-brand-500">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-400 opacity-90" />
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Stay Updated with Our Latest Products
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Subscribe to our newsletter and be the first to know about new arrivals and exclusive offers
          </p>
        </div>

        <div className="mt-12 max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="sm:flex">
            <div className="min-w-0 flex-1">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="block w-full rounded-lg border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                required
              />
            </div>
            <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
              <Button
                type="submit"
                variant="light"
                size="md"
                className="w-full"
              >
                Subscribe
              </Button>
            </div>
          </form>
          <p className="mt-4 text-sm text-white/80">
            We care about your data. Read our{' '}
            <a href="#" className="font-medium text-white underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
} 