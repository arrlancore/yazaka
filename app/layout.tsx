import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

import localFont from "next/font/local";
import { Scheherazade_New, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import {
  appTitle,
  appDescription,
  appUrl,
  brandName,
  defaultAuthor,
  appLocale,
} from "@/config";
import Providers from "@/components/providers";
import GoogleAnalytics from "@/components/analytics/google-analytics";
import ResponsiveLayout from "@/components/responsive-layout";
import ServiceWorkerProvider from "@/components/pwa/ServiceWorkerProvider";
import OfflineIndicator from "@/components/pwa/OfflineIndicator";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: appTitle,
    template: `%s | ${brandName}`,
  },
  description: appDescription,
  authors: [{ name: defaultAuthor }],
  creator: defaultAuthor,
  openGraph: {
    type: "website",
    locale: appLocale,
    url: appUrl,
    title: appTitle,
    description: appDescription,
    siteName: brandName,
  },
  twitter: {
    card: "summary_large_image",
    title: appTitle,
    description: appDescription,
    images: [`${appUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/icons/icon-192x192.png",
    shortcut: "/images/icons/icon-192x192.png",
    apple: "/images/icons/icon-192x192.png",
  },
};

const scheherazade = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-scheherazade",
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-noto-naskh",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body className={`${scheherazade.variable} ${notoNaskh.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <ServiceWorkerProvider />
            <OfflineIndicator />
            <ResponsiveLayout>
              {children}
            </ResponsiveLayout>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
