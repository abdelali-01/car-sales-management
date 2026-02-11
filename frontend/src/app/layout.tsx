import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import StoreProvider from './StoreProvider';
import AuthInitializer from './AuthInitializer';
import ToastProvider from './ToastProvider';
import { Metadata } from 'next';
import I18nProvider from './I18nProvider';
import PixelProvider from '@/lib/PixelProvider';

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bensaoud Auto • China Dubai Export Cars",
    template: "%s | Bensaoud Auto",
  },
  description:
    "Bensaoud Auto — Importation et vente de véhicules depuis la Chine et Dubaï. Découvrez notre inventaire de voitures de qualité.",
  icons: {
    icon: "/logo.JPG",
    shortcut: "/logo.JPG"
  },
  openGraph: {
    title: "Bensaoud Auto • China Dubai Export Cars",
    description:
      "Bensaoud Auto — Importation et vente de véhicules depuis la Chine et Dubaï. Découvrez notre inventaire de voitures de qualité.",
    siteName: "Bensaoud Auto",
    images: [
      {
        url: "/logo.JPG",
        width: 192,
        height: 192,
        alt: "Bensaoud Auto Logo",
      },
    ],
    type: "website",
    locale: "fr_FR"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <StoreProvider>
          <I18nProvider>
            <ToastProvider />
            <AuthInitializer />
            <ThemeProvider>
              <SidebarProvider>
                {children}
              </SidebarProvider>
            </ThemeProvider>
          </I18nProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
