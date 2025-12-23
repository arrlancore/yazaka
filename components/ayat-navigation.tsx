"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, List } from "lucide-react";

type AyatNavigationProps = {
  surahNumber: number;
  surahName: string;
  currentAyatNumber: number;
  totalVerses: number;
};

const AyatNavigation: React.FC<AyatNavigationProps> = ({
  surahNumber,
  surahName,
  currentAyatNumber,
  totalVerses,
}) => {
  const hasPrev = currentAyatNumber < totalVerses;
  const hasNext = currentAyatNumber > 1;

  return (
    <div className="bg-card p-4 flex justify-between items-center">
      {hasNext ? (
        <Link
          href={`/quran/surah/${surahNumber}_${surahName}/ayat/${currentAyatNumber - 1}`}
          passHref
        >
          <Button variant="outline" className="flex items-center space-x-2">
            <ChevronLeft size={16} />
            <span>Ayat {currentAyatNumber - 1}</span>
          </Button>
        </Link>
      ) : (
        <span />
      )}

      <Link href={`/quran/surah/${surahNumber}_${surahName}`} passHref>
        <Button variant="ghost" className="flex items-center space-x-2">
          <List size={16} />
          <span className="hidden sm:inline">Semua Ayat</span>
        </Button>
      </Link>

      {hasPrev ? (
        <Link
          href={`/quran/surah/${surahNumber}_${surahName}/ayat/${currentAyatNumber + 1}`}
          passHref
        >
          <Button variant="outline" className="flex items-center space-x-2">
            <span>Ayat {currentAyatNumber + 1}</span>
            <ChevronRight size={16} />
          </Button>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
};

export default AyatNavigation;
