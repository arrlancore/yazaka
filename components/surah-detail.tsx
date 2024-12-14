import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Book } from "lucide-react";
import { useEffect, useState } from "react";
import Verse from "./verse";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const dummy = {
  number: 1,
  name: "Al-Fatihah",
  arabicName: "الفاتحة",
  meaning: "The Opening",
  totalVerses: 7,
  type: "Makkiyah",
  verses: [
    {
      number: 1,
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang",
    },
    {
      number: 2,
      arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      translation: "Segala puji bagi Allah, Tuhan seluruh alam",
    },
    {
      number: 3,
      arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
      translation: "Yang Maha Pengasih, Maha Penyayang",
    },
    {
      number: 4,
      arabic: "مَالِكِ يَوْمِ الدِّينِ",
      translation: "Pemilik hari pembalasan",
    },
    {
      number: 5,
      arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      translation:
        "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan",
    },
    {
      number: 6,
      arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      translation: "Tunjukilah kami jalan yang lurus",
    },
    {
      number: 7,
      arabic:
        "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      translation:
        "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai dan bukan (pula jalan) mereka yang sesat",
    },
  ],
};
const SurahDetail = () => {
  const getSurah = () => dummy;
  const surah = getSurah();

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

          {/* Navigation right to left */}
          <div className="bg-card p-4 flex justify-between">
            <Button variant="outline" className="flex items-center space-x-2">
              <ChevronLeft size={16} />
              <span>Al Baqarah</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <span>An Nas</span>
              <ChevronRight size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default SurahDetail;
