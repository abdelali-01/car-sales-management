'use client';

import '../i18n';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function I18nProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure i18n is fully initialized
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      i18n.on('initialized', () => setIsReady(true));
    }
  }, [i18n]);

  // Show nothing while loading to prevent hydration mismatch
  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}