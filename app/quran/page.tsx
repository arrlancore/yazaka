import React from "react";
import QuranHeader from "@/components/quran/QuranHeader";
import LastReadSection from "@/components/quran/LastReadSection";
import PopularSurahsSection from "@/components/quran/PopularSurahsSection";
import SurahList from "@/components/quran/SurahList";
import { surahsBahasa, topSurahs } from "@/content/quran/metadata";
import { Metadata } from "next";
import { appLocale, appUrl, brandName } from "@/config";
import { renderMd } from "@/hooks/common";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Al-Quran Online | Baca dan Pelajari Al-Quran dengan Mudah",
  description:
    "Baca Al-Quran online dengan terjemahan bahasa Indonesia. Fitur lengkap termasuk tafsir, audio, dan pencarian ayat untuk memudahkan pembelajaran Al-Quran Anda.",
  openGraph: {
    title: "Al-Quran Online | Baca, Dengar, dan Pelajari Al-Quran",
    description:
      "Akses Al-Quran lengkap dengan terjemahan, tafsir, dan audio. Baca dan pelajari Al-Quran kapan saja, di mana saja.",
    url: appUrl + "/quran",
    siteName: brandName,
    locale: appLocale,
    type: "website",
    images: [
      {
        url: `${appUrl}/images/quran-online-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Al-Quran Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-Quran Online | Baca dan Pelajari Al-Quran dengan Mudah",
    description:
      "Baca Al-Quran online dengan terjemahan, tafsir, dan audio. Tingkatkan pemahaman Al-Quran Anda dengan mudah dan praktis.",
    images: [`${appUrl}/images/quran-online-twitter.jpg`],
  },
  keywords: [
    "Al-Quran online",
    "baca Quran",
    "terjemahan Al-Quran",
    "tafsir Al-Quran",
    "audio Al-Quran",
    "belajar Al-Quran",
  ],
};

const introContent = `
    # Pengenalan Aplikasi Quran Online 🌙

    ## Bismillah, Assalamu'alaikum Warahmatullahi Wabarakatuh

    Alhamdulillah, kami senang bisa menghadirkan aplikasi Al-Quran online ini untuk Anda. Semoga aplikasi ini bisa membantu kita semua dalam membaca dan memahami Al-Quran dengan lebih mudah di tengah kesibukan sehari-hari.

    ## Fitur-fitur Aplikasi

    - 📖 Baca Al-Quran kapan saja dan di mana saja
    - 🎧 Dengarkan bacaan ayat-ayat suci
    - 💡 Akses tafsir untuk pemahaman lebih mendalam
    - 🔍 Fitur pencarian ayat
    - 🏷️ Penanda terakhir dibaca
    - ⭐ Kumpulan surah-surah populer

    Kami berharap aplikasi ini bisa membantu kita semua untuk lebih dekat dengan Al-Quran. Semoga dengan kemudahan ini, kita bisa meningkatkan frekuensi membaca Al-Quran dan mendapatkan keberkahan darinya.

    Mari kita mulai menjelajahi Al-Quran bersama-sama. Semoga bermanfaat dan membawa kebaikan bagi kita semua. 

    Jazakumullahu Khairan.
    `;

const QuranPage = async () => {
  const intro = await renderMd(introContent);
  return (
    <main className="flex flex-col pb-4">
      <QuranHeader />
      <div className="px-4 space-y-4 sm:container sm:px-0 sm:max-w-2xl sm:mx-auto">
        <LastReadSection />
        <PopularSurahsSection topSurahs={topSurahs} />
        <SurahList surahs={surahsBahasa} />
        {intro && (
          <Card className="p-8 my-12 border-none shadow-none rounded-none sm:border sm:shadow-sm sm:rounded-2xl">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {intro}
            </div>
          </Card>
        )}
      </div>
    </main>
  );
};

export default QuranPage;
