import PageContainer from "@/components/layout/page-container";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { appLocale, appUrl, brandName } from "@/config";
import { Metadata } from "next";
import QiblaFinder from "@/components/QiblaFinder";

export const metadata: Metadata = {
  title: "Pencari Arah Kiblat | Aplikasi Kompas Kiblat Online",
  description:
    "Temukan arah kiblat dengan mudah menggunakan aplikasi pencari arah kiblat online kami. Akurat, mudah digunakan, dan gratis untuk semua Muslim.",
  openGraph: {
    title: "Pencari Arah Kiblat | Kompas Kiblat Online Akurat",
    description:
      "Aplikasi pencari arah kiblat online yang akurat dan mudah digunakan. Temukan arah kiblat di mana saja dengan smartphone Anda.",
    url: appUrl + "/arah-kiblat",
    siteName: brandName,
    locale: appLocale,
    type: "website",
    images: [
      {
        url: `${appUrl}/images/qibla-finder-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Pencari Arah Kiblat Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pencari Arah Kiblat | Aplikasi Kompas Kiblat Online",
    description:
      "Temukan arah kiblat dengan mudah menggunakan aplikasi pencari arah kiblat online kami. Akurat dan gratis untuk semua Muslim.",
    images: [`${appUrl}/images/qibla-finder-twitter.jpg`],
  },
  keywords: [
    "arah kiblat",
    "kompas kiblat",
    "qibla finder",
    "aplikasi kiblat",
    "kiblat online",
    "arah sholat",
  ],
};

function ArahKiblatPage() {
  return (
    <>
      <PageContainer scrollable withContentTemplate={false}>
        <Header />
        <QiblaFinder />
        <Footer />
      </PageContainer>
    </>
  );
}

export default ArahKiblatPage;
