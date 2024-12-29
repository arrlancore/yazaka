"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Book } from "lucide-react";
import Verse from "./verse";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SurahNavigation from "./surah-navigation";

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
    translation: string;
    transliteration: string;
  }[];
};

const SurahDetail: React.FC<SurahDetailProps> = (surah) => {
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
          <div>
            <h2 className="text-lg font-bold">{surah.name}</h2>
            <div className="text-xs opacity-80">
              {surah.arabicName} • {surah.meaning}
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
                className="text-2xl mb-2 font-arabic"
                style={{ fontFamily: "'Uthmanic Hafs', Arial" }}
              >
                {surah.preBismillah.text.arab}
              </p>
              <p className="text-xs text-muted-foreground">
                {surah.preBismillah.translation.id}
              </p>
            </div>
          )}
          {/* Verses */}
          <div className="bg-background p-4">
            {surah.verses.map((verse) => (
              <Verse
                key={verse.number}
                arabic={verse.arabic}
                translation={verse.translation}
                number={verse.number}
              />
            ))}
          </div>

          {/* Navigation */}
          <SurahNavigation currentSurahNumber={surah.number} />
        </CardContent>
      </Card>
    </div>
  );
};
export default SurahDetail;
