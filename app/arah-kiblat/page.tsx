import PageContainer from "@/components/layout/page-container";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { appLocale, appUrl, brandName } from "@/config";
import { Metadata } from "next";
import QiblaFinder from "@/components/QiblaFinder";
import { renderMd } from "@/hooks/common";
import { Card } from "@/components/ui/card";

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

const introContent = `
    # Pencari Arah Kiblat Online 🧭

    ## Assalamu'alaikum Warahmatullahi Wabarakatuh

    Selamat datang di aplikasi Pencari Arah Kiblat Online. Kami berharap alat ini dapat membantu Anda menemukan arah kiblat dengan mudah dan akurat, di mana pun Anda berada.

    ## Fitur-fitur Aplikasi

    - 🎯 Penentuan arah kiblat akurat
    - 📱 Kompatibel dengan berbagai perangkat
    - 🌐 Bekerja di seluruh dunia
    - 🔄 Pembaruan otomatis sesuai lokasi
    - 📏 Tampilan kompas yang mudah dibaca
    - ℹ️ Panduan penggunaan sederhana

    Aplikasi ini dirancang untuk memudahkan umat Muslim dalam menentukan arah kiblat, terutama saat bepergian atau berada di tempat yang tidak familiar. Semoga alat ini bisa membantu kita semua dalam menjalankan ibadah dengan lebih yakin.

    Mari kita gunakan teknologi ini sebagai sarana untuk meningkatkan kekhusyukan dalam beribadah. Semoga bermanfaat dan membawa keberkahan bagi kita semua.

    Jazakumullahu Khairan.
  `;

async function ArahKiblatPage() {
  const intro = await renderMd(introContent);

  return (
    <>
      <Header />
      <main className="sm:container flex flex-col sm:gap-4 py-4">
        <QiblaFinder />
        {intro && (
          <Card className="p-8 my-12 container max-w-md">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {intro}
            </div>
          </Card>
        )}
      </main>
      <Footer />
    </>
  );
}

export default ArahKiblatPage;
