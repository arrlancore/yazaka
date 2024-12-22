"use client";
import React from "react";
import QuranHeader from "@/components/quran/QuranHeader";
import LastReadSection from "@/components/quran/LastReadSection";
import PopularSurahsSection from "@/components/quran/PopularSurahsSection";
import SurahList from "@/components/quran/SurahList";
import { surahsBahasa, topSurahs } from "@/content/quran/metadata";

const QuranPage = () => {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <QuranHeader />
      <LastReadSection />
      <PopularSurahsSection topSurahs={topSurahs} />
      <SurahList surahs={surahsBahasa} />
    </div>
  );
};

export default QuranPage;
