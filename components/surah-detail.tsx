"use client";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Book } from "lucide-react";
import Verse from "./verse";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SurahNavigation from "./surah-navigation";
import { useRouter } from "next/navigation";
import { useQuranLastRead } from "@/hooks/useQuranLastRead";
import React, { useEffect } from "react";
import { shouldRenderMetaInfo } from "@/lib/quran-utils";
import { useIsWebKit } from "@/hooks/useIsWebKit";

export type SurahDetailProps = {
  number: number;
  name: string;
  arabicName: string;
  meaning: string;
  totalVerses: number;
  type: string;
  preBismillah?: {
    text: {
      arab: string;
      transliteration: string;
    };
    translation: {
      id: string;
    };
  };
  verses: {
    number: number;
    arabic: string;
    arabicTajweed?: string;
    translation: string;
    transliteration: string;
    audioUrl?: string;
    meta: {
      juz: number;
      page: number;
    };
  }[];
};

const SurahDetail: React.FC<SurahDetailProps> = (surah) => {
  const router = useRouter();
  const { lastRead, updateLastRead } = useQuranLastRead();
  const isWebKit = useIsWebKit();

  const handleSetLastRead = (ayatNumber: number) => {
    updateLastRead(surah.number, surah.name, ayatNumber);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const ayatNumber = parseInt(hash.slice(1));
        if (!isNaN(ayatNumber)) {
          const element = document.getElementById(`${ayatNumber}`);
          if (element) {
            setTimeout(() => {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100);
          }
        }
      }
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto mb-8">
      {/* Sticky Header */}
      <div
        className={cn(
          "sticky top-0 z-10 bg-gradient-to-r from-primary to-primary-light text-primary-foreground",
          "transition-all duration-300 px-4 py-2 shadow-md sm:rounded-t-[2rem]"
        )}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/20"
              onClick={() => router.push("/quran")}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h2 className="text-lg font-bold">
                {surah.number}. {surah.name}
              </h2>
              <div className="text-xs opacity-80">
                {surah.arabicName} • {surah.meaning}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs opacity-80">
              {surah.type} • {surah.totalVerses} Ayat
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/20"
            >
              <Book size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <Card className="border-none sm:border overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-none sm:shadow-lg text-foreground rounded-b-[2rem] p-0">
        <CardContent className="p-0">
          {/* pre bismillah */}
          {surah.preBismillah && (
            <div className="bg-background p-4 text-center">
              <p
                className="text-2xl mb-2"
                style={{
                  fontFamily: "'Uthmanic Hafs', Arial",
                  direction: "rtl",
                  lineHeight: 2,
                }}
              >
                {surah.preBismillah.text.arab}
              </p>
              <p className="text-xs text-muted-foreground">
                {surah.preBismillah.translation.id}
              </p>
            </div>
          )}
          {/* Verses */}
          <div className="bg-background p-0 sm:p-4">
            {surah.verses.map((verse) => {
              const shouldRenderInfo = shouldRenderMetaInfo(
                surah.number,
                verse.number,
                verse.meta.page,
                verse.meta.juz
              );

              return (
                <React.Fragment key={verse.number}>
                  <Verse
                    key={verse.number}
                    arabic={verse.arabic}
                    arabicTajweed={verse.arabicTajweed}
                    translation={verse.translation}
                    number={verse.number}
                    audioUrl={verse.audioUrl}
                    isLastRead={
                      lastRead?.surahNumber === surah.number &&
                      lastRead?.ayatNumber === verse.number
                    }
                    onSetLastRead={(ayatNumber) =>
                      handleSetLastRead(ayatNumber)
                    }
                    isWebKit={isWebKit}
                  />
                  {shouldRenderInfo && (
                    <div className="my-0 p-3 bg-primary/10 text-muted-foreground flex justify-between items-center">
                      <span className="flex items-center text-xs">
                        Halaman {verse.meta.page}
                      </span>
                      <span className="flex items-center text-xs">
                        Juz {verse.meta.juz}
                      </span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Navigation */}
          <SurahNavigation currentSurahNumber={surah.number} />
        </CardContent>
      </Card>
    </div>
  );
};
export default SurahDetail;
