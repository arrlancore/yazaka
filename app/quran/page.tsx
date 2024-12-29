import React from "react";
import QuranHeader from "@/components/quran/QuranHeader";
import LastReadSection from "@/components/quran/LastReadSection";
import PopularSurahsSection from "@/components/quran/PopularSurahsSection";
import SurahList from "@/components/quran/SurahList";
import { surahsBahasa, topSurahs } from "@/content/quran/metadata";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Metadata } from "next";
import { appLocale, appUrl, brandName } from "@/config";

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
const QuranPage = () => {
  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto mb-8">
        <QuranHeader />
        {/* <LastReadSection /> */}
        <PopularSurahsSection topSurahs={topSurahs} />
        <SurahList surahs={surahsBahasa} />
      </div>
      <Footer />
    </>
  );
};

export default QuranPage;
