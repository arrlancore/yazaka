"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Verse from "./verse";
import AyatNavigation from "./ayat-navigation";
import { useQuranLastRead } from "@/hooks/useQuranLastRead";
import React, { useEffect } from "react";
import useBrowserDetection from "@/hooks/useBrowserDetection";
import { Alert, AlertDescription } from "./ui/alert";

export type AyatDetailProps = {
  surahNumber: number;
  surahName: string;
  surahArabicName: string;
  surahMeaning: string;
  totalVerses: number;
  surahType: string;
  verse: {
    number: number;
    arabic: string;
    arabicTajweed?: string;
    translation: string;
    transliteration: string;
    audioUrl?: string;
    tafsir?: string;
    meta: {
      juz: number;
      page: number;
    };
  };
};

const AyatDetail: React.FC<AyatDetailProps> = ({
  surahNumber,
  surahName,
  surahArabicName,
  surahMeaning,
  totalVerses,
  surahType,
  verse,
}) => {
  const { lastRead, updateLastRead } = useQuranLastRead();
  const { isWebKit, isSafari } = useBrowserDetection();

  const handleSetLastRead = (ayatNumber: number) => {
    updateLastRead(surahNumber, surahName, ayatNumber);
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [verse.number]);

  return (
    <Card className="border-none sm:border transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-none sm:shadow-lg text-foreground rounded-b-[2rem] p-0">
      <CardContent className="p-0">
        {/* Surah Info Header */}
        <div className="bg-primary/5 p-4 text-center border-b">
          <h1 className="text-lg font-semibold mb-1">
            {surahNumber}. {surahName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {surahArabicName} • {surahMeaning}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {surahType} • {totalVerses} Ayat
          </p>
        </div>

        {isSafari && (
          <Alert variant="default" className="my-4 mx-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Tampilan Al-Qur'an ini lebih optimal jika dibuka menggunakan
              browser Firefox, Chrome, atau Edge untuk pengalaman yang lebih
              baik.
            </AlertDescription>
          </Alert>
        )}

        {/* Verse Content */}
        <div className="bg-background p-0 sm:p-4">
          <Verse
            transliteration={verse.transliteration}
            arabic={verse.arabic}
            arabicTajweed={verse.arabicTajweed}
            translation={verse.translation}
            number={verse.number}
            audioUrl={verse.audioUrl}
            tafsir={verse.tafsir}
            isLastRead={
              lastRead?.surahNumber === surahNumber &&
              lastRead?.ayatNumber === verse.number
            }
            onSetLastRead={(ayatNumber) => handleSetLastRead(ayatNumber)}
            isWebKit={isWebKit}
          />

          {/* Meta Information */}
          <div className="mt-4 p-3 bg-primary/10 text-muted-foreground flex justify-between items-center rounded">
            <span className="flex items-center text-xs">
              Halaman {verse.meta.page}
            </span>
            <span className="flex items-center text-xs">
              Juz {verse.meta.juz}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <AyatNavigation
          surahNumber={surahNumber}
          surahName={surahName}
          currentAyatNumber={verse.number}
          totalVerses={totalVerses}
        />
      </CardContent>
    </Card>
  );
};

export default AyatDetail;
