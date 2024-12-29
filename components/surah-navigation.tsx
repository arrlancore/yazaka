"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { surahsBahasa } from "@/content/quran/metadata";

type SurahNavigationProps = {
  currentSurahNumber: number;
};

const SurahNavigation: React.FC<SurahNavigationProps> = ({
  currentSurahNumber,
}) => {
  const [prevSurah, setPrevSurah] = useState<(typeof surahsBahasa)[0] | null>(
    null
  );
  const [nextSurah, setNextSurah] = useState<(typeof surahsBahasa)[0] | null>(
    null
  );

  useEffect(() => {
    const currentIndex = surahsBahasa.findIndex(
      (s) => s.number === currentSurahNumber
    );
    if (currentIndex > 0) {
      setPrevSurah(surahsBahasa[currentIndex - 1]);
    }
    if (currentIndex < surahsBahasa.length - 1) {
      setNextSurah(surahsBahasa[currentIndex + 1]);
    }
  }, [currentSurahNumber]);

  return (
    <div className="bg-card p-4 flex justify-between">
      {nextSurah && (
        <Link
          href={`/quran/surah/${nextSurah.number}_${nextSurah.name}`}
          passHref
        >
          <Button variant="outline" className="flex items-center space-x-2">
            <ChevronLeft size={16} />
            <span>{nextSurah.name}</span>
          </Button>
        </Link>
      )}
      {prevSurah ? (
        <Link
          href={`/quran/surah/${prevSurah.number}_${prevSurah.name}`}
          passHref
        >
          <Button variant="outline" className="flex items-center space-x-2">
            <span>{prevSurah.name}</span>
            <ChevronRight size={16} />
          </Button>
        </Link>
      ) : (
        <div></div> // Empty div to maintain layout when there's no previous surah
      )}
    </div>
  );
};

export default SurahNavigation;
