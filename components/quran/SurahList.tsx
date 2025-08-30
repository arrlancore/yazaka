import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TapFeedback from "@/components/ui/tap-feedback";
import { typography } from "@/lib/typography";
import { iconSizes } from "@/lib/icons";

interface Surah {
  number: number;
  name: string;
  arabicName: string;
  totalVerses: number;
}

interface SurahListProps {
  surahs: Surah[];
}

const SurahList: React.FC<SurahListProps> = ({ surahs }) => {
  return (
    <Card className="border-none overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/5 via-background to-primary/5 shadow-none text-foreground rounded-none p-0 sm:border sm:shadow-sm sm:rounded-2xl">
      <CardContent className="p-0">
        <div className="bg-background">
          {surahs.map((surah) => (
            <Link
              href={`/quran/surah/${surah.number}_${encodeURIComponent(surah.name)}`}
              key={surah.number}
            >
              <TapFeedback className="flex justify-between items-center p-4 border-b border-border hover:bg-primary/5 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                    {surah.number}
                  </div>
                  <div>
                    <h2 className={typography.h5}>{surah.name}</h2>
                    <p className={typography.muted}>
                      {surah.arabicName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={typography.muted}>
                    {surah.totalVerses} Ayat
                  </span>
                  <ChevronRight size={iconSizes.sm} className="text-primary" />
                </div>
              </TapFeedback>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SurahList;
