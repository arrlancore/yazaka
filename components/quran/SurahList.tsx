import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
    <Card className="border-none sm:border overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-none sm:shadow-lg text-foreground rounded-b-[2rem] p-0">
      <CardContent className="p-0">
        <div className="bg-background">
          {surahs.map((surah) => (
            <Link
              href={`/quran/surah/${surah.number}_${encodeURIComponent(surah.name)}`}
              key={surah.number}
            >
              <div className="flex justify-between items-center p-4 border-b border-border hover:bg-primary/5 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                    {surah.number}
                  </div>
                  <div>
                    <h2 className="font-semibold">{surah.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {surah.arabicName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {surah.totalVerses} Ayat
                  </span>
                  <ChevronRight size={16} className="text-primary" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SurahList;
