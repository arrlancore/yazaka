import { Metadata } from "next";
import { renderMd } from "@/hooks/common";
import { Card } from "@/components/ui/card";
import LazyHafalanQuran from "@/components/lazy/LazyHafalanQuran";
import { appLocale, appUrl, brandName } from "@/config";

export const metadata: Metadata = {
  title:
    "Aplikasi Hafalan Quran Tracker | Pantau Progres Hafalan Al-Quran Anda",
  description:
    "Pantau dan kelola hafalan Al-Quran Anda dengan mudah menggunakan Aplikasi Hafalan Quran Tracker. Catat progres, set target, dan tingkatkan konsistensi dalam menghafal Al-Quran.",
  openGraph: {
    title: "Aplikasi Hafalan Quran Tracker | Pantau Progres Hafalan Al-Quran",
    description:
      "Kelola dan pantau hafalan Al-Quran Anda dengan mudah. Set target, catat progres, dan tingkatkan konsistensi dalam menghafal Al-Quran.",
    url: `${appUrl}/hafalan-quran`,
    siteName: brandName,
    locale: appLocale,
    type: "website",
    images: [
      {
        url: `${appUrl}/images/hafalan-quran-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Aplikasi Hafalan Quran Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aplikasi Hafalan Quran Tracker | Pantau Progres Hafalan Al-Quran",
    description:
      "Kelola hafalan Al-Quran Anda dengan mudah. Set target, catat progres, dan tingkatkan konsistensi dalam menghafal.",
    images: [`${appUrl}/images/hafalan-quran-twitter.jpg`],
  },
  keywords: [
    "hafalan quran",
    "quran tracker",
    "aplikasi hafalan",
    "menghafal al-quran",
    "progres hafalan",
    "target hafalan",
  ],
};

const introContent = `
    # Aplikasi Hafalan Quran Tracker 🧭

    Assalamu'alaikum Warahmatullahi Wabarakatuh,

    Selamat datang di Aplikasi Hafalan Quran Tracker! 🌟

    Aplikasi ini dirancang untuk membantu Anda dalam perjalanan menghafal Al-Quran yang mulia. Dengan fitur-fitur yang mudah digunakan, Anda dapat:

    - 📊 Memantau progres hafalan Anda
    - 🎯 Menetapkan target harian atau mingguan
    - 📝 Mencatat ayat-ayat yang telah dihafal
    - 🔄 Mengatur jadwal muraja'ah (pengulangan)
    - 📈 Melihat statistik dan perkembangan hafalan Anda

    Semoga aplikasi ini dapat membantu Anda menjaga konsistensi dan meningkatkan kualitas hafalan Al-Quran Anda. Mari bersama-sama menjaga kalam Allah dalam hati dan pikiran kita.

    Jazakumullahu Khairan. Semoga Allah memberkahi usaha kita semua.
  `;

async function HafalanQuranPage() {
  const intro = await renderMd(introContent);

  return (
    <main className="flex flex-col pb-4">
      <LazyHafalanQuran />
      {intro && (
        <Card className="p-8 my-12 mx-4 border-none shadow-none rounded-none sm:container sm:mx-auto sm:max-w-xl sm:border sm:shadow-sm sm:rounded-2xl">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {intro}
          </div>
        </Card>
      )}
    </main>
  );
}

export default HafalanQuranPage;
