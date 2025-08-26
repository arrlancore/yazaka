import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

import localFont from "next/font/local";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
