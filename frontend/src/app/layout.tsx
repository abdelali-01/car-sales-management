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
    default: "Soft Linge • Boutique de Linge de Maison Haut de Gamme",
    template: "%s | Soft Linge Boutique",
  },
  description:
    "Découvrez l'excellence du linge de maison : linge de lit, linge de bain et accessoires raffinés. Confort, style et qualité premium pour sublimer votre intérieur.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png"
  },
  openGraph: {
    title: "Soft Linge • Boutique de Linge de Maison Haut de Gamme",
    description:
      "Découvrez l'excellence du linge de maison : linge de lit, linge de bain et accessoires raffinés. Confort, style et qualité premium pour un intérieur élégant.",
    siteName: "Soft Linge Boutique",
    images: [
      {
        url: "/logo.png",
        width: 192,
        height: 192,
        alt: "Soft Linge Boutique Logo",
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
