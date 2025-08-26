"use client";

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { googleAnalyticsId } from '@/config';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Google Analytics page view tracking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', googleAnalyticsId, {
      page_path: url,
    });
  }
};

// Google Analytics event tracking
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (googleAnalyticsId) {
      pageview(pathname);
    }
  }, [pathname]);

  // Only render if GA ID is available
  if (!googleAnalyticsId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });
          `,
        }}
      />
    </>
  );
}