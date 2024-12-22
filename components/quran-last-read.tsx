import React from "react";
import { Book, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

const topSurah = [
  "Al-Fatihah",
  "Al-Kahf",
  "Al-Mulk",
  "Al-Waqi'ah",
  "Yasin",
  "Ar-Rahman",
];

const QuranLastRead = () => {
  return (
    <Card className="container border-none sm:border max-w-md mx-auto overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-lg text-foreground rounded-[0] sm:rounded-[2rem] p-0">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-primary">
          Bacaan Qur'an
        </CardTitle>
        <Link href="/quran">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary-foreground hover:bg-primary"
          >
            Lihat Semua <ChevronRight size={16} className="ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-primary/5 transition-all duration-300">
          <div className="flex items-center space-x-3">
            <Book className="text-primary" size={20} />
            <div>
              <div className="font-semibold">Al Maidah</div>
              <div className="text-xs text-muted-foreground">Ayat 54</div>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Lanjut
          </Button>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Surat pilihan:
          </h3>
          <div className="flex flex-wrap gap-2">
            {topSurah.map((surah, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={cn(
                  "cursor-pointer transition-all duration-300",
                  "bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900",
                  "border border-gray-200 dark:border-gray-700",
                  "shadow-sm hover:shadow",
                  "hover:bg-gradient-to-tl hover:from-gray-100 hover:to-white",
                  "dark:hover:from-gray-900 dark:hover:to-gray-800",
                  "text-gray-800 dark:text-gray-200",
                  "hover:text-primary dark:hover:text-primary-foreground",
                  "text-xs font-medium"
                )}
              >
                {surah}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuranLastRead;
